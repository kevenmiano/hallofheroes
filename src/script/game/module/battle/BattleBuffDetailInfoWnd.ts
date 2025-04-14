/*
 * @Author: jeremy.xu
 * @Date: 2022-03-28 15:11:09
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 14:40:02
 * @Description: 人身上的buff详细展示
 */
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { BattleManager } from "../../battle/BattleManager";
import { BaseRoleInfo } from "../../battle/data/objects/BaseRoleInfo";
import {
  InheritRoleType,
  BattleRoleBufferType,
  FaceType,
} from "../../constant/BattleDefine";
import {
  BattleEvent,
  NotificationEvent,
} from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { BattleBufRoleItem } from "./ui/buffer/BattleBufRoleItem";
import NewbieUtils from "../guide/utils/NewbieUtils";
import { EmWindow } from "../../constant/UIDefine";
import BattleWnd from "./BattleWnd";
import LangManager from "../../../core/lang/LangManager";
import { BufferDamageData } from "../../battle/data/BufferDamageData";
import { CampaignManager } from "../../manager/CampaignManager";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { ConsortiaModel } from "../consortia/model/ConsortiaModel";

export default class BattleBuffDetailInfoWnd extends BaseWindow {
  private txtDescBuffL: fgui.GTextField;
  private txtDescDebuffL: fgui.GTextField;
  private txtDescBuffR: fgui.GTextField;
  private txtDescDebuffR: fgui.GTextField;
  private imgLoad: fgui.GLoader;
  private listRoleLeft: fgui.GList;
  private listDetailLeft: fgui.GList;
  private listRoleRight: fgui.GList;
  private listDetailRight: fgui.GList;
  private gLeft: fgui.GGroup;
  private gRight: fgui.GGroup;

  private arrLeftInfo: BaseRoleInfo[] = [];
  private arrRightInfo: BaseRoleInfo[] = [];
  private curSelLeftRoleInfo: BaseRoleInfo;
  private curSelRightRoleInfo: BaseRoleInfo;
  private _openLeft: boolean = false;
  public set openLeft(value: boolean) {
    this.gLeft.visible = value;
    this._openLeft = value;
  }
  public get openLeft(): boolean {
    return this._openLeft;
  }
  private _openRight: boolean = false;
  public get openRight(): boolean {
    return this._openRight;
  }
  public set openRight(value: boolean) {
    this.gRight.visible = value;
    this._openRight = value;
  }

  constructor() {
    super();
    this.resizeContent = true;
  }

  OnShowWind(): void {
    super.OnShowWind();
    this.addEvent();
    if (this.frameData) {
      let type = this.frameData.type;
      this.__openBuffPanel(type);
    }
    this.txtDescBuffL.text = LangManager.Instance.GetTranslation(
      "Battle.roleBuffInfo.buffDesc",
    );
    this.txtDescBuffR.text = LangManager.Instance.GetTranslation(
      "Battle.roleBuffInfo.buffDesc",
    );
    this.txtDescDebuffL.text = LangManager.Instance.GetTranslation(
      "Battle.roleBuffInfo.deBuffDesc",
    );
    this.txtDescDebuffR.text = LangManager.Instance.GetTranslation(
      "Battle.roleBuffInfo.deBuffDesc",
    );
  }

  OnHideWind(): void {
    super.OnHideWind();
    this.delEvent();
  }

