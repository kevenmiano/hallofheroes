/**
 * 宝箱掉落
 */
import LangManager from '../../../../../core/lang/LangManager';
import BaseWindow from '../../../../../core/ui/Base/BaseWindow';
import UIButton from '../../../../../core/ui/UIButton';
import { NotificationEvent } from '../../../../constant/event/NotificationEvent';
import { GoodsInfo } from '../../../../datas/goods/GoodsInfo';
import { CampaignSocketOutManager } from '../../../../manager/CampaignSocketOutManager';
import { GoodsManager } from '../../../../manager/GoodsManager';
import { MessageTipManager } from '../../../../manager/MessageTipManager';
import { NotificationManager } from '../../../../manager/NotificationManager';
import { GoodsCheck } from '../../../../utils/GoodsCheck';
import { NodeState } from '../../../space/constant/NodeState';
import { CampaignNode } from '../../../space/data/CampaignNode';
import { MapPhysics } from '../../../space/data/MapPhysics';
import { PhysicsChestView } from '../../data/PhysicsChestView';
import BattleFallGoodsItem from './BattleFallGoodsItem';
export default class BattleFallGoodsWnd extends BaseWindow {

    private list: fgui.GList = null;
    private Btn_confirm: UIButton;
    private _data: any;
    private _backCall: Function;
    private nodeInfo: MapPhysics;
    private arrayData: Array<GoodsInfo>;
    private signId: string;
    public OnInitWind() {
        super.OnInitWind();
        this.addEvent();
        this.setCenter();
    }

    OnShowWind() {
        super.OnShowWind();
        this._data = this.params;
        if (this._data) {
            this._backCall = this._data.callBack;
            this.nodeInfo = this._data.nodeInfo;
            this.arrayData = this._data.arrayData;
            this.signId = this._data.signId;
            this.refreshView();
        }
    }

    private refreshView() {
        while (this.list.numChildren > 0) {
            this.list.removeChildToPoolAt(0);
        }
        if (this.arrayData && this.arrayData.length > 0)
            for (let i: number = 0; i < this.arrayData.length; i++) {
                let element: GoodsInfo = this.arrayData[i];
                let battleFallGoodsItem: BattleFallGoodsItem = <BattleFallGoodsItem>this.list.addItemFromPool();
                battleFallGoodsItem.vData = element;
            }
        this.list.ensureBoundsCorrect();
    }

    private addEvent() {
        this.Btn_confirm.onClick(this, this.__BtnConfirmHandler.bind(this));
        NotificationManager.Instance.addEventListener(NotificationEvent.OPEN_CHEST_BOX, this.__openNewBoxHandler, this);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
    }

    private removeEvent() {
        this.Btn_confirm.offClick(this, this.__BtnConfirmHandler.bind(this));
        NotificationManager.Instance.removeEventListener(NotificationEvent.OPEN_CHEST_BOX, this.__openNewBoxHandler, this);
        this.list.off(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
    }

    private onClickItem(selectedItem: BattleFallGoodsItem) {
        if (selectedItem && selectedItem.vData) {
            this.pickUpGoods(selectedItem.vData);
        }
    }

    private pickUpGoods(goods: GoodsInfo): boolean {
        if (this.canPickup(goods)) {
            this.sendGetSimpleGoods(goods.templateId);
            if (this.arrayData && this.arrayData.length > 0) {
                this.refreshView();
            }
            return true;
        } else {
            var tip: string = LangManager.Instance.GetTranslation("map.campaign.view.fall.command01");
            MessageTipManager.Instance.show(tip);
            return false;
        }
    }

    private canPickup(goods: GoodsInfo): boolean {
        if (GoodsCheck.isGoldInCampaign(goods)) return true;
        var maxCount: number = goods.templateInfo.MaxCount;
        var countInBag: number = GoodsManager.Instance.getGoodsNumByTempId(goods.templateId);
        if (countInBag % maxCount == 0) {
            var bagNullCount: number = GoodsManager.Instance.getEmputyPosCount();
            return bagNullCount != 0;
        }
        return true;
    }

    private sendGetSimpleGoods(id: number) {
        CampaignSocketOutManager.Instance.getFallChest(this.signId, id, 0);
        for (var i: number = 0; i < this.arrayData.length; i++) {
            var info: GoodsInfo = this.arrayData[i] as GoodsInfo;
            if (info && info.templateId == id) this.arrayData.splice(i, 1);
        }
        if (this.nodeInfo as CampaignNode) {
            (this.nodeInfo as CampaignNode).tempData = this.arrayData;
            var nodeView: PhysicsChestView = (this.nodeInfo as CampaignNode).nodeView as PhysicsChestView
            if (nodeView) nodeView.goods = this.arrayData;
        }
        if (this.arrayData.length == 0) {
            this.nodeInfo.info.state = NodeState.DESTROYED;
            this.nodeInfo.commit();
            this.nodeInfo = null;
            this.OnBtnClose();
        }
    }

    private __BtnConfirmHandler() {
        CampaignSocketOutManager.Instance.getFallChest(this.signId, 0, 0);
        this.nodeInfo.info.state = NodeState.DESTROYED;
        this.nodeInfo.commit();
        this.nodeInfo = null;
        this.OnBtnClose();
    }

    private __openNewBoxHandler() {
        this.OnBtnClose();
    }

    OnHideWind() {
        this.removeEvent();
        this._backCall && this._backCall(); this._backCall = null;
        if (this.nodeInfo && this.nodeInfo.info.state == NodeState.HIDE) {
            this.nodeInfo.info.state = NodeState.EXIST;
            this.nodeInfo.commit();
        }
        super.OnHideWind();
    }
}