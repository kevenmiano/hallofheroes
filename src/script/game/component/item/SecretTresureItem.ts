import FUI_SecretTresureItem from "../../../../fui/Base/FUI_SecretTresureItem";
import Logger from "../../../core/logger/Logger";
import { CommonConstant } from "../../constant/CommonConstant";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { SecretTresureInfo } from "../../datas/secret/SecretTresureInfo";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../tips/ITipedDisplay";
import FUIHelper from "../../utils/FUIHelper";

/*
 * @Author: jeremy.xu
 * @Date: 2024-03-12 12:28:24
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-26 15:05:05
 * @Description: 秘宝
 */
export default class SecretTresureItem extends FUI_SecretTresureItem implements ITipedDisplay {
    tipType: EmWindow = EmWindow.SecretTresureTip;
    tipData: any;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    
    public showName: boolean = true;
    private _info: SecretTresureInfo;

    get info(): SecretTresureInfo {
        return this._info;
    }

    set info(value: SecretTresureInfo) {
        this._info = value
        this.txtName.visible = this.showName
        if (value) {
            if (value.template) {
                this.txtTitle.visible = value.count > 1
                this.txtTitle.text = value.count.toString()
                this.icon = value.template.iconPath
                this.profile.url = value.template.profilePath
                this.txtName.text = value.template.TemplateNameLang
                this.txtName.color = value.template.profileColor
                this.tipData = value
                ToolTipsManager.Instance.register(this)
            } else {
                Logger.error("[SecretTresureItem]配置表模板不存在", value.templateId)
            }
        } else {
            this.txtTitle.visible = false
            this.icon = ""
            ToolTipsManager.Instance.unRegister(this)
        }
    }

    dispose() {
        super.dispose();
    }
}