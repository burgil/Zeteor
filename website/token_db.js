const fs = require('fs');
// Token JSON file database:
let token_db = {};
function db_save() {
    try {
        fs.writeFileSync('./ignore/token_db.json', JSON.stringify(token_db), 'utf8');
        return true;
    } catch (dbError) {
        return false;
    }
}
function remove_expired() {
    const currentTime = Date.now();
    console.log("removing expired...");
    let didChange = false;
    for (const token in token_db) {
        console.log("checking token:", token);
        const tokenData = token_db[token];
        console.log("checking tokenData:", tokenData);
        if (tokenData) {
            console.log("checking if token expired...")
            const expireTime = tokenData.data.expires_in || (7 * 24 * 60 * 60);
            const expiresMS = expireTime * 1000;
            const tokenExpiry = (tokenData.timestamp || 0) + expiresMS;
            if (currentTime > tokenExpiry) {
                console.log("Token has expired, remove it from the database", token)
                delete token_db[token];
                didChange = true;
            } else {
                console.log("token is still valid..")
            }
        } else {
            console.log("token data doesn't exist")
        }
    }
    console.log("finished checking token db..")
    if (didChange) {
        console.log("saved tokens db");
        fs.writeFileSync('./ignore/token_db.json', JSON.stringify(token_db), 'utf8');
    } else {
        console.log("didn't save");
    }
}
function db_load() {
    try {
        const tokensDB = fs.readFileSync('./ignore/token_db.json', 'utf8');
        return JSON.parse(tokensDB);
    } catch (dbError) {
        return false;
    }
}
const currentDB = db_load();
if (currentDB) {
    token_db = currentDB;
    remove_expired();
    console.log("Successfully Loaded Tokens DB!");
} else {
    console.log("Tokens DB doesn't exist, creating...")
    db_save();
}
setInterval(function () {
    remove_expired();
}, (7 * 24 * 60 * 60));
//

module.exports = {
    token_db,
    db_load,
    db_save
}