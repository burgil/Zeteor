function notify(message, type, delay = 4500) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}-msg`;
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    switch (type) {
        case 'warning':
            icon.textContent = '⚠️';
            break;
        case 'error':
            icon.textContent = '❌';
            break;
        case 'success':
            icon.textContent = '✅';
            break;
        case 'info':
            icon.textContent = 'ℹ️';
            break;
        default:
            icon.textContent = '';
    }
    const text = document.createElement('span');
    text.innerText = message;
    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close-btn';
    closeBtn.setAttribute('role', 'button');
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = 'x';
    closeBtn.onclick = () => {
        container.removeChild(notification);
    };
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    container.appendChild(notification);
    let fadeOutTimer; // Store the fade-out timer in a variable
    const startFadeOutTimer = () => {
        fadeOutTimer = setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                try {
                    if (container && notification) container.removeChild(notification);
                } catch (e) { }
            }, 500);
        }, delay);
    };
    const stopFadeOutTimer = () => {
        clearTimeout(fadeOutTimer);
    };
    notification.addEventListener('mouseover', () => {
        stopFadeOutTimer();
    });
    notification.addEventListener('mouseout', () => {
        startFadeOutTimer();
    });
    notification.offsetHeight;
    notification.style.opacity = '1';
    startFadeOutTimer(); // Start the fade-out timer
}