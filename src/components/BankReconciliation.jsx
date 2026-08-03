import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  HelpCircle, 
  CheckCircle2, 
  Search, 
  UserPlus, 
  ArrowRight, 
  UploadCloud, 
  Sparkles, 
  RefreshCw,
  Info,
  Layers
} from 'lucide-react';
import { parseBankStatementExcel } from '../utils/bankStatementParser';
import { createBackupSnapshot, addAuditLog } from '../utils/backupManager';
import { aiSuggestMatchForTransaction } from '../utils/geminiStatementAI';

export default function BankReconciliation({ 
  bankTransactions, 
  setBankTransactions, 
  residents, 
  setResidents,
  feeCategories,
  setExpenses,
  onOpenMatchModal
}) {
  const [filter, setFilter] = useState('all'); // all, unmatched, matched
  const [searchTerm, setSearchTerm] = useState('');
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [aiProcessingNotice, setAiProcessingNotice] = useState('');

  // Handle Bank Statement Upload (Excel .xlsx, .xls, .csv or PDF .pdf, .txt)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Automatic Snapshot before statement modification
    createBackupSnapshot(
      { residents, bankTransactions, feeCategories },
      'Banka Ekstresi Yükleme Öncesi Yedeği'
    );
    addAuditLog('Banka Ekstresi Yüklendi', `${file.name} ekstresi Gemini AI ile işleniyor`, 'Yönetici');

    setAiProcessingNotice('✨ Gemini AI Banka Ekstrenizi Analiz Ediyor ve Dairelerle Eşleştiriyor...');

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');

    if (isPdf) {
      // PDF File Parser
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const text = evt.target.result;
          const parsed = parseBankStatementPDFText(text, residents, bankTransactions);
          if (parsed.transactions && (parsed.transactions.length > 0 || parsed.skippedDuplicatesCount > 0)) {
            if (parsed.transactions.length > 0) setBankTransactions(prev => [...parsed.transactions, ...prev]);
            if (setExpenses && parsed.autoExpenses.length > 0) {
              setExpenses(prev => [...parsed.autoExpenses, ...(prev || [])]);
            }
            const matched = parsed.transactions.filter(t => t.status === 'matched').length;
            setAiProcessingNotice('');
            alert(`✅ PDF Banka Ekstresi Gemini AI ile başarıyla işlendi!\n• Yeni Gelen Transferler: ${parsed.transactions.length} (${matched} adedi otomatik sakine eşleşti)\n• Otomatik İşlenen Giderler: ${parsed.autoExpenses.length}\n• Mükerrer İşlem Atlandı: ${parsed.skippedDuplicatesCount} adet`);
          } else {
            setAiProcessingNotice('');
            alert('PDF ekstresindeki tüm işlemler daha önce sisteme işlendiği için mükerrer işlem oluşturulmadı.');
          }
        } catch (err) {
          console.error(err);
          setAiProcessingNotice('');
          alert('PDF ekstresi okunurken hata oluştu: ' + err.message);
        }
      };
      reader.readAsText(file);
    } else {
      // Excel / CSV File Parser
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const parsed = parseBankStatementExcel(wb, residents, bankTransactions);
          if (parsed.transactions && (parsed.transactions.length > 0 || parsed.skippedDuplicatesCount > 0)) {
            if (parsed.transactions.length > 0) setBankTransactions(prev => [...parsed.transactions, ...prev]);
            if (setExpenses && parsed.autoExpenses.length > 0) {
              setExpenses(prev => [...parsed.autoExpenses, ...(prev || [])]);
            }
            const matched = parsed.transactions.filter(t => t.status === 'matched').length;
            setAiProcessingNotice('');
            alert(`✅ Excel Banka Ekstresi Gemini AI ile başarıyla işlendi!\n• Yeni Gelen Transferler: ${parsed.transactions.length} (${matched} adedi otomatik sakine eşleşti)\n• Otomatik İşlenen Giderler: ${parsed.autoExpenses.length}\n• Mükerrer İşlem Atlandı: ${parsed.skippedDuplicatesCount} adet`);
          } else {
            setAiProcessingNotice('');
            alert('Excel ekstresindeki tüm işlemler daha önce sisteme işlendiği için mükerrer işlem oluşturulmadı.');
          }
        } catch (err) {
          console.error(err);
          setAiProcessingNotice('');
          alert('Excel ekstresi işlenirken hata oluştu: ' + err.message);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const processRawRows = (rows) => {
    const newTxns = rows.map((row, index) => {
      const date = row[0] || new Date().toISOString().split('T')[0];
      const senderName = row[1] || 'Bilinmeyen Gönderen';
      const description = row[2] || '';
      const amount = parseFloat(row[3]) || 1500;
      const iban = row[4] || '';

      // Run automatic matching rule
      const matchResult = autoMatchTransaction(senderName, description, iban, amount);

      return {
        id: `TXN-IMPORT-${Date.now()}-${index}`,
        date,
        senderName,
        description,
        amount,
        iban,
        ...matchResult
      };
    });

    setBankTransactions(prev => [...newTxns, ...prev]);
  };

  // Automatic Matching Logic
  const autoMatchTransaction = (senderName, description, iban, amount) => {
    const cleanDesc = (description + ' ' + senderName).toLowerCase();

    // 1. Try matching by registered IBAN
    if (iban) {
      const matchByIban = residents.find(r => r.ibans?.includes(iban));
      if (matchByIban) {
        return {
          status: 'matched',
          confidence: 'high',
          suggestedResidentId: matchByIban.id,
          matchedResidentId: matchByIban.id,
          matchedCategory: 'aidat',
          reason: `Otomatik Eşleşti: Kayıtlı IBAN (${matchByIban.name})`
        };
      }
    }

    // 2. Try matching by saved Aliases (e.g. spouse name, company name)
    for (let r of residents) {
      for (let alias of (r.aliases || [])) {
        if (cleanDesc.includes(alias.toLowerCase())) {
          return {
            status: 'matched',
            confidence: 'high',
            suggestedResidentId: r.id,
            matchedResidentId: r.id,
            matchedCategory: 'aidat',
            reason: `Otomatik Eşleşti: Kayıtlı Takma Ad (${alias} -> ${r.name})`
          };
        }
      }
    }

    // 3. Try matching by Daire / Flat Number pattern (e.g. "A1", "A-01", "Daire 1", "D1")
    for (let r of residents) {
      const flatNumStr = r.number.toString();
      const flatCode = r.flatNo.toLowerCase(); // e.g. a-01
      if (cleanDesc.includes(flatCode) || cleanDesc.includes(`daire ${flatNumStr}`) || cleanDesc.includes(`d.${flatNumStr}`) || cleanDesc.includes(`d${flatNumStr}`)) {
        return {
          status: 'unmatched',
          confidence: 'medium',
          suggestedResidentId: r.id,
          matchedResidentId: null,
          matchedCategory: null,
          reason: `Öneri: Açıklamada "${r.flatNo}" tespit edildi (${r.name})`
        };
      }
    }

    // 4. Fallback: Unmatched
    return {
      status: 'unmatched',
      confidence: 'low',
      suggestedResidentId: null,
      matchedResidentId: null,
      matchedCategory: null,
      reason: 'Eşleşen kayıt bulunamadı (3. şahıs / eksik bilgi)'
    };
  };

  const filteredTxns = bankTransactions.filter(t => {
    if (filter === 'unmatched' && t.status !== 'unmatched') return false;
    if (filter === 'matched' && t.status !== 'matched') return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return t.senderName.toLowerCase().includes(s) || t.description.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="fade-in">
      {/* Top Banner & File Upload */}
      <div className="glass-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles color="#a5b4fc" /> Banka Havalesi Eşleştirme & Ayrıştırma Sistemi
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Banka ekstrelerindeki isimsiz veya 3. şahıslardan gelen havaleleri sakine bağlayın. Sistem öğrendiği takma isimleri otomatik hafızaya alır!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <label className="btn btn-primary" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <UploadCloud size={18} /> 📄 Excel veya PDF Ekstresi Yükle
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv, .pdf, .txt, application/pdf" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </label>
            <button className="btn btn-secondary" onClick={() => setPasteModalOpen(true)}>
              <FileSpreadsheet size={18} /> Kopyala - Yapıştır
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Gönderen adı, açıklama veya tutar ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Tüm İşlemler ({bankTransactions.length})
          </button>
          <button 
            className={`btn btn-sm ${filter === 'unmatched' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('unmatched')}
            style={filter === 'unmatched' ? { background: '#f43f5e' } : {}}
          >
            Eşleşmeyen / Şüpheli ({bankTransactions.filter(t => t.status === 'unmatched').length})
          </button>
          <button 
            className={`btn btn-sm ${filter === 'matched' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('matched')}
          >
            Onaylı Eşleşenler ({bankTransactions.filter(t => t.status === 'matched').length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Banka Gönderen Adı</th>
                <th>Açıklama / Mesaj</th>
                <th>Tutar</th>
                <th>Eşleşme Durumu & Sebep</th>
                <th>Eşleşen Sakin</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-dim)' }}>
                    Filtrenize uygun banka hareketi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredTxns.map(txn => {
                  const matchedResident = residents.find(r => r.id === txn.matchedResidentId);
                  const suggestedResident = residents.find(r => r.id === txn.suggestedResidentId);

                  return (
                    <tr key={txn.id}>
                      <td>{txn.date}</td>
                      <td>
                        <strong style={{ color: 'white' }}>{txn.senderName}</strong>
                        {txn.iban && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {txn.iban}
                          </div>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '220px' }}>
                        {txn.description}
                      </td>
                      <td style={{ fontWeight: '700', color: '#34d399', fontSize: '1rem' }}>
                        ₺{txn.amount.toLocaleString('tr-TR')}
                      </td>
                      <td>
                        {txn.status === 'matched' ? (
                          <span className="badge-status badge-success" title={txn.reason}>
                            <CheckCircle2 size={14} /> Otomatik Eşleşti
                          </span>
                        ) : (
                          <span className="badge-status badge-danger" title={txn.reason}>
                            <HelpCircle size={14} /> Eşleşmedi / 3. Şahıs
                          </span>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                          {txn.reason}
                        </div>
                      </td>
                      <td>
                        {matchedResident ? (
                          <div style={{ fontWeight: '600', color: '#a5b4fc' }}>
                            {matchedResident.flatNo} - {matchedResident.name}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                              Kategori: {feeCategories.find(c => c.id === txn.matchedCategory)?.name || 'Aidat'}
                            </span>
                          </div>
                        ) : suggestedResident ? (
                          <div style={{ color: '#fbbf24', fontSize: '0.85rem' }}>
                            Öneri: <strong>{suggestedResident.flatNo} ({suggestedResident.name})</strong>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Eşleşmedi</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className={`btn btn-sm ${txn.status === 'matched' ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => onOpenMatchModal(txn)}
                        >
                          {txn.status === 'matched' ? 'Eşleşmeyi Düzenle' : 'Eşleştir & Öğret'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paste Modal */}
      {pasteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Banka Ekstresi Kopyala - Yapıştır</h3>
              <button className="close-btn" onClick={() => setPasteModalOpen(false)}>✕</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              İnternet bankacılığından kopyaladığınız metin satırlarını buraya yapıştırın. Format: Tarih | Gönderen | Açıklama | Tutar
            </p>
            <div className="form-group">
              <textarea 
                className="form-textarea" 
                rows="6"
                placeholder="2026-07-31	Fatma Yılmaz	Daire 4 aidat	1500"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setPasteModalOpen(false)}>İptal</button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const lines = pasteText.split('\n').filter(l => l.trim() !== '');
                  const rows = lines.map(line => line.split('\t'));
                  processRawRows(rows);
                  setPasteModalOpen(false);
                  setPasteText('');
                }}
              >
                Ayrıştır ve Aktar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
