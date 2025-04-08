// @ts-nocheck
import FUI_SinglePassCardItem from "../../../../../fui/SinglePass/FUI_SinglePassCardItem";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { t_s_campaigndataData } from "../../../config/t_s_campaigndata";
import { TempleteManager } from "../../../manager/TempleteManager";
import FUIHelper from "../../../utils/FUIHelper";
import SinglePassModel from "../SinglePassModel";
import { UIFilter } from '../../../../core/ui/UIFilter';
import LangManager from '../../../../core/lang/LangManager';
import SinglePassCardInfo from "../model/SinglePassCardInfo";
import SinglePassBossRewardData from "../model/SinglePassBossRewardData";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import SinglePassManager from "../../../manager/SinglePassManager";

export default class SinglePassCardItem extends FUI_SinglePassCardItem {
    private _info: SinglePassCardInfo;
    private _index: number;
    private _selected: boolean = false;
    constructor() {
        super();
    }

    public set index(value: number) {
        this._index = value;
    }

    public get index(): number {
        return this._index;
    }

    public set selected(flag: boolean) {
        this.lightBg.visible = flag;
    }

    protected onConstruct() {
        super.onConstruct();

        this.addEvent();
        this.gradeBg.visible = false;
        this.judge.visible = false;
    }

    public get info(): SinglePassCardInfo {
        return this._info;
    }

    private addEvent() {
        this.getReward.onClick(this, this.getRewardHandler);
    }

    private removeEvent() {
        this.getReward.offClick(this, this.getRewardHandler);
    }

    private getRewardHandler(e: Laya.Event) {
        e.stopPropagation();
    }

    public set info(value: SinglePassCardInfo) {
        this._info = value;
        UIFilter.gray(this);
        if (this._info && this._info.judge != SinglePassModel.TEST_VALUE) {
            if (this._info.tollgate > SinglePassManager.Instance.model.maxIndex + 1) {
                UIFilter.gray(this);
            }
            else {
                UIFilter.normal(this);
            }
            this.playerIcon.visible = true;
            this.playerIcon.url = IconFactory.getGodArriveBossIcon(SinglePassModel.CAMPAIGN_TEMPLATE_ID, this._info.tollgate);
            this.gradeTxt.text = LangManager.Instance.GetTranslation("SinglePassCardItem.gradeTxt", this._index);
            var campaigndataData: t_s_campaigndataData = TempleteManager.Instance.getGodArriveData(SinglePassModel.CAMPAIGN_TEMPLATE_ID, this._info.tollgate);
            this.guardCtr.selectedIndex = parseInt(campaigndataData.Param5) - 1;
            this.bg.visible = true;
            this.titleBg.visible = true;
            this.guardGroup.visible = true;
            this.getReward.visible = true;
            let drops1: SinglePassBossRewardData = TempleteManager.Instance.getSinglePassBossReward(0, this._info.tollgate);
            let drops2: SinglePassBossRewardData = TempleteManager.Instance.getSinglePassBossReward(2, this._info.tollgate);
            let goodsTemplateInfo: t_s_itemtemplateData;
            let str: string;
            if (this.showJudge) {
                this.gradeBg.visible = true;
                this.judge.visible = true;
                this.judge.url = this.getJudgeUrl(this._info.judge);
                str = LangManager.Instance.GetTranslation("singlepass.view.SinglePassCardItemView.TipsTxt02") + "<br>";
                let item: GoodsInfo;
                if (drops1) {
                    for (let i = 0; i < drops2.goodsInfoArr.length; i++) {
                        item = drops2.goodsInfoArr[i];
                        str = str + "<br>";
                        goodsTemplateInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(item.templateId);
                        str += goodsTemplateInfo.TemplateNameLang + "*" + item.count;
                    }
                }
                FUIHelper.setTipData(
                    this.getReward,
                    EmWindow.CommonTips,
                    str,
                )
            }
            else {
                this.gradeBg.visible = false;
                this.judge.visible = false;

                let str = LangManager.Instance.GetTranslation("singlepass.view.SinglePassCardItemView.TipsTxt01") + "<br>";
                let item: GoodsInfo;
                if (drops1) {
                    for (let i = 0; i < drops1.goodsInfoArr.length; i++) {
                        item = drops1.goodsInfoArr[i];
                        str = str + "<br>";
                        goodsTemplateInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(item.templateId);
                        str += goodsTemplateInfo.TemplateNameLang + "*" + item.count;
                    }
                }
                str = str + "<br>";
                str += LangManager.Instance.GetTranslation("singlepass.view.SinglePassCardItemView.TipsTxt02") + "<br>";
                if (drops2) {
                    for (let i = 0; i < drops2.goodsInfoArr.length; i++) {
                        item = drops2.goodsInfoArr[i];
                        str = str + "<br>";
                        goodsTemplateInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(item.templateId);
                        str += goodsTemplateInfo.TemplateNameLang + "*" + item.count;
                    }
                }
                FUIHelper.setTipData(
                    this.getReward,
                    EmWindow.CommonTips,
                    str,
                )
            }
        }
        else {
            this.gradeBg.visible = false;
            this.judge.visible = false;
            this.playerIcon.visible = false;
            this.bg.visible = false;
            this.gradeTxt.text = "";
            this.titleBg.visible = false;
            this.guardGroup.visible = false;
            this.getReward.visible = false;
            this.effect.selectedIndex = 0;
        }
    }

    private get showJudge(): boolean {
        if (this._info && this._info.judge != 0) {
            return true;
        }
        return false;
    }

    getJudgeUrl(judge: number): string {
        let urlStr: string;
        switch (judge) {
            case 1:
                urlStr = FUIHelper.getItemURL("Base", "Lab_D_L");
                break;
            case 2:
                urlStr = FUIHelper.getItemURL("Base", "Lab_C_L");
                break;
            case 3:
                urlStr = FUIHelper.getItemURL("Base", "Lab_B_L");
                break;
            case 4:
                urlStr = FUIHelper.getItemURL("Base", "Lab_A_L");
                break;
            case 5:
                urlStr = FUIHelper.getItemURL("Base", "Lab_S_L");
                break;

        }
        return urlStr;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}