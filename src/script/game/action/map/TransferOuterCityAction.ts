import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import KeyBoardRegister from "../../keyboard/KeyBoardRegister";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { PreLoadOuterCityData } from "../../map/outercity/PreLoadOuterCityData";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { MapInfo } from "../../map/space/data/MapInfo";
import LoadingSceneWnd from "../../module/loading/LoadingSceneWnd";
import { EmPackName } from "../../constant/UIDefine";
import LayerMgr from "../../../core/layer/LayerMgr";
import { EmLayer } from "../../../core/ui/ViewInterface";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import Sprite = Laya.Sprite;
import { OuterCityManager } from "../../manager/OuterCityManager";
import { MapElmsLibrary } from "../../map/libray/MapElmsLibrary";

export class TransferOuterCityAction extends MapBaseAction {
  private _contaner: Sprite;

  constructor() {
    super();
  }

  public prepare() {
    super.prepare();
    KeyBoardRegister.Instance.keyEnable = false;

    //增加一层蒙版防止点击穿透
    if (!this._contaner) {
      this._contaner = new Sprite();
      this._contaner.size(4000, 4000);
      this._contaner.mouseEnabled = true;
      this._contaner.graphics.clear();
      this._contaner.graphics.drawRect(-1000, -1000, 4000, 4000, "#000000");
      this._contaner.alpha = 0.01;
      this._contaner.x = 0;
      this._contaner.y = 0;
      LayerMgr.Instance.addToLayer(this._contaner, EmLayer.STAGE_TIP_LAYER);
    }
  }

  private __count: number = 0;
  private _movie: fgui.GComponent;

  private bar: fgui.GImage;
  public update() {
    if (this.__count == 1) {
      this._movie = fgui.UIPackage.createObject(
        EmPackName.Space,
        "CollectionAsset",
      ).asCom;

      if (this._movie) {
        this.bar = this._movie.getChild("n4").asImage;
        let stateMc: fgui.Controller = this._movie.getController("cState");
        let movie: fgui.Transition = this._movie.getTransition("aniMovie");
        stateMc.selectedIndex = 1;
        this.bar.fillAmount = 0;
        movie.play(Laya.Handler.create(this, this.movieOver), 1);
        Laya.Tween.to(this.bar, { fillAmount: 1 }, 4750);
        LayerMgr.Instance.addToLayer(
          this._movie.displayObject,
          EmLayer.GAME_DYNAMIC_LAYER,
          -1,
        );
        this.__stageResizeHandler();
      }
      let mInfo: MapInfo = new MapInfo();
      mInfo.mapId =
        PlayerManager.Instance.currentPlayerModel.mapNodeInfo.info.mapId;
      OuterCityManager.Instance.loadBeforeEnterScene = true;
      MapElmsLibrary.Instance.lock();
      new PreLoadOuterCityData(mInfo).syncBackCall(this.preLoadOver.bind(this));
    }

    this.__count++;
  }

  private __stageResizeHandler(evt: Event = null) {
    if (this._movie) {
      this._movie.x = (StageReferance.stageWidth - this._movie.width) / 2;
      this._movie.y = StageReferance.stageHeight - 200;
    }
  }

  private _playMovieOver: boolean = false;

  private movieOver() {
    this._playMovieOver = true;
    if (this._movie) {
      Laya.Tween.clearAll(this.bar);
      this._movie.displayObject.removeSelf();
      this._movie.dispose();
      this._movie = null;
    }
    if (this._preLoadOver && this._playMovieOver) {
      this.gotoOuterCity();
    } else {
      LoadingSceneWnd.Instance.Show();
    }
  }

  private __switchSceneHandler(sceneType: string) {
    if (sceneType != SceneType.OUTER_CITY_SCENE) {
      return;
    }
    SceneManager.Instance.lockScene = true;
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SWITCH_SCENE,
      this.__switchSceneHandler,
      this,
    );
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.SWITCH_MAP_TRANSFER,
      null,
    );
    Laya.timer.clear(this, this.cleanTransferEffect);
    Laya.timer.loop(1000, this, this.cleanTransferEffect);
  }

  private _preLoadOver: boolean = false;

  private preLoadOver() {
    this._preLoadOver = true;
    if (this._preLoadOver && this._playMovieOver) {
      this.gotoOuterCity();
    }
  }

  private gotoOuterCity() {
    let data: object = { isShowLoading: false, showMapName: false };
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SWITCH_SCENE,
      this.__switchSceneHandler,
      this,
    );
    SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE, data, true);
  }

  private cleanTransferEffect() {
    Laya.timer.clear(this, this.cleanTransferEffect);
    Laya.timer.once(200, this, this.actionOver);
  }

  private _shape: Sprite;

  protected actionOver() {
    super.actionOver();
    if (this._movie) {
      this._movie.displayObject.removeSelf();
      this._movie.dispose();
      this._movie = null;
    }
    if (this._contaner) {
      this._contaner.removeSelf();
      this._contaner.destroy();
      this._contaner = null;
    }
    if (this._shape) {
      this._shape.graphics.clear();
      this._shape.removeSelf();
      this._shape.destroy();
    }
    this._shape = null;
    KeyBoardRegister.Instance.keyEnable = true;
  }
}
