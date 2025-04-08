import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { BagSortType, BagType } from "../../../constant/BagDefine";
import { BagEvent, GemMazeEvent, NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GemMazeManager } from "../../../manager/GemMazeManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import DropListCom from "./DropListCom";
import GemCom from "./GemCom";
import GemMazeBoxCom from "./GemMazeBoxCom";

/**
* @author:zhihua.zhou
* @data: 2022-05-18 18:40
* @description 夺宝奇兵主界面
*/
export default class GemMazeWnd extends BaseWindow {
    protected setSceneVisibleOpen: boolean = true;
    private btn_rank: fairygui.GButton;
    private btn_adjust: fairygui.GButton;//整理按钮
    private helpBtn: fairygui.GButton;//
    private btn_preview: fairygui.GButton;//预览奖励
    private btn_add_count: fairygui.GComponent;
    private txt_score: fairygui.GTextField;
    private txt1: fairygui.GTextField;
    private list: fairygui.GList;
    private boxCom: GemMazeBoxCom; //积分宝箱界面
    private gemCom: GemCom;//宝石矩阵面板

    // private COLUMN_NUM:number = 3;
    private ROW_NUM: number = 19;
    private ROW_NUM_PLUS: number = 19;
    private _sortByType: number = BagSortType.Default;

    private _bagDic: any;
    private _itemList: GoodsInfo[];//按背包格子顺序存的物品信息,  有可能中间有空数据

    private mc: fairygui.GMovieClip;

    dropList: DropListCom;

