import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, X, FileText, TrendingDown, TrendingUp } from 'lucide-react';

export default function StatementApprovalModal({ 
  pendingData, 
  onConfirm, 
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('incomes'); // incomes, expenses
  const [selectedTxnIds, setSelectedTxnIds] = useState(
    new Set((pendingData?.transactions || []).map(t => t.id))
  );
  const [selectedExpIds, setSelectedExpIds] = useState(
    new Set((pendingData?.autoExpenses || []).map(e => e.id))
  );
  const [expensesList, setExpensesList] = useState(pendingData?.autoExpenses || []);

  const toggleTxn = (id) => {
    const next = new Set(selectedTxnIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedTxnIds(next);
  };

  const toggleExp = (id) => {
    const next = new Set(selectedExpIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedExpIds(next);
  };

  const handleExpenseCategoryChange = (expId, newCat) => {
    setExpensesList(prev => prev.map(e => e.id === expId ? { ...e, category: newCat } : e));
  };

  const handleConfirmAll = () => {
    const approvedTxns = (pendingData?.transactions || []).filter(t => selectedTxnIds.has(t.id));
    const approvedExps = expensesList.filter(e => selectedExpIds.has(e.id));

    onConfirm({
      approvedTransactions: approvedTxns,
      approvedExpenses: approvedExps
    });
  };

  const EXPENSE_CATEGORIES = [
    'Görevli Maaşı',
    'SGK Primi & Vergi Ödemesi',
    'Ortak Elektrik Faturası',
    'Tuz ve Arıtma Malzemesi',
    'Asansör Periyodik Bakım',
    'Site Tadilat ve Tamirat',
    'Kıdem Tazminatı Ödemesi',
    'Yürüyüş Yolu Malzemesi',
    'Belirlenemeyen / İşlenecek Giderler'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', width: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem' }}>
              <ShieldCheck color="#818cf8" size={24} /> Ekstre İşlem İnceleme ve Yönetici Onay Ekranı
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Gemini AI ekstrenizi ayrıştırdı. Sisteme kaydetmeden önce gelir ve giderleri onaylayın.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '12px', padding: '16px 20px 0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            className={`btn ${activeTab === 'incomes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('incomes')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <TrendingUp size={16} color="#10b981" /> 📥 Gelirler / Havaleler ({selectedTxnIds.size} / {(pendingData?.transactions || []).length})
          </button>

          <button 
            className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('expenses')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <TrendingDown size={16} color="#fb7185" /> 📤 Giderler / Harcamalar ({selectedExpIds.size} / {expensesList.length})
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {activeTab === 'incomes' && (
            <div>
              {(pendingData?.transactions || []).length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Ekstrede onaylanacak gelen havale bulunamadı.</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Seç</th>
                        <th>Tarih</th>
                        <th>Gönderen</th>
                        <th>Açıklama</th>
                        <th>Gemini Eşleşme Durumu</th>
                        <th>Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingData.transactions.map(t => (
                        <tr key={t.id}>
                          <td>
                            <input 
                              type="checkbox" 
                              checked={selectedTxnIds.has(t.id)} 
                              onChange={() => toggleTxn(t.id)} 
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>{t.date}</td>
                          <td style={{ fontWeight: 600 }}>{t.senderName}</td>
                          <td style={{ fontSize: '0.85rem' }}>{t.description}</td>
                          <td>
                            {t.status === 'matched' ? (
                              <span className="badge badge-success">🤖 Otomatik Eşleşti ({t.matchedReason || 'Daire'})</span>
                            ) : (
                              <span className="badge badge-warning">⚠️ Manuel Eşleşecek</span>
                            )}
                          </td>
                          <td style={{ fontWeight: 700, color: '#10b981' }}>₺{(t.amount || 0).toLocaleString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div>
              {expensesList.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Ekstrede onaylanacak giden harcama bulunamadı.</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Seç</th>
                        <th>Tarih</th>
                        <th>Banka Açıklaması</th>
                        <th>AI Tespit Edilen Gider Türü</th>
                        <th>Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expensesList.map(e => (
                        <tr key={e.id}>
                          <td>
                            <input 
                              type="checkbox" 
                              checked={selectedExpIds.has(e.id)} 
                              onChange={() => toggleExp(e.id)} 
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>{e.date}</td>
                          <td style={{ fontSize: '0.85rem' }}>{e.description}</td>
                          <td>
                            <select 
                              className="form-select"
                              value={e.category}
                              onChange={(evt) => handleExpenseCategoryChange(e.id, evt.target.value)}
                              style={{ fontSize: '0.82rem', padding: '4px 8px', background: 'var(--bg-input)' }}
                            >
                              {EXPENSE_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ fontWeight: 700, color: '#fb7185' }}>₺{(e.amount || 0).toLocaleString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            İptal Et
          </button>
          <button className="btn btn-primary" onClick={handleConfirmAll} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <CheckCircle2 size={18} /> ✅ Seçili İşlemleri Onayla ve Sisteme Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
