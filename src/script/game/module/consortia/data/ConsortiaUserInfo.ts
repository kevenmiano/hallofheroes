//@ts-expect-error: External dependencies
import { ClassFactory } from "../../../../core/utils/ClassFactory";

/**
 * 公会用户数据
 * @author yuanzhan.yu
 */
export class ConsortiaUserInfo {
  /**
   * consortiaId
   */
  public consortiaId: number = 0;

  /**
   * userId
   */
  public userId: number = 0;

  /**
   * nickName
   */
  public nickName: string;

  /**
   * ratifierUserId
   */
  public ratifierUserId: number = 0;

  /**
   * ratifierNickName
   */
  public ratifierNickName: string;

  /**
   * dutyID
   */
  public dutyID: number = 0;

  /**
   * isExist
   */
  public isExist: boolean;

  public dayOffer: number = 0;

  private _lastDate: object;

  public totalOffer: number = 0;

  public todayOffer: number = 0;
  public altarCount: number = 0;
  public lastAltarDate: object;

  constructor() {}

  public get lastDate(): object {
    return this._lastDate;
  }

  public set lastDate(value: object) {
    this._lastDate = ClassFactory.copyDateType(value);
  }
}
