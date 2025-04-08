import GameEventDispatcher from '../event/GameEventDispatcher';
import IManager from '../Interface/IManager';
import LanguageAnalyzer from "./LanguageAnalyzer";
import { getdefaultLangageCfg } from "./LanguageDefine";


export default class LangManager extends GameEventDispatcher implements IManager {


    private _dic: { [key: string]: Object }[] = []

    private _reg: RegExp = new RegExp("\\{(\\d+)\\}");

    private _hasSetup: boolean = false;

    private static ins: LangManager;

    public static get Instance(): LangManager {
        if (!this.ins) {
            this.ins = new LangManager();
        }
        return this.ins;
    }

    preSetup(t?: any) {

    }

    setup(analyzer?: LanguageAnalyzer) {
        if (analyzer) {
            let listData = analyzer.languages;
            this._dic.unshift(listData);
            this._hasSetup = true;
        }
    }


    clear() {
        this._dic = null;
    }

    public get hasSetup(): boolean {
        return this._hasSetup;
    }

    /**
     * 获取当前语言值
     * @param translationId 
     * @param args 
     * @returns 
     */
    public GetTranslation(translationId: string, ...args): string {
        if (!this._hasSetup) return "";

        let translationObj = this.getBykey(translationId);
        var input: string = "";
        if (translationObj) {
            let langCfg = getdefaultLangageCfg();
            input = translationObj[langCfg.key];
        }
        var obj: Object = this._reg.exec(input);
        while (obj && args.length > 0) {
            var id: number = Number(obj[1]);
            if (id >= 0 && id < args.length) {
                input = input.replace(this._reg, args[id]);
            } else {
                input = input.replace(this._reg, "{}");
            }
            obj = this._reg.exec(input);
        }
        return input;
    }

    /**
     * 获取对应语言
     * @param translationId 语言key
     * @param args 匹配{}
     * @returns 
     */
    public getTranslationByLan(translationId: string, lang: string, ...args): string {
        if (!this._hasSetup) return "";

        let translationObj = this.getBykey(translationId);
        var input: string = "";
        if (translationObj) {
            input = translationObj[lang];
        }
        var obj: Object = this._reg.exec(input);
        while (obj && args.length > 0) {
            var id: number = Number(obj[1]);
            if (id >= 0 && id < args.length) {
                input = input.replace(this._reg, args[id]);
            } else {
                input = input.replace(this._reg, "{}");
            }
            obj = this._reg.exec(input);
        }
        return input;
    }

    private getBykey(key: string) {
        for (let d of this._dic) {
            if (d[key]) {
                return d[key];
            }
        }
        return null;
    }


}
