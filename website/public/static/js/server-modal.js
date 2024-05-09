const serverModal = (serverImage, guild) => [
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
                        src: serverImage,
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
                class: 'popup-server-inputs',
                html: `
                <div class="form-group">
                    <label>
                        <input type="text" placeholder="Your name" />
                        <span>Your name</span>
                    </label>
                </div>

                <div class="form-group">
                    <label>
                        <input type="email" placeholder="Your email address" />
                        <span>Your email address</span>
                    </label>
                </div>

                <div class="form-group">
                    <label>
                        <textarea placeholder="Your message"></textarea>
                        <span>Your message</span>
                    </label>
                </div>
                `
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
            },
        ]
    },
]