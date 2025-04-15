import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import { WarlordsEvent } from "../../../../constant/event/NotificationEvent";
import { JobType } from "../../../../constant/JobType";
// import { IEnterFrame } from "../../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../../manager/EnterFrameManager";
import WarlordsManager from "../../../../manager/WarlordsManager";
import WarlordsModel from "../../../../module/warlords/WarlordsModel";
import WarlordsPlayerInfo from "../../../../module/warlords/WarlordsPlayerInfo";
import AIBaseInfo from "../../../ai/AIBaseInfo";
import { BaseArmyAiInfo } from "../../../ai/BaseArmyAiInfo";
import { ShadowUILayer } from "../../../view/layer/ShadowUILayer";
import { AiStateType } from "../../constant/AiStateType";
import SpaceArmy from "../../data/SpaceArmy";
import { SpaceArmyView } from "../physics/SpaceArmyView";

export default class SpaceWarlordsLayer implements IEnterFrame {
  private _wizardWarlords: SpaceArmyView;
  private _warriorWarlords: SpaceArmyView;
  private _shooterWarlords: SpaceArmyView;
  private _container: Laya.Sprite;

  constructor($container: Laya.Sprite) {
    this._container = $container;
    this.addEvent();
    this.init();
  }

  private init() {
    if (this.model.isExistData(WarlordsModel.TOP, JobType.WARRIOR)) {
      this.refresh();
    } else {
      WarlordsManager.Instance.reqWarlordsMainInfo();
    }
  }

  private addEvent() {
    EnterFrameManager.Instance.registeEnterFrame(this);
    this.model &&
      this.model.addEventListener(
        WarlordsEvent.TOP_AVATAR_CHANGE,
        this.__topAvatarChangeHandler,
        this,
      );
  }

  private removeEvent() {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    this.model &&
      this.model.removeEventListener(
        WarlordsEvent.TOP_AVATAR_CHANGE,
        this.__topAvatarChangeHandler,
        this,
      );
  }

  private __topAvatarChangeHandler() {
    this.refresh();
  }

  public refresh() {
    this._wizardWarlords = this.getUpdateArmyView(
      this._wizardWarlords,
      JobType.WIZARD,
      80,
      2289,
      2155,
    );
    this._warriorWarlords = this.getUpdateArmyView(
      this._warriorWarlords,
      JobType.WARRIOR,
      80,
      2406,
      2211,
    );
    this._shooterWarlords = this.getUpdateArmyView(
      this._shooterWarlords,
      JobType.HUNTER,
      80,
      2527,
      2270,
    );
    if (this._wizardWarlords) this._wizardWarlords.mouseEnabled = false;
    if (this._warriorWarlords) this._warriorWarlords.mouseEnabled = false;
    if (this._shooterWarlords) this._shooterWarlords.mouseEnabled = false;
    if (this._container && this._wizardWarlords && !this._wizardWarlords.parent)
      this._container.addChild(this._wizardWarlords);
    if (
      this._container &&
      this._warriorWarlords &&
      !this._warriorWarlords.parent
    )
      this._container.addChild(this._warriorWarlords);
    if (
      this._container &&
      this._shooterWarlords &&
      !this._shooterWarlords.parent
    )
      this._container.addChild(this._shooterWarlords);
  }

  private getUpdateArmyView(
    $armyView: SpaceArmyView,
    $index: number,
    $angle: number,
    $x: number,
    $y: number,
  ): SpaceArmyView {
    var warlordsInfo: WarlordsPlayerInfo;
    var armyInfo: SpaceArmy;
    var aiInfo: AIBaseInfo;
    var armyView: SpaceArmyView = $armyView;
    warlordsInfo = this.model.getListData(
      WarlordsModel.TOP,
      $index,
    ) as WarlordsPlayerInfo;
    if (warlordsInfo && warlordsInfo.thaneInfo) {
      aiInfo = new BaseArmyAiInfo();
      armyInfo = new SpaceArmy();
      armyInfo.nickName = warlordsInfo.nickname;
      armyInfo.baseHero = warlordsInfo.thaneInfo;
      armyInfo.baseHero.consortiaName = warlordsInfo.serverName; //显示公会名的地方显示区名
      armyInfo.angle = $angle;
      aiInfo.moveState = AiStateType.STAND;
      if (!armyView) {
        armyView = new SpaceArmyView();
        armyView.isWarlodPlayer = true;
      }
      // 服务器没传id  这个写一个
      armyInfo.id = ShadowUILayer.INIT_ID + $index;
      armyView.info = aiInfo;
      armyView.data = armyInfo;
      armyView.avatarView.angle = $angle;

      armyView.x = $x;
      armyView.y = $y;
      // Logger.xjy("[SpaceArmyView]showAvatar", armyInfo.baseHero.nickName, armyInfo.id)
      armyView.setConsortiaName("[" + warlordsInfo.serverName + "]", 2, true);
      // armyView.layoutTxtViewWithNamePosY()
    }
    return armyView;
  }

  public enterFrame() {
    if (this._wizardWarlords && this._wizardWarlords.parent)
      this._wizardWarlords.execute();
    if (this._warriorWarlords && this._warriorWarlords.parent)
      this._warriorWarlords.execute();
    if (this._shooterWarlords && this._shooterWarlords.parent)
      this._shooterWarlords.execute();
  }

  private get model(): WarlordsModel {
    return WarlordsManager.Instance.model;
  }

  public dispose() {
    this.removeEvent();
    ObjectUtils.disposeObject(this._wizardWarlords);
    this._wizardWarlords = null;
    ObjectUtils.disposeObject(this._warriorWarlords);
    this._warriorWarlords = null;
    ObjectUtils.disposeObject(this._shooterWarlords);
    this._shooterWarlords = null;
    this._container = null;
  }
}
