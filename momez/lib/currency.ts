// Currency configuration - Base currency is EUR
export type Language = 'en' | 'ar'

interface CurrencyConfig {
	code: string
	symbol: string
	symbolPosition: 'before' | 'after'
	rate: number  // Conversion rate from EUR (base currency)
	locale: string
}

// Exchange rates (base: EUR)
export const currencyConfig: Record<Language, CurrencyConfig> = {
	en: {
		code: 'EUR',
		symbol: '€',
		symbolPosition: 'before',
		rate: 1,  // EUR to EUR (no conversion)
		locale: 'de-DE'
	},
	ar: {
		code: 'IQD',
		symbol: 'د.ع',
		symbolPosition: 'after',
		rate: 1454,  // 1 EUR ≈ 1454 IQD
		locale: 'ar-IQ'
	}
}

/**
 * Convert price from EUR to target currency based on language
 */
export function convertPrice(amountEUR: number, language: Language): number {
	const config = currencyConfig[language] || currencyConfig.en
	return amountEUR * config.rate
}

/**
 * Format price with currency symbol based on language
 */
export function formatPrice(amountEUR: number, language: Language): string {
	const config = currencyConfig[language] || currencyConfig.en
	const convertedAmount = convertPrice(amountEUR, language)

	// Format number with appropriate locale
	const formattedNumber = new Intl.NumberFormat(config.locale, {
		minimumFractionDigits: language === 'ar' ? 0 : 2,
		maximumFractionDigits: language === 'ar' ? 0 : 2
	}).format(convertedAmount)

	// Apply symbol position
	if (config.symbolPosition === 'before') {
		return `${config.symbol}${formattedNumber}`
	} else {
		return `${formattedNumber} ${config.symbol}`
	}
}

/**
 * Format price in EUR for admin panel (no conversion)
 */
export function formatPriceTRY(amount: number): string {
	const formattedNumber = new Intl.NumberFormat('de-DE', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount)
	return `€${formattedNumber}`
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(language: Language): string {
	return currencyConfig[language]?.symbol || '€'
}

/**
 * Get currency code for display
 */
export function getCurrencyCode(language: Language): string {
	return currencyConfig[language]?.code || 'EUR'
}
