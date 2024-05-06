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
                                            txt: 'test2',
                                        },
                                        {
                                            type: 'div',
                                            html: `
                                            <h1>Commands</h1>
                                            <br>
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="commands">
                                                            <ul class="list-group">
                                                                <li class="list-group-item">
                                                                    <span class="categorias">General Commands: &nbsp</span>
                                                                    <span class="comando">/aihelp</span> - Help Command &nbsp
                                                                    <span class="comando">/pt ola</span> - Translate Portuguese to English &nbsp
                                                                    <span class="comando">/en hello</span> - Translate English to Portuguese &nbsp
                                                                    <span class="comando">/a hello</span> - Auto Detect Language & Translate &nbsp
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br><br>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="commands">
                                                            <ul class="list-group">
                                                                <li class="list-group-item">
                                                                    <span class="categorias">Voice Commands: &nbsp</span>
                                                                    <span class="comando">/aijoin</span> - Make the bot join/leave the voice channel. &nbsp
                                                                    <span class="comando">/aileave</span> - Make the bot join/leave the voice channel. &nbsp
                                                                    <span class="comando">/burgil</span> - Make the bot join/leave the voice channel. &nbsp
                                                                    <span class="comando">/ai ola or hello</span> - Speak to the AI. &nbsp
                                                                    <span class="comando">/aipause</span> - Pause the AI from speaking. &nbsp
                                                                    <span class="comando">/v ola</span> - Speak Portuguese in English. &nbsp
                                                                    <span class="comando">/vpt ola</span> - Speak Portuguese in English. &nbsp
                                                                    <span class="comando">/ven hello</span> - Speak English in Portuguese. &nbsp
                                                                    <span class="comando">/va hello or ola</span> - Auto Detect Language, Translate & Speak
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br><br>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="commands">
                                                            <ul class="list-group">
                                                                <li class="list-group-item">
                                                                    <span class="categorias">Advanced Commands: &nbsp</span>
                                                                    <span class="comando">/ailisten</span> - Enable listen mode - will listen to speech, translate, and speak in the other language. &nbsp
                                                                    <span class="comando">/aionly</span> - Make the bot only listen to burgil! &nbsp
                                                                    <span class="comando">/ailong</span> - Make the bot speak longer responses! &nbsp
                                                                    <span class="comando">/pingai</span> - Test the bot responsiveness! &nbsp
                                                                    <span class="comando">/aidc</span> - Force voice channel disconnect! &nbsp
                                                                    <span class="comando">/aidebug</span> - Test the AI bot's responsiveness with a simple ping command &nbsp
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`,
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