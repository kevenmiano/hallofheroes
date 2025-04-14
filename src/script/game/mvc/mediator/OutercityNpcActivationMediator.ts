import { DisplayObject } from "../../component/DisplayObject";
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { MapPhysics } from "../../map/space/data/MapPhysics";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import Sprite = Laya.Sprite;
import Rectangle = Laya.Rectangle;

/**
 * @description    移除不在屏幕上的NPC
 * @author yuanzhan.yu
 * @date 2021/11/18 14:05
 * @ver 1.0
 */
export class OutercityNpcActivationMediator implements IMediator {
  private _target: Sprite;

  constructor() {}

  public register(target: object): void {
    this._target = target as Sprite;
    this._target.on(
      OuterCityEvent.DRAG_SCENE_END,
      this,
      this.__dragScneHandler,
    );
  }

  public unregister(target: object): void {
    this._target = target as Sprite;
    this._target.off(
      OuterCityEvent.DRAG_SCENE_END,
      this,
      this.__dragScneHandler,
    );
  }

  private __dragScneHandler(obj: any): void {
    for (const objKey in obj) {
      if (obj.hasOwnProperty(objKey)) {
        let arr: any = obj[objKey];
        this.outSceneMoviesImp(arr);
      }
    }
  }

  private outSceneMoviesImp(arr: any): void {
    let curRect: Rectangle;
    let total: number = 0;
    let cur: number = 0;
    let temp: DisplayObject;
    for (const arrKey in arr) {
      if (arr.hasOwnProperty(arrKey)) {
        let item: any = arr[arrKey];
        if (item instanceof MapPhysics) {
          if (!item || !item.nodeView) {
            continue;
          }
          temp = item.nodeView;
        } else {
          temp = <Sprite>item;
        }

        let b: boolean = OutercityNpcActivationMediator.checkOutScene(
          temp,
          temp["sizeInfo"],
          this._target,
        );
        temp["isPlaying"] = !b;
        if (b) {
          cur++;
        }
      }
    }
  }

  public static checkOutScene(
    info: Sprite,
    curRect: any /** HeroAvatar.sizeMax */,
    $target: Sprite,
  ): boolean {
    let b: boolean = false;
    if (!info) {
      return b;
    }
    if (curRect) {
      // if(curRect.x > 5000 || curRect.y > 5000)
      // {//切换到地图时, 会出现很大的值, 原因暂未明
      //     let p:Point = $target.localToGlobal(new Point(info.x, info.y));
      //     curRect.x = p.x;
      //     curRect.y = p.y;
      //     p = null;
      // }
      // if(curRect.x - curRect.width > StageReferance.stageWidth)
      // {
      // }
      // else if(curRect.y - curRect.height > StageReferance.stageHeight)
      // {
      // }
      // else if(curRect.x + curRect.width < 0)
      // {
      // }
      // else if(curRect.y + curRect.height < 0)
      // {
      // }
      // else
      // {
      //     b = true;
      // }
      let mapModel = OuterCityManager.Instance.model;
      let mapView = OuterCityManager.Instance.mapView;

      let xMin = StageReferance.stageWidth / 2;
      let yMin = StageReferance.stageHeight / 2;
      let xMax = mapModel.mapTempInfo.Width - StageReferance.stageWidth / 2;
      let yMax = mapModel.mapTempInfo.Height - StageReferance.stageHeight / 2;
      let centerX: number = Math.abs(StageReferance.stageWidth / 2 - mapView.x);
      let centerY: number = Math.abs(
        StageReferance.stageHeight / 2 - mapView.y,
      );

      if (centerX < xMin) {
        centerX = xMin;
      } else if (centerX > xMax) {
        centerX = xMax;
      }
      if (centerY < yMin) {
        centerY = yMin;
      } else if (centerY > yMax) {
        centerY = yMax;
      }

      // 因为X轴的基准点大都是sizeMax中心, 所以不做判断
      if (Math.abs(info.x - centerX) > StageReferance.stageWidth / 2) {
        b = true;
      } else {
        let dir = info.y - centerY;
        let disHeight = Math.abs(info.y - centerY);

        let offsetY = Math.abs(disHeight - StageReferance.stageHeight / 2);
        // 检测物体在屏幕中心上方
        if (dir < 0) {
          if (
            disHeight >
            StageReferance.stageHeight / 2 +
              (curRect.height - Math.abs(curRect.y))
          ) {
            b = true;
          }
        } else {
          // 检测物体在屏幕中心下方
          if (
            disHeight >
            StageReferance.stageHeight / 2 + Math.abs(curRect.y)
          ) {
            b = true;
          }
        }
      }
    }
    return b;
  }
}
