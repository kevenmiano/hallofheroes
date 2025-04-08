import LangManager from "../../../../core/lang/LangManager";
import { GAME_LANG } from "../../../../core/lang/LanguageDefine";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { PlayerManager } from "../../../manager/PlayerManager";
import DisplayLoader from "../../../utils/DisplayLoader";
import { AccountSetting } from "./AccountSetting";
import { AudioSetting } from "./AudioSetting";
import { LanguageSetting } from "./LanguageSetting";
import { SocialMediaSetting } from "./SocialMediaSetting";

/**
 * 登陆设置
 */
export default class LoginSettingWndOS extends BaseWindow {

    private frame: fgui.GComponent;

    private tabIndex: fgui.Controller;

    private tab_language: UIButton;
    private tab_audio: UIButton;
    private tab_social: UIButton;
    private tab_account: UIButton;


    private language: LanguageSetting;
    private audio: AudioSetting;
    private account: AccountSetting;
    private socialmedia: SocialMediaSetting;


    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind(): void {
        super.OnInitWind();

        this.tabIndex = this.getController("tabIndex");

        Logger.info("LoginSettingWnd---");
        this.setTitleKey("Login.LoginSeeting.title");

        let cfgLanguages = GAME_LANG;
        this.tab_language.visible = cfgLanguages.length > 1 || PlayerManager.Instance.currentPlayerModel.userInfo.isWhiteUser || DisplayLoader.isDebug;

        this.tabIndex.selectedIndex = this.tab_language.visible ? 0 : 3;

        this.onInitTab();
        this.onInitContent();
    }

    /**页签设置 */
    private onInitTab() {
        this.tab_language.title = LangManager.Instance.GetTranslation("Login.LoginSeeting.Language");
        this.tab_audio.title = LangManager.Instance.GetTranslation("Login.LoginSeeting.Audio");
        this.tab_social.title = LangManager.Instance.GetTranslation("Login.LoginSeeting.SocialMedia");
        this.tab_account.title = LangManager.Instance.GetTranslation("Login.LoginSeeting.Account");
    }

    /**内容窗体 */
    private onInitContent() {
        if (this.language) this.language.onInit();
        if (this.audio) this.audio.onInit();
        if (this.account) this.account.onInit();
        if (this.socialmedia) this.socialmedia.onInit();
    }

}