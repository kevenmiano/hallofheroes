// @ts-nocheck
import FUI_BaseItem from "../../../../../fui/Base/FUI_BaseItem";
import FUI_CarnivalBaoPage from "../../../../../fui/Carnival/FUI_CarnivalBaoPage";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_carnivalluckdrawData } from "../../../config/t_s_carnivalluckdraw";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { ChatChannel } from "../../../datas/ChatChannel";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import CarnivalManager from "../../../manager/CarnivalManager";
import { ChatManager } from "../../../manager/ChatManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FUIHelper from "../../../utils/FUIHelper";
import ChatData from "../../chat/data/ChatData";
import MainToolBar from "../../home/MainToolBar";
import MaskLockOper from "../../../component/MaskLockOper";
import MoveSomeController from "../control/MoveSomeController";
import CarnivalModel, { CARNIVAL_FOLDER } from "../model/CarnivalModel";
import { CarnivalBasePage } from "./CarnivalBasePage";
import { getDefaultLangageKey } from "../../../../core/lang/LanguageDefine";

/**
 * 嘉年华--幸运夺宝
 */
export default class CarnivalBaoPage extends FUI_CarnivalBaoPage implements CarnivalBasePage {

    private _leftRewardStr: string = "";
    private _rightRewardStr: string = "";
    private _rewardCount: number;
    private _tipPools: Array<string> = [];
    private _tipGoodsPools: Array<GoodsInfo> = [];

    private _goodId: number = 0;
    private _needOnce: number = 0;
    private _leftCC: MoveSomeController;
    private _leftTempList: Array<t_s_carnivalluckdrawData>;
    private _rightCC: MoveSomeController;
    private _rightTempList: Array<t_s_carnivalluckdrawData>;

    protected onConstruct() {
        super.onConstruct();
        this.moveComponet.displayObject["dyna"] = true;
        this.initTranslate();
        this.addEvent()
    }

    addEvent() {
        this.bao1StartBtn.onClick(this, this.clickHandler, [1]);
        this.bao10StartBtn.onClick(this, this.clickHandler, [10]);
    }

    offEvent() {
        this.bao1StartBtn.offClick(this, this.clickHandler);
        this.bao10StartBtn.offClick(this, this.clickHandler);
    }

    onShow() {
        Logger.info("CarnivalBaoPage:onShow");
        this.initView();
    }

    private initTranslate(){
        this.bao1StartBtn.title=LangManager.Instance.GetTranslation("Carnival.CarnivalBaoPage.bao1StartBtn");
        this.bao10StartBtn.title=LangManager.Instance.GetTranslation("Carnival.CarnivalBaoPage.bao10StartBtn");
    }
    private clickHandler(c: number) {
        this.bao1StartBtn.enabled = false;
        this.bao10StartBtn.enabled = false;
        MainToolBar.FLASH_NEW_GOODS = false;
        TaskTraceTipManager.Instance.showTraceTip = false;
        MaskLockOper.Instance.doCall(true);

        let hasNum: number = 0;
        if (this._goodId > 0) {
            hasNum = GoodsManager.Instance.getGoodsNumByTempId(this._goodId);
        }

        //不足10次，开完剩余的所有次数
        if (c == 10) {
            hasNum < 10 && (c = hasNum);
        }

        CarnivalManager.Instance.opRequest(CarnivalManager.OP_LUCK_TREASURE, 0, c);
    }

