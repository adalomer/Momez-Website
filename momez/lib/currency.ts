// Currency configuration for different languages/regions
export type Language = 'en' | 'ar'

interface CurrencyConfig {
	code: string
	symbol: string
	symbolPosition: 'before' | 'after'
	rate: number  // Conversion rate from TRY (base currency)
	locale: string
}

// Exchange rates (base: TRY)
// These should be updated periodically or fetched from an API
export const currencyConfig: Record<Language, CurrencyConfig> = {
	en: {
		code: 'EUR',
		symbol: '€',
		symbolPosition: 'before',
		rate: 0.027,  // 1 TRY ≈ 0.027 EUR
		locale: 'en-EU'
	},
	ar: {
		code: 'IQD',
		symbol: 'د.ع',
		symbolPosition: 'after',
		rate: 39.5,   // 1 TRY ≈ 39.5 IQD
		locale: 'ar-IQ'
	}
}

/**
 * Convert price from TRY to target currency
 */
export function convertPrice(amountTRY: number, language: Language): number {
	const config = currencyConfig[language] || currencyConfig.en
	return amountTRY * config.rate
}

/**
 * Format price with currency symbol based on language
 */
export function formatPrice(amountTRY: number, language: Language): string {
	const config = currencyConfig[language] || currencyConfig.en
	const convertedAmount = convertPrice(amountTRY, language)

	// Format number with appropriate locale
	const formattedNumber = new Intl.NumberFormat(config.locale, {
		minimumFractionDigits: language === 'ar' ? 0 : 2,  // IQD typically has no decimals
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
 * Get currency symbol for display
 */
export function getCurrencySymbol(language: Language): string {
	return currencyConfig[language]?.symbol || '£'
}

/**
 * Get currency code for display
 */
export function getCurrencyCode(language: Language): string {
	return currencyConfig[language]?.code || 'GBP'
}
