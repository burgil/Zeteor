const express = require('express');
const { URLSearchParams } = require('url');
const axios = require('axios');
const http = require('http');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { example_db, db_save } = require('./db.js');
const { addQueue } = require('./queue.js');
const { sql, generateInsertStatement, generateUpdateStatement, generateDeleteStatement } = require('./sync.js');
const fs = require('fs');
const client_id = fs.readFileSync('../clientID', 'utf8').trim();
const client_secret = fs.readFileSync('../secret', 'utf8').trim();
const togetherAPIKey = fs.readFileSync('../togetherAPIKey', 'utf8').trim();
const { v4: uuidv4 } = require('uuid');
const app = express();
const isSecure = process.platform !== 'win32';
const Fingerprint = require('express-fingerprint');
const requestIp = require('request-ip');
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

app.get('/personas', (req, res) => {
    res.sendFile(path.join(__dirname + '/private/personas.html'));
});
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname + '/private/settings.html'));
});
app.get('/ai', (req, res) => {
    res.sendFile(path.join(__dirname + '/private/ai.html'));
});
app.get('/logout', (req, res) => {
    if (example_db[req.cookies.auth_token]) {
        example_db[req.cookies.auth_token] = undefined;
        db_save();
        res.setHeader("Set-Cookie", 'auth_token=; Path=/; Secure; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
        res.redirect('/');
    } else {
        res.send(JSON.stringify({
            error: 'Not logged in'
        }));
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
                console.log(targetCommand, "Command exist!")
                const serverID = req.body.serverID;
                const action = req.body.action;
                axios.get("https://discord.com/api/users/@me/guilds", {
                    headers: {
                        "authorization": `Bearer ${userData.data.access_token}`
                    }
                }).then(async guilds => {
                    let hasPermissions = false;
                    const guildIds = guilds.data.map(guild => guild.id);
                    const query = `SELECT * FROM servers WHERE discord_id IN (${guildIds.map((_, index) => `$${index + 1}`).join(', ')});`;
                    const serversDB = await sql(query, guildIds);
                    for (const guildID in guilds.data) {
                        if (guildID != serverID) continue;
                        const serverData = serversDB.rows.find(server => server.discord_id === guildID);
                        const guild = guilds.data[guildID];
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
                                    error: "Enabled Command!"
                                }));
                                break;
                            case 'disable-command':
                                responder(JSON.stringify({
                                    error: "Disabled Command!"
                                }));
                                break;
                            case 'add-command':
                                responder(JSON.stringify({
                                    error: "Added Command!"
                                }));
                                break;
                            case 'remove-command':
                                responder(JSON.stringify({
                                    error: "Removed Command!"
                                }));
                                break;
                            case 'change-command-permissions':
                                responder(JSON.stringify({
                                    error: "Changed Command Permissions!"
                                }));
                                break;
                        }
                    }
                });
            }
        } catch (serverError) {
            responder(JSON.stringify({
                error: error.message
            }));
        }
    });
});

let usersCache = {};
app.get('/get-user', (req, res) => {
    if (!req.cookies.auth_token) {
        res.send(JSON.stringify({
            error: 'Not logged in'
        }));
        return;
    }
    const userData = example_db[req.cookies.auth_token];
    if (!userData) {
        res.setHeader("Set-Cookie", 'auth_token=; Path=/; Secure; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
        res.send(JSON.stringify({
            error: 'Not logged in'
        }));
        return;
    }
    if (usersCache[req.cookies.auth_token] && !req.query.update) {
        console.log("cached...");
        res.send(usersCache[req.cookies.auth_token]);
        return;
    }
    console.log("updating...");
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
                        const query = `SELECT * FROM servers WHERE discord_id IN (${guildIds.map((_, index) => `$${index + 1}`).join(', ')});`;
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
                                if (!example_db['guildSettings_' + guild.id]) example_db['guildSettings_' + guild.id] = {};
                                if (!example_db['guildCommands_' + guild.id]) example_db['guildCommands_' + guild.id] = {};
                                db_save();
                                const serverData = serversDB.rows.find(server => server.discord_id === guild.id);
                                adminGuilds[guild.id] = {
                                    name: guild.name,
                                    icon: serverAvatarUrl,
                                    isBotExist: serverData ? true : false,
                                    settings: example_db['guildSettings_' + guild.id],
                                    commands: example_db['guildCommands_' + guild.id],
                                }
                            }
                        }
                        example_db[req.cookies.auth_token].username = user.data.username;
                        example_db[req.cookies.auth_token].id = user.data.id;
                        example_db[req.cookies.auth_token].global_name = user.data.global_name;
                        db_save();
                        let avatarUrl;
                        if (user.data.avatar.startsWith('a_')) {
                            avatarUrl = `https://cdn.discordapp.com/avatars/${user.data.id}/${user.data.avatar}.gif`;
                        } else {
                            avatarUrl = `https://cdn.discordapp.com/avatars/${user.data.id}/${user.data.avatar}.png`;
                        }
                        const output = JSON.stringify({
                            username: user.data.username,
                            global_name: user.data.global_name,
                            avatar: avatarUrl,
                            guilds: adminGuilds
                        });
                        usersCache[req.cookies.auth_token] = output;
                        responder(output);
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
});

app.get('/discord-callback', (req, res) => {
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
                fetch('https://discord.com/api/oauth2/token', { method: "POST", body: data_1 }).then(response => response.json()).then(data => {
                    if (data.error) {
                        console.log(data)
                        responder('Invalid code');
                        return;
                    }
                    const uuid = uuidv4();
                    example_db[uuid] = { // userData
                        data,
                        code
                    };
                    db_save();
                    const currentTime = Date.now();
                    const cookieValue = uuid;
                    const expireTime = 90 * 24 * 60 * 60; // 90 Days
                    const expiresMS = expireTime * 1000;
                    const expires = new Date(currentTime + expiresMS);
                    const authCookie = `auth_token=${cookieValue}; Path=/; Secure; HttpOnly; SameSite=Strict; Priority=High; Expires=${expires.toUTCString()}`;
                    res.setHeader("Set-Cookie", authCookie);
                    res.redirect('/');
                    // res.end();
                });
            } else {
                responder('Missing code parameter');
            }
        } catch (severError) {
            responder('Server Error');
        }
    });
});

app.post('/generate-image', (req, res) => {
    try {
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
            error: error.message
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
