function loadLoggedInInterface(userData) {
    const userPic = document.getElementById('user-pic');
    const userName = document.getElementById('user-name');
    userName.textContent = userData.global_name;
    userPic.src = userData.avatar;
    notify(`Welcome back, ${userData.username}!`, 'success', 3500);
    const serversContainer = document.querySelector('.servers-container');
    let serverCount = 0;
    for (const guildID in userData.guilds) {
        const guild = userData.guilds[guildID];
        serverCount += 1;
        const newServer = document.createElement('div');
        newServer.classList.add('server');
        const newServerIMG = document.createElement('img');
        if (guild.icon) {
            newServerIMG.src = guild.icon;
        } else {
            newServerIMG.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="80" fill="white">${guild.name[0].toUpperCase()}</text>
                </svg>`
            );
        }
        newServer.append(newServerIMG);
        const newServerName = document.createElement('p');
        newServerName.textContent = guild.name;
        newServer.append(newServerName);
        serversContainer.append(newServer);
        newServer.onclick = function () {
            if (guild.isBotExist) {
                notify(guildID, 'success', 4000);
            } else {
                notify('Please add the bot to the server first', 'warning', 2000);
                setTimeout(function () {
                    window.open("https://discord.com/oauth2/authorize?client_id=1186414586996478044&permissions=8&scope=bot%20applications.commands&guild_id=" + guildID);
                }, 2000);
            }
        }
    }
    if (serverCount == 0) {
        const noServers = document.createElement('div');
        noServers.textContent = 'You do not have any server!'
        serversContainer.append(noServers);
    }

}