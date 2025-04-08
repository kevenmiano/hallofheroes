// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import {PlayerManager} from "../../../manager/PlayerManager";
import {PlayerBagCell} from "../../../component/item/PlayerBagCell";

/**
 * @description 背包物品拆分界面
 * @author yuanzhan.yu
 * @date 2021/3/5 14:48
 * @ver 1.0
 *
 */
export class SplitConfirmWnd extends BaseWindow
{
    public btn_cancel:UIButton
    public btn_sure:UIButton
    public txt_num:fgui.GTextInput;
    public btn_reduce:UIButton;
    public btn_plus:UIButton;

    private _currCount:number = 0;
    private _currGrid:PlayerBagCell;
    private _targetGridPos:number;

    constructor()
    {
        super();
    }

    public OnInitWind()
    {
        super.OnInitWind();
        this.setCenter();

        this._currGrid = this.params[0];
        this._targetGridPos = this.params[1];
        this.addEventListener();
    }

    private addEventListener()
    {
        this.btn_cancel.onClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.onClick(this, this.onBtnSureClick.bind(this));
        this.btn_reduce.view.onClick(this, this.onBtnCountClick, [-1]);
        this.btn_plus.view.onClick(this, this.onBtnCountClick, [1]);
        // this.txt_num.on(Laya.Event.CHANGE, this, this.onTxtChang);
        this.txt_num.on(Laya.Event.INPUT, this, this.onTxtChang);
    }

    public OnShowWind()
    {
        super.OnShowWind();

        this.updateCount();
    }

    private updateCount()
    {
        this._currCount = 1;//this._currGrid.itemData.count;
        this.txt_num.text = this._currCount.toString();
    }

    private onBtnCancelClick()
    {
        this.hide();
    }

    private onBtnSureClick()
    {
        PlayerManager.Instance.moveBagToBag(this._currGrid.item.bagType, this._currGrid.item.objectId, this._currGrid.item.pos,
            this._currGrid.item.bagType, this._currGrid.item.objectId, this._targetGridPos, this._currCount);
        this.hide();
    }

    private onBtnCountClick(step:number)
    {
        this._currCount += step;
        this._currCount = Math.min(Math.max(1, this._currCount ? this._currCount : 0), this._currGrid.info.count);
        this.txt_num.text = this._currCount.toString();
    }

    private onTxtChang(e:Laya.Event)
    {
        // Logger.yyz("输入文本改变了");
        let num:number = parseInt(this.txt_num.text);
        this._currCount = Math.min(Math.max(1, num ? num : 0), this._currGrid.info.count);
        this.txt_num.text = this._currCount.toString();
    }

    public OnHideWind()
    {
        super.OnHideWind();

        this.removeEventListener();
    }

    private removeEventListener()
    {
        this.btn_cancel.offClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.offClick(this, this.onBtnSureClick.bind(this));
        this.btn_reduce.view.offClick(this, this.onBtnCountClick);
        this.btn_plus.view.offClick(this, this.onBtnCountClick);
        // this.txt_num.off(Laya.Event.CHANGE, this, this.onTxtChang);
        this.txt_num.off(Laya.Event.INPUT, this, this.onTxtChang);
    }

    dispose(dispose?:boolean)
    {
        super.dispose(dispose);
    }
}