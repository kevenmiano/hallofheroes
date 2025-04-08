// @ts-nocheck
import { BattleNotic, CampaignEvent, CampaignMapEvent, NativeEvent, NotificationEvent, WorldBossEvent } from "../../../constant/event/NotificationEvent";
import { CampaignManager } from "../../../manager/CampaignManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomManager } from "../../../manager/RoomManager";
import { CampaignMapModel } from "../../../mvc/model/CampaignMapModel";
import WorldBossModel from "../../../mvc/model/worldboss/WorldBossModel";
import ConfigMgr from '../../../../core/config/ConfigMgr';
import { t_s_campaignData } from '../../../config/t_s_campaign';
import LangManager from '../../../../core/lang/LangManager';
import SoundManager from "../../../../core/audio/SoundManager";
import { SoundIds } from "../../../constant/SoundIds";
import { WoundInfo } from "../../../mvc/model/worldboss/WoundInfo";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import WorldBossRankItem from "../component/WorldBossRankItem";
import BaseWindow from '../../../../core/ui/Base/BaseWindow';
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import WorldBossInfoView from "./WorldBossInfoView";
import { PosType } from "../../../map/space/constant/PosType";
import { CampaignNode } from "../../../map/space/data/CampaignNode";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import Resolution from "../../../../core/comps/Resolution";
import { UIAlignType } from "../../../constant/UIAlignType";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { DisplayObject } from "../../../component/DisplayObject";
import { CampaignMapScene } from "../../../scene/CampaignMapScene";
import { TempleteManager } from "../../../manager/TempleteManager";
import UIButton from "../../../../core/ui/UIButton";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { WorldBossSocketOutManager } from "../../../manager/WorldBossSocketOutManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import { NodeState } from "../../../map/space/constant/NodeState";
import Utils from "../../../../core/utils/Utils";

export default class WorldBossSceneWnd extends BaseWindow {
    public tabList: fgui.GList;
    public extendBtn: fgui.GButton;
    public rankList: fgui.GList;
    public selfDamageTxt: fgui.GTextField;
    public helpBtn: fgui.GButton;
    public bufferDescTxt: fgui.GTextField;
    public bufferLeftTimeTxt: fgui.GTextField;
    public countValueTxt: fgui.GTextField;

    public worldBossBufferVIew: fgui.GComponent;
    public worldBossDamageRankView: fgui.GComponent;

    private _mapModel: CampaignMapModel;
    private _tabData: Array<any> = [];
    private _dataList: Array<WoundInfo>;
    private _offTime: number = 0;

    // Boss信息
    private _bossInfoView: WorldBossInfoView;
    private _worldBossModel: WorldBossModel;
    private _preHp: number = 0;
    private _bossInfoInited: boolean = false;
    private autoFightBtn: fgui.GButton;//自动寻路
    public cancelFightBtn: fgui.GButton;//取消自动寻路
    public autoLiveBtn: fgui.GButton;//自动复活
    public cancelLiveBtn: fgui.GButton;//取消自动复活
    public leftTimeTxt: fgui.GTextField;
    private statusCtr: fgui.Controller;
    private _autoLiveCost: number = 0;//复活消耗的钻石数
    private _leftSecond: number = 3;
    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        this._mapModel = CampaignManager.Instance.mapModel;
        this._worldBossModel = CampaignManager.Instance.worldBossModel;
        this._autoLiveCost = parseInt(TempleteManager.Instance.getConfigInfoByConfigName("Live_Fight_Pay").ConfigValue);
        this.statusCtr = this.getController("statusCtr");
        BaseFguiCom.autoGenerate(this.worldBossBufferVIew, this);
        BaseFguiCom.autoGenerate(this.worldBossDamageRankView, this);

        this.initEvent();
        this.addBossInfoUI();

