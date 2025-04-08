import FUI_SevenLoginItem from "../../../../../fui/Funny/FUI_SevenLoginItem";
import LangManager from "../../../../core/lang/LangManager";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import FunnyManager from "../../../manager/FunnyManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import StarInfo from "../../mail/StarInfo";
import FunnyBagData from "../model/FunnyBagData";
import { GoodsManager } from '../../../manager/GoodsManager';
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { BaseItem } from "../../../component/item/BaseItem";
import Utils from "../../../../core/utils/Utils";

export default class SevenLoginItem extends FUI_SevenLoginItem {
    private _info: FunnyBagData;
    private _goodsArr: Array<any>;
    protected onConstruct() {
        super.onConstruct();
        this.initEvent();

    }

    private initEvent() {
        this.getRewardBtn.onClick(this, this.getBtnHandler);
        Utils.setDrawCallOptimize(this.exchangeList1);
        this.exchangeList1.itemRenderer = Laya.Handler.create(this, this.renderGoodsListItem, null, false);
    }

    private removeEvent() {
        this.getRewardBtn.offClick(this, this.getBtnHandler);
        // this.exchangeList1.itemRenderer.recover()
        Utils.clearGListHandle(this.exchangeList1);
    }

    renderGoodsListItem(index: number, item: BaseItem) {
        item.info = this._goodsArr[index];
    }
    
    private getBtnHandler() {
        if (FunnyManager.Instance.selectedFunnyData.endTime <= PlayerManager.Instance.currentPlayerModel.nowDate) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"));
            return;
        }
        FunnyManager.Instance.sendGetBag(2, this._info.id);
    }

    public set info(value: FunnyBagData) {
        this._info = value;
        if (this._info) {
            this._goodsArr = [];
            let _data = this._info;
            let day:number = this._info.conditionList[0].value;
            this.dayTxt.text =  LangManager.Instance.GetTranslation("SevenLoginItem.dayTxt",day);
            for (var i: number = 0; i < _data.rewardList.length; i++) {
                if (_data.rewardList[i].temType == 1) {
                    var ginfo: GoodsInfo = new GoodsInfo();
                    ginfo.templateId = _data.rewardList[i].temId;
                    ginfo.count = _data.rewardList[i].count;
                    ginfo.isBinds = _data.rewardList[i].isBind;
                    ginfo.strengthenGrade = _data.rewardList[i].strengthenGrade <= 0 ? 1 : _data.rewardList[i].strengthenGrade;
                    if (GoodsManager.Instance.filterEquip(ginfo)) {
                        this._goodsArr.push(ginfo);
                    } else {
                        continue;
                    }
                } else if (_data.rewardList[i].temType == 2) {
                    var starInfo: StarInfo = new StarInfo();
                    starInfo.template = TempleteManager.Instance.getStarTemplateById(_data.rewardList[i].temId);
                    starInfo.count = _data.rewardList[i].count;
                    starInfo.grade = _data.rewardList[i].strengthenGrade <= 0 ? 1 : _data.rewardList[i].strengthenGrade;
                    if (!GoodsManager.Instance.filterStar(starInfo)) continue;
                    this._goodsArr.push(starInfo);
                }
            }
            this.exchangeList1.numItems = this._goodsArr.length;
            this.setState();
        }
    }

     /**
     * 设置领取状态
     * */
      public setState() {
        if (this._info == null) return;
        switch (this._info.status) {
            case 1://可领取
                this.c1.selectedIndex = 0;
                break;
            case 2://已领取
                this.c1.selectedIndex = 2;
                break;
            case 3://未到条件领取
                this.c1.selectedIndex = 1;
                break;
            default:
                this.c1.selectedIndex = 1;
                break;
        }
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}