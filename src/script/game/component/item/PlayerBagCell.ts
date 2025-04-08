import {BaseItem} from "./BaseItem";
import {GoodsInfo} from "../../datas/goods/GoodsInfo";
import {Enum_BagGridState, Enum_BagState} from "../../module/bag/model/Enum_BagState";
import {GoodsCheck} from "../../utils/GoodsCheck";
import {ThaneInfo} from "../../datas/playerinfo/ThaneInfo";
import {ArmyManager} from "../../manager/ArmyManager";
import MediatorMananger from "../../manager/MediatorMananger";
import GoodsSonType from "../../constant/GoodsSonType";
import {BagModel} from "../../module/bag/model/BagModel";
import {BagType} from "../../constant/BagDefine";
import FUI_PlayerBagCell from "../../../../fui/Base/FUI_PlayerBagCell";
import {PlayerBagCellClickMediator} from "../../cell/mediator/playerbag/PlayerBagCellClickMediator";
import {ConsortiaBagDoubleClickMediator} from "../../cell/mediator/consortiabag/ConsortiaBagDoubleClickMediator";
import TreasureMapManager from "../../manager/TreasureMapManager";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/24 11:45
 * @ver 1.0
 *
 */
export class PlayerBagCell extends FUI_PlayerBagCell
{
    public item:BaseItem;

    public static NAME:string = "cell.view.playerbag.PlayerBagCell";
    protected _mediatorKey:string = "";
    protected _registed:boolean = false;

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

        this.currentTreasureMap.visible = false;
        if(value && value.templateInfo && value.templateInfo.SonType == GoodsSonType.SONTYPE_TREASURE_MAP)
        {
            if(TreasureMapManager.Instance.isCurrentTreasureMap(value))
            {
                this.currentTreasureMap.visible = true;
            }
        }
        if(value && value.templateInfo && value.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX)//是否新手礼包
        {
            this.c3.selectedIndex = 1;//显示转圈特效
        }
        else
        {
            this.c3.selectedIndex = 0;
        }

        if(value)
        {
            let icon:fgui.GLoader = <fgui.GLoader>this.item.getChild("icon");
            if(GoodsCheck.isEquip(value.templateInfo) && !this.checkGoodsByHero(false))
            {
                icon.color = "#FF0000";
            }
            else
            {
                icon.color = "#FFFFFF";
            }

            this.state = Enum_BagGridState.Item;
            this.img_unselected.visible = this.img_selected.visible = (BagModel.bag_state != Enum_BagState.Default);
            this.stopper.visible = (BagModel.bag_state != Enum_BagState.Default);
            if(this.info.bagType == BagType.Player)
            {
                //不属于此类别下的物品格子置黑
                let isFilter = this.info.checkIsFilterGoods();
                this.c2.selectedIndex = isFilter ? 1 : 0;

                // 启用drawCallOptimize后文字在节点最上层,被覆盖变灰用改成灰色来实现
                this.item.getChild("title")['color'] = isFilter ? '#332F28' : '#FFECC6';
                this.item.fashionText['color'] = isFilter ? '#332F28' : '#FFECC6';
            }
        }
    }

    public checkGoodsByHero(popMsg:boolean = true):boolean
    {
        if(GoodsCheck.isGradeFix(this.thane, this._info.templateInfo, popMsg))
        {
            return GoodsCheck.checkGoodsByHero(this._info, this.thane, popMsg);
        }
        return false;
    }

    protected registerMediator()
    {
        this._registed = true;
        let arr:any[] = [
            // PlayerBagCellLightMediator,
            // OpenGridMediator,
            // PlayerBagCellDropMediator,
            // ConsortiaBagDoubleClickMediator,//公会仓库打开后的处理
            PlayerBagCellClickMediator
        ];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, PlayerBagCell.NAME);
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

        // 有物品显示时候, 把最底下的背景隐藏, 少一个九宫格图片的渲染消耗
        this.img_bg.visible = this._state != Enum_BagGridState.Item;
    }

    protected unregisterMediator()
    {
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    }

    private get thane():ThaneInfo
    {
        return ArmyManager.Instance.thane;
    }

    dispose()
    {
        this.item.dispose();
        this._info = null;
        this.unregisterMediator();
        super.dispose();
    }
}