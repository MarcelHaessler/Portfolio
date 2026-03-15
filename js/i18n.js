/**
 * @file i18n.js
 * @description Language toggle engine.
 * Reads #langToggle checkbox (checked = EN, unchecked = DE),
 * updates all [data-i18n] elements and persists choice via localStorage.
 *
 * Depends on: translations.js (must be loaded first)
 */

/**
 * Applies the given language to all [data-i18n] elements on the page.
 * Supports two content modes via data attributes:
 *   - data-i18n-attr="placeholder"  → sets element.placeholder
 *   - data-i18n-attr="html"         → sets element.innerHTML
 *   - default                       → sets element.textContent
 *
 * @param {string} lang - Language code: 'de' or 'en'
 */
function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = dict[key];
        if (value === undefined) return;

        const attr = el.getAttribute('data-i18n-attr');
        if (attr === 'placeholder') {
            el.placeholder = value;
        } else if (attr === 'html') {
            el.innerHTML = value;
        } else {
            // Preserve inner HTML for elements like <br> inside a span
            el.innerHTML = value.replace(/\n/g, '<br>');
        }
    });

    document.documentElement.lang = lang;
}

/**
 * Initialises the language system.
 * Reads saved language from localStorage, syncs the toggle checkbox and
 * applies the language on page load. Then listens for toggle changes.
 */
function initI18n() {
    const toggle = document.getElementById('langToggle');
    if (!toggle) return;

    // Restore saved language (default: 'de')
    const savedLang = localStorage.getItem('lang') || 'de';

    // checked = EN, unchecked = DE
    toggle.checked = savedLang === 'en';
    applyLanguage(savedLang);

    toggle.addEventListener('change', () => {
        const lang = toggle.checked ? 'en' : 'de';
        localStorage.setItem('lang', lang);
        applyLanguage(lang);
    });
}

document.addEventListener('DOMContentLoaded', initI18n);
