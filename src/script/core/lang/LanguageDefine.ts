var defaultLangKey = "";
var cfgdefaultLangKey = "";
/**
 * 语言结构信息
 */
export type LANGCFG = {
    index: number,
    key: string,
    appkey?: string,
    value: string,
    white?: boolean//白名单语言(限制海外)
}

// 简体中文:zhcn
// 繁体中文:zhtw
// 葡萄牙语:pt
// 意大利语:it
// 西班牙语:es
// 土耳其语:tr
// 越南语:vi
// 泰语:th
// 日语:ja
// 韩语:ko
// 法语:fr
// 德语:de
// 俄语:ru
// 英文:en
/**多语言语种 */
export type multiLangName = {
    zhcn?: "",
    zhtw?: "",
    en?: "",
    de?: "",
    es?: "",
    pt?: "",
    tr?: "",
    fr?: "",
    it?: "",
    vi?: "",
    th?: "",
    ja?: "",
    ko?: "",
    ru?: ""
}

export const MATCHTAGS = {
    "zhcn": /<zhcn>.*?<\/zhcn>/gims,
    "zhtw": /<zhtw>.*?<\/zhtw>/gims,
    "en": /<en>.*?<\/en>/gims,
    "de": /<de>.*?<\/de>/gims,
    "es": /<es>.*?<\/es>/gims,
    "pt": /<pt>.*?<\/pt>/gims,
    "tr": /<tr>.*?<\/tr>/gims,
    "fr": /<fr>.*?<\/fr>/gims,
    "it": /<it>.*?<\/it>/gims,
    "vi": /<vi>.*?<\/vi>/gims,
    "th": /<th>.*?<\/th>/gims,
    "ja": /<ja>.*?<\/ja>/gims,
    "ko": /<ko>.*?<\/ko>/gims,
    "ru": /<ru>.*?<\/ru>/gims
}

export const GAME_ALL_LANG: LANGCFG[] = [];
export const GAME_LANG: LANGCFG[] = []
export const GAME_LANG_WHITE: LANGCFG[] = [];
export const GAME_LIMIT: string[] = [];

