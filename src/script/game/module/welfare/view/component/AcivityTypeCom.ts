// @ts-nocheck
import FUI_AcivityTypeCom from "../../../../../../fui/Welfare/FUI_AcivityTypeCom";
import LangManager from "../../../../../core/lang/LangManager";
import { t_s_activityscheduleData } from "../../../../config/t_s_activityschedule";
import ActivityScheduleItem from "./ActivityScheduleItem";

export default class AcivityTypeCom extends FUI_AcivityTypeCom {
    private _renderData: Array<t_s_activityscheduleData>;
    private _area: number = 0;
    protected onConstruct() {
        super.onConstruct();
        this.itemList.itemRenderer = Laya.Handler.create(this, this.itemRender, null, false)
    }

    public set info(value: Array<t_s_activityscheduleData>) {
        this._renderData = value;
        this.updateView();
    }

    public set area(value: number) {
        this._area = value;
    }

    private updateView() {
        if (this._area == 1) {
            this.timeDescTxt.text = LangManager.Instance.GetTranslation("funpreview.Timeactive");
        }
        else if (this._area == 2) {
            this.timeDescTxt.text = LangManager.Instance.GetTranslation("ConsortiaWnd.tabActivity");
        }
        this.itemList.numItems = this._renderData.length;
        let row = Math.ceil(this.itemList.numItems / 4);
        this.itemList.height = row * 230;
        this.height = this.itemList.y + this.itemList.height;
        this.itemList.height = this.itemList.viewHeight;
    }

    private itemRender(index: number, item: ActivityScheduleItem) {
        item.info = this._renderData[index];
    }
}