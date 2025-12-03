import Link from 'next/link'

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            📜 Kullanım Koşulları
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Genel Hükümler
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Bu web sitesini (momez.com.tr) kullanarak aşağıdaki kullanım koşullarını 
                kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, lütfen siteyi 
                kullanmayınız.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                <strong>Momez E-Ticaret</strong> (&quot;Şirket&quot;), bu koşulları önceden haber vermeksizin 
                değiştirme hakkını saklı tutar. Güncel koşulları takip etmek kullanıcının 
                sorumluluğundadır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Üyelik ve Hesap Güvenliği
              </h2>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Üyelik için 18 yaşını doldurmuş olmanız gerekmektedir</li>
                <li>Kayıt sırasında doğru ve güncel bilgiler sağlamalısınız</li>
                <li>Hesap bilgilerinizin gizliliğini korumak sizin sorumluluğunuzdadır</li>
                <li>Hesabınızda gerçekleşen tüm işlemlerden siz sorumlusunuz</li>
                <li>Şüpheli aktivite tespit ettiğinizde derhal bizi bilgilendirmelisiniz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Sipariş ve Ödeme
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2">Fiyatlandırma</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Tüm fiyatlar Türk Lirası cinsindendir ve KDV dahildir. Fiyatlar önceden 
                    haber verilmeksizin değiştirilebilir.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="font-bold text-green-800 dark:text-green-400 mb-2">Sipariş Onayı</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Siparişiniz ödeme onayı alındıktan sonra işleme alınır. Stok durumuna 
                    göre sipariş iptal edilebilir.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h3 className="font-bold text-purple-800 dark:text-purple-400 mb-2">Ödeme Güvenliği</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Ödeme işlemleri güvenli 3D Secure altyapısı ile gerçekleştirilir. 
                    Kart bilgileriniz saklanmaz.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Teslimat
              </h2>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Teslimat süresi ürün ve lokasyona göre değişiklik gösterebilir</li>
                <li>Tahmini teslimat süreleri bilgilendirme amaçlıdır</li>
                <li>Teslimat sırasında kimlik ibrazı istenebilir</li>
                <li>Hatalı adres bilgisinden kaynaklanan gecikmelerden sorumlu değiliz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. İade ve Değişim
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                6502 Sayılı Tüketicinin Korunması Hakkında Kanun kapsamında:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                <li>Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınız vardır</li>
                <li>Cayma hakkı kullanımı için ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
                <li>Bazı ürün kategorileri cayma hakkı kapsamı dışındadır</li>
                <li>Detaylı bilgi için <Link href="/iade-ve-degisim" className="text-red-500 hover:underline">İade ve Değişim</Link> sayfamızı inceleyiniz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Fikri Mülkiyet Hakları
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Bu web sitesindeki tüm içerik (metin, grafik, logo, resim, ses dosyaları, 
                yazılım vb.) Momez E-Ticaret&apos;e aittir veya lisanslıdır. İzinsiz kullanımı yasaktır.
              </p>
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>⚠️ Uyarı:</strong> İçeriklerin izinsiz kopyalanması, değiştirilmesi 
                  veya dağıtılması yasal işlem başlatılmasına neden olabilir.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Yasaklanan Kullanımlar
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Aşağıdaki davranışlar kesinlikle yasaktır:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Sahte veya yanıltıcı bilgilerle hesap açmak</li>
                <li>Başka kullanıcıların hesaplarına yetkisiz erişim</li>
                <li>Sisteme zarar verecek yazılım veya kod yüklemek</li>
                <li>Siteyi ticari olmayan amaçlarla otomatik araçlarla taramak</li>
                <li>Dolandırıcılık veya suç teşkil eden faaliyetler</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Sorumluluk Sınırlaması
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Şirket, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez. 
                Teknik sorunlar, bakım çalışmaları veya diğer nedenlerle hizmet geçici 
                olarak askıya alınabilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Uyuşmazlık Çözümü
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Bu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları 
                uygulanacak olup, İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
              </p>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Tüketici Şikayetleri:</strong><br />
                  Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri&apos;ne başvurabilirsiniz.
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
