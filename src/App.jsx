import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Receipt, 
  Users, 
  MessageSquare, 
  Layers, 
  HelpCircle,
  Sparkles,
  ShieldCheck,
  UploadCloud,
  Calendar,
  Wallet,
  Settings as SettingsIcon,
  LogOut,
  UserCheck
} from 'lucide-react';
import { parseSiteManagementExcel } from './utils/excelImporter';
import * as XLSX from 'xlsx';

import Dashboard from './components/Dashboard';
import BankReconciliation from './components/BankReconciliation';
import ResidentLedger from './components/ResidentLedger';
import WhatsAppReminder from './components/WhatsAppReminder';
import FeeCategories from './components/FeeCategories';
import Expenses from './components/Expenses';
import MonthlyMatrix from './components/MonthlyMatrix';
import Settings from './components/Settings';
import LoginModal from './components/LoginModal';
import MatchModal from './components/MatchModal';

import { 
  getSiteSettings, 
  saveSiteSettings, 
  createBackupSnapshot, 
  addAuditLog 
} from './utils/backupManager';

import { 
  INITIAL_RESIDENTS, 
  INITIAL_BANK_TRANSACTIONS, 
  INITIAL_FEE_CATEGORIES, 
  INITIAL_MESSAGE_TEMPLATES,
  INITIAL_EXPENSES
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [residents, setResidents] = useState(INITIAL_RESIDENTS);
  const [bankTransactions, setBankTransactions] = useState(INITIAL_BANK_TRANSACTIONS);
  const [feeCategories, setFeeCategories] = useState(INITIAL_FEE_CATEGORIES);
  const [templates, setTemplates] = useState(INITIAL_MESSAGE_TEMPLATES);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES || []);

  const [siteSettings, setSiteSettings] = useState(getSiteSettings());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentManager, setCurrentManager] = useState('Yönetici');

  const [activeMatchTxn, setActiveMatchTxn] = useState(null);
  const [preselectedWhatsAppResident, setPreselectedWhatsAppResident] = useState(null);

  // Handle Match Confirmation (Alias Learning + Debt Reduction)
  const handleConfirmMatch = ({ transactionId, residentId, category, senderName, amount, saveAlias, deductDebt }) => {
    // 1. Update Bank Transaction status
    setBankTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: 'matched',
          matchedResidentId: residentId,
          matchedCategory: category,
          confidence: 'high',
          reason: `Manuel Eşleşti & Hafızaya Alındı (${senderName})`
        };
      }
      return t;
    }));

    // 2. Update Resident (Save Alias & Deduct Debt)
    setResidents(prev => prev.map(r => {
      if (r.id === residentId) {
        const updatedAliases = saveAlias && !r.aliases?.includes(senderName)
          ? [...(r.aliases || []), senderName]
          : r.aliases;

        let updatedDebts = { ...r.debts };
        let updatedUnpaidMonths = r.unpaidMonths;

        if (deductDebt) {
          const currentCategoryDebt = updatedDebts[category] || 0;
          const newCategoryDebt = Math.max(0, currentCategoryDebt - amount);
          updatedDebts[category] = newCategoryDebt;

          if (category === 'aidat' && newCategoryDebt === 0) {
            updatedUnpaidMonths = 0;
          }
        }

        return {
          ...r,
          aliases: updatedAliases,
          debts: updatedDebts,
          unpaidMonths: updatedUnpaidMonths
        };
      }
      return r;
    }));
  };

  const unmatchedCount = bankTransactions.filter(t => t.status === 'unmatched').length;

  if (!isLoggedIn) {
    return (
      <LoginModal 
        onLoginSuccess={(name) => {
          setIsLoggedIn(true);
          setCurrentManager(name || 'Yönetici');
          addAuditLog('Sisteme Giriş Yapıldı', 'Yönetici oturum açtı', name || 'Yönetici');
        }}
        siteSettings={siteSettings}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Building2 size={24} />
          </div>
          <div className="logo-text">
            <h2>{siteSettings.siteName || 'Umut Sitesi'}</h2>
            <span>Aidat & WhatsApp Takip</span>
          </div>
        </div>

        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Genel Bakış</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'reconciliation' ? 'active' : ''}`}
            onClick={() => setActiveTab('reconciliation')}
          >
            <Receipt size={20} />
            <span>Banka Eşleştirme</span>
            {unmatchedCount > 0 && <span className="badge">{unmatchedCount}</span>}
          </div>

          <div 
            className={`nav-item ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >
            <Users size={20} />
            <span>Daire Cari Hesaplar</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => {
              setPreselectedWhatsAppResident(null);
              setActiveTab('whatsapp');
            }}
          >
            <MessageSquare size={20} />
            <span>WhatsApp Hatırlatma</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <Calendar size={20} />
            <span>Aylık Çizelge (Ocak-Aralık)</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <Wallet size={20} />
            <span>Gider Takip & Kasa</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Layers size={20} />
            <span>Aidat & Ek Ödemeler</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={20} />
            <span>Ayarlar & Güvenlik</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <ShieldCheck size={16} color="#10b981" />
          <span>Site Yönetim Portalı v3.0 PWA</span>
        </div>
      </aside>

      {/* Main Area */}
      <main className="main-wrapper">
        <header className="top-bar">
          <div className="top-bar-title">
            <h1>
              {activeTab === 'dashboard' && 'Site Yönetim Paneli'}
              {activeTab === 'reconciliation' && 'Banka Havalesi Eşleştirme & Otomatik Ayrıştırma'}
              {activeTab === 'ledger' && 'Sakin & Daire Cari Hesap Ekstreleri'}
              {activeTab === 'matrix' && 'Aylık Tahakkuk & Ödeme Matrisi'}
              {activeTab === 'expenses' && 'Site Gider Takibi ve Kasa Bakiyesi'}
              {activeTab === 'whatsapp' && 'Kurallı WhatsApp Borç Hatırlatma Modülü'}
              {activeTab === 'categories' && 'Aidat ve Ek Ödeme Kalemleri'}
              {activeTab === 'settings' && 'Site Ayarları, Versiyon Yedekleri & Loglar'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Aidat tahsilatı, eşleşmeyen havaleler ve gecikmiş borç özetleri.'}
              {activeTab === 'reconciliation' && '3. şahıslardan gelen ve isimsiz banka havalelerini sakine bağlayın.'}
              {activeTab === 'ledger' && 'A & B blok sakinlerinin aidat ve ek ödeme (kıdem/yol) durumları.'}
              {activeTab === 'matrix' && 'Excel stilinde tüm aylık aidat ve kıdem tazminatı ödeme matrisi.'}
              {activeTab === 'expenses' && 'Faturalar, bakımlar ve kasanın anlık gelir-gider dengesi.'}
              {activeTab === 'whatsapp' && 'Kişiselleştirilmiş borç şablonlarıyla tek tıkla WhatsApp ikazı gönderin.'}
              {activeTab === 'categories' && 'Yürüyüş yolu, kıdem tazminatı gibi özel ek borçlandırmalar.'}
              {activeTab === 'settings' && 'Site ünvanı, şifre değişikliği, otomatik versiyon geçmişi ve audit loglar.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <UserCheck size={16} color="#10b981" />
              <span>{currentManager}</span>
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  addAuditLog('Oturum Kapatıldı', 'Yönetici çıkış yaptı', currentManager);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fb7185', marginLeft: '6px', display: 'flex', alignItems: 'center' }}
                title="Oturumu Kapat"
              >
                <LogOut size={16} />
              </button>
            </div>

            <label className="btn btn-primary" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.85rem' }}>
              <UploadCloud size={16} /> Excel Yükle
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    try {
                      const bstr = evt.target.result;
                      const wb = XLSX.read(bstr, { type: 'binary' });
                      const parsed = parseSiteManagementExcel(wb);
                      if (parsed.residents && parsed.residents.length > 0) {
                        createBackupSnapshot({ residents, expenses, feeCategories, bankTransactions, settings: siteSettings }, 'Excel Yükleme Öncesi Yedeği');
                        setResidents(parsed.residents);
                        if (parsed.expenses) setExpenses(parsed.expenses);
                        addAuditLog('Excel Senkronize Edildi', `${parsed.residents.length} daire aktarıldı`, currentManager);
                        alert(`✅ ${parsed.residents.length} daire ve tüm borçlar Excel'den başarıyla yüklendi!`);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  };
                  reader.readAsBinaryString(file);
                }} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
        </header>

        {/* Dynamic Tab Render */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            residents={residents}
            bankTransactions={bankTransactions}
            feeCategories={feeCategories}
            setActiveTab={setActiveTab}
            onOpenMatchModal={(txn) => setActiveMatchTxn(txn)}
          />
        )}

        {activeTab === 'reconciliation' && (
          <BankReconciliation 
            bankTransactions={bankTransactions}
            setBankTransactions={setBankTransactions}
            residents={residents}
            setResidents={setResidents}
            feeCategories={feeCategories}
            setExpenses={setExpenses}
            onOpenMatchModal={(txn) => setActiveMatchTxn(txn)}
          />
        )}

        {activeTab === 'ledger' && (
          <ResidentLedger 
            residents={residents}
            setResidents={setResidents}
            feeCategories={feeCategories}
            onSelectResidentForWhatsApp={(resident) => {
              setPreselectedWhatsAppResident(resident);
              setActiveTab('whatsapp');
            }}
          />
        )}

        {activeTab === 'matrix' && (
          <MonthlyMatrix 
            residents={residents}
            setResidents={setResidents}
          />
        )}

        {activeTab === 'expenses' && (
          <Expenses 
            expenses={expenses}
            setExpenses={setExpenses}
            residents={residents}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppReminder 
            residents={residents}
            setResidents={setResidents}
            templates={templates}
            setTemplates={setTemplates}
            preselectedResident={preselectedWhatsAppResident}
          />
        )}

        {activeTab === 'categories' && (
          <FeeCategories 
            feeCategories={feeCategories}
            setFeeCategories={setFeeCategories}
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            residents={residents}
            setResidents={setResidents}
            expenses={expenses}
            setExpenses={setExpenses}
            bankTransactions={bankTransactions}
            feeCategories={feeCategories}
            currentManager={currentManager}
          />
        )}
      </main>

      {/* Match Modal */}
      {activeMatchTxn && (
        <MatchModal 
          transaction={activeMatchTxn}
          residents={residents}
          feeCategories={feeCategories}
          onClose={() => setActiveMatchTxn(null)}
          onConfirmMatch={handleConfirmMatch}
        />
      )}
    </div>
  );
}
