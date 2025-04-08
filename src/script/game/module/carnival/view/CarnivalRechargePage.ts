// @ts-nocheck
import FUI_CarnivalRechargePage from "../../../../../fui/Carnival/FUI_CarnivalRechargePage";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import UIButton from "../../../../core/ui/UIButton";
import { t_s_carnivalluckdrawData } from "../../../config/t_s_carnivalluckdraw";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { ChatChannel } from "../../../datas/ChatChannel";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import CarnivalManager from "../../../manager/CarnivalManager";
import { ChatManager } from "../../../manager/ChatManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import ChatData from "../../chat/data/ChatData";
import MainToolBar from "../../home/MainToolBar";
import MaskLockOper from "../../../component/MaskLockOper";
import CarnivalModel, { CARNIVAL_FOLDER } from "../model/CarnivalModel";
import { LightTurnController } from "../utils/LightTurnController";
import { CarnivalBasePage } from "./CarnivalBasePage";
import { CarnivalRechargeItem } from "./CarnivalRechargeItem";
import { getDefaultLangageKey, getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";

/**
 * 嘉年华---充值有礼
 */
export default class CarnivalRechargePage extends FUI_CarnivalRechargePage implements CarnivalBasePage {

    private _outLightCc: LightTurnController;
    private _inLightCc: LightTurnController;
    private _outDic: Array<CarnivalRechargeItem>;
    private _inDic: Array<CarnivalRechargeItem>;
    private _isDie = false;
    private _tipPools: Array<t_s_carnivalluckdrawData> = [];
    // private luckyBtn: UIButton;

    private tenBtn: UIButton;
    private oneBtn: UIButton;

    protected onConstruct() {
        super.onConstruct();
        this.lang.selectedIndex = getdefaultLangageCfg().index - 1;
        this.tenBtn = new UIButton(this._tenBtn);
        this.oneBtn = new UIButton(this._oneBtn);
        this.initTranslate();
        this.initView();
        this.addEvent()
    }

    addEvent() {
        // this.luckyBtn.onClick(this, this.clickHandler);
        this.oneBtn.onClick(this, this.clickHandler, [1]);
        this.tenBtn.onClick(this, this.clickHandler, [10]);
    }

    offEvent() {
        // this.luckyBtn.offClick(this, this.clickHandler);
        this.oneBtn.offClick(this, this.clickHandler);
        this.tenBtn.offClick(this, this.clickHandler);
    }

    onShow() {
        MainToolBar.FLASH_NEW_GOODS = false;
        TaskTraceTipManager.Instance.showTraceTip = false;
        this.refreshView();
    }

    private initTranslate() {
        this.tenBtn.title = LangManager.Instance.GetTranslation("Carnival.CarnivalRecharge.tenBtn");
        this.oneBtn.title = LangManager.Instance.GetTranslation("Carnival.CarnivalRecharge.oneBtn");
    }

    private initView() {
        this.Img_CarnivalRecharge_Bg.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.RECHARGE, "Img_CarnivalRecharge_Bg");
        this.Img_Txt_Carnival_Recharge.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.RECHARGE, "Img_Txt_Carnival_Recharge" + "_" + getDefaultLangageKey());
        this.Img_CarnivalRecharge_Frame.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.RECHARGE, "Img_CarnivalRecharge_Frame");
        this.addOutItems();
        this.addInItems();
    }

    private addOutItems() {
        let outDataList = TempleteManager.Instance.getCarnivalLuckDrawTempList(1, 1)
        outDataList.unshift(null);
        outDataList.splice(8, 0, null);
        let rechargeItem: CarnivalRechargeItem;
        this._outDic = [];
        for (let i = 0; i < 16; i++) {
            let temp = outDataList[i];;
            rechargeItem = this.outItemGroup.getChildAt(i) as CarnivalRechargeItem;
            rechargeItem.init(temp ? 1 : 0)
            rechargeItem.tempInfo = temp;
            rechargeItem.idx = i;
            this._outDic.push(rechargeItem);
        }

        this._outLightCc = new LightTurnController(this._outDic, 5, 2000, 35, this, this.outCallBack, 6);
        this._outLightCc.initIdx(1);

        let cfg = TempleteManager.Instance.getConfigInfoByConfigName("CarnivalPayLuckyDraw");
        let count = 100;
        if (cfg) {
            count = Number(cfg.ConfigValue);
        }
        this.perCount.text = count.toString();
    }

    private addInItems() {
        let inDataList = TempleteManager.Instance.getCarnivalLuckDrawTempList(1, 2)
        let rechargeItem: CarnivalRechargeItem;
        this._inDic = [];
        let len = inDataList.length;
        for (let i = 0; i < len; i++) {
            let temp = inDataList[i];
            rechargeItem = this.inItemGroup.getChildAt(i) as CarnivalRechargeItem;
            rechargeItem.init(temp ? 1 : 0)
            rechargeItem.tempInfo = temp;
            rechargeItem.idx = i;
            this._inDic.push(rechargeItem);
        }
        this._inLightCc = new LightTurnController(this._inDic, 5, 1500, 35, this, this.inCallBack, 6);
    }


    private outCallBack(needIn: boolean, inTargetIdx: number) {
        if (this._isDie) return;
        if (needIn) {
            this._outLightCc.clearLight(true);
            this._inLightCc.start(inTargetIdx);
        } else {
            MaskLockOper.Instance.doCall(false);
            this.resetBtnState();
        }

    }


    private inCallBack() {
        if (this._isDie) return;
        MaskLockOper.Instance.doCall(false);
        this.resetBtnState();
    }

    private resetBtnState() {
        // this.luckyBtn.enabled = this.model.lotteryCount > 0;
        this.oneBtn.enabled = this.model.lotteryCount > 0;
        this.tenBtn.enabled = this.model.lotteryCount >= 10;
        this.showRewardTipInfo();
    }

    private showRewardTipInfo() {
        if (this._tipPools == null || this._tipPools.length == 0) return;
        let temp;
        let goodss: GoodsInfo[] = []
        while (temp = this._tipPools.pop()) {
            if (temp) {
                MainToolBar.FLASH_NEW_GOODS = true;
                let gTemp = TempleteManager.Instance.getGoodsTemplatesByTempleteId(temp.Item);
                if (gTemp) {
                    let goodsInfo = new GoodsInfo();
                    goodsInfo.templateId = gTemp.TemplateId;
                    goodsInfo.count = temp.ItemNum;
                    let rewardStr = LangManager.Instance.GetTranslation("carnival.recharge.get", gTemp.TemplateNameLang, temp.ItemNum);
                    MessageTipManager.Instance.show(rewardStr);
                    let chatData: ChatData = new ChatData();
                    chatData.channel = ChatChannel.INFO;
                    chatData.type = 1;
                    chatData.msg = rewardStr;
                    chatData.commit();
                    ChatManager.Instance.model.addChat(chatData);
                    goodss.push(goodsInfo);
                }
            }
        }

        //播放飘获得动画
        GoodsManager.Instance.dispatchEvent(BagEvent.NEW_GOODS, goodss);
    }

    private clickHandler(v, e, c: number[]) {
        // this.luckyBtn.enabled = false;
        this.oneBtn.enabled = false;
        this.tenBtn.enabled = false;
        MainToolBar.FLASH_NEW_GOODS = false;
        TaskTraceTipManager.Instance.showTraceTip = false;
        MaskLockOper.Instance.doCall(true);
        let count = c[0];
        //不足10 次，开完剩余的所有次数。
        if (count == 10) {
            this.model.lotteryCount < 10 && (count = this.model.lotteryCount)
        }
        CarnivalManager.Instance.opRequest(CarnivalManager.OP_CHARGE_LOTTERY, 0, count);
    }

    private _currRestId: number = 0;

    protected updateInfoHandler() {
        this.refreshView();
        let restIds = this.model.result.split(",");

        let restId = +restIds[restIds.length - 1];

        if (restId <= 0) {
            MainToolBar.FLASH_NEW_GOODS = true;
            TaskTraceTipManager.Instance.showTraceTip = true;
            MaskLockOper.Instance.doCall(false);
            return;
        }
        this._currRestId = restId;


        for (let rewardId of restIds) {
            let temp = TempleteManager.Instance.getCarnivalLuckDrawTempInfo(+rewardId);
            this._tipPools.push(temp);
        }


        let outTargetIdx = 0;
        let needIn = true;
        let item: CarnivalRechargeItem;
        for (item of this._outDic) {
            if (item.tempInfo && item.tempInfo.Id == restId) {
                outTargetIdx = item.idx;
                needIn = false;
                break;
            }
        }

        this._inLightCc.clearLight();
        let inTargetIdx = 0;
        if (needIn) {
            for (let item of this._inDic) {
                if (item.tempInfo && item.tempInfo.Id == restId) {
                    inTargetIdx = item.idx;
                    break;
                }
            }
            let randomOut = Math.random() * 2;
            outTargetIdx = randomOut == 1 ? 8 : 0;
            this._outLightCc.start(outTargetIdx, [true, inTargetIdx]);
        } else {
            this._outLightCc.start(outTargetIdx, [false, inTargetIdx]);
        }
    }

    private refreshView() {
        this._allCountTxt.setVar("count", "" + this.model.lotteryCount).flushVars();
        // this.luckyBtn.enabled = this.model.lotteryCount > 0;
        this.oneBtn.enabled = this.model.lotteryCount > 0;
        this.tenBtn.enabled = this.oneBtn.enabled;
        this.carnival_recharge.type.selectedIndex = 2;
        this.carnival_recharge.txt_title.text = LangManager.Instance.GetTranslation("carnival.allRecharge");
        this.carnival_recharge.txt_value.text = " " + this.model.totalCharge.toString();
        this.carnival_recharge.ensureSizeCorrect();
    }

    private clearView() {

    }

    onHide() {
        Logger.info("CarnivalRechargePage:onHide");
        TaskTraceTipManager.Instance.showTraceTip = true;
    }

    onDestroy() {
        Logger.info("CarnivalRechargePage:onDestroy");
        MainToolBar.FLASH_NEW_GOODS = true;
        TaskTraceTipManager.Instance.showTraceTip = true;
        this.offEvent();
    }

    onUpdate(data: any) {
        Logger.info("CarnivalRechargePage:onUpdate-", data);
        this.updateInfoHandler();
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

}