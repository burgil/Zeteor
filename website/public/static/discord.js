var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var demoEle = { lastMsgGroup: null };

var users = {
	phineas: {
		username: '👽🅱🆄🆁🅶🅸🅻🧙',
		nameColor: 'hsl(345, 50%, 52%)',
		avatar: 'https://cdn.discordapp.com/avatars/243439234294349834/a_3aafe5af825b083d50a464860df2e203.gif?size=128'
	},
	paragon: {
		username: 'Zeteor 👽',
		nameColor: 'hsl(212, 51%, 59%)',
		bot: true,
		avatar: 'https://cdn.discordapp.com/app-icons/1186414586996478044/ec3d60b2dcbb6290dcb6a6381e613fd8.png?size=128'
	}
};

var channelData = [{
	name: 'general',
	selected: true,
	messages: [{
		type: 'input',
		text: '/aihelp',
		user: users.phineas
	}, {
		type: 'message',
		delay: 350,
		user: users.paragon,
		embedData: {
			title: '-=-=-=-=-= Help =-=-=-=-=-',
			pill: 'hsl(202, 35%, 68%)',
			thumb: null,
			fields: [{
        name: '-> Language Translation',
        value: '/aihelp - Help command\n/pt ola - Translate Portuguese to English\n/en hello - Translate English to Portuguese\n/a hello or ola - Auto Detect Language & Translate'
			}, {
        name: '-> Voice Commands',
        value: '/aijoin - Make the bot join/leave the voice channel.\n/aileave - Make the bot join/leave the voice channel.\n/burgil - Make the bot join/leave the voice channel.\n/ai ola or hello - Speak to the AI.\n/aipause - Pause the AI from speaking.'
			}, {
        name: '-> Voice Translation',
        value: '/v ola - Speak Portuguese in English\n/vpt ola - Speak Portuguese in English\n/ven hello - Speak English in Portuguese\n/va hello or ola - Auto Detect Language, Translate & Speak'
			}, {
        name: '-> Advanced Commands',
        value: '/ailisten - Enable listen mode - will listen to speech, translate, and speak in the other language.\n/aionly - Make the bot only listen to burgil!\n/ailong - Make the bot speak longer responses!\n/pingai - Test the bot responsiveness!\n/aidc - Force voice channel disconnect!\n/aidebug - Test the AI bot\'s responsiveness with a simple ping command'
			}]
		}
	}]
}, {
	name: 'translator',
	messages: [{
		type: 'input',
		text: '/pt Olá Mundo!',
		user: users.phineas
	}, {
		type: 'message',
		delay: 350,
		user: users.paragon,
		text: '[emoji id="1f5d2"] Hello World!',
		// embedData: {
		// 	title: '-=-=-=-=-= Music =-=-=-=-=-',
		// 	pill: 'hsl(202, 35%, 68%)',
		// 	thumb: 'https://images-ext-2.discordapp.net/external/Zdj-EIYZixh-NSFIQrmwLq6wn8RjzwEk4Hebb--Mryk/https/i.ytimg.com/vi/KOgvA98FifU/hqdefault.jpg?width=80&height=60',
		// 	fields: [{
		// 		name: 'Now Streaming',
		// 		value: 'Trap Nation: 2018 Best Trap Music'
		// 	}, {
		// 		name: 'Duration',
		// 		value: '02:26:33'
		// 	}, {
		// 		name: 'Channel',
		// 		value: 'Uploaded by [strong text="Trap Nation"]'
		// 	}],
		// 	footerIcon: users.phineas.avatar,
		// 	footer: 'Requested By ' + users.phineas.username
		// }
	}, {
		type: 'input',
		text: '/en Hello World!',
		user: users.phineas
	}, {
		type: 'message',
		delay: 350,
		user: users.paragon,
		text: '[emoji id="1f5d2"] Olá Mundo!',
		// embedData: {
		// 	title: '-=-=-=-=-= Music =-=-=-=-=-',
		// 	pill: 'hsl(202, 35%, 68%)',
		// 	thumb: 'https://images-ext-2.discordapp.net/external/Zdj-EIYZixh-NSFIQrmwLq6wn8RjzwEk4Hebb--Mryk/https/i.ytimg.com/vi/KOgvA98FifU/hqdefault.jpg?width=80&height=60',
		// 	fields: [{
		// 		name: 'Now Streaming',
		// 		value: 'Trap Nation: 2018 Best Trap Music'
		// 	}, {
		// 		name: 'Duration',
		// 		value: '02:26:33'
		// 	}, {
		// 		name: 'Channel',
		// 		value: 'Uploaded by [strong text="Trap Nation"]'
		// 	}],
		// 	footerIcon: users.phineas.avatar,
		// 	footer: 'Requested By ' + users.phineas.username
		// }
	}]
}];

