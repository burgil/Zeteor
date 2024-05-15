const fetch = require('node-fetch');
const { sql, generateInsertStatement, generateUpdateStatement, generateDeleteStatement } = require('./sync.js');
const fs = require('fs');
const { token_db, db_save } = require('./token_db.js');
const { isSecure } = require('./system.js');

let paypalClientId;
try {
    paypalClientId = fs.readFileSync('../paypalClientId', 'utf8').trim();
} catch (fileErr) { }

let paypalClientSecret;
try {
    paypalClientSecret = fs.readFileSync('../paypalClientSecret', 'utf8').trim();
} catch (fileErr) { }

let paypalWebhookId;
try {
    paypalWebhookId = fs.readFileSync('../paypalWebhookId', 'utf8').trim();
} catch (fileErr) { }

let cachedToken;
try {
    cachedToken = fs.readFileSync('../cachedToken.json', 'utf8').trim();
    cachedToken = JSON.parse(cachedToken);
} catch (fileErr) { }

async function updateToken() {
    if (cachedToken) {
        const expirationDate = new Date(((cachedToken.current_timestamp / 1000) + cachedToken.expires_in) * 1000);
        const year = expirationDate.getFullYear();
        const month = expirationDate.getMonth() + 1;
        const day = expirationDate.getDate();
        const hours = expirationDate.getHours();
        const minutes = expirationDate.getMinutes();
        const seconds = expirationDate.getSeconds();
        console.log(`Paypal Token Expiration date and refresh time: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
        const currentDate = new Date();
        if (expirationDate < currentDate) {  // check if expired
            console.log("Token has expired, refreshing!");
        } else {
            // console.log("Token is still valid.");
            return;
        }
    }
    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');
    const body = 'grant_type=client_credentials';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        cachedToken = data;
        cachedToken.current_timestamp = Date.now();
        try {
            fs.writeFileSync('../cachedToken.json', JSON.stringify(cachedToken), 'utf8');
        } catch (err) { }
    } catch (error) {
        console.error('Error:', error.message);
    }
}
updateToken();
setInterval(function () {
    updateToken();
}, 31926 * 1000);

async function verifyPaypal(authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime, webhookEvent) {
    try {
        await updateToken();
        const response = await fetch('https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cachedToken.access_token}` // Replace YOUR_ACCESS_TOKEN with your actual access token
            },
            body: JSON.stringify({
                "transmission_id": transmissionId, // string <= 50 characters The ID of the HTTP transmission. Contained in the PAYPAL-TRANSMISSION-ID header of the notification message.
                "transmission_time": transmissionTime, // string <= 100 characters The date and time of the HTTP transmission, in Internet date and time format. Appears in the PAYPAL-TRANSMISSION-TIME header of the notification message.
                "cert_url": certUrl, // string <= 500 characters The X.509 public key certificate. Download the certificate from this URL and use it to verify the signature. Extract this value from the PAYPAL-CERT-URL response header, which is received with the webhook notification.
                "auth_algo": authAlgo, // string <= 100 characters The algorithm that PayPal uses to generate the signature and that you can use to verify the signature. Extract this value from the PAYPAL-AUTH-ALGO response header, which is received with the webhook notification.
                "transmission_sig": transmissionSig, // string <= 500 characters The PayPal-generated asymmetric signature. Appears in the PAYPAL-TRANSMISSION-SIG header of the notification message.
                "webhook_id": paypalWebhookId, // string <= 50 characters The ID of the webhook as configured in your Developer Portal account.
                "webhook_event": webhookEvent // object A webhook event notification.
            })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const verificationStatus = await response.json();
        return verificationStatus;
    } catch (error) {
        console.error('Error:', error.message);
        return error.message;
    }
}

