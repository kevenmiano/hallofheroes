/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 16:30:53
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-08 11:55:29
 * @Description: 
 */
import ConfigMgr from "../../core/config/ConfigMgr";
import LangManager from "../../core/lang/LangManager";
import { ConfigType } from "../constant/ConfigDefine";
import { SecretEventOptType } from "../module/pve/pveSecretScene/model/SecretEventOptType";
import t_s_baseConfigData from "./t_s_baseConfigData";
import { t_s_secrettreasureData } from "./t_s_secrettreasure";

/*
* t_s_secretoption
*/
export default class t_s_secretoption {
        public mDataList: t_s_secretoptionData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_secretoptionData(list[i]));
                }
        }
}

export class t_s_secretoptionData extends t_s_baseConfigData {
        // 选项类型
        public Type: number = 0;
        // 选项ID
        public OptionId: number = 0;
        // 掉落类型，1为物品，2为秘宝，0无掉落
        public DropType: number = 0;
        // dropid，用于在dropitem随机，结果可为多个
        public DropId: number = 0;
        public Param1: string = "";
        public Param2: string = "";
        public Param3: string = "";

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        // Type	条件                    选项主文字              选项副文字
        // 0	——                      前往下一层               ——
        // 1	P1为空                  开始战斗                 ——
        // 1	P1不为空                使用[P1秘宝名称]        [P1秘宝描述]
        // 2	P2/P3均为空             获得[P1秘宝名称]        [P1秘宝描述]
        // 2	P2/P3有一个不为空       换取[P1秘宝名称]        交出[P2/P3秘宝名称]
        // 2	P2/P3均不为空           合成[P1秘宝名称]        消耗[P2秘宝名称], [P3秘宝名称]
        get optionName(): [string, string] {
                let mainStr = ""
                let viceStr = ""
                switch (this.Type) {
                        case SecretEventOptType.Next:
                                mainStr = LangManager.Instance.GetTranslation("Pve.secretScene.goToNextlevel")
                                break;
                        case SecretEventOptType.Battle:
                                if (this.Param1) {
                                        let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secrettreasure, this.Param1) as t_s_secrettreasureData
                                        mainStr = LangManager.Instance.GetTranslation("Pve.secretScene.use", temp.TemplateNameLang, temp.profileColor)
                                        viceStr = temp.DescriptionLang
                                } else {
                                        mainStr = LangManager.Instance.GetTranslation("public.battle.startBattle")
                                }
                                break;
                        case SecretEventOptType.Tresure:
                                let temp1 = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secrettreasure, this.Param1) as t_s_secrettreasureData
                                let temp2 = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secrettreasure, this.Param2) as t_s_secrettreasureData
                                let temp3 = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secrettreasure, this.Param3) as t_s_secrettreasureData

                                if (this.Param2 == "" && this.Param3 == "") {
                                        mainStr = LangManager.Instance.GetTranslation("Pve.secretScene.gain", temp1.TemplateNameLang, temp1.profileColor)
                                        viceStr = temp1.DescriptionLang
                                } else if (this.Param2 != "" && this.Param3 != "") {
                                        mainStr = LangManager.Instance.GetTranslation("Pve.secretScene.composite", temp1.TemplateNameLang, temp1.profileColor)
                                        viceStr = LangManager.Instance.GetTranslation("Pve.secretScene.consume", temp2.TemplateNameLang, temp3.TemplateNameLang)
                                } else {
                                        let handName = ""
                                        if (this.Param2) {
                                                handName = temp2.TemplateNameLang
                                        } else if (this.Param3) {
                                                handName = temp3.TemplateNameLang
                                        }
                                        mainStr = LangManager.Instance.GetTranslation("Pve.secretScene.swap", temp1.TemplateNameLang, temp1.profileColor)
                                        viceStr = LangManager.Instance.GetTranslation("Pve.secretScene.handOver", handName)
                                }
                                break;
                }
                return [mainStr, viceStr]
        }
}
