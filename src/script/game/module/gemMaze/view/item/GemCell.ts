import FUI_GemCell from "../../../../../../fui/GemMaze/FUI_GemCell";
import { GemMazeEvent } from "../../../../constant/event/NotificationEvent";
import { GemMazeManager } from "../../../../manager/GemMazeManager";
import FUIHelper from "../../../../utils/FUIHelper";
import GemMazeGemInfoVO from "../../model/GemMazeGemInfoVO";

/**
 * 夺宝奇兵宝石矩阵中的单个宝石
 */
export default class GemCell extends FUI_GemCell {
  private _gemInfo: GemMazeGemInfoVO;
  private movie: fairygui.GMovieClip;
  private _lightMc: fairygui.GMovieClip; //选中闪光动画
  private _cellSelected: boolean; //是否选中
  private MOVE_TIME: number = 0.3; //宝石移动花费的时间 单位: 秒

  protected onConstruct() {
    super.onConstruct();
  }

  public get gemInfo(): GemMazeGemInfoVO {
    return this._gemInfo;
  }

  public set gemInfo(value: GemMazeGemInfoVO) {
    this._gemInfo = value;
    this.updateView();
  }

  public get cellSelected(): boolean {
    return this._cellSelected;
  }

  public set cellSelected(value: boolean) {
    this._cellSelected = value;
    if (this._cellSelected) {
      this._lightMc.visible = true;
      this._lightMc.playing = true;
    } else {
      this._lightMc.visible = false;
      this._lightMc.playing = false;
    }
  }

  public updateView(): void {
    this.movie = FUIHelper.createFUIInstance(
      "GemMaze",
      "asset.GemMaze.GemAction_" + this.gemInfo.type,
    ) as fgui.GMovieClip;
    this.movie.playing = false;
    this.addChild(this.movie);
    this._lightMc = FUIHelper.createFUIInstance(
      "GemMaze",
      "asset.GemMaze.GemLight",
    ) as fgui.GMovieClip;
    this._lightMc.playing = false;
    this.addChild(this._lightMc);
  }

  /**
   *消除宝石动画播放完毕
   */
  private playEnd(): void {
    GemMazeManager.Instance.dispatchEvent(GemMazeEvent.GEMMAZE_REMOVE_COMPLETE);
    this.dispose();
  }

  public action(_x: number, _y: number): void {
    TweenMax.to(this, this.MOVE_TIME, {
      x: _x,
      y: _y,
      onComplete: this.onMoveComplete,
    });
  }

  private onMoveComplete(): void {
    GemMazeManager.Instance.dispatchEvent(
      GemMazeEvent.GEMMAZE_GEM_ACTION_COMPLETE,
      this,
    );
  }

  /**
   * 播放消除宝石动画
   */
  public playAni(): void {
    this.movie.setPlaySettings(
      0,
      -1,
      1,
      -1,
      Laya.Handler.create(this, this.playEnd),
    );
    this.movie.playing = true;
  }
}
