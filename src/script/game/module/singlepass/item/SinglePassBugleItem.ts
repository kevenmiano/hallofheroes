import FUI_SinglePassBugleItem from "../../../../../fui/SinglePass/FUI_SinglePassBugleItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { BaseItem } from '../../../component/item/BaseItem';
import { FilterFrameText, eFilterFrameText } from "../../../component/FilterFrameText";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";

export default class SinglePassBugleItem extends FUI_SinglePassBugleItem {

    private _info: GoodsInfo;
    private _index: number;
    private _goodsInfo: GoodsInfo;
    public isChested: boolean = false;
    public colors = FilterFrameText.Colors[eFilterFrameText.ItemQuality]
    public item: BaseItem;
    private txtItemName: fgui.GLabel
    public isPay: boolean = false;
    public opened: boolean = false;
    public timeout: boolean = false;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct()
        this.item = this.comUnFolder.getChild("item") as BaseItem;
        this.txtItemName = this.comUnFolder.getChild("txtItemName") as fgui.GLabel;
    }

    public get index(): number {
        return this._index;
    }

    public set index(value: number) {
        this._index = value;
    }

    public get info(): GoodsInfo {
        return this._info;
    }

    public set info(value: GoodsInfo) {
        this._goodsInfo = value;
        if (this._goodsInfo) {
            this.item.showProfile = true;
            this.item.info = this._goodsInfo;
            var temp: t_s_itemtemplateData = this._goodsInfo.templateInfo;
            if (temp) {
                this.txtItemName.text = temp.TemplateNameLang;
                this.txtItemName.color = this.colors[temp.Profile];
            }
        }
        this.show(false);
        this.updateCost();
    }

    public updateData(goods: GoodsInfo) {
        this._goodsInfo = goods;
        this.initData();
        this.isChested = true;
        this.turnOver();
    }

    /**由反面翻到正面 */
    public turnOver() {
        this.opened = true;
        this.imgFolderBg.scaleX = 1
        Laya.Tween.to(this.imgFolderBg, { scaleX: 0 }, 200, null, Laya.Handler.create(null, () => {
            this.imgFolderBg.scaleX = 1
        }))

        Laya.timer.once(200, this, () => {
            this.show(false)
            this.comUnFolder.scaleX = -0.01
            Laya.Tween.to(this.comUnFolder, { scaleX: 1 }, 200, null, Laya.Handler.create(null, () => { }))
        })
    }

    /**由正面翻到反面 */
    public turnBack() {
        this.opened = false;
        this.comUnFolder.scaleX = 1
        Laya.Tween.to(this.comUnFolder, { scaleX: 0 }, 200, null, Laya.Handler.create(null, () => {
            this.comUnFolder.scaleX = 1
        }))

        Laya.timer.once(200, this, () => {
            this.show(true);
            this.imgFolderBg.scaleX = -0.01
            Laya.Tween.to(this.imgFolderBg, { scaleX: 1 }, 200, null, Laya.Handler.create(null, () => {}))
        })
    }

    public showBack()
    {
        this.show(true);
    }
    
    public show(back: boolean = true) {
        this.comUnFolder.visible = !back
        this.imgFolderBg.visible = back
        this.costContainer.visible = back;
        this.isChested = false;
    }

    private initData() {
        this.item.info = this._goodsInfo
        var temp: t_s_itemtemplateData = this._goodsInfo.templateInfo;
        this.txtItemName.text = temp.TemplateNameLang;
        this.txtItemName.color = this.colors[temp.Profile];
    }

    public updateCost(pointsCount: number = 0, itemsCount: number = 1) {
        this.PointsTxt.text = pointsCount.toString();
        this.ItemsTxt.text = itemsCount.toString();
        if (pointsCount > 0) {
            this.PointsTxt.visible = true;
            this.pointsIcon.visible = true;
        }
        else {
            this.PointsTxt.visible = false;
            this.pointsIcon.visible = false;
        }
    }

    dispose() {
        super.dispose();
    }
}