import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { SimplePlayerInfo } from "../../datas/playerinfo/SimplePlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import FightingUpdateWnd from "../../module/common/FightingUpdateWnd";
import { NotificationManager } from "../../manager/NotificationManager";
import { SceneEvent } from "../../constant/event/NotificationEvent";
import { IAction } from "@/script/game/interfaces/Actiont";

/**
 * @author:pzlricky
 * @data: 2021-06-02 14:16
 * @description 个人战斗力提升动画
 */
export default class HeroFightingUpdateAction extends MapBaseAction {
  private _preFight: number = 0;
  private _simpleInfo: SimplePlayerInfo;
  private _process: number = 0;
  private _speed: number = 0;
  private _view: FightingUpdateWnd;
  private _delta: number = 0;

  constructor($pre: number, $simpleInfo: SimplePlayerInfo) {
    super();
    this._preFight = $pre;
    this._simpleInfo = $simpleInfo;
    this._delta = this._simpleInfo.fightingCapacity - this._preFight;
  }

  prepare() {
    NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
    // SceneManager.Instance.lockScene = false;
  }

  update() {
    if (
      this.finished ||
      SceneManager.Instance.currentType == SceneType.BATTLE_SCENE ||
      PlayerManager.Instance.isExistNewbieMask
    ) {
      this.dispose();
      return;
    }

    if (
      this._preFight > this._simpleInfo.fightingCapacity ||
      this._count > 130 ||
      (this._preFight == this._simpleInfo.fightingCapacity && this._count == 0)
    ) {
      this.dispose();
      return;
    } else if (this._count == 0) {
      this.fightUpCallback();
      this._process = this._preFight;
    } else if (
      this._process < this._simpleInfo.fightingCapacity &&
      this._view &&
      this._view.parent
    ) {
      if (this._view) this._view.setNumberView(this._process, this._delta);
    }

    if (this._process >= this._simpleInfo.fightingCapacity) {
      this._delta = 0;
      if (this._view)
        this._view.setNumberView(
          this._simpleInfo.fightingCapacity,
          this._delta,
        );
    } else {
      this._process += this.speed;
    }
    this._count++;
    this._preFight = this._simpleInfo.fightingCapacity;
  }

  private _timeOutValue: any = 0;
  private timeOutHandler() {
    clearTimeout(this._timeOutValue);
    this._timeOutValue = 0;
    this.dispose();
  }

  private get speed(): number {
    if (this._speed == 0) {
      this._speed = Math.ceil(
        (this._simpleInfo.fightingCapacity - this._preFight) / 50,
      );
      this._speed = Number(String(this._speed).replace("0", "1"));
    }
    return this._speed;
  }

  private fightUpCallback() {
    if (this.finished) {
      this.dispose();
      return;
    }

    this.showView();
  }

  private showView() {
    if (!UIManager.Instance.isShowing(EmWindow.FightingUpdateWnd)) {
      UIManager.Instance.ShowWind(EmWindow.FightingUpdateWnd).then((ret) => {
        this._view = ret;
        this._view.setNumberView(this._preFight, this._delta);
        clearTimeout(this._timeOutValue);
        this._timeOutValue = setTimeout(this.timeOutHandler.bind(this), 5000);
      });
    }
  }

  replace(action: IAction): boolean {
    if (action instanceof HeroFightingUpdateAction) return true;
    return false;
  }

  cancel() {
    this.dispose();
  }

  dispose() {
    super.dispose();
    if (this._view) {
      UIManager.Instance.HideWind(EmWindow.FightingUpdateWnd);
    }
    this._view = null;
    this._simpleInfo = null;
    this.actionOver();
  }
}
