// @ts-nocheck
import FUI_SmallMapTreasureItem from "../../../../../fui/OuterCity/FUI_SmallMapTreasureItem";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import Utils from "../../../../core/utils/Utils";
import { t_s_herotemplateData } from "../../../config/t_s_herotemplate";
import { t_s_mapphysicpositionData } from "../../../config/t_s_mapphysicposition";
import ColorConstant from "../../../constant/ColorConstant";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import TreasureInfo from "../../../map/data/TreasureInfo";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import FUIHelper from "../../../utils/FUIHelper";
/**
 * 小地图上面的宝藏矿脉显示
 */
export default class SmallMapTreasureItem extends FUI_SmallMapTreasureItem {
    private _info: TreasureInfo;
    tipData: any;
    tipType: EmWindow;
    alphaTest: boolean = true;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
        Utils.setDrawCallOptimize(this);
    }

    private initEvent() {
        this.onClick(this, this.infoHandler);
    }

    private removeEvent() {
        this.offClick(this, this.infoHandler);
    }

    private infoHandler() {

    }

    public set info(value: TreasureInfo) {
        if (value) {
            this._info = value;
            this.refreshView();
            ToolTipsManager.Instance.register(this);
            this.tipType = EmWindow.OuterCityMapTreasureTips;
            this.tipData = this._info;
        }
        else {
            this.consortiaNameTxt.text = "";
            this.treasureNameTxt.text = "";
            this.iconLoader.url = "";
            ToolTipsManager.Instance.unRegister(this);
            this.tipData = null;
        }
    }

    private refreshView() {
        if (this._info) {
            let tempInfo: t_s_mapphysicpositionData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapphysicposition, this._info.templateId);
            if (tempInfo) {
                if (tempInfo.Type == 1) {
                    this.iconLoader.url = FUIHelper.getItemURL(EmWindow.OuterCity,"Icon_Ore_M");
                } else {
                    this.iconLoader.url = FUIHelper.getItemURL(EmWindow.OuterCity,"Icon_Ore_L");
                }
                this.treasureNameTxt.text = tempInfo.NameLang;
                if (this._info.info.occupyLeagueName == "") {//占领的公会信息无
                    this.consortiaNameTxt.text = "";
                } else {
                    this.consortiaNameTxt.text = "<"+this._info.info.occupyLeagueName+">";
                }
                if(this.outerCityModel.checkIsSameConsortiaByName(this._info.info.occupyLeagueName)){
                    this.consortiaNameTxt.color = ColorConstant.GREEN_COLOR;
                }
                else{
                    this.consortiaNameTxt.color = ColorConstant.RED_COLOR;
                }
            }
        }
    }

    private get outerCityModel():OuterCityModel{
        return OuterCityManager.Instance.model;
    }

    dispose() {
        this.removeEvent();
        ToolTipsManager.Instance.unRegister(this);
        super.dispose();
    }
}