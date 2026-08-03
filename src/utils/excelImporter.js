import * as XLSX from 'xlsx';

export function parseSiteManagementExcel(workbook) {
  const residentsMap = {};
  const expensesList = [];
  const feeCategoriesMap = {
    aidat: { id: 'aidat', name: 'Aylık Aidat', defaultAmount: 2250, period: 'Aylık', color: '#6366f1' },
    kidem: { id: 'kidem', name: 'Kıdem Tazminatı Fonu', defaultAmount: 437.5, period: 'Aylık', color: '#f59e0b' },
    yuruyus: { id: 'yuruyus', name: 'Yürüyüş Yolu Tadilatı', defaultAmount: 1100, period: 'Tek Seferlik', color: '#10b981' },
    asansor: { id: 'asansor', name: 'Asansör Revizyonu', defaultAmount: 2000, period: 'Tek Seferlik', color: '#ec4899' },
  };

  const sheetNames = workbook.SheetNames;
  const MONTHS = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];

  // 1. Parse Bağımsız Bölüm Listesi
  const bgSheetName = sheetNames.find(s => s.toLowerCase().includes('bağımsız bölüm') || s.toLowerCase().includes('daire listesi'));
  if (bgSheetName) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[bgSheetName], { header: 1 }).slice(1);
    rows.forEach(r => {
      if (!r[0] || !r[1]) return;
      const blockLetter = String(r[0]).trim().toUpperCase();
      const num = parseInt(r[1]);
      if (isNaN(num)) return;
      
      const key = `${blockLetter}-${num}`;
      const flatNo = `${blockLetter}-${num < 10 ? '0' + num : num}`;
      const owner = r[2] ? String(r[2]).trim() : '';
      const tenant = r[3] && String(r[3]).trim() !== '-' ? String(r[3]).trim() : '';
      const name = tenant || owner || `Daire ${flatNo}`;

      residentsMap[key] = {
        id: Object.keys(residentsMap).length + 1,
        key,
        block: `${blockLetter} Blok`,
        flatNo,
        number: num,
        name,
        type: tenant ? 'Kiracı' : 'Ev Sahibi',
        ownerName: owner,
        tenantName: tenant,
        phone: r[4] ? String(r[4]).trim() : '',
        duesAmount: parseFloat(r[5]) || 2250,
        ibans: [],
        aliases: [name, owner, tenant].filter(Boolean),
        debts: { aidat: 0, kidem: 0, yuruyus: 0, asansor: 0 },
        payments: { aidat: 0, kidem: 0, yuruyus: 0 },
        monthlyAidat: {},
        monthlyKidem: {},
        priorDebt2025: 0,
        unpaidMonths: 0,
        notes: r[6] ? `Durum: ${r[6]}` : ''
      };
    });
  }

  const ensureResident = (blockLetter, num, fallbackName) => {
    const key = `${blockLetter}-${num}`;
    if (!residentsMap[key]) {
      const flatNo = `${blockLetter}-${num < 10 ? '0' + num : num}`;
      residentsMap[key] = {
        id: Object.keys(residentsMap).length + 1,
        key,
        block: `${blockLetter} Blok`,
        flatNo,
        number: num,
        name: fallbackName || `Daire ${flatNo}`,
        type: 'Ev Sahibi',
        ownerName: fallbackName,
        tenantName: '',
        phone: '',
        duesAmount: 2250,
        ibans: [],
        aliases: [fallbackName].filter(Boolean),
        debts: { aidat: 0, kidem: 0, yuruyus: 0, asansor: 0 },
        payments: { aidat: 0, kidem: 0, yuruyus: 0 },
        monthlyAidat: {},
        monthlyKidem: {},
        priorDebt2025: 0,
        unpaidMonths: 0,
        notes: ''
      };
    }
    return residentsMap[key];
  };

  // 2. Parse Aidat Tahakkuk sheets with monthly columns
  const aidatSheets = sheetNames.filter(s => s.toLowerCase().includes('aidat tahakkuk') || s.toLowerCase().includes('aidat'));
  aidatSheets.forEach(sName => {
    const blockLetter = sName.toUpperCase().includes('B BLOK') ? 'B' : 'A';
    const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sName], { header: 1 });
    if (rawRows.length < 2) return;
    
    const headerRow = rawRows[0].map(c => String(c || '').trim().toUpperCase());
    const dataRows = rawRows.slice(1);

    dataRows.forEach(r => {
      if (!r[0] || isNaN(parseInt(r[0]))) return;
      const num = parseInt(r[0]);
      const resName = r[1] ? String(r[1]).trim() : '';
      const res = ensureResident(blockLetter, num, resName);
      if (resName && !res.aliases.includes(resName)) res.aliases.push(resName);

      // Prior debt 2025
      const priorDebtColIdx = headerRow.findIndex(h => h.includes('2025') || h.includes('DEVRİ'));
      if (priorDebtColIdx !== -1 && r[priorDebtColIdx]) {
        res.priorDebt2025 = parseFloat(r[priorDebtColIdx]) || 0;
      }

      // Read month by month payments
      MONTHS.forEach(m => {
        const colIdx = headerRow.indexOf(m);
        if (colIdx !== -1 && r[colIdx] !== undefined && r[colIdx] !== null && r[colIdx] !== '') {
          const val = parseFloat(r[colIdx]);
          if (!isNaN(val)) res.monthlyAidat[m] = val;
        }
      });

      const totalPaid = parseFloat(r[r.length - 1]) || parseFloat(r[15]) || Object.values(res.monthlyAidat).reduce((a, b) => a + b, 0);
      res.payments.aidat = totalPaid;
      
      const monthlyDues = res.duesAmount || 2250;
      const expectedAidat = 7 * monthlyDues + res.priorDebt2025; // 7 months up to August
      const debtAidat = Math.max(0, expectedAidat - totalPaid);
      res.debts.aidat = debtAidat;
      res.unpaidMonths = Math.ceil(debtAidat / monthlyDues);
    });
  });

  // 3. Parse Kıdem Tazminatı sheets with monthly breakdown
  const kidemSheets = sheetNames.filter(s => s.toLowerCase().includes('kıdem'));
  kidemSheets.forEach(sName => {
    const blockLetter = sName.toUpperCase().includes('B BLOK') ? 'B' : 'A';
    const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sName], { header: 1 });
    if (rawRows.length < 2) return;

    const headerRow = rawRows[0].map(c => String(c || '').trim().toUpperCase());
    const dataRows = rawRows.slice(1);

    dataRows.forEach(r => {
      if (!r[0] || isNaN(parseInt(r[0]))) return;
      const num = parseInt(r[0]);
      const resName = r[1] ? String(r[1]).trim() : '';
      const res = ensureResident(blockLetter, num, resName);

      MONTHS.forEach(m => {
        const colIdx = headerRow.indexOf(m);
        if (colIdx !== -1 && r[colIdx] !== undefined && r[colIdx] !== null && r[colIdx] !== '') {
          const val = parseFloat(r[colIdx]);
          if (!isNaN(val)) res.monthlyKidem[m] = val;
        }
      });

      const totalPaidKidem = parseFloat(r[r.length - 1]) || Object.values(res.monthlyKidem).reduce((a, b) => a + b, 0);
      res.payments.kidem = totalPaidKidem;
      const expectedKidem = 5250;
      res.debts.kidem = Math.max(0, expectedKidem - totalPaidKidem);
    });
  });

  // 4. Parse Yürüyüş Yolu sheets
  const yuruyusSheets = sheetNames.filter(s => s.toLowerCase().includes('yürüyüş'));
  yuruyusSheets.forEach(sName => {
    const blockLetter = sName.toUpperCase().includes('B BLOK') ? 'B' : 'A';
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sName], { header: 1 }).slice(1);
    rows.forEach(r => {
      if (!r[0] || isNaN(parseInt(r[0]))) return;
      const num = parseInt(r[0]);
      const resName = r[1] ? String(r[1]).trim() : '';
      const res = ensureResident(blockLetter, num, resName);

      const totalPaidYuruyus = parseFloat(r[r.length - 1]) || 0;
      res.payments.yuruyus = totalPaidYuruyus;
      const expectedYuruyus = 1100;
      res.debts.yuruyus = Math.max(0, expectedYuruyus - totalPaidYuruyus);
    });
  });

  // 5. Parse Gider Takip if available
  const giderSheetName = sheetNames.find(s => s.toLowerCase().includes('gider takip') || s.toLowerCase().includes('giderler'));
  if (giderSheetName) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[giderSheetName], { header: 1 }).slice(1);
    rows.forEach((r, idx) => {
      if (r[0] || r[1] || r[4]) {
        expensesList.push({
          id: `EXP-${idx + 1}`,
          date: r[0] || new Date().toISOString().split('T')[0],
          category: r[1] || 'Genel Gider',
          description: r[2] || '',
          scope: r[3] || 'Ortak',
          amount: parseFloat(r[4]) || 0,
          paymentType: r[5] || 'Banka',
          receiptNo: r[6] || ''
        });
      }
    });
  }

  const residentList = Object.values(residentsMap).sort((a, b) => {
    if (a.block !== b.block) return a.block.localeCompare(b.block);
    return a.number - b.number;
  });

  return {
    residents: residentList,
    expenses: expensesList,
    feeCategories: Object.values(feeCategoriesMap)
  };
}
