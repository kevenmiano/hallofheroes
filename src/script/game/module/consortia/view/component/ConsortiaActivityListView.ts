import FUI_ConsortiaActivityListView from "../../../../../../fui/Consortia/FUI_ConsortiaActivityListView";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaActivityItem } from "./ConsortiaActivityItem";
import LangManager from "../../../../../core/lang/LangManager";
import StringHelper from "../../../../../core/utils/StringHelper";
import { ConsortiaEvent, NotificationEvent, OuterCityEvent } from "../../../../constant/event/NotificationEvent";
import { SoundIds } from "../../../../constant/SoundIds";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { ConsortiaSocketOutManager } from "../../../../manager/ConsortiaSocketOutManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { MopupManager } from "../../../../manager/MopupManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { ConsortiaActivityInfo } from "../../data/ConsortiaActivityInfo";
import { ConsortiaDutyInfo } from "../../data/ConsortiaDutyInfo";
import AudioManager from "../../../../../core/audio/AudioManager";
import { GvgReadyController } from "../../control/GvgReadyController";
import ComponentSetting from '../../../../utils/ComponentSetting';
import SoundManager from "../../../../../core/audio/SoundManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { TaskManage } from "../../../../manager/TaskManage";
import { SceneManager } from "../../../../map/scene/SceneManager";
import SceneType from "../../../../map/scene/SceneType";
import OutyardManager from "../../../../manager/OutyardManager";
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;
import OutyardModel from "../../../outyard/OutyardModel";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import ConfigInfoManager from "../../../../manager/ConfigInfoManager";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { Int64Utils } from "../../../../../core/utils/Int64Utils";
import Utils from "../../../../../core/utils/Utils";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { ConsortiaDutyLevel } from "../../data/ConsortiaDutyLevel";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/21 14:53
 * @ver 1.0
 *
 */
export class ConsortiaActivityListView extends FUI_ConsortiaActivityListView {
    private _model: ConsortiaModel;
    private _contorller: ConsortiaControler;
    private _gvgController: GvgReadyController;
    private _list: ConsortiaActivityItem[];
    private _needOpenOutyardOpenWnd: boolean = false;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();