var bracketsReplaceRegex = /\[(\S*)\s?(.*?)?\]/g;
var bracketsSplitRegex = /([^"\s]+)|("[^"]*")/g;
var numberTestRegex = /^[\d.]+$/g;

var canAddMessages = true;
var currentlyLoading = false;
var currentChannel = null;

function delay() {
	var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	if (!time) {
		return Promise.resolve();
	}
	return new Promise(function (resolve) {
		return setTimeout(resolve, time);
	});
}

function errorHandle(err) {
	if (err instanceof Error) {
		console.log(err);
	}
}

function clearInput() {
	demoEle.input.value = '';
}

function typeInMessage(text) {
	var prom = Promise.resolve();

	var _loop = function _loop(i) {
		prom = prom.then(function () {
			return delay(50 + Math.random() * 35);
		}).then(function () {
			return demoEle.input.value += text[i];
		});
	};

	for (var i = 0; i < text.length; i++) {
		_loop(i);
	}
	return prom;
}

function clearMessages() {
	if (!canAddMessages || demoEle.lastMsgGroup === null) {
		return Promise.resolve();
	}
	demoEle.lastMsgGroup = null;
	canAddMessages = false;
	demoEle.messages.classList.add('hide');
	return delay(300).then(function () {
		demoEle.messages.innerHTML = '';
		demoEle.messages.classList.remove('hide');
		canAddMessages = true;
	});
}

function scrollMessages() {
	var startY = demoEle.messagesWrapper.scrollTop;
	var endY = demoEle.messages.scrollHeight - demoEle.messagesWrapper.clientHeight;
	demoEle.messagesWrapper.scroll({ top: endY, left: 0, behavior: 'smooth' });
}

function createEmbed(embed, embedData) {
	var _embedData$title = embedData.title,
	    titleText = _embedData$title === undefined ? '' : _embedData$title,
	    _embedData$pill = embedData.pill,
	    pillColor = _embedData$pill === undefined ? 'hsl(0, 0%, 50%)' : _embedData$pill,
	    _embedData$footerIcon = embedData.footerIcon,
	    footerIconURL = _embedData$footerIcon === undefined ? '' : _embedData$footerIcon,
	    _embedData$footer = embedData.footer,
	    footerText = _embedData$footer === undefined ? '' : _embedData$footer,
	    _embedData$thumb = embedData.thumb,
	    thumbURL = _embedData$thumb === undefined ? null : _embedData$thumb,
	    _embedData$fields = embedData.fields,
	    fieldList = _embedData$fields === undefined ? [] : _embedData$fields;

	var pill = createElement({ classes: 'embed-pill', parent: embed, style: { backgroundColor: pillColor } });
	var rich = createElement({ classes: 'embed-rich', parent: embed });
	var content = createElement({ classes: 'embed-content', parent: rich });
	var footerContainer = createElement({ parent: rich, style: { height: footerText ? '18px' : '0px' } });
	var footerIcon = createElement({ tagName: 'img', classes: 'embed-footer-icon', attrs: { width: 20, height: 20 } });
	if (footerIconURL) {
		footerIcon.onload = function () {
			return footerIcon.width = footerIcon.naturalWidth, footerIcon.height = footerIcon.naturalHeight;
		};
		footerIcon.src = footerIconURL;
		footerContainer.appendChild(footerIcon);
	}
	var footer = createElement({ tagName: 'span', classes: 'embed-footer', parent: footerContainer, text: footerText });
	var innerContent = createElement({ classes: 'embed-inner-content', parent: content });
	var thumb = createElement({ tagName: 'img', classes: 'embed-thumb', attrs: { width: 80, height: 80 } });
	var title = createElement({ classes: 'embed-title', parent: innerContent, text: titleText });
	var fields = createElement({ classes: 'embed-fields', parent: innerContent });
	if (thumbURL) {
		thumb.onload = function () {
			return thumb.width = thumb.naturalWidth, thumb.height = thumb.naturalHeight;
		};
		thumb.src = thumbURL;
		content.appendChild(thumb);
	}
	if (fieldList.length) {
		fieldList.forEach(function (_ref) {
			var name = _ref.name,
			    value = _ref.value,
			    inline = _ref.inline;

			var fieldClasses = ['embed-field'];
			if (inline) {
				fieldClasses.push('embed-field-inline');
			}
			var field = createElement({ classes: fieldClasses, parent: fields });
			var nameEle = createElement({ classes: 'embed-field-name', parent: field, text: name });
			var valueEle = createElement({ classes: 'embed-field-value', parent: field, text: value });
		});
	}
	return { embed: embed, embedData: embedData, pill: pill, rich: rich, content: content, footerContainer: footerContainer, footerIcon: footerIcon, footer: footer, thumb: thumb, innerContent: innerContent, title: title, fields: fields };
}

function createMessageGroup() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _opts$avatar = opts.avatar,
	    avatarUrl = _opts$avatar === undefined ? '' : _opts$avatar,
	    _opts$username = opts.username,
	    name = _opts$username === undefined ? '' : _opts$username,
	    _opts$nameColor = opts.nameColor,
	    nameColor = _opts$nameColor === undefined ? '' : _opts$nameColor,
	    _opts$bot = opts.bot,
	    bot = _opts$bot === undefined ? false : _opts$bot;

	var group = createElement({ classes: 'message-group' });
	var avatar = createElement({ classes: 'avatar', parent: group });
	var comment = createElement({ classes: 'comment', parent: group });
	var usernameWrapper = createElement({ classes: 'username-wrapper', parent: comment });
	var username = createElement({ classes: 'username', text: name, parent: usernameWrapper });
	var botTag = createElement({ classes: 'bot-tag' });
	var date = new Date();
	var time = date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
	var timestamp = createElement({ classes: 'timestamp', text: 'Today at ' + time, parent: usernameWrapper });
	var out = {
		group: group, avatar: avatar, comment: comment, usernameWrapper: usernameWrapper, username: username, timestamp: timestamp,
		name: name, bot: bot, date: date
	};
	if (bot) {
		usernameWrapper.appendChild(botTag);
		out.botTag = botTag;
	}
	if (avatarUrl) {
		avatar.style.backgroundImage = 'url(' + avatarUrl + ')';
	}
	if (nameColor) {
		username.style.color = nameColor;
	}
	return out;
}

function createMessage() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _opts$text = opts.text,
	    text = _opts$text === undefined ? '' : _opts$text,
	    _opts$embedData = opts.embedData,
	    embedData = _opts$embedData === undefined ? null : _opts$embedData;

	var message = createElement({ classes: 'message' });
	var body = createElement({ classes: 'body', parent: message });
	var messageText = createElement({ classes: 'message-text', text: text, parent: body });
	var embed = createElement({ classes: 'embed' });
	var embedContent = null;
	if (embedData) {
		message.appendChild(embed);
		embedContent = createEmbed(embed, embedData);
	}
	return { message: message, body: body, messageText: messageText, embed: embed, embedContent: embedContent };
}

