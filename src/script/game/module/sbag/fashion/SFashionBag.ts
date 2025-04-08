// @ts-nocheck
import FUI_SFashionBag from "../../../../../fui/SBag/FUI_SFashionBag";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { FashionBagCell } from "../../../component/item/FashionBagCell";
import { BagType } from "../../../constant/BagDefine";
import { BagEvent, FashionEvent } from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FashionManager } from "../../../manager/FashionManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { FashionModel } from "../../bag/model/FashionModel";
import StoreRspMsg = com.road.yishi.proto.store.StoreRspMsg;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/20 19:24
 * @ver 1.0
 *
 */
export class SFashionBag extends FUI_SFashionBag
{
    private _data:GoodsInfo[] = [];
    private _itemDic:SimpleDictionary = new SimpleDictionary();
    private _deleteDic:SimpleDictionary = new SimpleDictionary();
    private _defaultCount:number = 10;
    private _totalPage:number;

    constructor()
    {
        super();
    }

    protected onConstruct()
    {
        super.onConstruct();
        // this.list_tab.selectedIndex = -1;  
        this.list_tab.visible = false;
    }

    // selectTabIndex(index:number){
    //     // this.list_tab.selectedIndex = index;  
    //     this.onTabChanged();
    // }

    private initEvent()
    {
        // this.list_tab.on(fgui.Events.CLICK_ITEM, this, this.onTabChanged);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        this.model.addEventListener(FashionEvent.FASHION_STORE_CHANGE, this.__selectedChangeHandler, this);
        // this.model.addEventListener(FashionEvent.REFRESH_BAG, this.__refreshHandler, this);
        ServerDataManager.listen(S2CProtocol.U_C_FASHION_COMPOSE, this, this.__onComposeCallback);
    }

    public initView()
    {
        this.initItemList();
        this.initEvent();
        // this.list_tab.selectedIndex = 0;
        // this.onTabChanged();
        this.updateItemList();
    }

    private initItemList()
    {
        this.list_item.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list_item.setVirtual();
        this.list_item.numItems = 10;
    }

    // private onTabChanged()
    // {
    //     this.model.tapNum = this.list_tab.selectedIndex;
    //     this.model.moveGoodsBack();
    //     this.updateItemList();
    // }

    private updateItemList()
    {
        this._data = [];
        this._itemDic.clear();
        this._deleteDic.clear();
        let list:GoodsInfo[] = this.model.fashionList;
        let gInfo:GoodsInfo;
        // let sonType:number = this.getCurrentGoodsSonType(this.list_tab.selectedIndex);
        let fashionSoulInHideBag:Boolean = false;
        for(let i:number = 0; i < list.length; i++)
        {
            gInfo = list[i] as GoodsInfo;
            if(!GoodsManager.Instance.isGneralBagGoods(gInfo) &&
                !GoodsManager.Instance.isHeroGoods(this.userArmy.baseHero ? this.userArmy.baseHero.id : 0, gInfo))
            {
                if(this.model.scene != FashionModel.SHOP_SCENE)
                {
                    fashionSoulInHideBag = true;
                }
                continue;
            }

            if(gInfo.templateInfo.Property5 != 1 && gInfo.templateId != FashionModel.FASHION_SOUL &&
                this.model.selectedPanel == FashionModel.FASHION_SWITCH_PANEL)//不能转换的时装
            {
                continue;
            }
            if(this.model.scene == FashionModel.SHOP_SCENE)
            {
                this._data.push(gInfo);
            }else
            {
                // if(gInfo.templateInfo.SonType == sonType || gInfo.templateId == FashionModel.FASHION_SOUL)
                // if(gInfo.templateId == FashionModel.FASHION_SOUL)
                // {//过滤时装类型
                    this._data.push(gInfo);
                // }
            }
        }
        this._data.sort(this.sortFashionBag.bind(this));
        if(fashionSoulInHideBag)
        {
            this._data.splice(0, 0, null);
        }

        if(this._data.length <= this._defaultCount)
        {
            this._totalPage = 1;
        }
        else if(this._data.length % this._defaultCount == 0)
        {
            this._totalPage = this._data.length / this._defaultCount;
        }
        else
        {
            this._totalPage = Math.ceil(this._data.length / this._defaultCount);
        }
        this.list_item.numItems = this._totalPage * this._defaultCount;
    }

    private renderListItem(index:number, item:FashionBagCell)
    {
        let info:GoodsInfo = this._data[index]
        if(info)
        {
            if(this._deleteDic[info.pos + "_" + info.objectId + "_" + info.bagType])
            {
                item.item.bagType = BagType.Player;
                item.item.pos = -1;
                item.info = null;
            }
            else
            {
                item.item.bagType = BagType.Player;
                item.item.pos = info.pos;
                item.info = info;
                this._itemDic.add((this.list_item.scrollPane.currentPageX + 1) + "_" + info.pos + "_" + info.objectId + "_" + info.bagType, item);
            }
        }
        else
        {
            item.item.pos = -1;
            item.info = null;
        }
        item.moveType = FashionModel.TRY_ON;
    }