async function processPaypalWebhooks(req, res) { // fetch('http://localhost/paypal', {method: 'POST'})
    try {
        const authAlgo = req.headers["paypal-auth-algo"];
        const certUrl = req.headers["paypal-cert-url"];
        const transmissionId = req.headers["paypal-transmission-id"];
        const transmissionSig = req.headers["paypal-transmission-sig"];
        const transmissionTime = req.headers["paypal-transmission-time"];
        const webhookEvent = req.body;
        const verificationStatus = await verifyPaypal(authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime, webhookEvent);
        if (verificationStatus.verification_status == 'SUCCESS') {
            res.status(200).send('ok');
            try {
                let paymentStatus = false;
                switch (webhookEvent.event_type) {
                    // Payments V2
                    case 'PAYMENT.AUTHORIZATION.CREATED': // A payment authorization is created, approved, executed, or a future payment authorization is created.
                        break;
                    case 'PAYMENT.AUTHORIZATION.VOIDED': // A payment authorization is voided either due to authorization reaching it’s 30 day validity period or authorization was manually voided using the Void Authorized Payment API.
                        break;
                    case 'PAYMENT.CAPTURE.DECLINED': // A payment capture is declined.
                        paymentStatus = 'reject';
                        break;
                    case 'PAYMENT.CAPTURE.COMPLETED': // A payment capture completes.
                        break;
                    case 'PAYMENT.CAPTURE.PENDING': // The state of a payment capture changes to pending.
                        break;
                    case 'PAYMENT.CAPTURE.REFUNDED': // A merchant refunds a payment capture.
                        paymentStatus = 'reject';
                        break;
                    case 'PAYMENT.CAPTURE.REVERSED': // PayPal reverses a payment capture.
                        break;
                    // Payments V1
                    case 'PAYMENT.CAPTURE.DENIED': // A payment capture is denied.
                        paymentStatus = 'reject';
                        break;
                    // Batch payouts
                    case 'PAYMENT.PAYOUTSBATCH.DENIED': // A batch payout payment is denied.
                        break;
                    case 'PAYMENT.PAYOUTSBATCH.PROCESSING': // The state of a batch payout payment changes to processing.
                        break;
                    case 'PAYMENT.PAYOUTSBATCH.SUCCESS': // A batch payout payment completes successfully.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.BLOCKED': // A payouts item is blocked.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.CANCELED': // A payouts item is canceled.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.DENIED': // A payouts item is denied.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.FAILED': // 	A payouts item fails.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.HELD': // A payouts item is held.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.REFUNDED': // A payouts item is refunded.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.RETURNED': // A payouts item is returned.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED': // A payouts item succeeds.
                        break;
                    case 'PAYMENT.PAYOUTS-ITEM.UNCLAIMED': // A payouts item is unclaimed.
                        break;
                    // Billing plans and agreements
                    case 'BILLING.PLAN.CREATED': // A billing plan is created.
                        break;
                    case 'BILLING.PLAN.UPDATED': // A billing plan is updated.
                        break;
                    case 'BILLING.SUBSCRIPTION.CANCELLED': // A billing agreement is canceled.
                        paymentStatus = 'cancel';
                        break;
                    case 'BILLING.SUBSCRIPTION.CREATED': // A billing agreement is created.
                        break;
                    case 'BILLING.SUBSCRIPTION.RE-ACTIVATED': // A billing agreement is re-activated.
                        break;
                    case 'BILLING.SUBSCRIPTION.SUSPENDED': // A billing agreement is suspended.
                        paymentStatus = 'reject';
                        break;
                    case 'BILLING.SUBSCRIPTION.UPDATED': // A billing agreement is updated.
                        break;
                    // Log in with PayPal
                    case 'IDENTITY.AUTHORIZATION-CONSENT.REVOKED': // A user's consent token is revoked.
                        break;
                    // Checkout buyer approval
                    case 'PAYMENTS.PAYMENT.CREATED': // Checkout payment is created and approved by buyer.
                        break;
                    case 'CHECKOUT.ORDER.APPROVED': // A buyer approved a checkout order
                        break;
                    case 'CHECKOUT.CHECKOUT.BUYER-APPROVED': // Express checkout payment is created and approved by buyer.
                        break;
                    // Disputes
                    case 'CUSTOMER.DISPUTE.CREATED': // A dispute is created.
                        break;
                    case 'CUSTOMER.DISPUTE.RESOLVED': // A dispute is resolved.
                        break;
                    case 'CUSTOMER.DISPUTE.UPDATED': // A dispute is updated.
                        break;
                    case 'RISK.DISPUTE.CREATED': // A risk dispute is created.
                        break;
                    // Invoicing
                    case 'INVOICING.INVOICE.CANCELLED': // A merchant or customer cancels an invoice.
                        break;
                    case 'INVOICING.INVOICE.CREATED': // An invoice is created.
                        break;
                    case 'INVOICING.INVOICE.PAID': // An invoice is paid, partially paid, or payment is made and is pending.
                        break;
                    case 'INVOICING.INVOICE.REFUNDED': // An invoice is refunded or partially refunded.
                        break;
                    case 'INVOICING.INVOICE.SCHEDULED': // An invoice is scheduled.
                        break;
                    case 'INVOICING.INVOICE.UPDATED': // An invoice is updated.
                        break;
                    // Marketplaces and Platforms
                    case 'CHECKOUT.ORDER.COMPLETED': // A checkout order is processed. Note: For use by marketplaces and platforms only.
                        break;
                    case 'CHECKOUT.ORDER.PROCESSED': // A checkout order is processed.
                        break;
                    case 'CUSTOMER.ACCOUNT-LIMITATION.ADDED': // A limitation is added for a partner's managed account.
                        break;
                    case 'CUSTOMER.ACCOUNT-LIMITATION.ESCALATED': // A limitation is escalated for a partner's managed account.
                        break;
                    case 'CUSTOMER.ACCOUNT-LIMITATION.LIFTED': // A limitation is lifted for a partner's managed account.
                        break;
                    case 'CUSTOMER.ACCOUNT-LIMITATION.UPDATED': // A limitation is updated for a partner's managed account.
                        break;
                    case 'CUSTOMER.MERCHANT-INTEGRATION.CAPABILITY-UPDATED': // PayPal must enable the merchant's account as PPCP for this webhook to work.
                        break;
                    case 'CUSTOMER.MERCHANT-INTEGRATION.PRODUCT-SUBSCRIPTION-UPDATED': // The products available to the merchant have changed.
                        break;
                    case 'CUSTOMER.MERCHANT-INTEGRATION.SELLER-ALREADY-INTEGRATED': // Merchant onboards again to a partner.
                        break;
                    case 'CUSTOMER.MERCHANT-INTEGRATION.SELLER-ONBOARDING-INITIATED': // PayPal creates a merchant account from the partner's onboarding link.
                        break;
                    case 'CUSTOMER.MERCHANT-INTEGRATION.SELLER-CONSENT-GRANTED': // Merchant grants consents to a partner.
                        break;
                    case 'CUSTOMER.MERCHANT-INTEGRATION.SELLER-EMAIL-CONFIRMED': // Merchant confirms the email and consents are granted.
                        break;
                    case 'MERCHANT.ONBOARDING.COMPLETED': // Merchant completes setup.
                        break;
                    case 'MERCHANT.PARTNER-CONSENT.REVOKED': // The consents for a merchant account setup are revoked or an account is closed.
                        break;
                    case 'PAYMENT.REFERENCED-PAYOUT-ITEM.COMPLETED': // Funds are disbursed to the seller and partner.
                        break;
                    case 'PAYMENT.REFERENCED-PAYOUT-ITEM.FAILED': // Attempt to disburse funds fails.
                        break;
                    // Merchant onboarding
                    case 'CUSTOMER.MANAGED-ACCOUNT.ACCOUNT-CREATED': // Managed account has been created.
                        break;
                    case 'CUSTOMER.MANAGED-ACCOUNT.CREATION-FAILED': // Managed account creation failed.
                        break;
                    case 'CUSTOMER.MANAGED-ACCOUNT.ACCOUNT-UPDATED': // Managed account has been updated.
                        break;
                    case 'CUSTOMER.MANAGED-ACCOUNT.ACCOUNT-STATUS-CHANGED': // Capabilities and/or process status has been changed on a managed account.
                        break;
                    case 'CUSTOMER.MANAGED-ACCOUNT.RISK-ASSESSED': // Managed account has been risk assessed or the risk assessment has been changed.
                        break;
                    case 'CUSTOMER.MANAGED-ACCOUNT.NEGATIVE-BALANCE-NOTIFIED': // Negative balance debit has been notified on a managed account.
                        break;
                    case 'CUSTOMER.MANAGED-ACCOUNT.NEGATIVE-BALANCE-DEBIT-INITIATED': // Negative balance debit has been initiated on a managed account.
                        break;
                    // Orders V2
                    case 'CHECKOUT.PAYMENT-APPROVAL.REVERSED': // A problem occurred after the buyer approved the order but before you captured the payment. Refer to Handle uncaptured payments for what to do when this event occurs.
                        break;
                    // Payment orders
                    case 'PAYMENT.ORDER.CANCELLED': // A payment order is canceled.
                        paymentStatus = 'reject';
                        break;
                    case 'PAYMENT.ORDER.CREATED': // A payment order is created.
                        break;
                    // Sales
                    case 'PAYMENT.SALE.DENIED': // The state of a sale changes from pending to denied.
                        paymentStatus = 'reject';
                        break;
                    case 'PAYMENT.SALE.PENDING': // The state of a sale changes to pending.
                        break;
                    // Subscriptions & Sales
                    case 'PAYMENT.SALE.REFUNDED': // A merchant refunds a sale.
                        paymentStatus = 'reject';
                        break;
                    case 'PAYMENT.SALE.COMPLETED': // A sale completes.
                        paymentStatus = 'confirm';
                        break;
                    case 'PAYMENT.SALE.REVERSED': // PayPal reverses a sale.
                        break;
                    // Subscriptions
                    case 'CATALOG.PRODUCT.CREATED': // A product is created.
                        break;
                    case 'CATALOG.PRODUCT.UPDATED': // A product is updated.
                        break;
                    case 'BILLING.PLAN.ACTIVATED': // A billing plan is activated.
                        break;
                    case 'BILLING.PLAN.PRICING-CHANGE.ACTIVATED': // A price change for the plan is activated.
                        break;
                    case 'BILLING.PLAN.DEACTIVATED': // A billing plan is deactivated.
                        break;
                    case 'BILLING.SUBSCRIPTION.ACTIVATED': // A subscription is activated.
                        break;
                    case 'BILLING.SUBSCRIPTION.EXPIRED': // A subscription expires.
                        break;
                    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': // 	Payment failed on subscription.
                        break;
                    // Vault
                    case 'VAULT.CREDIT-CARD.CREATED': // A credit card is created.
                        break;
                    case 'VAULT.CREDIT-CARD.DELETED': // A credit card is deleted.
                        break;
                    case 'VAULT.CREDIT-CARD.UPDATED': // A credit card is updated.
                        break;
                }
                // body: webhookEvent,
                // time: Date.now(),
                // timestamp: new Date().toLocaleString(),
                // headers: req.headers,
                // url: req.url,
                // method: req.method,
                // cookies: req.cookies,
                // fingerprint: req.fingerprint,
                // ip: req.clientIp,
                /*
                paymentStatus:
                reject - somehow got rejected
                cancel - user manually cancelled
                confirm - user purchased successfully
                !false = do nothing - log?
                */
                console.log("incoming webhook..", {
                    paymentStatus,
                    body: webhookEvent
                })
                if (paymentStatus) {
                    if (webhookEvent.resource?.id && webhookEvent.event_type && webhookEvent.summary && webhookEvent.create_time && webhookEvent.resource?.amount?.total && webhookEvent.resource?.amount?.currency) {
                        console.log("processing webhook...")
                        if (paymentStatus == 'reject') {
                            console.log("rejected")
                        } else if (paymentStatus == 'cancel') {
                            console.log("cancelled")
                        } else if (paymentStatus == 'confirm') { // PAYMENT.SALE.COMPLETED
                            console.log("confirm webhook")
                            const userDB = await sql(`SELECT discord_id FROM users WHERE payment_id = $1;`, [
                                webhookEvent.resource.billing_agreement_id
                            ]);
                            console.warn('userDB:', userDB.rows)
                            let claimedDiscordID = '';
                            if (userDB.rows.length > 0) claimedDiscordID = userDB.rows[0].discord_id;
                            console.log("claimedDiscordID", claimedDiscordID)
                            console.log("webhookEvent.resource.billing_agreement_id", webhookEvent.resource.billing_agreement_id)
                            const insertPayment = await generateInsertStatement('payments', {
                                discord_id: claimedDiscordID,
                                id: webhookEvent.resource.billing_agreement_id,
                                event_type: webhookEvent.event_type,
                                summary: webhookEvent.summary,
                                create_time: webhookEvent.create_time,
                                total: webhookEvent.resource.amount.total,
                                currency: webhookEvent.resource.amount.currency,
                            })
                            await sql(insertPayment.sql, insertPayment.values);
                        } else {
                            console.warn("unknown webhook type", paymentStatus)
                        }
                        const updateUserPayment = await generateUpdateStatement('users', userData.id, {
                            payment_status: paymentStatus,
                        });
                        await sql(updateUserPayment.sql, updateUserPayment.values)
                    } else {
                        console.warn("webhook failed")
                    }
                } else {
                    console.warn("ignoring webhook...")
                }
            } catch (e2) {
                console.error('processPaypalWebhooks Sub Error: ' + e2.message);
            }
        } else {
            res.status(401).send('bad');
        }
    } catch (e) {
        res.status(500).send('processPaypalWebhooks Error: ' + e.message);
    }
}

