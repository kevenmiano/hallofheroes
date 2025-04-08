import { getdefaultLangageCfg } from "../../core/lang/LanguageDefine";

/**
 * 数据基类
 */
export default class t_s_baseConfigData {

    /**语言 */
    get LanguageKey(): string {
        let cfg = getdefaultLangageCfg();
        if (cfg) {
            return cfg.key;
        }
        return "en";
    }

    getLangKey(value: string): string {
        return value + "_" + this.LanguageKey;
    }

    getKeyValue(key: string): string {
        return this[key];
    }

}

