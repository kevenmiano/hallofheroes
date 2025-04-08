import FUI_ConsortiaStorageCell from "../../../../fui/Base/FUI_ConsortiaStorageCell";
import {BaseItem} from "./BaseItem";
import {GoodsInfo} from "../../datas/goods/GoodsInfo";
import {Enum_BagGridState} from "../../module/bag/model/Enum_BagState";
import MediatorMananger from "../../manager/MediatorMananger";
import {ConsortiaStorageCellClickMediator} from "../../cell/mediator/consortiabag/ConsortiaStorageCellClickMediator";

/**
 * @description 公会仓库格子
 * @author yuanzhan.yu
 * @date 2021/7/24 14:59
 * @ver 1.0
 *
 */
export class ConsortiaStorageCell extends FUI_ConsortiaStorageCell
{
    public item:BaseItem;

    public static NAME:string = "cell.view.consortiabag.ConsortiaCaseCell";
    private _mediatorKey:string;
    public _registed:boolean = false;

    private _info:GoodsInfo;
    /**背包状态, -1: 未解锁；  0: 空格子；  1: 有道具*/
    private _state:number = Enum_BagGridState.Lock;

    constructor()
    {
        super();
    }

    protected onConstruct()
    {
        super.onConstruct();
       
    }

    get info():GoodsInfo
    {
        return this._info;
    }

    set info(value:GoodsInfo)
    {
        this._info = value;
        this.item.info = value;
        this.item.canOperate = true;

        if(!this._registed)
        {
            this.registerMediator();
        }

        if(value)
        {
            this.state = Enum_BagGridState.Item;
        }
        else{
            this.c1.selectedIndex = 0;
        }
    }

    get state():number
    {
        return this._state;
    }

    set state(value:number)
    {
        this._state = value;

        switch(this._state)
        {
            case Enum_BagGridState.Lock:
                this.c1.selectedIndex = 0;
                break;
            case Enum_BagGridState.Empty:
                this.c1.selectedIndex = 1;
                break;
            case Enum_BagGridState.Item:
                this.c1.selectedIndex = 2;
                break;
        }
    }

    private registerMediator()
    {
        this._registed = true;
        let arr:any[] = [
            // ConsortiaStorageCellClickMediator
            // ConsortiaCaseCellDropMediator,
            // PlayerBagCellLightMediator
        ];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, ConsortiaStorageCell.NAME);
    }

    dispose()
    {
        this.item.dispose();
        this._info = null;
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        super.dispose();
    }
}