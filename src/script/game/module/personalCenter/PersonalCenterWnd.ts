import AudioManager from "../../../core/audio/AudioManager";
import { GAME_LANG } from "../../../core/lang/LanguageDefine";
import Logger from '../../../core/logger/Logger';
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Utils from "../../../core/utils/Utils";
import { SoundIds } from "../../constant/SoundIds";
import { SwitchEvent } from "../../constant/event/NotificationEvent";
import { ConfigManager } from "../../manager/ConfigManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import ComponentSetting from "../../utils/ComponentSetting";
import DisplayLoader from "../../utils/DisplayLoader";
import EntryCom from "./comp/EntryCom";
import GameSetCom from "./comp/GameSetCom";
import LanguageCom from "./comp/LanguageCom";
import PrivacyCom from "./comp/PrivacyCom";
import SystemSetCom from "./comp/SystemSetCom";
import UserInfoCom from "./comp/UserInfoCom";
import SDKManager from "../../../core/sdk/SDKManager";
import {MessageTipManager} from "../../manager/MessageTipManager";
import LangManager from "../../../core/lang/LangManager";

/**
* @author:zhihua.zhou
* @data: 2021-11-3 20:00
* @description 个人中心
*/
export default class PersonalCenterWnd extends BaseWindow {
    /** 个人信息 */
    private userInfo: UserInfoCom;
    /** 综合入口 */
    private entryCom: EntryCom;
    /** 游戏设置 */
    private gameSet: GameSetCom;
    /** 系统设置 */
    private systemSet: SystemSetCom;
    /** 隐私相关 */
    private privacyCom: PrivacyCom;
    /** 语言相关 */
    private languageCom: LanguageCom;

    private txt_uid: fairygui.GTextField;
    private txt_desc: fairygui.GTextField;
    private tab_private: fairygui.GButton;//隐私
    private tab_entry: fgui.GButton;//综合页签
    private tab_language: fgui.GButton;
    public btn_uploadLog:fgui.GButton;
    public c1: fgui.Controller;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();

        this.c1 = this.getController("c1");
        this.addEvent();

        this.tab_private.visible = Utils.isApp() && !ComponentSetting.IOS_VERSION;
        this.tab_entry.visible = ConfigManager.info.COMPREHENSIVE_ENTRANCE;
        let cfgLanguages = GAME_LANG;
        this.tab_language.visible = cfgLanguages.length > 1 || PlayerManager.Instance.currentPlayerModel.userInfo.isWhiteUser || DisplayLoader.isDebug;
    }

    private onStateChange() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    }

    private addEvent() {
        this.btn_uploadLog.onClick(this, this.uploadLog);
        this.c1.on(fgui.Events.STATE_CHANGED, this, this.onStateChange);
        NotificationManager.Instance.addEventListener(SwitchEvent.COMPREHENSIVE_ENTRANCE, this.onEntrance, this);//综合入口页签
    }

    private offEvent() {
        this.btn_uploadLog.offClick(this, this.uploadLog);
        this.c1.off(fgui.Events.STATE_CHANGED, this, this.onStateChange);
        NotificationManager.Instance.removeEventListener(SwitchEvent.COMPREHENSIVE_ENTRANCE, this.onEntrance, this);//综合入口页签
    }

    private onEntrance() {
        this.tab_entry.visible = ConfigManager.info.COMPREHENSIVE_ENTRANCE;
    }

    OnShowWind() {
        super.OnShowWind();
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        // this.txt_uid.text = playerInfo.userId.toString();
        Logger.xjy("用户ID", playerInfo.userId)
        this.txt_uid.visible = false;
        this.txt_desc.visible = false;

        let frameData = this.params.frameData;
        if (frameData) {
            this.c1.selectedIndex = frameData.page;
        } else {
            this.c1.selectedIndex = 0;
        }
    }

    private uploadLog()
    {
        SDKManager.Instance.getChannel().uploadLog();
        // Laya.timer.once(2000, this, ()=>{MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("uploadLog.result"))});
    }

    updatePrivacyView(): void {
        this.privacyCom.initData();
    }

    OnHideWind() {
        super.OnHideWind();
        this.offEvent();
        this.userInfo.removeEvent();
        this.entryCom.removeEvent();
        this.gameSet.removeEvent();
        this.systemSet.removeEvent();
        this.privacyCom.removeEvent();
        this.languageCom.removeEvent();
    }
}