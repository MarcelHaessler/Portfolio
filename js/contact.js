const form = document.getElementById('contactForm');
const nameInput = document.getElementById('contactName');
const emailInput = document.getElementById('contactEmail');
const messageInput = document.getElementById('contactMessage');
const privacyCheckbox = document.getElementById('privacyCheckbox');
const privacyError = document.getElementById('privacyError');
const emailInvalidError = document.getElementById('emailInvalidError');
const sendBtn = document.querySelector('.sendBtn');

/**
 * Gets the current translation for a given key.
 * @param {string} key - The translation key.
 * @returns {string} - The translated string.
 */
function getTranslation(key) {
    const lang = localStorage.getItem('lang') || 'de';
    return (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;
}

/**
 * Updates the "Send" button state based on form validity.
 * This checks validity silently (without showing red errors).
 * It runs in real-time as the user types or clicks.
 */
function updateButtonState() {
    const isNameValid = nameInput.value.trim() !== '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(emailInput.value.trim());
    const isMessageValid = messageInput.value.trim() !== '';
    const isPrivacyValid = privacyCheckbox.checked;

    sendBtn.disabled = !(isNameValid && isEmailValid && isMessageValid && isPrivacyValid);
}

/**
 * Validates a single input field and updates its placeholder/styling.
 * @param {HTMLInputElement|HTMLTextAreaElement} input - The input to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateField(input) {
    const isEmail = input.id === 'contactEmail';
    const isEmpty = input.value.trim() === '';
    let isValid = !isEmpty;

    if (isEmail) {
        if (isEmpty) {
            // Case: Email is empty
            input.value = '';
            input.placeholder = getTranslation(input.getAttribute('data-i18n-error'));
            input.classList.add('invalid-placeholder');
            emailInvalidError.classList.add('d-none');
        } else {
            // Case: Email has text, check format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(input.value.trim());

            if (!isValid) {
                // Invalid format: show span, keep value, reset placeholder
                emailInvalidError.classList.remove('d-none');
                input.placeholder = getTranslation(input.getAttribute('data-i18n'));
                input.classList.remove('invalid-placeholder');
            } else {
                // Valid format
                emailInvalidError.classList.add('d-none');
                input.placeholder = getTranslation(input.getAttribute('data-i18n'));
                input.classList.remove('invalid-placeholder');
            }
        }
    } else {
        // Non-email fields (Name, Message)
        if (isEmpty) {
            input.value = '';
            input.placeholder = getTranslation(input.getAttribute('data-i18n-error'));
            input.classList.add('invalid-placeholder');
        } else {
            input.placeholder = getTranslation(input.getAttribute('data-i18n'));
            input.classList.remove('invalid-placeholder');
        }
    }
    return isValid;
}

/**
 * Validates the privacy checkbox.
 * @returns {boolean} - True if checked, false otherwise.
 */
function validatePrivacy() {
    if (!privacyCheckbox.checked) {
        privacyError.classList.remove('d-none');
        return false;
    } else {
        privacyError.classList.add('d-none');
        return true;
    }
}

// Add event listeners for validation on blur and focus
[nameInput, emailInput, messageInput].forEach(input => {
    // Check on blur
    input.addEventListener('blur', () => {
        validateField(input);
    });

    // Reset on focus
    input.addEventListener('focus', () => {
        const placeholderKey = input.getAttribute('data-i18n');
        input.placeholder = getTranslation(placeholderKey);
        input.classList.remove('invalid-placeholder');
        if (input.id === 'contactEmail') {
            emailInvalidError.classList.add('d-none');
        }
    });

    input.addEventListener('input', () => {
        if (input.id === 'contactMessage') {
            input.style.height = 'auto';
            input.style.height = (input.scrollHeight) + 'px';
        }
        updateButtonState(); // Update button state while typing
    });

    // For Name and Email also update on input
    if (input.id !== 'contactMessage') {
        input.addEventListener('input', updateButtonState);
    }
});

privacyCheckbox.addEventListener('change', () => {
    validatePrivacy();
    updateButtonState();
});

// Initial check to disable button on load
updateButtonState();

// Form submission handler
form.addEventListener('submit', async (e) => {
    // 1. Verhindert IMMER das Neuladen der Seite
    e.preventDefault();

    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);
    const isPrivacyValid = validatePrivacy();

    // Wenn etwas falsch ist, brechen wir hier ab
    if (!isNameValid || !isEmailValid || !isMessageValid || !isPrivacyValid) {
        return;
    }

    // 2. Daten sammeln (sammelt automatisch alle Felder mit einem "name"-Attribut)
    const formData = new FormData(form);

    try {
        // Button vorübergehend deaktivieren und Text ändern, damit Nutzer nicht doppelt klicken
        sendBtn.disabled = true;
        const originalBtnText = sendBtn.innerText;
        sendBtn.innerText = "Sendet..."; // Optional: getTranslation('form_sending')

        // 3. Daten im Hintergrund an PHP senden
        const response = await fetch('sendMail.php', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Erfolg! Formular leeren und Erfolgsmeldung zeigen
            form.reset();
            updateButtonState(); // Button wieder ordnungsgemäß deaktivieren, da Felder jetzt leer sind

            // Hier kannst du später auch ein schönes HTML-Popup einblenden, 
            // für den Anfang reicht ein simpler Alert:
            alert("Vielen Dank! Deine Nachricht wurde erfolgreich gesendet.");
        } else {
            // Fehler vom Server
            alert("Es gab einen Fehler beim Senden. Bitte versuche es später noch einmal.");
        }
    } catch (error) {
        console.error("Fehler beim Senden:", error);
        alert("Netzwerkfehler. Bitte überprüfe deine Verbindung.");
    } finally {
        // Button-Text wiederherstellen
        sendBtn.innerText = getTranslation(sendBtn.getAttribute('data-i18n')) || "Senden";
    }
});
