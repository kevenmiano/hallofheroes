import BaseTips from "../../../tips/BaseTips";
import BottlePackage = com.road.yishi.proto.item.BottlePackage;
import {BaseItem} from "../../../component/item/BaseItem";
import {GoodsInfo} from "../../../datas/goods/GoodsInfo";
import BottleItemInfoMsg = com.road.yishi.proto.item.BottleItemInfoMsg;
import Utils from "../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/23 10:52
 * @ver 1.0
 */
export class BottleBottomIntergalBoxTips extends BaseTips
{
    public txt_title:fgui.GTextField;
    public list_item:fgui.GList;

    private _info:BottlePackage;
    private _goodsInfos:GoodsInfo[] = [];

    constructor()
    {
        super();
    }

    public OnInitWind()
    {
        super.OnInitWind();
        this._info = this.params[0];
        this.list_item.itemRenderer = Laya.Handler.create(this, this.onListItemRender, null, false);
    }

    public OnShowWind()
    {
        super.OnShowWind();
        this.updateInfo();
    }

    private updateInfo()
    {
        if(this._info)
        {
            this._goodsInfos = [];
            //钻石消费次数达到{times=30}可获得: 
            this.txt_title.setVar("times", this._info.param.toString()).flushVars();
            let rewardArr:BottleItemInfoMsg[] = this._info.item as BottleItemInfoMsg[];
            for(const item of rewardArr)
            {
                let goodsInfo:GoodsInfo = new GoodsInfo();
                goodsInfo.templateId = item.tempId;
                goodsInfo.count = item.count;
                this._goodsInfos.push(goodsInfo);
            }
            this.list_item.numItems = this._goodsInfos.length;
        }
    }

    private onListItemRender(index:number, item:BaseItem)
    {
        item.info = this._goodsInfos[index];
    }

    public OnHideWind()
    {
        super.OnHideWind();
    }

    dispose()
    {
        // this.list_item.itemRenderer.recover();
        Utils.clearGListHandle(this.list_item);
        this._info = null;
        super.dispose();
    }
}