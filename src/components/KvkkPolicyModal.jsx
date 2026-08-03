import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, EyeOff } from 'lucide-react';

export default function KvkkPolicyModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px', width: '90vw', maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <ShieldCheck color="#10b981" size={24} /> 6698 Sayılı KVKK ve Veri Güvenliği Aydınlatma Metni
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Umut Sitesi Kat Malikleri ve Sakinleri Kişisel Verilerin Korunması Politikası
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '20px', lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-main)' }}>
          <h4 style={{ color: '#818cf8', marginTop: 0 }}>1. Veri Sorumlusu Sıfatı</h4>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Umut Sitesi Yönetimi olarak kişisel verileriniz (Ad, Soyad, Blok/Daire No, İletişim Numaraları, Cari Borç/Alacak Bilgileri, IBAN) veri sorumlusu sıfatıyla işlenmektedir.
          </p>

          <h4 style={{ color: '#818cf8', marginTop: '16px' }}>2. Verilerin İşlenme Amacı ve Hukuki Sebebi</h4>
          <p>
            Kişisel verileriniz, Kat Mülkiyeti Kanunu ve Site Yönetim Planı hükümleri gereğince aidat tahakkuku yapılması, ortak giderlerin yönetilmesi, banka ödemelerinin eşleştirilmesi ve yönetim ikazlarının iletilmesi amacıyla sınırlı olarak işlenmektedir.
          </p>

          <h4 style={{ color: '#818cf8', marginTop: '16px' }}>3. Veri Güvenliği & Maskeleme (KVKK Gizleme)</h4>
          <p>
            Sistemimizde yer alan <strong>KVKK Maskeleme Modu</strong> aktif edildiğinde, daire sakinlerinin ad soyad bilgileri (Örn: <em>A*** Ö******</em>) ve telefon numaraları (Örn: <em>+90 532 *** ** 67</em>) otomatik olarak maskelenerek 3. kişilerin izinsiz erişimine karşı tam koruma sağlanır.
          </p>

          <h4 style={{ color: '#818cf8', marginTop: '16px' }}>4. Otomatik Versiyon Yedeği & Audit Kayıtları</h4>
          <p>
            Veri kaybını ve yetkisiz müdahaleleri önlemek amacıyla sistem üzerinde yapılan her veri değişikliğinde otomatik şifreli versiyon snapshot yedeği alınır ve tüm yönetici işlemleri Audit Log kayıtlarında saklanır.
          </p>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px', borderRadius: '8px', marginTop: '20px' }}>
            <span style={{ fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> KVKK Uyum Beyanı
            </span>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
              Umut Sitesi Yönetim Portalı v3.0, 6698 Sayılı KVKK standartlarına tam uyumlu olarak geliştirilmiştir. Kişisel veriler hiçbir 3. taraf pazarlama kuruluşuyla paylaşılmaz.
            </p>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Anladım ve Okudum
          </button>
        </div>
      </div>
    </div>
  );
}
