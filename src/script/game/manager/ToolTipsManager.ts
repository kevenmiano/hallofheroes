import UIManager from "../../core/ui/UIManager";
import { EmWindow } from "../constant/UIDefine";
import { ITipedDisplay, TipsShowType } from "../tips/ITipedDisplay";
import { LongPressManager } from "./LongPressManager";
import { InteractiveEvent } from "../constant/event/NotificationEvent";
import BaseWindow from "../../core/ui/Base/BaseWindow";
import LayerMgr from "../../core/layer/LayerMgr";
import { StageReferance } from "../roadComponent/pickgliss/toplevel/StageReferance";
import Logger from "../../core/logger/Logger";
import Resolution from "../../core/comps/Resolution";
import Sprite = Laya.Sprite;
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import LangManager from "../../core/lang/LangManager";
import GoodsSonType from "../constant/GoodsSonType";
import { WildSoulInfo } from "../module/mount/model/WildSoulInfo";
import { MountsManager } from "./MountsManager";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/12 17:33
 * @ver 1.0
 *
 */
export class ToolTipsManager {
  private static _instance: ToolTipsManager;
  private _tipType: EmWindow;
  private _tipData: any;
  private _extData: any;
  private _tipContainer: Laya.Sprite;

  public static get Instance(): ToolTipsManager {
    if (ToolTipsManager._instance == null) {
      ToolTipsManager._instance = new ToolTipsManager();
    }
    return ToolTipsManager._instance;
  }

  constructor() {}

  /**
   *
   * @param tipedDisplay 显示tip的鼠标相应对象
   *
   */
  public register(tipedDisplay: ITipedDisplay | any) {
    if (!tipedDisplay || tipedDisplay.isDisposed || tipedDisplay.destroyed) {
      return;
    }

    this.removeEvent(tipedDisplay);
    switch (tipedDisplay.showType) {
      case TipsShowType.onClick:
        tipedDisplay.on(Laya.Event.MOUSE_DOWN, this, this.ontipedDisplayDown);
        tipedDisplay.on(Laya.Event.MOUSE_UP, this, this.ontipedDisplayUp);
        tipedDisplay.on(Laya.Event.MOUSE_MOVE, this, this.ontipedDisplayMove);
        tipedDisplay.on(Laya.Event.MOUSE_OUT, this, this.ontipedDisplayOut);
        break;
      case TipsShowType.onDoubleClick:
        tipedDisplay.on(Laya.Event.DOUBLE_CLICK, this, this.showTip);
        break;
      case TipsShowType.onMouseDown:
        tipedDisplay.on(Laya.Event.MOUSE_DOWN, this, this.showTip);
        break;
      case TipsShowType.onLongPress:
        let orSp: Sprite =
          tipedDisplay instanceof fgui.GObject
            ? tipedDisplay.displayObject
            : tipedDisplay;
        orSp.on(InteractiveEvent.LONG_PRESS, this, this.showTip);
        LongPressManager.Instance.enableLongPress(orSp);
        break;
      case TipsShowType.onLongPress2:
        let orSp2: Sprite =
          tipedDisplay instanceof fgui.GObject
            ? tipedDisplay.displayObject
            : tipedDisplay;
        orSp2.on(InteractiveEvent.LONG_PRESS, this, this.showTip);
        orSp2.on(InteractiveEvent.LONG_PRESS_END, this, this.hideTip);
        LongPressManager.Instance.enableLongPress(orSp2);
        break;
      default:
        tipedDisplay.on(Laya.Event.CLICK, this, this.showTip);
        break;
    }
  }

  private parsTarget(
    event: Laya.Event,
    sp: Laya.Sprite = null,
  ): Sprite | fgui.GObject {
    let target: Sprite | fgui.GObject;
    if (!sp) {
      target = fgui.GObject.cast(event.currentTarget) as ITipedDisplay;
    } else {
      target = fgui.GObject.cast(sp) as ITipedDisplay;
    }

    if (!target) {
      target = event.currentTarget;
    }
    return target;
  }

