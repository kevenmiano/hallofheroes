// @ts-nocheck
import ConfigMgr from "../../../core/config/ConfigMgr";
import { t_s_secrettreasureData } from "../../config/t_s_secrettreasure";
import { ConfigType } from "../../constant/ConfigDefine";

/*
 * @Author: jeremy.xu
 * @Date: 2024-03-12 12:25:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-13 10:29:41
 * @Description: 秘宝信息
 */
export class SecretTresureInfo {
    count: number = 0;
    template:t_s_secrettreasureData
    private _templateId: number = 0;
    set templateId(v:number){
        this._templateId = v
        this.template = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secrettreasure, v)
    }
    get templateId(): number{
        return this._templateId
    }

    constructor(id?: number) {
        this.templateId = id
    }
}