import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";

import { EnterFrameManager } from "../../manager/EnterFrameManager";

/**
 *
 * 人物层深
 *
 */
export class SpaceWalkDepthMediator implements IMediator, IEnterFrame {
  private _target: any;
  private _tempArr: any[] = [];
  private _count: number = 0;

  constructor() {}

  public register(target: any) {
    this._target = target;
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  public unregister(target: any) {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
  }

  public enterFrame() {
    this._tempArr = [];
    for (var i: number = 0; i < this._target.numChildren; i++) {
      var dv: any = this._target.getChildAt(i);
      this._tempArr.push({ obj: dv, x: dv.x, y: dv.y, index: i });
    }
    this._tempArr = ArrayUtils.sortOn(
      this._tempArr,
      ["y", "x", "index"],
      [ArrayConstant.NUMERIC, ArrayConstant.NUMERIC, ArrayConstant.NUMERIC],
    );
    for (var j: number = 0; j < this._target.numChildren; j++) {
      this._target.setChildIndex(this._tempArr[j].obj, j);
    }
  }

  private checkDepth(item1: any, item2: any): number {
    if (item1.y > item2.y) {
      return 1;
    } else if (item1.y == item2.y) {
      if (item1.x < item2.x) {
        return -1;
      } else if (item1.x > item2.x) {
        return 1;
      } else {
        return item1.index > item2.index ? 1 : -1;
      }
    } else {
      return -1;
    }
  }
}
