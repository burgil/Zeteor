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
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 80;
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});
app.get('/logout', (req, res) => {
    res.setHeader("Set-Cookie", 'auth_token=; Path=/; Secure; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.redirect('/');
});
app.get('/get-user', (req, res) => {
    try {
        const userData = example_db[req.cookies.auth_token];
        if (userData) {
            axios.get("https://discord.com/api/users/@me", {
                headers: {
                    "authorization": `Bearer ${userData.data.access_token}`
                }
            }).then(response => {
                example_db[req.cookies.auth_token].username = response.data.username;
                example_db[req.cookies.auth_token].id = response.data.id;
                example_db[req.cookies.auth_token].global_name = response.data.global_name;
                db_save();
                let avatarUrl;
                if (response.data.avatar.startsWith('a_')) {
                    avatarUrl = `https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}.gif`;
                } else {
                    avatarUrl = `https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}.png`;
                }
                res.status(200).send(JSON.stringify({
                    username: response.data.username,
                    global_name: response.data.global_name,
                    avatar: avatarUrl
                }));
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
                const expireTime = 90 * 24 * 60 * 60;
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

app.listen(port, function () {
    console.log(`App listening! Link: http://localhost:${port}/`);
});