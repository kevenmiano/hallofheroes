// @ts-nocheck
import FUI_SecretGainTipCom from "../../../../../../../fui/PveSecretScene/FUI_SecretGainTipCom";
import LangManager from "../../../../../../core/lang/LangManager";
import { SecretType } from "../../../../../datas/secret/SecretConst";
import { SecretManager } from "../../../../../manager/SecretManager";
import { SecretTipData } from "../../model/SecretTipData";
import SecretItem from "../SecretItem";

/*
 * @Author: jeremy.xu
 * @Date: 2024-02-26 17:41:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-20 10:29:48
 * @Description: 获得提示视图
 */
export class SecretGainTipCom extends FUI_SecretGainTipCom {
    private _type: SecretType;
    get type(): SecretType {
        return this._type;
    }

    set type(value: SecretType) {
        this._type = value;

    }

    private _info: SecretTipData;
    get info(): SecretTipData {
        return this._info;
    }

    set info(value: SecretTipData) {
        this._info = value;
        if (value) {
            this.list.numItems = this._info.infoList.length
        } else {

        }
    }

    protected onConstruct() {
        super.onConstruct()
        this.txtTitle.text = LangManager.Instance.GetTranslation("Pve.secretScene.title.gain")
        this.btnNext.text = LangManager.Instance.GetTranslation("public.nextLevel")
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderItem, null, false)
        this.btnNext.onClick(this, this.btnNextClick)
    }

    protected onRenderItem(index: number, item: SecretItem) {
        let info = this._info.infoList[index]
        item.info = info
    }

    private btnNextClick() {
        let secreInfo = SecretManager.Instance.model.getSecretInfo(SecretType.Single)
        SecretManager.Instance.sendGotoNext(this._info.secretId, secreInfo.curLayer)
    }
}