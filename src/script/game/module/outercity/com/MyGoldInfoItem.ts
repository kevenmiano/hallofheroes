// @ts-nocheck
import FUI_MyGoldInfoItem from "../../../../../fui/OuterCity/FUI_MyGoldInfoItem";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { t_s_mapmineData } from "../../../config/t_s_mapmine";
import { t_s_mapphysicpositionData } from "../../../config/t_s_mapphysicposition";
import { ConfigType } from "../../../constant/ConfigDefine";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { OuterCitySocketOutManager } from "../../../manager/OuterCitySocketOutManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import OutCityOneMineInfo from "../../../map/outercity/OutCityOneMineInfo";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
export default class MyGoldInfoItem extends FUI_MyGoldInfoItem {
    private _info: OutCityOneMineInfo;
    private _position: string;
    private _mapMineData: t_s_mapmineData;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
    }

    private initEvent() {
        this.giveUpBtn.onClick(this, this.giveUpBtnHandler);
    }

    private removeEvent() {
        this.giveUpBtn.offClick(this, this.giveUpBtnHandler);
    }

    private giveUpBtnHandler() {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let nameStr: string = LangManager.Instance.GetTranslation("public.level3", this._mapMineData.Grade);
        let content: string;
        let mapData: t_s_mapphysicpositionData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapphysicposition, this._info.posId.toString());
        if (mapData) {
            content = LangManager.Instance.GetTranslation("MyGoldInfoItem.giveUpBtn.confirmTips",mapData.NameLang,nameStr);
        }
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.confirmHandler.bind(this));
    }

    private confirmHandler(b: boolean, flag: boolean) {
        if (b) {
            OuterCitySocketOutManager.removeMine(this._position, this._info.nodeId, this._info.sonNodeId);
        }
    }

    public set position(str: string) {
        this._position = str;
    }

    public set info(value: OutCityOneMineInfo) {
        this._info = value;
        if (this._info) {
            this.refreshView();
        }
        else {
            this.nameTxt.text = "";
            this.resouceTxt.text = "";
            this.giveUpBtn.visible = false;
        }
    }

    private refreshView() {
        if (this._info) {
            this._mapMineData = this.outercityModel.getNodeByNodeId(this._info.nodeId);
            if (this._mapMineData) {
                let mapData: t_s_mapphysicpositionData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapphysicposition, this._info.posId.toString());
                if (mapData) {
                    this.nameTxt.text = LangManager.Instance.GetTranslation("public.level3", this._mapMineData.Grade);
                }
                let itemtemplateData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._mapMineData.ResourcesId);
                if (itemtemplateData) {
                    let addCount: number;
                    if(this._info.isOccupy){
                        addCount = this._mapMineData.ResourcesNumPerhour;
                    }
                   else{
                        addCount = 0;
                   }
                    this.resouceTxt.text = LangManager.Instance.GetTranslation("MyGoldInfoItem.gradeTxt", addCount);
                }
            }
        }
    }

    private get outercityModel(): OuterCityModel {
        return OuterCityManager.Instance.model;
    }


    dispose() {
        this.removeEvent();
        super.dispose();
    }
}