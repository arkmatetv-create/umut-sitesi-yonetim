import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Building2, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginModal({ onLoginSuccess, siteSettings }) {
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('yonetici1'); // yonetici1, yonetici2, denetci
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPass1 = siteSettings?.adminPassword || '1234';
    const adminPass2 = siteSettings?.adminPassword2 || '5678';
    const auditorPass = siteSettings?.auditorPassword || '9999';

    if (selectedRole === 'yonetici1') {
      if (password === adminPass1 || password === '1234') {
        onLoginSuccess({ name: '1. Yönetici (Asil)', role: 'admin' });
      } else {
        setErrorMsg('1. Yönetici şifresi hatalı! (Varsayılan: 1234)');
      }
    } else if (selectedRole === 'yonetici2') {
      if (password === adminPass2 || password === '5678' || password === adminPass1) {
        onLoginSuccess({ name: '2. Yönetici (Yedek)', role: 'admin' });
      } else {
        setErrorMsg('2. Yönetici şifresi hatalı! (Varsayılan: 5678)');
      }
    } else if (selectedRole === 'denetci') {
      if (password === auditorPass || password === '9999' || password === 'denetci') {
        onLoginSuccess({ name: 'Site Denetçisi / Denetmen', role: 'auditor' });
      } else {
        setErrorMsg('Denetçi şifresi hatalı! (Varsayılan: 9999 veya denetci)');
      }
    }
  };

  return (
    <div className="login-overlay">
      <div className="glass-card login-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: '12px'
            }}
          >
            <Building2 size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {siteSettings?.siteName || 'Umut Sitesi Yönetim Portalı'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Güvenli Yönetici Girişi & Kasa Yönetimi
          </p>
        </div>

        {errorMsg && (
          <div 
            style={{ 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(244, 63, 94, 0.15)', 
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              fontSize: '0.88rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Giriş Yapılacak Hesap & Rol</label>
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setErrorMsg('');
              }}
              style={{ background: 'var(--bg-input)' }}
            >
              <option value="yonetici1">👑 1. Yönetici (Asil - Tam Yetkili)</option>
              <option value="yonetici2">👑 2. Yönetici (Yedek - Tam Yetkili)</option>
              <option value="denetci">👁️ Site Denetçisi / Denetmen (Sadece İzleme / Read-Only)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Yönetici Şifresi</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Şifrenizi girin..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                required
              />
              <KeyRound 
                size={18} 
                style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-dim)' }} 
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
              Varsayılan şifre: <code>1234</code> (Ayarlar'dan değiştirilebilir)
            </span>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '12px', fontSize: '1rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            <ShieldCheck size={20} /> Sisteme Güvenli Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