  private ontipedDisplayDown(event: Laya.Event, sp: Laya.Sprite = null) {
    let target: any = this.parsTarget(event, sp);

    if (!target) {
      return;
    }
    target.iSDown = true;
    target.mouseDownPoint = new Laya.Point(
      Laya.stage.mouseX,
      Laya.stage.mouseY,
    );
  }

  private ontipedDisplayUp(event: Laya.Event, sp: Laya.Sprite = null) {
    let target: any = this.parsTarget(event, sp);

    if (!target) {
      return;
    }
    if (target.isMove || !target.iSDown) {
      this.resetTarget(target);
      return;
    }
    this.resetTarget(target);
    // if (target.alphaTest) {
    //     if (target.getCurrentPixels && target.getCurrentPixels() > 10) {
    //         this.showTip(event, sp);
    //     }
    // } else {
    this.showTip(event, sp);
    // }
  }

  private ontipedDisplayMove(event: Laya.Event, sp: Laya.Sprite = null) {
    let target: any = this.parsTarget(event, sp);

    if (!target || !target.iSDown) {
      return;
    }
    let distance = target.mouseDownPoint.distance(
      Laya.stage.mouseX,
      Laya.stage.mouseY,
    );
    target.isMove = distance > (target.moveDistance ? target.moveDistance : 20);
  }

  private ontipedDisplayOut(event: Laya.Event, sp: Laya.Sprite = null) {
    let target: any = this.parsTarget(event, sp);
    if (target) {
      this.resetTarget(target);
    }
  }

  private resetTarget(target) {
    target.iSDown = false;
    target.isMove = false;
    target.mouseDownPoint = null;
  }

  public async showTip(event: Laya.Event, sp: Laya.Sprite = null) {
    let target: any = this.parsTarget(event, sp);

    if (!target) {
      return;
    }
    this._tipType = target.tipType;
    this._tipData = target.tipData;
    this._extData = target.extData;
    if (target.tipData) {
      if (!target.tipType) {
        Logger.yyz("对应的tips类型不存在: ", target.tipData);
        return;
      }
      let tip: BaseWindow = await UIManager.Instance.ShowWind(
        target.tipType,
        [target.tipData, target.canOperate, target.extData],
        false,
      );
      if (this._extData == "center") {
        this.setCenter(tip);
      } else {
        this.setTipPos(target, tip);
      }
    }
  }

  public setTipPos(target, tip: BaseWindow) {
    if (target.tipData) {
      if (!target.tipType || !tip) {
        Logger.yyz("对应的tips类型不存在: ", target.tipData);
        return;
      }
      if (target.startPoint) {
        let tipContainer: Sprite = LayerMgr.Instance.getLayer(
          UIManager.Instance.getUIInfo(target.tipType).Layer,
        );
        let orSp: Sprite =
          target instanceof fgui.GObject ? target.displayObject : target;
        let startPos: Laya.Point = tipContainer.globalToLocal(
          orSp.localToGlobal(target.startPoint, true),
          true,
        );
        let resultDirection: DirectionPos = this.getTipPriorityDirction(
          tip,
          target,
          target.tipDirctions,
        );
        Logger.yyz("获取到的最佳Tips显示方向: ", resultDirection);

        let resultPos: Laya.Point = this.getTipPosByDirction(
          tip,
          target,
          resultDirection.direction,
        );
        tip["direction"] = resultDirection.direction;

        tip.getContentPane().x =
          resultPos.x + startPos.x + resultDirection.offsetX;
        tip.getContentPane().y =
          resultPos.y + startPos.y + resultDirection.offsetY;

        // if(resultDirection.offsetX < Math.floor(Number.MAX_VALUE / 2))
        // {
        //     tip.getContentPane().x = resultPos.x + startPos.x + resultDirection.offsetX;
        // }
        // else
        // {
        //     tip.getContentPane().x = resultPos.x + startPos.x
        // }
        //
        // if(resultDirection.offsetY < Math.floor(Number.MAX_VALUE / 2))
        // {
        //     tip.getContentPane().y = resultPos.y + startPos.y + resultDirection.offsetY;
        // }
        // else
        // {
        //     tip.getContentPane().y = resultPos.y + startPos.y
        // }
      } else {
        if (tip.getContentPane().width <= Resolution.gameWidth) {
          tip.getContentPane().x =
            (Resolution.gameWidth - tip.getContentPane().width) / 2;
        } else {
          tip.getContentPane().x = 0;
        }

        if (tip.getContentPane().height <= Resolution.gameHeight) {
          tip.getContentPane().y =
            (Resolution.gameHeight - tip.getContentPane().height) / 2;
        } else {
          tip.getContentPane().y = 0;
        }
      }
      tip.visible = true;

      Logger.yyz("Tips位置: ", tip.getContentPane().x, tip.getContentPane().y);
      Logger.yyz(
        "Tips大小: ",
        tip.getContentPane().width,
        tip.getContentPane().height,
      );
    } else {
      // 没有tipData的从默认位置左上角变为屏幕居中
      this.setCenter(tip);
    }
  }

