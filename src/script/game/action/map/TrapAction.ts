import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { CampaignEvent } from "../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../manager/PlayerManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import FUIHelper from "../../utils/FUIHelper";

/**
 * @author:pzlricky
 * @data: 2021-06-21 14:13
 * @description 陷井动画
 */
export default class TrapAction extends MapBaseAction {
  private _target: any;
  constructor($target: object) {
    super();
    this._target = $target;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  update() {
    if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
      this.actionOver();
      Laya.timer.once(2000, this, this.updateStatus);
      return;
    }

    if (this._count == 1) {
      var movie: fgui.GMovieClip = FUIHelper.createFUIInstance(
        EmPackName.Alert,
        "asset.campaign.effect.TrapEffectAsset",
      );
      this._target.parent.addChild(movie.displayObject);
      movie.x = this._target.x;
      movie.y = this._target.y;
      movie = null;
    }
    this._count++;
  }

  private updateStatus() {
    if (this.playerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
      this.playerModel.dispatchEvent(CampaignEvent.AUTO_WALK_CHANGED);
    }
  }
}
