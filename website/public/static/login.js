function loadLoggedInInterface(userData) {
    const userPic = document.getElementById('user-pic');
    const userName = document.getElementById('user-name');
    userName.textContent = userData.global_name;
    userPic.src = userData.avatar;
    const discordAppMount = document.querySelector('.discord-app-mount');
    if (discordAppMount) discordAppMount.style.display = 'none';
    const serversContainer = document.querySelector('.servers-container');
    if (serversContainer) {
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
            newServer.append(newServerIMG);
            const newServerName = document.createElement('p');
            newServerName.textContent = guild.name;
            newServer.append(newServerName);
            serversContainer.append(newServer);
            newServer.onclick = function () {
                if (guild.isBotExist) {
                    // show a popup with the server settings
                    modalBuilder(document.getElementById('modal-content'), [
                        {
                            type: 'div',
                            class: 'popup-server-container',
                            elements: [
                                {
                                    type: 'div',
                                    class: 'popup-server-name-container',
                                    elements: [
                                        {
                                            type: 'img',
                                            src: newServerIMG.src,
                                            class: 'popup-server-icon',
                                        },
                                        {
                                            type: 'h2',
                                            txt: guild.name,
                                            class: 'popup-server-name'
                                        },
                                    ]
                                },
                                {
                                    // server settings: guild.settings
                                    type: 'div',
                                    class: 'popup-server-settings',
                                    elements: [
                                        {
                                            type: 'div',
                                            class: 'popup-server-settings-lang',
                                            elements: [
                                                {
                                                    type: 'span',
                                                    txt: 'Select language',
                                                },
                                                {
                                                    type: 'div',
                                                    class: 'dropdown',
                                                    tabIndex: "0",
                                                    elements: [
                                                        {
                                                            type: 'button',
                                                            id: 'dropdown-btn',
                                                        },
                                                        {
                                                            type: 'ul',
                                                            id: 'dropdown-content',
                                                            class: 'dropdown-content',
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            type: 'div',
                                            class: 'popup-server-settings-test',
                                            elements: [
                                                {
                                                    type: 'div',
                                                    html: `<select class="multipleSelect" multiple="true">
                                                      ${locales.map((otherLocale) => {
                                                        const otherIntlLocale = new Intl.Locale(otherLocale);
                                                        const otherLangName = new Intl.DisplayNames([otherLocale], {
                                                            type: "language",
                                                        }).of(otherIntlLocale.language);
                                                        return `<option value="${otherIntlLocale.region}">${otherLangName}</option>`;
                                                    })}
                                                    </select>`
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    // server commands: guild.commands
                                    type: 'div',
                                    class: 'popup-server-commands',
                                    elements: [
                                        {
                                            type: 'span',
                                            txt: 'test',
                                        },
                                        {
                                            type: 'span',
                                            txt: 'test',
                                        },
                                    ]
                                }
                            ]
                        },
                    ]);
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
            const noServers = document.createElement('div');
            noServers.textContent = 'You do not have any server!'
            serversContainer.append(noServers);
        }
    }
    const twentyFourHours = 12 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const lastVisit = localStorage.getItem('lastVisit');
    if (!lastVisit || (currentTime - parseInt(lastVisit)) >= twentyFourHours) {
        notify(`Welcome back, ${userData.username}!`, 'success', 3500);
        localStorage.setItem('lastVisit', currentTime.toString());
    }
}