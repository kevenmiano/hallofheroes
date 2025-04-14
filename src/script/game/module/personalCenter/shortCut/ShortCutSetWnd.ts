import FUI_CommonFrame3 from "../../../../../fui/Base/FUI_CommonFrame3";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { OptType } from "../../setting/SettingData";
import SetItem2 from "../item/SetItem2";

/**
 * @author:zhihua.zhou
 * @data: 2022-5-26 11:00
 * @description 个人中心快捷语设置
 */
export default class ShortCutSetWnd extends BaseWindow {
  private frame: FUI_CommonFrame3;
  private btn_reset: fairygui.GButton;
  private btn_save: fairygui.GButton;
  private list1: fairygui.GList;
  private list2: fairygui.GList;
  private list1Data: Array<string> = [];
  private list2Data: any = [];
  private defaultStr: string = "1,2,3,4";

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initView();
    this.addEvent();
  }

  private initView() {
    let svrData: string = "";
    let configStr: string = "";
    if (this.params.type == 0) {
      this.frame.title.text =
        LangManager.Instance.GetTranslation("shortCut.str1");
      svrData = PlayerManager.Instance.currentPlayerModel.playerInfo.teamQChat;
      configStr = LangManager.Instance.GetTranslation("shortCut.inTeam");
    } else {
      this.frame.title.text =
        LangManager.Instance.GetTranslation("shortCut.str2");
      svrData =
        PlayerManager.Instance.currentPlayerModel.playerInfo.battleQChat;
      configStr = LangManager.Instance.GetTranslation("shortCut.allTeam");
    }
    if (svrData.length > 0) {
      this.list1Data = svrData.split(",");
    }
    this.list2Data = configStr.split("|");
  }

  private addEvent(): void {
    this.list1.setVirtual();
    this.list2.setVirtual();
    this.btn_reset.onClick(this, this.onReset);
    this.btn_save.onClick(this, this.onSave);
    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.onRender1,
      null,
      false,
    );
    this.list2.itemRenderer = Laya.Handler.create(
      this,
      this.onRender2,
      null,
      false,
    );
  }

  private removeEvent(): void {
    this.btn_reset.offClick(this, this.onReset);
    this.btn_save.offClick(this, this.onSave);
    // this.list1.itemRenderer.recover();
    // this.list2.itemRenderer.recover();
    Utils.clearGListHandle(this.list1);
    Utils.clearGListHandle(this.list2);
  }

  OnShowWind() {
    super.OnShowWind();
    this.refreshList();
  }

  private refreshList() {
    this.list1.numItems = this.list1Data.length;
    this.list2.numItems = this.list2Data.length;
  }

  /**
   *
   * @param index
   * @param item
   */
  private onRender1(index: number, item: SetItem2) {
    if (item) {
      item.setData(index);
      let id = parseInt(this.list1Data[index]);
      item.txt_name.text = index + 1 + ". " + this.list2Data[id - 1];
      item.c1.setSelectedIndex(1);
      item.btn_del.onClick(this, this.onDel, [index]);
    }
  }

  /**
   *
   * @param index
   * @param item
   */
  private onRender2(index: number, item: SetItem2) {
    if (item) {
      item.setData(index);
      item.txt_name.text = index + 1 + ". " + this.list2Data[index];
      item.bg.width = 522 + 115;
      item.btn_add.onClick(this, this.onAdd, [index, item]);
      if (this.list1Data.indexOf((index + 1).toString()) != -1) {
        item.c1.setSelectedIndex(2);
      } else {
        item.c1.setSelectedIndex(0);
      }
    }
  }

  onDel(index) {
    let id = parseInt(this.list1Data[index]);
    this.list1Data.splice(index, 1);
    this.list1.numItems = this.list1Data.length;
    this.list2.refreshVirtualList();
  }

  onAdd(index, item: SetItem2) {
    if (this.list1Data.length >= 7) {
      let str = LangManager.Instance.GetTranslation("shortCut.max");
      MessageTipManager.Instance.show(str);
      return;
    }
    item.c1.setSelectedIndex(2);
    let id = (index + 1).toString();
    this.list1Data.push(id);
    this.list1.numItems = this.list1Data.length;
  }

  onReset() {
    this.list1Data = this.defaultStr.split(",");
    if (this.params.type == 0) {
      SocketSendManager.Instance.reqPlayerSetting(
        OptType.ShortCut_InTeam,
        0,
        this.defaultStr,
      );
    } else {
      SocketSendManager.Instance.reqPlayerSetting(
        OptType.ShortCut_AllTeam,
        0,
        this.defaultStr,
      );
    }
    this.refreshList();
  }

  onSave() {
    let str = this.list1Data.join(",");
    if (this.params.type == 0) {
      SocketSendManager.Instance.reqPlayerSetting(
        OptType.ShortCut_InTeam,
        0,
        str,
      );
    } else {
      SocketSendManager.Instance.reqPlayerSetting(
        OptType.ShortCut_AllTeam,
        0,
        str,
      );
    }
    this.hide();
  }

  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
