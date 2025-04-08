import FUI_EntryCom from "../../../../../fui/PersonalCenter/FUI_EntryCom";
import LangManager from "../../../../core/lang/LangManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import UIManager from "../../../../core/ui/UIManager";
import Utils from "../../../../core/utils/Utils";
import { NotificationEvent, SwitchEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { ConfigManager } from "../../../manager/ConfigManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ComponentSetting from "../../../utils/ComponentSetting";
import FUIHelper from "../../../utils/FUIHelper";
import { AnnounceCtrl } from "../../announce/AnnounceCtrl";
import { isOversea } from "../../login/manager/SiteZoneCtrl";

/**
 * 个人中心里的综合入口页面
 */
export default class EntryCom extends FUI_EntryCom {

    private _listData: Object[] = [];
    private _linkUrl: string = 'https://sqh5.wan.com/';
    private _linkUrl2: string = "https://wartunelite.wan.com/";
    private _discordUrl = "https://discord.gg/DhYn4dbAbe";

    onConstruct() {
        super.onConstruct();
        this._listData = [];
        this.addEvent();
        this.onSwitch();
        let cfg: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("Official_website_link");
        if (cfg && cfg.ConfigValue) {
            this._linkUrl = cfg.ConfigValue;
        }
    }

    /**
     * 根据客服开关状态更显界面显示
     */
    onSwitch() {

        let isApp = Utils.isAndroid() || Utils.isIOS();
        let isCustomerService = ConfigManager.info.CUSTOMER_SERVICE;
        let isCustomerWebsite = ConfigManager.info.COMPREHENSIVE_WEBSITE;
        let isCustomerAccounts = ConfigManager.info.COMPREHENSIVE_OFFICIAL_ACCOUNTS;
        let isDiscord = ConfigManager.info.Discord;

        let listData = [];
        if (!ComponentSetting.IOS_VERSION && isCustomerWebsite)//游戏官网
            listData.push({ textKey: "PersonalCenterWnd.EntryCom.btnText1", iconName: "Btn_L2_Web", btnName: "btnWeb" });
        if (!Utils.isFrom4399())//游戏公告
            listData.push({ textKey: "PersonalCenterWnd.EntryCom.btnText2", iconName: "Btn_L2_News", btnName: "btnNotice" });
        if (isCustomerService) {//游戏客服
            listData.push({ textKey: "PersonalCenterWnd.EntryCom.btnText3", iconName: "Btn_L2_GM", btnName: "btnGM" });
        }

        if (!isOversea())//建议反馈
            listData.push({ textKey: "PersonalCenterWnd.EntryCom.btnText4", iconName: "Btn_L2_Suggestion-1", btnName: "btnAdvice" });
        if (isApp)//账号管理
            listData.push({ textKey: "PersonalCenterWnd.EntryCom.btnText5", iconName: "Btn_L2_IDManage", btnName: "btnPassword" });
        if (isCustomerAccounts) {//公众号/facebook点赞
            if (isOversea()) {
                listData.push({ textKey: "PersonalCenterWnd.EntryCom.btnText_fb", iconName: "Btn_L2_LikeFB", btnName: "btnOfficialAccount" });
            } else {
                listData.push({ textKey: "PersonalCenterWnd.EntryCom.btnText6", iconName: "Btn_L2_OfficialAccounts", btnName: "btnOfficialAccount" });
            }
        }

        if (isDiscord)
            listData.push({ textKey: "PersonalCenterWnd.EntryCom.btnText7", iconName: "Btn_L2_Discord", btnName: "btnDiscord" });


        this._listData = listData;
        this.list.numItems = listData.length;
    }


    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
        NotificationManager.Instance.addEventListener(NotificationEvent.CUSTOMER_SERVICE_SWITCH, this.onSwitch, this);
        NotificationManager.Instance.addEventListener(SwitchEvent.COMPREHENSIVE_WEBSITE, this.onSwitch, this);
        NotificationManager.Instance.addEventListener(SwitchEvent.COMPREHENSIVE_OFFICIAL_ACCOUNTS, this.onSwitch, this);
    }

    /**渲染称号Item */
    renderListItem(index: number, item: fgui.GComponent) {
        var data: any = this._listData[index];
        if (!data) return;
        item.name = data.btnName;
        item.text = LangManager.Instance.GetTranslation(data.textKey);
        item.icon = FUIHelper.getItemURL("PersonalCenter", data.iconName);
    }

    onListItemClick(item, evt) {
        let btn_name = item.name;
        this.onButtonEvent(btn_name);
    }

    private getLinkUrl(): string {
        if (isOversea()) {
            return this._linkUrl2;
        } else {
            return this._linkUrl;
        }
    }

    private onButtonEvent(btn_name: string) {
        switch (btn_name) {
            case 'btnWeb'://游戏官网        
                if (!Utils.isApp()) {
                    window.open(this.getLinkUrl(), '_blank');
                } else {
                    SDKManager.Instance.getChannel().openURL(this.getLinkUrl());
                }
                break;
            case 'btnNotice'://游戏公告
                AnnounceCtrl.Instance.reqVersionData().then((ret) => {
                    if (ret)
                        FrameCtrlManager.Instance.open(EmWindow.Announce, ret);
                });
                break;
            // case 2://实名认证
            //     SDKManager.Instance.getChannel().openVerify();
            //     break;
            // case 3://邮箱验证
            //     // if (MailCheckMgr.Instance.model.state == 2) {
            //     //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('mailCheck.MailCheckFrame.finish'));

            //     //     return;
            //     // }
            //     // FrameCtrlManager.Instance.open(EmWindow.CheckMailWnd);
            //     //    UIManager.Instance.ShowWind(EmWindow.MailCheckWnd);
            //     break;
            case 'btnPassword'://账号管理
                // let ss:BaseChannel = SDKManager.Instance.getChannel();
                // if(ss instanceof NativeChannel)
                // {
                //     ss.downloadVoice("5626262", "1251_155155");
                // }
                SDKManager.Instance.getChannel().openPersonalCenter("sdjaiohgoisa");
                // let channel2:BaseChannel = SDKManager.Instance.getChannel();
                // let str:string = channel2.getConfigData();
                // Laya.Browser.window.alert(str);
                // FrameCtrlManager.Instance.open(EmWindow.ChangePasswordWnd);
                break;
            // case 5://安全锁
            //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('public.unopen'));
            //     break;
            case 'btnGM'://游戏客服
                //CustomerService.tip
                let isCustomer = ConfigManager.info.COMPREHENSIVE_CUSTOMER;
                if (isCustomer) {
                    let title: string = LangManager.Instance.GetTranslation("public.prompt");
                    let content: string = LangManager.Instance.GetTranslation("CustomerService.tip");
                    UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content, callback: this.openCustomerServie.bind(this) });
                } else {
                    this.openCustomerServie();
                }
                break;
            case 'btnAdvice'://建议反馈
                FrameCtrlManager.Instance.open(EmWindow.SuggestWnd);
                break;
            case "btnOfficialAccount":
                if (isOversea()) {
                    let facebookUrl: string = "https://www.facebook.com/Wartune-Lite-7ROAD-114695167888975/";
                    if (!Utils.isApp()) {
                        window.open(facebookUrl, '_blank');
                    } else {
                        SDKManager.Instance.getChannel().openURL(facebookUrl);
                    }
                } else {
                    UIManager.Instance.ShowWind(EmWindow.OfficialAccountWnd);
                }
                break;
            case "btnDiscord":
                SDKManager.Instance.getChannel().openURL(this._discordUrl);
                break;
            default:
                break;
        }
    }

    private openCustomerServie() {
        if (isOversea()) {
            SDKManager.Instance.getChannel().openCustomerService();
        } else {
            UIManager.Instance.ShowWind(EmWindow.CustomerServiceWnd);
        }
        // UIManager.Instance.ShowWind(EmWindow.CustomerServiceWnd);
    }


    public removeEvent() {
        this.list.off(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
        NotificationManager.Instance.removeEventListener(NotificationEvent.CUSTOMER_SERVICE_SWITCH, this.onSwitch, this);
        NotificationManager.Instance.removeEventListener(SwitchEvent.COMPREHENSIVE_WEBSITE, this.onSwitch, this);
        NotificationManager.Instance.removeEventListener(SwitchEvent.COMPREHENSIVE_OFFICIAL_ACCOUNTS, this.onSwitch, this);
    }
}