const form = document.getElementById('contactForm');
const nameInput = document.getElementById('contactName');
const emailInput = document.getElementById('contactEmail');
const messageInput = document.getElementById('contactMessage');
const privacyCheckbox = document.getElementById('privacyCheckbox');
const privacyError = document.getElementById('privacyError');
const emailInvalidError = document.getElementById('emailInvalidError');
const sendBtn = document.querySelector('.sendBtn');
const contactSuccessMsg = document.getElementById('contactSuccessMsg');
const newContactBtn = document.getElementById('newContactBtn');

if (newContactBtn) {
    newContactBtn.addEventListener('click', () => {
        contactSuccessMsg.classList.add('d-none');
        form.classList.remove('d-none');
    });
}

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
    const emailRegex = /^(?!.*\.{2})[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

            input.value = '';
            input.placeholder = getTranslation(input.getAttribute('data-i18n-error'));
            input.classList.add('invalid-placeholder');
            emailInvalidError.classList.add('d-none');
        } else {

            const emailRegex = /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
            isValid = emailRegex.test(input.value.trim());

            if (!isValid) {

                emailInvalidError.classList.remove('d-none');
                input.placeholder = getTranslation(input.getAttribute('data-i18n'));
                input.classList.remove('invalid-placeholder');
            } else {

                emailInvalidError.classList.add('d-none');
                input.placeholder = getTranslation(input.getAttribute('data-i18n'));
                input.classList.remove('invalid-placeholder');
            }
        }
    } else {

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

[nameInput, emailInput, messageInput].forEach(input => {

    input.addEventListener('blur', () => {
        validateField(input);
    });

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
        updateButtonState();
    });

    if (input.id !== 'contactMessage') {
        input.addEventListener('input', updateButtonState);
    }
});

privacyCheckbox.addEventListener('change', () => {
    validatePrivacy();
    updateButtonState();
});

updateButtonState();

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);
    const isPrivacyValid = validatePrivacy();

    if (!isNameValid || !isEmailValid || !isMessageValid || !isPrivacyValid) {
        return;
    }

    const formData = new FormData(form);

    try {

        sendBtn.disabled = true;
        const originalBtnText = sendBtn.innerText;
        sendBtn.innerText = "Sendet...";

        const response = await fetch('sendMail.php', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {

            form.reset();
            updateButtonState();

            form.classList.add('d-none');
            contactSuccessMsg.classList.remove('d-none');
        } else {

            alert("Es gab einen Fehler beim Senden. Bitte versuche es später noch einmal.");
        }
    } catch (error) {
        console.error("Fehler beim Senden:", error);
        alert("Netzwerkfehler. Bitte überprüfe deine Verbindung.");
    } finally {

        sendBtn.innerText = getTranslation(sendBtn.getAttribute('data-i18n')) || "Senden";
    }
});
