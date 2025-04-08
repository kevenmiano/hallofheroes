import { GAME_ALL_LANG, GAME_LANG, GAME_LANG_WHITE, LANGCFG } from "../../core/lang/LanguageDefine";
import { isOversea, saveZoneData, updateZoneData } from "../module/login/manager/SiteZoneCtrl";
import SiteZoneData from "../module/login/model/SiteZoneData";

export class PathInfo {

    /**
    *官网地址与充值接口列表 
    */
    private _PAY: string = "";
    /* 
    模板路径 
    */
    public TEMPLATE_PATH: string;

    //sns地址
    private _SNSPATH: string;
    /**
     * 位置
     */
    private _SITE: string;
    /**
    *ORDER接口地址 
    */
    public _SITE_ZONE: SiteZoneData[] = [];

    private _REQUEST_PATH: string = "";

    /**
     * 跳转地址 
     */
    public FOWARDSITE: string;
    /**
     * 跳转地址名称
     */
    public FOWARDNAME: string;

    /**
     * 内城地址
     */
    public CastleServicePath: string;
    /**
     * 平台
     */
    public PLATFORM: object = {};

    /**
     * 游戏名称
     */
    public GAME_NAME: string = "";
    /**
     * 语言
     */
    public LANGUAGE: string = "zhcn";

    /**
     * 语言类型
     */
    public _LANGUAGE_Config: LANGCFG[] = [];

    /**
     * SITE
     */
    public SITES: object = {};

    /**
    /**
     * 资源路径 
     */
    public ResourcePath: string;
    /**
     * 聊天socket地址 
     */
    public SocktPath: string;
    /**
     * 聊天socket端口 
     */
    public SocketPort: number = 0;
    /**
     * 战斗socket地址 
     */
    public BattleSocketPath: string;
    /**
     * 战斗socket端口 
     */
    public BattlePort: number = 0;
    /**
     * 客服上传图片地址 
     */
    public UPLOAD_PATH: string;
    /**
     *新手剧情动画 
        */
    public STORY_MOVIE: string;

    /**
     *登陆器标题名 
        */
    public CLIENT_LOGIN_NAME: string;

    /**
     *游戏版本号 
        */
    public VERSION: string;

    /**
     *表情数量 
        */
    public FACE_NUM: number = 0;

    /**
     *登陆器地址 
        */
    private _CLIENT_LOGIN_PATH: string;

    public NICK_NAME_PATH: string;

    private _AASRequestPath: string;
    private _AASRegisterPath: string;

    public LOADINGSUSLIKS: number = 0;

    public LOGIN_CHECK_NICK: number = 0;

    public _LOGO_CODE: string[] = [];

    private _SECURITY_GRAPHY: string[] = [];

    private _isLogoActive: boolean = true;

    public MICRO_TERMINAL: string = "";

    public BETA_SITES: string[] = [];

    public RELOAD_ALERT: boolean = false;

    public serviceAppID: number = 0;

    public serviceURL: string = "";

    public share_android: number[] = [];
    public share_ios: number[] = [];
    public share_web: number[] = [];

    //游戏默认语种
    public set LANGUAGE_DEF(value) {
        this._LANGUAGE_Config = value;
        let count = this._LANGUAGE_Config.length;
        for (let index = 0; index < count; index++) {
            let element = this._LANGUAGE_Config[index];
            GAME_ALL_LANG.push(element);//所有语言配置
            if (element.white) {
                GAME_LANG_WHITE.push(element);
            } else {
                GAME_LANG.push(element);
            }
        }
    }

    public get LANGUAGE_DEF(): LANGCFG[] {
        return this._LANGUAGE_Config;
    }

    public set SITE_ZONE(value) {
        this._SITE_ZONE = value;
        if (this._SITE_ZONE.length <= 1) {
            saveZoneData(this._SITE_ZONE[0]);
        } else {
            updateZoneData(this._SITE_ZONE);
        }
    }

    public get SITE_ZONE(): SiteZoneData[] {
        return this._SITE_ZONE;
    }

    public get siteZoneCount(): number {
        return this._SITE_ZONE.length;
    }

    public getSiteData(siteID: number): object {
        // "siteID,siteName,siteOrder
        if (this._SITE_ZONE) {
            for (let key in this._SITE_ZONE) {
                if (Object.prototype.hasOwnProperty.call(this._SITE_ZONE, key)) {
                    let zoneItem: any = this._SITE_ZONE[key];
                    if (zoneItem.siteID == siteID) {
                        return zoneItem;
                    }
                }
            }
        }
        return null;
    }

    public set REQUEST_PATH(value: string) {
        this._REQUEST_PATH = value + "/";
        this.TEMPLATE_PATH = this._REQUEST_PATH + "xml/";
    }

    public get REQUEST_PATH(): string {
        return this._REQUEST_PATH;
    }

    public set LOGO_CODE(value: string[]) {
        this._LOGO_CODE = value;
    }

    public get LOGO_CODE(): string[] {
        return this._LOGO_CODE;
    }

    public set SECURITY_GRAPHY(value: string[]) {
        this._SECURITY_GRAPHY = value;
    }

    public get SECURITY_GRAPHY(): string[] {
        return this._SECURITY_GRAPHY;
    }


    public get isLogoActive(): boolean {
        return this._isLogoActive;
    }

    public set isLogoActive(value: boolean) {
        this._isLogoActive = value;
    }

    /**
     * 外部防沉迷注册地址 
     */
    public get AASRegisterPath(): string {
        // var url : string = SiteParaUtils.filterRequestPath(_AASRegisterPath);
        // return url;
        return "AASRegisterPath"
    }

    /**
     * 外部防沉迷注册地址 
     */
    public set AASRegisterPath(value: string) {
        this._AASRegisterPath = value;
    }

    /**
     * 开心网防沉迷信息请求地址 
     */
    public get AASRequestPath(): string {
        // var url : string = SiteParaUtils.filterRequestPath(this._AASRequestPath);
        // return url;
        return "AASRequestPath"
    }
    /**
     * 开心网防沉迷信息请求地址 
     */
    public set AASRequestPath(value: string) {
        this._AASRequestPath = value;
    }

    /**
     *充值 
        */
    public get PAY(): string {
        // var url : string = SiteParaUtils.filterRequestPath(this._PAY);
        return this._PAY;
    }

    /**
     * @private
     */
    public set PAY(value: string) {
        this._PAY = value;
    }

    public get CLIENT_LOGIN_PATH(): string {
        var url: string = encodeURI(this._CLIENT_LOGIN_PATH);
        return url;
    }

    /**
     * @private
     */
    public set CLIENT_LOGIN_PATH(value: string) {
        this._CLIENT_LOGIN_PATH = value;
    }

    public set SNSPATH(value: string) {
        this._SNSPATH = value;
    }

    public get SNSPATH(): string {
        return this._SNSPATH;
    }

    public get SITE(): string {
        // var url : string = SiteParaUtils.filterRequestPath(this._SITE);
        // return url;
        return "SITE";
    }

    public set SITE(value: string) {
        this._SITE = value;
    }

}