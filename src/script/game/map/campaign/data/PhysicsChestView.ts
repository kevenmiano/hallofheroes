import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { CampaignManager } from "../../../manager/CampaignManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PathManager } from "../../../manager/PathManager";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import { NodeState } from "../../space/constant/NodeState";
import { PosType } from "../../space/constant/PosType";
import { CampaignNode } from "../../space/data/CampaignNode";
import { ChestInfo } from "../../space/data/ChestInfo";
import { MapPhysicsBase } from "../../space/view/physics/MapPhysicsBase";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import {
  FilterFrameText,
  eFilterFrameText,
} from "../../../component/FilterFrameText";
import Logger from "../../../../core/logger/Logger";

/**
 *  宝箱掉落
 */
export class PhysicsChestView extends MapPhysicsBase {
  private _monsterDropBoxName: FilterFrameText = new FilterFrameText(
    140,
    20,
    undefined,
    14,
  );
  private _goods: any[];
  constructor(datas: any[]) {
    super();
    this._goods = datas;
    this._monsterDropBoxName.setFrame(6, eFilterFrameText.AvatarName);
    // ShowTipManager.Instance.removeTip(this);
    this.on(Laya.Event.ROLL_OVER, this, this.__rollOverHandler);
    this.on(Laya.Event.ROLL_OUT, this, this.__rollOutHandler);
  }
  public set goods(value: any[]) {
    this._goods = value;
  }
  private __rollOverHandler(evt: Laya.Event) {
    StageReferance.stage.on(Laya.Event.CLICK, this, this.mouseClickHandler);
  }
  private __rollOutHandler(evt: Laya.Event) {
    StageReferance.stage.off(Laya.Event.CLICK, this, this.mouseClickHandler);
  }
  private _isOpen: boolean;
  protected updateView() {
    var state: number = this.info.info.state;
    super.updateView();

    if (state == NodeState.HIDE) {
      if (!this.visible) return;
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.OPEN_CHEST_BOX,
        null,
      );
      UIManager.Instance.ShowWind(EmWindow.BattleFallGoodsWnd, {
        callBack: this.disposeCall,
        nodeInfo: this.info,
        arrayData: this._goods,
        signId: (<ChestInfo>this.info.info).signId,
      });
      this._isOpen = true;
      this.visible = false;
    } else if (state == NodeState.DESTROYED) {
      this.visible = false;
    } else {
      this.visible = true;
    }
    this.active = this.visible;
  }
  private disposeCall() {
    this._isOpen = false;
  }
  private _time: number = 0;
  public mouseClickHandler(evt: Laya.Event): boolean {
    var time: number = new Date().getTime();
    if (time - this._time < 30) return false;
    this._time = time;
    var armyView: any = CampaignManager.Instance.controller.getArmyView(
      CampaignManager.Instance.mapModel.selfMemberData,
    );
    var leng: number = new Laya.Point(armyView.x, armyView.y).distance(
      new Laya.Point(this.x, this.y).x,
      new Laya.Point(this.x, this.y).y,
    );
    if (leng > 100) {
      CampaignManager.Instance.controller.moveArmyByPos(this.x, this.y);
      return true;
    }
    this.info.info.state = NodeState.HIDE;
    this.info.commit();
    return true;
  }

  protected layouCallBack() {
    super.layouCallBack();
    if (!this.info) return;

    // (<CampaignNode>this.info).sonType == 2201 &&
    if ((<CampaignNode>this.info).info.types == PosType.FALL_CHEST) {
      this.addChild(this._monsterDropBoxName);
      this._monsterDropBoxName.x = this.moviePos.x;
      this._monsterDropBoxName.y = this.moviePos.y - 10;
      this._monsterDropBoxName.text = (<CampaignNode>this.info).info.names;
    } else {
      this._monsterDropBoxName.removeSelf();
    }

    Logger.xjy("[PhysicsChestView]layouCallBack", this.info, this.moviePos);
  }

  public get resourcesPath(): string {
    if (this.info.info.types == PosType.MOVIE) {
      return PathManager.solveCampaignMovieByUrl(this.info.info.names);
    }
    return PathManager.solveMapPhysicsBySonType(
      (<CampaignNode>this.info).sonType,
    );
  }

  public dispose() {
    super.dispose();
    this.off(Laya.Event.ROLL_OVER, this, this.__rollOverHandler);
    this.off(Laya.Event.ROLL_OUT, this, this.__rollOutHandler);
    StageReferance.stage.off(Laya.Event.CLICK, this, this.mouseClickHandler);
  }
}
