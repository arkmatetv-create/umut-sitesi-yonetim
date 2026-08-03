const XLSX = require('xlsx');
const fs = require('fs');
const { parseSiteManagementExcel } = require('../src/utils/excelImporter.js');

const wb = XLSX.readFile('/Users/arkinyegul/Downloads/Profesyonel_Site_Yonetim_Takip.xlsx');
const parsed = parseSiteManagementExcel(wb);

const fileContent = `export const INITIAL_FEE_CATEGORIES = ${JSON.stringify(parsed.feeCategories, null, 2)};

export const INITIAL_RESIDENTS = ${JSON.stringify(parsed.residents, null, 2)};

export const INITIAL_BANK_TRANSACTIONS = [
  {
    id: 'TXN-101',
    date: '2026-08-01',
    senderName: 'M. Arkın YEGÜL',
    description: 'B 07 AIDAT AGUSTOS',
    amount: 1500,
    iban: 'TR123456789012345678901207',
    status: 'matched',
    matchedResidentId: 35,
    matchedCategory: 'aidat',
    matchConfidence: 'high',
    matchedReason: 'Daire No (B 07) ve isim tam eşleşti.'
  },
  {
    id: 'TXN-102',
    date: '2026-08-02',
    senderName: 'YEMEZ TİCARET LTD ŞTİ',
    description: 'YILDIZ YALÇIN HAVALE',
    amount: 2250,
    iban: 'TR987654321098765432109807',
    status: 'unmatched',
    suggestedResidentId: 7,
    matchedCategory: 'aidat',
    matchConfidence: 'medium',
    matchedReason: 'Açıklamadaki Yıldız Yalçın ismi ile A-07 dairesi önerildi.'
  },
  {
    id: 'TXN-103',
    date: '2026-08-02',
    senderName: 'GÜVEN MİMARLIK A.Ş.',
    description: 'KIDEM TAZMİNATI ÖDEMESİ',
    amount: 437.5,
    iban: 'TR554433221100998877665544',
    status: 'unmatched',
    suggestedResidentId: 10,
    matchedCategory: 'kidem',
    matchConfidence: 'low',
    matchedReason: 'Eşleşen sakin bulunamadı. Lütfen sakini manuel atayın.'
  }
];

export const DEFAULT_WHATSAPP_TEMPLATES = [
  {
    id: 'gecikmeli_aidat',
    title: 'Gecikmiş Aidat Hatırlatması',
    template: 'Sayın {Sakin_Adı} ({Daire_No}), site yönetimi olarak bilgilendiriyoruz. Hesabınızda {Geciken_Ay_Sayısı} aylık aidat gecikmesi ({Borç_Tutarı} TL) bulunmaktadır. Ödemenizi rica ederiz.'
  },
  {
    id: 'kidem_fonu',
    title: 'Kıdem Tazminatı Fonu Ödemesi',
    template: 'Sayın {Sakin_Adı} ({Daire_No}), Kıdem Tazminatı Fonu için Kalan borcunuz {Ek_Borç_Tutarı} TL dür. Ödeme yapmanızı rica ederiz.'
  },
  {
    id: 'genel_toplam',
    title: 'Toplam Borç Dökümü',
    template: 'Sayın {Sakin_Adı} ({Daire_No}), toplam borç bakiyeniz {Borç_Tutarı} TL (Aidat: {Aidat_Borcu} TL, Ek Ödemeler: {Ek_Borç_Tutarı} TL). Detaylar için yönetimle iletişime geçebilirsiniz.'
  }
];
`;

fs.writeFileSync('./src/data/mockData.js', fileContent);
console.log('Successfully updated mockData.js with real 41-resident data!');
