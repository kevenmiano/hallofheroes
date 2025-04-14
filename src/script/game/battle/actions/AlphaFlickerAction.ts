import { CampaignEvent } from "../../constant/event/NotificationEvent";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../manager/PlayerManager";
import { MapBaseAction } from "./MapBaseAction";

/**
 * @author:pzlricky
 * @data: 2021-06-21 14:10
 * @description 透明度闪烁动画
 */
export default class AlphaFlickerAction extends MapBaseAction {
  private _target: object;

  constructor($target: object) {
    super();
    this._target = $target;
  }

  update() {
    if (!this._target) {
      this.actionOver();
      return;
    }
    if (this._count == 1) {
      TweenMax.to(this._target, 0.25, {
        alpha: 0.3,
        repeat: 5,
        yoyo: true,
        onComplete: this.actionOver.bind(this),
      });
    }
    this._count++;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  actionOver() {
    if (this._target && this._target instanceof Laya.Sprite) {
      TweenMax.killChildTweensOf(this._target as Laya.Sprite);
      (this._target as Laya.Sprite).filters = null;
    }
    super.actionOver();
    Laya.timer.once(2000, this, this.updateStatus);
  }

  private updateStatus() {
    if (this.playerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
      this.playerModel.dispatchEvent(CampaignEvent.AUTO_WALK_CHANGED);
    }
  }
}
