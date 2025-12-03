import Link from 'next/link'

export default function KVKKPage() {
  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            📋 KVKK Aydınlatma Metni
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Metni
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Veri Sorumlusu
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel 
                verileriniz; veri sorumlusu olarak <strong>Momez E-Ticaret</strong> tarafından 
                aşağıda açıklanan kapsamda işlenebilecektir.
              </p>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Şirket Unvanı:</strong> Momez E-Ticaret<br />
                  <strong>Adres:</strong> İstanbul, Türkiye<br />
                  <strong>E-posta:</strong> kvkk@momez.com.tr
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. İşlenen Kişisel Veriler
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Web sitemiz ve hizmetlerimiz kapsamında aşağıdaki kişisel verileriniz işlenmektedir:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2">Kimlik Bilgileri</h3>
                  <p className="text-slate-600 dark:text-slate-400">Ad, soyad</p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="font-bold text-green-800 dark:text-green-400 mb-2">İletişim Bilgileri</h3>
                  <p className="text-slate-600 dark:text-slate-400">E-posta adresi, telefon numarası, teslimat adresi</p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h3 className="font-bold text-purple-800 dark:text-purple-400 mb-2">İşlem Güvenliği Bilgileri</h3>
                  <p className="text-slate-600 dark:text-slate-400">Şifre (hashlenmiş), IP adresi, tarayıcı bilgileri</p>
                </div>
                
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-2">Müşteri İşlem Bilgileri</h3>
                  <p className="text-slate-600 dark:text-slate-400">Sipariş geçmişi, sepet bilgileri, favori ürünler</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Kişisel Verilerin İşlenme Amaçları
              </h2>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Üyelik işlemlerinin gerçekleştirilmesi</li>
                <li>Sipariş ve teslimat süreçlerinin yürütülmesi</li>
                <li>Müşteri hizmetleri ve destek sağlanması</li>
                <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Hizmet kalitesinin artırılması</li>
                <li>İzin vermeniz halinde pazarlama faaliyetleri</li>
                <li>Güvenliğin sağlanması ve dolandırıcılığın önlenmesi</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Kişisel Verilerin Aktarılması
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Kişisel verileriniz, yukarıda belirtilen amaçlarla sınırlı olmak üzere:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Kargo şirketleri (teslimat için)</li>
                <li>Ödeme kuruluşları (ödeme işlemleri için)</li>
                <li>Yasal merciler (yasal zorunluluk halinde)</li>
                <li>Hizmet sağlayıcılar (hosting, e-posta servisleri)</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                ile paylaşılabilir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. KVKK Kapsamındaki Haklarınız
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin işlenme amacını öğrenme</li>
                <li>Kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerinizin düzeltilmesini isteme</li>
                <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                <li>İşlenen verilerin analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme</li>
                <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Başvuru Yöntemi
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                KVKK kapsamındaki haklarınızı kullanmak için:
              </p>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>E-posta:</strong> kvkk@momez.com.tr<br />
                  <strong>Konu:</strong> KVKK Bilgi Talebi
                </p>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/gizlilik-politikasi" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Gizlilik Politikası →
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
