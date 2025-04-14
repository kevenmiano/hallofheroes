import { IMediator } from "@/script/game/interfaces/Mediator";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import TrailMapWnd from "../../module/trailMap/TrailMapWnd";

/**
 *
 * 试炼之塔地图界面控制
 *
 */
export class TrailMapMediator implements IMediator {
  // private _trailView:TrailView ;
  constructor() {}

  public register(target: object) {
    UIManager.Instance.ShowWind(EmWindow.TrailMap);
    // this._trailView = new TrailView();
    // LayerManager.Instance.addToLayer(this._trailView,LayerManager.GAME_UI_LAYER,false,false,0,UISpriteLayer.LEFT_CONTAINER);
    // TaskTraceBar.Instance.hide();
  }

  public unregister(target: object) {
    UIManager.Instance.HideWind(EmWindow.TrailMap);

    // if(this._trailView)this._trailView.dispose();this._trailView = null;
  }
}
