import { RemotePetEvent } from "../../../core/event/RemotePetEvent";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Utils from "../../../core/utils/Utils";
import { RemotePetManager } from "../../manager/RemotePetManager";
import { RemotePetModel } from "../../mvc/model/remotepet/RemotePetModel";
import { RemotePetOrderInfo } from "../../mvc/model/remotepet/RemotePetOrderInfo";
import { RemotePetController } from "./RemotePetController";
import { RemotePetOrderItemView } from "./view/RemotePetOrderItemView";

export class RemotePetOrderWnd extends BaseWindow {

    public frame: fgui.GLabel;
    public t_bg: fgui.GImage;
    public RankList: fgui.GList;
    public RankTxt: fgui.GTextField;
    public UserNameTxt: fgui.GTextField;
    public PowerNumTxt: fgui.GTextField;
    public PassLayerNumTxt: fgui.GTextField;
    public myRankItem: RemotePetOrderItemView;


    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();
        RemotePetController.Instance.loadRemotePetOrderData();
    }

    private orderList: RemotePetOrderInfo[];

    public OnShowWind() {
        super.OnShowWind();
    }

    private addEvent() {
        this.RankList.setVirtual();
        this.RankList.itemRenderer = Laya.Handler.create(this, this.onRankRender, null, false);
        this.model.addEventListener(RemotePetEvent.ORDERDATA_LOAD_COMPLETE, this.__completeHandler, this);
        this.model.addEventListener(RemotePetEvent.UPDATEORDER, this.__updateHandler, this);
    }


    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private __completeHandler() {
        this.orderList = this.model.orderList;
        this.RankList.numItems = this.orderList.length;
    }

    private __updateHandler() {
        this.__completeHandler();
    }

    private onRankRender(index: number, box: RemotePetOrderItemView) {
        box.info = this.orderList[index];
    }

    private removeEvent() {
        this.model.removeEventListener(RemotePetEvent.ORDERDATA_LOAD_COMPLETE, this.__completeHandler, this);
        this.model.removeEventListener(RemotePetEvent.UPDATEORDER, this.__updateHandler, this);
        // this.RankList.itemRenderer.recover();
        Utils.clearGListHandle(this.RankList);
    }

    public get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }

}