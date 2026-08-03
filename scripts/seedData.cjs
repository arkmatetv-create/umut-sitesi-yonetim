const XLSX = require('xlsx');
const fs = require('fs');
const { parseSiteManagementExcel } = require('../src/utils/excelImporter.js');

const wbSite = XLSX.readFile('/Users/arkinyegul/Downloads/Profesyonel_Site_Yonetim_Takip.xlsx');
const parsedSite = parseSiteManagementExcel(wbSite);

const fileContent = `export const INITIAL_FEE_CATEGORIES = ${JSON.stringify(parsedSite.feeCategories, null, 2)};

export const INITIAL_RESIDENTS = ${JSON.stringify(parsedSite.residents, null, 2)};

export const INITIAL_EXPENSES = ${JSON.stringify(parsedSite.expenses || [], null, 2)};

export const INITIAL_BANK_TRANSACTIONS = [
  {
    id: 'TXN-SAMPLE-1',
    date: '2026-08-01',
    senderName: 'ÖRNEK HAVALE',
    description: 'B 13 AİDAT ÖDEMESİ',
    amount: 2250,
    iban: 'TR140006200044600006289465',
    status: 'unmatched',
    suggestedResidentId: 34,
    matchedCategory: 'aidat',
    matchConfidence: 'high',
    matchedReason: 'B-13 daire açıklaması ile eşleşti'
  }
];

export const INITIAL_MESSAGE_TEMPLATES = [
  {
    id: 'gecikmeli_aidat',
    title: 'Aylık Aidat Hatırlatması',
    template: 'Sayın {Sakin_Adı} ({Daire_No}), site yönetimi olarak bilgilendiriyoruz. Hesabınızda {Aidat_Borcu} TL gecikmiş aidat borcunuz bulunmaktadır. Ödemenizi rica ederiz.'
  },
  {
    id: 'kidem_fonu',
    title: 'Kıdem Tazminatı Fonu Ödemesi',
    template: 'Sayın {Sakin_Adı} ({Daire_No}), Kıdem Tazminatı Fonu için kalan borcunuz {Kıdem_Borcu} TL dur. Ödeme yapmanızı rica ederiz.'
  },
  {
    id: 'yuruyus_yolu',
    title: 'Yürüyüş Yolu Tadilat Ödemesi',
    template: 'Sayın {Sakin_Adı} ({Daire_No}), Yürüyüş Yolu Tadilatı için kalan borcunuz {Yürüyüş_Borcu} TL dur. Ödeme yapmanızı rica ederiz.'
  },
  {
    id: 'genel_toplam',
    title: 'Ayrıntılı Toplam Borç Dökümü',
    template: 'Sayın {Sakin_Adı} ({Daire_No}), toplam borcunuz {Borç_Tutarı} TL dir. (Aidat: {Aidat_Borcu} TL | Kıdem Tazminatı: {Kıdem_Borcu} TL | Yürüyüş Yolu: {Yürüyüş_Borcu} TL).'
  }
];
`;

fs.writeFileSync('./src/data/mockData.js', fileContent);
console.log('Successfully re-seeded mockData.js strictly from master Excel table!');
