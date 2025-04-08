// @ts-nocheck
import FUI_GvgInfoView from "../../../../../../fui/Consortia/FUI_GvgInfoView";
import LangManager from "../../../../../core/lang/LangManager";
import { t_s_campaignbufferData } from "../../../../config/t_s_campaignbuffer";
import { EmPackName } from "../../../../constant/UIDefine";
import { CampaignEvent } from "../../../../constant/event/NotificationEvent";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { GvgMapModel } from "../../model/GvgMapModel";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/27 20:02
 * @ver 1.0
 */
export class GvgInfoView extends FUI_GvgInfoView {
    private _gvgMapModel: GvgMapModel;
    private _countDown: number;

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();

        this._gvgMapModel = CampaignManager.Instance.gvgModel;
        this._gvgMapModel.addEventListener(CampaignEvent.UPDATE_GVG_INFO, this.__updateViewHandler, this);
        this.__updateViewHandler();
        this.initView();
    }

    private initView() {
    }

    private __updateViewHandler() {
        if (!this._gvgMapModel.selfConsortiaName) {
            return;
        }
        this._selfNameTxt.text = this._gvgMapModel.selfConsortiaName;
        this._selfOccupyNumTxt.text = this._gvgMapModel.selfGuardCount + "";
        this._selfScoreTxt.text = LangManager.Instance.GetTranslation("answer.view.rank.score") + ": " + this._gvgMapModel.selfScore;

        let arr: t_s_campaignbufferData[] = TempleteManager.Instance.getBufferTemplateByType(29);
        if (!arr) {
            return;
        }
        let cbinfo: t_s_campaignbufferData;
        for (let i = 0, len = arr.length; i < len; i++) {
            const binfo = arr[i];
            if (binfo.Grades == this._gvgMapModel.selfGuardCount + 1) {
                cbinfo = binfo;
                break;
            }
        }
        this.updateBuff(1, cbinfo);

        this._targetNameTxt.text = this._gvgMapModel.enemyConsortiaName;
        this._targetOccupyNumTxt.text = this._gvgMapModel.enemyGuardCount + "";
        this._targetScoreTxt.text = LangManager.Instance.GetTranslation("answer.view.rank.score") + ": " + this._gvgMapModel.enemyScore;

        for (let i = 0, len = arr.length; i < len; i++) {
            const binfo = arr[i];
            if (binfo.Grades == this._gvgMapModel.enemyGuardCount + 1) {
                cbinfo = binfo;
                break;
            }
        }
        this.updateBuff(2, cbinfo);
    }

    public updateBuff(tar: number, buffinfo: t_s_campaignbufferData): void {
        if (buffinfo == null) {
            return;
        }
        if (tar == 1) {
            this._buffTxt1.text = Math.abs(buffinfo.Attack) + "%";
            if (buffinfo.Attack == 0) {
                this._buffIcon1.visible = false;
            }
            else if (buffinfo.Attack > 0) {
                this._buffIcon1.visible = true;
                this._buffIcon1.icon = fgui.UIPackage.getItemURL(EmPackName.Base, "Img_Arrow_Green");
            }
            else if (buffinfo.Attack < 0) {
                this._buffIcon1.visible = true;
                this._buffIcon1.icon = fgui.UIPackage.getItemURL(EmPackName.Base, "Img_Arrow_red");
            }
            // tipData = buffinfo.Description;
        }
        else {
            this._buffTxt2.text = Math.abs(buffinfo.Attack) + "%";
            if (buffinfo.Attack == 0) {
                this._buffIcon2.visible = false;
            }
            else if (buffinfo.Attack > 0) {
                this._buffIcon2.visible = true;
                this._buffIcon2.icon = fgui.UIPackage.getItemURL(EmPackName.Base, "Img_Arrow_Green");
            }
            else if (buffinfo.Attack < 0) {
                this._buffIcon2.visible = true;
                this._buffIcon2.icon = fgui.UIPackage.getItemURL(EmPackName.Base, "Img_Arrow_red");
            }
            // tipData = buffinfo.Description;
        }
    }




    dispose() {
        this._gvgMapModel.removeEventListener(CampaignEvent.UPDATE_GVG_INFO, this.__updateViewHandler, this);
        this._gvgMapModel = null;
        super.dispose();
    }
}