/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2024-04-19 16:02:56
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { SecretType } from "./SecretConst";
import { SecretInfo } from "./SecretInfo";
import { SecretRecordInfo } from "./SecretRecordInfo";

export default class SecretModel {
    /** 配置表配置的是 Type */
    static TypyKey = "Type"
    /** 服务器信息同步 */
    private _secretInfoMap: Map<SecretType, SecretInfo> = new Map();
    /** 未通关的秘境层数记录 */
    private _maxSecretRecordInfoMap: Map<SecretType, SecretRecordInfo> = new Map();
    lostTreasure:string;
    gainTreasure: string;
    
    

    constructor() {
        this._secretInfoMap.set(SecretType.Single, new SecretInfo(SecretType.Single))
        // this._secretInfoMap.set(SecretType.Multi, new SecretInfo(SecretType.Multi))
        // this._secretInfoMap.set(SecretType.PetSingle, new SecretInfo(SecretType.PetSingle))
        
        this._maxSecretRecordInfoMap.set(SecretType.Single, new SecretRecordInfo(SecretType.Single))
    }

    getSecretInfo(type: SecretType): SecretInfo {
        return this._secretInfoMap.get(type);
    }

    getMaxSecretRecordInfo(type: SecretType): SecretRecordInfo {
        return this._maxSecretRecordInfoMap.get(type);
    }

    /** 按类型获取配置表需要转换下类型 */
    static transSecretType2CfgType(type: SecretType): string {
        return SecretModel.TypyKey + type;
    }

    static getScereType(secretId: number) {
        let scereType
        if (WorldBossHelper.checkSecret(secretId)) {
            scereType = SecretType.Single
        } else if (WorldBossHelper.checkMultiSecret(secretId)) {
            scereType = SecretType.Multi
        } else if (WorldBossHelper.checkPetSecret(secretId)) {
            scereType = SecretType.PetSingle
        }
        return scereType
    }

    dispose() {

    }
}