import FUI_ArtifactCell from "../../../../../../fui/Base/FUI_ArtifactCell";
import LangManager from "../../../../../core/lang/LangManager";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import Utils from "../../../../../core/utils/Utils";
import { t_s_petartifactpropertyData } from "../../../../config/t_s_petartifactproperty";
import { CommonConstant } from "../../../../constant/CommonConstant";
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import { GoodsCheck } from "../../../../utils/GoodsCheck";
/**
 * 神器项
 */
export default class ArtifactCell extends FUI_ArtifactCell{
    private _goodsInfo: GoodsInfo;
    private _templateData: t_s_petartifactpropertyData;
     //0重铸左边格子 1重铸右边格子 2 背包已鉴定 3背包未鉴定 4英灵界面未鉴定 5英灵界面已经鉴定未装备 6英灵界面已装备
    private _type:number = 0;
    tipData: any;
    tipType: EmWindow;
    alphaTest: boolean = true;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    protected onConstruct() {
        super.onConstruct();
        Utils.setDrawCallOptimize(this);
        this.descTxt.text = LangManager.Instance.GetTranslation("ArtifactCell.descTxt2");
    }

    public set selectType(value:number){
        this.isSelect.selectedIndex = value;
    }

    public set type(value:number){
        this._type = value;
    }

    public get info():GoodsInfo{
        return this._goodsInfo;
    }

    public set info(goodsInfo: GoodsInfo) {
        this._goodsInfo = goodsInfo;
        if (this._goodsInfo) {
            ToolTipsManager.Instance.register(this);
            this.tipType = EmWindow.ArtifactTips;
            this.tipData = [this._goodsInfo,this._type];
            this.goodsIcon.icon = IconFactory.getGoodsIconByTID(this._goodsInfo.templateId);
            this._templateData = TempleteManager.Instance.getArtifactTemplate(this._goodsInfo.templateId);
            if(this._templateData){
                this.levelTxt.text = LangManager.Instance.GetTranslation("public.level3",this._templateData.Level);
            }
            this.isIdentify.selectedIndex = GoodsCheck.hasIdentify(this._goodsInfo) ? 1 : 0;
            this.c1.selectedIndex = 2;
            let res = CommonConstant.QUALITY_RES[this._goodsInfo.templateInfo.Profile-1];
            this.goodsIcon.icon = IconFactory.getGoodsIconByTID(this._goodsInfo.templateInfo.TemplateId);
            this.profile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);
        } else {
            ToolTipsManager.Instance.unRegister(this);
            this.c1.selectedIndex = 3;
            this.goodsIcon.icon = "";
            this.levelTxt.text = "";
            this.profile.icon = "";
            this.isIdentify.selectedIndex = 1;
        }
    }

    public dispose() {
        super.dispose();
    }
}