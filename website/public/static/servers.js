function loadServers(userData, serversContainer) {
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
            let guildLetter = guild.name[0].toUpperCase();
            guildLetter = guildLetter.replace(/[^a-z]+/i, '');
            if (guildLetter == '') guildLetter = '�';
            newServerIMG.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="80" fill="white">REPLACEME</text>
                </svg>`).replace('REPLACEME', guildLetter);
        }
        const newServerIMGDiv = document.createElement('div');
        newServerIMGDiv.classList.add('server-img');
        const newServerIMGDivLabel = document.createElement('div');
        if (guild.isBotExist) {
            newServerIMGDivLabel.classList.add('configure');
            newServerIMGDivLabel.textContent = 'Configure';
        } else {
            newServerIMGDivLabel.classList.add('invite');
            newServerIMGDivLabel.textContent = 'Invite Bot';
        }
        newServerIMGDiv.append(newServerIMG);
        newServerIMGDiv.append(newServerIMGDivLabel);
        newServer.append(newServerIMGDiv);
        const newServerName = document.createElement('p');
        newServerName.textContent = guild.name;
        newServer.append(newServerName);
        serversContainer.append(newServer);
        newServer.onclick = function () {
            if (guild.isBotExist) {
                // show a popup with the server settings
                modalBuilder(document.getElementById('modal-content'), serverModal(newServerIMG.src, guild));
                requestAnimationFrame(function () {
                    setupLangs();
                });
                requestAnimationFrame(function () {
                    openModal('modal-popup');
                });
                requestAnimationFrame(function () {
                    initSelector(".multipleSelect", "Translation Commands...");
                });
            } else {
                notify('Please add the bot to the server first', 'warning', 2000);
                setTimeout(function () {
                    window.open("https://discord.com/oauth2/authorize?client_id=1186414586996478044&permissions=8&scope=bot%20applications.commands&guild_id=" + guildID);
                }, 2000);
            }
        }
    }
    if (serverCount == 0) {
        document.getElementById('server-loader').remove();
        const noServers = document.createElement('div');
        noServers.textContent = 'You do not have any server!';
        serversContainer.append(noServers);
    }
}