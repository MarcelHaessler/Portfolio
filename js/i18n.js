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

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = dict[key];
        if (value === undefined) return;

        const attr = element.getAttribute('data-i18n-attr');
        if (attr === 'placeholder') {
            element.placeholder = value;
        } else if (attr === 'html') {
            element.innerHTML = value;
        } else {
            
            element.innerHTML = value.replace(/\n/g, '<br>');
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

    const savedLang = localStorage.getItem('lang') || 'de';

    toggle.checked = savedLang === 'en';
    applyLanguage(savedLang);

    toggle.addEventListener('change', () => {
        const lang = toggle.checked ? 'en' : 'de';
        localStorage.setItem('lang', lang);
        applyLanguage(lang);
    });
}

document.addEventListener('DOMContentLoaded', initI18n);
