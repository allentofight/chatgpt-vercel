import i18n from 'i18next';

let lang;
if (typeof window !== 'undefined') {
    // we are in the browser
    lang = navigator.language.slice(0, 2);
    // check if language is supported, default to 'en' if not
    if (['en', 'zh'].indexOf(lang) === -1) {
        lang = 'en';
    }
} else {
    // we are in Node.js (e.g., during SSR), default to 'en'
    lang = 'zh';
}

i18n.init({
    resources: {
        en: {
            translations: {
                welcome: "Welcome to Solid.js",
                chat: "AI Chat",
                history: "history",
                aitalk: 'AI Chat',
                aidraw: 'AI Draw',
                aisquare: 'AI Square',
            },
        },
        zh: {
            translations: {
                welcome: "欢迎来到 Solid.js",
                chat: "聊天",
                history: "记录",
                aitalk: 'AI聊天',
                aidraw: 'AI绘画',
                aisquare: 'AI广场',
            },
        },
    },
    lng: lang,
    fallbackLng: "en",
    ns: ["translations"],
    defaultNS: "translations",
});

export default i18n;
