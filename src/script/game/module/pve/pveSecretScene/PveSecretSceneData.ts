// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-02-28 12:22:13
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-20 10:29:01
 * @Description: 
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_secretData } from "../../../config/t_s_secret";
import { ConfigType } from "../../../constant/ConfigDefine";
import { SecretInfo } from "../../../datas/secret/SecretInfo";
import SecretModel from "../../../datas/secret/SecretModel";
import { CampaignManager } from "../../../manager/CampaignManager";
import { SecretManager } from "../../../manager/SecretManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FrameDataBase from "../../../mvc/FrameDataBase";

export default class PveSecretSceneData extends FrameDataBase {
    static EventOptCnt = 3;
    static ReviveConsumeCnt = 5;
    cfg: t_s_secretData;
    secretInfo: SecretInfo;
    lostTreasureList: [];
    gainTreasureList: [];

    show() {
        super.show();
  
        let secretId = CampaignManager.Instance.mapId
        let scereType = SecretModel.getScereType(secretId)
        this.secretInfo = SecretManager.Instance.model.getSecretInfo(scereType)
        this.cfg = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secret, secretId) as t_s_secretData

        this.initReviveConsumeCnt()
        SecretManager.Instance.test();
    }

    hide() {
        super.hide();
        this.secretInfo = null;
    }

    getOwnTresureCnt(id: number) {
        // return 0

        let cnt = 0
        if (!this.secretInfo) return cnt
        for (let index = 0; index < this.secretInfo.treasureInfoList.length; index++) {
            const info = this.secretInfo.treasureInfoList[index];
            if (info.templateId == id) {
                cnt = info.count
                break
            }
        }

        return cnt
    }

    initReviveConsumeCnt() {
        let Cfg = TempleteManager.Instance.getConfigInfoByConfigName("Secret_Live");
        if (Cfg && Cfg.ConfigValue) {
            PveSecretSceneData.ReviveConsumeCnt = Number(Cfg.ConfigValue);
        }
    }

    dispose() {
        super.dispose();
    }
}