const express = require('express');
const { URLSearchParams } = require('url');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { example_db, db_save } = require('./db.js');
const fs = require('fs');
const client_id = fs.readFileSync('../clientID', 'utf8').trim();
const client_secret = fs.readFileSync('../secret', 'utf8').trim();
const togetherAPIKey = fs.readFileSync('../togetherAPIKey', 'utf8').trim();
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 80;
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'public')));

//
function checkBotServers(serverID) {
    const botServers = [
        "1112920281367973900",
        "1234408445525098527"
    ];
    let isBotInServer = false;
    for (const botServerID of botServers) {
        if (serverID == botServerID) {
            isBotInServer = true;
            break;
        }
    }
    return isBotInServer;
}

app.get('/commands', (req, res) => {
    res.sendFile(path.join(__dirname + '/private/commands.html'));
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

app.post('/edit-server/commands', (req, res) => {
    // get the server ID
    const serverID = '';
    // get action:
    const action = ''; // examples: edit-command , disable-command , change-command-permissions
    // check if the user has permissions to modify this server
    axios.get("https://discord.com/api/users/@me/guilds", {
        headers: {
            "authorization": `Bearer ${userData.data.access_token}`
        }
    }).then(guilds => {
        let hasPermissions = false;
        for (const guildID in guilds.data) {
            if (guildID != serverID) continue;
            const guild = guilds.data[guildID];
            if (guild.permissions == 2147483647 && checkBotServers(guildID)) hasPermissions = true;
        }
    });
});

app.get('/get-user', (req, res) => {
    try {
        const userData = example_db[req.cookies.auth_token];
        if (userData) {
            axios.get("https://discord.com/api/users/@me", {
                headers: {
                    "authorization": `Bearer ${userData.data.access_token}`
                }
            }).then(user => {
                axios.get("https://discord.com/api/users/@me/guilds", {
                    headers: {
                        "authorization": `Bearer ${userData.data.access_token}`
                    }
                }).then(guilds => {
                    const adminGuilds = {};
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
                            adminGuilds[guild.id] = {
                                name: guild.name,
                                icon: serverAvatarUrl,
                                isBotExist: checkBotServers(guild.id),
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
                    res.status(200).send(JSON.stringify({
                        username: user.data.username,
                        global_name: user.data.global_name,
                        avatar: avatarUrl,
                        guilds: adminGuilds
                    }));
                }).catch(err => {
                    res.send(JSON.stringify({
                        error: err.message
                    }));
                });
            }).catch(err => {
                res.send(JSON.stringify({
                    error: err.message
                }));
            });
        } else {
            res.send(JSON.stringify({
                error: 'Missing code parameter'
            }));
        }
    } catch (severError) {
        res.send(JSON.stringify({
            error: 'Server Error'
        }));
    }
});

app.get('/discord-callback', (req, res) => {
    try {
        const code = req.query.code;
        if (code) {
            const data_1 = new URLSearchParams();
            data_1.append('client_id', client_id);
            data_1.append('client_secret', client_secret);
            data_1.append('grant_type', 'authorization_code');
            data_1.append('redirect_uri', `http://localhost${port == '80' ? '' : ':' + port}/discord-callback`);
            data_1.append('scope', 'identify');
            data_1.append('code', code);
            fetch('https://discord.com/api/oauth2/token', { method: "POST", body: data_1 }).then(response => response.json()).then(data => {
                if (data.error) {
                    console.log(data)
                    res.status(400).send('Invalid code');
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
            });
        } else {
            res.status(400).send('Missing code parameter');
        }
    } catch (severError) {
        res.status(500).send('Server Error');
    }
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

app.listen(port, function () {
    console.log(`App listening! Link: http://localhost${port == '80' ? '' : ':' + port}/`);
});