    private initView(): void {
        this.Img_LuckyDraw.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.BAO, "Img_LuckyDraw");
        this.Img_Txt_LuckyDraw.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.BAO, "Img_Txt_LuckyDraw" + "_" + getDefaultLangageKey());
        this._leftTempList = TempleteManager.Instance.getCarnivalLuckDrawTempList(3, 1);
        this._leftCC = this.creatMoveCC(this._leftTempList, 1, 1);
        this._rightTempList = TempleteManager.Instance.getCarnivalLuckDrawTempList(3, 2);
        this._rightCC = this.creatMoveCC(this._rightTempList, 2, 2);

        this.txt_rules.text = LangManager.Instance.GetTranslation("carnival.luck.baoTip");

        let cfg = TempleteManager.Instance.getConfigInfoByConfigName("CarnivalLuckyDraw");
        if (cfg) {
            let list: Array<string> = cfg.ConfigValue.split(",");
            this._goodId = parseInt(list[0]);
            this._needOnce = parseInt(list[1]);
        }

        this.moveComponet.removeChildren();
        this.moveComponet.addChild(this._leftCC);
        this._leftCC.setXY(10 - 90, 40);
        this.moveComponet.addChild(this._rightCC);
        this._rightCC.setXY(10 + 450, 160);

        this._leftCC.initMask(455, 87, -10, -8);
        this._rightCC.initMask(455, 87, -370, -8);
        //置顶
        this.setChildIndex(this.arr_down, this.numChildren - 1);
        this.setChildIndex(this.arr_up, this.numChildren - 1);

        this.refreshView();
    }

    private get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    private refreshView(isPlay: boolean = false) {
        this.updateBtnState();
        if (isPlay) {

            let restIds = this.model.result.split("|")
            let restr: string = restIds.pop();

            if (restr != "" && restr.length > 0) {
                this._tipGoodsPools = [];
                let idList: Array<string> = restr.split(",");
                if (idList.length == 2) {
                    this._rewardCount = 0;
                    this.model.result = "";
                    let tInfo: t_s_carnivalluckdrawData;
                    let findList: Array<Object> = this.findPrams(this._leftTempList, Number(idList[0]));
                    let leftIdx: number = Number(findList[0]);
                    tInfo = findList[1] as t_s_carnivalluckdrawData;
                    let gInfo: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(tInfo.Item);
                    this._leftRewardStr = gInfo.TemplateNameLang + "x" + tInfo.ItemNum;
                    leftIdx = this.chageIdx(leftIdx, this._leftTempList.length);
                    this._leftCC.start(leftIdx);

                    let gGoodInfo1 = new GoodsInfo();
                    gGoodInfo1.templateId = tInfo.Item;
                    gGoodInfo1.count = tInfo.ItemNum;

                    findList = this.findPrams(this._rightTempList, Number(idList[1]));
                    tInfo = findList[1] as t_s_carnivalluckdrawData;
                    let rightIdx: number = Number(findList[0]);
                    gInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(tInfo.Item);
                    this._rightRewardStr = gInfo.TemplateNameLang + "x" + tInfo.ItemNum;
                    rightIdx = this.chageIdx(rightIdx, this._rightTempList.length);
                    this._rightCC.start(rightIdx);

                    let gGoodInfo2 = new GoodsInfo();
                    gGoodInfo2.templateId = tInfo.Item;
                    gGoodInfo2.count = tInfo.ItemNum;

                    let rewardTips: string = LangManager.Instance.GetTranslation("carnival.recharge.rewardMore", this._leftRewardStr, this._rightRewardStr);
                    this._tipPools.push(rewardTips);

                    this._tipGoodsPools.push(gGoodInfo1, gGoodInfo2);

                    while (restr = restIds.pop()) {
                        idList = restr.split(",");
                        if (idList.length == 2) {

                            findList = this.findPrams(this._leftTempList, Number(idList[0]));
                            tInfo = findList[1] as t_s_carnivalluckdrawData;
                            gInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(tInfo.Item);
                            let leftRewardStr = gInfo.TemplateNameLang + "x" + tInfo.ItemNum;

                            let g1 = new GoodsInfo();
                            g1.templateId = tInfo.Item;
                            g1.count = tInfo.ItemNum;


                            findList = this.findPrams(this._rightTempList, Number(idList[1]));
                            tInfo = findList[1] as t_s_carnivalluckdrawData;

                            gInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(tInfo.Item);
                            let rightRewardStr = gInfo.TemplateNameLang + "x" + tInfo.ItemNum;


                            let g2 = new GoodsInfo();
                            g2.templateId = tInfo.Item;
                            g2.count = tInfo.ItemNum;

                            rewardTips = LangManager.Instance.GetTranslation("carnival.recharge.rewardMore", leftRewardStr, rightRewardStr);
                            this._tipPools.unshift(rewardTips);
                            this._tipGoodsPools.unshift(g1, g2);

                        }
                    }

                }
            } else {
                this.updateBtnState();
            }
        }
    }

    private findPrams(arr: Array<t_s_carnivalluckdrawData>, tId: number): Array<Object> {
        let ret: Array<Object> = [];
        let len: number = arr ? arr.length : 0;
        let tInfo: t_s_carnivalluckdrawData;
        for (let i: number = 0; i < len; i++) {
            tInfo = arr[i];
            if (tInfo.Id == tId) {
                ret = [i, tInfo];
                break;
            }
        }
        return ret;
    }

    private chageIdx(idx: number, len: number): number {
        let offsetX: number = 3;
        let ret: number = idx - offsetX;
        if (ret < 0) {
            ret = idx + len - offsetX;
        }
        return ret;
    }

    private creatMoveCC(tempList: Array<t_s_carnivalluckdrawData>, idx: number = 0, way: number = 0): MoveSomeController {
        let itemList1: Array<BaseItem> = [];
        let itemList2: Array<BaseItem> = [];
        let item: BaseItem;
        let tInfo: t_s_carnivalluckdrawData;
        let len: number = tempList ? tempList.length : 0;
        for (let i: number = 0; i < len; i++) {
            tInfo = tempList[i];
            item = this.creatGoodsItem(tInfo);
            itemList1.push(item);
            item = this.creatGoodsItem(tInfo);
            itemList2.push(item);
        }
        let cc: MoveSomeController = new MoveSomeController(itemList1, itemList2, 90, way, 3000, 35, 20, this.moveCallBack.bind(this));
        return cc;
    }

    private moveCallBack() {
        this._rewardCount++;
        if (this._rewardCount >= 2) {
            this.updateBtnState();
            MaskLockOper.Instance.doCall(false);
            this.showRewardInfos();
        }
    }

    private showRewardInfos() {
        if (this._tipPools == null || this._tipPools.length == 0) return;
        let rewardStr: string = "";
        while (rewardStr = this._tipPools.pop()) {
            MainToolBar.FLASH_NEW_GOODS = true;
            MessageTipManager.Instance.show(rewardStr);

            let chatData: ChatData = new ChatData();
            chatData.channel = ChatChannel.INFO;
            chatData.type = 1;
            chatData.msg = rewardStr;
            chatData.commit();
            ChatManager.Instance.model.addChat(chatData);
        }

        //播放飘获得动画
        GoodsManager.Instance.dispatchEvent(BagEvent.NEW_GOODS, this._tipGoodsPools);
    }

    private updateBtnState() {
        let hasNum: number = 0;
        if (this._goodId > 0) {
            hasNum = GoodsManager.Instance.getGoodsNumByTempId(this._goodId);
        }
        this.txt_BaoNum.text = "" + hasNum;
        if (hasNum >= this._needOnce) {
            this.bao1StartBtn.enabled = true;
            this.bao10StartBtn.enabled = true;
        } else {
            this.bao1StartBtn.enabled = false;
            this.bao10StartBtn.enabled = false;
        }
    }

    private creatGoodsItem(tInfo: t_s_carnivalluckdrawData): BaseItem {
        let item: BaseItem = FUIHelper.createFUIByURL(FUI_BaseItem.URL);
        item.width = 70;
        item.height = 70;
        Utils.setDrawCallOptimize(item);
        let g: GoodsInfo = new GoodsInfo();
        g.templateId = tInfo.Item;
        g.count = tInfo.ItemNum;
        item.info = g;
        return item;
    }

    onHide() {
        Logger.info("CarnivalBaoPage:onHide");
        TaskTraceTipManager.Instance.showTraceTip = true;
    }

    onDestroy() {
        Logger.info("CarnivalBaoPage:onDestroy");
        this.offEvent();
        MaskLockOper.Instance.doCall(false);
        if (this._leftCC) this._leftCC.dispose(); this._leftCC = null;
        if (this._rightCC) this._rightCC.dispose(); this._rightCC = null;
        if (this._tipPools != null) {
            this.showRewardInfos();
        }
        this._tipPools = null;
        this._tipGoodsPools = null;
        this._leftTempList = null;
        this._rightTempList = null;
        MainToolBar.FLASH_NEW_GOODS = true;
        TaskTraceTipManager.Instance.showTraceTip = true;
    }

    onUpdate(data: any) {
        Logger.info("CarnivalBaoPage:onUpdate-", data);
        this.refreshView(true);
    }
}