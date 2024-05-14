const fetch = require('node-fetch');
const { sql, generateInsertStatement, generateUpdateStatement, generateDeleteStatement } = require('./sync.js');

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

async function getToken() {
    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        /* Sample response
        {
        "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller https://uri.paypal.com/services/payments/refund https://api-m.paypal.com/v1/vault/credit-card https://api-m.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://api-m.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks",
        "access_token": "....-....", // When you make API calls, replace ACCESS-TOKEN with your access token in the authorization header: -H Authorization: Bearer ACCESS-TOKEN
        "token_type": "Bearer",
        "app_id": "APP-....",
        "expires_in": 31668, // When your access token expires, call /v1/oauth2/token again to request a new access token.
        "nonce": "2020-04-03T15:35:....."
        }
        */
        console.log('Access Token:', data.access_token, "data:", data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function verifyPaypal(authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime, webhookId, webhookEvent) {
    const payload = {
        "transmission_id": transmissionId, // string <= 50 characters The ID of the HTTP transmission. Contained in the PAYPAL-TRANSMISSION-ID header of the notification message.
        "transmission_time": transmissionTime, // string <= 100 characters The date and time of the HTTP transmission, in Internet date and time format. Appears in the PAYPAL-TRANSMISSION-TIME header of the notification message.
        "cert_url": certUrl, // string <= 500 characters The X.509 public key certificate. Download the certificate from this URL and use it to verify the signature. Extract this value from the PAYPAL-CERT-URL response header, which is received with the webhook notification.
        "auth_algo": authAlgo, // string <= 100 characters The algorithm that PayPal uses to generate the signature and that you can use to verify the signature. Extract this value from the PAYPAL-AUTH-ALGO response header, which is received with the webhook notification.
        "transmission_sig": transmissionSig, // string <= 500 characters The PayPal-generated asymmetric signature. Appears in the PAYPAL-TRANSMISSION-SIG header of the notification message.
        "webhook_id": webhookId, // string <= 50 characters The ID of the webhook as configured in your Developer Portal account.
        "webhook_event": webhookEvent // object A webhook event notification.
    };
    try {
        const response = await fetch('https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Replace YOUR_ACCESS_TOKEN with your actual access token
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const verificationStatus = await response.json();
        console.log('Verification Status:', verificationStatus);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function processPaypalWebhooks(req, res) { // fetch('http://localhost/paypal', {method: 'POST'})
    try {
        const insertPayment = await generateInsertStatement('payments', ['logs', {
            body: req.body,
            time: Date.now(),
            timestamp: new Date().toLocaleString(),
            headers: req.headers,
            url: req.url,
            method: req.method,
            cookies: req.cookies,
            fingerprint: req.fingerprint,
            ip: req.clientIp
        }])
        await sql(insertPayment.sql, insertPayment.values);
        res.write('200');
        res.end();
    } catch (e) {
        req.status(500).send('processPaypalWebhooks Error: ' + e.message);
    }
}

async function getPaypalLogs(req, res) { // http://localhost/paypal-logs
    const paymentsDB = await sql(`SELECT * FROM payments;`)
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
        route: '/clean-paypal-logs',
        func: cleanPaypalLogs
    },
]

// Example usage:
/*
const authAlgo = "SHA256withRSA"; // Extracted from response header
const certUrl = "cert_url"; // Extracted from response header
const transmissionId = "...-d67a-11e5-baa3-...."; // Extracted from response header
const transmissionSig = "..........."; // Extracted from response header
const transmissionTime = "2016-02-18T20:01:35Z"; // Extracted from response header
const webhookId = "...."; // Your webhook ID configured in Developer Portal
const webhookEvent = {
    "id": ".....",
    "create_time": "2013-06-25T21:41:28Z",
    "resource_type": "authorization",
    "event_type": "PAYMENT.AUTHORIZATION.CREATED",
    "summary": "A payment authorization was created",
    "resource": {
        "id": "......",
        "create_time": "2013-06-25T21:39:15Z",
        "update_time": "2013-06-25T21:39:17Z",
        "state": "authorized",
        "amount": {
            "total": "7.47",
            "currency": "USD",
            "details": { "subtotal": "7.47" }
        },
        "parent_payment": "PAY-.....",
        "valid_until": "2013-07-24T21:39:15Z",
        "links": [{
            "href": "https://api-m.paypal.com/v1/payments/authorization/......",
            "rel": "self",
            "method": "GET"
        },
        {
            "href": "https://api-m.paypal.com/v1/payments/authorization/...../capture",
            "rel": "capture",
            "method": "POST"
        },
        {
            "href": "https://api-m.paypal.com/v1/payments/authorization/...../void",
            "rel": "void",
            "method": "POST"
        },
        {
            "href": "https://api-m.paypal.com/v1/payments/payment/PAY-.....",
            "rel": "parent_payment",
            "method": "GET"
        }]
    }
};

verifyPaypal(authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime, webhookId, webhookEvent);
*/

module.exports = paypalRoutes;