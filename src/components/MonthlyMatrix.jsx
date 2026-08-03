import React, { useState } from 'react';
import { Table, Calendar, Filter, CheckCircle2, Save, Sparkles } from 'lucide-react';

const MONTHS = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];

export default function MonthlyMatrix({ residents, setResidents }) {
  const [selectedBlock, setSelectedBlock] = useState('all'); // all, A Blok, B Blok
  const [selectedFeeType, setSelectedFeeType] = useState('aidat'); // aidat, kidem

  const filteredResidents = residents.filter(r => {
    if (selectedBlock !== 'all' && r.block !== selectedBlock) return false;
    return true;
  });

  const handleCellChange = (residentId, month, value) => {
    const numericVal = parseFloat(value) || 0;
    setResidents(prev => prev.map(r => {
      if (r.id === residentId) {
        const fieldKey = selectedFeeType === 'aidat' ? 'monthlyAidat' : 'monthlyKidem';
        const updatedMonthly = { ...(r[fieldKey] || {}), [month]: numericVal };
        const newTotalPaid = Object.values(updatedMonthly).reduce((a, b) => a + b, 0);

        const updatedPayments = { ...r.payments, [selectedFeeType]: newTotalPaid };
        
        let newDebt = 0;
        if (selectedFeeType === 'aidat') {
          const expected = 7 * (r.duesAmount || 2250);
          newDebt = Math.max(0, expected - newTotalPaid);
        } else {
          newDebt = Math.max(0, 5250 - newTotalPaid);
        }

        return {
          ...r,
          [fieldKey]: updatedMonthly,
          payments: updatedPayments,
          debts: { ...r.debts, [selectedFeeType]: newDebt }
        };
      }
      return r;
    }));
  };

  return (
    <div className="fade-in">
      {/* Header and Filter */}
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar color="#38bdf8" /> Aylık Aidat & Ek Ödeme Tahakkuk Matrisi
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Excel tablonuzdaki gibi Ocak-Aralık arası aylık ödemeleri görüntüleyin ve hücreleri doğrudan güncelleyin.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              className="form-select"
              value={selectedFeeType}
              onChange={(e) => setSelectedFeeType(e.target.value)}
              style={{ background: 'var(--bg-input)' }}
            >
              <option value="aidat">1. Aylık Aidat Çizelgesi (2.250 TL/Ay)</option>
              <option value="kidem">2. Kıdem Tazminatı Çizelgesi (437,5 TL/Ay)</option>
              <option value="yuruyus">3. Yürüyüş Yolu Tadilat Çizelgesi (1.100 TL)</option>
            </select>

            <select 
              className="form-select"
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              style={{ background: 'var(--bg-input)' }}
            >
              <option value="all">Tüm Bloklar (A & B)</option>
              <option value="A Blok">Sadece A Blok</option>
              <option value="B Blok">Sadece B Blok</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="glass-card">
        <div className="table-responsive" style={{ maxHeight: '650px', overflowY: 'auto' }}>
          <table className="custom-table" style={{ fontSize: '0.85rem' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0f172a' }}>
              <tr>
                <th style={{ width: '80px' }}>Daire</th>
                <th style={{ minWidth: '160px' }}>Sakin Adı</th>
                {MONTHS.map(m => (
                  <th key={m} style={{ textAlign: 'center', minWidth: '70px', padding: '8px 4px' }}>
                    {m}
                  </th>
                ))}
                <th style={{ textAlign: 'right', minWidth: '90px' }}>TOPLAM</th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map(r => {
                const monthlyData = (selectedFeeType === 'aidat' ? r.monthlyAidat : r.monthlyKidem) || {};
                const totalPaid = Object.values(monthlyData).reduce((a, b) => a + b, 0);

                return (
                  <tr key={r.id}>
                    <td>
                      <span className="badge badge-primary">{r.flatNo}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    {MONTHS.map(m => {
                      const val = monthlyData[m];
                      const isPaid = val > 0;
                      return (
                        <td key={m} style={{ padding: '4px', textAlign: 'center' }}>
                          <input 
                            type="number"
                            step="any"
                            value={val !== undefined ? val : ''}
                            placeholder="0"
                            onChange={(e) => handleCellChange(r.id, m, e.target.value)}
                            style={{
                              width: '100%',
                              textAlign: 'center',
                              background: isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.03)',
                              border: isPaid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                              color: isPaid ? '#10b981' : 'var(--text-dim)',
                              borderRadius: '4px',
                              padding: '4px 2px',
                              fontSize: '0.8rem',
                              fontWeight: isPaid ? 600 : 400
                            }}
                          />
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#38bdf8' }}>
                      ₺{totalPaid.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