function showElement(ele) {
	ele.classList.add('animate-in');
}

function addMessage() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	if (!canAddMessages) {
		console.log('Cannot add message currently');
		return Promise.reject(false);
	}
	var _opts$username2 = opts.username,
	    username = _opts$username2 === undefined ? '' : _opts$username2,
	    _opts$lastMsgGroup = opts.lastMsgGroup,
	    lastMsgGroup = _opts$lastMsgGroup === undefined ? null : _opts$lastMsgGroup;

	var prom = Promise.resolve();
	if (lastMsgGroup === null) {
		lastMsgGroup = demoEle.lastMsgGroup;
		if (lastMsgGroup === null || lastMsgGroup.name !== username) {
			lastMsgGroup = createMessageGroup(opts);
			demoEle.messages.appendChild(lastMsgGroup.group);
			demoEle.lastMsgGroup = lastMsgGroup;
			prom = delay(50).then(function () {
				return showElement(lastMsgGroup.group);
			});
		}
	}
	var message = createMessage(opts);
	lastMsgGroup.comment.appendChild(message.message);
	prom = delay(25).then(function () {
		lastMsgGroup.group.style.maxHeight = 'none';
		showElement(message.message);
		setTimeout(scrollMessages, 35);
	});
}

function setChannel(name) {
	demoEle.channelName.innerText = name;
	demoEle.input.placeholder = 'Message #' + name;
	demoEle.channelsList.forEach(function (n) {
		return n.classList.remove('selected');
	});
	demoEle.channelsList.find(function (n) {
		return n.innerText === name;
	}).classList.add('selected');
	return delay(50);
}