        this._tabData = [{ str: LangManager.Instance.GetTranslation("worldboss.view.WoundInfoView.JobTabTxt") },
        { str: LangManager.Instance.GetTranslation("worldboss.view.WoundInfoView.AllTabTxt") }];
        this.tabList.numItems = this._tabData.length;
    }

    OnShowWind() {
        super.OnShowWind();
        this.statusCtr.selectedIndex = 0;
        this.updateTimeView();
        this.tabList.selectedIndex = 0;
        this.allTabHandler();
        if (this.playerModel.getWolrdBossAutoFightFlag() == PlayerModel.WORLDBOSS_AUTO_FIGHT) {//自动寻路
            this.statusCtr.selectedIndex = 1;
            this.leftTimeTxt.text = "";
        } else if (this.playerModel.getWolrdBossAutoLiveFlag() == PlayerModel.WORLDBOSS_AUTO_LIVE) {//自动复活
            this.statusCtr.selectedIndex = 2;
            this.updateAutoLiveStatus();
        }
        else {
            this.statusCtr.selectedIndex = 0;
        }
        this.onAutoFightChanged();
    }

    resize() {
        super.resize()
    }

    private initEvent() {
        this.helpBtn.onClick(this, this.helpHandler);
        if (this._mapModel) this._mapModel.addEventListener(CampaignMapEvent.SYNC_ERROR_TIME, this.syncErrorTimeHandler, this);
        this.tabList.on(fairygui.Events.CLICK_ITEM, this, this.allTabHandler);
        this.tabList.itemRenderer = Laya.Handler.create(this, this.renderTabListItem, null, false);
        this.rankList.itemRenderer = Laya.Handler.create(this, this.renderRankListItem, null, false);
        if (this.model) this.model.addEventListener(WorldBossEvent.UPDATE_WOUND_LIST, this.__updateWoundListHandler, this);
        this.autoFightBtn.onClick(this, this.autoFightBtnHandler);
        this.cancelFightBtn.onClick(this, this.cancelFightBtnHander);
        this.autoLiveBtn.onClick(this, this.autoLiveBtnHander);
        this.cancelLiveBtn.onClick(this, this.cancelLiveBtnHander);
        if (this.playerModel) this.playerModel.addEventListener(CampaignEvent.WORLDBOSS_AUTO_WALK_CHANGED, this.onAutoFightChanged.bind(this), this)
        NotificationManager.Instance.addEventListener(WorldBossEvent.UPDATE_WORLDBOSS_NODE_STATE, this.updateBossState, this);
        NotificationManager.Instance.addEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
    }

    private removeEvent() {
        this.helpBtn.offClick(this, this.helpHandler);
        if (this.model) this.model.removeEventListener(WorldBossEvent.UPDATE_WOUND_LIST, this.__updateWoundListHandler, this);
        if (this._mapModel) this._mapModel.removeEventListener(CampaignMapEvent.SYNC_ERROR_TIME, this.syncErrorTimeHandler, this);
        this.tabList.off(fairygui.Events.CLICK_ITEM, this, this.allTabHandler);
        // this.tabList.itemRenderer.recover();
        // this.rankList.itemRenderer.recover();
        Utils.clearGListHandle(this.tabList);
        Utils.clearGListHandle(this.rankList);
        this.autoFightBtn.offClick(this, this.autoFightBtnHandler);
        this.cancelFightBtn.onClick(this, this.cancelFightBtnHander);
        this.autoLiveBtn.onClick(this, this.autoLiveBtnHander);
        this.cancelLiveBtn.onClick(this, this.cancelLiveBtnHander);
        if (this.playerModel) this.playerModel.removeEventListener(CampaignEvent.WORLDBOSS_AUTO_WALK_CHANGED, this.onAutoFightChanged.bind(this), this)
        NotificationManager.Instance.removeEventListener(WorldBossEvent.UPDATE_WORLDBOSS_NODE_STATE, this.updateBossState, this);
        NotificationManager.Instance.removeEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
    }

    private updateBossState() {
        if (this.playerModel.getWolrdBossAutoFightFlag() == PlayerModel.WORLDBOSS_AUTO_FIGHT) {
            var nextNode: CampaignNode = CampaignManager.Instance.mapModel.getToAttackNode();
            if (!nextNode) nextNode = CampaignManager.Instance.mapModel.mapNodeEndPoint;
            if (nextNode) {
                var vNode: DisplayObject = CampaignManager.Instance.mapView.getNpcNodeById(nextNode.info.id);
                CampaignManager.Instance.mapModel.selectNode = nextNode;
                (<CampaignMapScene>CampaignManager.Instance.controller).moveArmyByPos(vNode.x, vNode.y, true, true);
            }
        }
        else if (this.playerModel.getWolrdBossAutoLiveFlag() == PlayerModel.WORLDBOSS_AUTO_LIVE) {//自动复活
            WorldBossSocketOutManager.sendEnterBattle(PlayerManager.Instance.currentPlayerModel.wolrdBossAutoLiveCostType);
        }
    }

    //自动寻路
    private autoFightBtnHandler() {
        if (!this.playerModel) return;
        this.leftTimeTxt.text = "";
        this.timer.clear(this, this.updateTimeHander);
        this.playerModel.setWorldBossAutoLive(PlayerModel.WORLDBOSS_CANCEL_AUTO_LIVE);
        this.playerModel.setWorldBossAutoFight(PlayerModel.WORLDBOSS_AUTO_FIGHT);
        if (this.selfMemberData.isDie) {
            var time: number = new Date().getTime();
            time = (time - this.playerModel.riverStartTime);
            if (time < 20000 && time > 0) {
                time = this.playerModel.riverTime - time;
            } else {
                time = this.playerModel.riverTime;
            }
            UIManager.Instance.ShowWind(EmWindow.WorldBossRiverWnd, { count: Math.ceil(time / 1000), type: 1 });
        }
    }

    //取消自动寻路
    private cancelFightBtnHander() {
        if (!this.playerModel) return;
        this.playerModel.setWorldBossAutoFight(PlayerModel.WORLDBOSS_CANCAL_AUTO_FIGHT);
    }

    private autoLiveBtnHander() {
        if (!this.checkHasOpen()) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("map.campaign.view.ui.demon.ConsortiaDemonSkillIcon.noOpen"));
            return;
        }
        var contextStr: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.RiverView.contentNew", this._autoLiveCost);
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { point: this._autoLiveCost, checkDefault: true }, prompt, contextStr, confirm, cancel, this.autoLiveAlertConfirm.bind(this));
    }

    private autoLiveAlertConfirm(b: boolean, flag: boolean) {
        if (b) {
            if (!flag) {//没有勾选优先使用绑定钻石
                if (this.playerInfo.point < this._autoLiveCost) {//钻石不足
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
                    return false;
                }
                PlayerManager.Instance.currentPlayerModel.wolrdBossAutoLiveCostType = false;
                this.enterBattle();
            } else {//勾选了优先使用绑定钻石
                if (this.playerInfo.point + this.playerInfo.giftToken < this._autoLiveCost) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
                    return false;
                }
                PlayerManager.Instance.currentPlayerModel.wolrdBossAutoLiveCostType = true;
                this.enterBattle();
            }
        }
    }

    /**处理设置, 点击弹窗的确认按钮后立即进入战斗*/
    private enterBattle() {
        this.playerModel.setWorldBossAutoFight(PlayerModel.WORLDBOSS_CANCAL_AUTO_FIGHT);
        this.playerModel.setWorldBossAutoLive(PlayerModel.WORLDBOSS_AUTO_LIVE);
        WorldBossSocketOutManager.sendEnterBattle(PlayerManager.Instance.currentPlayerModel.wolrdBossAutoLiveCostType);
    }

    private checkHasOpen(): boolean {
        let flag: boolean;
        var nList: any[] = CampaignManager.Instance.mapModel.mapNodesData;
        if (!nList) {
            return false;
        }
        for (const key in nList) {
            if (nList.hasOwnProperty(key)) {
                let nInfo: CampaignNode = nList[key];
                if (nInfo.info.types == PosType.ATTACK_HANDLER && nInfo.info.state == NodeState.DESTROYED) {
                    flag = true;
                }
            }
        }
        return flag;
    }

    //退出战斗3秒自动复活
    private updateAutoLiveStatus() {
        this.leftTimeTxt.text = "00:00:0" + this._leftSecond;
        Laya.timer.loop(1000, this, this.updateTimeHander);
    }

    private updateTimeHander() {
        this.leftTimeTxt.text = "00:00:0" + this._leftSecond;
        this._leftSecond--;
        if (this._leftSecond < 0) {
            this._leftSecond = 3;
            this.leftTimeTxt.text = "";
            this.timer.clear(this, this.updateTimeHander);
            if (!this.checkHasOpen) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("map.campaign.view.ui.demon.ConsortiaDemonSkillIcon.noOpen"));
                return;
            }
            WorldBossSocketOutManager.sendEnterBattle(PlayerManager.Instance.currentPlayerModel.wolrdBossAutoLiveCostType);
        }
    }

    /**取消自动复活状态 */
    private cancelLiveBtnHander() {
        this.playerModel.setWorldBossAutoLive(PlayerModel.WORLDBOSS_CANCEL_AUTO_LIVE);
        this.leftTimeTxt.text = "";
        if (this.selfMemberData.isDie) {
            var time: number = new Date().getTime();
            time = (time - this.playerModel.riverStartTime);
            if (time < 20000 && time > 0) {
                time = this.playerModel.riverTime - time;
            } else {
                time = this.playerModel.riverTime;
            }
            UIManager.Instance.ShowWind(EmWindow.WorldBossRiverWnd, { count: Math.ceil(time / 1000), type: 1 });
        }
    }

    private onAutoFightChanged() {
        if (this.playerModel.getWolrdBossAutoFightFlag() == PlayerModel.WORLDBOSS_AUTO_FIGHT) {//自动寻路
            this.statusCtr.selectedIndex = 1;
            this.leftTimeTxt.text = "";
        } else if (this.playerModel.getWolrdBossAutoLiveFlag() == PlayerModel.WORLDBOSS_AUTO_LIVE) {//自动复活
            this.statusCtr.selectedIndex = 2;
        }
        else {
            this.statusCtr.selectedIndex = 0;
            this.timer.clear(this, this.updateTimeHander);
        }
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    renderTabListItem(index: number, item: fgui.GButton) {
        if (item) {
            item.title = this._tabData[index].str;
        }
    }

    renderRankListItem(index: number, item: WorldBossRankItem) {
        if (item) {
            item.woundInfo = this._dataList[index];
        }
    }

    private addBossInfoUI() {
        //添加世界Boss头像至场景展示
        this._bossInfoView = WorldBossInfoView.createInstance() as WorldBossInfoView;
        this._bossInfoView.setParent(this.getContentPane());
    }

    private removeBossInfoUI() {
        if (this._bossInfoView) {
            this._bossInfoView.dispose();
        }
    }

    private allTabHandler() {
        SoundManager.Instance.play(SoundIds.CONFIRM_SOUND);
        this.model.woundAll = this.tabList.selectedIndex == 0 ? false : true;
        this.updateView();
    }

    private helpHandler() {
        let title = LangManager.Instance.GetTranslation("worldboss.view.WorldBossHelp.title1");;
        let content = LangManager.Instance.GetTranslation("worldboss.view.BaseHelpFrame.helpText");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private syncErrorTimeHandler() {
        this.updateTimeView();
    }

    public get model(): WorldBossModel {
        return CampaignManager.Instance.worldBossModel;
    }

    private __updateWoundListHandler(evt: Event) {
        this.updateView();
    }

    private getDataList(): Array<WoundInfo> {
        let arr: Array<WoundInfo> = this.model.woundInfoList;
        let dataArr: Array<WoundInfo> = [];
        let item: WoundInfo;
        for (let i = 0; i < arr.length; i++) {
            item = arr[i] as WoundInfo;
            if (item && item.wound > 0) {
                dataArr.push(item);
            }
        }
        return dataArr;
    }

    private updateView() {
        if (this.model.selfWoundInfo.wound < 0) { //未对BOSS造成伤害
            this.selfDamageTxt.text = LangManager.Instance.GetTranslation("worldboss.view.WoundInfoItemView.nickName");
        } else {
            this.selfDamageTxt.text = this.model.selfWoundInfo.wound.toString();
        }
        this._dataList = this.getDataList();
        this.rankList.numItems = this._dataList.length;
        var countValue: string = LangManager.Instance.GetTranslation("WorldBoss.WoundInfo.countValue");
        this.countValueTxt.text = this.model.totalNum < 300 ? countValue : this.model.totalNum + "";
        if (this.model.buffGrade > 0) {
            this.bufferDescTxt.text = LangManager.Instance.GetTranslation("worldboss.view.WoundInfoView.buffGradeTip", this.model.buffGrade, this.model.buffGrade * 500);
        } else {
            this.bufferDescTxt.text = LangManager.Instance.GetTranslation("worldboss.view.WoundInfoView.buffTip");
        }
        this.updateBossInfo()
    }

    private updateTimeView() {
        var curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000;
        var cTemp: t_s_campaignData = ConfigMgr.Instance.worldBossDic[RoomManager.Instance.roomInfo.campaignId];
        var arr: Array<string> = cTemp.StopTime.split(":");
        var curDate: Date = new Date();
        curDate.setTime(curTime);
        curDate.setHours(parseInt(arr[0]));
        curDate.setMinutes(parseInt(arr[1]));
        curDate.setSeconds(0);
        this._offTime = parseInt(((curDate.getTime() - curTime + CampaignManager.Instance.mapModel.syncErrorTime * 1000) / 1000).toString());
        if (this._offTime > 0) {
            Laya.timer.clear(this, this.__updateSTimeHandler);
            Laya.timer.loop(1000, this, this.__updateSTimeHandler);
        }
    }

    private __updateSTimeHandler() {
        this._offTime--;
        if (this.bufferLeftTimeTxt && !this.bufferLeftTimeTxt.isDisposed)
            this.bufferLeftTimeTxt.text = DateFormatter.getSevenDateString(this._offTime);
        if (this._offTime <= 0) {
            Laya.timer.clear(this, this.__updateSTimeHandler);
        }
    }


    /////////////////////////  右上角BOSS信息  //////////////////////////
    private updateBossInfo() {
        if (this._worldBossModel.totalHp <= 0 || !this._bossInfoView) {
            return
        }
        if (!this._bossInfoInited) {
            this.updateWorldBossInfo();
            this._bossInfoInited = true;
            this._bossInfoView.setTotalHp(this._worldBossModel.totalHp);
            this._bossInfoView.setCurrentHp(this._worldBossModel.curHp);
        }
        if (this._preHp != 0 && this._preHp - this._worldBossModel.curHp > 0) this._bossInfoView.updateWorldBossHp(this._worldBossModel.curHp - this._preHp);
        this._preHp = this._worldBossModel.curHp;

    }

    /**更新世界Boss信息 */
    private updateWorldBossInfo() {
        var arr: Array<CampaignNode> = CampaignManager.Instance.mapModel.mapNodesData;
        var endBoss: CampaignNode;
        for (const key in arr) {
            if (Object.prototype.hasOwnProperty.call(arr, key)) {
                var node: CampaignNode = arr[key];
                if (node.info.types == PosType.COPY_END || node.info.types == PosType.COPY_NPC) {
                    endBoss = node;
                    break;
                }
            }
        }
        if (!endBoss || !this._worldBossModel) return;
        this._bossInfoView && this._bossInfoView.setInfo(this.createHeroInfo(endBoss));
    }

    private createHeroInfo(endBoss: CampaignNode): HeroRoleInfo {
        var info: HeroRoleInfo = new HeroRoleInfo();
        info.heroInfo = new ThaneInfo();
        info.heroInfo.grades = this._worldBossModel.bossGrades;
        info.heroInfo.nickName = endBoss.info.names;
        info.heroInfo.templateId = endBoss.heroTemplateId;
        return info;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get selfMemberData(): CampaignArmy {
        return CampaignManager.Instance.mapModel.selfMemberData;
    }

    dispose() {
        Laya.timer.clear(this, this.__updateSTimeHandler);
        this.timer.clear(this, this.updateTimeHander);
        this._bossInfoInited = false;
        SimpleAlertHelper.Instance.Hide();
        this.removeBossInfoUI();
        this.removeEvent();
        super.dispose();
    }
}