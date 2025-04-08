import FUI_InlayCom from "../../../../../fui/SBag/FUI_InlayCom";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { StoreBagCell } from "../../../component/item/StoreBagCell";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { BagType } from "../../../constant/BagDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import GoodsSonType from "../../../constant/GoodsSonType";
import { EmWindow } from "../../../constant/UIDefine";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { ExtraJobEquipItemInfo } from "../../bag/model/ExtraJobEquipItemInfo ";
import ForgeData from "../../forge/ForgeData";
import { MasteryInlayItem } from "./MasteryInlayItem";
/**
 * 魂器镶嵌界面
 */
export class InlayCom extends FUI_InlayCom {

    private _itemDic: SimpleDictionary = new SimpleDictionary()
    private _goodsArr: Array<GoodsInfo> = [];
    /** 要镶嵌的魂器装备信息 */
    private _equipInfo:ExtraJobEquipItemInfo;
    isInited:boolean=false;
    onConstruct() {
        super.onConstruct();
       
        
    }

    public initView(info:ExtraJobEquipItemInfo){
        if(this.isInited){
            this.updateHole(info);
            return;
        }
        this.isInited = true;
        this._equipInfo = info;
        this.initHole();
        this.updateView();
        this.bagItemList.itemPool.useGlobal = true;
        this.bagItemList.itemRenderer = Laya.Handler.create(this, this.onRenderListItem, null, false);
        this.addEvent();
        this.updateBagGemList();
    }

    public updateHole(info){
        this._equipInfo = info;
        this.updateView();
    }

    private addEvent(){
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
    }

    removeEvent(){
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
    }

    /**
     * 4个镶嵌孔
     */
    private initHole(){
        for (let index = 1; index <= 4; index++) {
            let inlayIem = this["inlay" + index] as MasteryInlayItem
            inlayIem.pos = index
            inlayIem.index = index
            inlayIem.bagType = BagType.Hide
            // inlayIem.bSSEquipOpen = index == ForgeData.XQJewelNum
            this._itemDic.add(index + "_0_" + BagType.Hide, inlayIem);
        }
    }

    curSelectInlayHole:MasteryInlayItem;
    selectHole(idx:number){
        this.curSelectInlayHole = this["inlay" + idx] as MasteryInlayItem;
        for (let index = 1; index <= 4; index++) {
            if(idx != index){
                let inlayIem = this["inlay" + index] as MasteryInlayItem;
                inlayIem.selected = false;
            }       
        }
    }

    /**
     * 宝石背包列表
     */
    private updateBagGemList() {
		this._goodsArr = [];
		let arr = GoodsManager.Instance.getGoodsByBagType(BagType.Player);
		for (let i = 0; i < arr.length; i++) {
			let goodsInfo: GoodsInfo = arr[i];
			if (goodsInfo && goodsInfo.templateInfo
				&& goodsInfo.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT && goodsInfo.objectId == 0
			) {
				this._goodsArr.push(goodsInfo);
			}
		}
		this._goodsArr.sort(this.byOrder);
        let len = this._goodsArr.length;
        if(len < 15){
            len = 15;
        }
		this.bagItemList.numItems = len;
	}

    private byOrder(a: GoodsInfo, b: GoodsInfo): number {
		if (a.templateId > b.templateId) {
			return -1;
		} else if (a.templateId < b.templateId) {
			return 1;
		} else {
			return 0;
		}
	}

    private onRenderListItem(index: number, item: StoreBagCell) {
        let bagData = this._goodsArr
        if (!bagData) return
        let itemData = bagData[index]
        if (!itemData) {
            item.info = null;
            return
        }

        item.item.bagType = itemData.bagType;
        item.item.pos = itemData.pos;
        item.info = itemData
        this._itemDic.add(itemData.pos + "_" + itemData.objectId + "_" + itemData.bagType, item);
        item.item.tipType = EmWindow.ForgePropTip
    
    }


    private __bagItemUpdateHandler(info: GoodsInfo) {
        this.updateBagGemList();
        // let item: MasteryInlayItem = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
        // if (item) {
        //     //@ts-ignore
        //     info.isInlay = true;
        //     item.info = info;
        //     item.item.tipType = EmWindow.ForgePropTip 
        //     this.updateView(info);
        // } 
    }

    private __bagItemDeleteHandler(info: GoodsInfo) {
        this.updateBagGemList();
        // let item: MasteryInlayItem = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
        // if (item) {
        //     item.info = null;
        //     this.updateView(info);
        // }
    }

    private updateView() {
        for (let i = 1; i <= 4; i++) {
            let item: MasteryInlayItem = this["inlay" + i];
            item.info = this._equipInfo;
            item.item.tipType = EmWindow.ForgePropTip;
            item.setIconTick(item.bNotOpen ? ForgeData.getLockIcon() : ForgeData.getAddIcon());
        }
    }

    /**
     * 是否已经镶嵌同类型的宝石
     */
    checkHasInlaySameGem(property1):boolean {
        for (let i = 1; i <= 4; i++) {
            let item: MasteryInlayItem = this["inlay" + i];
            if(item.info){
                let id = item.info['join' + i]
                if(id>0){
                    let temp:t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, id);
                    if(temp.Property1 == property1){
                        return true;
                    }
                }
            }
        }
        return false;
    }



}