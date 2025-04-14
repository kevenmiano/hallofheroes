import FUI_SecretItem from "../../../../fui/PlayerInfo/FUI_SecretItem";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { ArmyManager } from "../../manager/ArmyManager";
import { ExtraJobEquipItemInfo } from "../bag/model/ExtraJobEquipItemInfo ";
import { ExtraJobItemInfo } from "../bag/model/ExtraJobItemInfo";
import ExtraJobModel from "../bag/model/ExtraJobModel";
import { SoulEquipItem } from "../sbag/mastery/SoulEquipItem";
import { PlayerMasteryWnd } from "./PlayerMasteryWnd";

/**
 * @description 玩家专精
 * @author zhihua.zhou
 */
export class MyMasteryWnd extends BaseWindow {
  private playerJob: number = 0;
  private list: fairygui.GList;
  private activeList: Array<ExtraJobItemInfo> = [];
  /**激活魂器列表 */
  private _equipList: Array<ExtraJobEquipItemInfo> = [];

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
    this.initEquipList();
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );

    this.showView();
  }

  private renderListItem(index: number, item: FUI_SecretItem) {
    let info: ExtraJobItemInfo = this.activeList[index];
    item.data = info;
    item.touchable = false;
    if (info) {
      item.getChild("txt_name").text = LangManager.Instance.GetTranslation(
        "Mastery.jobtype" + info.jobType,
      );
      item.getChild("iconLoader").asLoader.url = this.getJobIcon(info.jobType);
      //是否已激活
      let isActived = info.jobLevel > 0;
      if (isActived) {
        item.getController("c1").selectedIndex = 1;
        item.getChild("txt_lv").text = LangManager.Instance.GetTranslation(
          "public.level3",
          info.jobLevel,
        );
      } else {
        item.getController("c1").selectedIndex = 0;
      }
    }
  }

  public getJobIcon(job: number): string {
    let url: string = "";
    switch (job) {
      case 41:
        url = "Icon_Mastery_Knight";
        break;
      case 42:
        url = "Icon_Mastery_Archer";
        break;
      case 43:
        url = "Icon_Mastery_Mage";
        break;
      case 44:
        url = "Icon_Mastery_long";
        break;
    }
    return fgui.UIPackage.getItemURL(EmPackName.Base, url);
  }

  private showView(): void {
    ExtraJobModel.instance.resetAllPropertys();
    //魂器
    let equiplist = ExtraJobModel.instance.equipList;
    for (let i = 0; i < equiplist.length; i++) {
      const element = equiplist[i];
      this.updateEquipItemInfo(element);
    }

    this.showProperty();

    this.setSoulEquip();
    //秘典
    this.playerJob = ArmyManager.Instance.thane.job;
    this.activeList = ExtraJobModel.instance.activeList;
    this.list.numItems = this.activeList.length;
  }

  initEquipList() {
    let info: ExtraJobEquipItemInfo;
    for (let i = 1; i < 7; i++) {
      info = new ExtraJobEquipItemInfo();
      info.equipType = i;
      info.equipLevel = 0;
      this._equipList.push(info);
    }
  }

  updateItemInfo(info: ExtraJobItemInfo) {
    for (let index = 0; index < this.activeList.length; index++) {
      const element = this.activeList[index];
      if (element) {
        if (info.jobType == element.jobType) {
          element.jobLevel = info.jobLevel;
          element.skillScript = info.skillScript;
        }
      }
    }
  }

  updateEquipItemInfo(info: ExtraJobEquipItemInfo) {
    for (let index = 0; index < this._equipList.length; index++) {
      const element = this._equipList[index];
      if (element) {
        if (info.equipType == element.equipType) {
          element.equipLevel = info.equipLevel;
          element.strengthenLevel = info.strengthenLevel;
          element.join1 = info.join1;
          element.join2 = info.join2;
          element.join3 = info.join3;
          element.join4 = info.join4;
          ExtraJobModel.instance.getAttr(info);
          break;
        }
      }
    }
  }

  /**
   * 魂器总属性
   */
  private showProperty() {
    let selfData = ExtraJobModel.instance.getTotalProperty();
    let count = Object.keys(selfData).length;
    let i: number = 0;
    if (count > 0) {
      for (const key in selfData) {
        if (Object.prototype.hasOwnProperty.call(selfData, key)) {
          let element = selfData[key];
          i++;
          this["txt_prop" + i].text =
            `[color=#FFC68F]${key + "&nbsp;:&nbsp;"}[/color]${element}`;
        }
      }
    }
  }

  /**
   * 设置魂器
   */
  private setSoulEquip() {
    for (let i = 1; i < 7; i++) {
      let equip = this["item" + i] as SoulEquipItem;
      equip.setData(this._equipList[i - 1], true);
    }
  }

  public dispose() {
    super.dispose();
    let wnd: PlayerMasteryWnd = UIManager.Instance.FindWind(
      EmWindow.PlayerMasteryWnd,
    );
    if (wnd && wnd.isShowing) {
      wnd.hide();
    }
  }
}
