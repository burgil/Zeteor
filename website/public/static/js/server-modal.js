const serverModal = (serverImage, guild, guildID) => {
    console.log(guildID, guild)
    console.log("commands", guild.commands)
    console.log("settings", guild.settings)
    return [
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
                    class: 'popup-server-commands',
                    html: `
                    <div class="popup-command">
                        <h3><b>Commands:</b></h3>
                        <div class="popup-command-block">
                            <label class="popup-command-info"><b>/aihelp</b> - Help command</label>
                            <div class="switch">
                                <input type="checkbox" id="aihelp" checked />
                                <label for="aihelp">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="aihelp_cmd" multiple="true">
                                <option value="aihelp en" selected>aihelp en</option>
                                <option value="aihelp pt" selected>aihelp pt</option>
                            </select>
                        </div>
                        <div class="popup-command-block">        
                            <label class="popup-command-info"><b>/pt ola</b> - Translate Portuguese to English</label>
                            <div class="switch">
                                <input type="checkbox" id="pt" checked />
                                <label for="pt">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="pt_cmd" multiple="true">
                                <option value="pt" selected>pt</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/en hello</b> - Translate English to Portuguese</label>
                            <div class="switch">
                                <input type="checkbox" id="en" checked />
                                <label for="en">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="en_cmd" multiple="true">
                                <option value="en" selected>en</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/a hello or ola</b> - Auto Detect Language & Translate</label>
                            <div class="switch">
                                <input type="checkbox" id="a" checked />
                                <label for="a">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="a_cmd" multiple="true">
                                <option value="a" selected>a</option>
                            </select>
                        </div>
                    </div>
                    <div class="popup-command">
                        <h3><b>Voice Commands:</b></h3>
                        <div class="popup-command-block">        
                            <label class="popup-command-info">Make the bot join/leave the voice channel.</label>
                            <div class="switch">
                                <input type="checkbox" id="aijoin" checked />
                                <label for="aijoin">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="aijoin_cmd" multiple="true">
                                <option value="aijoin" selected>aijoin</option>
                                <option value="aileave" selected>aileave</option>
                                <option value="burgil" selected>burgil</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/ai ola or hello</b> - Speak to the AI.</label>
                            <div class="switch">
                                <input type="checkbox" id="ai" checked />
                                <label for="ai">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="ai_cmd" multiple="true">
                                <option value="ai" selected>ai</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/aipause</b> - Pause the AI from speaking.</label>
                            <div class="switch">
                                <input type="checkbox" id="aipause" checked />
                                <label for="aipause">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="aipause_cmd" multiple="true">
                                <option value="aipause" selected>aipause</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info">Speak Portuguese in English</label>
                            <div class="switch">
                                <input type="checkbox" id="v" checked />
                                <label for="v">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="v_cmd" multiple="true">
                                <option value="v" selected>v</option>
                                <option value="vpt" selected>vpt</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/ven hello</b> - Speak English in Portuguese</label>
                            <div class="switch">
                                <input type="checkbox" id="ven" checked />
                                <label for="ven">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="ven_cmd" multiple="true">
                                <option value="ven" selected>ven</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/va hello or ola</b> - Auto Detect Language, Translate & Speak</label>
                            <div class="switch">
                                <input type="checkbox" id="va" checked />
                                <label for="va">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="va_cmd" multiple="true">
                                <option value="va" selected>va</option>
                            </select>
                        </div>
                    </div>
                    <div class="popup-command">
                        <h3><b>Advanced Commands:</b></h3>
                        <div class="popup-command-block">        
                            <label class="popup-command-info"><b>/ailisten</b> - The bot will listen to speech, translate, and speak in the other language.</label>
                            <div class="switch">
                                <input type="checkbox" id="ailisten" checked />
                                <label for="ailisten">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="ailisten_cmd" multiple="true">
                                <option value="ailisten" selected>ailisten</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/aionly</b> - Make the bot only listen to burgil!</label>
                            <div class="switch">
                                <input type="checkbox" id="aionly" checked />
                                <label for="aionly">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="aionly_cmd" multiple="true">
                                <option value="aionly" selected>aionly</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/ailong</b> - Make the bot speak longer responses!</label>
                            <div class="switch">
                                <input type="checkbox" id="ailong" checked />
                                <label for="ailong">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="ailong_cmd" multiple="true">
                                <option value="ailong" selected>ailong</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/pingai</b> - Test the bot responsiveness!</label>
                            <div class="switch">
                                <input type="checkbox" id="pingai" checked />
                                <label for="pingai">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="pingai_cmd" multiple="true">
                                <option value="pingai" selected>pingai</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/aidc</b> - Force voice channel disconnect!</label>
                            <div class="switch">
                                <input type="checkbox" id="aidc" checked />
                                <label for="aidc">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="aidc_cmd" multiple="true">
                                <option value="aidc" selected>aidc</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/aidebug</b> - Test the AI bot's responsiveness with a simple ping command</label>
                            <div class="switch">
                                <input type="checkbox" id="aidebug" checked />
                                <label for="aidebug">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="aidebug_cmd" multiple="true">
                                <option value="aidebug" selected>aidebug</option>
                            </select>
                        </div>
                        <div class="popup-command-block">    
                            <label class="popup-command-info"><b>/airap</b> - Make the bot rap or sing a random song</label>
                            <div class="switch">
                                <input type="checkbox" id="airap" checked />
                                <label for="airap">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="airap_cmd" multiple="true">
                                <option value="airap" selected>airap</option>
                            </select>
                        </div>
                    </div>
                    `,
                    js: (el) => {
                        for (const input of el.querySelectorAll('.popup-command input[type="checkbox"]')) {
                            const inputID = input.id;
                            input.addEventListener('change', function () {
                                fetch('/edit-server/commands', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        serverID: guildID,
                                        action: input.checked ? 'enable-command' : 'disable-command',
                                        targetCommand: inputID
                                    })
                                }).then(response => response.json()).then(data => {
                                    console.log(data);
                                    if (data.msg) {
                                        notify(data.msg, 'success');
                                    } else if (data.error) {
                                        notify(data.error, 'error');
                                    } else {
                                        notify('Unknown issue has occurred!', 'error');
                                    }
                                });
                            });
                        }
                    }
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
                // {
                //     type: 'div',
                //     class: 'popup-server-inputs',
                //     html: `
                //     <div class="form-group">
                //         <label>
                //             <input type="text" placeholder="Your name" />
                //             <span>Your name</span>
                //         </label>
                //     </div>
    
                //     <div class="form-group">
                //         <label>
                //             <input type="email" placeholder="Your email address" />
                //             <span>Your email address</span>
                //         </label>
                //     </div>
    
                //     <div class="form-group">
                //         <label>
                //             <textarea placeholder="Your message"></textarea>
                //             <span>Your message</span>
                //         </label>
                //     </div>
                //     `
                // },
            ]
        },
    ];
}