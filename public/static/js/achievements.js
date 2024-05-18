const DEBUG_Achievement = false;

function Achievement(title, content, blink, icon = '🏆') {
    const achievementUnlocked = document.createElement('div');
    achievementUnlocked.classList.add('achievement-unlocked');

    const achievementEmoji = document.createElement('div');
    achievementEmoji.classList.add('achievement-emoji');
    const achievementEmojiContainer = document.createElement('span');
    achievementEmojiContainer.classList.add('achievement-emoji-container');
    achievementEmojiContainer.innerHTML = '<span>' + icon + '</span>';
    achievementEmoji.appendChild(achievementEmojiContainer);
    achievementUnlocked.appendChild(achievementEmoji);

    const achievementText = document.createElement('div');
    achievementText.classList.add('achievement-text');
    const achievementTitle = document.createElement('p');
    achievementTitle.classList.add('achievement-title');
    achievementTitle.textContent = title;
    const achievementContent = document.createElement('p');
    achievementContent.classList.add('achievement-content');
    achievementContent.innerHTML = content;
    achievementText.appendChild(achievementTitle);
    achievementText.appendChild(achievementContent);
    achievementUnlocked.appendChild(achievementText);

    document.getElementById('achievements').prepend(achievementUnlocked);

    let blinkMode;
    if (blink == 1) {
        blinkMode = 'border-top';
        achievementEmoji.style[`border-top-color`] = 'var(--achievement-blink1)';
    }
    if (blink == 2) {
        blinkMode = 'border-right';
        achievementEmoji.style[`border-top-color`] = 'var(--achievement-blink1)';
        achievementEmoji.style[`border-right-color`] = 'var(--achievement-blink1)';
    }
    if (blink == 3) {
        blinkMode = 'border-left';
        achievementEmoji.style[`border-top-color`] = 'var(--achievement-blink1)';
        achievementEmoji.style[`border-right-color`] = 'var(--achievement-blink1)';
        achievementEmoji.style[`border-left-color`] = 'var(--achievement-blink1)';
    }
    if (blink == 4) {
        blinkMode = 'border-bottom';
        achievementEmoji.style[`border-top-color`] = 'var(--achievement-blink1)';
        achievementEmoji.style[`border-right-color`] = 'var(--achievement-blink1)';
        achievementEmoji.style[`border-left-color`] = 'var(--achievement-blink1)';
        achievementEmoji.style[`border-bottom-color`] = 'var(--achievement-blink1)';
    }

    if (DEBUG_Achievement) {
        achievementUnlocked.style.opacity = 1;
        achievementUnlocked.style.width = '8em';
    } else {
        setTimeout(function () {
            achievementUnlocked.remove();
        }, 6000);
        achievementUnlocked.style.webkitAnimation = 'open-close-banner 5s 1, glow 2s infinite';
        achievementUnlocked.style.mozAnimation = 'open-close-banner 5s 1, glow 2s infinite';
        achievementUnlocked.style.animation = 'open-close-banner 5s 1, glow 2s infinite';
        achievementEmoji.style.webkitAnimation = `${blinkMode}-pulse 1.25s 2`;
        achievementEmoji.style.mozAnimation = `${blinkMode}-pulse 1.25s 2`;
        achievementEmoji.style.animation = `${blinkMode}-pulse 1.25s 2`;
        achievementText.style.webkitAnimation = 'fade-in-text .5s 1';
        achievementText.style.mozAnimation = 'fade-in-text .5s 1';
        achievementText.style.animation = 'fade-in-text .5s 1';
    }
    if (Math.random() < 0.5) {
        startAudio("/sounds/achievement1.mp3", 0.1);
    } else {
        startAudio("/sounds/achievement1b.mp3", 0.1);
    }
    setTimeout(function () {
        if (Math.random() < 0.5) {
            startAudio("/sounds/achievement2.mp3", 0.1);
        } else {
            setTimeout(function () {
                startAudio("/sounds/achievement2b.mp3", 0.1);
            }, 200);
        }
    }, 3000);
    setTimeout(function () {
        if (Math.random() < 0.5) {
            startAudio("/sounds/achievement3.mp3", 0.1);
        } else {
            startAudio("/sounds/achievement3b.mp3", 0.1);
        }
    }, 4200);
    if (blink == 4) {
        setTimeout(function () {
            startAudio("/sounds/achievement4.mp3", 0.1);
            confetti_show();
        }, 2000);
    }
}

function startAudio(filePath, volume = 1.0) {
    const constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const source = context.createBufferSource();
            const request = new XMLHttpRequest();
            request.open('GET', filePath, true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                const audioData = request.response;
                context.decodeAudioData(audioData, function (buffer) {
                    source.buffer = buffer;
                    const gainNode = context.createGain();
                    gainNode.gain.value = volume;
                    source.connect(gainNode);
                    gainNode.connect(context.destination);
                    source.start(0);
                });
            };
            request.send();
        });
}

function pauseAudio() {
    source.stop(0);
}
// Achievement('Achievement unlocked', 'Free &ndash; AI Persona Slot', 1);
// Achievement('Achievement unlocked', 'Free &ndash; AI Persona Slot', 2);
// Achievement('Achievement unlocked', 'Free &ndash; AI Persona Slot', 3);
// Achievement('Achievement unlocked', 'Free &ndash; AI Persona Slot', 4);
// const max_blink = 4;
// const min_blink = 0;
// let lights = 1;
// let lightsDirection = true;
// if (!DEBUG_Achievement) setInterval(function () {
//     Achievement('Achievement unlocked', 'Free &ndash; AI Persona Slot', lights);
//     if (lightsDirection) {
//         lights += 1;
//         if (lights == max_blink + 1) {
//             lightsDirection = false;
//             lights = max_blink - 1;
//         }
//     } else {
//         lights -= 1;
//         if (lights == min_blink - 1) {
//             lightsDirection = true;
//             lights = min_blink + 1;
//         }
//     }
// }, 6000);