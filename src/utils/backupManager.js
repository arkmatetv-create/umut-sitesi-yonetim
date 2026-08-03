// Backup and Audit Log Manager

const BACKUP_STORAGE_KEY = 'site_mgmt_backups_v1';
const LOGS_STORAGE_KEY = 'site_mgmt_logs_v1';
const SETTINGS_STORAGE_KEY = 'site_mgmt_settings_v1';

export const DEFAULT_SITE_SETTINGS = {
  siteName: 'Umut Sitesi Yönetimi',
  address: 'Atatürk Mah. Site Sok. No:12',
  bankIban: 'TR14 0006 2000 4460 0006 2894 65',
  bankName: 'Garanti BBVA',
  defaultDues: 2250,
  defaultKidem: 437.5,
  defaultYuruyus: 1100,
  dueDayOfMonth: 15,
  adminPassword: '1234'
};

// Create a timestamped snapshot
export function createBackupSnapshot(data, reason = 'Otomatik Değişiklik Yedeği') {
  try {
    const snapshots = getBackupSnapshots();
    const newSnapshot = {
      id: `BACKUP-${Date.now()}`,
      timestamp: new Date().toISOString(),
      displayDate: new Date().toLocaleString('tr-TR'),
      reason,
      data: {
        residents: data.residents,
        expenses: data.expenses,
        feeCategories: data.feeCategories,
        bankTransactions: data.bankTransactions,
        settings: data.settings
      }
    };

    // Keep up to 20 most recent snapshots
    const updatedSnapshots = [newSnapshot, ...snapshots].slice(0, 20);
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updatedSnapshots));
    return newSnapshot;
  } catch (err) {
    console.error('Backup creation error:', err);
    return null;
  }
}

export function getBackupSnapshots() {
  try {
    const raw = localStorage.getItem(BACKUP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

// Audit Trail Logger
export function addAuditLog(action, details, managerName = 'Sistem Yöneticisi') {
  try {
    const logs = getAuditLogs();
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('tr-TR'),
      managerName,
      action,
      details
    };
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
    return newLog;
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

export function getAuditLogs() {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function getSiteSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SITE_SETTINGS;
  } catch (err) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Settings save error:', err);
  }
}
