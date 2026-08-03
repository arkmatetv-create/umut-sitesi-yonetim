import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  Plus, 
  FileText, 
  Phone, 
  CreditCard, 
  UserCheck, 
  AlertCircle, 
  Check, 
  Edit, 
  Download,
  DollarSign,
  UploadCloud,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { parseSiteManagementExcel } from '../utils/excelImporter';
import { exportToExcel, exportToPDF } from '../utils/reportExporter';

export default function ResidentLedger({ 
  residents, 
  setResidents, 
  feeCategories,
  onSelectResidentForWhatsApp
}) {
  const handleExportLedgerExcel = () => {
    const data = residents.map(r => ({
      'Daire No': r.flatNo,
      'Ev Sahibi (Malik)': r.ownerName || r.name,
      'Kiracı / Oturan': r.tenantName || 'Ev Sahibi Oturuyor',
      'Telefon': r.phone,
      'Aylık Aidat Borcu (TL)': r.debts?.aidat || 0,
      'Kıdem Tazminatı Borcu (TL)': r.debts?.kidem || 0,
      'Yürüyüş Yolu Borcu (TL)': r.debts?.yuruyus || 0,
      'Toplam Kalan Borç (TL)': (r.debts?.aidat || 0) + (r.debts?.kidem || 0) + (r.debts?.yuruyus || 0)
    }));
    exportToExcel(data, 'Umut_Sitesi_Daire_Cari_Hesaplar');
  };

  const handleExportLedgerPDF = () => {
    const headers = ['Daire No', 'Ev Sahibi (Malik)', 'Kiracı / Oturan', 'Telefon', 'Aidat Borcu', 'Kıdem Borcu', 'Yürüyüş Borcu', 'Toplam Borç'];
    const rows = residents.map(r => [
      r.flatNo,
      r.ownerName || r.name,
      r.tenantName || 'Ev Sahibi Oturuyor',
      r.phone,
      `₺${(r.debts?.aidat || 0).toLocaleString('tr-TR')}`,
      `₺${(r.debts?.kidem || 0).toLocaleString('tr-TR')}`,
      `₺${(r.debts?.yuruyus || 0).toLocaleString('tr-TR')}`,
      `₺${((r.debts?.aidat || 0) + (r.debts?.kidem || 0) + (r.debts?.yuruyus || 0)).toLocaleString('tr-TR')}`
    ]);
    exportToPDF('Daire Cari Hesap Borç Ekstreleri', headers, rows, 'Umut_Sitesi_Cari_Hesaplar');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all'); // all, A Blok, B Blok
  const [debtFilter, setDebtFilter] = useState('all'); // all, only_debtors, 2months_plus

  const [selectedResident, setSelectedResident] = useState(null);
  const [newResidentModal, setNewResidentModal] = useState(false);
  const [newResident, setNewResident] = useState({
    flatNo: '',
    block: 'A Blok',
    number: 1,
    name: '',
    type: 'Ev Sahibi',
    phone: '',
    email: '',
    duesAmount: 1500,
    notes: ''
  });

  const [addDebtModal, setAddDebtModal] = useState(false);
  const [debtCategory, setDebtCategory] = useState('aidat');
  const [debtAmount, setDebtAmount] = useState(1500);

  // Export Resident List to Excel
  const exportToExcel = () => {
    const data = residents.map(r => ({
      'Daire No': r.flatNo,
      'Blok': r.block,
      'Sakin Adı': r.name,
      'Tür': r.type,
      'Telefon': r.phone,
      'Aidat Borcu (TL)': r.debts.aidat || 0,
      'Kıdem Tazminatı Borcu (TL)': r.debts.kidem || 0,
      'Yürüyüş Yolu Borcu (TL)': r.debts.yuruyus || 0,
      'Asansör Borcu (TL)': r.debts.asansor || 0,
      'Toplam Borç (TL)': (r.debts.aidat || 0) + (r.debts.kidem || 0) + (r.debts.yuruyus || 0) + (r.debts.asansor || 0),
      'Geciken Ay Sayısı': r.unpaidMonths || 0,
      'Kayıtlı Takma İsimler': (r.aliases || []).join(', ')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sakinler_Cari_Listesi');
    XLSX.writeFile(wb, `Site_Aidat_ve_Borc_Listesi_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filtered residents
  const filteredResidents = residents.filter(r => {
    if (blockFilter !== 'all' && r.block !== blockFilter) return false;
    
    const totalDebt = (r.debts.aidat || 0) + (r.debts.kidem || 0) + (r.debts.yuruyus || 0) + (r.debts.asansor || 0);
    if (debtFilter === 'only_debtors' && totalDebt <= 0) return false;
    if (debtFilter === '2months_plus' && r.unpaidMonths < 2) return false;

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return r.name.toLowerCase().includes(s) || 
             r.flatNo.toLowerCase().includes(s) || 
             r.phone.includes(s) ||
             (r.aliases && r.aliases.some(a => a.toLowerCase().includes(s)));
    }
    return true;
  });

  const handleCreateResident = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      ...newResident,
      ibans: [],
      aliases: [newResident.name],
      debts: { aidat: 0, kidem: 0, yuruyus: 0, asansor: 0 },
      unpaidMonths: 0
    };
    setResidents([created, ...residents]);
    setNewResidentModal(false);
  };

  const handleAddManualDebt = (e) => {
    e.preventDefault();
    if (!selectedResident) return;

    setResidents(prev => prev.map(r => {
      if (r.id === selectedResident.id) {
        const updatedDebts = { ...r.debts, [debtCategory]: (r.debts[debtCategory] || 0) + parseFloat(debtAmount) };
        return {
          ...r,
          debts: updatedDebts,
          unpaidMonths: debtCategory === 'aidat' ? r.unpaidMonths + 1 : r.unpaidMonths
        };
      }
      return r;
    }));

    setAddDebtModal(false);
    setSelectedResident(null);
  };

  // Handle Importing Multi-sheet Excel
  const [importStatus, setImportStatus] = useState('');
  const handleImportExcelFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const parsed = parseSiteManagementExcel(wb);
        if (parsed.residents && parsed.residents.length > 0) {
          setResidents(parsed.residents);
          setImportStatus(`✅ ${parsed.residents.length} daire ve borç dökümü Excel'den yüklendi!`);
          setTimeout(() => setImportStatus(''), 6000);
        } else {
          alert('Excel dosyasında daire listesi okunamadı.');
        }
      } catch (err) {
        console.error(err);
        alert('Excel dosyası işlenirken hata oluştu: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="fade-in">
      {/* Action Header */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building color="#818cf8" /> Sakin ve Daire Cari Hesap Yönetimi
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Dairelerin aidat borçlarını, ek ödemelerini (kıdem tazminatı, yürüyüş yolu) ve cari ekstrelerini yönetin.
            </p>
            {importStatus && (
              <div style={{ marginTop: '8px', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                {importStatus}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={handleExportLedgerExcel}>
              <FileSpreadsheet size={18} color="#10b981" /> Excel Raporu (.xlsx)
            </button>
            <button className="btn btn-secondary" onClick={handleExportLedgerPDF}>
              <Download size={18} color="#fb7185" /> PDF Raporu (.pdf)
            </button>
            <label className="btn btn-primary" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <UploadCloud size={18} /> Excel Yükle
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleImportExcelFile} 
                style={{ display: 'none' }} 
              />
            </label>
            <button className="btn btn-secondary" onClick={() => setNewResidentModal(true)}>
              <Plus size={18} /> Yeni Daire
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
            placeholder="Daire no, sakin adı, telefon veya takma ad ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="form-select" 
          style={{ width: 'auto' }}
          value={blockFilter} 
          onChange={(e) => setBlockFilter(e.target.value)}
        >
          <option value="all">Tüm Bloklar</option>
          <option value="A Blok">A Blok</option>
          <option value="B Blok">B Blok</option>
        </select>

        <select 
          className="form-select" 
          style={{ width: 'auto' }}
          value={debtFilter} 
          onChange={(e) => setDebtFilter(e.target.value)}
        >
          <option value="all">Tüm Sakinler</option>
          <option value="only_debtors">Sadece Borcu Olanlar</option>
          <option value="2months_plus">Gecikmiş Aidat (2+ Ay)</option>
        </select>
      </div>

      {/* Resident Table */}
      <div className="glass-card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Daire No</th>
                <th>Ev Sahibi (Malik)</th>
                <th>Kiracı / Oturan</th>
                <th>İletişim (Telefon)</th>
                <th>Aylık Aidat Borcu</th>
                <th>Ek Ödemeler (Kıdem/Yol)</th>
                <th>Toplam Kalan Borç</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map(r => {
                const totalAidat = r.debts.aidat || 0;
                const totalEk = (r.debts.kidem || 0) + (r.debts.yuruyus || 0) + (r.debts.asansor || 0);
                const grandTotal = totalAidat + totalEk;

                return (
                  <tr key={r.id}>
                    <td>
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: '#a5b4fc' }}>
                        {r.flatNo}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'white', display: 'block' }}>{r.ownerName || r.name}</strong>
                    </td>
                    <td>
                      {r.tenantName ? (
                        <div>
                          <strong style={{ color: '#38bdf8' }}>{r.tenantName}</strong>
                          <span className="badge-status badge-warning" style={{ fontSize: '0.7rem', padding: '1px 5px', marginLeft: '6px' }}>
                            Kiracı
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Ev Sahibi Oturuyor</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Phone size={14} /> {r.phone}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: totalAidat > 0 ? '#fb7185' : '#34d399' }}>
                        ₺{totalAidat.toLocaleString('tr-TR')}
                      </strong>
                      {r.unpaidMonths > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
                          ({r.unpaidMonths} ay gecikme)
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {r.debts.kidem > 0 && (
                          <div style={{ color: '#f59e0b', fontWeight: 600 }}>
                            Kıdem: ₺{r.debts.kidem.toLocaleString('tr-TR')}
                          </div>
                        )}
                        {r.debts.yuruyus > 0 && (
                          <div style={{ color: '#10b981', fontWeight: 600 }}>
                            Yol: ₺{r.debts.yuruyus.toLocaleString('tr-TR')}
                          </div>
                        )}
                        {(!r.debts.kidem && !r.debts.yuruyus) && (
                          <span style={{ color: '#34d399' }}>₺0</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1.05rem', color: grandTotal > 0 ? '#fb7185' : '#34d399' }}>
                        ₺{grandTotal.toLocaleString('tr-TR')}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '180px' }}>
                        {(r.aliases || []).join(', ')}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedResident(r)}
                          title="Cari Hesap Ekstresi Detayı"
                        >
                          <FileText size={14} /> Ekstre
                        </button>
                        <button 
                          className="btn btn-whatsapp btn-sm"
                          onClick={() => onSelectResidentForWhatsApp(r)}
                          title="WhatsApp İkazı Gönder"
                        >
                          WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resident Ledger Detail Modal */}
      {selectedResident && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.3rem' }}>{selectedResident.flatNo} - {selectedResident.name} Cari Hesap Ekstresi</h3>
                <span className="badge-status badge-info">{selectedResident.type}</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedResident(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Telefon / WhatsApp</div>
                <div style={{ fontWeight: '600', color: 'white' }}>+90 {selectedResident.phone}</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tanımlı Takma Adlar / 3. Şahıslar</div>
                <div style={{ fontWeight: '600', color: '#a5b4fc', fontSize: '0.85rem' }}>
                  {(selectedResident.aliases || []).join(', ') || 'Takma ad yok'}
                </div>
              </div>
            </div>

            <h4 style={{ marginBottom: '10px', fontSize: '1rem', color: '#a5b4fc' }}>Borç Kalemleri Detayı</h4>
            <div className="table-container" style={{ marginBottom: '20px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Kalem Adı</th>
                    <th>Türü</th>
                    <th>Borç Tutarı</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Aylık Aidat Borcu</td>
                    <td>Düzenli ({selectedResident.unpaidMonths} ay)</td>
                    <td style={{ color: selectedResident.debts.aidat > 0 ? '#fb7185' : '#34d399', fontWeight: '700' }}>
                      ₺{(selectedResident.debts.aidat || 0).toLocaleString('tr-TR')}
                    </td>
                    <td>
                      {selectedResident.debts.aidat > 0 ? (
                        <span className="badge-status badge-danger">Ödenmedi</span>
                      ) : (
                        <span className="badge-status badge-success">Ödendi</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Kıdem Tazminatı Fonu</td>
                    <td>Ek Ödeme</td>
                    <td style={{ color: selectedResident.debts.kidem > 0 ? '#fb7185' : '#34d399', fontWeight: '700' }}>
                      ₺{(selectedResident.debts.kidem || 0).toLocaleString('tr-TR')}
                    </td>
                    <td>
                      {selectedResident.debts.kidem > 0 ? (
                        <span className="badge-status badge-warning">Ödenmedi</span>
                      ) : (
                        <span className="badge-status badge-success">Ödendi</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Yürüyüş Yolu Tadilatı</td>
                    <td>Ek Ödeme</td>
                    <td style={{ color: selectedResident.debts.yuruyus > 0 ? '#fb7185' : '#34d399', fontWeight: '700' }}>
                      ₺{(selectedResident.debts.yuruyus || 0).toLocaleString('tr-TR')}
                    </td>
                    <td>
                      {selectedResident.debts.yuruyus > 0 ? (
                        <span className="badge-status badge-warning">Ödenmedi</span>
                      ) : (
                        <span className="badge-status badge-success">Ödendi</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Asansör Revizyonu</td>
                    <td>Ek Ödeme</td>
                    <td style={{ color: selectedResident.debts.asansor > 0 ? '#fb7185' : '#34d399', fontWeight: '700' }}>
                      ₺{(selectedResident.debts.asansor || 0).toLocaleString('tr-TR')}
                    </td>
                    <td>
                      {selectedResident.debts.asansor > 0 ? (
                        <span className="badge-status badge-warning">Ödenmedi</span>
                      ) : (
                        <span className="badge-status badge-success">Ödendi</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setAddDebtModal(true);
                }}
              >
                <Plus size={16} /> Manuel Borç / Tahakkuk Ekle
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-whatsapp"
                  onClick={() => {
                    onSelectResidentForWhatsApp(selectedResident);
                    setSelectedResident(null);
                  }}
                >
                  WhatsApp Borç Mesajı Gönder
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedResident(null)}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Debt Modal */}
      {addDebtModal && selectedResident && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedResident.flatNo} - Borç / Ek Ödeme Tahakkuk Ettir</h3>
              <button className="close-btn" onClick={() => setAddDebtModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddManualDebt}>
              <div className="form-group">
                <label className="form-label">Borç Kategorisi</label>
                <select 
                  className="form-select" 
                  value={debtCategory} 
                  onChange={(e) => setDebtCategory(e.target.value)}
                >
                  <option value="aidat">Aylık Aidat Borcu</option>
                  <option value="kidem">Kıdem Tazminatı Ek Ödemesi</option>
                  <option value="yuruyus">Yürüyüş Yolu Tadilatı</option>
                  <option value="asansor">Asansör Revizyonu</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tutar (TL)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={debtAmount} 
                  onChange={(e) => setDebtAmount(e.target.value)} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setAddDebtModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Borcu Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Resident Modal */}
      {newResidentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Yeni Daire ve Sakin Kaydı</h3>
              <button className="close-btn" onClick={() => setNewResidentModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateResident}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Daire Kodu (Örn: A-05)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newResident.flatNo}
                    onChange={(e) => setNewResident({ ...newResident, flatNo: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Blok</label>
                  <select 
                    className="form-select"
                    value={newResident.block}
                    onChange={(e) => setNewResident({ ...newResident, block: e.target.value })}
                  >
                    <option value="A Blok">A Blok</option>
                    <option value="B Blok">B Blok</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sakin Adı Soyadı</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newResident.name}
                  onChange={(e) => setNewResident({ ...newResident, name: e.target.value })}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Tür</label>
                  <select 
                    className="form-select"
                    value={newResident.type}
                    onChange={(e) => setNewResident({ ...newResident, type: e.target.value })}
                  >
                    <option value="Ev Sahibi">Ev Sahibi</option>
                    <option value="Kiracı">Kiracı</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cep Telefonu (WhatsApp)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="5XXXXXXXXX"
                    value={newResident.phone}
                    onChange={(e) => setNewResident({ ...newResident, phone: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setNewResidentModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Daireyi Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