        this.initData();
        this.initEvent();
        this.initView();
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._model = this._contorller.model;
        this._list = [];
    }

    private initEvent() {
        ConsortiaManager.Instance.model.secretInfo.addEventListener(ConsortiaEvent.TREE_STATE_UPDATE, this.__updateSecret, this);
        ConsortiaManager.Instance.addEventListener(ConsortiaEvent.DEMON_SWITCH, this.__demonSwitchHandler, this);
        this._model.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.updateConsortiaInfo, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.CONSORTIA_BOSS_SWITCH, this.consortiaBossStateUpdata, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.UPDATE_TREASURE_INFO, this.treasureMineralUpdate, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_STATE_INFO, this.updateOutyardInfo, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_OPEN_FRAME, this.openOutyardOpenWnd, this);
    }

    private treasureMineralUpdate() {
        this.consortiaTreasureInit();
    }

    private consortiaBossStateUpdata() {
        this.consortiaBossInit();
    }

    private updateOutyardInfo() {
        this.outYardInt();
    }

    private initView() {
        let item: ConsortiaActivityItem;
        let len: number = 0;
        if (ComponentSetting.CONSORTIA_GVG) {
            len = 5;
        }
        else {
            len = 4;
        }
        for (let i: number = 0; i < len; i++) {
            item = this.listActivity.addItemFromPool() as ConsortiaActivityItem;
            this._list.push(item);
        }
        this.skillInit();
        this.secretInit();
        if (ComponentSetting.CONSORTIA_GVG) {
            this.outYardInt();
        }
        this.consortiaBossInit();
        this.consortiaTreasureInit();
        // this.devilInit();
        // this.mineInit();
    }

    private updateConsortiaInfo() {
        this.consortiaBossStateUpdata();
        this.skillInit();
    }

    /** 公会技能初始化 */
    private skillInit() {
        let activitySkillInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activitySkillInfo.id = 0;
        activitySkillInfo.operatingFun = null;
        activitySkillInfo.isOpen = true;
        if (this._model.consortiaInfo.levels < 3) {
            activitySkillInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.openSkillPanel");
            activitySkillInfo.gotoFunction = null;
        }
        else {
            activitySkillInfo.promptTxt = "";
            activitySkillInfo.gotoFunction = this.showConsortSkillPanel.bind(this);
        }
        this._list[activitySkillInfo.id].refreshView(activitySkillInfo);
    }

    /** 公会密境初始化 */
    private secretInit() {
        let activitySecretInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activitySecretInfo.id = 1;
        activitySecretInfo.operatingFun = null;
        activitySecretInfo.gotoFunction = this.gotoSecret.bind(this);
        activitySecretInfo.isOpen = true;
        if (this._model.secretInfo.remainGainTime > 0) {
            activitySecretInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.treeisOpen");
        }
        else {
            activitySecretInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.treeIsClose");
        }
        this._list[activitySecretInfo.id].refreshView(activitySecretInfo);
    }

    /**公会战 外城争夺玩法 */
    //报名按钮只有会长和副会长显示, 报名按钮在报名收集阶段才可用
    //前往按钮 只有在备战和开战中才可用
    private outYardInt() {
        let activityGvgInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activityGvgInfo.id = 2;
        activityGvgInfo.isOpen = true;
        activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.notInList");
        let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
        if (stateMsg) {
            if (OutyardManager.Instance.model.checkIsOpenDay()) {//如果是比赛日
                if (stateMsg.state == OutyardModel.OVER) {
                    activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.notInList");
                } else {
                    if (OutyardManager.Instance.model.isOpenTime()) {//在开放时间段内
                        //争夺中
                        activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.gvgTxt3");
                    } else if (stateMsg.state == OutyardModel.COLLECT) {
                        activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.gvgTxt1");
                    } else if (stateMsg.state == OutyardModel.READY) {
                        //备战中
                        activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.gvgTxt2");
                    }
                }
            }
            if (this.isConsortiaChairman(ConsortiaDutyInfo.STACKHEAD_SIGNIN)) {//会长
                if (!stateMsg.myGuildSignup) {//未报名
                    activityGvgInfo.btnLabel = LangManager.Instance.GetTranslation("consortia.outYardInt.text");//报名
                }
                else {
                    activityGvgInfo.btnLabel = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.goto");//前往
                }
            } else {//非会长
                activityGvgInfo.btnLabel = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.goto");//前往
            }
            activityGvgInfo.gotoFunction = this.enterOutyardScene.bind(this);
            activityGvgInfo.operatingFun = null;
            this._list[activityGvgInfo.id].refreshView(activityGvgInfo);
        }
    }

    private enterOutyard() {
        this._needOpenOutyardOpenWnd = false;
        let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
        if (stateMsg.canSignin && !stateMsg.myGuildSignup) {

        }
        else if (stateMsg.state == OutyardModel.NOT_OPEN) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.notInList"));
            return;
        }
        if (!stateMsg.myGuildSignup)//未报名
        {
            if (stateMsg.state == OutyardModel.COLLECT) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.NotCanSignup"));
                return;
            }
            if (stateMsg.canSignin)//可报名
            {
                if (this.isConsortiaChairman(ConsortiaDutyInfo.STACKHEAD_SIGNIN))//公会会长
                {
                    let config: number = ConfigInfoManager.Instance.getStackHeadJoinFee();
                    let content: string = LangManager.Instance.GetTranslation("outyard.OutyardBlessFrame.openTxt.text", config);
                    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
                    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                    SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.__alertOutyardHandler.bind(this));
                } else {//您所在的公会尚未报名
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.OutyardFrame.consortiaSignup"));
                }
            }
            else //今日不可报名
            {
                if (stateMsg.isSpan) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.nextOpenDateNew"));
                }
                else {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.OutyardFrame.cannotReportToday"));
                }
            }
            return;
        }
        //已经报名的情况
        if (OutyardManager.Instance.model.checkIsOpenDay()) {//是比赛日
            //请求活动数据, 如果能够收到返回数据打开入口界面,否则不处理
            if (stateMsg.state == OutyardModel.COLLECT) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.gvgTxt1"));
                return;
            }
            this._needOpenOutyardOpenWnd = true;
            OutyardManager.Instance.OperateOutyard(OutyardManager.OPEN_FRAME);
        } else {//非比赛日
            let time = stateMsg.nextOpenTime as Long
            var nextOpenTime: number = 0;
            if (time.high) {
                nextOpenTime = Int64Utils.int64ToNumber(time);
            } else {
                nextOpenTime = Number(stateMsg.nextOpenTime);
            }
            if (nextOpenTime == 0) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.noOpenToday"));
                return;
            }
            let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
            var start: Date = Utils.formatTimeZone(nextOpenTime, zoneOffset);
            var timeStr: string = DateFormatter.timeFormat1(start);
            if (stateMsg.state == OutyardModel.NOT_OPEN)//今天不开放
            {
                if (stateMsg.isSpan) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.nextOpenDateNew"));
                } else {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.nextOpenDate", timeStr));
                }
                return;
            }
            if (stateMsg.state == OutyardModel.COLLECT)//收集报名信息中
            {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.OutyardFrame.gatherToday"));
                return;
            }
            if (!stateMsg.myGuildJoin)//我自己今天不能玩
            {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.nextOpenDate", timeStr));
                return;
            }
        }
    }

    /**
     * 报名
     */
    private enterOutyardScene() {
        this.enterOutyard();
    }

    private isConsortiaChairman(duty: number): boolean {
        let flag: boolean = false;
        let consortiaControler: ConsortiaControler = FrameCtrlManager.Instance.getCtrl(EmWindow.ConsortiaSecretInfoWnd) as ConsortiaControler;
        if (consortiaControler) {
            let consortiaModel: ConsortiaModel = consortiaControler.model;
            if (consortiaModel) {
                flag = consortiaModel.getRightsByIndex(duty)
            }
        }
        return flag;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private openOutyardOpenWnd() {
        if (this._needOpenOutyardOpenWnd) {
            FrameCtrlManager.Instance.open(EmWindow.OutyardFigureWnd);
            FrameCtrlManager.Instance.exit(EmWindow.Consortia);
            this._needOpenOutyardOpenWnd = false;
        }
    }

    private __alertOutyardHandler(b: boolean, flag: boolean) {
        if (b) {
            OutyardManager.Instance.OperateOutyard(OutyardManager.ENTER);
        }
    }

    /** 公会战初始化 */
    private gvgInit() {
        let activityGvgInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activityGvgInfo.id = 2;
        activityGvgInfo.isOpen = true;
        activityGvgInfo.gotoFunction = this.openGvgHandler.bind(this);
        activityGvgInfo.isEnabled = true;
        activityGvgInfo.btnLabel = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.managerList");
        activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.notInList");
        if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.TRANSFER)) {
            activityGvgInfo.operatingFun = this.openGvgHandler.bind(this);
        }
        else {
            activityGvgInfo.operatingFun = null;
        }
        if (this.playerInfo.gvgIsOpen) {
            //开始 判断是否在参战列表中
            if (this.isInFightList()) {
                activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.warIsOpen");
            }
            else {
                activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.notInList");
            }
        }
        else {
            //未开始 判断下次开始时间
            activityGvgInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.warIsClose");
        }

        this._list[activityGvgInfo.id].refreshView(activityGvgInfo);
    }

    /** 公会BOSS勇者之战初始化 */
    private consortiaBossInit() {
        var activityBossInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activityBossInfo.id = 3;
        activityBossInfo.isOpen = true;
        if (this._model.consortiaInfo.levels >= 6) {
            activityBossInfo.isEnabled = true;
            activityBossInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossPromptTxt" + this._model.bossInfo.state);
            if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.CALL_BOSS)) {
                activityBossInfo.btnLabel = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossBtnLabel01");
                activityBossInfo.operatingFun = this.operatBossHandler.bind(this);
            } else {
                activityBossInfo.btnLabel = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossBtnLabel02");
                activityBossInfo.operatingFun = this.openBossReward.bind(this);
            }
            activityBossInfo.gotoFunction = this.gotoBossCampaign.bind(this);
        } else {
            activityBossInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossPromptTxt", 6);
        }

        this._list[activityBossInfo.id].refreshView(activityBossInfo);
    }

    /**公会宝藏矿脉信息 */
    private consortiaTreasureInit() {
        var consortiaTreasure: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        consortiaTreasure.id = 4;
        consortiaTreasure.isOpen = true;
        consortiaTreasure.isEnabled = true;
        consortiaTreasure.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.consortiaTreasure" + PlayerManager.Instance.currentPlayerModel.treasureState);
        consortiaTreasure.btnLabel = LangManager.Instance.GetTranslation("PetChallengeInfoView.lookReward");
        consortiaTreasure.operatingFun = this.openTreasureWnd.bind(this);
        consortiaTreasure.gotoFunction = this.goToOuterCity.bind(this);
        this._list[consortiaTreasure.id].refreshView(consortiaTreasure);
    }

    private openTreasureWnd() {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaTreasureWnd);
    }
    /**
     * 进入外城
     */
    private goToOuterCity() {
        let str: string;
        if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
            str = LangManager.Instance.GetTranslation("consortiaActivityListView.goToOuterCity.tips");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (!TaskManage.Instance.IsTaskFinish(TaskManage.SETARMY_TASK)) {
            str = LangManager.Instance.GetTranslation("newbie.needfinishTask");
            MessageTipManager.Instance.show(str);
            return;
        }
        SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
    }

    /**
     *管理boss界面 
     */
    private operatBossHandler() {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaBossWnd);
    }

    /**
     *查看boss奖励界面 
     */
    private openBossReward() {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaBossRewardWnd);
    }

    /**
     *进入公会boss副本 
     */
    private gotoBossCampaign() {
        SoundManager.Instance.play(SoundIds.CONFIRM_SOUND);
        var str: string;
        if (MopupManager.Instance.model.isMopup) {
            str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (this._model.bossInfo.state != 1 && this._model.bossInfo.state != 2) {
            str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossPromptTxt" + this._model.bossInfo.state);
            MessageTipManager.Instance.show(str);
            return;
        }
        if (this.checkScene()) ConsortiaSocketOutManager.enterConsortiaBoss();
    }

    private isInFightList(): boolean {
        let list: any[] = this._model.getSortMemberList();
        let len: number = list.length;
        let thane: ThaneInfo;
        for (let i: number = 0; i < len; i++) {
            thane = list[i] as ThaneInfo;
            if (thane.userId == this.playerInfo.userId) {
                return true;
            }
        }
        return false;

    }

    /** 魔神祭祀初始化 */
    private devilInit() {
        let activityDevilInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activityDevilInfo.id = 5;

        activityDevilInfo.gotoFunction = this.gotoDemon.bind(this);
        activityDevilInfo.isOpen = true;
        activityDevilInfo.operatingFun = null;
        activityDevilInfo.isEnabled = false;
        activityDevilInfo.btnLabel = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.openDevil");
        if (this._model.demonInfo.state == 0)  //魔神祭祀已开启 0 可开启, 1 开启中, 2 已结束
        {
            activityDevilInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.devilisClose");
            activityDevilInfo.isEnabled = true;
            this.checkStart(activityDevilInfo);
        }
        else if (this._model.demonInfo.state == 1)  //未开启
        {
            activityDevilInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.devilisOpen");
            activityDevilInfo.isEnabled = false;
            this.checkStart(activityDevilInfo);
        }
        else if (this._model.demonInfo.state == 2) //已结束
        {
            activityDevilInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.devilisEnd");
            activityDevilInfo.isEnabled = false;
            this.checkStart(activityDevilInfo);
        }
        else //异常
        {
            activityDevilInfo.btnLabel = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.openDevil");
            activityDevilInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.devilisClose");
        }
        this._list[activityDevilInfo.id].refreshView(activityDevilInfo);

    }

    /** 检测魔神祭坛是否开启 */
    private checkStart(activityInfo: ConsortiaActivityInfo) {
        if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.TRANSFER)) {
            if (this._model.consortiaInfo.levels >= 5) {
                activityInfo.operatingFun = this.openDemon.bind(this);
            }
        }
    }


    /** 矿产初始化 */
    private mineInit() {
        let activityMineInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activityMineInfo.id = 6;
        activityMineInfo.isOpen = false;
        activityMineInfo.promptTxt = LangManager.Instance.GetTranslation("public.unopen");
        this._list[activityMineInfo.id].refreshView(activityMineInfo);
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    /** 开启祭坛 */
    private openDemon() {
        let canJoin: number = this._model.demonInfo.isCanJoin;
        if (canJoin > 0) {
            let isChairman: boolean = this._contorller.getRightsByIndex(ConsortiaDutyInfo.UPDATEBUILDING);
            if (isChairman && canJoin != 103) {
                this._contorller.openDevilFrame();
            }
            else {
                MessageTipManager.Instance.show(this._model.demonInfo.getLimitTip(canJoin));
            }
        }
    }

    /** 进入祭坛 */
    private gotoDemon() {
        if (this.checkScene()) {
            ConsortiaSocketOutManager.sendEnterDemon();
        }
    }

    /** 进入公会战 */
    private openGvgHandler() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        if (MopupManager.Instance.model.isMopup) {
            let str: string = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
            MessageTipManager.Instance.show(str);
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.GvgRankListWnd);
        // this._gvgController.requestGuildGroup();
    }

    /** 前往公会密境 */
    private gotoSecret() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        if (MopupManager.Instance.model.isMopup) {
            let str: string = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (this.checkScene()) {
            ConsortiaSocketOutManager.sendEnterSecretLand();
        }
    }

    /**
     * 场景检测 是否能在当前场景进行的操作
     * @return 能返回true 否则返回false
     *
     */
    private checkScene(): boolean {
        let tipStr: string = WorldBossHelper.getCampaignTips();
        if (StringHelper.isNullOrEmpty(tipStr)) {
            return true;
        }
        else {
            MessageTipManager.Instance.show(tipStr);
            return false;
        }
    }

    /**打开公会技能面板*/
    private showConsortSkillPanel() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        this._contorller.showSkillFrame(1);
    }

    private __demonSwitchHandler(e: ConsortiaEvent) {
        this.devilInit();
    }

    private __updateSecret(evt: ConsortiaEvent) {
        this.secretInit();
    }

    private removeEvent() {
        ConsortiaManager.Instance.model.secretInfo.removeEventListener(ConsortiaEvent.TREE_STATE_UPDATE, this.__updateSecret, this);
        ConsortiaManager.Instance.removeEventListener(ConsortiaEvent.DEMON_SWITCH, this.__demonSwitchHandler, this);
        this._model.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.updateConsortiaInfo, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.CONSORTIA_BOSS_SWITCH, this.consortiaBossStateUpdata, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.UPDATE_TREASURE_INFO, this.treasureMineralUpdate, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_STATE_INFO, this.updateOutyardInfo, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_OPEN_FRAME, this.openOutyardOpenWnd, this);
    }

    dispose() {
        this.removeEvent();
        this.listActivity.removeChildrenToPool();
        this._model = null;
        this._contorller = null;
        this._list = null;
        super.dispose();
    }
}