function loadChannel() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _opts$name = opts.name,
	    name = _opts$name === undefined ? 'general' : _opts$name,
	    _opts$messages = opts.messages,
	    messages = _opts$messages === undefined ? [] : _opts$messages;

	if (name === currentChannel || currentlyLoading || !canAddMessages) {
		return Promise.reject(false);
	}
	currentlyLoading = true;
	currentChannel = name;
	return setChannel(name).then(function () {
		return clearMessages();
	}).then(function () {
		return delay(200);
	}).then(function () {
		var prom = Promise.resolve();
		messages.forEach(function (n) {
			var _n$type = n.type,
			    type = _n$type === undefined ? 'message' : _n$type,
			    _n$user = n.user,
			    user = _n$user === undefined ? { username: 'User' } : _n$user,
			    _n$text = n.text,
			    text = _n$text === undefined ? '' : _n$text,
			    _n$delay = n.delay,
			    delayTime = _n$delay === undefined ? 0 : _n$delay;

			if (type === 'input') {
				prom = prom.then(function () {
					return delay(delayTime);
				}).then(function () {
					return typeInMessage(text);
				}).then(function () {
					return delay(250);
				}).then(clearInput).then(function () {
					return addMessage(Object.assign({}, user, n));
				});
			} else if (type === 'message') {
				prom = prom.then(function () {
					return delay(delayTime);
				}).then(function () {
					return addMessage(Object.assign({}, user, n));
				});
			}
		});
		return prom.then(function () {
			return currentlyLoading = false;
		});
	});
}

window.addEventListener('load', function () {
	// Preload avatars
	Object.values(users).forEach(function (n) {
		return document.createElement('img').src = n.avatar;
	});
	var root = document.getElementById('discord-bot');
	var app = root.querySelector('.discord-app');
	var elements = {
		root: root,
		app: app,
		invite: '.invite-now',
		guildName: [app, '.channels .header'],
		channels: [app, '.channel-wrapper'],
		channelName: [app, '.chat .header'],
		messagesWrapper: [app, '.chat .messages-wrapper'],
		messages: [app, '.chat .messages'],
		input: [app, '.chat .input textarea']
	};
	var _ele = Object.keys(elements).reduce(function (p, key) {
		var n = elements[key];
		var element = n;
		if (typeof n === 'string') {
			element = root.querySelector(n);
		} else if (Array.isArray(n)) {
			element = n[0].querySelector(n[1]);
		}
		p[key] = element;
		return p;
	}, {});
	Object.assign(demoEle, _ele);
	var selectedChannel = void 0;
	channelData.forEach(function (n) {
		var name = n.name,
		    _n$selected = n.selected,
		    selected = _n$selected === undefined ? false : _n$selected;

		if (selected) {
			selectedChannel = n;
		}
		n.ele = createElement({ classes: ['channel', selected ? 'selected' : ''], text: name, parent: demoEle.channels });
		n.ele.addEventListener('click', function () {
			return loadChannel(n).catch(errorHandle);
		});
	});
	demoEle.channelsList = Array.from(demoEle.channels.children);
	delay(600).then(function () {
		return loadChannel(selectedChannel);
	}).catch(errorHandle);
});

