// AI Alias Learning Engine
// Öğrenilen takma adlar ve gönderen eşleşmeleri localStorage'da saklanır
// Sonraki ekstre yüklemelerinde otomatik eşleştirme için kullanılır

const ALIAS_MEMORY_KEY = 'site_mgmt_alias_memory_v2';

// -------------------- ALIAS HAFIZASI YÖNETIMI --------------------

export function getAliasMemory() {
  try {
    const raw = localStorage.getItem(ALIAS_MEMORY_KEY);
    return raw ? JSON.parse(raw) : {};
    // Format: { "normalisedToken": { residentId, residentName, flatNo, block, learnedAt, hitCount } }
  } catch {
    return {};
  }
}

export function saveAliasMemory(memory) {
  try {
    localStorage.setItem(ALIAS_MEMORY_KEY, JSON.stringify(memory));
  } catch (e) {
    console.error('Alias memory save error:', e);
  }
}

// Manuel eşleştirme yapıldığında öğren
// senderName: banka gönderen adı, description: tam açıklama, resident: eşlenen sakin nesnesi
export function learnAliasFromMatch(senderName, description, resident) {
  const memory = getAliasMemory();

  const tokensToLearn = new Set();

  // 1. Gönderen adını olduğu gibi öğren
  if (senderName && senderName.length >= 3) {
    tokensToLearn.add(trNorm(senderName));
    // Her kelimeyi de öğren (4+ harf)
    senderName.split(/\s+/).filter(w => w.length >= 4).forEach(w => tokensToLearn.add(trNorm(w)));
  }

  // 2. Açıklamadan anlamlı token'ları çıkar
  if (description) {
    // Kısa kelimeleri (< 4 harf), rakamları ve yaygın banka kelimelerini atla
    const STOP_WORDS = new Set(['havale', 'eft', 'para', 'odeme', 'aidat', 'transfer', 'fast', 'banka', 'sure', 'iban', 'tl', 'try', 'tarih', 'aciklama', 'gonderme', 'alinti', 'dekont', 'fatura', 'borc', 'kidem', 'siteye', 'sitesi', 'yonetim']);
    description.split(/[\s\-_\/|,.;:]+/)
      .map(w => w.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, ''))
      .filter(w => w.length >= 4)
      .map(w => trNorm(w))
      .filter(w => !STOP_WORDS.has(w))
      .forEach(w => tokensToLearn.add(w));
  }

  // Mevcut hafızaya ekle / güncelle
  const info = {
    residentId: resident.id,
    residentName: resident.name,
    flatNo: resident.flatNo,
    block: resident.block,
    learnedAt: new Date().toISOString(),
    hitCount: 0
  };

  for (const token of tokensToLearn) {
    if (!memory[token]) {
      memory[token] = { ...info, hitCount: 0 };
    } else {
      // Zaten bilinen bir token — sadece hit sayısını koru
      memory[token] = { ...info, hitCount: (memory[token].hitCount || 0) };
    }
  }

  saveAliasMemory(memory);
  return tokensToLearn.size;
}

// Bir işlem açıklaması ve gönderen adına göre eşleştirme bul
// Returns: { residentId, residentName, flatNo, block, confidence, matchedToken } | null
export function lookupAlias(senderName, description) {
  const memory = getAliasMemory();
  if (Object.keys(memory).length === 0) return null;

  // Aday token listesi — gönderen adı ve açıklamadan
  const candidateTokens = [];

  if (senderName) {
    candidateTokens.push(trNorm(senderName));
    senderName.split(/\s+/).filter(w => w.length >= 4).forEach(w => candidateTokens.push(trNorm(w)));
  }

  if (description) {
    description.split(/[\s\-_\/|,.;:]+/)
      .map(w => w.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, ''))
      .filter(w => w.length >= 4)
      .map(w => trNorm(w))
      .forEach(w => candidateTokens.push(w));
  }

  // Tam eşleşme ara
  for (const token of candidateTokens) {
    if (memory[token]) {
      // Hit sayısını artır
      memory[token].hitCount = (memory[token].hitCount || 0) + 1;
      saveAliasMemory(memory);
      return {
        ...memory[token],
        matchedToken: token,
        confidence: 'high'
      };
    }
  }

  // Kısmi (substring) eşleşme ara
  const memoryKeys = Object.keys(memory);
  for (const token of candidateTokens) {
    for (const key of memoryKeys) {
      if (key.length >= 5 && (token.includes(key) || key.includes(token))) {
        memory[key].hitCount = (memory[key].hitCount || 0) + 1;
        saveAliasMemory(memory);
        return {
          ...memory[key],
          matchedToken: `${token}~${key}`,
          confidence: 'medium'
        };
      }
    }
  }

  return null;
}

// Öğrenilen hafızayı listele (Settings sayfası için)
export function getAliasMemoryList() {
  const memory = getAliasMemory();
  return Object.entries(memory).map(([token, info]) => ({ token, ...info }))
    .sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0));
}

// Belirli bir token'ı sil
export function deleteAliasToken(token) {
  const memory = getAliasMemory();
  delete memory[token];
  saveAliasMemory(memory);
}

// Türkçe normalize
function trNorm(str) {
  return String(str || '')
    .replace(/İ/g, 'I').replace(/I/g, 'i').replace(/ı/g, 'i')
    .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U').replace(/ü/g, 'u')
    .replace(/Ş/g, 'S').replace(/ş/g, 's')
    .replace(/Ö/g, 'O').replace(/ö/g, 'o')
    .replace(/Ç/g, 'C').replace(/ç/g, 'c')
    .toLowerCase()
    .trim();
}
