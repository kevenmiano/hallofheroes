// @ts-nocheck
import GameEventDispatcher from "../event/GameEventDispatcher";
// import IManager from "../Interface/IManager";
import UILayer from "../ui/UILayer";
import { EmLayer } from "../ui/ViewInterface";
import SceneLayer from "./SceneLayer";
import { ILayer } from "./ILayer";
import ObjectUtils from "../utils/ObjectUtils";
import FuiLayer from "../ui/FuiLayer";

/**
 * @author:pzlricky
 * @data: 2020-11-17 10:52
 * @description ***
 */
export default class LayerMgr extends GameEventDispatcher {
  private managers: ILayer[] = [];

  private static ins: LayerMgr;

  static get Instance(): LayerMgr {
    if (!LayerMgr.ins) {
      LayerMgr.ins = new LayerMgr();
    }
    return LayerMgr.ins;
  }

  constructor() {
    super();
  }

  preSetup(t?: any) {
    this.managers = [];
    this.init();
  }

  setup(t?: any) {}

  init() {
    this.clear();
    this.setManager(
      EmLayer.STAGE_BOTTOM_LAYER,
      new SceneLayer(EmLayer.STAGE_BOTTOM_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.GAME_BOTTOM_LAYER,
      new UILayer(EmLayer.GAME_BOTTOM_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.GAME_BASE_LAYER,
      new UILayer(EmLayer.GAME_BASE_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.GAME_UI_LAYER,
      new UILayer(EmLayer.GAME_UI_LAYER, true),
      Laya.stage
    );
    this.setManager(EmLayer.FGUI_LAYER, new FuiLayer(EmLayer.FGUI_LAYER), null);

    this.setManager(
      EmLayer.GAME_DYNAMIC_LAYER,
      new UILayer(EmLayer.GAME_DYNAMIC_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.GAME_DYNAMIC_LAYER2,
      new UILayer(EmLayer.GAME_DYNAMIC_LAYER2, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.GAME_MENU_LAYER,
      new UILayer(EmLayer.GAME_MENU_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.GAME_TOP_LAYER,
      new UILayer(EmLayer.GAME_TOP_LAYER, true),
      Laya.stage
    );

    this.setManager(
      EmLayer.STAGE_DYANMIC_LAYER,
      new UILayer(EmLayer.STAGE_DYANMIC_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.STAGE_TOP_LAYER,
      new UILayer(EmLayer.STAGE_TOP_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.STAGE_DRAG_LAYER,
      new UILayer(EmLayer.STAGE_DRAG_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.STAGE_TOOLTIP_LAYER,
      new UILayer(EmLayer.STAGE_TOOLTIP_LAYER, true),
      Laya.stage
    ); //界面提示层
    this.setManager(
      EmLayer.NOVICE_LAYER,
      new UILayer(EmLayer.NOVICE_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.STAGE_TIP_DYANMIC_LAYER,
      new UILayer(EmLayer.STAGE_TIP_DYANMIC_LAYER, true),
      Laya.stage
    );
    this.setManager(
      EmLayer.STAGE_TIP_LAYER,
      new UILayer(EmLayer.STAGE_TIP_LAYER, true),
      Laya.stage
    ); //公用文字提示层
  }

  setManager(index: EmLayer, manager: any, root?: any) {
    manager.init(root);
    this.managers[index] = manager;
  }

  public getLayerByType(type: EmLayer): ILayer {
    if (this.managers) return this.managers[type];
    return null;
  }

  public cleanLayerByType(type: EmLayer) {
    this.cleanSprite(type);
  }

  /**
   * 清除所有UI
   */
  clear() {
    for (let index = this.managers.length - 1; index >= 0; index--) {
      const manager = this.managers[index];
      if (manager.canPop() && manager.count() > 0) {
        manager.clear();
        manager.removeSelf();
      }
    }
  }

  /**
   * 层级显示隐藏
   * @param uiIndex
   * @param flag
   */
  setVisible(uiIndex: EmLayer, flag: boolean) {
    this.managers[uiIndex].setVisible(flag);
  }

  getLayer(layer: EmLayer): ILayer | any {
    if (this.managers) return this.managers[layer];
    return null;
  }

  getAllLayer(): ILayer[] {
    return this.managers;
  }

  /**添加至层级 */
  addToLayer(view: any, type: EmLayer, zIndex?: number) {
    if (view.destroyed) return; //避免销毁后再添加的偶现问题(解决偶现的战场结束黑屏问题)
    let container: ILayer = this.getLayer(type);
    container.pushView(view, zIndex);
  }

  /**通过层级移除 */
  removeByLayer(view: any, type: EmLayer) {
    let container: ILayer = this.getLayer(type);
    container.popView(view);
  }

  /**清理顶部动态层窗口 */
  clearStageTipDynamicLayer() {
    this.cleanSprite(EmLayer.STAGE_TIP_DYANMIC_LAYER);
  }

  clearGameMenuLayer() {
    this.cleanSprite(EmLayer.GAME_MENU_LAYER);
  }

  public clearnGameDynamic() {
    this.cleanSprite(EmLayer.GAME_DYNAMIC_LAYER);
  }

  clearnStageDynamic() {
    this.cleanSprite(EmLayer.STAGE_DYANMIC_LAYER);
  }

  clearnStageTips() {
    this.cleanSprite(EmLayer.STAGE_TOOLTIP_LAYER);
  }

  /**清除某层所有UI */
  private cleanSprite(type: EmLayer) {
    let target: any = this.getLayer(type);
    while (target.numChildren > 0) {
      let child = target.getChildAt(0);
      // target.removeChildAt(0);
      ObjectUtils.disposeObject(child);
    }
  }
}
