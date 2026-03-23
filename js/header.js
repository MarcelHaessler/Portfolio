document.querySelectorAll('h1').forEach(h1 => {
    const text = h1.innerText;
    h1.innerHTML = '';
    [...text].forEach(char => {
        if (char === ' ') {
            h1.innerHTML += ' ';
            return;
        }
        const span = document.createElement('span');
        span.innerText = char;
        const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
        span.setAttribute('data-case', isUpper ? 'upper' : 'lower');
        h1.appendChild(span);
    });
});

// Auto-close mobile menu when transitioning to desktop/back
window.addEventListener('resize', () => {
    const burgerToggle = document.getElementById('burgerToggle');
    if (burgerToggle && window.innerWidth > 768) {
        burgerToggle.checked = false;
    }
});