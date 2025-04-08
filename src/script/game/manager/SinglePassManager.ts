// @ts-nocheck
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { AlertTipAction } from "../battle/actions/AlertTipAction";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { TipMessageData } from "../datas/TipMessageData";
import { DelayActionsUtils } from "../utils/DelayActionsUtils";
import LangManager from '../../core/lang/LangManager';
import { GoodsManager } from "./GoodsManager";
import { MessageTipManager } from "./MessageTipManager";
import { TempleteManager } from "./TempleteManager";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import SinglePassModel from "../module/singlepass/SinglePassModel";
import { PackageIn } from "../../core/net/PackageIn";

import SinglePassMsg = com.road.yishi.proto.tollgate.SinglePassMsg;
import VipRouletteMsg = com.road.yishi.proto.vip.VipRouletteMsg;
import SinglePassCardInfo from "../module/singlepass/model/SinglePassCardInfo";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
import SinglePassSocketOutManager from "./SinglePassSocketOutManager";
import { t_s_campaigndataData } from "../config/t_s_campaigndata";
import SinglePassBugleInfo from "../module/singlepass/model/SinglePassBugleInfo";

/**
* @author:pzlricky
* @data: 2021-06-30 16:56
* @description *** 
*/
export default class SinglePassManager {

    private isFirstGetSinglePassInfo: boolean = true; //是否第一次请求天穹之径数据, 来判断是否需要右下角弹出提示有未领取的号角
    private static _instance: SinglePassManager;
    private _bugleLeftCount: number; //剩余可领取的号角数量
    public static get Instance(): SinglePassManager {
        if (!this._instance) {
            this._instance = new SinglePassManager();
        }
        return this._instance;
    }

    private _model: SinglePassModel;

    public get model(): SinglePassModel {
        return this._model;
    }

    public setup() {
        this._model = new SinglePassModel();
        ServerDataManager.listen(S2CProtocol.U_C_RES_SINGLEPASS_INFO, this, this.__resSinglePassInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_BUGLE_REQ, this, this.__bugleReqHandler);
        ServerDataManager.listen(S2CProtocol.U_C_BUGLE_REWARDS, this, this.__bugleRewardsHandler);
    }

    private __resSinglePassInfoHandler(pkg: PackageIn) {
        var msg: SinglePassMsg = pkg.readBody(SinglePassMsg) as SinglePassMsg;
        if(msg.from == 0){
            this._model.area = msg.area;
            this._model.maxIndex = msg.maxIndex;
            this._model.areaReward = msg.areaReward;
            this._model.count = msg.count;
            this._model.itemCount = msg.itemCount;
            var cardInfo: SinglePassCardInfo;
            for (const key in msg.rankInfo) {
                if (Object.prototype.hasOwnProperty.call(msg.rankInfo, key)) {
                    var rankInfoMsg = msg.rankInfo[key];
                    cardInfo = this._model.getCardInfoByIndex(rankInfoMsg.index);
                    cardInfo.judge = rankInfoMsg.rank;
                }
            }
            this._model.initFloors();
            this._model.commit();
            if (this.isFirstGetSinglePassInfo) {
                this.isFirstGetSinglePassInfo = false;
                this._bugleLeftCount = Number(this._model.maxIndex / SinglePassModel.REWARD_LIMIT) * this._model.bugleCount - this._model.itemCount;
                if (this._bugleLeftCount > 0) {
                    DelayActionsUtils.Instance.addAction(new AlertTipAction("", this.showHasBugleTips));
                }
            }
        }
        else{
            this._model.areaReward = msg.areaReward;
            this._model.updateRewardStatus();
        }
    }

    private showHasBugleTips(result: string = "") {
        var data: TipMessageData = new TipMessageData();
        data.type = TipMessageData.SINGLEPASS_HAS_BUGLE;
        data.content = LangManager.Instance.GetTranslation("taskTrace.SinglepassHasBugleYipsView.singlePassHas");
        var goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.templateId = 3150001;
        goodsInfo.count = this._bugleLeftCount;
        data.goods = goodsInfo;
        TaskTraceTipManager.Instance.showView(data);
    }

