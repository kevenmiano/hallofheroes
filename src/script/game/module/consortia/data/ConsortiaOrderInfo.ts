//@ts-expect-error: External dependencies
import { ClassFactory } from "../../../../core/utils/ClassFactory";

/**
 * 公会排名数据
 * @author yuanzhan.yu
 */
export class ConsortiaOrderInfo {
  /**
   * consortiaID
   */
  public consortiaID: number = 0;

  /**
   * gradeOrder
   */
  public gradeOrder: number = 0;

  /**
   * fightPowerOrder
   */
  public fightPowerOrder: number = 0;

  /**
   * offer
   */
  public offer: number = 0;

  /**
   * lastDayOffer
   */
  public lastDayOffer: number = 0;

  private _lastDayDate: object;

  /**
   * lastDayOrder
   */
  public lastDayOrder: number = 0;

  /**
   * lastWeekOffer
   */
  public lastWeekOffer: number = 0;

  private _lastWeekDate: object;

  /**
   * lastWeekOrder
   */
  public lastWeekOrder: number = 0;

  constructor() {}

  /**
   * lastDayDate
   */
  public get lastDayDate(): object {
    return this._lastDayDate;
  }

  /**
   * @private
   */
  public set lastDayDate(value: object) {
    if (this._lastDayDate instanceof Date) {
      this._lastDayDate = value;
    } else {
      this._lastDayDate = ClassFactory.copyDateType(value);
    }
  }

  /**
   * lastWeekDate
   */
  public get lastWeekDate(): object {
    return this._lastWeekDate;
  }

  /**
   * @private
   */
  public set lastWeekDate(value: object) {
    if (this._lastWeekDate instanceof Date) {
      this._lastWeekDate = value;
    } else {
      this._lastWeekDate = ClassFactory.copyDateType(value);
    }
  }
}
