/*
 * @Author: jeremy.xu
 * @Date: 2021-11-25 14:27:26
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-11-25 17:54:45
 * @Description:
 */

import { SocketManager } from "../../../core/net/SocketManager";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";

//@ts-expect-error: External dependencies
import LockAndUnlockMsg = com.road.yishi.proto.player.LockAndUnlockMsg;

//@ts-expect-error: External dependencies
import VicePasswordMsg = com.road.yishi.proto.player.VicePasswordMsg;

export class VicePasswordUtil {
  /**
   * 1 验证密码
   */
  public static CHECK_PW: number = 1;
  /**
   * 2 设置密码
   */
  public static SET_PW: number = 2;
  /**
   * 3 修改密码
   */
  public static CHANGE_PW: number = 3;
  /**
   * 4 重置密码
   */
  public static RESET_PW: number = 4;
  /**
   * 操作成功后回调
   */
  public static recall: Function;
  /**
   * 操作成功后回调参数
   */
  public static params: any[];

  /**
   * 二级密码操作
   * @param type1 验证密码  2 设置密码  3 修改密码   4 重置密码
   * @param newNum新密码
   * @param newNum2新密码确认
   * @param oldNum旧密码
   *
   */
  public static vpOp(
    type: number,
    newNum: string = "0",
    newNum2: string = "0",
    oldNum: string = "0",
  ): void {
    var msg: VicePasswordMsg = new VicePasswordMsg();
    msg.opType = type;
    msg.prePass = oldNum;
    msg.inputPass = newNum;
    msg.newPass = newNum2;
    SocketManager.Instance.send(C2SProtocol.C_VICEPASSWORD, msg);
  }

  /**
   * 锁定和解锁操作
   * @param type 1背包物品加解锁  2英灵加解锁   3 装备加解锁 4 背包的荣誉 5 珍宝包  6 怪怪加锁
   * @param itemPos背包物品位置
   * @param petId英灵id
   *
   */
  public static vpLockOp(
    type: number,
    itemPos: number = 0,
    petId: number = 0,
  ): void {
    var msg: LockAndUnlockMsg = new LockAndUnlockMsg();
    msg.opType = type;
    msg.itemPos = itemPos;
    msg.petId = petId;
    SocketManager.Instance.send(C2SProtocol.C_LOCK_OR_UNLOCK, msg);
  }

  /**
   *
   * @param str
   * @return true: 符合要求；false:不符合要求
   *
   */
  public static strCheck(str: string): boolean {
    //判断是否为6位数字
    var pattern: RegExp = /^\d{6}$/;
    var numP: RegExp = /^[0-9]*$/;
    if (numP.test(str) == true) {
      if (pattern.test(str) == true) {
        //6个数字
        return true;
      } else {
        //没有6个或多于6个
        return false;
      }
    } else {
      //含有非数字
      return false;
    }
  }

  /**
   *
   * @param str
   * @return 0: 6个数字符合；1: 含有非数字；2: 超过6位数字；3: 小于6个数字
   *
   */
  public static numCheck(str: string): number {
    //判断是否为6位数字
    var pattern: RegExp = /^\d{6}$/;
    var moreThan6: RegExp = /^\d{7,}$/;
    var numP: RegExp = /^[0-9]*$/;
    if (numP.test(str) == true) {
      if (pattern.test(str) == true) {
        //6个数字
        return 0;
      } else if (moreThan6.test(str) == true) {
        //没有6个或多于6个
        return 2;
      } else return 3;
    } else {
      //含有非数字
      return 1;
    }
  }

  /**
   *
   * @param str
   * @return 0: 6个数字符合；1: 含有非数字；2: 超过6位数字；3: 小于6个数字
   *
   */
  public static numCheckSame(str: string): boolean {
    //判断是否为6位相同数字
    var pattern: RegExp = /^(\d)\1{5}$/;
    if (pattern.test(str) == true) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param str
   * @return 0: 6个数字符合；1: 含有非数字；2: 超过6位数字；3: 小于6个数字
   *
   */
  public static numCheckContinuity(str: string): boolean {
    //判断是否为6位连续
    var pattern: RegExp =
      /^(012345|123456|234567|345678|456789|987654|876543|765432|654321|543210)$/;
    if (pattern.test(str) == true) {
      return true;
    }
    return false;
  }
}