    /**初始化 */
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();
        this.dropList.visible = false;
        GemMazeManager.Instance.getInitInfo();
        this.initLanguage();
    }

    initLanguage() {
        this.txt1.text = LangManager.Instance.GetTranslation('GemMazeWnd.currentPointTxt');
        this.btn_rank.title = LangManager.Instance.GetTranslation('mainBar.SmallMapBar.rankingBtnTipData');
        this.btn_adjust.title = LangManager.Instance.GetTranslation('GemMazeWnd.tidyTxt');
        this.btn_add_count.getChild('txt1').asTextField.text = LangManager.Instance.GetTranslation('map.outercity.view.frame.AttackAlertFrame.command02');
    }

    //获取初始化信息, 更新界面
    private onGetInitInfo() {
        let gemInfo = GemMazeManager.Instance.model.gemMazeInfo;
        this.updateView();
        this.gemCom.updateView();
        let lv = Math.floor(gemInfo.gemLevel / 5) * 5;//每5级一个段
        this.dropList.updateView(lv);
    }

    private addEvent() {
        this.btn_rank.onClick(this, this.onRank);
        this.btn_preview.onClick(this, this.onPreview);
        this.btn_add_count.onClick(this, this.onAddCount);
        this.btn_adjust.onClick(this, this.onAdjust);
        this.helpBtn.onClick(this, this.helpBtnClick);
        Utils.setDrawCallOptimize(this.list);
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderList, null, false);

        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_GEM_UPDATE_FRAME, this.updateView, this);
        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_GET_INIT_INFO, this.onGetInitInfo, this);
        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_UPDATE_BAG, this.updateBagView, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.ARMYFRAMEII_OPEN_FOR_GEMMAZE, this.onBagOpen, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.ARMYFRAMEII_CLOSE_FOR_GEMMAZE, this.onBagClose, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.updateBagView, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.updateBagView, this);
        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_ADD_INTERGAL, this.onUpdateScore, this);
        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_PLAYER_GRAIN, this.onPlayerGrain, this);
    }

    private removeEvent() {
        this.btn_rank.offClick(this, this.onRank);
        this.btn_preview.offClick(this, this.onPreview);
        this.btn_add_count.offClick(this, this.onAddCount);
        this.btn_adjust.offClick(this, this.onAdjust);
        this.helpBtn.offClick(this, this.helpBtnClick);
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);

        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_GEM_UPDATE_FRAME, this.updateView, this);
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_GET_INIT_INFO, this.onGetInitInfo, this);
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_UPDATE_BAG, this.updateBagView, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.ARMYFRAMEII_OPEN_FOR_GEMMAZE, this.onBagOpen, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.ARMYFRAMEII_CLOSE_FOR_GEMMAZE, this.onBagClose, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.updateBagView, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.updateBagView, this);
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_ADD_INTERGAL, this.onUpdateScore, this);
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_PLAYER_GRAIN, this.onPlayerGrain, this);
    }

    protected OnClickModal() {

    }

    protected OnBtnClose() {
        if (this.gemCom.isAction) {
            return;
        }
        super.OnBtnClose();
    }

    onPlayerGrain() {
        this.mc.visible = true;
        this.mc.setPlaySettings(0, 14, 1, 0, Laya.Handler.create(this, this.playEnd));
        this.mc.playing = true;
    }

    playEnd() {
        this.mc.playing = false;
        this.mc.visible = false;
    }

    onUpdateScore(arr: any) {
        this.boxCom.onUpdateScore(arr);
    }

    onBagOpen() {
        this.list.visible = this.btn_adjust.visible = false;
    }

    onBagClose() {
        this.list.visible = this.btn_adjust.visible = true;
    }

    private onRenderList(index: number, item: BaseItem) {
        if (item) {
            if (this._itemList[index]) {
                item.info = this._itemList[index];
            } else {
                item.info = null;
            }
        }
    }

    /**
     * 整理背包
     */
    onAdjust() {
        let needAlert: boolean = true;
        let lastSaveDate: Date = new Date(SharedManager.Instance.domesticateAlertDate);
        if (lastSaveDate) {
            let today: Date = new Date();
            if (today.getFullYear() == lastSaveDate.getFullYear() &&
                today.getMonth() == lastSaveDate.getMonth() &&
                today.getDate() == lastSaveDate.getDate()) {
                needAlert = false;
            }
        }

        if (needAlert) {
            let content: string = LangManager.Instance.GetTranslation("bag.helper.BagHelper.content02");
            let checkTxt: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, this.callback.bind(this));
        }
        else {
            this.sortBag(true, this._sortByType);
        }
    }

    private callback(issure: boolean, notAlert: boolean) {
        if (notAlert) {
            SharedManager.Instance.domesticateAlertDate = new Date();
            SharedManager.Instance.saveDomesticateAlert();
        }
        if (issure) {
            this.sortBag(true, this._sortByType);
        }
    }

    private updateBagView() {
        Laya.timer.callLater(this, this.updateItemlist);
    }

    updateItemlist() {
        this.__refreshStorageInfo();
        this._itemList = [];
        this._bagDic = GoodsManager.Instance.getMazeBagList();
        for (const key in this._bagDic) {
            if (this._bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._bagDic[key];
                this._itemList[info.pos] = info;
            }
        }
        this.list.numItems = this._itemList.length;
    }



    OnShowWind() {
        super.OnShowWind();
    }

    updateView() {
        let gemInfo = GemMazeManager.Instance.model.gemMazeInfo;
        this.btn_add_count.getChild('txt_count').asTextField.text = gemInfo.timesLeft + '';
        this.txt_score.text = gemInfo.score.toString();
        this.boxCom.updateView();
        this.__refreshStorageInfo();
        this.updateItemlist();
    }

    private __refreshStorageInfo() {
        if (GoodsManager.Instance.getMazeBagList().getList().length > 0) {
            this.btn_adjust.enabled = true;
        } else {
            this.btn_adjust.enabled = false;
        }
    }

    onRank() {
        FrameCtrlManager.Instance.open(EmWindow.GemMazeRankWnd);
    }

    onPreview() {
        this.dropList.visible = true;
    }

    /**
    * 帮助说明
    */
    private helpBtnClick() {
        let title = LangManager.Instance.GetTranslation("public.help");
        let content = LangManager.Instance.GetTranslation("gemMaze.GemMazeFrame.helpFrame.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }


    /**
     * 购买次数按钮点击
     */
    onAddCount() {
        let model = GemMazeManager.Instance.model;
        if (GemMazeManager.Instance.model.gemMazeInfo.timesLeft >= model.maxStep) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("gemMaze.gemMazeFrame.BuTimesTips"));
            return;
        }

        if (PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint < model.buySteps * model.priceStep) {
            RechargeAlertMannager.Instance.show(); //钻石不足, 是否充值的提示
            return;
        }

        if (this.todayNeedAlertForOpenKingContract) {
            this.showBuyTimesTips();
        } else {
            let useBind: number = 1;
            if (SharedManager.Instance.bugGemMazeTimesUseBind) {
                useBind = 2;
            }
            GemMazeManager.Instance.buyTimes(useBind);
        }
    }

    /**
     * 今日是否提示 
     * @return 
     */
    private get todayNeedAlertForOpenKingContract(): Boolean {
        let needAlert: Boolean = true;
        let lastSaveDate: Date = SharedManager.Instance.buyGemMazeTimesAlertDate;
        if (lastSaveDate) {
            let today: Date = new Date();
            if (today.getFullYear() == lastSaveDate.getFullYear() &&
                today.getMonth() == lastSaveDate.getMonth() &&
                today.getDate() == lastSaveDate.getDate()) {
                needAlert = false;
            }
        }
        return needAlert;
    }

    private showBuyTimesTips() {
        let model = GemMazeManager.Instance.model;
        let str = model.gemMazeInfo.buyTimesLeft + '/' + TempleteManager.Instance.getConfigInfoByConfigName('Gem_Maze_BuyNum').ConfigValue;
        let content: string = LangManager.Instance.GetTranslation("gemMaze.GemMazeFrame.buyTimesTips", model.priceStep * model.buySteps, model.buySteps, str);
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.alertCallback.bind(this), state: 0 });
    }

    /**
     * 购买确认回调
     * @param notAlert 下次不再提示
     * @param useBind 优先使用绑钻
     */
    private alertCallback(notAlert: boolean, useBind: boolean) {
        if (notAlert) {
            SharedManager.Instance.buyGemMazeTimesAlertDate = new Date();
            SharedManager.Instance.saveBuyGemMazeTimesAlertDate();
        }
        SharedManager.Instance.bugGemMazeTimesUseBind = useBind;
        let useBindInt: number = 1;
        if (useBind) {
            useBindInt = 2;
        }
        GemMazeManager.Instance.buyTimes(useBindInt);
    }

    /**
     * 
     * @param isOverlay 
     * @param sortType 
     */
    sortBag(isOverlay: boolean, sortType: number) {
        let send_pos_old: number[] = [];
        let send_pos_new: number[] = [];
        let sort_arr: GoodsInfo[] = [];
        let temp: GoodsInfo;
        sort_arr = sort_arr.concat(this._itemList);

        // this._sortByType = sortType;
        sort_arr.sort(this.sortFun.bind(this));
        if (temp) {
            sort_arr.unshift(temp);
        }
        let isChange: boolean = false;
        let t_old_pos: number;
        for (let i: number = 0; i < sort_arr.length; i++) {
            if (sort_arr[i]) {
                t_old_pos = (sort_arr[i]).pos;
            }
            if (t_old_pos != i) {
                isChange = true;
            }
            send_pos_old.push(t_old_pos);
            send_pos_new.push(i);
        }

        if (isChange || isOverlay) {
            GoodsManager.Instance.fixBagItem(send_pos_old, send_pos_new, BagType.Maze, isOverlay);
        }
    }

    protected sortFun(a: GoodsInfo, b: GoodsInfo): number {
        let index_a: number = a.templateInfo.SonType;
        let index_b: number = b.templateInfo.SonType;
        if (GoodsManager.Instance.isType(a, this._sortByType) && !GoodsManager.Instance.isType(b, this._sortByType)) {
            return -1
        }
        else if (!GoodsManager.Instance.isType(a, this._sortByType) && GoodsManager.Instance.isType(b, this._sortByType)) {
            return 1;
        }
        else {
            if (index_a < index_b) {
                return -1;
            }
            else if (index_a > index_b) {
                return 1;
            }
            else {
                if (a.templateId < b.templateId) {
                    return 1;
                }
                else if (a.templateId > b.templateId) {
                    return -1;
                }
                else {
                    if (a.strengthenGrade < b.strengthenGrade) {
                        return 1;
                    }
                    else if (a.strengthenGrade > b.strengthenGrade) {
                        return -1;
                    }
                    else {
                        if (!a.isBinds && b.isBinds) {
                            return -1;
                        }
                        else if (a.isBinds && !b.isBinds) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    }
                }
            }
        }
        return 0;
    }

    /**关闭 */
    OnHideWind() {
        GemMazeManager.Instance.clearData();
        GemMazeManager.Instance.model.updateAllUpdateData();
        this.removeEvent();
        super.OnHideWind();
    }
}