  private setCenter(tip) {
    if (tip.getContentPane().width <= Resolution.gameWidth) {
      tip.getContentPane().x =
        (Resolution.gameWidth - tip.getContentPane().width) / 2;
    } else {
      tip.getContentPane().x = 0;
    }

    if (tip.getContentPane().height <= Resolution.gameHeight) {
      tip.getContentPane().y =
        (Resolution.gameHeight - tip.getContentPane().height) / 2;
    } else {
      tip.getContentPane().y = 0;
    }
    tip.visible = true;
  }

  private getTipPriorityDirction(
    tip: BaseWindow,
    target: ITipedDisplay,
    directions: string = "7,5,4,6,2,1,3,0",
  ): DirectionPos {
    let dirs = directions.split(",");
    let resultDirectionPos: DirectionPos;
    let tempDirectionPos: DirectionPos[] = [];
    let orSp: Sprite =
      target instanceof fgui.GObject ? target.displayObject : target;
    let tipContainer: Sprite = LayerMgr.Instance.getLayer(
      UIManager.Instance.getUIInfo(target.tipType).Layer,
    );
    let startPos: Laya.Point = tipContainer.globalToLocal(
      orSp.localToGlobal(target.startPoint, true),
      true,
    );
    for (let i: number = 0; i < dirs.length; i++) {
      let ordinaryPos: Laya.Point = this.getTipPosByDirction(
        tip,
        target,
        +dirs[i],
      );
      //tips左上角点坐标
      let resultStartPos: Laya.Point = new Laya.Point(
        ordinaryPos.x + startPos.x,
        ordinaryPos.y + startPos.y,
      );
      //tips右下角点坐标
      let contentWidth: number = 0;
      let contentHeight: number = 0;
      if (tip && tip.getContentPane()) {
        contentWidth = tip.getContentPane().width;
        contentHeight = tip.getContentPane().height;
      }
      let resultEndPos: Laya.Point = new Laya.Point(
        ordinaryPos.x + startPos.x + contentWidth,
        ordinaryPos.y + startPos.y + contentHeight,
      );
      let directionPos: DirectionPos = this.creatDirectionPosII(
        resultStartPos,
        resultEndPos,
        parseInt(dirs[i]),
      );
      if (directionPos.offsetX == 0 && directionPos.offsetY == 0) {
        resultDirectionPos = directionPos;
        break;
      } else {
        tempDirectionPos.push(directionPos);
      }
    }
    if (resultDirectionPos == null) {
      resultDirectionPos = this.searchFixedDirectionPos(tempDirectionPos);
    }
    return resultDirectionPos;
  }

