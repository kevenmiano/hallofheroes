import FUI_MineItem from "../../../../../fui/OuterCity/FUI_MineItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { t_s_mapmineData } from "../../../config/t_s_mapmine";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { OuterCitySocketOutManager } from "../../../manager/OuterCitySocketOutManager";
import { PathManager } from "../../../manager/PathManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { WildLand } from "../../../map/data/WildLand";
import OutCityMineNode from "../../../map/outercity/OutCityMineNode";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import MineCircleItem from "./MineCircleItem";
/**
 * 金矿项
 */
export default class MineItem extends FUI_MineItem {
    private _info: OutCityMineNode;
    private _countListData: Array<any> = [];
    private _wildLand: WildLand;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        Utils.setDrawCallOptimize(this);
    }

    renderListItem(index: number, item: MineCircleItem) {
        if (!item) return;
        item.hasOccupy = this._countListData[index];
    }

    public set info(value: OutCityMineNode) {
        this._info = value;
        if (this._info) {
            this.refreshView();
        }
        else {
            this.occupyCtr.selectedIndex = 0;
            this.selectedCtr.selectedIndex = 0;
            this.nameTxt.text = "";
            this.resourceTxt.text = "";
        }
    }
    public set wildLand(nodeInfo:WildLand){
        this._wildLand = nodeInfo;
    }

    public get info(): OutCityMineNode {
        return this._info;
    }
    
    public set selected(flag: boolean) {
        this.selectedCtr.selectedIndex = flag ? 1 : 0;
        if (flag) {
            let mapId: number = this.outerCityModel.mapId;
            let posX: number = this._info.posX;
            let posY: number = this._info.posY;
            let nodeId: number = this._info.nodeId;
            OuterCitySocketOutManager.requestSonNodeData(mapId, posX, posY, nodeId);
        }
    }

    private refreshView() {
        if (this._info) {
            let mapMineData: t_s_mapmineData = this.outerCityModel.getNodeByNodeId(this._info.nodeId);
            if (mapMineData) {
                this.nameTxt.text = LangManager.Instance.GetTranslation("public.level3", mapMineData.Grade);
                let itemtemplateData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(mapMineData.ResourcesId);
                if (itemtemplateData) {
                    let addCount: number = mapMineData.ResourcesNumPerhour;
                    this.resourceTxt.text = LangManager.Instance.GetTranslation("MyGoldInfoItem.gradeTxt", addCount);
                }
                this.iconLoader.url = PathManager.getMineItemPngBySonType(this._wildLand.tempInfo.SonType);
                let hasOccupyCount: number = this._info.allOccupyNum;
                this.countTxt.text = (mapMineData.TotalNum - hasOccupyCount) + "/" + mapMineData.TotalNum;
            }
        }
    }

    private get outerCityModel(): OuterCityModel {
        return OuterCityManager.Instance.model;
    }

    dispose() {
        super.dispose();
    }
}