function purchaseValidator() {
    notify('Validating Purchase...', 'success', 3000);
    let premiumChecker = setInterval(async function () {
        notify('Validating Purchase...', 'success', 3000);
        try {
            const checkOrder = await fetch('/check-paypal', {
                method: 'GET',
            })
            const checkOrderResponse = await checkOrder.json();
            if (checkOrderResponse.ok) {
                localStorage.removeItem('subscriptionID');
                clearInterval(premiumChecker);
                notify('Success!', 'success', 15000);
                premiumUI();
                // minified confetti: (center sreen)
                const defaults = { spread: 360, ticks: 50, gravity: 0, decay: .94, startVelocity: 30, shapes: ["star", "circle", "heart", "square", "triangle", "diamond"], colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"] };
                function shoot() { confetti({ ...defaults, particleCount: 40, scalar: 1.2 }), confetti({ ...defaults, particleCount: 10, scalar: .75 }) }
                function show() { setTimeout(shoot, 0), setTimeout(shoot, 100), setTimeout(shoot, 200) } const defaults2 = { spread: 360, ticks: 100, gravity: 0, decay: .94, startVelocity: 30, shapes: ["heart"], colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"] }; confetti({ ...defaults2, particleCount: 50, scalar: 2 }), confetti({ ...defaults2, particleCount: 25, scalar: 3 }), confetti({ ...defaults2, particleCount: 10, scalar: 4 }); const count = 200, defaults3 = { origin: { y: .7 } };
                function fire(a, t) { confetti(Object.assign({}, defaults3, t, { particleCount: Math.floor(200 * a) })) }
                fire(.25, { spread: 26, startVelocity: 55 }), fire(.2, { spread: 60 }), fire(.35, { spread: 100, decay: .91, scalar: .8 }), fire(.1, { spread: 120, startVelocity: 25, decay: .92, scalar: 1.2 }), fire(.1, { spread: 120, startVelocity: 45 }), setTimeout(show, 500);
            } else {
                if (!checkOrderResponse.recheck) {
                    if (checkOrderResponse.error) {
                        notify('Error: ' + checkOrderResponse.error, 'error', 30000);
                        clearInterval(premiumChecker);
                        localStorage.removeItem('subscriptionID');
                    } else {
                        notify('Error: Order could not be claimed, please contact support!', 'error', 30000);
                        clearInterval(premiumChecker);
                        localStorage.removeItem('subscriptionID');
                    }
                }
            }
        } catch (e) {
            notify('Error: ' + e.message + ' please contact support!', 'error', 30000)
            clearInterval(premiumChecker);
            localStorage.removeItem('subscriptionID');
        }
    }, 3000);
}
const checkPremium = localStorage.getItem('subscriptionID');
if (checkPremium) purchaseValidator();
paypal.Buttons({
    style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'paypal'
    },
    createSubscription: function (data, actions) {
        return actions.subscription.create({
            plan_id: 'P-6B898830LY4944547MZBTOXQ'
        });
    },
    onApprove: async function (data, actions) {
        console.log("data", data)
        // console.log("actions", actions)
        // return actions.order.capture().then( function (details) {
        //   console.log("details", details)
        //   alert(details.payer.name.given_name)
        // })
        try {
            const claimOrder = await fetch('/claim-paypal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscriptionID: data.subscriptionID
                })
            })
            const claimOrderResponse = await claimOrder.json();
            if (claimOrderResponse.ok) {
                localStorage.setItem('subscriptionID', data.subscriptionID);
                purchaseValidator();
            } else {
                if (claimOrderResponse.error) {
                    notify('Error: ' + claimOrderResponse.error, 'error', 30000);
                } else {
                    notify('Error: Order could not be claimed, please contact support!', 'error', 30000);
                }
            }
        } catch (e) {
            notify('Error: ' + e.message + ' please contact support!', 'error', 30000)
        }
    }
}).render('#paypal-button-container-P-6B898830LY4944547MZBTOXQ'); // Renders the PayPal button