  private addEvent() {
    this.listRoleLeft.on(
      fgui.Events.CLICK_ITEM,
      this,
      this.__listRoleLeftClickItem,
    );
    this.listRoleRight.on(
      fgui.Events.CLICK_ITEM,
      this,
      this.__listRoleRightClickItem,
    );

    this.listRoleLeft.itemRenderer = Laya.Handler.create(
      this,
      this.__renderRoleLeftList,
      null,
      false,
    );
    this.listRoleRight.itemRenderer = Laya.Handler.create(
      this,
      this.__renderRoleRightList,
      null,
      false,
    );

    this.listDetailLeft.itemRenderer = Laya.Handler.create(
      this,
      this.__renderDetailLeftList,
      null,
      false,
    );
    this.listDetailRight.itemRenderer = Laya.Handler.create(
      this,
      this.__renderDetailRightList,
      null,
      false,
    );

    NotificationManager.Instance.addEventListener(
      BattleEvent.ROLE_BUFF_CHANGE,
      this.__refreshCurBuffList,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleEvent.REINFORCE,
      this.__reinforce,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleEvent.OPEN_BUFFINFO_PANEL,
      this.__openBuffPanel,
      this,
    );
    if (
      CampaignManager.Instance.mapModel &&
      WorldBossHelper.checkConsortiaBoss(
        CampaignManager.Instance.mapModel.mapId,
      )
    ) {
      NotificationManager.Instance.addEventListener(
        NotificationEvent.CONSORTIA_BOSS_BUFFERIDS,
        this.__refreshCurBuffList,
        this,
      );
    }
    this.imgLoad.onClick(this, this.modelClick);
  }

  private delEvent() {
    NotificationManager.Instance.removeEventListener(
      BattleEvent.ROLE_BUFF_CHANGE,
      this.__refreshCurBuffList,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleEvent.REINFORCE,
      this.__reinforce,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleEvent.OPEN_BUFFINFO_PANEL,
      this.__openBuffPanel,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CONSORTIA_BOSS_BUFFERIDS,
      this.__refreshCurBuffList,
      this,
    );
  }

  private modelClick(evt) {
    let battleWnd = NewbieUtils.getFrame(EmWindow.Battle) as BattleWnd;
    if (!battleWnd) {
      this.hide();
      return;
    }

    // let btnOwn = battleWnd.btnOwnRoleInfoList.view
    // let btnEnemy = battleWnd.btnEnemyRoleInfoList.view
    // let btnW = btnOwn.width
    // let btnH = btnOwn.height

    // let pt1 = NewbieBaseActionMediator.localToGlobal(btnOwn, new Laya.Point(0, 0))
    // let pt2 = NewbieBaseActionMediator.localToGlobal(btnEnemy, new Laya.Point(0, 0))

    // let rect1 = new Laya.Rectangle(pt1.x, pt1.y, btnW, btnH)
    // let rect2 = new Laya.Rectangle(pt2.x, pt2.y, btnW, btnH)
    // if (this.openRight && rect1.contains(evt.stageX, evt.stageY)) {
    //     this.__openBuffPanel(BattleRoleBufferType.OWN)
    // } else if (this.openLeft && rect2.contains(evt.stageX, evt.stageY)) {
    //     this.__openBuffPanel(BattleRoleBufferType.ENEMY)
    // } else {
    this.hide();
    // }
  }

  // 刷新当前页面详情
  private __refreshCurBuffList(livingId: number) {
    if (
      this.openLeft &&
      this.curSelLeftRoleInfo &&
      livingId == this.curSelLeftRoleInfo.livingId
    ) {
      this.refreshLeftDetailList();
      return;
    }

    if (
      this.openRight &&
      this.curSelRightRoleInfo &&
      livingId == this.curSelRightRoleInfo.livingId
    ) {
      this.refreshRightDetailList();
      return;
    }
  }

  private __renderRoleLeftList(index: number, item: BattleBufRoleItem) {
    if (!item) {
      return;
    }
    let itemData = this.arrLeftInfo[index];
    if (!itemData) {
      item.info = null;
      return;
    }

    item.info = itemData;
    if (index == this.arrLeftInfo.length - 1) {
      this.listRoleLeft.selectedIndex = 0;
      this.__listRoleLeftClickItem(this.listRoleLeft.getChildAt(0));
    }
  }

  private __renderRoleRightList(index: number, item: BattleBufRoleItem) {
    if (!item) {
      return;
    }
    let itemData = this.arrRightInfo[index];
    if (!itemData) {
      item.info = null;
      return;
    }

    item.info = itemData;
    item.cDir.selectedIndex = 1;
    if (index == this.arrRightInfo.length - 1) {
      this.listRoleRight.selectedIndex = 0;
      this.__listRoleRightClickItem(this.listRoleRight.getChildAt(0));
    }
  }

