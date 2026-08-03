import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Filter, 
  Edit3, 
  Sparkles, 
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';

import { parseWhatsAppGroupText, generateVCardExport } from '../utils/whatsappGroupParser';

export default function WhatsAppReminder({ 
  residents, 
  setResidents,
  templates, 
  setTemplates,
  preselectedResident
}) {
  const [selectedRule, setSelectedRule] = useState('2months_plus'); // 2months_plus, kidem_unpaid, yuruyus_unpaid, all_debtors
  const [selectedTemplateId, setSelectedTemplateId] = useState('gecikmeli_aidat');
  const [customTemplateText, setCustomTemplateText] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(false);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pasteGroupText, setPasteGroupText] = useState('');
  const [importNotice, setImportNotice] = useState('');

  // Active Template
  const activeTemplateObj = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const templateTextToUse = customTemplateText || activeTemplateObj.template;

  // Filter residents based on chosen rule
  const filteredDebtors = residents.filter(r => {
    if (preselectedResident) {
      return r.id === preselectedResident.id;
    }
    
    const aidatDebt = r.debts.aidat || 0;
    const kidemDebt = r.debts.kidem || 0;
    const yuruyusDebt = r.debts.yuruyus || 0;
    const asansorDebt = r.debts.asansor || 0;
    const totalDebt = aidatDebt + kidemDebt + yuruyusDebt + asansorDebt;

    if (selectedRule === '2months_plus') return r.unpaidMonths >= 2;
    if (selectedRule === 'kidem_unpaid') return kidemDebt > 0;
    if (selectedRule === 'yuruyus_unpaid') return yuruyusDebt > 0;
    if (selectedRule === 'all_debtors') return totalDebt > 0;

    return true;
  });

  // Render dynamic template tags for a specific resident
  const formatMessageForResident = (resident, templateStr) => {
    const aidatDebt = resident.debts.aidat || 0;
    const ekBorc = (resident.debts.kidem || 0) + (resident.debts.yuruyus || 0) + (resident.debts.asansor || 0);
    const totalDebt = aidatDebt + ekBorc;

    return templateStr
      .replace(/\{Sakin_Adı\}/g, resident.name)
      .replace(/\{Daire_No\}/g, resident.flatNo)
      .replace(/\{Aidat_Borcu\}/g, aidatDebt.toLocaleString('tr-TR'))
      .replace(/\{Ek_Borç_Tutarı\}/g, ekBorc.toLocaleString('tr-TR'))
      .replace(/\{Toplam_Borç\}/g, totalDebt.toLocaleString('tr-TR'))
      .replace(/\{Gecikme_Ay\}/g, resident.unpaidMonths || 1);
  };

  // Generate WhatsApp wa.me URL
  const getWhatsAppUrl = (resident) => {
    let cleanPhone = resident.phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) {
      cleanPhone = '90' + cleanPhone;
    }

    const message = formatMessageForResident(resident, templateTextToUse);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  };

  const handleParseGroupText = (e) => {
    e.preventDefault();
    if (!pasteGroupText.trim()) return;

    if (setResidents) {
      const res = parseWhatsAppGroupText(pasteGroupText, residents);
      setResidents(res.updatedResidents);
      setImportNotice(`✅ WhatsApp grubu metninden ${res.extractedPhoneCount} telefon numarası ayrıştırıldı ve dairelerle eşleştirildi!`);
    }
    setImportModalOpen(false);
    setPasteGroupText('');
    setTimeout(() => setImportNotice(''), 6000);
  };

  const handleDownloadVCard = () => {
    const vcfData = generateVCardExport(residents);
    const blob = new Blob([vcfData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Umut_Sitesi_Rehber_${new Date().toISOString().split('T')[0]}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in">
      {/* Top Banner */}
      <div className="glass-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.12) 0%, rgba(18, 140, 126, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare color="#25D366" /> Kurallı WhatsApp Borç Hatırlatma Modülü
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Belirlediğiniz kurallara göre borcu veya gecikmesi olan sakinlere tek tıkla özelleştirilmiş WhatsApp ikaz mesajı gönderin.
            </p>
            {importNotice && (
              <div style={{ marginTop: '8px', color: '#25D366', fontWeight: 600, fontSize: '0.9rem' }}>
                {importNotice}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setImportModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              <MessageSquare size={18} /> WhatsApp Grubu Üyelerini Yapıştır & Eşleştir
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleDownloadVCard}
              title="Telefon Rehberine İçe Aktarma Dosyası İndir"
            >
              <ExternalLink size={18} /> Rehbere Aktar (.VCF)
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Left Column: Rule & Template Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Rule Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="#a5b4fc" /> 1. Filtreleme Kuralı Seçin
            </h3>

            <div className="form-group">
              <label className="form-label">Hatırlatma Gönderilecek Sakinler</label>
              <select 
                className="form-select" 
                value={selectedRule}
                onChange={(e) => setSelectedRule(e.target.value)}
              >
                <option value="2months_plus">2 Aydan Fazla Aidat Gecikmesi Olanlar</option>
                <option value="kidem_unpaid">Kıdem Tazminatı Ek Ödemesini Yapmayanlar</option>
                <option value="yuruyus_unpaid">Yürüyüş Yolu Tadilat Borcu Olanlar</option>
                <option value="all_debtors">Herhangi Bir Borcu Olan Tüm Sakinler</option>
              </select>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              Seçili kurala uyan sakin sayısı: <strong style={{ color: '#25D366' }}>{filteredDebtors.length} Kişi</strong>
            </div>
          </div>

          {/* Template Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={18} color="#a5b4fc" /> 2. Mesaj Şablonu Seçin & Düzenleyin
            </h3>

            <div className="form-group">
              <label className="form-label">Şablon Kataloğu</label>
              <select 
                className="form-select" 
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value);
                  setCustomTemplateText('');
                }}
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Şablon İçeriği (Dinamik Etiketler)</label>
              <textarea 
                className="form-textarea" 
                rows="5"
                value={templateTextToUse}
                onChange={(e) => setCustomTemplateText(e.target.value)}
              />
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Kullanılabilir Etiketler: <br />
              <span style={{ color: '#a5b4fc' }}>{'{Sakin_Adı}'}</span>, <span style={{ color: '#a5b4fc' }}>{'{Daire_No}'}</span>, <span style={{ color: '#a5b4fc' }}>{'{Aidat_Borcu}'}</span>, <span style={{ color: '#a5b4fc' }}>{'{Ek_Borç_Tutarı}'}</span>, <span style={{ color: '#a5b4fc' }}>{'{Toplam_Borç}'}</span>, <span style={{ color: '#a5b4fc' }}>{'{Gecikme_Ay}'}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Resident WhatsApp Action List & Live Previews */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={20} color="#25D366" />
              Gönderim Listesi ({filteredDebtors.length} Sakin)
            </h3>
          </div>

          {filteredDebtors.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '12px' }} />
              <h4>Tebrikler! Seçili kurala giren borçlu sakin bulunmamaktadır.</h4>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredDebtors.map(resident => {
                const formattedText = formatMessageForResident(resident, templateTextToUse);
                const waUrl = getWhatsAppUrl(resident);

                return (
                  <div 
                    key={resident.id}
                    style={{
                      padding: '16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: '700', fontSize: '1rem', color: 'white', marginRight: '10px' }}>
                          {resident.flatNo} - {resident.name}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          (+90 {resident.phone})
                        </span>
                      </div>
                      <a 
                        href={waUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-whatsapp"
                        style={{ textDecoration: 'none' }}
                      >
                        <Send size={16} /> WhatsApp ile Gönder <ExternalLink size={14} />
                      </a>
                    </div>

                    {/* Message Preview Box */}
                    <div 
                      style={{ 
                        background: 'rgba(37, 211, 102, 0.06)', 
                        borderLeft: '4px solid #25D366', 
                        padding: '12px 14px', 
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.88rem',
                        color: '#e2e8f0',
                        lineHeight: '1.5'
                      }}
                    >
                      {formattedText}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Group Import Modal */}
      {importModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3><MessageSquare color="#25D366" /> Umut Sitesi WhatsApp Grubu Üyelerini Yükle</h3>
              <button className="close-btn" onClick={() => setImportModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleParseGroupText}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                WhatsApp uygulamanızda <strong>Umut Sitesi</strong> grubunu açıp üye listesini veya grup bilgilerindeki metinleri kopyalayarak aşağıdaki kutuya yapıştırın. Sistem tüm telefon numaralarını otomatik tanıyıp dairelerle eşleştirecektir.
              </p>

              <div className="form-group">
                <label className="form-label">WhatsApp Grubu Üye / Sohbet Metni</label>
                <textarea
                  className="form-input"
                  rows="8"
                  placeholder="WhatsApp grubundan kopyaladığınız üyeleri veya numaraları buraya yapıştırın..."
                  value={pasteGroupText}
                  onChange={(e) => setPasteGroupText(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setImportModalOpen(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#25D366' }}>
                  <Sparkles size={16} /> Numaraları Ayrıştır ve Dairelere Bağla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
