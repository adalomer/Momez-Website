'use client'

import Link from 'next/link'

// Giriş sayfası - Supabase Auth kurulunca çalışacak

export default function LoginPage() {
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
            Hoş Geldiniz
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Hesabınıza giriş yapın
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault()
            alert('Giriş yapılıyor... (Supabase kurulunca çalışacak)')
          }}>
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <input type="checkbox" className="rounded" />
                <span>Beni hatırla</span>
              </label>
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Şifremi unuttum
              </Link>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Hesabınız yok mu?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Kayıt Olun
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              ⚠️ Supabase kurulumu tamamlanınca giriş yapabileceksiniz
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
