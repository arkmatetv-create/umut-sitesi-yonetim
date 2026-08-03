export const INITIAL_FEE_CATEGORIES = [
  {
    "id": "aidat",
    "name": "Aylık Aidat",
    "defaultAmount": 2250,
    "period": "Aylık",
    "color": "#6366f1"
  },
  {
    "id": "kidem",
    "name": "Kıdem Tazminatı Fonu",
    "defaultAmount": 437.5,
    "period": "Aylık",
    "color": "#f59e0b"
  },
  {
    "id": "yuruyus",
    "name": "Yürüyüş Yolu Tadilatı",
    "defaultAmount": 1100,
    "period": "Tek Seferlik",
    "color": "#10b981"
  }
];

export const INITIAL_RESIDENTS = [
  {
    "id": 1,
    "key": "A-1",
    "block": "A Blok",
    "flatNo": "A-01",
    "number": 1,
    "name": "Nilgün KILIÇ",
    "type": "Ev Sahibi",
    "ownerName": "Nilgün KILIÇ",
    "tenantName": "",
    "phone": "+90 536 685 72 99",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Nilgün KILIÇ",
      "Nilgün KILIÇ"
    ],
    "debts": {
      "aidat": 15750,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 0,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {},
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 7,
    "notes": "Durum: Dolu"
  },
  {
    "id": 2,
    "key": "A-2",
    "block": "A Blok",
    "flatNo": "A-02",
    "number": 2,
    "name": "Osman ÇEVİK",
    "type": "Ev Sahibi",
    "ownerName": "Osman ÇEVİK",
    "tenantName": "",
    "phone": "+90 538 619 53 73",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Osman ÇEVİK",
      "Osman ÇEVİK"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 2325,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15750,
      "kidem": 2925,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 390,
      "NİSAN": 390,
      "MAYIS": 490,
      "HAZİRAN": 390,
      "TEMMUZ": 390
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 3,
    "key": "A-3",
    "block": "A Blok",
    "flatNo": "A-03",
    "number": 3,
    "name": "Erdal TUZLUCA",
    "type": "Ev Sahibi",
    "ownerName": "Erdal TUZLUCA",
    "tenantName": "",
    "phone": "+90 554 541 97 76",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Erdal TUZLUCA",
      "Erdal TUZLUCA"
    ],
    "debts": {
      "aidat": 6750,
      "kidem": 5250,
      "yuruyus": 550,
      "asansor": 0
    },
    "payments": {
      "aidat": 9000,
      "kidem": 0,
      "yuruyus": 550
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 3,
    "notes": "Durum: Dolu"
  },
  {
    "id": 4,
    "key": "A-4",
    "block": "A Blok",
    "flatNo": "A-04",
    "number": 4,
    "name": "IRINA DEMIDENKO",
    "type": "Kiracı",
    "ownerName": "IGOR ROMANENKO",
    "tenantName": "IRINA DEMIDENKO",
    "phone": "+79138208227",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "IRINA DEMIDENKO",
      "IGOR ROMANENKO",
      "IRINA DEMIDENKO"
    ],
    "debts": {
      "aidat": 2250,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 13500,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 5,
    "key": "A-5",
    "block": "A Blok",
    "flatNo": "A-05",
    "number": 5,
    "name": "Müfit CANER",
    "type": "Ev Sahibi",
    "ownerName": "Müfit CANER",
    "tenantName": "",
    "phone": "+90 532 426 32 47",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Müfit CANER",
      "Müfit CANER"
    ],
    "debts": {
      "aidat": 5000,
      "kidem": 5250,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 10750,
      "kidem": 0,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 3,
    "notes": "Durum: Dolu"
  },
  {
    "id": 6,
    "key": "A-6",
    "block": "A Blok",
    "flatNo": "A-06",
    "number": 6,
    "name": "Tayfun KARABULUT",
    "type": "Ev Sahibi",
    "ownerName": "Tayfun KARABULUT",
    "tenantName": "",
    "phone": "+90 530 459 49 99",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Tayfun KARABULUT",
      "Tayfun KARABULUT"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 4750,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15750,
      "kidem": 500,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "NİSAN": 500
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 7,
    "key": "A-7",
    "block": "A Blok",
    "flatNo": "A-07",
    "number": 7,
    "name": "Yıldız YALÇIN YEMEZ",
    "type": "Ev Sahibi",
    "ownerName": "Yıldız YALÇIN YEMEZ",
    "tenantName": "",
    "phone": "+90 505 294 65 08",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Yıldız YALÇIN YEMEZ",
      "Yıldız YALÇIN YEMEZ"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 0,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 5250,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 8,
    "key": "A-8",
    "block": "A Blok",
    "flatNo": "A-08",
    "number": 8,
    "name": "Özkan KOŞAY",
    "type": "Ev Sahibi",
    "ownerName": "Özkan KOŞAY",
    "tenantName": "",
    "phone": "+90 506 203 40 40",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Özkan KOŞAY",
      "Özkan KOŞAY"
    ],
    "debts": {
      "aidat": 5000,
      "kidem": 0,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 10750,
      "kidem": 5250,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250
    },
    "monthlyKidem": {
      "OCAK": 1750,
      "MART": 1750,
      "NİSAN": 1750
    },
    "priorDebt2025": 0,
    "unpaidMonths": 3,
    "notes": "Durum: Dolu"
  },
  {
    "id": 9,
    "key": "A-9",
    "block": "A Blok",
    "flatNo": "A-09",
    "number": 9,
    "name": "Halil ŞEPİTÇİ",
    "type": "Ev Sahibi",
    "ownerName": "Halil ŞEPİTÇİ",
    "tenantName": "",
    "phone": "+90 532 512 61 96",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Halil ŞEPİTÇİ",
      "Halil ŞEPİTÇİ"
    ],
    "debts": {
      "aidat": 6750,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 9000,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 3,
    "notes": "Durum: Dolu"
  },
  {
    "id": 10,
    "key": "A-10",
    "block": "A Blok",
    "flatNo": "A-10",
    "number": 10,
    "name": "Ümit AKKAYA",
    "type": "Ev Sahibi",
    "ownerName": "Ümit AKKAYA",
    "tenantName": "",
    "phone": "+90 535 559 33 43",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Ümit AKKAYA",
      "Ümit AKKAYA"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 0,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15750,
      "kidem": 5250,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 11,
    "key": "A-11",
    "block": "A Blok",
    "flatNo": "A-11",
    "number": 11,
    "name": "Fatma BAYRAKTAR",
    "type": "Ev Sahibi",
    "ownerName": "Fatma BAYRAKTAR",
    "tenantName": "",
    "phone": "+90 532 670 84 42",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Fatma BAYRAKTAR",
      "Fatma BAYRAKTAR"
    ],
    "debts": {
      "aidat": 7250,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 8500,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "HAZİRAN": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 4,
    "notes": "Durum: Dolu"
  },
  {
    "id": 12,
    "key": "A-12",
    "block": "A Blok",
    "flatNo": "A-12",
    "number": 12,
    "name": "Arda AYDOST",
    "type": "Kiracı",
    "ownerName": "Arda AYDOST",
    "tenantName": "Arda AYDOST",
    "phone": "+90 554 303 98 11",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Arda AYDOST",
      "Arda AYDOST",
      "Arda AYDOST"
    ],
    "debts": {
      "aidat": 4500,
      "kidem": 4050,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 11250,
      "kidem": 1200,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250
    },
    "monthlyKidem": {
      "OCAK": 1200
    },
    "priorDebt2025": 0,
    "unpaidMonths": 2,
    "notes": "Durum: Dolu"
  },
  {
    "id": 13,
    "key": "A-13",
    "block": "A Blok",
    "flatNo": "A-13",
    "number": 13,
    "name": "Rıza KAPLAN",
    "type": "Ev Sahibi",
    "ownerName": "Rıza KAPLAN",
    "tenantName": "",
    "phone": "+90 505 473 62 99",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Rıza KAPLAN",
      "Rıza KAPLAN",
      "Kemal ÜŞENMEZ"
    ],
    "debts": {
      "aidat": 2250,
      "kidem": 2625,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 13500,
      "kidem": 2625,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 14,
    "key": "A-14",
    "block": "A Blok",
    "flatNo": "A-14",
    "number": 14,
    "name": "Ekin TUNÇBİLEK",
    "type": "Ev Sahibi",
    "ownerName": "Ekin TUNÇBİLEK",
    "tenantName": "",
    "phone": "+90 530 040 79 07",
    "duesAmount": 1500,
    "ibans": [],
    "aliases": [
      "Ekin TUNÇBİLEK",
      "Ekin TUNÇBİLEK"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 10500,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1500,
      "ŞUBAT": 1500,
      "MART": 1500,
      "NİSAN": 1500,
      "MAYIS": 1500,
      "HAZİRAN": 1500,
      "TEMMUZ": 1500
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 15,
    "key": "A-15",
    "block": "A Blok",
    "flatNo": "A-15",
    "number": 15,
    "name": "Ayşe ÜSTÜN",
    "type": "Kiracı",
    "ownerName": "Nurten İNCE",
    "tenantName": "Ayşe ÜSTÜN",
    "phone": "+90 532 767 66 08",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Ayşe ÜSTÜN",
      "Nurten İNCE",
      "Ayşe ÜSTÜN"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 0,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 5250,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 16,
    "key": "A-16",
    "block": "A Blok",
    "flatNo": "A-16",
    "number": 16,
    "name": "Aslı ERTUĞ",
    "type": "Ev Sahibi",
    "ownerName": "Aslı ERTUĞ",
    "tenantName": "",
    "phone": "+90 533 666 75 19",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Aslı ERTUĞ",
      "Aslı ERTUĞ"
    ],
    "debts": {
      "aidat": 1750,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15750,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 1750,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 17,
    "key": "A-17",
    "block": "A Blok",
    "flatNo": "A-17",
    "number": 17,
    "name": "Ali ÖZCAN",
    "type": "Ev Sahibi",
    "ownerName": "Ali ÖZCAN",
    "tenantName": "",
    "phone": "+90 532 400 07 20",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Ali ÖZCAN",
      "Ali ÖZCAN"
    ],
    "debts": {
      "aidat": 2250,
      "kidem": 5250,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 13500,
      "kidem": 0,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 18,
    "key": "A-18",
    "block": "A Blok",
    "flatNo": "A-18",
    "number": 18,
    "name": "Hüseyin ÇETİN",
    "type": "Ev Sahibi",
    "ownerName": "Hüseyin ÇETİN",
    "tenantName": "",
    "phone": "+90 535 514 02 87",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Hüseyin ÇETİN",
      "Hüseyin ÇETİN"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 2187.5,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 3062.5,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 19,
    "key": "A-19",
    "block": "A Blok",
    "flatNo": "A-19",
    "number": 19,
    "name": "Sebahat Çınar",
    "type": "Kiracı",
    "ownerName": "İlhan ÇINAR",
    "tenantName": "Sebahat Çınar",
    "phone": "+90 530 344 53 01",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Sebahat Çınar",
      "İlhan ÇINAR",
      "Sebahat Çınar"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 0,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15750,
      "kidem": 5250,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 20,
    "key": "A-20",
    "block": "A Blok",
    "flatNo": "A-20",
    "number": 20,
    "name": "Fatma Karakoç",
    "type": "Kiracı",
    "ownerName": "Köksal KARAKOÇ",
    "tenantName": "Fatma Karakoç",
    "phone": "+90 505 317 11 83",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Fatma Karakoç",
      "Köksal KARAKOÇ",
      "Fatma Karakoç"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 0,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 5250,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 21,
    "key": "A-21",
    "block": "A Blok",
    "flatNo": "A-21",
    "number": 21,
    "name": "Yusuf BAYIK",
    "type": "Ev Sahibi",
    "ownerName": "Yusuf BAYIK",
    "tenantName": "",
    "phone": "+90 530 202 66 65",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Yusuf BAYIK",
      "Yusuf BAYIK"
    ],
    "debts": {
      "aidat": 2750,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 13000,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 2,
    "notes": "Durum: Dolu"
  },
  {
    "id": 22,
    "key": "B-1",
    "block": "B Blok",
    "flatNo": "B-01",
    "number": 1,
    "name": "A. Kareem SABRİ",
    "type": "Ev Sahibi",
    "ownerName": "A. Kareem SABRİ",
    "tenantName": "",
    "phone": "+97455728303",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "A. Kareem SABRİ",
      "A. Kareem SABRİ"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 2100,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15750,
      "kidem": 3150,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 87.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 23,
    "key": "B-2",
    "block": "B Blok",
    "flatNo": "B-02",
    "number": 2,
    "name": "Aysel DOĞAN",
    "type": "Ev Sahibi",
    "ownerName": "Aysel DOĞAN",
    "tenantName": "",
    "phone": "+90 533 569 63 32",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Aysel DOĞAN",
      "Aysel DOĞAN"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 550,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 15750,
      "kidem": 4700,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 1550,
      "ŞUBAT": 500,
      "MART": 500,
      "NİSAN": 500,
      "MAYIS": 500,
      "HAZİRAN": 400,
      "TEMMUZ": 750
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 24,
    "key": "B-3",
    "block": "B Blok",
    "flatNo": "B-03",
    "number": 3,
    "name": "Eda Ceylani",
    "type": "Kiracı",
    "ownerName": "Uluç CEYLANİ",
    "tenantName": "Eda Ceylani",
    "phone": "+90 532 434 23 84",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Eda Ceylani",
      "Uluç CEYLANİ",
      "Eda Ceylani"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 0,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 5250,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 25,
    "key": "B-4",
    "block": "B Blok",
    "flatNo": "B-04",
    "number": 4,
    "name": "Eren ERDOĞAN",
    "type": "Ev Sahibi",
    "ownerName": "Eren ERDOĞAN",
    "tenantName": "",
    "phone": "+90 507 786 32 62",
    "duesAmount": 1500,
    "ibans": [],
    "aliases": [
      "Eren ERDOĞAN",
      "Eren ERDOĞAN"
    ],
    "debts": {
      "aidat": 6000,
      "kidem": 5250,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 4500,
      "kidem": 0,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1500,
      "ŞUBAT": 1500,
      "MART": 1500
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 4,
    "notes": "Durum: Dolu"
  },
  {
    "id": 26,
    "key": "B-5",
    "block": "B Blok",
    "flatNo": "B-05",
    "number": 5,
    "name": "Alena MUSSAYEVA",
    "type": "Ev Sahibi",
    "ownerName": "Alena MUSSAYEVA",
    "tenantName": "",
    "phone": "+90 506 928 99 03",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Alena MUSSAYEVA",
      "Alena MUSSAYEVA"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 5250,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 0,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 27,
    "key": "B-6",
    "block": "B Blok",
    "flatNo": "B-06",
    "number": 6,
    "name": "Ali Erhan SÖYLEMEZ",
    "type": "Ev Sahibi",
    "ownerName": "Ali Erhan SÖYLEMEZ",
    "tenantName": "",
    "phone": "+90 532 694 77 87",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Ali Erhan SÖYLEMEZ",
      "Ali Erhan SÖYLEMEZ"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 0,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 5250,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 28,
    "key": "B-7",
    "block": "B Blok",
    "flatNo": "B-07",
    "number": 7,
    "name": "M. Arkın YEGÜL",
    "type": "Ev Sahibi",
    "ownerName": "M. Arkın YEGÜL",
    "tenantName": "",
    "phone": "+90 542 276 26 51",
    "duesAmount": 1500,
    "ibans": [],
    "aliases": [
      "M. Arkın YEGÜL",
      "M. Arkın YEGÜL"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 3250,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 10500,
      "kidem": 2000,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1500,
      "ŞUBAT": 1500,
      "MART": 1500,
      "NİSAN": 1500,
      "MAYIS": 1500,
      "HAZİRAN": 1500,
      "TEMMUZ": 1500
    },
    "monthlyKidem": {
      "OCAK": 1000,
      "MART": 1000
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 29,
    "key": "B-8",
    "block": "B Blok",
    "flatNo": "B-08",
    "number": 8,
    "name": "Emre BAĞCIOĞLU",
    "type": "Kiracı",
    "ownerName": "Emre BAĞCIOĞLU",
    "tenantName": "Emre BAĞCIOĞLU",
    "phone": "+90 533 317 99 93",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Emre BAĞCIOĞLU",
      "Emre BAĞCIOĞLU",
      "Emre BAĞCIOĞLU"
    ],
    "debts": {
      "aidat": 2250,
      "kidem": 2187.5,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 13500,
      "kidem": 3062.5,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 30,
    "key": "B-9",
    "block": "B Blok",
    "flatNo": "B-09",
    "number": 9,
    "name": "nikita bayram",
    "type": "Kiracı",
    "ownerName": "Mehmet COŞAR",
    "tenantName": "nikita bayram",
    "phone": "+90 542 269 98 51",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "nikita bayram",
      "Mehmet COŞAR",
      "nikita bayram"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 4800,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 16850,
      "kidem": 450,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "NİSAN": 2250,
      "MAYIS": 2250
    },
    "monthlyKidem": {
      "NİSAN": 450
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 31,
    "key": "B-10",
    "block": "B Blok",
    "flatNo": "B-10",
    "number": 10,
    "name": "Ercan BOZKUŞ",
    "type": "Ev Sahibi",
    "ownerName": "Ercan BOZKUŞ",
    "tenantName": "",
    "phone": "+90 506 585 51 05",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Ercan BOZKUŞ",
      "Ercan BOZKUŞ"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 2100,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 16850,
      "kidem": 3150,
      "yuruyus": 0
    },
    "monthlyAidat": {},
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 32,
    "key": "B-11",
    "block": "B Blok",
    "flatNo": "B-11",
    "number": 11,
    "name": "Ramazan SİVİL",
    "type": "Ev Sahibi",
    "ownerName": "Ramazan SİVİL",
    "tenantName": "",
    "phone": "+90 534 634 68 89",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Ramazan SİVİL",
      "Ramazan SİVİL"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 5250,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 0,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 33,
    "key": "B-12",
    "block": "B Blok",
    "flatNo": "B-12",
    "number": 12,
    "name": "Züleyha ÖĞÜR",
    "type": "Ev Sahibi",
    "ownerName": "Züleyha ÖĞÜR",
    "tenantName": "",
    "phone": "+90 533 934 40 95",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Züleyha ÖĞÜR",
      "Züleyha ÖĞÜR"
    ],
    "debts": {
      "aidat": 500,
      "kidem": 0,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 15250,
      "kidem": 5250,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 34,
    "key": "B-13",
    "block": "B Blok",
    "flatNo": "B-13",
    "number": 13,
    "name": "Serkan DORU",
    "type": "Ev Sahibi",
    "ownerName": "Serkan DORU",
    "tenantName": "",
    "phone": "+90 505 497 03 67",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Serkan DORU",
      "Serkan DORU"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 0,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 15750,
      "kidem": 5250,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {
      "OCAK": 437.5,
      "ŞUBAT": 437.5,
      "MART": 437.5,
      "NİSAN": 437.5,
      "MAYIS": 437.5,
      "HAZİRAN": 437.5,
      "TEMMUZ": 437.5,
      "AĞUSTOS": 437.5,
      "EYLÜL": 437.5,
      "EKİM": 437.5,
      "KASIM": 437.5,
      "ARALIK": 437.5
    },
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 35,
    "key": "B-14",
    "block": "B Blok",
    "flatNo": "B-14",
    "number": 14,
    "name": "Jale KORUN",
    "type": "Ev Sahibi",
    "ownerName": "Jale KORUN",
    "tenantName": "",
    "phone": "+90 532 548 90 50",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Jale KORUN",
      "Jale KORUN"
    ],
    "debts": {
      "aidat": 2250,
      "kidem": 5250,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 13500,
      "kidem": 0,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 36,
    "key": "B-15",
    "block": "B Blok",
    "flatNo": "B-15",
    "number": 15,
    "name": "Osman KÖSE",
    "type": "Ev Sahibi",
    "ownerName": "Osman KÖSE",
    "tenantName": "",
    "phone": "+90 532 737 39 88",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Osman KÖSE",
      "Osman KÖSE"
    ],
    "debts": {
      "aidat": 0,
      "kidem": 5250,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 27000,
      "kidem": 0,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250,
      "AĞUSTOS": 2250,
      "EYLÜL": 2250,
      "EKİM": 2250,
      "KASIM": 2250,
      "ARALIK": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 0,
    "notes": "Durum: Dolu"
  },
  {
    "id": 37,
    "key": "B-16",
    "block": "B Blok",
    "flatNo": "B-16",
    "number": 16,
    "name": "Sultan Altın",
    "type": "Kiracı",
    "ownerName": "Metin GÖZÜTOK",
    "tenantName": "Sultan Altın",
    "phone": "+90 537 774 33 22",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Sultan Altın",
      "Metin GÖZÜTOK",
      "Sultan Altın"
    ],
    "debts": {
      "aidat": 5000,
      "kidem": 2187.5,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 10750,
      "kidem": 3062.5,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250,
      "TEMMUZ": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 3,
    "notes": "Durum: Dolu"
  },
  {
    "id": 38,
    "key": "B-17",
    "block": "B Blok",
    "flatNo": "B-17",
    "number": 17,
    "name": "Feride ATAK",
    "type": "Ev Sahibi",
    "ownerName": "Feride ATAK",
    "tenantName": "",
    "phone": "+90 532 642 85 92",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Feride ATAK",
      "Feride ATAK"
    ],
    "debts": {
      "aidat": 7250,
      "kidem": 0,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 8500,
      "kidem": 6000,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 4,
    "notes": "Durum: Dolu"
  },
  {
    "id": 39,
    "key": "B-18",
    "block": "B Blok",
    "flatNo": "B-18",
    "number": 18,
    "name": "Alpay AY",
    "type": "Ev Sahibi",
    "ownerName": "Alpay AY",
    "tenantName": "",
    "phone": "+90 532 285 07 50",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Alpay AY",
      "Alpay AY"
    ],
    "debts": {
      "aidat": 2250,
      "kidem": 3750,
      "yuruyus": 1100,
      "asansor": 0
    },
    "payments": {
      "aidat": 13500,
      "kidem": 1500,
      "yuruyus": 0
    },
    "monthlyAidat": {
      "OCAK": 2250,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250
    },
    "monthlyKidem": {
      "OCAK": 1500
    },
    "priorDebt2025": 0,
    "unpaidMonths": 1,
    "notes": "Durum: Dolu"
  },
  {
    "id": 40,
    "key": "B-19",
    "block": "B Blok",
    "flatNo": "B-19",
    "number": 19,
    "name": "Mehmet PEHLİVAN",
    "type": "Ev Sahibi",
    "ownerName": "Mehmet PEHLİVAN",
    "tenantName": "",
    "phone": "+90 541 361 65 01",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Mehmet PEHLİVAN",
      "Mehmet PEHLİVAN"
    ],
    "debts": {
      "aidat": 2750,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 13000,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 2,
    "notes": "Durum: Dolu"
  },
  {
    "id": 41,
    "key": "B-20",
    "block": "B Blok",
    "flatNo": "B-20",
    "number": 20,
    "name": "Vedat AKSU",
    "type": "Ev Sahibi",
    "ownerName": "Vedat AKSU",
    "tenantName": "",
    "phone": "+90 536 348 96 09",
    "duesAmount": 2250,
    "ibans": [],
    "aliases": [
      "Vedat AKSU",
      "Vedat AKSU"
    ],
    "debts": {
      "aidat": 2750,
      "kidem": 5250,
      "yuruyus": 0,
      "asansor": 0
    },
    "payments": {
      "aidat": 13000,
      "kidem": 0,
      "yuruyus": 1100
    },
    "monthlyAidat": {
      "OCAK": 1750,
      "ŞUBAT": 2250,
      "MART": 2250,
      "NİSAN": 2250,
      "MAYIS": 2250,
      "HAZİRAN": 2250
    },
    "monthlyKidem": {},
    "priorDebt2025": 0,
    "unpaidMonths": 2,
    "notes": "Durum: Dolu"
  }
];

