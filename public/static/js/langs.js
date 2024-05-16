const locales = ["en-GB", "ar-SA", "zh-CN", "de-DE", "es-ES", "fr-FR", "hi-IN", "it-IT", "in-ID", "ja-JP", "ko-KR", "nl-NL", "he-IL", "no-NO", "pl-PL", "pt-BR", "uk-UA", "sv-SE", "fi-FI", "th-TH", "tr-TR", "ru-RU", "vi-VN"];
function getFlagSrc(countryCode) {
    return /^[A-Z]{2}$/.test(countryCode) ? `https://flagsapi.com/${countryCode.toUpperCase()}/shiny/64.png` : "";
}
let selectedLocale;

function getSelectedLocale() {
    return selectedLocale;
}

function getSelectedLangs() {
    const multiLangs = document.getElementById("multiLangs");
    const result = [];
    const options = multiLangs && multiLangs.options;
    let opt;
    for (let i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

function setSelectedLocale(locale, dropdownBtn, dropdownContent) {
    selectedLocale = locale;
    const intlLocale = new Intl.Locale(locale);
    const langName = new Intl.DisplayNames([locale], {
        type: "language",
    }).of(intlLocale.language);
    dropdownContent.innerHTML = "";
    const otherLocales = locales.filter((loc) => loc !== locale);
    otherLocales.forEach((otherLocale) => {
        const otherIntlLocale = new Intl.Locale(otherLocale);
        const otherLangName = new Intl.DisplayNames([otherLocale], {
            type: "language",
        }).of(otherIntlLocale.language);

        const listEl = document.createElement("li");
        listEl.innerHTML = `${otherLangName}<img src="${getFlagSrc(
            otherIntlLocale.region
        )}" />`;
        listEl.value = otherLocale;
        listEl.addEventListener("mousedown", function () {
            setSelectedLocale(otherLocale, dropdownBtn, dropdownContent);
        });
        dropdownContent.appendChild(listEl);
    });
    dropdownBtn.innerHTML = `<img src="${getFlagSrc(
        intlLocale.region
    )}" />${langName}<span class="arrow-down"></span>`;
}

function setupLangs() {
    const dropdownBtn = document.getElementById("dropdown-btn");
    const dropdownContent = document.getElementById("dropdown-content");
    setSelectedLocale(locales[0], dropdownBtn, dropdownContent);
    const browserLang = new Intl.Locale(navigator.language).language;
    for (const locale of locales) {
        const localeLang = new Intl.Locale(locale).language;
        if (localeLang === browserLang) {
            setSelectedLocale(locale, dropdownBtn, dropdownContent);
        }
    }
}