  private __renderDetailLeftList(index: number, item: fgui.GButton) {
    if (!this.curSelLeftRoleInfo || !item) return;
    let itemData: BufferDamageData =
      this.curSelLeftRoleInfo.getBuffersWithFiller()[index];
    if (!itemData) {
      item.title = "";
      item.icon = "";
      return;
    }
    item.title = itemData.buffName;
    item.icon = itemData.IconPath;
    this.refreshTurn(itemData, item.getChild("txtLayerCount"));
  }

  private __renderDetailRightList(index: number, item: fgui.GButton) {
    if (!this.curSelRightRoleInfo || !item) return;
    let itemData: BufferDamageData;
    if (
      this.curSelRightRoleInfo.templateId ==
      ConsortiaModel.CONSORTIA_BOSS_TEMPLATEID
    ) {
      itemData = this.curSelRightRoleInfo.getBuffersWithFiller(false, true)[
        index
      ];
    } else {
      itemData = this.curSelRightRoleInfo.getBuffersWithFiller(false)[index];
    }
    if (!itemData) {
      item.title = "";
      item.icon = "";
      return;
    }
    item.title = itemData.buffName;
    item.icon = itemData.IconPath;
    this.refreshTurn(itemData, item.getChild("txtLayerCount"));
  }

  public refreshTurn(itemData: BufferDamageData, label: fgui.GObject) {
    if (!itemData) return;
    if (
      itemData.layerCount > 1 &&
      itemData.templateInfo &&
      itemData.templateInfo.PressCount > 0
    )
      label.text = itemData.layerCount + "";
    else label.text = "";
  }

  private __listRoleLeftClickItem(item: any) {
    this.curSelLeftRoleInfo = item.info;
    this.refreshLeftDetailList();
  }

  private __listRoleRightClickItem(item: any) {
    this.curSelRightRoleInfo = item.info;
    this.refreshRightDetailList();
  }

  private __reinforce() {
    this.refreshView();
  }

  private __openBuffPanel(type: BattleRoleBufferType) {
    switch (type) {
      case BattleRoleBufferType.OWN:
        this.openLeft = true;
        break;
      case BattleRoleBufferType.ENEMY:
        this.openRight = true;
        break;
      default:
        this.openLeft = true;
        this.openRight = true;
        break;
    }
    this.refreshView();
  }

  private refreshView() {
    let roleList = BattleManager.Instance.battleModel.roleList;
    this.arrLeftInfo = [];
    this.arrRightInfo = [];

    roleList.forEach((role: BaseRoleInfo) => {
      if (role.inheritType != InheritRoleType.Pet) {
        if (role.side == 1) {
          role.face == FaceType.LEFT_TEAM
            ? this.arrLeftInfo.push(role)
            : this.arrRightInfo.push(role);
        } else {
          role.face == FaceType.RIGHT_TEAM
            ? this.arrRightInfo.push(role)
            : this.arrLeftInfo.push(role);
        }
      }
    });

    if (this.openLeft) {
      this.listRoleLeft.numItems = this.arrLeftInfo.length;
    }

    if (this.openRight) {
      this.arrRightInfo.sort((a, b) => {
        return b.type - a.type;
      });
      this.listRoleRight.numItems = this.arrRightInfo.length;
    }
  }

  private refreshLeftDetailList() {
    if (this.curSelLeftRoleInfo) {
      this.listDetailLeft.numItems =
        this.curSelLeftRoleInfo.getBuffersWithFiller().length;
    }
  }

  private refreshRightDetailList() {
    if (this.curSelRightRoleInfo) {
      if (
        this.curSelRightRoleInfo.templateId ==
        ConsortiaModel.CONSORTIA_BOSS_TEMPLATEID
      ) {
        //熔岩君主
        this.listDetailRight.numItems =
          this.curSelRightRoleInfo.getBuffersWithFiller(false, true).length;
      } else {
        this.listDetailRight.numItems =
          this.curSelRightRoleInfo.getBuffersWithFiller(false, false).length;
      }
    }
  }
}
