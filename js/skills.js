document.addEventListener('DOMContentLoaded', () => {
    const stickerFront = document.querySelector('.peelSticker .front');
    if (stickerFront) {
        stickerFront.addEventListener('click', () => {
            stickerFront.classList.add('peeled');
        });
    }
});
