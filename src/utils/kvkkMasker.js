// KVKK Name & Phone Masking Utility

export function maskName(nameStr) {
  if (!nameStr) return '***';
  const parts = nameStr.trim().split(' ');
  return parts.map(p => {
    if (p.length <= 1) return p;
    return p[0] + '*'.repeat(Math.max(2, p.length - 1));
  }).join(' ');
}

export function maskPhone(phoneStr) {
  if (!phoneStr) return '***';
  const clean = phoneStr.trim();
  if (clean.length < 10) return '*** *** ** **';
  return clean.substring(0, 7) + ' *** ** ' + clean.substring(clean.length - 2);
}