export function hasLanguage(languageName: string, zhcn: boolean = false): boolean {
    let element: LANGCFG = null;
    for (const key in GAME_LANG) {
        if (Object.prototype.hasOwnProperty.call(GAME_LANG, key)) {
            element = GAME_LANG[key];
            if (isMathLanguage(element.key, languageName) || isMathLanguage(element.appkey, languageName)) {
                if (GAME_LIMIT.indexOf(element.key) == -1) {//不在配置中
                    return false;
                }
                return true;
            }
        }
    }
    if (zhcn) {
        for (const key in GAME_LANG_WHITE) {
            if (Object.prototype.hasOwnProperty.call(GAME_LANG_WHITE, key)) {
                element = GAME_LANG_WHITE[key];
                if (isMathLanguage(element.key, languageName) || isMathLanguage(element.appkey, languageName)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function getLanguage(languageIndex: number): LANGCFG {
    let element: LANGCFG = null;
    for (const key in GAME_LANG) {
        if (Object.prototype.hasOwnProperty.call(GAME_LANG, key)) {
            element = GAME_LANG[key];
            if (element.index == languageIndex) {
                return element;
            }
        }
    }
    for (const key in GAME_LANG_WHITE) {
        if (Object.prototype.hasOwnProperty.call(GAME_LANG_WHITE, key)) {
            element = GAME_LANG_WHITE[key];
            if (element.index == languageIndex) {
                return element;
            }
        }
    }
    return null;
}

export function getLangIndex(langKey: string): number {
    let element: LANGCFG = null;
    for (const key in GAME_LANG) {
        if (Object.prototype.hasOwnProperty.call(GAME_LANG, key)) {
            element = GAME_LANG[key];
            if (isMathLanguage(element.key, langKey) || isMathLanguage(element.appkey, langKey)) {
                return element.index;
            }
        }
    }
    for (const key in GAME_LANG_WHITE) {
        if (Object.prototype.hasOwnProperty.call(GAME_LANG_WHITE, key)) {
            element = GAME_LANG_WHITE[key];
            if (isMathLanguage(element.key, langKey) || isMathLanguage(element.appkey, langKey)) {
                return element.index;
            }
        }
    }
    return 1;
}

/**设置默认语言 */
export function setCfgDefaultLang(key: string) {
    cfgdefaultLangKey = key;
}

/**设置默认语言 */
export function setDefaultLang(key: string) {
    defaultLangKey = key;
}

/**获取默认语言 */
export function getdefaultLangageCfg(): LANGCFG {
    let languageIdx = getLangIndex(defaultLangKey);//默认
    return getLanguage(languageIdx);
}

/**获取默认语言key */
export function getDefaultLangageKey(): string {
    let languageIdx = getLangIndex(defaultLangKey);//默认
    let cfg = getLanguage(languageIdx);
    return cfg.key;
}

/**获取默认语言索引Index */
export function getDefaultLanguageIndex(): number {
    let languageIdx = getLangIndex(defaultLangKey);//默认
    return languageIdx;
}

/**是否中文语言 */
export function isCNLanguage(): boolean {
    let langCfg = getdefaultLangageCfg();
    let ret = (isMathLanguage(langCfg.key, "zhcn") || isMathLanguage(langCfg.key, "zhtw") || isMathLanguage(langCfg.appkey, "Hans") || isMathLanguage(langCfg.appkey, "Hant"));
    return ret;
}

/**
 * 是否为匹配语言
 * @param sourceLang 源语言
 * @param targetLang 目标语言
 * @returns boolean
 */
export function isMathLanguage(sourceLang: string, targetLang: string): boolean {
    //匹配规则(targetLang中包含sourceLang)
    if (!targetLang) return false;
    if (targetLang.indexOf(sourceLang) != -1) {
        return true;
    }
    return false;
}

/**解析读取多语言 */
export function getMultiLangList(text: string, map: Map<string, string>): Map<string, string> {
    let element = null;
    let titleLangValue = "";
    if (!map) {
        map = new Map();
    }

    let isMulTarget = false;

    for (const key in GAME_ALL_LANG) {
        if (Object.prototype.hasOwnProperty.call(GAME_ALL_LANG, key)) {
            element = GAME_ALL_LANG[key];
            titleLangValue = getMultiLangTag(element.key, text);
            map.set(element.key, titleLangValue);
            titleLangValue && (isMulTarget = true)
        }
    }
    
    if (!isMulTarget) {
        map.set(cfgdefaultLangKey, text);
    }
    return map;
}

/**获取多语言文字 */
export function getMultiLangValue(map: Map<string, string>): string {
    let langKey = getDefaultLangageKey();
    let langValue = map.get(langKey);
    let defaultlangValue = map.get(cfgdefaultLangKey);//配置的默认语言
    if (!langValue || langValue == "") {
        return defaultlangValue;
    }
    return map.get(langKey);
}

/**获取HTML标签, 只返回第1个 */
export function getMultiLangTag(tagKey: string, text: string = ""): string {
    if (!text) return "";
    let result = "";
    let tagReg = null;
    tagReg = MATCHTAGS[tagKey];
    let textValues = text.match(tagReg)
    if (textValues) {
        var pattern = new RegExp(`<\/?${tagKey}+(${tagKey})*>`, "g");
        let textValue = textValues[0]
        result = textValue.replace(pattern, "");
        return result;
    }
    return result;
}

export function hasMultiLangTag(text: string = ""): boolean {
    for (const key in MATCHTAGS) {
        if (Object.prototype.hasOwnProperty.call(MATCHTAGS, key)) {
            let pattern = MATCHTAGS[key];
            let matches = pattern.test(text);
            return matches;
        }
    }
    return false;
}

export function isMatchLangTag(tagKey: string, text: string = ""): boolean {
    let pattern = MATCHTAGS[tagKey];
    let matches = pattern.test(text);
    return matches;
}

