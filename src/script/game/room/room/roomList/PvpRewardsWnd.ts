import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { t_s_pluralpvpsegmentData } from "../../../config/t_s_pluralpvpsegment";
import { ConfigType } from "../../../constant/ConfigDefine";
import PvpRewardsItem from "./item/PvpRewardsItem";

export default class PvpRewardsWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public txt1: fgui.GTextField;
  public txt2: fgui.GTextField;
  public txt3: fgui.GTextField;
  public itemList: fgui.GList;
  public btnOk: fgui.GButton;
  rewardList: any;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initText();
    this.btnOk.onClick(this, this.OnBtnClose);
    this.rewardList = this.getList();
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false
    );
    this.itemList.numItems = this.rewardList.length;
  }

  initText() {
    this.txt1.text = LangManager.Instance.GetTranslation(
      "RoomList.pvp.rewards.text1"
    );
    this.txt2.text = LangManager.Instance.GetTranslation(
      "RoomList.pvp.rewards.text2"
    );
    this.txt3.text = LangManager.Instance.GetTranslation(
      "RoomList.pvp.rewards.text3"
    );
    this.frame.title = LangManager.Instance.GetTranslation(
      "funny.FunnyRightView.active.previewText"
    );
  }

  getList(): t_s_pluralpvpsegmentData[] {
    let obj = ConfigMgr.Instance.getDicSync(ConfigType.t_s_pluralpvpsegment);
    let arrs = [];
    for (const i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        arrs.push(obj[i]);
      }
    }
    return arrs;
  }

  renderListItem(index: number, item: PvpRewardsItem) {
    item.setInfo(this.rewardList[index]);
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }
}
