import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  ShieldCheck, 
  Database, 
  History, 
  RotateCcw, 
  Download, 
  Upload, 
  KeyRound, 
  Building, 
  CheckCircle2, 
  Clock, 
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';

import { 
  getBackupSnapshots, 
  createBackupSnapshot, 
  getAuditLogs, 
  addAuditLog,
  saveSiteSettings
} from '../utils/backupManager';

export default function Settings({ 
  siteSettings, 
  setSiteSettings, 
  residents, 
  setResidents, 
  expenses, 
  setExpenses, 
  bankTransactions, 
  feeCategories,
  currentManager
}) {
  const [formSettings, setFormSettings] = useState({ ...siteSettings });
  const [passwordForm, setPasswordForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [activeSubTab, setActiveSubTab] = useState('general'); // general, backups, logs, security
  const [statusNotice, setStatusNotice] = useState('');

  const snapshots = getBackupSnapshots();
  const auditLogs = getAuditLogs();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSiteSettings(formSettings);
    saveSiteSettings(formSettings);
    createBackupSnapshot(
      { residents, expenses, feeCategories, bankTransactions, settings: formSettings },
      'Ayarlar Güncellendi'
    );
    addAuditLog('Ayarlar Güncellendi', 'Site adı ve parametreleri güncellendi', currentManager);
    setStatusNotice('✅ Site ayarları başarıyla kaydedildi ve otomatik yedek alındı!');
    setTimeout(() => setStatusNotice(''), 5000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      alert('Yeni şifreler eşleşmiyor!');
      return;
    }
    const updated = { ...siteSettings, adminPassword: passwordForm.newPass };
    setSiteSettings(updated);
    saveSiteSettings(updated);
    addAuditLog('Şifre Değiştirildi', 'Yönetici giriş şifresi güncellendi', currentManager);
    setPasswordForm({ currentPass: '', newPass: '', confirmPass: '' });
    alert('✅ Yönetici şifreniz başarıyla değiştirildi!');
  };

  const handleManualBackup = () => {
    const snap = createBackupSnapshot(
      { residents, expenses, feeCategories, bankTransactions, settings: siteSettings },
      'Manuel Yönetici Yedeği'
    );
    addAuditLog('Manuel Yedek Alındı', `Yedek ID: ${snap?.id}`, currentManager);
    setStatusNotice('✅ Manuel sistem yedeği başarıyla kaydedildi!');
    setTimeout(() => setStatusNotice(''), 5000);
  };

  const handleRestoreSnapshot = (snap) => {
    if (confirm(`'${snap.reason}' (${snap.displayDate}) tarihli yedeğe geri dönmek istediğinize emin misiniz?`)) {
      if (snap.data.residents) setResidents(snap.data.residents);
      if (snap.data.expenses) setExpenses(snap.data.expenses);
      addAuditLog('Yedekten Geri Yüklendi', `Restored ID: ${snap.id}`, currentManager);
      alert('✅ Sistem başarıyla seçili yedek durumuna geri yüklendi!');
    }
  };

  const handleExportSystemJSON = () => {
    const dump = {
      timestamp: new Date().toISOString(),
      siteSettings,
      residents,
      expenses,
      feeCategories,
      bankTransactions
    };
    const jsonStr = JSON.stringify(dump, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Umut_Sitesi_Tam_Sistem_Yedeği_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in">
      {/* Header Banner */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SettingsIcon color="#818cf8" /> Site ve Sistem Ayarları Paneli
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Site adı, şifre, otomatik yedekleme geçmişi ve değişiklik loglarını yönetin.
            </p>
            {statusNotice && (
              <div style={{ marginTop: '8px', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                {statusNotice}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={handleExportSystemJSON}>
              <Download size={18} /> JSON Tam Sistem Yedeği İndir
            </button>
            <button className="btn btn-primary" onClick={handleManualBackup}>
              <Database size={18} /> Anlık Yedek Al
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeSubTab === 'general' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('general')}
        >
          <Building size={16} /> Site & Finans Ayarları
        </button>

        <button 
          className={`btn ${activeSubTab === 'backups' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('backups')}
        >
          <History size={16} /> Otomatik Yedekler ({snapshots.length})
        </button>

        <button 
          className={`btn ${activeSubTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('logs')}
        >
          <Clock size={16} /> Değişiklik Logları ({auditLogs.length})
        </button>

        <button 
          className={`btn ${activeSubTab === 'security' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('security')}
        >
          <ShieldCheck size={16} /> Güvenlik & Şifre
        </button>
      </div>

      {/* Sub Tab Content */}

      {/* 1. General Settings */}
      {activeSubTab === 'general' && (
        <div className="glass-card">
          <form onSubmit={handleSaveSettings}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building color="#818cf8" size={20} /> Genel Site ve Banka Parametreleri
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Site / Apartman Ünvanı</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formSettings.siteName}
                  onChange={(e) => setFormSettings({ ...formSettings, siteName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Site Adresi / Açıklama</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formSettings.address}
                  onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Banka Adı</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formSettings.bankName}
                  onChange={(e) => setFormSettings({ ...formSettings, bankName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Site Banka IBAN Numarası</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formSettings.bankIban}
                  onChange={(e) => setFormSettings({ ...formSettings, bankIban: e.target.value })}
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', margin: '24px 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet color="#10b981" size={20} /> Varsayılan Borçlandırma Tutarları
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Varsayılan Aylık Aidat (TL)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={formSettings.defaultDues}
                  onChange={(e) => setFormSettings({ ...formSettings, defaultDues: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Varsayılan Kıdem Tazminatı (TL)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={formSettings.defaultKidem}
                  onChange={(e) => setFormSettings({ ...formSettings, defaultKidem: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Son Ödeme Günü (Her Ayın)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="15"
                  value={formSettings.dueDayOfMonth}
                  onChange={(e) => setFormSettings({ ...formSettings, dueDayOfMonth: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={18} /> Ayarları Kaydet & Otomatik Yedek Al
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Backup Snapshots History */}
      {activeSubTab === 'backups' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History color="#f59e0b" size={20} /> Otomatik Versiyon Yedekleme Geçmişi
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Sistemde yapılan her kayıtta ve ayar değişikliğinde otomatik versiyon yedeği alınır. İlettiğiniz her anki duruma 1-tıkla geri dönebilirsiniz.
          </p>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Yedek Tarihi</th>
                  <th>Neden / Açıklama</th>
                  <th>Daire Sayısı</th>
                  <th>Yedek ID</th>
                  <th>Geri Yükle</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Henüz otomatik yedek kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  snapshots.map(snap => (
                    <tr key={snap.id}>
                      <td style={{ fontWeight: 600 }}>{snap.displayDate}</td>
                      <td>
                        <span className="badge badge-info">{snap.reason}</span>
                      </td>
                      <td>{snap.data?.residents?.length || 0} Daire</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{snap.id}</td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleRestoreSnapshot(snap)}
                          style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                        >
                          <RotateCcw size={14} /> Bu Duruma Geri Dön
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Audit Logs */}
      {activeSubTab === 'logs' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock color="#38bdf8" size={20} /> Yönetici Değişiklik Logları (Audit Trail)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Hangi yöneticinin ne zaman hangi işlemi yaptığının kronolojik kayıtları.
          </p>

          <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Tarih & Saat</th>
                  <th>Yönetici</th>
                  <th>Yapılan İşlem</th>
                  <th>Detaylar</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Henüz sistem değişikliği loglanmadı.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                      <td style={{ fontWeight: 600, color: '#a5b4fc' }}>{log.managerName}</td>
                      <td>
                        <span className="badge badge-primary">{log.action}</span>
                      </td>
                      <td style={{ fontSize: '0.88rem' }}>{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Security & Password */}
      {activeSubTab === 'security' && (
        <div className="glass-card" style={{ maxWidth: '500px' }}>
          <form onSubmit={handlePasswordChange}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound color="#fb7185" size={20} /> Yönetici Giriş Şifresini Değiştir
            </h3>

            <div className="form-group">
              <label className="form-label">Yeni Şifre</label>
              <input 
                type="password" 
                className="form-input" 
                value={passwordForm.newPass}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Yeni Şifre (Tekrar)</label>
              <input 
                type="password" 
                className="form-input" 
                value={passwordForm.confirmPass}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', background: '#fb7185' }}>
              <ShieldCheck size={18} /> Şifreyi Güncelle
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