export const INITIAL_EXPENSES = [];

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
    id: 'ai_kurumsal',
    title: '🤖 Yapay Zeka Kurumsal Borç İkazı (Ultra Kibar & IBAN)',
    template: "Sayın {Sakin_Adı} ({Daire_No}), {Gönderim_Tarihi} tarihi itibariyle sitemize ait güncel borç dökümünüz: {Borç_Detayı}. (Toplam Borcunuz: {Toplam_Borç} TL). Ödemenizi daha önce yaptıysanız gösterdiğiniz hassasiyet için teşekkür ederiz. Ödemenizi henüz yapmadıysanız sitemiz IBAN hesabına ({Banka_Adı} IBAN: {Site_IBAN}) 'Daire {Daire_No} {Sakin_Adı}' açıklamasıyla göndermenizi rica ederiz. İlgili tutarda herhangi bir hata veya farklı bir durum olduğunu düşünüyorsanız lütfen tarafımızla iletişime geçiniz. Sağlıklı günler dileriz."
  },
  {
    id: 'gecikmeli_aidat',
    title: 'Aylık Aidat Hatırlatması',
    template: "Sayın {Sakin_Adı} ({Daire_No}), site yönetimi olarak bilgilendiriyoruz. Hesabınızda {Aidat_Borcu} TL aidat borcunuz bulunmaktadır. Ödemenizi {Banka_Adı} IBAN: {Site_IBAN} hesabımıza yapmanızı rica ederiz. Bir hata olduğunu düşünüyorsanız lütfen bize ulaşınız."
  },
  {
    id: 'kidem_fonu',
    title: 'Kıdem Tazminatı Fonu Ödemesi',
    template: "Sayın {Sakin_Adı} ({Daire_No}), Kıdem Tazminatı Fonu için kalan borcunuz {Kıdem_Borcu} TL'dir. Ödemenizi {Banka_Adı} IBAN: {Site_IBAN} hesabımıza yapmanızı rica ederiz."
  },
  {
    id: 'yuruyus_yolu',
    title: 'Yürüyüş Yolu Tadilat Ödemesi',
    template: "Sayın {Sakin_Adı} ({Daire_No}), Yürüyüş Yolu Tadilatı için kalan borcunuz {Yürüyüş_Borcu} TL'dir. Ödemenizi {Banka_Adı} IBAN: {Site_IBAN} hesabımıza yapmanızı rica ederiz."
  }
];
