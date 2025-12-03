import Link from 'next/link'

export default function CerezPolitikasiPage() {
  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            🍪 Çerez (Cookie) Politikası
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Son güncelleme: 3 Aralık 2024
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Çerez Nedir?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Çerezler (cookies), web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla 
                cihazınıza (bilgisayar, tablet, akıllı telefon) yerleştirilen küçük metin 
                dosyalarıdır. Bu dosyalar, web sitesinin düzgün çalışması, güvenliğin sağlanması, 
                kullanıcı deneyiminin iyileştirilmesi ve site kullanımının analiz edilmesi gibi 
                amaçlarla kullanılır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Kullandığımız Çerez Türleri
              </h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">
                    🔒 Zorunlu Çerezler (Kesinlikle Gerekli)
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    Bu çerezler, web sitesinin temel işlevlerini yerine getirmesi için zorunludur. 
                    Bu çerezler olmadan site düzgün çalışamaz.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    <li><strong>auth_token:</strong> Oturum kimlik doğrulama</li>
                    <li><strong>session_id:</strong> Oturum yönetimi</li>
                    <li><strong>csrf_token:</strong> Güvenlik doğrulaması</li>
                    <li><strong>cookiePreferences:</strong> Çerez tercihleriniz</li>
                  </ul>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-3 font-medium">
                    ⚠️ Bu çerezler devre dışı bırakılamaz.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-400 mb-2">
                    ⚙️ İşlevsel Çerezler
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    Bu çerezler, web sitesinde gelişmiş işlevsellik ve kişiselleştirme sağlar.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    <li><strong>theme:</strong> Açık/koyu tema tercihi</li>
                    <li><strong>language:</strong> Dil tercihi</li>
                    <li><strong>recentlyViewed:</strong> Son görüntülenen ürünler</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-bold text-purple-800 dark:text-purple-400 mb-2">
                    📊 Analitik Çerezler
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    Bu çerezler, ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    <li><strong>_ga, _gid:</strong> Google Analytics</li>
                    <li><strong>_hjid:</strong> Hotjar kullanıcı analizi</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-bold text-orange-800 dark:text-orange-400 mb-2">
                    📢 Pazarlama Çerezleri
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    Bu çerezler, size ilgi alanlarınıza göre reklamlar göstermek için kullanılır.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    <li><strong>_fbp:</strong> Facebook Pixel</li>
                    <li><strong>_gcl_au:</strong> Google Ads dönüşüm izleme</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Çerez Tercihlerinizi Yönetme
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Çerez tercihlerinizi aşağıdaki yöntemlerle yönetebilirsiniz:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>
                  <strong>Çerez Banner'ı:</strong> Sitemizi ilk ziyaretinizde gösterilen banner 
                  üzerinden tercihlerinizi belirleyebilirsiniz.
                </li>
                <li>
                  <strong>Tarayıcı Ayarları:</strong> Tarayıcınızın ayarlarından çerezleri 
                  engelleyebilir veya silebilirsiniz.
                </li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  ⚠️ <strong>Önemli:</strong> Çerezleri devre dışı bırakmanız durumunda web 
                  sitemizin bazı özellikleri düzgün çalışmayabilir.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Üçüncü Taraf Çerezleri
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Web sitemizde aşağıdaki üçüncü taraf hizmetleri kullanılabilir:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li><strong>Google Analytics:</strong> Site kullanım analizi</li>
                <li><strong>Google Ads:</strong> Reklam ve dönüşüm takibi</li>
                <li><strong>Facebook Pixel:</strong> Sosyal medya reklamları</li>
                <li><strong>Hotjar:</strong> Kullanıcı davranış analizi</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Çerez Saklama Süreleri
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-100 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">Çerez Türü</th>
                      <th className="px-4 py-3 font-bold">Saklama Süresi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-4 py-3">Oturum Çerezleri</td>
                      <td className="px-4 py-3">Tarayıcı kapatılana kadar</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Kimlik Doğrulama</td>
                      <td className="px-4 py-3">7 gün</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Tercih Çerezleri</td>
                      <td className="px-4 py-3">1 yıl</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Analitik Çerezleri</td>
                      <td className="px-4 py-3">2 yıl</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Yasal Dayanak
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Bu Çerez Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK), 
                5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar 
                Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun ve Avrupa Birliği 
                Genel Veri Koruma Tüzüğü (GDPR) kapsamında hazırlanmıştır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. İletişim
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Çerez politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>E-posta:</strong> info@momez.com.tr<br />
                  <strong>Adres:</strong> İstanbul, Türkiye
                </p>
              </div>
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
                href="/kvkk" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                KVKK Aydınlatma Metni →
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
