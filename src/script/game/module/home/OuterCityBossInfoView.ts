//@ts-expect-error: External dependencies
import FUI_OuterCityBossInfoView from "../../../../fui/Home/FUI_OuterCityBossInfoView";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { OuterCityModel } from "../../map/outercity/OuterCityModel";
import OuterCityTreasureItem from "./OuterCityTreasureItem";
import TreasureInfo from "../../map/data/TreasureInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import ColorConstant from "../../constant/ColorConstant";
import Utils from "../../../core/utils/Utils";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { ArmyManager } from "../../manager/ArmyManager";
import { BuildingEvent } from "../../map/castle/event/BuildingEvent";
import { VIPManager } from "../../manager/VIPManager";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import { OuterCityScene } from "../../scene/OuterCityScene";
import { TaskManage } from "../../manager/TaskManage";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";

/**
 * @description 外城中的杀怪信息
 * @author yuanzhan.yu
 * @date 2021/12/3 15:16
 * @ver 1.0
 */
export class OuterCityBossInfoView extends FUI_OuterCityBossInfoView {
  private _model: OuterCityModel;
  private _outerCityModel: OuterCityModel;
  private _treasureList: Array<TreasureInfo> = [];
  private _count: number = 0;
  constructor() {
    super();
    if (
      TaskManage.Instance.IsTaskFinish(TaskManage.SETARMY_TASK) &&
      SceneManager.Instance.currentType != SceneType.OUTER_CITY_SCENE
    ) {
      this._outerCityModel = new OuterCityModel();
      OuterCityManager.Instance.steup(
        new OuterCityScene(),
        this._outerCityModel,
      );
      OuterCityManager.Instance.getBossInfo(5);
      OuterCityManager.Instance.getMineAndCityInfo();
    }
  }

  protected onConstruct() {
    super.onConstruct();
    this.initData();
    this.addEvent();
    this.updateView();
    if (
      VIPManager.Instance.model.isOpenPrivilege(
        VipPrivilegeType.OUTCITY_BOSS_COORDINATE,
      )
    ) {
      this.showBossCtr.selectedIndex = 1;
    } else {
      this.showBossCtr.selectedIndex = 0;
    }
  }

  private initData() {
    this._model = OuterCityManager.Instance.model;
    (this.location.getChild("posTxt") as fgui.GTextField).color =
      ColorConstant.GOLD_COLOR;
    this.bossInfoTxt.getChild("posTxt").text =
      LangManager.Instance.GetTranslation("OuterCityBossInfoView.bossInfoTxt");
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.OUTER_CITY_GET_BOSSINFO,
      this.onGetBossInfo,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.OUTER_CITY_UPDATE_BOSS_TIME,
      this.onUpdateBossTime,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.UPDATE_TREASURE_INFO,
      this.updateTreasureInfo,
      this,
    );
    this.btn_help.onClick(this, this.onHelpClick);
    this.bossTreasureList.itemRenderer = Laya.Handler.create(
      this,
      this.renderTreasureList,
      null,
      false,
    );
    this.btn_help2.onClick(this, this.onHelp2Click);
    this.location.onClick(this, this.resourceLocationTxtHandler);
    this.bossInfoTxt.onClick(this, this.openBossInfo);
    BuildingManager.Instance.addEventListener(
      BuildingEvent.U_SECURITY_INFO_UPDATE,
      this.updateResourceTxt,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.OUTER_CITY_GET_BOSSINFO,
      this.onGetBossInfo,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.OUTER_CITY_UPDATE_BOSS_TIME,
      this.onUpdateBossTime,
      this,
    );
    this.btn_help.offClick(this, this.onHelpClick);
    this.btn_help2.offClick(this, this.onHelp2Click);
    Utils.clearGListHandle(this.bossTreasureList);
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.UPDATE_TREASURE_INFO,
      this.updateTreasureInfo,
      this,
    );
    this.location.offClick(this, this.resourceLocationTxtHandler);
    this.bossInfoTxt.offClick(this, this.openBossInfo);
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.U_SECURITY_INFO_UPDATE,
      this.updateResourceTxt,
      this,
    );
  }

  private resourceLocationTxtHandler() {
    FrameCtrlManager.Instance.open(EmWindow.OuterCityResourceInfoWnd);
  }

  /**
   * 打开BOSS信息界面
   */
  private openBossInfo() {
    FrameCtrlManager.Instance.open(EmWindow.OuterCityBossInfoWnd);
  }

  private renderTreasureList(index: number, item: OuterCityTreasureItem) {
    if (!item || item.isDisposed) return;
    item.info = this._treasureList[index];
  }

  private updateTreasureInfo() {
    this.updateTreasureView();
  }

  private updateTreasureView() {
    this.statusTxt.text = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.activity.ConsortiaActivityListView.consortiaTreasure" +
        this.playerModel.treasureState,
    );
    if (this.playerModel.treasureState == OuterCityModel.TREASURE_STATE1) {
      this.statusTxt.color = ColorConstant.BLUE_COLOR;
    } else if (
      this.playerModel.treasureState == OuterCityModel.TREASURE_STATE2
    ) {
      this.statusTxt.color = ColorConstant.GREEN_COLOR;
    } else {
      this.statusTxt.color = ColorConstant.RED_COLOR;
    }
    this._treasureList = this.playerModel.currentMinerals;
    this.bossTreasureList.numItems = this._treasureList.length;
  }

  private onGetBossInfo(model: OuterCityModel): void {
    this._model = model;
    this.updateView();
  }

  private onUpdateBossTime(model: OuterCityModel): void {
    this._model = model;
    this.updateView();
  }

  private updateView(): void {
    if (!this._model || !this._model.bossInfo) {
      return;
    }
    let i: number = 0;
    for (i = 0; i < 3; i++) {
      let count: number = this._model.bossInfo["count" + (i + 1)];
      if (count > this._model.bossInfo["canKillCount" + (i + 1)]) {
        count = this._model.bossInfo["canKillCount" + (i + 1)];
      }
      this["_enemyCountTxt" + i].text = LangManager.Instance.GetTranslation(
        "fish.FishFrame.countText",
        count,
        this._model.bossInfo["canKillCount" + (i + 1)],
      );
      if (count == this._model.bossInfo["canKillCount" + (i + 1)]) {
        this["_enemyCountTxt" + i].color = ColorConstant.RED_COLOR;
      } else {
        this["_enemyCountTxt" + i].color = ColorConstant.LIGHT_TEXT_COLOR;
      }
    }
    this.updateTreasureView();
    this.updateResourceTxt();
  }

  private updateResourceTxt() {
    if (this._model) {
      this._count = BuildingManager.Instance.model.fieldArray.length;
      this.location.getChild("posTxt").text =
        this._count +
        "/" +
        this._model.getPlayerCanOccupyMineMaxCount(
          ArmyManager.Instance.thane.grades,
        );
    }
  }

  private onHelpClick() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "map.outercity.view.helpFrame.helpContent.boss",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private onHelp2Click() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "map.outercity.view.helpFrame.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  dispose() {
    this._model = null;
    this.removeEvent();
    super.dispose();
  }
}
