import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, CheckCircle } from 'lucide-react';

export default function FeeCategories({ feeCategories, setFeeCategories }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    defaultAmount: 1000,
    period: 'Tek Seferlik',
    color: '#6366f1'
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now().toString(),
      ...newCategory
    };
    setFeeCategories([...feeCategories, created]);
    setModalOpen(false);
    setNewCategory({ name: '', defaultAmount: 1000, period: 'Tek Seferlik', color: '#6366f1' });
  };

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers color="#ec4899" /> Aidat & Ek Ödeme Kalemleri Yönetimi
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Düzenli aidatlar haricindeki ek ödemeleri (kıdem tazminatı, yürüyüş yolu, demirbaş vb.) burada tanımlayın.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Yeni Ödeme Kalemi Ekle
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {feeCategories.map(cat => (
          <div key={cat.id} className="glass-card" style={{ borderLeft: `4px solid ${cat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>{cat.name}</h3>
              <span className="badge-status badge-info">{cat.period}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
              ₺{cat.defaultAmount.toLocaleString('tr-TR')}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Standart Varsayılan Daire Başı Tutar
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Yeni Ödeme / Borç Kalemi Tanımla</h3>
              <button className="close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label className="form-label">Kalem / Ödeme Adı</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Örn: Yürüyüş Yolu Tadilatı" 
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Varsayılan Tutar (TL)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newCategory.defaultAmount}
                    onChange={(e) => setNewCategory({ ...newCategory, defaultAmount: parseFloat(e.target.value) })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ödeme Periyodu</label>
                  <select 
                    className="form-select"
                    value={newCategory.period}
                    onChange={(e) => setNewCategory({ ...newCategory, period: e.target.value })}
                  >
                    <option value="Tek Seferlik">Tek Seferlik Ek Ödeme</option>
                    <option value="Aylık">Aylık Düzenli</option>
                    <option value="Yıllık">Yıllık</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kalemi Ekle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
