import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  AlertCircle, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  ArrowUpRight,
  Wallet,
  Users
} from 'lucide-react';

export default function Dashboard({ 
  residents, 
  bankTransactions, 
  feeCategories, 
  setActiveTab,
  onOpenMatchModal 
}) {
  const [debtDateScope, setDebtDateScope] = useState('last_month_end'); // last_month_end (Temmuz 31), include_current (Ağustos)

  // Calculations
  const totalResidents = residents.length; // 41 Daire
  const monthlyExpectedDues = totalResidents * 2250; // 41 x 2250 = 92.250 TL

  // Calculate current month collected dues from bank transactions
  const currentMonthTxns = bankTransactions.filter(t => t.status === 'matched' && t.matchedCategory === 'aidat');
  const currentMonthCollected = currentMonthTxns.reduce((acc, t) => acc + (t.amount || 0), 0);
  const collectionPercentage = Math.min(100, Math.round((currentMonthCollected / monthlyExpectedDues) * 100)) || 0;

  const totalAidatDebts = residents.reduce((acc, r) => acc + (r.debts?.aidat || 0), 0);
  const totalExtraDebts = residents.reduce((acc, r) => {
    return acc + (r.debts?.kidem || 0) + (r.debts?.yuruyus || 0);
  }, 0);
  const grandTotalDebt = totalAidatDebts + totalExtraDebts;

  const overdue2MonthsCount = residents.filter(r => r.unpaidMonths >= 2).length;
  const unmatchedTxCount = bankTransactions.filter(t => t.status === 'unmatched').length;

  return (
    <div className="fade-in">
      {/* Month-Based Debt Evaluation Filter Banner */}
      <div className="glass-card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(79, 70, 229, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp color="#818cf8" size={20} /> Ay Bazlı Borç & Tahsilat Değerlendirmesi
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              İçinde bulunulan ay henüz bitmediği için borçlar varsayılan olarak geçen ay sonu (Temmuz 31) itibariyle hesaplanır.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Borç Değerlendirme Kapsamı:</span>
            <select 
              className="form-select" 
              value={debtDateScope} 
              onChange={(e) => setDebtDateScope(e.target.value)}
              style={{ background: 'var(--bg-input)', fontSize: '0.88rem' }}
            >
              <option value="last_month_end">📅 Geçen Ay Sonu İtibariyle (Temmuz 31)</option>
              <option value="include_current">📆 Güncel Ay Dahil (Ağustos)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Wallet size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Ay İçi Anlık Tahsilat Durumu</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              ₺{currentMonthCollected.toLocaleString('tr-TR')}
            </div>
            <div className="stat-subtext">
              Beklenen: ₺{monthlyExpectedDues.toLocaleString('tr-TR')} (41 Daire x ₺2.250) | Oran: %{collectionPercentage}
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Building2 size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Kayıtlı Daire / Sakin</div>
            <div className="stat-value">{totalResidents} Daire</div>
            <div className="stat-subtext">A & B Blok Toplam</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
            <AlertCircle size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">
              {debtDateScope === 'last_month_end' ? 'Temmuz Sonu İtibariyle Borç' : 'Ağustos Dahil Toplam Borç'}
            </div>
            <div className="stat-value" style={{ color: '#fb7185' }}>
              ₺{grandTotalDebt.toLocaleString('tr-TR')}
            </div>
            <div className="stat-subtext">
              Aidat: ₺{totalAidatDebts.toLocaleString('tr-TR')} | Ek: ₺{totalExtraDebts.toLocaleString('tr-TR')}
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <MessageSquare size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Geciken Sakinler (2+ Ay)</div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>{overdue2MonthsCount} Sakin</div>
            <div className="stat-subtext">WhatsApp uyarısı gönderilebilir</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
            <HelpCircle size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Eşleşmeyen Banka Havaleleri</div>
            <div className="stat-value" style={{ color: '#22d3ee' }}>{unmatchedTxCount} İşlem</div>
            <div className="stat-subtext">İsimsiz / 3. şahıs havaleleri</div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Column: Action Required & Unmatched Havaleler */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={20} color="#22d3ee" />
                Eşleşmeyen / Şüpheli Banka Havaleleri
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Açıklamada ismi çıkmayan veya 3. şahıslardan (eş, şirket, akraba) gelen ödemeler
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('reconciliation')}>
              Tümünü Gör
            </button>
          </div>

          {unmatchedTxCount === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} color="#10b981" style={{ marginBottom: '10px' }} />
              <p>Tüm banka transferleri eşleştirildi!</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Gönderen</th>
                    <th>Açıklama</th>
                    <th>Tutar</th>
                    <th>Önerilen Sakin</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {bankTransactions.filter(t => t.status === 'unmatched').slice(0, 4).map(txn => (
                    <tr key={txn.id}>
                      <td>{txn.date}</td>
                      <td style={{ fontWeight: '600', color: 'white' }}>{txn.senderName}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{txn.description}</td>
                      <td style={{ fontWeight: '700', color: '#34d399' }}>₺{txn.amount.toLocaleString('tr-TR')}</td>
                      <td>
                        {txn.suggestedResidentId ? (
                          <span className="badge-status badge-warning">
                            {residents.find(r => r.id === txn.suggestedResidentId)?.name} ({residents.find(r => r.id === txn.suggestedResidentId)?.flatNo})
                          </span>
                        ) : (
                          <span className="badge-status badge-danger">Bilinmiyor</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => onOpenMatchModal(txn)}
                        >
                          Eşleştir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Quick WhatsApp Actions */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="#25D366" />
            WhatsApp Hızlı Hatırlatma
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            En çok gecikmesi olan sakinlere tek tıkla borç mesajı gönderin.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {residents
              .filter(r => (r.debts.aidat + r.debts.kidem + r.debts.yuruyus + r.debts.asansor) > 0)
              .sort((a, b) => b.unpaidMonths - a.unpaidMonths)
              .slice(0, 4)
              .map(r => {
                const totalDebt = (r.debts.aidat || 0) + (r.debts.kidem || 0) + (r.debts.yuruyus || 0) + (r.debts.asansor || 0);
                return (
                  <div 
                    key={r.id} 
                    style={{ 
                      padding: '12px 14px', 
                      background: 'rgba(15, 23, 42, 0.6)', 
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>
                        {r.flatNo} - {r.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Top. Borç: <strong style={{ color: '#fb7185' }}>₺{totalDebt.toLocaleString('tr-TR')}</strong> 
                        {r.unpaidMonths > 0 && ` (${r.unpaidMonths} ay aidat)`}
                      </div>
                    </div>
                    <button 
                      className="btn btn-whatsapp btn-sm"
                      onClick={() => setActiveTab('whatsapp')}
                    >
                      Mesaj At
                    </button>
                  </div>
                );
              })}
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}
            onClick={() => setActiveTab('whatsapp')}
          >
            Tüm Hatırlatma Kurallarını Aç <ArrowUpRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
