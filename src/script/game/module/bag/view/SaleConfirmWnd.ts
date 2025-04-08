// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import {GoodsInfo} from "../../../datas/goods/GoodsInfo";
import {GoodsCheck} from "../../../utils/GoodsCheck";
import {SocketManager} from "../../../../core/net/SocketManager";
import {C2SProtocol} from "../../../constant/protocol/C2SProtocol";
import SelledItemInfo = com.road.yishi.proto.item.SelledItemInfo;
import ItemSellReqMsg = com.road.yishi.proto.item.ItemSellReqMsg;
import {BaseItem} from "../../../component/item/BaseItem";
import LangManager from "../../../../core/lang/LangManager";

/**
 * @description 背包物品出售界面
 * @author yuanzhan.yu
 * @date 2021/3/3 21:32
 * @ver 1.0
 *
 */

export class SaleConfirmWnd extends BaseWindow
{
    public txt_content:fgui.GTextField;
    public txt_price:fgui.GTextField;
    public loader_moneyType:fgui.GLoader;
    public list_item:fgui.GList;
    public btn_cancel:fgui.GButton;
    public btn_sure:fgui.GButton;

    private _itemDatas:GoodsInfo[] = [];

    constructor()
    {
        super();
    }

    public OnInitWind()
    {
        super.OnInitWind();

        this._itemDatas = this.params;
        this.addEventListener();
        this.setCenter();
    }

    private addEventListener()
    {
        this.btn_cancel.onClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.onClick(this, this.onBtnSureClick.bind(this));
    }

    public OnShowWind()
    {
        super.OnShowWind();

        this.updateItemList();
        this.updatePrice();
    }

    private updateItemList()
    {
        this.list_item.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list_item.setVirtual();
        this.list_item.numItems = this._itemDatas.length;
    }

    private renderListItem(index:number, item:BaseItem)
    {
        item.info = this._itemDatas[index];
    }

    private updatePrice()
    {
        let _totalPrice:number = 0
        for(let i = 0; i < this._itemDatas.length; i++)
        {
            const info:GoodsInfo = this._itemDatas[i];
            _totalPrice += GoodsCheck.getSellGold(info) * info.count;
        }
        this.txt_price.text =  LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarTip.price",_totalPrice);
    }

    private onBtnCancelClick()
    {
        this.hide();
    }

    private onBtnSureClick()
    {
        let msg:ItemSellReqMsg = new ItemSellReqMsg();
        for(let i:number = 0; i < this._itemDatas.length; i++)
        {
            let sellInfo:SelledItemInfo = new SelledItemInfo();
            sellInfo.pos = this._itemDatas[i].pos;
            sellInfo.count = this._itemDatas[i].count;
            msg.selledItemInfos.push(sellInfo);
        }
        SocketManager.Instance.send(C2SProtocol.C_BAG_BATCH_SELL, msg);

        this.hide();
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
    }

    dispose(dispose?:boolean)
    {
        super.dispose(dispose);
    }
}