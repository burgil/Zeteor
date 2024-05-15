function premiumUI() {
    // premium ui elements:
    if (document.querySelector('.component-frame')) { // hide paypal buttons
        document.querySelector('.component-frame').style.pointerEvents = 'none';
        document.querySelector('.component-frame').style.filter = 'opacity(0.5) brightness(0.5) blur(2px)';
    }
    document.getElementById('user-name').classList.add('premium-glow');
    const newPremiumPic = document.createElement('div');
    newPremiumPic.classList.add('premium-pic');
    let confettiDebouncer;
    newPremiumPic.addEventListener('click', function (event) {
        if (!confettiDebouncer) {
            confettiDebouncer = setTimeout(function () {
                confettiDebouncer = undefined;
            }, 1000);
            confetti_show(event); // on mouse click
        }
        newPremiumPic.style.transform = newPremiumPic.style.transform == '' ? 'rotate(360deg)' : '';
    });
    document.getElementById('user-pic').parentElement.append(newPremiumPic);
    document.querySelector('.user-info').classList.add('user-info-premium');
}