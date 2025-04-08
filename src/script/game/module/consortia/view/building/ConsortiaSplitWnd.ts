// @ts-nocheck
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../../core/ui/UIButton";
import { PlayerBagCell } from "../../../../component/item/PlayerBagCell";
import { NumericStepper } from "../../../../component/NumericStepper";
import { PlayerManager } from "../../../../manager/PlayerManager";
import LangManager from '../../../../../core/lang/LangManager';
import { BaseItem } from "../../../../component/item/BaseItem";
import { GoodsManager } from '../../../../manager/GoodsManager';
import { BagType } from "../../../../constant/BagDefine";
import { BagHelper } from "../../../bag/utils/BagHelper";
import { GoodsInfo } from '../../../../datas/goods/GoodsInfo';

export default class ConsortiaSplitWnd extends BaseWindow {
    public btn_cancel: UIButton;
    public btn_sure: UIButton;
    public descTxt1: fgui.GTextField;
    public goodsNameTxt: fgui.GTextField;
    public descTxt2: fgui.GTextField;
    public countTxt: fgui.GTextField;
    public numerics: NumericStepper;
    private _maxCount: number = 0;
    public baseItem: BaseItem;
    private _handler: Laya.Handler;
    private _info: GoodsInfo;
    private _count: number;
    private _bagType: number = 0;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this._info = this.frameData[0];
        this._bagType = this.frameData[1];
        this.initView();
        this.setCenter();
        this.addEventListener();
    }

    private initView() {
        this.descTxt2.text = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt");
        this.descTxt1.text = LangManager.Instance.GetTranslation("ConsortiaSplitWnd.descTxt1");
        if (this._bagType == BagType.Player) {
            this._maxCount = GoodsManager.Instance.getBagCountByTempIdAndPos(BagType.Player, this._info.templateInfo.TemplateId, this._info.pos);
        }
        else if (this._bagType == BagType.Storage) {
            this._maxCount = GoodsManager.Instance.getBagCountByTempIdAndPos(BagType.Storage, this._info.templateInfo.TemplateId, this._info.pos);
        }
        this._count = this._maxCount;
        this._handler && this._handler.recover();
        this._handler = Laya.Handler.create(this, this.stepperChangeHandler, null, false);
        this.numerics.show(1, this._maxCount, 1, this._maxCount, 9999, 1, this._handler);
        this.baseItem.info = this._info;
        this.goodsNameTxt.text = this._info.templateInfo.TemplateNameLang;
        this.countTxt.text = this._maxCount.toString();
    }

    private stepperChangeHandler(value: number) {
        this._count = this.numerics.value;
    }

    private addEventListener() {
        this.btn_cancel.onClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.onClick(this, this.onBtnSureClick.bind(this));
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private onBtnCancelClick() {
        this.hide();
    }

    private onBtnSureClick() {
        if (this._bagType == BagType.Player) {
            BagHelper.moveRoleBagToConsortiaBag(this._info, this._count);
        }
        else {
            BagHelper.moveConsortiaToRoleBag(this._info, this._count);
        }
        this.hide();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEventListener();
    }

    private removeEventListener() {
        this.btn_cancel.offClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.offClick(this, this.onBtnSureClick.bind(this));
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}