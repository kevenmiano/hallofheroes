// @ts-nocheck
import { CampaignNode } from "../map/space/data/CampaignNode";
import { MapPhysics } from "../map/space/data/MapPhysics";
import { FilterFrameText } from "./FilterFrameText";

/**
* @author:shujin.ou
* @email:1009865728@qq.com
* @data: 2020-12-10 20:34
*/
export default class OneStatusButton extends Laya.Sprite {

    private _data: any = null;
    private textName: FilterFrameText;

    constructor() {
        super();
        this.mouseEnabled = true;
        this.autoSize = true;
    }

    public set nodeData(value: any) {
        this._data = value;
        let nameValue = "";
        if (value instanceof CampaignNode) {//英灵岛节点
            nameValue = value.info.nodeName;
        } else if (value instanceof MapPhysics) {//天空之城节点
            nameValue = value.info.nodeName;
        }
        //
        if (!this.textName) {
            this.textName = new FilterFrameText(this.width, 18, undefined, 18);
            this.textName.pivot(0.5, 0.5);
            this.textName.bold = true;
            this.textName.stroke = 4;
            this.textName.color = "#fffbb4";
            this.textName.strokeColor = "#b31f1f";
        }
        this.textName.text = nameValue;
        if(this.textName.textWidth > this.textName.width) {
            this.textName.x = (this.width -  this.textName.textWidth) / 2;
        } else {
            this.textName.x = 0;
        }
        this.textName.y = this.height - this.textName.textHeight + 5;
        this.addChild(this.textName);
    }

}