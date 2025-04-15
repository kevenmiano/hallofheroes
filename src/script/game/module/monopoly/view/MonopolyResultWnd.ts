import LangManager from "../../../../core/lang/LangManager";
import ObjectPool from "../../../../core/pool/ObjectPool";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import {
  ChatEvent,
  MonopolyEvent,
} from "../../../constant/event/NotificationEvent";
import OpenGrades from "../../../constant/OpenGrades";
import { EmWindow } from "../../../constant/UIDefine";
import { ChatChannel } from "../../../datas/ChatChannel";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { SwitchInfo } from "../../../datas/SwitchInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ConfigManager } from "../../../manager/ConfigManager";
import { GemMazeManager } from "../../../manager/GemMazeManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MonopolyManager } from "../../../manager/MonopolyManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { BagHelper } from "../../bag/utils/BagHelper";
import ChatData from "../../chat/data/ChatData";
import { MonopolyItemInfo } from "../model/MonopolyItemInfo";
import MonopolyModel from "../model/MonopolyModel";
import MonopolyFinishColumnView from "./MonopolyFinishColumnView";

//@ts-expect-error: External dependencies
import TempMsg = com.road.yishi.proto.campaign.TempMsg;

//@ts-expect-error: External dependencies
import CampaignNodeInfoMsg = com.road.yishi.proto.campaign.CampaignNodeInfoMsg;

/**
 * @author:zhihua.zhou
 * @data: 2022-12-19
 * @description 云端历险通关成功界面
 */
export default class MonopolyResultWnd extends BaseWindow {
  private _data: CampaignNodeInfoMsg;
  t0: fairygui.GTextField;
  list: fairygui.GList;
  private listData: Array<GoodsInfo>;

  /**初始化 */
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initLanguage();
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList,
      null,
      false,
    );
    this.setData(this.frameData);
  }

  initLanguage() {
    this.t0.text = LangManager.Instance.GetTranslation("monopoly.reward");
  }

  onRenderList(index: number, item: BaseItem) {
    if (item) {
      item.info = this.listData[index];
    }
  }

  public setData(value: CampaignNodeInfoMsg): void {
    this._data = value;
    this.refresh();
  }
  public refresh(): void {
    if (this._data) {
      this.listData = [];
      if (this._data.type == 1) {
        // _resultImg.setFrame(2);
      } else {
        // _resultImg.setFrame(1);
      }
      this._data.nodeInfo.forEach((tempMsg) => {
        let goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.templateId = tempMsg.templateId;
        this.listData.push(goodsInfo);
      });
      // _contentTxt.text = LanguageMgr.GetTranslation("monopoly.view.MonopolyGameOverFrame.ContentTxt");
      this.list.numItems = this.listData.length;
    }
  }

  OnShowWind() {
    super.OnShowWind();
  }

  /**关闭 */
  OnHideWind() {
    super.OnHideWind();
  }
}
