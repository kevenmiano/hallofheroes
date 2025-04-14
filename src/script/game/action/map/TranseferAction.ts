import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { CampaignManager } from "../../manager/CampaignManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import Logger from "../../../core/logger/Logger";

export class TranseferAction extends MapBaseAction {
  private _target: any;
  private _posX: number = 0;
  private _posY: number = 0;
  private _action: string;
  constructor($target: any, posX: number, posY: number, action: string) {
    super();
    this._target = $target;
    this._posX = posX;
    this._posY = posY;
    this._action = action;
  }
  public prepare() {
    if (!this.isMapScene) {
      this.actionOver();
      return;
    }
    this.selfArmyView.alpha = 0;
    this.selfArmyView.aiInfo.pathInfo = [];
    super.prepare();
  }

  private get isMapScene(): boolean {
    var curScene: string = SceneManager.Instance.currentType;
    switch (curScene) {
      case SceneType.CAMPAIGN_MAP_SCENE:
        return true;
    }
    return false;
  }

  /**
   *传送动画
   *
   */
  public update() {
    if (!this.isMapScene || !this.selfArmyView) {
      this.actionOver();
      return;
    }
    this.selfArmyView.x = this._posX;
    this.selfArmyView.y = this._posY;
    if (this._count == 0) {
      // var movie : MovieClip = ComponentFactory.Instance.creatCustomObject("asset.campaign.TranseferOutAsset");
      // var eff : SimpleMovie = new SimpleMovie(movie,this.actionOver);
      // this._target.parent.addChild(eff);
      // if(this._target.hasOwnProperty("isPlaying"))
      // {
      // 	this._target["isPlaying"]= true;
      // }
      // eff.x = this._posX;
      // eff.y = this._posY;
      this.selfArmyView.alpha = 1;
      TweenMax.to(this.selfArmyView, 0.8, {
        alpha: 0,
        onUpdate: this.actionOver,
      });
    }
    if (this._count == 30) {
      this.actionOver();
    }
    this._count++;
  }
  protected actionOver() {
    if (this._finished) return;
    super.actionOver();
    if (this.selfArmyView) TweenMax.killTweensOf(this.selfArmyView);
  }

  private get selfArmyView(): any {
    var av: object;
    try {
      if (CampaignManager.Instance.mapModel.selfMemberData) {
        av = CampaignManager.Instance.controller.getArmyView(
          CampaignManager.Instance.mapModel.selfMemberData,
        );
      }
    } catch {
      Logger.error("get selfArmyView of NULL");
    }
    return av;
  }
}
