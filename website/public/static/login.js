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
                                                    html: `<select class="multipleSelect" id="multiLangs" multiple="true">
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
                                    type: 'div',
                                    class: 'popup-server-commands',
                                    html: `
                                    <div class="popup-command">
                                        <h3><b>Commands:</b></h3>
                                        <label class="popup-command-info"><b>/aihelp</b> - Help command</label>
                                        <div class="switch">
                                            <input type="checkbox" id="aihelp" checked />
                                            <label for="aihelp">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/pt ola</b> - Translate Portuguese to English</label>
                                        <div class="switch">
                                            <input type="checkbox" id="pt" checked />
                                            <label for="pt">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/en hello</b> - Translate English to Portuguese</label>
                                        <div class="switch">
                                            <input type="checkbox" id="en" checked />
                                            <label for="en">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/a hello or ola</b> - Auto Detect Language & Translate</label>
                                        <div class="switch">
                                            <input type="checkbox" id="a" checked />
                                            <label for="a">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="popup-command">
                                        <h3><b>Voice Commands:</b></h3>
                                        <label class="popup-command-info"><b>/aijoin</b> - Make the bot join/leave the voice channel.</label>
                                        <div class="switch">
                                            <input type="checkbox" id="aijoin" checked />
                                            <label for="aijoin">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/aileave</b> - Make the bot join/leave the voice channel.</label>
                                        <div class="switch">
                                            <input type="checkbox" id="aileave" checked />
                                            <label for="aileave">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/burgil</b> - Make the bot join/leave the voice channel.</label>
                                        <div class="switch">
                                            <input type="checkbox" id="burgil" checked />
                                            <label for="burgil">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/ai ola or hello</b> - Speak to the AI.</label>
                                        <div class="switch">
                                            <input type="checkbox" id="ai" checked />
                                            <label for="ai">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/aipause</b> - Pause the AI from speaking.</label>
                                        <div class="switch">
                                            <input type="checkbox" id="aipause" checked />
                                            <label for="aipause">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/v ola</b> - Speak Portuguese in English</label>
                                        <div class="switch">
                                            <input type="checkbox" id="v" checked />
                                            <label for="v">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/vpt ola</b> - Speak Portuguese in English</label>
                                        <div class="switch">
                                            <input type="checkbox" id="vpt" checked />
                                            <label for="vpt">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/ven hello</b> - Speak English in Portuguese</label>
                                        <div class="switch">
                                            <input type="checkbox" id="ven" checked />
                                            <label for="ven">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/va hello or ola</b> - Auto Detect Language, Translate & Speak</label>
                                        <div class="switch">
                                            <input type="checkbox" id="va" checked />
                                            <label for="va">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="popup-command">
                                        <h3><b>Advanced Commands:</b></h3>
                                        <label class="popup-command-info"><b>/ailisten</b> - The bot will listen to speech, translate, and speak in the other language.</label>
                                        <div class="switch">
                                            <input type="checkbox" id="ailisten" checked />
                                            <label for="ailisten">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/aionly</b> - Make the bot only listen to burgil!</label>
                                        <div class="switch">
                                            <input type="checkbox" id="aionly" checked />
                                            <label for="aionly">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/ailong</b> - Make the bot speak longer responses!</label>
                                        <div class="switch">
                                            <input type="checkbox" id="ailong" checked />
                                            <label for="ailong">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/pingai</b> - Test the bot responsiveness!</label>
                                        <div class="switch">
                                            <input type="checkbox" id="pingai" checked />
                                            <label for="pingai">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/aidc</b> - Force voice channel disconnect!</label>
                                        <div class="switch">
                                            <input type="checkbox" id="aidc" checked />
                                            <label for="aidc">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/aidebug</b> - Test the AI bot's responsiveness with a simple ping command</label>
                                        <div class="switch">
                                            <input type="checkbox" id="aidebug" checked />
                                            <label for="aidebug">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                        <label class="popup-command-info"><b>/airap</b> - Make the bot rap or sing a random song</label>
                                        <div class="switch">
                                            <input type="checkbox" id="airap" checked />
                                            <label for="airap">
                                            <span class="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    `
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