  private searchFixedDirectionPos(
    tempDirections: DirectionPos[],
  ): DirectionPos {
    let result: DirectionPos;
    let reverDirections: DirectionPos[] = tempDirections.reverse();
    for (let i: number = 0; i < reverDirections.length; i++) {
      if (result == null) {
        result = reverDirections[i];
      } else {
        let current: number =
          Math.abs(reverDirections[i].offsetX) +
          Math.abs(reverDirections[i].offsetY);
        let last: number = Math.abs(result.offsetX) + Math.abs(result.offsetY);
        if (current <= last) {
          result = reverDirections[i];
        }
      }
    }
    return result;
  }

  // private creatDirectionPos(startPos:Laya.Point, endPos:Laya.Point, direction:number):DirectionPos
  // {
  //     let directionPos:DirectionPos = new DirectionPos();
  //     directionPos.direction = direction;
  //     if(direction == Directions.DIRECTION_T)
  //     {
  //         if(startPos.y < 0)
  //         {
  //             directionPos.offsetY = Number.MAX_VALUE / 2;
  //         }
  //         else
  //         {
  //             directionPos.offsetY = 0;
  //         }
  //         if(startPos.x < 0)
  //         {
  //             directionPos.offsetX = -startPos.x;
  //         }
  //         else if(endPos.x > StageReferance.stageWidth)
  //         {
  //             directionPos.offsetX = StageReferance.stageWidth - endPos.x;
  //         }
  //         else
  //         {
  //             directionPos.offsetX = 0;
  //         }
  //     }
  //     else if(direction == Directions.DIRECTION_L)
  //     {
  //         if(startPos.x < 0)
  //         {
  //             directionPos.offsetX = Number.MAX_VALUE / 2;
  //         }
  //         else
  //         {
  //             directionPos.offsetX = 0;
  //         }
  //         if(startPos.y < 0)
  //         {
  //             directionPos.offsetY = -startPos.y;
  //         }
  //         else if(endPos.y > StageReferance.stageHeight)
  //         {
  //             directionPos.offsetY = StageReferance.stageHeight - endPos.y;
  //         }
  //         else
  //         {
  //             directionPos.offsetY = 0;
  //         }
  //     }
  //     else if(direction == Directions.DIRECTION_R)
  //     {
  //         if(endPos.x > StageReferance.stageWidth)
  //         {
  //             directionPos.offsetX = Number.MAX_VALUE / 2;
  //         }
  //         else
  //         {
  //             directionPos.offsetX = 0;
  //         }
  //         if(startPos.y < 0)
  //         {
  //             directionPos.offsetY = -startPos.y;
  //         }
  //         else if(endPos.y > StageReferance.stageHeight)
  //         {
  //             directionPos.offsetY = StageReferance.stageHeight - endPos.y;
  //         }
  //         else
  //         {
  //             directionPos.offsetY = 0;
  //         }
  //     }
  //     else if(direction == Directions.DIRECTION_B)
  //     {
  //         if(endPos.y > StageReferance.stageHeight)
  //         {
  //             directionPos.offsetY = Number.MAX_VALUE / 2;
  //         }
  //         else
  //         {
  //             directionPos.offsetY = 0;
  //         }
  //         if(startPos.x < 0)
  //         {
  //             directionPos.offsetX = -startPos.x;
  //         }
  //         else if(endPos.x > StageReferance.stageWidth)
  //         {
  //             directionPos.offsetX = StageReferance.stageWidth - endPos.x;
  //         }
  //         else
  //         {
  //             directionPos.offsetX = 0;
  //         }
  //     }
  //     else
  //     {
  //         if(this.isInTheStage(startPos) && this.isInTheStage(endPos))
  //         {
  //             directionPos.offsetX = 0;
  //             directionPos.offsetY = 0;
  //         }
  //         else
  //         {
  //             directionPos.offsetY = Number.MAX_VALUE / 2;
  //             directionPos.offsetX = Number.MAX_VALUE / 2;
  //         }
  //     }
  //     return directionPos;
  // }

