/*
 * @Author: jeremy.xu
 * @Date: 2022-06-21 15:56:15
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:26:01
 * @Description:
 */

import { EmPackName } from "../constant/UIDefine";
import FUIHelper from "../utils/FUIHelper";
import HintUtils, {
  HintType,
  HintViewData,
  HintAniData,
  FontType,
} from "./HintUtils";

export default class HintUtilsHelper {
  static create(hintType: HintType, fontType: FontType) {
    let comp: fgui.GComponent;
    switch (hintType) {
      default:
        comp = FUIHelper.createFUIInstance(EmPackName.Font, "HintLabel");
        break;
    }
    comp.displayObject.mouseThrough = true;
    comp.displayObject.mouseEnabled = false;
    return comp;
  }

  static refreshView(
    comp: fgui.GComponent,
    hintType: HintType,
    content: string,
    viewData: string | HintViewData = "",
    aniData: HintAniData,
  ) {
    if (aniData.point) {
      comp.x = aniData.point.x;
      comp.y = aniData.point.y;
    }

    let txt = comp.getChild("text") as fgui.GTextField;
    let icon = comp.getChild("icon") as fgui.GLoader;
    txt.text = content;
    if (!viewData) {
      txt.x = comp.width / 2;
    }

    if (aniData.type == FontType.NONE) {
      let fontCfg = aniData.fontCfg;
      txt.color = fontCfg.color;
      txt.fontSize = fontCfg.fontSize;
    } else {
      let cfgType = aniData.type;
      let bmFontCfg = aniData.bmFontCfg
        ? aniData.bmFontCfg
        : HintUtils.BMFontCfgMap.get(cfgType);
      txt.fontSize = bmFontCfg.size;
      txt.font = bmFontCfg.url;
      txt.letterSpacing = bmFontCfg.distance;
      if (typeof viewData == "string") {
        icon.url = viewData;
      }
    }
  }

  static showAction(
    target: fgui.GComponent,
    hintType: HintType,
    viewData: string | HintViewData = "",
    aniData?: HintAniData,
    callback?: Function,
  ) {
    if (!target || target.isDisposed) return;

    Laya.Tween.clearAll(target);
    target.visible = true;
    target.displayObject.active = true;
    target.alpha = 1;

    switch (hintType) {
      case HintType.HintLabel:
        //DamageNum:
        //CureNum:
        //BlockNum:
        //LevelNum:
        //向上移动
        let targetY = aniData.point.y - 180;
        Laya.Tween.to(
          target,
          { y: targetY },
          1200,
          Laya.Ease.linearIn,
          Laya.Handler.create(target, (para) => {
            target.visible = false;
            target.displayObject.active = false;
          }),
          0,
          false,
          true,
        );

        target.alpha = 1;
        Laya.Tween.to(
          target,
          { alpha: 0 },
          1000,
          Laya.Ease.linearIn,
          undefined,
          200,
          false,
          true,
        );
        break;
    }
  }
}