function parseBrackets(text) {
	var changedBrackets = false;
	var result = text.replace(bracketsReplaceRegex, function (match, tag, attributes) {
		var attr = {};
		if (typeof attributes !== 'number') {
			attr = attributes.split(bracketsSplitRegex).filter(function (n) {
				return n && n.trim();
			}).reduce(function (p, n) {
				return n[0] === '"' ? p[p.length - 1] += n : p.push(n), p;
			}, []).map(function (n) {
				var spl = n.split(/=/);
				// if(spl.length === 1) {
				// }
				if (numberTestRegex.test(spl[1])) {
					spl[1] = parseFloat(spl[1]);
				} else {
					var m = spl[1].match(/"(.*)"/);
					if (m !== null && m.length === 2) {
						spl[1] = m[1];
					}
				}
				return spl;
			}).reduce(function (p, n) {
				return p[n[0]] = n[1] || true, p;
			}, {});
			var ret = null;
			if (tag === 'emoji') {
				ret = '<img class="emoji" src="https://twemoji.maxcdn.com/2/svg/' + attr.id.toLowerCase() + '.svg">';
			} else if (tag === 'strong') {
				ret = '<strong>' + attr.text + '</strong>';
			}
			if (ret) {
				changedBrackets = true;
				return ret;
			}
		}
		return match;
	});
	return { result: result, changedBrackets: changedBrackets };
}

function createElement() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _opts$tagName = opts.tagName,
	    tagName = _opts$tagName === undefined ? 'div' : _opts$tagName,
	    _opts$classes = opts.classes,
	    classes = _opts$classes === undefined ? [] : _opts$classes,
	    _opts$id = opts.id,
	    id = _opts$id === undefined ? '' : _opts$id,
	    _opts$text2 = opts.text,
	    text = _opts$text2 === undefined ? '' : _opts$text2,
	    _opts$attrs = opts.attrs,
	    attrs = _opts$attrs === undefined ? [] : _opts$attrs,
	    _opts$style = opts.style,
	    style = _opts$style === undefined ? null : _opts$style,
	    _opts$parent = opts.parent,
	    parent = _opts$parent === undefined ? null : _opts$parent;

	var ele = document.createElement(tagName);
	if (typeof classes === 'string' && classes.length) {
		ele.classList.add(classes);
	} else if (Array.isArray(classes) && classes.length) {
		var _ele$classList;

		(_ele$classList = ele.classList).add.apply(_ele$classList, _toConsumableArray(classes.filter(function (n) {
			return n;
		})));
	}
	if (id) {
		ele.id = id;
	}
	if (text) {
		var hasBrackets = /\[.*?\]/g.test(text);

		var _ref2 = hasBrackets ? parseBrackets(text) : {},
		    _ref2$result = _ref2.result,
		    result = _ref2$result === undefined ? text : _ref2$result,
		    _ref2$changedBrackets = _ref2.changedBrackets,
		    changedBrackets = _ref2$changedBrackets === undefined ? false : _ref2$changedBrackets;

		ele[changedBrackets ? 'innerHTML' : 'innerText'] = result;
	}
	if (Array.isArray(attrs)) {
		if (attrs.length === 1) {
			var _attrs = _slicedToArray(attrs, 1),
			    attr = _attrs[0];

			ele.setAttribute(attr[0], attr[1]);
		} else if (attrs.length) {
			attrs.forEach(function (attr) {
				return ele.setAttribute(attr[0], attr[1]);
			});
		}
	} else if (attrs) {
		var keys = Object.keys(attrs);
		keys.forEach(function (key) {
			return ele.setAttribute(key, attrs[key]);
		});
	}
	if (style) {
		var _keys = Object.keys(style);
		_keys.forEach(function (key) {
			return ele.style[key] = style[key];
		});
	}
	if (parent) {
		parent.appendChild(ele);
	}
	return ele;
}