'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

export default function Footer() {
	const currentYear = new Date().getFullYear()
	const { t } = useLanguage()

	return (
		<footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
			<div className="container mx-auto px-4 py-12 md:py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
					{/* Company Info */}
					<div className="col-span-1">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 text-primary">
								<svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
									<path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
								</svg>
							</div>
							<span className="text-xl font-bold text-slate-900 dark:text-white">momez</span>
						</div>
						<p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
							{t('home.hero.subtitle')}
						</p>
					</div>

					{/* Shop Links */}
					<div>
						<h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('nav.categories')}</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/kategori/erkek" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
									{t('nav.men')}
								</Link>
							</li>
							<li>
								<Link href="/kategori/kadin" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
									{t('nav.women')}
								</Link>
							</li>
							<li>
								<Link href="/kategori/spor" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
									{t('nav.sports')}
								</Link>
							</li>
							<li>
								<Link href="/kategori/cocuk" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
									{t('nav.kids')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('footer.legal')}</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/gizlilik-politikasi" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
									{t('footer.privacy')}
								</Link>
							</li>
							<li>
								<Link href="/kullanim-kosullari" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
									{t('footer.terms')}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-sm text-slate-600 dark:text-slate-400">
							{t('footer.copyright')}
						</p>
						<div className="flex gap-4">
							<span className="text-sm text-slate-600 dark:text-slate-400">
								{t('footer.contact')}: <a href="tel:+905551234567" className="hover:text-primary">+90 555 123 4567</a>
							</span>
							<span className="text-sm text-slate-600 dark:text-slate-400">
								Email: <a href="mailto:iletisim@momez.com" className="hover:text-primary">iletisim@momez.com</a>
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
