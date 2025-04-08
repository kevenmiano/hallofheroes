// @ts-nocheck
import FUI_HeadIcon from "../../../../../../fui/Base/FUI_HeadIcon";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { IconType } from "../../../../constant/IconType";
import IconAvatarFrame from "../../../../map/space/view/physics/IconAvatarFrame";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/7 16:33
 * @ver 1.0
 */

export class HeadIcon extends FUI_HeadIcon {
    private _sdata: number | t_s_itemtemplateData;

    declare public head: IconAvatarFrame;
    private _hasClick:boolean = false;
    constructor() {
        super();
    }

    public set hasClick(value:boolean){
        this._hasClick = value;
    }

    get sdata(): number | t_s_itemtemplateData {
        return this._sdata;
    }

    set sdata(value: number | t_s_itemtemplateData) {
        this._sdata = value;
        if (this._sdata instanceof t_s_itemtemplateData) {
            this.head.headId = 0;
            let tempData = this.sdata as t_s_itemtemplateData;
            this.head.headFrame = tempData.Avata;
            this.head.headEffect = (Number(tempData.Property1) == 1) ? tempData.Avata : "";
        } else {
            this.head.headId = Number(this._sdata);
        }
    }

    set setBg(value:number){
        this.head.c1.selectedIndex = value;
    }

    set setVisible(value:number){
        this.c1.selectedIndex = value;
    }

    dispose() {
        this.head.dispose();
        super.dispose();
    }
}