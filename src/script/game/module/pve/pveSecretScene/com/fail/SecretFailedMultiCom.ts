// @ts-nocheck
import FUI_SecretFailedMultiCom from "../../../../../../../fui/PveSecretScene/FUI_SecretFailedMultiCom";
import LangManager from "../../../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../../../component/SimpleAlertHelper";
import { PayType } from "../../../../../constant/Const";
import { SecretInfo } from "../../../../../datas/secret/SecretInfo";
import { SecretManager } from "../../../../../manager/SecretManager";
import PveSecretSceneData from "../../PveSecretSceneData";

/*
 * @Author: jeremy.xu
 * @Date: 2024-02-26 17:41:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-16 18:33:48
 * @Description: 多人秘境失败视图
 */
export class SecretFailedMultiCom extends FUI_SecretFailedMultiCom {
    private _info: SecretInfo;
    get info(): SecretInfo {
        return this._info;
    }

    set info(value: SecretInfo) {
        this._info = value;
        if (value) {
            this.txtFailedTitle.text = LangManager.Instance.GetTranslation("Pve.secretScene.failedTip")
            this.btnGiveUp.getChild("mainTitle").text = LangManager.Instance.GetTranslation("public.giveup")
            this.btnAgain.getChild("mainTitle").text = LangManager.Instance.GetTranslation("public.tryAgain")
            this.btnAgain.getChild("viceTitle").text = LangManager.Instance.GetTranslation("public.consumeDiamond", PveSecretSceneData.ReviveConsumeCnt)
        } else {

        }
    }

    protected onConstruct() {
        super.onConstruct()
        this.btnGiveUp.onClick(this, this.btnGiveUpClick)
        this.btnAgain.onClick(this, this.btnAgainClick)
    }

    btnGiveUpClick() {
        let str = LangManager.Instance.GetTranslation("Pve.secretScene.tip.giveup")
        SimpleAlertHelper.Instance.ShowSimple(SimpleAlertHelper.SIMPLE_ALERT, null, str, (b: boolean) => {
            if (b) {
                SecretManager.Instance.sendGiveUp(this._info.secretId)
            }
        })
    }

    btnAgainClick() {
        let str = LangManager.Instance.GetTranslation("Pve.secretScene.tip.revive", PveSecretSceneData.ReviveConsumeCnt)
        SimpleAlertHelper.Instance.ShowSimple(SimpleAlertHelper.USEBINDPOINT_ALERT, null, str, (b: boolean, flag: boolean) => {
            if (b) {
                SecretManager.Instance.sendReviver(this._info.secretId, flag ? PayType.BindDiamond : PayType.Diamond)
            }
        })
    }
}