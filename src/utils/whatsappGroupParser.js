import { trNormalize } from './bankStatementParser';

export function parseWhatsAppGroupText(rawText, residents = []) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const phoneMap = [];
  const updatedResidents = residents.map(r => ({ ...r }));

  // Regular expression to match Turkish phone numbers
  // Matches +90 532 123 45 67, 0532 123 45 67, 5321234567, +905321234567, 0 532 123 4567
  const phoneRegex = /(?:\+90|90|0)?\s*([5][0-9]{2})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})/g;

  // Extract all phone numbers and associated names
  let match;
  while ((match = phoneRegex.exec(rawText)) !== null) {
    const fullMatchedStr = match[0];
    const cleanPhone = '5' + match[1].substring(1) + match[2] + match[3] + match[4];
    
    // Find nearby text context around the phone number
    const startIdx = Math.max(0, match.index - 50);
    const endIdx = Math.min(rawText.length, match.index + match[0].length + 50);
    const contextText = rawText.substring(startIdx, endIdx);

    phoneMap.push({
      cleanPhone: '0' + cleanPhone,
      waPhone: '90' + cleanPhone,
      rawPhoneStr: fullMatchedStr,
      contextText
    });
  }

  // Attempt matching each line or phone number to residents
  lines.forEach(line => {
    const lineNorm = trNormalize(line);
    const foundPhones = [];
    let pMatch;
    const lineRegex = /(?:\+90|90|0)?\s*([5][0-9]{2})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})/g;
    while ((pMatch = lineRegex.exec(line)) !== null) {
      const cleanP = '05' + pMatch[1].substring(1) + pMatch[2] + pMatch[3] + pMatch[4];
      foundPhones.push(cleanP);
    }

    if (foundPhones.length > 0) {
      const phone = foundPhones[0];
      // Try finding resident name in line
      for (const res of updatedResidents) {
        const names = [res.name, res.ownerName, res.tenantName, ...(res.aliases || [])].filter(Boolean);
        for (const name of names) {
          const normName = trNormalize(name);
          if (normName.length >= 3 && lineNorm.includes(normName)) {
            res.phone = phone;
            res.whatsappGroupMember = true;
            break;
          }
        }
      }
    }
  });

  // Second pass: Match extracted phones by context
  phoneMap.forEach(item => {
    const ctxNorm = trNormalize(item.contextText);
    for (const res of updatedResidents) {
      if (res.phone && res.phone.length >= 10) continue; // Already matched

      const names = [res.name, res.ownerName, res.tenantName, ...(res.aliases || [])].filter(Boolean);
      for (const name of names) {
        const normName = trNormalize(name);
        if (normName.length >= 3 && ctxNorm.includes(normName)) {
          res.phone = item.cleanPhone;
          res.whatsappGroupMember = true;
          break;
        }
      }
    }
  });

  return {
    updatedResidents,
    extractedPhoneCount: phoneMap.length
  };
}

export function generateVCardExport(residents) {
  let vcard = '';
  residents.forEach(r => {
    if (!r.phone) return;
    let cleanPhone = r.phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
    
    vcard += `BEGIN:VCARD\nVERSION:3.0\nN:${r.name};;;;\nFN:${r.name} (${r.block} ${r.flatNo})\nTEL;TYPE=CELL:+${cleanPhone}\nNOTE:Umut Sitesi ${r.block} ${r.flatNo}\nEND:VCARD\n`;
  });
  return vcard;
}
