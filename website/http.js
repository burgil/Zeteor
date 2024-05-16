const express = require('express');
const { URLSearchParams } = require('url');
const axios = require('axios');
const http = require('http');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { token_db, db_save } = require('./token_db.js');
const { addQueue } = require('./queue.js');
const { setupFrontendRoutes } = require('./routes.js');
const paypalRoutes = require('./paypal.js');
const { sql, generateInsertStatement, generateUpdateStatement, generateDeleteStatement, generateInsertOrUpdateStatement } = require('./sync.js');
const fs = require('fs');
let client_id;
try {
    client_id = fs.readFileSync('../clientID', 'utf8').trim();
} catch (fileErr) { }
let client_secret;
try {
    client_secret = fs.readFileSync('../secret', 'utf8').trim();
} catch (fileErr) { }
let togetherAPIKey;
try {
    togetherAPIKey = fs.readFileSync('../togetherAPIKey', 'utf8').trim();
} catch (fileErr) { }
let randomUUID;
try {
    randomUUID = fs.readFileSync('../randomUUID', 'utf8').trim();
} catch (fileErr) {
    randomUUID = crypto.randomUUID();
    try {
        fs.writeFileSync('../randomUUID', randomUUID, 'utf8');
    } catch (fileErr2) { }
}
async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message + randomUUID);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
const { v4: uuidv4 } = require('uuid');
const app = express();
const { isSecure } = require('./system.js');
const Fingerprint = require('express-fingerprint');
const requestIp = require('request-ip');
let usersCache = {};
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestIp.mw())
app.use(Fingerprint({
    parameters: [
        // Defaults
        Fingerprint.useragent,
        Fingerprint.acceptHeaders,
        Fingerprint.geoip,
        // // Additional parameters
        // function(next) {
        //     // ...do something...
        //     next(null,{
        //     'param1':'value1'
        //     })
        // },
        // function(next) {
        //     // ...do something...
        //     next(null,{
        //     'param2':'value2'
        //     })
        // },
    ]
}))
//
setupFrontendRoutes(app);
for (const paypalRoute of paypalRoutes) {
    if (paypalRoute.method == 'GET') {
        app.get(paypalRoute.route, paypalRoute.func);
    } else if (paypalRoute.method == 'POST') {
        app.post(paypalRoute.route, paypalRoute.func);
    }
}
app.get('/invite', (req, res) => {
    res.redirect('https://discord.com/oauth2/authorize?client_id=1186414586996478044&permissions=8&scope=bot%20applications.commands');
});
app.get('/status', (req, res) => {
    http.get('http://localhost:4444', { timeout: 10 }, (response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
            // console.log(`${URL} is available`);
            res.end('online');
        } else {
            // console.log(`${URL} is not available. Status code: ${statusCode}`);
            res.writeHead(503, { 'Content-Type': 'text/plain' });
            res.end('offline');
        }
    }).on('error', (err) => {
        // console.error(`Error checking ${URL}: ${err.message}`);
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('offline');
    });
});
app.get('/logout', (req, res) => {
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
        if (token_db[req.cookies.auth_token]) {
            token_db[req.cookies.auth_token] = undefined;
            if (usersCache[req.cookies.auth_token]) usersCache[req.cookies.auth_token] = undefined;
            db_save();
            res.setHeader("Set-Cookie", 'auth_token=; Path=/; Secure; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
            res.redirect('/');
        } else {
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});
const serverCommands = {
    '1': [
        'aijoin',
        'aileave',
        'burgil',
    ],
    '2': [
        'aihelp',
        'aihelp en',
        'aihelp pt',
    ],
    '3': [
        'en',
        'pt',
        'a',
    ],
    '4': [
        'aipause',
        'ailisten',
        'aitts',
        'aionly',
        'ailong',
        'pingai',
        'aidc',
        'aidebug',
        'airap',
    ],
    '5': [
        'v',
        'vpt',
        'ven',
        'va',
    ],
    '6': [
        'ai',
    ],
};

app.post('/edit-server/commands', (req, res) => {
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
        addQueue(req, res, function (req, res, responder) {
            res.write('');
            try {
                const targetCommand = req.body.targetCommand;
                let commandExist = false;
                for (const serverCommandID in serverCommands) {
                    for (const command of serverCommands[serverCommandID]) {
                        if (targetCommand === command) {
                            commandExist = true;
                            break;
                        }
                    }
                }
                if (!commandExist) {
                    responder(JSON.stringify({
                        error: "Command doesn't exist!"
                    }));
                } else {
                    const serverID = req.body.serverID;
                    const action = req.body.action;
                    axios.get("https://discord.com/api/users/@me/guilds", {
                        headers: {
                            "authorization": `Bearer ${userData.data.access_token}`
                        }
                    }).then(async guilds => {
                        let hasPermissions = false;
                        const guildIds = guilds.data.map(guild => guild.id);
                        const query = `SELECT discord_id FROM servers WHERE discord_id IN (${guildIds.map((_, index) => `$${index + 1}`).join(', ')});`;
                        const serversDB = await sql(query, guildIds);
                        for (const guildIndex in guilds.data) {
                            const guild = guilds.data[guildIndex];
                            const guildID = guild.id;
                            if (guildID != serverID) continue;
                            const serverData = serversDB.rows.find(server => server.discord_id === guildID);
                            if (guild.permissions == 2147483647 && serverData) hasPermissions = true;
                        }
                        if (!hasPermissions) {
                            responder(JSON.stringify({
                                error: "No Permission!"
                            }));
                        } else {
                            switch (action) {
                                case 'enable-command':
                                    responder(JSON.stringify({
                                        msg: "Enabled Command!"
                                    }));
                                    break;
                                case 'disable-command':
                                    responder(JSON.stringify({
                                        msg: "Disabled Command!"
                                    }));
                                    break;
                                case 'add-command':
                                    responder(JSON.stringify({
                                        msg: "Added Command!"
                                    }));
                                    break;
                                case 'remove-command':
                                    responder(JSON.stringify({
                                        msg: "Removed Command!"
                                    }));
                                    break;
                                case 'change-command-permissions':
                                    responder(JSON.stringify({
                                        msg: "Changed Command Permissions!"
                                    }));
                                    break;
                            }
                        }
                    });
                }
            } catch (serverError) {
                responder(JSON.stringify({
                    error: serverError.message
                }));
            }
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.get('/get-user', async (req, res) => {
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
        if (usersCache[req.cookies.auth_token] && !req.query.update) {
            const output = { // sent to the client
                random: usersCache[req.cookies.auth_token].random,
                id: usersCache[req.cookies.auth_token].id,
                username: usersCache[req.cookies.auth_token].username,
                global_name: usersCache[req.cookies.auth_token].global_name,
                avatar: usersCache[req.cookies.auth_token].avatar,
                guilds: usersCache[req.cookies.auth_token].guilds,
            };
            const currentTime = Date.now();
            const lastCheckTime = usersCache[req.cookies.auth_token].premium_last_check || 0;
            const timeDifference = currentTime - lastCheckTime;
            const shouldRunCode = timeDifference > (5 * 60 * 1000); // 5 minutes in milliseconds
            // console.log("cache - Should return payment status?", shouldRunCode)
            if (shouldRunCode) {
                const userDBQuery = `SELECT payment_status FROM users WHERE discord_id = $1;`;
                const userDB = await sql(userDBQuery, [usersCache[req.cookies.auth_token].id]);
                const isPremium = userDB.rows.length > 0 && userDB.rows[0].payment_status == 'confirm';
                output.premium = isPremium;
                usersCache[req.cookies.auth_token].premium = isPremium;
                usersCache[req.cookies.auth_token].premium_last_check = Date.now();
            } else {
                output.premium = usersCache[req.cookies.auth_token].premium;
            }
            res.send(JSON.stringify(output));
            return;
        }
        addQueue(req, res, function (req, res, responder) {
            res.write('');
            try {
                axios.get("https://discord.com/api/users/@me", {
                    headers: {
                        "authorization": `Bearer ${userData.data.access_token}`
                    }
                }).then(user => {
                    setTimeout(function () {
                        axios.get("https://discord.com/api/users/@me/guilds", {
                            headers: {
                                "authorization": `Bearer ${userData.data.access_token}`
                            }
                        }).then(async guilds => {
                            const adminGuilds = {};
                            const guildIds = guilds.data.map(guild => guild.id);
                            const query = `SELECT discord_id FROM servers WHERE discord_id IN (${guildIds.map((_, index) => `$${index + 1}`).join(', ')});`;
                            const serversDB = await sql(query, guildIds);
                            for (const guild of guilds.data) {
                                if (guild.permissions == 2147483647) {
                                    let serverAvatarUrl;
                                    if (guild.icon) {
                                        if (guild.icon.startsWith('a_')) {
                                            serverAvatarUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif`;
                                        } else {
                                            serverAvatarUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
                                        }
                                    }
                                    const serverData = serversDB.rows.find(server => server.discord_id === guild.id);
                                    adminGuilds[guild.id] = {
                                        name: guild.name,
                                        icon: serverAvatarUrl,
                                        isBotExist: serverData ? true : false,
                                        settings: {},
                                        commands: {},
                                    }
                                }
                            }
                            if (token_db[req.cookies.auth_token].username != user.data.username || token_db[req.cookies.auth_token].id != user.data.id || token_db[req.cookies.auth_token].global_name != user.data.global_name) {
                                token_db[req.cookies.auth_token].username = user.data.username;
                                token_db[req.cookies.auth_token].id = user.data.id;
                                token_db[req.cookies.auth_token].global_name = user.data.global_name;
                                db_save();
                                const insertOrUpdateUser = await generateInsertOrUpdateStatement('users', user.data.id, {
                                    last_login: token_db[req.cookies.auth_token].timestamp,
                                    global_name: user.data.global_name,
                                    username: user.data.username,
                                });
                                await sql(insertOrUpdateUser.sql, insertOrUpdateUser.values);
                            }
                            let avatarUrl;
                            if (user.data.avatar.startsWith('a_')) {
                                avatarUrl = `https://cdn.discordapp.com/avatars/${user.data.id}/${user.data.avatar}.gif`;
                            } else {
                                avatarUrl = `https://cdn.discordapp.com/avatars/${user.data.id}/${user.data.avatar}.png`;
                            }
                            const randomHash = await sha256(user.data.id);
                            const output = { // sent to the client
                                random: randomHash,
                                id: user.data.id,
                                username: user.data.username,
                                global_name: user.data.global_name,
                                avatar: avatarUrl,
                                guilds: adminGuilds,
                            };
                            usersCache[req.cookies.auth_token] = { // saves in the server
                                random: randomHash,
                                id: user.data.id,
                                username: user.data.username,
                                global_name: user.data.global_name,
                                avatar: avatarUrl,
                                guilds: adminGuilds,
                            };
                            const userDBQuery = `SELECT payment_status FROM users WHERE discord_id = $1;`;
                            const userDB = await sql(userDBQuery, [user.data.id]);
                            const isPremium = userDB.rows.length > 0 && userDB.rows[0].payment_status == 'confirm';
                            output.premium = isPremium;
                            usersCache[req.cookies.auth_token].premium = isPremium;
                            usersCache[req.cookies.auth_token].premium_last_check = Date.now();
                            responder(JSON.stringify(output));
                        }).catch(err => {
                            responder(JSON.stringify({
                                error: err.message
                            }));
                        });
                    }, 500);
                }).catch(err => {
                    responder(JSON.stringify({
                        error: err.message
                    }));
                });
            } catch (severError) {
                responder(JSON.stringify({
                    error: 'Server Error'
                }));
            }
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.get('/discord-callback', (req, res) => {
    try {
        addQueue(req, res, function (req, res, responder) {
            // res.write('');
            try {
                const code = req.query.code;
                if (code) {
                    const data_1 = new URLSearchParams();
                    data_1.append('client_id', client_id);
                    data_1.append('client_secret', client_secret);
                    data_1.append('grant_type', 'authorization_code');
                    data_1.append('redirect_uri', isSecure ? 'https://zeteor.roboticeva.com/discord-callback' : `http://localhost${port == '80' ? '' : ':' + port}/discord-callback`);
                    data_1.append('scope', 'identify');
                    data_1.append('code', code);
                    fetch('https://discord.com/api/oauth2/token', { method: "POST", body: data_1 }).then(response => response.json()).then(async data => {
                        if (data.error) {
                            // console.log(data)
                            responder('Invalid code');
                            return;
                        }
                        const uuid = uuidv4();
                        const timestamp = Date.now();
                        token_db[uuid] = { // userData
                            data,
                            code,
                            timestamp
                        };
                        db_save();
                        const currentTime = Date.now();
                        const cookieValue = uuid;
                        const expireTime = data.expires_in || (7 * 24 * 60 * 60); // 7 Days - 604800
                        const expiresMS = expireTime * 1000;
                        const expires = new Date(currentTime + expiresMS);
                        const authCookie = `auth_token=${cookieValue}; Path=/; Secure; HttpOnly; SameSite=Strict; Priority=High; Expires=${expires.toUTCString()}`;
                        res.setHeader("Set-Cookie", authCookie);
                        res.redirect('/');
                        // res.end();
                    });
                } else {
                    const error = req.query.error;
                    if (error) {
                        if (error == 'access_denied') {
                            res.redirect('/');
                        } else {
                            responder(error);
                        }
                    } else {
                        responder('Missing code parameter');
                    }
                }
            } catch (severError) {
                responder('Server Error');
            }
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.post('/generate-image', (req, res) => {
    try {
        const currentOrigin = req.headers.referer ? new URL(req.headers.referer) : {};
        if (isSecure) {
            if (currentOrigin.host != 'zeteor.roboticeva.com') {
                res.json({ error: 'Invalid Request' });
                return;
            }
        } else {
            if (currentOrigin.host != 'localhost') {
                res.json({ error: 'Invalid Request' });
                return;
            }
        }
        const prompt = req.body.prompt;
        const numImages = req.body.numImages;
        const resolution = req.body.resolution;
        axios.post('https://api.together.xyz/api/inference', {
            "model": "SG161222/Realistic_Vision_V3.0_VAE",
            "prompt": prompt,
            "negative_prompt": "",
            "request_type": "image-model-inference",
            "width": parseInt(resolution.split('x')[0]),
            "height": parseInt(resolution.split('x')[1]),
            "steps": 20,
            "n": parseInt(numImages),
            "seed": 7241,
        }, {
            headers: {
                Authorization: 'Bearer ' + togetherAPIKey
            }
        }).then((response) => {
            const aiIMGS = [];
            for (const aiIMG of response.data.output.choices) {
                aiIMGS.push(aiIMG.image_base64);
            }
            res.send(JSON.stringify(aiIMGS));
        }).catch((error) => {
            console.error(error.message);
            res.json({
                error: error.message
            });
        });
    } catch (serverError) {
        res.json({
            error: serverError.message
        });
    }
});

const port = isSecure ? 443 : 80;
(isSecure ? https : http).createServer(isSecure ? {
    cert: fs.readFileSync('./ssl/zeteor.roboticeva.com.pem'),
    key: fs.readFileSync('./ssl/zeteor.roboticeva.com.key'),
} : {}, app).listen(port, '0.0.0.0', function () {
    if (isSecure) {
        console.log(`App listening! Link: https://zeteor.roboticeva.com${port == '443' ? '' : ':' + port}/`);
    } else {
        console.log(`App listening! Link: http://localhost${port == '80' ? '' : ':' + port}/`);
    }
});
