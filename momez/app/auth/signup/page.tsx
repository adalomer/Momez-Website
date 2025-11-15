'use client'

import Link from 'next/link'

// Kayıt sayfası - Supabase Auth kurulunca çalışacak

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">momez</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Hesap Oluştur
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Üyelik avantajlarından yararlanın
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault()
            alert('Kayıt olunuyor... (Supabase kurulunca çalışacak)')
          }}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Ad Soyad
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Telefon
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+90 555 123 4567"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="password-confirm" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Şifre Tekrar
              </label>
              <input
                id="password-confirm"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" required className="mt-1 rounded" />
              <span>
                <Link href="/kullanim-kosullari" className="text-primary hover:underline">Kullanım koşullarını</Link>
                {' '}ve{' '}
                <Link href="/gizlilik-politikasi" className="text-primary hover:underline">gizlilik politikasını</Link>
                {' '}okudum, kabul ediyorum.
              </span>
            </label>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
            >
              Kayıt Ol
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Giriş Yapın
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              ⚠️ Supabase kurulumu tamamlanınca kayıt olabileceksiniz
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