  private creatDirectionPosII(
    startPos: Laya.Point,
    endPos: Laya.Point,
    direction: number,
  ): DirectionPos {
    let directionPos: DirectionPos = new DirectionPos();
    directionPos.direction = direction;

    if (startPos.x < 0) {
      directionPos.offsetX = -startPos.x;
    } else if (endPos.x > StageReferance.stageWidth) {
      directionPos.offsetX = StageReferance.stageWidth - endPos.x;
    } else {
      directionPos.offsetX = 0;
    }

    if (startPos.y < 0) {
      directionPos.offsetY = -startPos.y;
    } else if (endPos.y > StageReferance.stageHeight) {
      directionPos.offsetY = StageReferance.stageHeight - endPos.y;
    } else {
      directionPos.offsetY = 0;
    }
    return directionPos;
  }

  /**
   * 检查点是否在显示范围之内
   * @param point 需要检查的点
   * @param parent 此点所参考的父级, 如果为stage可以不传
   * @return point是否在显示范围之内
   *
   */
  public isInTheStage(point: Laya.Point, parent: Laya.Sprite = null): boolean {
    let stagePoint: Laya.Point = point;
    if (parent) {
      stagePoint = parent.localToGlobal(point, true);
    }
    if (
      stagePoint.x < 0 ||
      stagePoint.y < 0 ||
      stagePoint.x > StageReferance.stageWidth ||
      stagePoint.y > StageReferance.stageHeight
    ) {
      return false;
    }
    return true;
  }

  /**
   *
   * @param tip 所要显示的tip
   * @param target 显示tip的鼠标相应对象
   * @param direction tip所显示的方向
   * @return tip所显示的位置（以target的注册点为注册点）
   *
   */
  public getTipPosByDirction(
    tip: BaseWindow,
    target: ITipedDisplay,
    direction: number,
  ): Laya.Point {
    let resultPos: Laya.Point = new Laya.Point();
    let targetWidth: number = target.width;
    let targetHeight: number = target.height;
    let tipGapV: number = target.tipGapV ? target.tipGapV : 0;
    let tipGapH: number = target.tipGapH ? target.tipGapH : 0;
    if (direction == Directions.DIRECTION_T) {
      resultPos.y = -tip.getContentPane().height - tipGapV;
      resultPos.x = (targetWidth - tip.getContentPane().width) / 2;
    } else if (direction == Directions.DIRECTION_L) {
      resultPos.x = -tip.getContentPane().width - tipGapH;
      resultPos.y = (targetHeight - tip.getContentPane().height) / 2;
    } else if (direction == Directions.DIRECTION_R) {
      resultPos.x = targetWidth + tipGapH;
      resultPos.y = (targetWidth - tip.getContentPane().height) / 2;
    } else if (direction == Directions.DIRECTION_B) {
      resultPos.y = targetHeight + tipGapV;
      resultPos.x = (targetWidth - tip.getContentPane().width) / 2;
    } else if (direction == Directions.DIRECTION_TL) {
      resultPos.y = -tip.getContentPane().height - tipGapV;
      resultPos.x = -tip.getContentPane().width - tipGapH;
    } else if (direction == Directions.DIRECTION_TR) {
      resultPos.y = -tip.getContentPane().height - tipGapV + targetHeight / 2;
      resultPos.x = targetWidth + tipGapH;
    } else if (direction == Directions.DIRECTION_BL) {
      resultPos.y = targetHeight + tipGapV;
      resultPos.x = -tip.getContentPane().width - tipGapH;
    } else if (direction == Directions.DIRECTION_BR) {
      resultPos.y = targetHeight + tipGapV;
      resultPos.x = targetWidth + tipGapH;
    }
    return resultPos;
  }

  public unRegister(
    tipedDisplay: ITipedDisplay | any,
    hideTips: boolean = true,
  ) {
    if (!tipedDisplay || tipedDisplay.isDisposed || tipedDisplay.destroyed) {
      return;
    }
    this.removeEvent(tipedDisplay);
    hideTips && this.hideTip(tipedDisplay);
    // Logger.yyz(`注销${this._tipType}完成！`);
  }

