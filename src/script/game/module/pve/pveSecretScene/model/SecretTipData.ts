//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2024-03-07 18:25:15
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-20 16:55:41
 * @Description: 失去、获得、通关提示页面数据
 */

import { SecretType } from "../../../../datas/secret/SecretConst";
import { SecretItemInfo as SecretItemInfo } from "../../../../datas/secret/SecretItemInfo";

export class SecretTipData {
  type: SecretType;
  secretId: number;
  infoList: SecretItemInfo[] = [];
  constructor(secretId: number, infoList: SecretItemInfo[]) {
    this.secretId = secretId;
    this.infoList = infoList;
  }
}