    private __bugleReqHandler(pkg: PackageIn) {
        var msg: VipRouletteMsg = pkg.readBody(VipRouletteMsg) as VipRouletteMsg;
        var info: SinglePassBugleInfo = new SinglePassBugleInfo();
        info.itemList = msg.leftItem;
        this._model.updateBugleInfo(info);
    }

    private __bugleRewardsHandler(pkg: PackageIn) {
        var msg: VipRouletteMsg = pkg.readBody(VipRouletteMsg) as VipRouletteMsg;
        var info: SinglePassBugleInfo = new SinglePassBugleInfo();
        info.needPoint = msg.needVipItem;
        info.openCount = msg.leftCount;
        info.openIndex = msg.openIndex;
        info.itemList = msg.leftItem;
        this._model.updateBugleRewards(info);
    }

    public sendRequestSinglePassAttack(targetIndex: number) {
        var content: string;
        var propCount: number = GoodsManager.Instance.getGoodsNumByTempId(SinglePassModel.PROP_TEMPLATE_ID);
        if (this._model.count >= this._model.maxCount && propCount <= 0) {
            content = LangManager.Instance.GetTranslation("managers.SinglePassManager.TipsTxt01");
            MessageTipManager.Instance.show(content);
            return;
        }
        if (targetIndex > this._model.maxIndex + 1) {
            content = LangManager.Instance.GetTranslation("managers.SinglePassManager.TipsTxt02");
            MessageTipManager.Instance.show(content);
            return;
        }
        if (this._model.isMaxJudge(targetIndex)) {
            content = LangManager.Instance.GetTranslation("managers.SinglePassManager.TipsTxt03");
            MessageTipManager.Instance.show(content);
            return;
        }
        var singlePassInfo: SinglePassCardInfo = this._model.getCardInfoByIndex(targetIndex);
        var data:t_s_campaigndataData = TempleteManager.Instance.getGodArriveData(SinglePassModel.CAMPAIGN_TEMPLATE_ID, singlePassInfo.tollgate);
        var quardList: Array<string> = LangManager.Instance.GetTranslation("singlepass.view.SinglePassCardItemView.PetTypeList").split("|");
        content = LangManager.Instance.GetTranslation("singlepass.SinglePassView.SinglePassAttack");
        if (singlePassInfo.judge > 0) {
            content = LangManager.Instance.GetTranslation("singlepass.SinglePassView.SinglePassAttackAgain");
        }
        else {
            content += LangManager.Instance.GetTranslation("singlepass.SinglePassView.Suggest", quardList[parseInt(data.Param5) - 1]);
        }
        SimpleAlertHelper.Instance.data = [this.beginBattle, targetIndex];
        SimpleAlertHelper.Instance.popAlerFrame(LangManager.Instance.GetTranslation("public.prompt"), content, LangManager.Instance.GetTranslation("public.confirm"), LangManager.Instance.GetTranslation("public.cancel"));
       
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [targetIndex], prompt, content, confirm, cancel, this.beginBattle.bind(this));
    }

    private beginBattle(b: boolean, flag: boolean, data: any[]) {
        if (b) {
            let targetIndex = data[0];
            this._model.selectIndex = targetIndex;
            this._model.lastIndex = targetIndex;
            SinglePassSocketOutManager.sendRequestSinglePassAttack(targetIndex);
        }
    }

    public needTurnNext(): boolean {
        var endIndex: number = this._model.selectArea * SinglePassModel.TOLLGATE_PER_FLOOR;
        if (this.getCardIndex() != 0 && this._model.lastIndex == this._model.maxIndex && this._model.maxIndex != endIndex && this._model.selectArea == this._model.area) {
            return true;
        }
        return false;
    }

    public getCardIndex(): number {
        var endIndex: number = this._model.selectArea * SinglePassModel.TOLLGATE_PER_FLOOR;
        var startIndex: number = endIndex - SinglePassModel.TOLLGATE_PER_FLOOR + 1;
        if (this._model.selectArea == this._model.area && this._model.selectIndex >= startIndex && this._model.selectIndex <= endIndex) {
            if (this._model.selectIndex == endIndex) {
                return SinglePassModel.TOLLGATE_PER_FLOOR - 1;
            }
            else {
                return this._model.selectIndex - startIndex + 1;
            }
        }
        return 0;
    }

}