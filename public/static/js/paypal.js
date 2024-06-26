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
                localStorage.removeItem('waitingForSubscription'); // subscriptionID
                clearInterval(premiumChecker);
                notify('Success!', 'success', 15000);
                localStorage.removeItem('lastUpdate');
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
                        localStorage.removeItem('waitingForSubscription'); // subscriptionID
                    } else {
                        notify('Error: Order could not be claimed, please contact support!', 'error', 30000);
                        clearInterval(premiumChecker);
                        localStorage.removeItem('waitingForSubscription'); // subscriptionID
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
const checkPremium = localStorage.getItem('waitingForSubscription'); // subscriptionID
if (checkPremium) purchaseValidator();
if (document.getElementById('paypal-button-container-P-6B898830LY4944547MZBTOXQ')) {
    let paypalButton;
    paypal.Buttons({
        style: {
            // shape: 'rect',
            // color: 'gold',
            // layout: 'vertical',
            // label: 'paypal'
            layout: 'horizontal',
            size: 'small',
            color:  'blue',
            label:  'pay',
            height: 42,
            tagline: 'false'
        },
        onError: function (err) {
            if (err.message == 'Window is closed, can not determine type' || err.message == 'Detected popup close') return;
            if (err.message.includes('returned status code: 500')) {
                notify('Please try again! The payment gateway was temporary unavailable...', 'warning', 5000);
            } else {
                notify('Error: ' + err.message + ' - Check console, please contact support!', 'error', 30000);
                console.error(err);
            }
        },
        onCancel: function (data) {
            // console.log("cancel", data)
        },
        onInit: function (data, actions) {
            paypalButton = actions;
            // paypalButton.disable();
        },
        onClick: function (data, thePromise) {
            if (!invoiceID) {
                paypalButton.disable();
                thePromise.reject();
                notify('Please wait for the interface to load...', 'warning', 3000);
                paypalButton.enable();
                return false;
            } else {
                confetti_show();
                paypalButton.enable();
                thePromise.resolve();
            }
        },
        createSubscription: function (data, actions) {
            return actions.subscription.create({
                purchase_units: [{
                    custom_id: invoiceID,
                    id: invoiceID,
                    reference_id: invoiceID,
                    user_id: invoiceID,
                    invoice: invoiceID,
                    InvoiceID: invoiceID,
                    INVNUM: invoiceID,
                    invoice_id: invoiceID,
                }],
                application_context: {
                    brand_name: 'Zeteor: Premium Subscription',
                    shipping_preference: "NO_SHIPPING",
                    return_url: "https://zeteor.roboticeva.com/personas",
                    cancel_url: "https://zeteor.roboticeva.com/personas",
                },
                subscriber: {
                    name: {
                        given_name: invoiceID
                    },
                    custom_id: invoiceID,
                    id: invoiceID,
                    reference_id: invoiceID,
                    user_id: invoiceID,
                    invoice: invoiceID,
                    InvoiceID: invoiceID,
                    INVNUM: invoiceID,
                    invoice_id: invoiceID,
                },
                custom_id: invoiceID,
                id: invoiceID,
                reference_id: invoiceID,
                user_id: invoiceID,
                invoice: invoiceID,
                InvoiceID: invoiceID,
                INVNUM: invoiceID,
                invoice_id: invoiceID,
                auto_renewal: true,
                quantity: 1,
                plan_id: 'P-6B898830LY4944547MZBTOXQ'
            });
        },
        onApprove: async function (data, actions) {
            try {
                localStorage.setItem('waitingForSubscription', 'true');
                purchaseValidator();
            } catch (e) {
                notify('Error: ' + e.message + ' please contact support!', 'error', 30000)
            }
        }
    }).render('#paypal-button-container-P-6B898830LY4944547MZBTOXQ');
}