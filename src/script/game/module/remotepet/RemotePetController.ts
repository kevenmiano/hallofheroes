// @ts-nocheck
import Logger from "../../../core/logger/Logger";
import ByteArray from "../../../core/net/ByteArray";
import ResMgr from "../../../core/res/ResMgr";
import UIManager from "../../../core/ui/UIManager";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { EmWindow } from "../../constant/UIDefine";
import { PathManager } from "../../manager/PathManager";
import { RemotePetManager } from "../../manager/RemotePetManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { RemotePetModel } from "../../mvc/model/remotepet/RemotePetModel";
import { RemotePetOrderInfo } from "../../mvc/model/remotepet/RemotePetOrderInfo";
import { RemotePetTurnItemInfo } from "../../mvc/model/remotepet/RemotePetTurnItemInfo";


export class RemotePetController {


    private static _instance: RemotePetController

    public static get Instance(): RemotePetController {
        if (!this._instance) { this._instance = new RemotePetController(); }
        return this._instance;
    }

    public startFrameByType(type: number) {
        // if (type == 1) {
        // UIManager.Instance.ShowWind(EmWindow.RemotePetWnd);
        FrameCtrlManager.Instance.open(EmWindow.RemotePetWnd)
        // } else if (type == 2 && this.model.isFrist) {
        //     UIManager.Instance.ShowWind(EmWindow.RemotePetTurnWnd);
        // }
    }

    public initTurnsData() {
        let turnsListDic = TempleteManager.Instance.getRemotePetTurns()
        let model = this.model;
        if (turnsListDic) {
            let itemInfo: RemotePetTurnItemInfo;
            if (model.turnInfo.remotePetTurnList.length == 0) {
                for (let info of turnsListDic) {
                    itemInfo = new RemotePetTurnItemInfo();
                    ObjectUtils.copyProperties(info, itemInfo.tempInfo);
                    model.turnInfo.remotePetTurnList.push(itemInfo);
                }
                model.turnInfo.remotePetTurnList.sort(this.sortTurn);
            }
        }
        model.turnInfo.reseData();
        model.turnInfo.updateShowTurnList();
        model.updatePage();
        model.commitTurnList();
    }

    private sortTurn(a: RemotePetTurnItemInfo, b: RemotePetTurnItemInfo): number {
        if (a.tempInfo.Index < b.tempInfo.Index) return -1;
        if (a.tempInfo.Index > b.tempInfo.Index) return 1;
        // if (a.tempInfo.Type < b.tempInfo.Type) return -1;
        // if (a.tempInfo.Type > b.tempInfo.Type) return 1;
        return 0;
    }

    public loadRemotePetOrderData() {
        let path = PathManager.getRemotePetOrderPath();
        ResMgr.Instance.loadRes(path, this.__OrderLoadCompleteHandler.bind(this), null, Laya.Loader.BUFFER)
    }

    private __OrderLoadCompleteHandler(res: any) {

        if (res) {
            let contentStr = "";
            try {
                let content: ByteArray = new ByteArray();
                content.writeArrayBuffer(res);
                if (content && content.length) {
                    content.position = 0;
                    content.uncompress();
                    contentStr = content.readUTFBytes(content.bytesAvailable);
                    content.clear();
                }
            } catch (error) {
                Logger.error('getRemotePetOrderPath __onXMLDataLoaded Error');
                return;
            }


            let model = this.model;
            let rankData: any = JSON.parse(contentStr);
            model.orderTime = rankData.RemotePetOrders.info.createDate;
            model.orderList = [];
            let rankArray: any[] = [];
            if (rankData && rankData.RemotePetOrders.RemotePetOrder) {
                let RemotePetOrder = rankData.RemotePetOrders.RemotePetOrder;
                if (!Array.isArray(RemotePetOrder)) {
                    RemotePetOrder = [RemotePetOrder]
                }
                rankArray = RemotePetOrder;
            }

            for (let i: number = 0; i < rankArray.length; i++) {
                let item = rankArray[i];
                let orderInfo: RemotePetOrderInfo = new RemotePetOrderInfo();
                orderInfo.userId = +item.UserId;
                orderInfo.nickName = item.NickName;
                orderInfo.fight = +item.Fight;
                orderInfo.consortiaName = item.ConsortiaName;
                orderInfo.grades = +item.Grades;
                orderInfo.order = +item.Order;
                orderInfo.index = +item.Index;
                orderInfo.fightingCapacity = +item.FightingCapacity;
                orderInfo.isVip = item.IsVip == "true";
                model.orderList.push(orderInfo);
            }
            model.orderList.sort(this.sortOrder);
            model.updateOrderList();

        }
    }

    private sortOrder(a: RemotePetOrderInfo, b: RemotePetOrderInfo): number {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
    }

    public pageLookHandler(isPrePage: boolean) {
        let model = this.model;
        if (isPrePage && model.turnInfo.currPage > 1)
            model.turnInfo.currPage--;
        else if (!isPrePage && model.turnInfo.currPage < model.turnInfo.totalPage)
            model.turnInfo.currPage++;
        else return;
        model.turnInfo.updateShowTurnList();
        model.updatePage();
        model.commitTurnList();
    }


    public get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }
}