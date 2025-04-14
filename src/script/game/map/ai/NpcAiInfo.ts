import { AiEvents } from "../../constant/event/NotificationEvent";
import AIBaseInfo from "./AIBaseInfo";
/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-12-07 11:32
 */
export default class NpcAiInfo extends AIBaseInfo {
  private _centerPoint: Laya.Point;
  private _nextPoint: Laya.Point;
  private _attackArmyId: number = 0;
  private _attackArmyServerName: string;

  public get attackArmyServerName(): string {
    return this._attackArmyServerName;
  }

  public set attackArmyServerName(value: string) {
    this._attackArmyServerName = value;
  }

  public get attackArmyId(): number {
    return this._attackArmyId;
  }

  public set attackArmyId(value: number) {
    this._attackArmyId = value;
  }

  public get nextPoint(): Laya.Point {
    return this._nextPoint;
  }

  public set nextPoint(value: Laya.Point) {
    this._nextPoint = value;
    this.dispatchEvent(AiEvents.UPDATE_NEXT_POINT, value);
  }

  public get centerPoint(): Laya.Point {
    return this._centerPoint;
  }

  public set centerPoint(value: Laya.Point) {
    this._centerPoint = value;
    this.dispatchEvent(AiEvents.UPDATE_CENTER_POINT, value);
  }
}
