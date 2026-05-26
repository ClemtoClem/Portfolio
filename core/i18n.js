/**
 * Tiny i18n helper.
 * Apps describe localised content as `{ 'fr-FR': '...', 'en-US': '...' }`.
 * `pick(value, lang, fallbackLang)` returns the right variant, or the
 * value itself when it's not an object.
 */
export const DEFAULT_LANG = 'fr-FR';
export const FALLBACK_LANG = 'en-US';

export function pick(value, lang, fallbackLang = FALLBACK_LANG) {
	if (value == null) return '';
	if (typeof value !== 'object') return value;
	return value[lang] ?? value[fallbackLang] ?? value[DEFAULT_LANG] ?? Object.values(value)[0] ?? '';
}

/** Build a translator bound to a language. */
export function translator(lang) {
	return (value) => pick(value, lang);
}