    private getCurrentGoodsSonType(index:number):number
    {
        let goodSonType:number = 0;
        switch(index)
        {
            case 0:
                goodSonType = GoodsSonType.FASHION_WEAPON;
                break;
            case 1:
                goodSonType = GoodsSonType.FASHION_CLOTHES;
                break;
            case 2:
                goodSonType = GoodsSonType.FASHION_HEADDRESS;
                break;
            case 3:
                goodSonType = GoodsSonType.SONTYPE_WING;
                break;
            default:
                goodSonType = GoodsSonType.FASHION_WEAPON;
                break;
        }
        return goodSonType;
    }

    /**
     * 时装背包内的时装排序
     * */
    private sortFashionBag(item1:GoodsInfo, item2:GoodsInfo):number
    {
        if(this.model.isFashion(item1) && !this.model.isFashion(item2))
        {
            return 1;
        }
        else if(!this.model.isFashion(item1) && this.model.isFashion(item2))
        {
            return -1;
        }
        else if(!this.model.isFashion(item1) && !this.model.isFashion(item2))
        {
            return 0;
        }

        if(item1.bagType == BagType.HeroEquipment && item2.bagType != BagType.HeroEquipment)
        {
            return -1;
        }
        else if(item1.bagType != BagType.HeroEquipment && item2.bagType == BagType.HeroEquipment)
        {
            return 1;
        }
        else
        {
            if(item1.isBinds && !item2.isBinds)
            {
                return 1;
            }
            else if(!item1.isBinds && item2.isBinds)
            {
                return -1;
            }
            else
            {
                let grade1:number = this.model.getFashionLevelByInfo(item1);
                let grade2:number = this.model.getFashionLevelByInfo(item2);
                if(grade1 > grade2)
                {
                    return 1;
                }
                else if(grade1 < grade2)
                {
                    return -1;
                }
                else
                {
                    if(item1.templateId > item2.templateId)
                    {
                        return -1;
                    }
                    else if(item1.templateId < item2.templateId)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }

            }
        }
    }

    private __bagItemUpdateHandler(infos:GoodsInfo[])
    {
        Laya.timer.callLater(this, this.updateItemList);
        // if(info && !this.model.isFashion(info) && info.templateId != FashionModel.FASHION_SOUL)
        // {
        //     return;
        // }
        // if(info)
        // {
        //     if(info.bagType == 0)
        //     {
        //         return;
        //     }
        //     this._deleteDic.del(info.pos + "_" + info.objectId + "_" + info.bagType);
        //     // delete _deleteDic[info.pos+"_"+info.objectId+"_"+info.bagType];
        //     let item:FashionBagCell = this._itemDic[(this.list_item.scrollPane.currentPageX + 1) + "_" + info.pos + "_" + info.objectId + "_" + info.bagType];
        //     if(item)
        //     {
        //         item.item.bagType = info.bagType;
        //         item.item.pos = info.pos;
        //         item.info = info;
        //     }
        //     else
        //     {
        //         if(info.templateId == FashionModel.FASHION_SOUL)
        //         {
        //             let index:number = this._data.indexOf(null);
        //             if(index != -1)
        //             {
        //                 this._data[index] = info;
        //             }
        //         }
        //         this.updateItemList();
        //     }
        // }
    }

    private __bagItemDeleteHandler(info:GoodsInfo)
    {
        Laya.timer.callLater(this, this.updateItemList);
        // if(info)
        // {
        //     if(info.pos == 0 && info.objectId == 0 && info.bagType == 0)
        //     {
        //         return;
        //     }
        //     this._deleteDic[info.pos + "_" + info.objectId + "_" + info.bagType] = info;
        //     let item:FashionBagCell = this._itemDic[(this.list_item.scrollPane.currentPageX + 1) + "_" + info.pos + "_" + info.objectId + "_" + info.bagType];
        //     if(item)
        //     {
        //         item.item.bagType = BagType.Player;
        //         item.item.pos = -1;
        //         item.info = null;
        //     }
        // }
    }

    private __selectedChangeHandler()
    {
        this.updateItemList();
    }

    private __onComposeCallback(pkg:PackageIn)
    {
        let msg:StoreRspMsg = pkg.readBody(StoreRspMsg) as StoreRspMsg;
        if(!msg.composeResult)
        {
            return;
        }
        this.updateItemList();
    }

    public get model():FashionModel
    {
        return FashionManager.Instance.fashionModel;
    }

    private get userArmy():BaseArmy
    {
        return ArmyManager.Instance.army;
    }

    private removeEvent()
    {
        // this.list_tab.off(fgui.Events.CLICK_ITEM, this, this.onTabChanged);

        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        this.model.removeEventListener(FashionEvent.FASHION_STORE_CHANGE, this.__selectedChangeHandler, this);
        // this.model.removeEventListener(FashionEvent.REFRESH_BAG, this.__refreshHandler, this);
        ServerDataManager.cancel(S2CProtocol.U_C_FASHION_COMPOSE, this, this.__onComposeCallback);
    }

    dispose()
    {
        Laya.timer.clearAll(this);
        this.removeEvent();
        if(this._itemDic)
        {
            this._itemDic.clear();
        }
        this._itemDic = null;
        if(this._deleteDic)
        {
            this._deleteDic.clear();
        }
        this._deleteDic = null;
        this._data = null;

        super.dispose();
    }
}