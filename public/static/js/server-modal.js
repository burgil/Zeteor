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
                    class: 'popup-server-personas',
                    html: `
                    <div class="song-container">
                        <div class="song">
                            <div class="song-img" id="persona-0">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/ea61baa7-9c4b-4f43-805e-81de5fc8aa2b" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Mentor</h2>
                                <p>This persona is like a wise teacher or mentor, always ready to offer advice, guidance, and knowledge on a wide range of topics, from academics to personal development.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                        <div class="song">
                            <div class="song-img" id="persona-1">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/6f72f702-c049-46fe-af76-a3b188b9a909" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Storyteller</h2>
                                <p>Imagine an AI that loves to tell captivating stories, whether they're fictional tales, historical anecdotes, or personal narratives. This persona keeps listeners entertained and engaged with its vivid storytelling abilities.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                        <div class="song">
                            <div class="song-img" id="persona-2">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/ad2e664a-3ab9-4f30-933a-623e26999030" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Virtual Friend</h2>
                                <p>Need someone to chat with about your day, your interests, or just to share some laughs? The Virtual Friend persona is there for you, offering companionship, empathy, and a listening ear whenever you need it.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                        <div class="song">
                            <div class="song-img" id="persona-3">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/666e065b-eb53-4320-a580-30e266370955" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Historical Figure</h2>
                                <p>Ever wished you could chat with a famous historical figure like Albert Einstein, Marie Curie, or Leonardo da Vinci? This persona brings historical figures to life, allowing you to engage in thought-provoking conversations with some of the greatest minds in history.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                        <div class="song">
                            <div class="song-img" id="persona-4">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/619ed17f-5df2-4d32-a419-78f120a1aa5c" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Relationship Advisor</h2>
                                <p>Struggling with matters of the heart? The Relationship Advisor persona offers thoughtful advice and support on topics related to love, dating, friendships, and more.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                        <div class="song">
                            <div class="song-img" id="persona-5">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/0ed3f51d-b769-4256-a4dd-8f35b12a1690" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Gaming Buddy</h2>
                                <p>Whether you're looking for tips on your favorite video game, someone to team up with for multiplayer matches, or just want to chat about gaming news and trends, the Gaming Buddy persona is the perfect companion for gamers.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                        <div class="song">
                            <div class="song-img" id="persona-6">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/33779e1a-55f9-402a-b004-002395d0fbf1" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Wellness Coach</h2>
                                <p>Need help staying motivated to exercise, eat healthy, or practice self-care? The Wellness Coach persona provides encouragement, tips, and personalized advice to help you achieve your wellness goals.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                        <div class="song">
                            <div class="song-img" id="persona-7">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/96bc0648-51f9-46ab-a426-766c6bc93d80" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Science Geek</h2>
                                <p>Curious about the latest scientific discoveries, space exploration, or technological advancements? The Science Geek persona is a treasure trove of scientific knowledge and enthusiasm, ready to geek out with you over all things science-related.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                        <div class="song">
                            <div class="song-img" id="persona-8">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/885b67a7-1816-4235-9dd3-5d879a202728" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="song-title">
                                <h2>The Creative Collaborator</h2>
                                <p>Whether you're an artist, writer, musician, or just someone with a passion for creativity, the Creative Collaborator persona is your creative partner in crime, offering inspiration, feedback, and collaboration opportunities to help you bring your creative projects to life.</p>
                            </div>
                            <span>FREE</span>
                        </div>
                    </div>
                    `
                },
                {
                    type: 'div',
                    class: 'popup-server-inputs',
                    html: `
                    <div class="form-group">
                        <label>
                            <textarea placeholder="Write Your Server AI System Message Prompt..."></textarea>
                            <span>AI System Message Prompt</span>
                        </label>
                        <div class="popup-server-selected-persona">
                            <p>Selected Persona</p>
                            <div class="song-img" id="persona-1">
                                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/6f72f702-c049-46fe-af76-a3b188b9a909" alt="">
                                <div class="overlay">
                                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div class="popup-selected-persona">Persona Name</div>
                        </div>
                    </div>
                    `
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
                            <label class="popup-command-info"><b>/aitts</b> - Enable TTS mode - will listen to text, and speak in the detected language.</label>
                            <div class="switch">
                                <input type="checkbox" id="aitts" checked />
                                <label for="aitts">
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <select class="multipleSelectCMD" id="aitts_cmd" multiple="true">
                                <option value="aitts" selected>aitts</option>
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
                                console.log("send", input.checked)
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