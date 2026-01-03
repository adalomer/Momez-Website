// Predefined color palette with translations
export type Language = 'en' | 'ar'

export interface ColorDefinition {
	id: string
	hex: string
	names: {
		en: string
		ar: string
	}
}

export const colorPalette: ColorDefinition[] = [
	// Basics
	{ id: 'black', hex: '#000000', names: { en: 'Black', ar: 'أسود' } },
	{ id: 'white', hex: '#FFFFFF', names: { en: 'White', ar: 'أبيض' } },
	{ id: 'gray', hex: '#808080', names: { en: 'Gray', ar: 'رمادي' } },
	{ id: 'silver', hex: '#C0C0C0', names: { en: 'Silver', ar: 'فضي' } },

	// Primary colors
	{ id: 'red', hex: '#FF0000', names: { en: 'Red', ar: 'أحمر' } },
	{ id: 'blue', hex: '#0000FF', names: { en: 'Blue', ar: 'أزرق' } },
	{ id: 'yellow', hex: '#FFFF00', names: { en: 'Yellow', ar: 'أصفر' } },

	// Secondary colors
	{ id: 'green', hex: '#008000', names: { en: 'Green', ar: 'أخضر' } },
	{ id: 'orange', hex: '#FFA500', names: { en: 'Orange', ar: 'برتقالي' } },
	{ id: 'purple', hex: '#800080', names: { en: 'Purple', ar: 'بنفسجي' } },
	{ id: 'pink', hex: '#FFC0CB', names: { en: 'Pink', ar: 'وردي' } },

	// Fashion colors
	{ id: 'navy', hex: '#000080', names: { en: 'Navy', ar: 'كحلي' } },
	{ id: 'beige', hex: '#F5F5DC', names: { en: 'Beige', ar: 'بيج' } },
	{ id: 'brown', hex: '#8B4513', names: { en: 'Brown', ar: 'بني' } },
	{ id: 'tan', hex: '#D2B48C', names: { en: 'Tan', ar: 'أسمر' } },
	{ id: 'burgundy', hex: '#800020', names: { en: 'Burgundy', ar: 'عنابي' } },
	{ id: 'olive', hex: '#808000', names: { en: 'Olive', ar: 'زيتوني' } },
	{ id: 'cream', hex: '#FFFDD0', names: { en: 'Cream', ar: 'كريمي' } },
	{ id: 'coral', hex: '#FF7F50', names: { en: 'Coral', ar: 'مرجاني' } },
	{ id: 'teal', hex: '#008080', names: { en: 'Teal', ar: 'أزرق مخضر' } },
	{ id: 'gold', hex: '#FFD700', names: { en: 'Gold', ar: 'ذهبي' } },

	// Light variants
	{ id: 'lightblue', hex: '#ADD8E6', names: { en: 'Light Blue', ar: 'أزرق فاتح' } },
	{ id: 'lightgreen', hex: '#90EE90', names: { en: 'Light Green', ar: 'أخضر فاتح' } },
	{ id: 'lightpink', hex: '#FFB6C1', names: { en: 'Light Pink', ar: 'وردي فاتح' } },

	// Dark variants
	{ id: 'darkblue', hex: '#00008B', names: { en: 'Dark Blue', ar: 'أزرق داكن' } },
	{ id: 'darkgreen', hex: '#006400', names: { en: 'Dark Green', ar: 'أخضر داكن' } },
	{ id: 'darkgray', hex: '#A9A9A9', names: { en: 'Dark Gray', ar: 'رمادي داكن' } },
]

/**
 * Get translated color name by color ID
 */
export function getColorName(colorId: string, language: Language): string {
	const color = colorPalette.find(c => c.id === colorId)
	if (color) {
		return color.names[language] || color.names.en
	}
	// If not found in palette, return the colorId as-is (custom color)
	return colorId
}

/**
 * Get color by hex value
 */
export function getColorByHex(hex: string): ColorDefinition | undefined {
	return colorPalette.find(c => c.hex.toLowerCase() === hex.toLowerCase())
}

/**
 * Get translated color name by hex value
 */
export function getColorNameByHex(hex: string, language: Language): string {
	const color = getColorByHex(hex)
	if (color) {
		return color.names[language] || color.names.en
	}
	// If not found in palette, return the hex itself
	return hex
}

/**
 * Find closest palette color to a given hex
 */
export function findClosestColor(hex: string): ColorDefinition | null {
	const color = getColorByHex(hex)
	if (color) return color

	// Could implement color distance algorithm here if needed
	return null
}
