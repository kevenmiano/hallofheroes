import { RemotePetEvent } from "../../../core/event/RemotePetEvent";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { NumericStepper } from "../../component/NumericStepper";
import ItemID from "../../constant/ItemID";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { RemotePetManager } from "../../manager/RemotePetManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { RemotePetModel } from "../../mvc/model/remotepet/RemotePetModel";
import MopupItem from "../mopup/item/MopupItem";
import { eMopupItemType } from "../mopup/MopupData";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";

export class RemoteMopupWnd extends BaseWindow {

    public frame: fgui.GComponent;
    public lineimg: fgui.GImage;
    public _startMopupBtn: fgui.GButton;
    public stepper: NumericStepper;
    public powerIcon: fgui.GLoader;
    public txtCountDesc: fgui.GTextField;
    public powerLab: fgui.GTextField;

    public gCost: fgui.GGroup;
    public prepareGroup: fgui.GGroup;
    public list: fgui.GList;
    public _closetMopupBtn: fgui.GButton;
    public mopupingGroup: fgui.GGroup;

    private _turnCounts: number = 0;

    //扫荡关卡计数器
    private _layerCount = 0;

    //可以扫荡的最大关卡
    private maxMopup = 0;

    private weary = 0;

    private remoteMopupDatas: RemoteMopupData[];

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
    }

    public OnShowWind(): void {
        super.OnShowWind();
        this.initData();
        this.addEvent();
    }

    private initData() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderMopupList, null, false);
        this.list.setVirtual();

        //未挑战, 没有最高关卡
        this.maxMopup = 0;
        if (this.model.turnInfo.maxTurnItemInfo) {
            this.maxMopup = this.model.turnInfo.maxTurnItemInfo.tempInfo.Sweep;
        }



        //扫荡数量
        this._turnCounts = this.maxMopup - this.model.turnInfo.currTurn + 1;

        if (this._turnCounts < 0) this._turnCounts = 0;

        this.prepareGroup.visible = true;
        this.mopupingGroup.visible = false;

        this.weary = +ConfigInfoManager.Instance.getPetRemoteWeary()

        let wearyCount = Math.floor(PlayerManager.Instance.currentPlayerModel.playerInfo.weary / this.weary);

        this._turnCounts = Math.min(this._turnCounts, wearyCount);

        this.maxMopup = Math.min(this.maxMopup, this.model.turnInfo.currTurn + wearyCount-1);

        this.powerLab.text = (this._turnCounts || 1) * this.weary + "";

        this.stepper.show(0,this.maxMopup, this.model.turnInfo.currTurn, this.maxMopup, this.maxMopup, 1, Laya.Handler.create(this, this.textChangeHandler, null, false));

        //上线初始化的时候判断扫荡是否结束
        if (this.model.mopupCount > 0) {
            RemotePetManager.sendMopupOP(9, 0);//扫荡取消
        }
    }

    private addEvent() {
        this._startMopupBtn.onClick(this, this.startMopupHandler);
        this._closetMopupBtn.onClick(this, this.hide);
        this.model.addEventListener(RemotePetEvent.UPDATEMOPUP, this.refreshMopup, this);
    }

    private removeEvent() {
        this._startMopupBtn.offClick(this, this.startMopupHandler);
        this.model.removeEventListener(RemotePetEvent.UPDATEMOPUP, this.refreshMopup, this);
        Laya.timer.clear(this, this.onceCheck);
    }

    private startMopupHandler() {
        let isInAAS = PlayerManager.Instance.currentPlayerModel.isInAAS;
        let str = "";
        let model = this.model;
        let mopupLayer = this.stepper.value
        if (isInAAS && PlayerManager.Instance.currentPlayerModel.indulgeTime / 3600 >= 3) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("remotepet.mopup.inAAS"));
            return;
        } else if (mopupLayer == 0) {
            str = LangManager.Instance.GetTranslation("mopup.view.RemoteMopupPrepareFrame.layerTipData1");
            MessageTipManager.Instance.show(str);
            return;
        } else if (mopupLayer < model.turnInfo.currTurn) {
            str = LangManager.Instance.GetTranslation("mopup.view.RemoteMopupPrepareFrame.layerTipData2");
            MessageTipManager.Instance.show(str);
            return;
        }
        else if (mopupLayer > (+this.maxMopup)) {
            str = LangManager.Instance.GetTranslation("mopup.view.RemoteMopupPrepareFrame.layerTipData3");
            MessageTipManager.Instance.show(str);
            return;
        }

        if (this._turnCounts * this.weary > PlayerManager.Instance.currentPlayerModel.playerInfo.weary) {//体力不足
            if (this.hasWearyMedicine()) {//背包拥有体力药水时,弹出体力补充弹窗
                FrameCtrlManager.Instance.open(EmWindow.WearySupplyWnd, { type: 1 });
            } else if (!this.hasWearyMedicine()) {//背包无体力药水时
                if (this.todayCanBuyWearyMedicine()) {//今日还能购买, 弹出高级体力药水快捷购买弹窗
                    let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(ItemID.WEARY_MEDICINE3);
                    if (info) {
                        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info });
                    }
                } else {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData03"));
                }
            }
            return;
        }
        RemotePetManager.sendMopup(mopupLayer);
        this.gotoMopup();
        Laya.timer.once(100, this, this.onceCheck);
    }

    private onceCheck() {
        RemotePetManager.sendMopupOP(10, 0);
    }

    private gotoMopup() {
        RemotePetManager.Instance.model.mopupList = [];
        this._layerCount = this.model.turnInfo.currTurn;
        this.prepareGroup.visible = false;
        this.mopupingGroup.visible = true;
        this.remoteMopupDatas = [];
        this.refreshList();
    }

    private textChangeHandler() {
        this._turnCounts = this.stepper.value - this.model.turnInfo.currTurn + 1;
        if (this._turnCounts < 0) {
            this._turnCounts = 0;
        }
        this.powerLab.text = (this._turnCounts || 1) * this.weary + "";
    }

    //一次性所有数据都会到来,已合并成一条数据
    private refreshMopup() {
        let model = this.model;
        let mopupList = model.mopupList;
        let i = 0;
        let remoteData: RemoteMopupData;
        for (let mopup of mopupList) {
            this.addMopupData();
            remoteData = this.remoteMopupDatas[i];
            remoteData.state = eMopupItemType.Mopuped;
            this._layerCount = remoteData.data.count = mopup.count;
            this._layerCount = mopup.count + 1;
            remoteData.data.items = this.parseGoodsInfo(mopup.items);
            i++;
        }
        this.refreshList();
    }

    private parseGoodsInfo(items: string) {
        let splitList = items.split("|");
        let goodsList: GoodsInfo[] = [];
        let goodsTemp: GoodsInfo = null;
        let arr: string[];
        let templateId = 0;
        let count = 0;
        for (let split of splitList) {
            if (!split || split.length == 0) continue;
            arr = split.split(",");
            templateId = +arr[0];
            count = +arr[1];
            goodsTemp = new GoodsInfo();
            goodsTemp.templateId = templateId;
            goodsTemp.count = count;
            goodsList.push(goodsTemp);
        }
        return goodsList;
    }

    private renderMopupList(index: number, item: MopupItem) {
        let data = this.remoteMopupDatas[index];
        item.itemType = data.state;
        item.setTitle("");
        item.setItemList(data.data.items);
    }

    // 添加提示Item
    private addMopupData(type: eMopupItemType = eMopupItemType.Mopuping) {
        let mopupData = { state: type, data: { count: this._layerCount, items: null } };
        this.remoteMopupDatas.push(mopupData);
    }

    private refreshList() {
        this.list.numItems = this.remoteMopupDatas.length;
    }

    public get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }

    private hasWearyMedicine(): boolean {
        let num0: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE0)
        let num1: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE1)
        let num2: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE2)
        let num3: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE3)
        return num0 > 0 || num1 > 0 || num2 > 0 || num3 > 0
    }

    //今日是否还能购买高级体力药水
    private todayCanBuyWearyMedicine(): boolean {
        let flag: boolean = false;
        let shopGoodsInfo: any = TempleteManager.Instance.getShopTempInfoByItemId(ItemID.WEARY_MEDICINE3);
        let num: number = shopGoodsInfo.canOneCount;
        if (num > 0) {
            flag = true;
        }
        return flag;
    }

    public OnHideWind(): void {
        this.removeEvent();
        RemotePetManager.sendMopupOP(9, 0);//扫荡取消
    }

}

type RemoteMopupData = {
    state: eMopupItemType,
    data: { count: number, items: GoodsInfo[] }
}