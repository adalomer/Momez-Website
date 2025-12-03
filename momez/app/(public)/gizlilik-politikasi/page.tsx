import Link from 'next/link'

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            🔐 Gizlilik Politikası
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Giriş
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Momez E-Ticaret olarak, müşterilerimizin gizliliğine büyük önem veriyoruz. 
                Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde ve hizmetlerimizi 
                kullandığınızda kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve 
                koruduğumuzu açıklamaktadır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Toplanan Bilgiler
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Sitemizde aşağıdaki bilgiler toplanmaktadır:
              </p>
              
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                2.1 Sizin Sağladığınız Bilgiler
              </h3>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Kayıt sırasında: Ad, soyad, e-posta, telefon numarası</li>
                <li>Sipariş sırasında: Teslimat adresi, fatura bilgileri</li>
                <li>İletişim formunda: Mesaj içeriği ve iletişim bilgileri</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                2.2 Otomatik Toplanan Bilgiler
              </h3>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>IP adresi ve coğrafi konum</li>
                <li>Tarayıcı türü ve işletim sistemi</li>
                <li>Ziyaret edilen sayfalar ve ziyaret süresi</li>
                <li>Çerezler aracılığıyla toplanan veriler</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Bilgilerin Kullanım Amaçları
              </h2>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Siparişlerinizi işleme ve teslimat</li>
                <li>Müşteri hizmetleri desteği sağlama</li>
                <li>Hesap güvenliğini sağlama</li>
                <li>Yasal yükümlülükleri yerine getirme</li>
                <li>İzin vermeniz halinde pazarlama iletişimi</li>
                <li>Hizmet kalitesini iyileştirme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Bilgi Güvenliği
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri 
                uyguluyoruz:
              </p>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <span className="text-2xl">🔒</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mt-2">SSL Şifreleme</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Tüm veri transferleri şifrelenir</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <span className="text-2xl">🛡️</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mt-2">Güvenli Sunucular</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Verileriniz güvenli sunucularda saklanır</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <span className="text-2xl">🔑</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mt-2">Şifreli Parolalar</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Parolalar hash algoritmasıyla korunur</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <span className="text-2xl">👁️</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mt-2">Erişim Kontrolü</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Sadece yetkili personel erişebilir</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Üçüncü Taraflarla Paylaşım
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Kişisel verileriniz yalnızca aşağıdaki durumlarda üçüncü taraflarla paylaşılır:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Siparişinizin teslimatı için kargo firmaları ile</li>
                <li>Ödeme işlemleri için ödeme hizmet sağlayıcıları ile</li>
                <li>Yasal zorunluluk halinde resmi kurumlar ile</li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>⚠️ Önemli:</strong> Kişisel verileriniz hiçbir koşulda pazarlama 
                  amacıyla üçüncü taraflara satılmaz veya kiralanmaz.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Çerezler
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Web sitemiz çerezler kullanmaktadır. Çerezlerin kullanımı hakkında detaylı 
                bilgi için <Link href="/cerez-politikasi" className="text-red-500 hover:underline">Çerez Politikamızı</Link> inceleyebilirsiniz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Haklarınız
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                6698 Sayılı KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Verilerinize erişim hakkı</li>
                <li>Verilerin düzeltilmesini isteme hakkı</li>
                <li>Verilerin silinmesini isteme hakkı</li>
                <li>Veri işlemeye itiraz etme hakkı</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                Detaylı bilgi için <Link href="/kvkk" className="text-red-500 hover:underline">KVKK Aydınlatma Metnimizi</Link> inceleyebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. İletişim
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Gizlilik politikamız hakkında sorularınız için:
              </p>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>E-posta:</strong> gizlilik@momez.com.tr<br />
                  <strong>Telefon:</strong> 0850 XXX XX XX
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/kvkk" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                KVKK Aydınlatma Metni →
              </Link>
              <Link 
                href="/cerez-politikasi" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Çerez Politikası →
              </Link>
              <Link 
                href="/kullanim-kosullari" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Kullanım Koşulları →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
