import FUI_SocialMediaSetting from "../../../../../fui/Login/FUI_SocialMediaSetting";
import LangManager from "../../../../core/lang/LangManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import Utils from "../../../../core/utils/Utils";
import { EmPackName } from "../../../constant/UIDefine";
import FUIHelper from "../../../utils/FUIHelper";

/**
 * SocialMedia
 */
export class SocialMediaSetting extends FUI_SocialMediaSetting {

    private _listData: any[] = [];

    onInit() {
        this.addEvent();
        this.onInitData();
    }

    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
    }

    private offEvent() {
        Utils.clearGListHandle(this.list);
        this.list.off(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
    }

    /**渲染称号Item */
    renderListItem(index: number, item: fgui.GComponent) {
        var data: any = this._listData[index];
        if (!data) return;
        item.data = data;
        item.name = data.btnName;
        item.text = LangManager.Instance.GetTranslation(data.textKey);
        item.icon = FUIHelper.getItemURL(EmPackName.Login, data.iconName);
    }

    onListItemClick(item, evt) {
        let data = item.data;
        if (!data || data.URL == "") return;
        SDKManager.Instance.getChannel().openURL(data.URL);
    }

    private onInitData() {
        let listData = [];
        listData.push({ textKey: "LoginSetting.SocialMedia.OfficialSite", iconName: "Btn_L2_Web", btnName: "btnWeb", URL: "https://wartunelite.wan.com/" });
        listData.push({ textKey: "LoginSetting.SocialMedia.Facebook", iconName: "Btn_L2_Facebook", btnName: "btnfacebook", URL: "https://www.facebook.com/profile.php?id=100081484060755" });
        listData.push({ textKey: "LoginSetting.SocialMedia.Discord", iconName: "Btn_L2_Discord", btnName: "btndiscord", URL: "https://discord.com/invite/7FxjHsg63d" });
        listData.push({ textKey: "LoginSetting.SocialMedia.Twitter", iconName: "Btn_L2_Twitter", btnName: "btntwitter", URL: "https://twitter.com/WartuneUltra" });
        listData.push({ textKey: "LoginSetting.SocialMedia.YouTube", iconName: "Btn_L2_YouTube", btnName: "btnyoutube", URL: "https://www.youtube.com/channel/UC9b-2u_WcNeieSRsFGcOdAQ" });
        this._listData = listData;
        this.list.numItems = listData.length;
    }

    dispose(): void {
        this.offEvent();
        super.dispose()
    }
}