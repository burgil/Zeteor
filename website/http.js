const express = require('express');
const { URLSearchParams } = require('url');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const client_id = fs.readFileSync('../secret', 'utf8').trim();
const client_secret = fs.readFileSync('../clientID', 'utf8').trim();

//create a new express application and creates a function that will generate headers for a Discord API request.
const app = express(); // Create a web app
const port = 80; // Port to host on
/* this function to make configuration for the Discord API */
function make_config(authorization_token) {
    const data = {
        headers: {
            "authorization": `Bearer ${authorization_token}`
        }
    };
    return data;
};

//parse incoming requests of different types
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'public')));

//when the server receives a GET request, it will send the index.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html')); // Send the index.html file
});

//package the data then make a POST request to the Discord API for the authorization token.
app.post('/user', (req, res) => {
    const data_1 = new URLSearchParams();
    data_1.append('client_id', client_id);
    data_1.append('client_secret', client_secret);
    data_1.append('grant_type', 'authorization_code');
    data_1.append('redirect_uri', `http://localhost:${port}/`);
    data_1.append('scope', 'identify');
    data_1.append('code', req.body);
    fetch('https://discord.com/api/oauth2/token', { method: "POST", body: data_1 }).then(response => response.json()).then(data => {
        console.log(data)
    });
});

// axios.get("https://discord.com/api/users/@me", make_config(data.access_token)).then(response => {
//     res.status(200).send(response.data.username);
// }).catch(err => {
//     console.log(err);
//     res.sendStatus(500);
// });

app.listen(port, function () {
    console.log(`App listening! Link: http://localhost:${port}/`);
});