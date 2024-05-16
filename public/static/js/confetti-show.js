function createConfetti(params) {
    confetti(Object.assign({}, params));
}
function fire_specific(a, t, origin) {
    createConfetti(Object.assign({}, { origin: origin }, t, { particleCount: Math.floor(200 * a) }));
}
function confetti_show(event) {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: .94,
        startVelocity: 30,
        shapes: ["star", "circle", "heart", "square", "triangle", "diamond"],
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"]
    };
    const defaults2 = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: .94,
        startVelocity: 30,
        shapes: ["heart"],
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"]
    };
    const mouseX = !event ? window.innerWidth / 2 : event.clientX || 0;
    const mouseY = !event ? window.innerHeight / 2 : event.clientY || 0;
    const originX = mouseX / window.innerWidth;
    const originY = mouseY / window.innerHeight;
    const origin = { x: originX, y: originY };
    createConfetti({ ...defaults2, particleCount: 50, scalar: 2, origin });
    createConfetti({ ...defaults2, particleCount: 25, scalar: 3, origin });
    createConfetti({ ...defaults2, particleCount: 10, scalar: 4, origin });
    fire_specific(.25, { spread: 26, startVelocity: 55 }, origin);
    fire_specific(.2, { spread: 60 }, origin);
    fire_specific(.35, { spread: 100, decay: .91, scalar: .8 }, origin);
    fire_specific(.1, { spread: 120, startVelocity: 25, decay: .92, scalar: 1.2 }, origin);
    fire_specific(.1, { spread: 120, startVelocity: 45 }, origin);
    function shoot_specific() {
        createConfetti({ ...defaults, particleCount: 40, scalar: 1.2, origin });
        createConfetti({ ...defaults, particleCount: 10, scalar: .75, origin });
    }
    function show_specific() {
        setTimeout(shoot_specific, 0);
        setTimeout(shoot_specific, 100);
        setTimeout(shoot_specific, 200);
    }
    setTimeout(show_specific, 500);
}