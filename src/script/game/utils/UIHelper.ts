/*
 * @Author: jeremy.xu
 * @Date: 2021-07-08 17:41:39
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-26 11:38:21
 * @Description:
 */

import LayerMgr from "../../core/layer/LayerMgr";
// import Logger from "../../core/logger/Logger";
import BaseWindow from "../../core/ui/Base/BaseWindow";
import UILayer from "../../core/ui/UILayer";
import UIManager from "../../core/ui/UIManager";
import { EmLayer } from "../../core/ui/ViewInterface";
import { EmWindow } from "../constant/UIDefine";
import NewbieBaseActionMediator from "../module/guide/mediators/NewbieBaseActionMediator";
import LoadingUIMgr from "../module/loading/LoadingUIMgr";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";

export default class UIHelper {
  /**
   * 移除多个界面 默认不移除主界面, 和任务界面
   * @param emWindows
   * @param reverse
   * @param isDispose
   */
  static closeWindows(
    emWindows: EmWindow[] = [],
    reverse: boolean = true,
    dispose: boolean = true,
  ) {
    if (emWindows.length == 0) {
      emWindows = [
        EmWindow.SpaceTaskInfoWnd,
        EmWindow.Home,
        EmWindow.LevelUp,
        EmWindow.LogWnd,
        EmWindow.AutoWalkWnd,
        EmWindow.Battle,
      ];
    }

    let emLayerArr: EmLayer[] = [
      EmLayer.STAGE_TOOLTIP_LAYER,
      EmLayer.GAME_UI_LAYER,
      EmLayer.GAME_DYNAMIC_LAYER,
      EmLayer.GAME_DYNAMIC_LAYER2,
    ];
    for (let index = 0; index < emLayerArr.length; index++) {
      const emLayer = emLayerArr[index] as EmLayer;
      const container = LayerMgr.Instance.getLayer(emLayer) as UILayer;
      for (let index = container.list.length - 1; index >= 0; index--) {
        let view = container.list[index];
        let type: EmWindow;
        if (view && view["getUIID"]) {
          type = view.getUIID();
          let idx = emWindows.indexOf(type);
          if (reverse) {
            if (idx < 0) {
              UIHelper.closeWindow(type, dispose);
            }
          } else {
            if (idx > 0) {
              UIHelper.closeWindow(type, dispose);
            }
          }
        } else {
          //节点通过层删除
          LayerMgr.Instance.removeByLayer(view, emLayer);
        }
      }
    }

    /***
     * 移除正在加载中的界面
     */
    LoadingUIMgr.Instance.forceHide();
    //
    NewbieBaseActionMediator.cleanAll();
  }

  /**
   * 移除单个界面
   * @param type
   * @param dispose
   */
  static closeWindow(type: EmWindow, dispose: boolean = true) {
    let ctrl = FrameCtrlManager.Instance.getCtrl(type);
    if (ctrl) {
      FrameCtrlManager.Instance.exit(type);
    } else {
      UIManager.Instance.HideWind(type);
    }
  }

  static openWindow(type: EmWindow, param?: any) {
    let ctrl = FrameCtrlManager.Instance.getCtrl(type);
    if (ctrl) {
      FrameCtrlManager.Instance.open(type, param);
    } else {
      UIManager.Instance.ShowWind(type, param);
    }
  }

  static searchBaseWindow(node: Laya.Node | fgui.GComponent) {
    if (!node.parent) {
      return false;
    }

    if (node.parent.name == BaseWindow.BaseWindRootNode) {
      return node.parent;
    }

    return UIHelper.searchBaseWindow(node.parent);
  }
}