async function claimOrder(req, res) {
    try {
        const currentOrigin = req.headers.referer ? new URL(req.headers.referer) : {};
        if (isSecure) {
            if (currentOrigin.host != 'zeteor.roboticeva.com') {
                res.send('Invalid Request');
                return;
            }
        } else {
            if (currentOrigin.host != 'localhost') {
                res.send('Invalid Request');
                return;
            }
        }
        if (!req.cookies.auth_token) {
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
            return;
        }
        const userData = token_db[req.cookies.auth_token];
        if (!userData) {
            res.setHeader("Set-Cookie", 'auth_token=; Path=/; Secure; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
            return;
        }
        const subscriptionID = req.body.subscriptionID;
        if (!subscriptionID || subscriptionID.trim() == '') {
            res.send(JSON.stringify({
                error: 'Invalid order id'
            }));
            return;
        }
        // update user with the new order id
        const updateUserPayment = await generateUpdateStatement('users', userData.id, {
            payment_id: subscriptionID,
        });
        await sql(updateUserPayment.sql, updateUserPayment.values)
        res.send(JSON.stringify({
            ok: true
        }))
        // // find empty order with id
        // const paymentsDB = await sql(`SELECT discord_id, id FROM payments WHERE discord_id = $1 AND id = $2;`, [
        //     '',
        //     subscriptionID
        // ])
        // console.warn('paymentsDB:', paymentsDB.rows)
        // if (paymentsDB.rows.length > 0) {
        //     // found empty order with that id, fill user as the owner
        //     const updatePayment = await generateUpdateStatement('payments', orderID, {
        //         discord_id: userData.id,
        //     }, 'id');
        //     const updatedPayment = await sql(updatePayment.sql, updatePayment.values)
        //     console.warn('updatedPayment', updatedPayment.rows)
        //     res.send('ok')
        // } else {
        //     res.send('bad')
        // }
    } catch (e) {
        res.status(500).send(e.message);
    }
}

async function checkOrder(req, res) {
    try {
        const currentOrigin = req.headers.referer ? new URL(req.headers.referer) : {};
        if (isSecure) {
            if (currentOrigin.host != 'zeteor.roboticeva.com') {
                res.send(JSON.stringify({
                    error: 'Invalid Request'
                }));
                return;
            }
        } else {
            if (currentOrigin.host != 'localhost') {
                res.send(JSON.stringify({
                    error: 'Invalid Request'
                }));
                return;
            }
        }
        if (!req.cookies.auth_token) {
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
            return;
        }
        const userData = token_db[req.cookies.auth_token];
        if (!userData) {
            res.setHeader("Set-Cookie", 'auth_token=; Path=/; Secure; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
            return;
        }
        const userDB = await sql(`SELECT payment_id FROM users WHERE discord_id = $1;`, [
            userData.id,
        ])
        if (userDB.rows.length > 0) {
            const subscriptionID = userDB.payment_id;
            if (!subscriptionID || subscriptionID.trim() == '') {
                res.send(JSON.stringify({
                    error: 'Invalid order id'
                }));
                return;
            }
            // find empty order with id
            const paymentsDB = await sql(`SELECT discord_id, id FROM payments WHERE discord_id = $1 AND id = $2;`, [
                userData.id,
                subscriptionID
            ])
            // console.warn('paymentsDB:', paymentsDB.rows)
            if (paymentsDB.rows.length > 0) {
                // found empty order with that id, fill user as the owner
                // const updatePayment = await generateUpdateStatement('payments', orderID, {
                //     discord_id: userData.id,
                // }, 'id');
                // const updatedPayment = await sql(updatePayment.sql, updatePayment.values)
                // console.warn('updatedPayment', updatedPayment.rows)
                res.send(JSON.stringify({
                    ok: true
                }))
            } else {
                res.send(JSON.stringify({
                    recheck: true
                }))
            }
        } else {
            res.send(JSON.stringify({
                error: 'Invalid payment id'
            }));
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
}

async function getPaypalLogs(req, res) { // http://localhost/paypal-logs
    const paymentsDB = await sql(`SELECT * FROM payments;`)
    res.write(JSON.stringify(paymentsDB.rows));
    res.end();
}

async function getPaypalLogs2(req, res) { // http://localhost/paypal-logs2
    const paymentsDB = await sql(`SELECT * FROM users;`)
    res.write(JSON.stringify(paymentsDB.rows));
    res.end();
}

async function cleanPaypalLogs(req, res) { // http://localhost/clean-paypal-logs
    await sql(`DELETE FROM payments;`)
    res.write('ok');
    res.end();
}

const paypalRoutes = [
    {
        method: 'POST',
        route: '/paypal',
        func: processPaypalWebhooks
    },
    {
        method: 'GET',
        route: '/paypal-logs',
        func: getPaypalLogs
    },
    {
        method: 'GET',
        route: '/paypal-logs2',
        func: getPaypalLogs2
    },
    {
        method: 'GET',
        route: '/clean-paypal-logs',
        func: cleanPaypalLogs
    },
    {
        method: 'POST',
        route: '/claim-paypal',
        func: claimOrder
    },
    {
        method: 'POST',
        route: '/check-paypal',
        func: checkOrder
    },
]

module.exports = paypalRoutes;