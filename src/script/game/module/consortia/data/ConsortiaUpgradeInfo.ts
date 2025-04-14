//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-21 20:52:11
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-22 11:11:46
 * @Description:
 */

import { t_s_consortialevelData } from "../../../config/t_s_consortialevel";
import { TempleteManager } from "../../../manager/TempleteManager";

export class ConsortiaUpgradeInfo {
  constructor(index?: number, type?: number, grade?: number) {
    this.index = index;
    this.type = type;
    this.grade = grade;
  }
  public index: number;
  public type: number;
  public grade: number;
  public get templete(): t_s_consortialevelData {
    return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
      this.type,
      this.grade,
    );
  }
}
