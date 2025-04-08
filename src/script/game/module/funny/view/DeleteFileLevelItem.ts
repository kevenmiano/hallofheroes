import FUI_DeleteFileLevelItem from "../../../../../fui/Funny/FUI_DeleteFileLevelItem";
import Utils from "../../../../core/utils/Utils";
import {PlayerModel} from "../../../datas/playerinfo/PlayerModel";
import {PlayerManager} from "../../../manager/PlayerManager";
import {BaseItem} from "../../../component/item/BaseItem";
import FunnyManager from "../../../manager/FunnyManager";
import {MessageTipManager} from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import {GoodsInfo} from "../../../datas/goods/GoodsInfo";
import {GoodsManager} from "../../../manager/GoodsManager";
import StarInfo from "../../mail/StarInfo";
import {TempleteManager} from "../../../manager/TempleteManager";
import FunnyBagData from "../model/FunnyBagData";
import StarItem from "../../star/item/StarItem";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/5/31 16:30
 * @ver 1.0
 */
export class DeleteFileLevelItem extends FUI_DeleteFileLevelItem
{
    private _info:FunnyBagData;
    private _goodsArr:any[];

    constructor()
    {
        super();
    }

    protected onConstruct()
    {
        super.onConstruct();
        this.initEvent();
    }

    private initEvent()
    {
        this.btn_get.onClick(this, this.getRewardBtnHandler);
        Utils.setDrawCallOptimize(this.list);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderGoodsListItem, null, false);
        this.list.itemProvider = Laya.Handler.create(this, this.getListItemResource, null, false);
    }

    public set info(value:FunnyBagData)
    {
        this._info = value;
        this.refreshView();
    }

    private refreshView()
    {
        if(this._info)
        {
            this._goodsArr = [];
            let _data = this._info;
            this.txt_desc.text = _data.title;
            let funnyData = FunnyManager.Instance.selectedFunnyData;
            // if (funnyData) {
            //     this.txt_Count.visible = (funnyData.getWay == 1 || funnyData.getWay == 3) && this._info.countActive;
            // }
            for(let i:number = 0; i < _data.rewardList.length; i++)
            {
                if(_data.rewardList[i].temType == 1)
                {
                    let ginfo:GoodsInfo = new GoodsInfo();
                    ginfo.templateId = _data.rewardList[i].temId;
                    ginfo.count = _data.rewardList[i].count;
                    ginfo.isBinds = _data.rewardList[i].isBind;
                    ginfo.strengthenGrade = _data.rewardList[i].strengthenGrade;
                    if(GoodsManager.Instance.filterEquip(ginfo))
                    {
                        this._goodsArr.push(ginfo);
                    }
                    else
                    {
                        
                    }
                }
                else if(_data.rewardList[i].temType == 2)
                {
                    let starInfo:StarInfo = new StarInfo();
                    starInfo.template = TempleteManager.Instance.getStarTemplateById(_data.rewardList[i].temId);
                    starInfo.count = _data.rewardList[i].count;
                    starInfo.grade = _data.rewardList[i].strengthenGrade <= 0 ? 1 : _data.rewardList[i].strengthenGrade;
                    if(!GoodsManager.Instance.filterStar(starInfo))
                    {
                        continue;
                    }
                    this._goodsArr.push(starInfo);
                }
            }
            this.list.numItems = this._goodsArr.length;
            this.setState();
        }
    }

    private get playerModel():PlayerModel
    {
        return PlayerManager.Instance.currentPlayerModel;
    }

    /**
     * 设置领取状态
     * */
    public setState()
    {
        if(this._info == null)
        {
            return;
        }

        switch(this._info.status)
        {
            case 1://可领取
                this.state.selectedIndex = 1;
                break;
            case 2://已领取
                this.state.selectedIndex = 2;
                break;
            case 3://未到条件领取
                this.state.selectedIndex = 0;
                break;
            default:
                this.state.selectedIndex = 0;
                break;
        }
        // if(this._info.startTime > this.playerModel.nowDate)
        // {
        //     this.state.selectedIndex = 0;
        // }
        // else
        // {
        //
        // }
    }

    renderGoodsListItem(index:number, item:BaseItem)
    {
        item.info = this._goodsArr[index];
    }

    //不同渲染聊天单元格
    private getListItemResource(index:number)
    {
        let data:any = this._goodsArr[index];
        //系统信息
        if(data instanceof StarInfo)
        {
            return StarItem.URL;//星运
        }
        else
        {
            return BaseItem.URL;//物品
        }
    }

    private getRewardBtnHandler()
    {
        if(FunnyManager.Instance.selectedFunnyData.endTime <= PlayerManager.Instance.currentPlayerModel.nowDate)
        {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"));
            return;
        }
        FunnyManager.Instance.sendGetBag(2, this._info.id);
    }

    private removeEvent()
    {
        this.btn_get.offClick(this, this.getRewardBtnHandler);
        // this.list.itemRenderer.recover();
        // this.list.itemProvider.recover();
        Utils.clearGListHandle(this.list);
    }

    dispose()
    {
        this.removeEvent();
        super.dispose();
    }
}