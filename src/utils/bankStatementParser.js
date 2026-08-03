import * as XLSX from 'xlsx';

export function parseBankStatementExcel(workbook, residents = []) {
  const transactions = [];
  const autoExpenses = [];

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Find header row containing 'Tarih'
  const headerIdx = rawRows.findIndex(r => r && Array.isArray(r) && r.some(c => String(c).trim() === 'Tarih'));
  if (headerIdx === -1) {
    throw new Error("Banka ekstresinde 'Tarih' başlık satırı bulunamadı.");
  }

  const headerRow = rawRows[headerIdx].map(c => String(c || '').trim());
  const dateColIdx = headerRow.findIndex(h => h === 'Tarih');
  const descColIdx = headerRow.findIndex(h => h === 'Açıklama');
  const amountColIdx = headerRow.findIndex(h => h === 'Tutar');
  const receiptColIdx = headerRow.findIndex(h => h.includes('Dekont') || h.includes('No'));

  const dataRows = rawRows.slice(headerIdx + 1);

  dataRows.forEach((r, index) => {
    if (!r || r.length < 3 || !r[dateColIdx]) return;

    const rawDate = String(r[dateColIdx]).trim();
    const description = String(r[descColIdx] || '').trim();
    const amount = parseFloat(r[amountColIdx]) || 0;
    const receiptNo = receiptColIdx !== -1 && r[receiptColIdx] ? String(r[receiptColIdx]).trim() : `TXN-${index + 1}`;

    if (!description && amount === 0) return;

    // Convert date format DD/MM/YYYY to YYYY-MM-DD
    let formattedDate = rawDate;
    if (rawDate.includes('/')) {
      const parts = rawDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    const normDesc = trNormalize(description);

    // Filter out internal bank fund sales and account transfers
    if (normDesc.includes('fon satis') || normDesc.includes('para piyasa') || normDesc.includes('hesaplar arasi') || normDesc.includes('bankalar arasi') || normDesc.includes('commercial bank')) {
      return;
    }

    // 1. Handle Outgoing Expense (Amount < 0)
    if (amount < 0) {
      const positiveAmount = Math.abs(amount);
      autoExpenses.push({
        id: `EXP-AUTO-${receiptNo || index}`,
        date: formattedDate,
        category: detectExpenseCategory(description),
        description: description,
        scope: 'Ortak',
        amount: positiveAmount,
        paymentType: 'Banka',
        receiptNo: receiptNo
      });
      return;
    }

    // 2. Handle Incoming Payment (Amount > 0)
    const category = detectPaymentCategory(description);
    const match = matchResidentForTransaction(description, amount, residents);

    transactions.push({
      id: receiptNo || `TXN-${formattedDate}-${index}`,
      date: formattedDate,
      senderName: match.extractedSender || extractSenderName(description),
      description: description,
      amount: amount,
      iban: '',
      status: match.resident ? 'matched' : 'unmatched',
      matchedResidentId: match.resident ? match.resident.id : null,
      suggestedResidentId: match.suggestedResident ? match.suggestedResident.id : null,
      matchedCategory: category,
      matchConfidence: match.confidence, // 'high', 'medium', 'low', 'none'
      matchedReason: match.reason
    });
  });

  return {
    transactions,
    autoExpenses
  };
}

export function trNormalize(str) {
  return String(str || '')
    .replace(/İ/g, 'I').replace(/I/g, 'i').replace(/ı/g, 'i')
    .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U').replace(/ü/g, 'u')
    .replace(/Ş/g, 'S').replace(/ş/g, 's')
    .replace(/Ö/g, 'O').replace(/ö/g, 'o')
    .replace(/Ç/g, 'C').replace(/ç/g, 'c')
    .toLowerCase();
}

function detectPaymentCategory(desc) {
  const d = trNormalize(desc);
  if (d.includes('kidem') || d.includes('tazminat')) return 'kidem';
  if (d.includes('yuruyus') || d.includes('yol') || d.includes('tadilat')) return 'yuruyus';
  if (d.includes('asansor')) return 'asansor';
  return 'aidat';
}

function detectExpenseCategory(desc) {
  const d = trNormalize(desc);
  if (d.includes('asansor')) return 'Asansör Bakım';
  if (d.includes('hirdavat') || d.includes('malzeme') || d.includes('satis')) return 'Yürüyüş Yolu Malzeme';
  if (d.includes('elektrik') || d.includes('ck akdeniz') || d.includes('enerji')) return 'Ortak Elektrik Faturası';
  if (d.includes('bahce') || d.includes('cim') || d.includes('peyzaj')) return 'Bahçe Bakımı & Sulama';
  if (d.includes('temizlik')) return 'Temizlik ve Çöp Temizlik';
  if (d.includes('kidem')) return 'Kıdem Tazminatı Ödemesi';
  return 'Diğer Harcama';
}

function extractSenderName(desc) {
  if (desc.includes('-')) {
    const firstPart = desc.split('-')[0].trim();
    if (firstPart.length > 2 && !firstPart.toUpperCase().startsWith('SATIŞ')) {
      return firstPart;
    }
  }
  return desc.substring(0, 30);
}

function matchResidentForTransaction(desc, amount, residents) {
  const normDesc = trNormalize(desc);
  const senderName = extractSenderName(desc);

  // 1. Direct Name & Alias & Surname Word Matching (High confidence)
  for (const res of residents) {
    const allTokens = [
      res.name,
      res.ownerName,
      res.tenantName,
      ...(res.aliases || [])
    ].filter(Boolean);

    for (const rawToken of allTokens) {
      const normToken = trNormalize(rawToken);
      if (normToken.length >= 3 && normDesc.includes(normToken)) {
        return {
          resident: res,
          confidence: 'high',
          extractedSender: senderName,
          reason: `Açıklamadaki '${rawToken}' ismi/takma adı ${res.block} ${res.flatNo} ile eşleşti.`
        };
      }

      // Check surname or individual words (length >= 4)
      const words = normToken.split(/\s+/).filter(w => w.length >= 4);
      for (const w of words) {
        if (normDesc.includes(w)) {
          return {
            resident: res,
            confidence: 'high',
            extractedSender: senderName,
            reason: `Açıklamadaki '${w}' kelimesi/soyismi ${res.block} ${res.flatNo} (${res.name}) ile eşleşti.`
          };
        }
      }
    }
  }

  // 2. Block & Flat Number Regex Patterns (Medium confidence)
  for (const res of residents) {
    const num = res.number;
    const bLetter = res.block.startsWith('A') ? 'a' : 'b';

    const regexes = [
      new RegExp(`\\b${bLetter}[-/ ]*0*${num}\\b`),
      new RegExp(`\\b${bLetter}[-/ ]*blok[-/ ]*(daire|da|d)?[-/ ]*0*${num}\\b`),
      new RegExp(`\\b(daire|da|d)[-/ :]*0*${num}\\b`),
      new RegExp(`\\bda\\.\\s*0*${num}\\b`)
    ];

    for (const reg of regexes) {
      if (reg.test(normDesc)) {
        return {
          resident: res,
          confidence: 'medium',
          extractedSender: senderName,
          reason: `Açıklamadaki daire numarası deseni ${res.block} ${res.flatNo} ile eşleşti.`
        };
      }
    }
  }

  // 3. Partial Suggestion (Low confidence)
  for (const res of residents) {
    const surname = res.name.split(' ').pop();
    if (surname && surname.length >= 3) {
      const normSurname = trNormalize(surname);
      if (normDesc.includes(normSurname)) {
        return {
          resident: null,
          suggestedResident: res,
          confidence: 'low',
          extractedSender: senderName,
          reason: `'${surname}' soyismi tespit edildi, ${res.block} ${res.flatNo} (${res.name}) önerildi.`
        };
      }
    }
  }

  return {
    resident: null,
    suggestedResident: null,
    confidence: 'none',
    extractedSender: senderName,
    reason: 'Açıklamada eşleşen sakin veya daire bilgisi tespit edilemedi.'
  };
}
