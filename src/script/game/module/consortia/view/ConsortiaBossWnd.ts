import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import StringHelper from "../../../../core/utils/StringHelper";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_consortiabossData } from "../../../config/t_s_consortiaboss";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import ConfigInfoManager from "../../../manager/ConfigInfoManager";
import { ConsortiaSocketOutManager } from "../../../manager/ConsortiaSocketOutManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MopupManager } from "../../../manager/MopupManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaSkillHelper } from "../../../utils/ConsortiaSkillHelper";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
/**
 * 公会BOSS召唤
 */
export default class ConsortiaBossWnd extends BaseWindow {

    public frame: fgui.GLabel;
    public bossNameTxt: fgui.GTextField;
    public descTxt2: fgui.GTextField;
    public descTxt1: fgui.GTextField;
    public costCountTxt: fgui.GTextField;
    public infoTxt: fgui.GTextField;
    public vicoryList: fgui.GList;
    public failedList: fgui.GList;
    public callBossBtn: fgui.GButton;
    private _model: ConsortiaModel;
    private _contorller: ConsortiaControler;
    private _callNeed: number = 0;//召唤所需财富值
    private _winGoodsList: Array<GoodsInfo> = [];
    private _lostGoodsList: Array<GoodsInfo> = [];
    public OnInitWind() {
        super.OnInitWind();
        this.frame.getChild("title").text = LangManager.Instance.GetTranslation("ConsortiaBossWnd.title");
        this.descTxt1.text = LangManager.Instance.GetTranslation("ConsortiaBossWnd.descTxt1");
        this.descTxt2.text = LangManager.Instance.GetTranslation("ConsortiaBossWnd.descTxt2");
        this.infoTxt.text = LangManager.Instance.GetTranslation("ConsortiaBossWnd.infoTxt");
        this.callBossBtn.title = LangManager.Instance.GetTranslation("ConsortiaBossWnd.callBossBtnTxt");
        var index: number = 0;
        var tempArr: Array<t_s_upgradetemplateData> = TempleteManager.Instance.getTemplatesByType(42);
        for (var i: number = 0; i < tempArr.length; i++) {
            if (index + 1 == tempArr[i].Grades) {
                this._callNeed = tempArr[i].TemplateId;
                break;
            }
        }
        this.costCountTxt.text = this._callNeed.toString();
        this.initData();
        this.initEvent();
        this.initView();
        this.setCenter();
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._model = this._contorller.model;
    }

    private initEvent() {
        Utils.setDrawCallOptimize(this.vicoryList);
        Utils.setDrawCallOptimize(this.failedList);
        this.vicoryList.itemRenderer = Laya.Handler.create(this, this.rendervicoryList, null, false);
        this.failedList.itemRenderer = Laya.Handler.create(this, this.renderfailedList, null, false);
        this.callBossBtn.onClick(this, this.callBossBtnHander);
        this.frame.getChild('helpBtn').onClick(this, this.helpBtnHandler);
        NotificationManager.Instance.addEventListener(NotificationEvent.CONSORTIA_BOSS_SWITCH, this.__switchHandler, this);
    }

    private removeEvent() {
        // this.vicoryList.itemRenderer.recover();
        // this.failedList.itemRenderer.recover();
        Utils.clearGListHandle(this.vicoryList);
        Utils.clearGListHandle(this.failedList);
        this.callBossBtn.offClick(this, this.callBossBtnHander);
        this.frame.getChild('helpBtn').offClick(this, this.helpBtnHandler);
        NotificationManager.Instance.removeEventListener(NotificationEvent.CONSORTIA_BOSS_SWITCH, this.__switchHandler, this);
    }

    private rendervicoryList(index: number, item: BaseItem) {
        if (!item || item.isDisposed) return;
        item.info = this._winGoodsList[index];
    }

    private renderfailedList(index: number, item: BaseItem) {
        if (!item || item.isDisposed) return;
        item.info = this._lostGoodsList[index];
    }

    private initView() {
        let bosstemp: t_s_consortiabossData = TempleteManager.Instance.getConsortiaBossRewardByLevel(1);
        if (!bosstemp) return;
        let winArr: Array<any> = bosstemp.WinReward.split("|");
        let lostArr: Array<any> = bosstemp.LostReward.split("|");
        let winLen: number = winArr.length;
        let lostLen: number = lostArr.length;
        this._winGoodsList = [];
        this._lostGoodsList = [];
        for (let i: number = 0; i < winLen; i++) {
            let winGoodsArr: Array<any> = winArr[i].split(",");
            let winGoodsTempInfo: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(winGoodsArr[0]);
            if (!winGoodsTempInfo) continue;
            var winGoodsInfo: GoodsInfo = new GoodsInfo();
            winGoodsInfo.templateId = Number(winGoodsArr[0]);
            winGoodsInfo.count = Number(winGoodsArr[1]);
            this._winGoodsList.push(winGoodsInfo);

        }
        for (var j: number = 0; j < lostLen; j++) {
            var lostGoodsArr: Array<any> = lostArr[j].split(",");
            var lostGoodsTempInfo: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(lostGoodsArr[0]);
            if (!lostGoodsTempInfo) continue;
            var lostGoodsInfo: GoodsInfo = new GoodsInfo();
            lostGoodsInfo.templateId = Number(lostGoodsArr[0]);
            lostGoodsInfo.count =  Number(lostGoodsArr[1]);
            this._lostGoodsList.push(lostGoodsInfo);
        }
        this.vicoryList.numItems = this._winGoodsList.length;
        this.failedList.numItems = this._lostGoodsList.length;
    }

    private __switchHandler() {
        if (this._model.bossInfo.state == 1)//准备中
        {
            FrameCtrlManager.Instance.open(EmWindow.Consortia);
        }
    }

    private helpBtnHandler() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("ConsortiaBossWnd.help");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private callBossBtnHander() {
        this.callBossBtn.enabled = false;
        var str: string;
        if (MopupManager.Instance.model.isMopup) {
            str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
            MessageTipManager.Instance.show(str);
            return;
        }
        // let openTimeArr:Array<number> = ConfigInfoManager.Instance.getConsortiabossOpeningdate();
        // let day = PlayerManager.Instance.currentPlayerModel.sysCurtime.getDay();
        // if(day == 0){
        //     day =7;
        // }
        // let flag:boolean = false;
        // for(let i:number = 0;i<openTimeArr.length;i++){
        //     if(day == openTimeArr[i]){
        //         flag = true;
        //         break;
        //     }
        // }
        // if(!flag){
        //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaBossWnd.openTime.tips"));
        //     return;
        // }
        if (this._model.bossInfo.state != 0) {
            str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossPromptTxt" + this._model.bossInfo.state);
            MessageTipManager.Instance.show(str);
            return;
        }
        if (this._model.consortiaInfo.offer < this._callNeed) {
            ConsortiaSkillHelper.addWealth();
            return;
        }
        if (this.checkScene()) ConsortiaSocketOutManager.callConsortiaBoss(1);
    }

    private checkScene(): boolean {
        var tipStr: string = WorldBossHelper.getCampaignTips();
        if (StringHelper.isNullOrEmpty(tipStr)) {
            return true;
        } else {
            MessageTipManager.Instance.show(tipStr);
            return false;
        }
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}
