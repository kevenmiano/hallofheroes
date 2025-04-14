//@ts-expect-error: External dependencies
import ISceneSwitchAnimation from "../space/interfaces/ISceneSwitchAnimation";
import { BaseSceneView } from "./BaseSceneView";
import LayerMgr from "../../../core/layer/LayerMgr";

/**
 * @author yuanzhan.yu
 */
export default class EnterBattleSceneSwitchAnimation
  implements ISceneSwitchAnimation
{
  private _callBack: Function;
  private _curScene: BaseSceneView;

  private _nextScene: BaseSceneView;

  // private _mc: MovieClip;

  constructor(callBack: Function) {
    this._callBack = callBack;
  }

  /**
   * 下个场景
   */
  public nextScene($scene: BaseSceneView) {
    this._nextScene = $scene;
  }

  /**
   * 当前场景
   */
  public curScene(value: BaseSceneView) {
    this._curScene = value;
  }

  public start() {
    LayerMgr.Instance.clearnGameDynamic();
    this._callBack();
  }

  public stop() {}
}
