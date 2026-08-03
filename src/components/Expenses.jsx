import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  Calendar, 
  Tag, 
  CreditCard,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function Expenses({ expenses, setExpenses, residents }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Asansör Bakım',
    description: '',
    scope: 'Ortak',
    amount: 1500,
    paymentType: 'Banka',
    receiptNo: ''
  });

  // Calculate totals
  const totalCollected = residents.reduce((acc, r) => {
    const aidatP = r.payments?.aidat || 0;
    const kidemP = r.payments?.kidem || 0;
    const yuruyusP = r.payments?.yuruyus || 0;
    return acc + aidatP + kidemP + yuruyusP;
  }, 0);

  const totalSpent = expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
  const cashBalance = totalCollected - totalSpent;

  const handleAddExpense = (e) => {
    e.preventDefault();
    const created = {
      id: `EXP-${Date.now()}`,
      ...newExpense,
      amount: parseFloat(newExpense.amount) || 0
    };
    setExpenses([created, ...expenses]);
    setModalOpen(false);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: 'Asansör Bakım',
      description: '',
      scope: 'Ortak',
      amount: 1500,
      paymentType: 'Banka',
      receiptNo: ''
    });
  };

  const handleDeleteExpense = (id) => {
    if (confirm('Bu gider kaydını silmek istediğinize emin misiniz?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  return (
    <div className="fade-in">
      {/* Financial Overview Summary */}
      <div className="stat-grid" style={{ marginBottom: '24px' }}>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <TrendingUp size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Toplam Tahsilat (Gelirler)</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              ₺{totalCollected.toLocaleString('tr-TR')}
            </div>
            <div className="stat-subtext">Aidat ve ek fon ödemeleri</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
            <TrendingDown size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Toplam Giderler</div>
            <div className="stat-value" style={{ color: '#fb7185' }}>
              ₺{totalSpent.toLocaleString('tr-TR')}
            </div>
            <div className="stat-subtext">{expenses.length} adet harcama kaydı</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Wallet size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Net Kasa & Banka Durumu</div>
            <div className="stat-value" style={{ color: cashBalance >= 0 ? '#38bdf8' : '#fb7185' }}>
              ₺{cashBalance.toLocaleString('tr-TR')}
            </div>
            <div className="stat-subtext">Mevcut kullanılabilir bakiye</div>
          </div>
        </div>
      </div>

      {/* Main Expense Table Header */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Receipt color="#fb7185" /> Site Gider Takibi ve Harcama Kayıtları
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Fatura, bakım, temizlik, elektrik ve ortak alan harcamalarını işleyin.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Yeni Gider Kaydı Ekle
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Gider Türü</th>
                <th>Açıklama</th>
                <th>Kapsam</th>
                <th>Ödeme Şekli</th>
                <th>Makbuz / Fatura No</th>
                <th>Tutar</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Henüz kayıtlı bir gider bulunmuyor.
                  </td>
                </tr>
              ) : (
                expenses.map(e => (
                  <tr key={e.id}>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="var(--text-muted)" /> {e.date}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info">{e.category}</span>
                    </td>
                    <td>{e.description || '-'}</td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        {e.scope}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                        <CreditCard size={14} color="#818cf8" /> {e.paymentType}
                      </span>
                    </td>
                    <td>{e.receiptNo || '-'}</td>
                    <td style={{ fontWeight: 600, color: '#fb7185' }}>
                      ₺{parseFloat(e.amount).toLocaleString('tr-TR')}
                    </td>
                    <td>
                      <button 
                        className="action-btn action-btn-delete"
                        onClick={() => handleDeleteExpense(e.id)}
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3><Plus color="#fb7185" /> Yeni Gider / Harcama Ekle</h3>
              <button className="close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label className="form-label">Gider Tarihi</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gider Türü / Kalemi</label>
                <select 
                  className="form-select"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  <option value="Asansör Bakım">Asansör Bakım</option>
                  <option value="Bahçe Bakımı & Sulama">Bahçe Bakımı & Sulama</option>
                  <option value="Ortak Elektrik Faturası">Ortak Elektrik Faturası</option>
                  <option value="Temizlik ve Çöp Temizlik">Temizlik ve Çöp Temizlik</option>
                  <option value="Kıdem Tazminatı Ödemesi">Kıdem Tazminatı Ödemesi</option>
                  <option value="Yürüyüş Yolu Malzeme">Yürüyüş Yolu Malzeme</option>
                  <option value="Diğer Harcama">Diğer Harcama</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Açıklama / Detay</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Örn: A Blok Asansör halat değişimi malzemeleri"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Kapsam</label>
                  <select 
                    className="form-select"
                    value={newExpense.scope}
                    onChange={(e) => setNewExpense({ ...newExpense, scope: e.target.value })}
                  >
                    <option value="Ortak">Ortak (A & B)</option>
                    <option value="A Blok">Sadece A Blok</option>
                    <option value="B Blok">Sadece B Blok</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ödeme Şekli</label>
                  <select 
                    className="form-select"
                    value={newExpense.paymentType}
                    onChange={(e) => setNewExpense({ ...newExpense, paymentType: e.target.value })}
                  >
                    <option value="Banka">Banka Transferi / EFT</option>
                    <option value="Nakit">Nakit Kasa Ödemesi</option>
                    <option value="Kredi Kartı">Kredi Kartı</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tutar (TL)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Makbuz / Fatura No</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="MKB-00123"
                    value={newExpense.receiptNo}
                    onChange={(e) => setNewExpense({ ...newExpense, receiptNo: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#fb7185' }}>
                  <Plus size={16} /> Gider Kaydını Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
