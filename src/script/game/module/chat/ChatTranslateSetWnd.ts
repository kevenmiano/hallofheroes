import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import t_s_chattranslateset, {
  translateParam,
} from "../../config/t_s_chattranslateset";
import { ConfigType } from "../../constant/ConfigDefine";
import IMManager from "../../manager/IMManager";
import { PlayerManager } from "../../manager/PlayerManager";

export default class ChatTranslateSetWnd extends BaseWindow {
  public itemList: fgui.GList;
  public closeBtn: UIButton;
  public title: fgui.GLabel;
  private curSelect = 0;
  private translatesLanguage: translateParam[] = [];
  private defaultSelect = 0;

  public constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    let cfgData = ConfigMgr.Instance.getSync(
      ConfigType.t_s_chattranslateset,
    ) as t_s_chattranslateset;
    if (cfgData) {
      this.translatesLanguage = cfgData.mDataList;
    } else {
      this.translatesLanguage = [];
    }
    this.title.text = LangManager.Instance.GetTranslation(
      "ChatWnd.TranslateSetWnd.Title",
    );
    let langKey =
      PlayerManager.Instance.currentPlayerModel.playerInfo.chatTranslateKey;
    if (langKey == "") {
      langKey = "en";
    }
    let deaultIndex = this.findIndexByKey(langKey);
    if (deaultIndex >= 0) this.defaultSelect = deaultIndex;
    this.itemList.setVirtual();
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.itemList.numItems = this.translatesLanguage.length;
    this.itemList.selectedIndex = this.defaultSelect;
    this.curSelect = this.defaultSelect;
    this.addListenerEvent();
  }

  private addListenerEvent() {
    this.itemList.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
  }

  private onClickItem(item: fgui.GButton) {
    let clickIndex = this.itemList.childIndexToItemIndex(
      this.itemList.getChildIndex(item),
    );
    this.curSelect = clickIndex;
  }

  private renderListItem(index: number, obj: fgui.GButton) {
    let title = obj.getChild("title") as fgui.GTextField;
    let textValue = this.translatesLanguage[index].value;
    // let textCode = this.translatesLanguage[index].key;
    // if(textCode == "ar") {
    //     title.text = textValue.split("").reverse().join();
    // } else {
    title.text = textValue;
    // }
  }

  public OnHideWind() {
    super.OnHideWind();
    if (this.curSelect == this.defaultSelect) return;
    IMManager.Instance.sendTranslateSetting(
      this.translatesLanguage[this.curSelect].key,
    );
  }

  private findIndexByKey(langKey: string) {
    for (let i = 0, length = this.translatesLanguage.length; i < length; i++) {
      if (this.translatesLanguage[i].key == langKey) {
        return i;
      }
    }
    return -1;
  }
}