  private removeEvent(tipedDisplay: ITipedDisplay) {
    if (!tipedDisplay) {
      return;
    }
    // showType  改变后, 事件可能移除不完整
    // switch (tipedDisplay.showType) {
    //     case TipsShowType.onClick:
    tipedDisplay.off(Laya.Event.MOUSE_DOWN, this, this.ontipedDisplayDown);
    tipedDisplay.off(Laya.Event.MOUSE_UP, this, this.ontipedDisplayUp);
    tipedDisplay.off(Laya.Event.MOUSE_MOVE, this, this.ontipedDisplayMove);
    tipedDisplay.off(Laya.Event.MOUSE_OUT, this, this.ontipedDisplayOut);
    // break;
    // case TipsShowType.onDoubleClick:
    tipedDisplay.off(Laya.Event.DOUBLE_CLICK, this, this.showTip);
    // break;
    // case TipsShowType.onMouseDown:
    tipedDisplay.off(Laya.Event.MOUSE_DOWN, this, this.showTip);
    // break;
    // case TipsShowType.onLongPress:
    let orSp: Sprite =
      tipedDisplay instanceof fgui.GObject
        ? tipedDisplay.displayObject
        : tipedDisplay;
    orSp.off(InteractiveEvent.LONG_PRESS, this, this.showTip);
    LongPressManager.Instance.disableLongPress(orSp);
    // break;
    // case TipsShowType.onLongPress2:
    let orSp2: Sprite =
      tipedDisplay instanceof fgui.GObject
        ? tipedDisplay.displayObject
        : tipedDisplay;
    orSp2.off(InteractiveEvent.LONG_PRESS, this, this.showTip);
    orSp2.off(InteractiveEvent.LONG_PRESS_END, this, this.hideTip);
    LongPressManager.Instance.disableLongPress(orSp2);
    // break;
    // default:
    tipedDisplay.off(Laya.Event.CLICK, this, this.showTip);
    // break;
    // }
  }

  public hideTip(target: ITipedDisplay) {
    if (target == null) {
      return;
    }
    UIManager.Instance.HideWind(target.tipType);
  }

  public setMountActiveTxt(info: GoodsInfo, bindTxt: fgui.GTextField) {
    if (
      info &&
      info.templateInfo &&
      info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_CARD
    ) {
      let mountTemplateId: number = info.templateInfo.Property1;
      let isActive: boolean =
        MountsManager.Instance.avatarList.isLightTemplate(mountTemplateId);
      if (isActive) {
        //激活的
        let wildSoulInfo: WildSoulInfo =
          MountsManager.Instance.avatarList.getWildSoulInfo(mountTemplateId);
        let maxStarGrade: number = MountsManager.Instance.maxStarGrade;
        if (wildSoulInfo && wildSoulInfo.starLevel >= maxStarGrade) {
          //炼化到最大星级
          bindTxt.text = LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.EquipTipsContent.mountTips3",
          );
        } else {
          //时效坐骑不显示炼化
          bindTxt.text = wildSoulInfo.template.StarItem
            ? LangManager.Instance.GetTranslation(
                "yishi.view.tips.goods.EquipTipsContent.mountTips2",
              )
            : "";
        }
      } else {
        bindTxt.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTipsContent.mountTips1",
        );
      }
      bindTxt.visible = true;
    } else {
      bindTxt.text = "";
    }
  }
}

export class DirectionPos {
  public offsetX: number;
  public offsetY: number;
  public direction: number;
}

export enum Directions {
  DIRECTION_BR = 7, //右下
  DIRECTION_TR = 5, //右上
  DIRECTION_TL = 4, //左上
  DIRECTION_BL = 6, //左下
  DIRECTION_B = 3, //下
  DIRECTION_R = 2, //右
  DIRECTION_T = 0, //上
  DIRECTION_L = 1, //左
}
