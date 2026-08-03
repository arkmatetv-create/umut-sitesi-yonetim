import React, { useState, useEffect } from 'react';
import { CheckCircle, HelpCircle, ArrowRight, BookmarkCheck } from 'lucide-react';

export default function MatchModal({ transaction, residents, feeCategories, onClose, onConfirmMatch }) {
  if (!transaction) return null;

  const [selectedResidentId, setSelectedResidentId] = useState(
    transaction.suggestedResidentId || (residents[0]?.id || '')
  );
  const [selectedCategory, setSelectedCategory] = useState(
    transaction.matchedCategory || 'aidat'
  );
  const [saveAlias, setSaveAlias] = useState(true);
  const [deductDebt, setDeductDebt] = useState(true);

  const selectedResident = residents.find(r => r.id === parseInt(selectedResidentId));

  const handleConfirm = (e) => {
    e.preventDefault();
    onConfirmMatch({
      transactionId: transaction.id,
      residentId: parseInt(selectedResidentId),
      category: selectedCategory,
      senderName: transaction.senderName,
      amount: transaction.amount,
      saveAlias,
      deductDebt
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle color="#22d3ee" /> Banka Havalesi Eşleştirme & Hafızaya Alma
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>İşlem ID: {transaction.id}</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Transaction Summary Card */}
        <div 
          style={{ 
            background: 'rgba(15, 23, 42, 0.7)', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dekont Gönderen İsim</div>
              <div style={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>{transaction.senderName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Transfer Tutarı</div>
              <div style={{ fontWeight: '700', color: '#34d399', fontSize: '1.1rem' }}>₺{transaction.amount.toLocaleString('tr-TR')}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Banka Açıklaması</div>
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>{transaction.description || 'Açıklama belirtilmemiş'}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleConfirm}>
          <div className="form-group">
            <label className="form-label">1. Bu Ödeme Hangi Daire / Sakine Ait?</label>
            <select 
              className="form-select"
              value={selectedResidentId}
              onChange={(e) => setSelectedResidentId(e.target.value)}
              required
            >
              {residents.map(r => (
                <option key={r.id} value={r.id}>
                  {r.flatNo} - {r.name} (Top. Borç: ₺{((r.debts.aidat||0)+(r.debts.kidem||0)+(r.debts.yuruyus||0)+(r.debts.asansor||0)).toLocaleString('tr-TR')})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. Hangi Ödeme Kalemine İşlensin?</label>
            <select 
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {feeCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.period})</option>
              ))}
            </select>
          </div>

          {/* Learning Memory & Debt Options */}
          <div 
            style={{ 
              background: 'rgba(99, 102, 241, 0.08)', 
              border: '1px solid var(--border-highlight)', 
              padding: '14px 16px', 
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={saveAlias} 
                onChange={(e) => setSaveAlias(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>
                <strong style={{ color: '#a5b4fc' }}>"{transaction.senderName}"</strong> ismini <strong>{selectedResident?.name}</strong> için gelecekte otomatik tanınacak takma isim (Alias) olarak kaydet.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={deductDebt} 
                onChange={(e) => setDeductDebt(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>
                ₺{transaction.amount.toLocaleString('tr-TR')} tutarı sakin hesabı kalan borcundan düşülsün.
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
            <button type="submit" className="btn btn-primary">
              <BookmarkCheck size={18} /> Eşleştirmeyi Onayla ve Öğret
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
