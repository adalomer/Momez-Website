import Link from 'next/link'
import { Heart } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  // Demo data - Bu veriler daha sonra Supabase'den gelecek
  const campaigns = [
    {
      id: 1,
      title: 'Sezon İndirimleri',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop',
    },
    {
      id: 2,
      title: '1 Alana 1 Bedava',
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop',
    },
    {
      id: 3,
      title: 'Online Özel Fırsatlar',
      image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=600&fit=crop',
    },
  ]

  const newProducts = [
    {
      id: 1,
      name: 'AeroGlide Pro',
      price: 1899,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      slug: 'aeroglide-pro',
    },
    {
      id: 2,
      name: 'Urban Classic',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
      slug: 'urban-classic',
    },
    {
      id: 3,
      name: 'Street Dunker',
      price: 2299,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
      slug: 'street-dunker',
    },
    {
      id: 4,
      name: 'Runner Elite',
      price: 1799,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
      slug: 'runner-elite',
    },
  ]

  const categories = [
    { name: 'Erkek', slug: 'erkek', image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=600&h=800&fit=crop' },
    { name: 'Kadın', slug: 'kadin', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop' },
    { name: 'Spor', slug: 'spor', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=800&fit=crop' },
    { name: 'Çocuk', slug: 'cocuk', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&h=800&fit=crop' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920&h=800&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
              Yeni Sezon, Yeni Tarz
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl">
              En yeni premium ayakkabı koleksiyonunu keşfet.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <Link
                href="/kategori/erkek"
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all"
              >
                Erkek Koleksiyonu
              </Link>
              <Link
                href="/kategori/kadin"
                className="px-8 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg transition-all"
              >
                Kadın Koleksiyonu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Kategoriler</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/kategori/${category.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-slate-200 dark:bg-slate-800"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Öne Çıkan Kampanyalar</h2>
            <Link href="/kampanyalar" className="text-sm font-semibold text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="group relative overflow-hidden rounded-xl aspect-video bg-slate-200 dark:bg-slate-800"
              >
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
                  <button className="w-fit px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-md transition-colors">
                    İncele
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Yeni Ürünler</h2>
            <Link href="/yeni-urunler" className="text-sm font-semibold text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <Link
                key={product.id}
                href={`/urun/${product.slug}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square bg-slate-200 dark:bg-slate-800 mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors">
                    <Heart className="h-5 w-5 text-slate-800 dark:text-white" />
                  </button>
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-semibold text-primary mt-1">
                    ₺{product.price.toLocaleString('tr-TR')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ücretsiz Kargo</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                500 TL ve üzeri alışverişlerde ücretsiz kargo
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Güvenli Alışveriş</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                SSL sertifikası ile güvenli ödeme
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kolay İade</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                14 gün içinde kolay iade ve değişim
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
