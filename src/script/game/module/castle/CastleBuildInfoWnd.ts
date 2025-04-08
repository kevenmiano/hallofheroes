// @ts-nocheck
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import Utils from "../../../core/utils/Utils";
import BuildingManager from "../../map/castle/BuildingManager";
import BuildingType from "../../map/castle/consant/BuildingType";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import CastleBuildInfoItem from "./CastleBuildInfoItem";

export default class CastleBuildInfoWnd extends BaseWindow{
    public list:fgui.GList;
    public frame: fgui.GLabel;
    private arr: Array<BuildInfo> = [];
    public OnInitWind() {
        super.OnInitWind();
        this.addEvent();
        let list: Array<BuildInfo> =  BuildingManager.Instance.model.buildingListByID.getList();
        for (let i: number = 0; i < list.length; i++) {
            let element: BuildInfo = list[i];
            if (element.templeteInfo && (element.templeteInfo.SonType == BuildingType.OFFICEAFFAIRS
                || element.templeteInfo.SonType == BuildingType.CASERN
                || element.templeteInfo.SonType == BuildingType.SEMINARY
                || element.templeteInfo.SonType == BuildingType.CRYSTALFURNACE
                || element.templeteInfo.SonType == BuildingType.WAREHOUSE
                || element.templeteInfo.SonType == BuildingType.HOUSES)) {
                this.arr.push(element);
            }
        }
        if (this.arr.length > 0) {
            this.arr = ArrayUtils.sortOn(this.arr, ["sort"], [ArrayConstant.NUMERIC])
        }
        this.list.numItems = this.arr.length;
        this.frame.height = this.list.numItems * 100 + 90;
        this.contentPane.sourceHeight = this.frame.height;
        this.setCenter();
    }

    OnShowWind() {
        super.OnShowWind();
    }

    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private removeEvent() {
        Utils.clearGListHandle(this.list);
    }

    private renderListItem(index: number, item:CastleBuildInfoItem) {
        item.info = this.arr[index];
	}

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

}