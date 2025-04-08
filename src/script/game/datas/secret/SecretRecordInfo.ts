// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 10:07:37
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-19 15:24:49
 * @Description: 秘境记录信息  服务器信息
 */


import { SecretType } from "./SecretConst";

export class SecretRecordInfo {
    type: SecretType;       //秘境类型
    secretId: number = 0;   //秘境id
    maxLayer: number = 0;   //通过最大层数
    
    constructor(type: SecretType) {
        this.type = type
    }
}