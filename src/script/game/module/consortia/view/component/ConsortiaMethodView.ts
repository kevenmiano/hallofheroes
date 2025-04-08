import FUI_ConsortiaMethodView from "../../../../../../fui/Consortia/FUI_ConsortiaMethodView";
import AudioManager from "../../../../../core/audio/AudioManager";
import SoundManager from "../../../../../core/audio/SoundManager";
import LangManager from "../../../../../core/lang/LangManager";
import StringHelper from "../../../../../core/utils/StringHelper";
import Utils from "../../../../../core/utils/Utils";
import { SoundIds } from "../../../../constant/SoundIds";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaEvent, NotificationEvent, OuterCityEvent } from "../../../../constant/event/NotificationEvent";
import { ConsortiaSocketOutManager } from "../../../../manager/ConsortiaSocketOutManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { MopupManager } from "../../../../manager/MopupManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import ComponentSetting from "../../../../utils/ComponentSetting";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaActivityInfo } from "../../data/ConsortiaActivityInfo";
import { ConsortiaDutyInfo } from "../../data/ConsortiaDutyInfo";
import { ConsortiaInfo } from "../../data/ConsortiaInfo";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import ConsortiaMethodItem from "./ConsortiaMethodItem";
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { Int64Utils } from "../../../../../core/utils/Int64Utils";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import ConfigInfoManager from "../../../../manager/ConfigInfoManager";
import OutyardManager from "../../../../manager/OutyardManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import OutyardModel from "../../../outyard/OutyardModel";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { TaskManage } from "../../../../manager/TaskManage";
import { SceneManager } from "../../../../map/scene/SceneManager";
import SceneType from "../../../../map/scene/SceneType";
import { NotificationManager } from "../../../../manager/NotificationManager";

export default class ConsortiaMethodView extends FUI_ConsortiaMethodView {
    private _contorller: ConsortiaControler;
    private _consortiaModel: ConsortiaModel;
    private _functionDataArr: Array<ConsortiaActivityInfo>;
    private _methodDataArr: Array<ConsortiaActivityInfo>;
    private _needOpenOutyardOpenWnd: boolean = false;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.initView();
        this.initEvent();
        this.initData();
    }

    private initView() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._consortiaModel = this._contorller.model;
        this.desxTxt1.text = LangManager.Instance.GetTranslation("ConsortiaMethodView.desxTxt1");
        this.desxTxt2.text = LangManager.Instance.GetTranslation("ConsortiaMethodView.desxTxt2");
    }

    private initEvent() {
        this.functionList.itemRenderer = Laya.Handler.create(this, this.renderFunctionListItem, null, false);
        this.methodList.itemRenderer = Laya.Handler.create(this, this.renderMethodListItem, null, false);
        this._consortiaModel.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.initData, this);
        this._consortiaModel.secretInfo.addEventListener(ConsortiaEvent.TREE_STATE_UPDATE, this.initMethodData, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.CONSORTIA_BOSS_SWITCH, this.initMethodData, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.UPDATE_TREASURE_INFO, this.initMethodData, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_STATE_INFO, this.initMethodData, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_OPEN_FRAME, this.openOutyardOpenWnd, this);
        NotificationManager.Instance.addEventListener(ConsortiaEvent.GET_ALTAR_GOODS, this.updatePrayRed, this);
        NotificationManager.Instance.addEventListener(ConsortiaEvent.TASK_INFO, this.updateTaskRed, this);
    }

    private removeEvent() {
        Utils.clearGListHandle(this.functionList);
        Utils.clearGListHandle(this.methodList);
        this._consortiaModel.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.initData, this);
        this._consortiaModel.secretInfo.removeEventListener(ConsortiaEvent.TREE_STATE_UPDATE, this.initMethodData, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.CONSORTIA_BOSS_SWITCH, this.initMethodData, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.UPDATE_TREASURE_INFO, this.initMethodData, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_STATE_INFO, this.initMethodData, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_OPEN_FRAME, this.openOutyardOpenWnd, this);
        NotificationManager.Instance.removeEventListener(ConsortiaEvent.GET_ALTAR_GOODS, this.updatePrayRed, this);
        NotificationManager.Instance.removeEventListener(ConsortiaEvent.TASK_INFO, this.updateTaskRed, this);
    }

    private updatePrayRed(){
        let item:ConsortiaMethodItem = this.functionList.getChildAt(1) as ConsortiaMethodItem;
        item.info = this._functionDataArr[1];
    }

    private updateTaskRed(){
        let item:ConsortiaMethodItem = this.functionList.getChildAt(0) as ConsortiaMethodItem;
        item.info = this._functionDataArr[0];
    }

    private renderFunctionListItem(index: number, item: ConsortiaMethodItem) {
        if (!item || item.isDisposed) return;
        item.info = this._functionDataArr[index];
    }

    private renderMethodListItem(index: number, item: ConsortiaMethodItem) {
        if (!item || item.isDisposed) return;
        item.info = this._methodDataArr[index];
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._consortiaModel = this._contorller.model;
        this.initFunctionData();
        this.initMethodData();
    }

    private initFunctionData() {
        this._functionDataArr = [];
        let taskInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        taskInfo.id = ConsortiaModel.ACTIVITY_INFO_TYPE14;
        taskInfo.type = 1;
        taskInfo.operatingFun = null;
        taskInfo.gotoFunction = this.onTaskBtnClick.bind(this);
        taskInfo.isOpen = true;
        this._functionDataArr.push(taskInfo);

        let altarInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        altarInfo.id = ConsortiaModel.ACTIVITY_INFO_TYPE13;
        altarInfo.type = 1;
        altarInfo.operatingFun = null;
        altarInfo.gotoFunction = this.onAltarBtnClick.bind(this);
        altarInfo.isOpen = true;
        this._functionDataArr.push(altarInfo);

        let schoolInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        schoolInfo.id = ConsortiaModel.ACTIVITY_INFO_TYPE12;
        schoolInfo.type = 1;
        schoolInfo.operatingFun = null;
        schoolInfo.gotoFunction = this.onSkillBtnClick.bind(this);
        schoolInfo.isOpen = true;
        this._functionDataArr.push(schoolInfo);

        let shopInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        shopInfo.id = ConsortiaModel.ACTIVITY_INFO_TYPE11;
        shopInfo.type = 1;
        shopInfo.operatingFun = null;
        shopInfo.gotoFunction = this.onShopBtnClick.bind(this);
        shopInfo.isOpen = true;
        this._functionDataArr.push(shopInfo);

        this.functionList.numItems = this._functionDataArr.length;
    }

    private initMethodData() {
        this._methodDataArr = [];
        this.secretInit();
        this.consortiaBossInit();
        if (ComponentSetting.CONSORTIA_GVG) {
            this.outYardInt();
        }
        this.consortiaTreasureInit();
        this.initNullItem();
        this._methodDataArr.sort(this.sortById);
        this.methodList.numItems = this._methodDataArr.length;
    }

    //公会秘境
    private secretInit() {
        let activitySecretInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activitySecretInfo.id = ConsortiaModel.ACTIVITY_INFO_TYPE1;
        activitySecretInfo.operatingFun = null;
        activitySecretInfo.type = 2;
        activitySecretInfo.gotoFunction = this.gotoSecret.bind(this);
        activitySecretInfo.isOpen = true;
        if (this._consortiaModel.secretInfo.remainGainTime > 0) {
            activitySecretInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.treeisOpen");
        }
        else {
            activitySecretInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.treeIsClose");
        }
        this._methodDataArr.push(activitySecretInfo);
    }

    /** 前往公会密境 */
    private gotoSecret() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        if (MopupManager.Instance.model.isMopup) {
            let str: string = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if(ArmyManager.Instance.army.onVehicle){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            return;
        }
        if (this.checkScene()) {
            ConsortiaSocketOutManager.sendEnterSecretLand();
        }
    }

    /** 公会BOSS勇者之战初始化 */
    private consortiaBossInit() {
        var activityBossInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activityBossInfo.id = ConsortiaModel.ACTIVITY_INFO_TYPE2;
        activityBossInfo.type = 3;
        activityBossInfo.isOpen = true;
        if (this._consortiaModel.consortiaInfo.levels >= 6) {
            activityBossInfo.isEnabled = true;
            activityBossInfo.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossPromptTxt" + this._consortiaModel.bossInfo.state);
            if (this._contorller && this._contorller.getRightsByIndex(ConsortiaDutyInfo.CALL_BOSS)) {
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
        this._methodDataArr.push(activityBossInfo);
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
        if (this._consortiaModel.bossInfo.state != 1 && this._consortiaModel.bossInfo.state != 2) {
            str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossPromptTxt" + this._consortiaModel.bossInfo.state);
            MessageTipManager.Instance.show(str);
            return;
        }
        if(ArmyManager.Instance.army.onVehicle){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            return;
        }
        if (this.checkScene()) ConsortiaSocketOutManager.enterConsortiaBoss();
    }

    private outYardInt() {
        let activityGvgInfo: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        activityGvgInfo.id = ConsortiaModel.ACTIVITY_INFO_TYPE3;
        activityGvgInfo.isOpen = true;
        activityGvgInfo.type = 2;
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
            if (this.isConsortiaChairman()) {//会长
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
            this._methodDataArr.push(activityGvgInfo);
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
                if (this.isConsortiaChairman())//公会会长
                {
                    let config: number = ConfigInfoManager.Instance.getStackHeadJoinFee();
                    let content: string = LangManager.Instance.GetTranslation("outyard.OutyardBlessFrame.openTxt.text", config);
                    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
                    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                    SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.__alertOutyardHandler.bind(this));
                }
                else {//您所在的公会尚未报名
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
            if(ArmyManager.Instance.army.onVehicle){
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
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

    private __alertOutyardHandler(b: boolean, flag: boolean) {
        if (b) {
            OutyardManager.Instance.OperateOutyard(OutyardManager.ENTER);
        }
    }

    /**
     * 报名
     */
    private enterOutyardScene() {
        this.enterOutyard();
    }

    /**公会宝藏矿脉信息 */
    private consortiaTreasureInit() {
        var consortiaTreasure: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        consortiaTreasure.id = ConsortiaModel.ACTIVITY_INFO_TYPE4;
        consortiaTreasure.isOpen = true;
        consortiaTreasure.type = 3;
        consortiaTreasure.isEnabled = true;
        consortiaTreasure.promptTxt = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.consortiaTreasure" + PlayerManager.Instance.currentPlayerModel.treasureState);
        consortiaTreasure.btnLabel = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossBtnLabel03");
        consortiaTreasure.operatingFun = this.openTreasureWnd.bind(this);
        consortiaTreasure.gotoFunction = this.goToOuterCity.bind(this);
        this._methodDataArr.push(consortiaTreasure);
    }

    /**敬请期待 */
    private initNullItem() {
        var consortiaTreasure: ConsortiaActivityInfo = new ConsortiaActivityInfo();
        consortiaTreasure.id = ConsortiaModel.ACTIVITY_INFO_TYPE5;
        consortiaTreasure.isOpen = true;
        consortiaTreasure.type = 0;
        consortiaTreasure.isEnabled = true;
        consortiaTreasure.promptTxt = ""
        consortiaTreasure.btnLabel = ""
        this._methodDataArr.push(consortiaTreasure);
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
            str = LangManager.Instance.GetTranslation("newbie.outerCity.outerOccupyAlert");
            MessageTipManager.Instance.show(str);
            return;
        }
        SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
    }

    private isConsortiaChairman(): boolean {
        let flag: boolean = false;
        let consortiaControler: ConsortiaControler = FrameCtrlManager.Instance.getCtrl(EmWindow.ConsortiaSecretInfoWnd) as ConsortiaControler;
        if (consortiaControler) {
            let consortiaModel: ConsortiaModel = consortiaControler.model;
            if (consortiaModel && consortiaModel.consortiaInfo.chairmanID == this.thane.userId) {
                flag = true;
            }
        }
        return flag;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    //任务
    private onTaskBtnClick() {
        if (this.consortiaInfo.storeLevel <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaMethodView.functionTips"));
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaTaskWnd);
    }

    //祭坛
    private onAltarBtnClick() {
        if (this.consortiaInfo.altarLevel <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaMethodView.functionTips"));
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaPrayWnd);
    }

    //技能
    private onSkillBtnClick() {
        if (this.consortiaInfo.schoolLevel <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaMethodView.functionTips"));
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaSkillTower);
    }

    //商店
    private onShopBtnClick() {
        if (this.consortiaInfo.shopLevel <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaMethodView.functionTips"));
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 1, returnToWin: EmWindow.Consortia, returnToWinFrameData: 1 }, null, EmWindow.Consortia);
    }

    private openOutyardOpenWnd() {
        if (this._needOpenOutyardOpenWnd) {
            FrameCtrlManager.Instance.open(EmWindow.OutyardFigureWnd);
            FrameCtrlManager.Instance.exit(EmWindow.Consortia);
            this._needOpenOutyardOpenWnd = false;
        }
    }

    private get consortiaInfo(): ConsortiaInfo {
        return (FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler).model.consortiaInfo;
    }

    private sortById(a, b): number {
        if (a.id < b.id) {
            return -1;
        } else if (a.id == b.id) {
            return 0;
        } else if (a.id > b.id) {
            return 1;
        }
        return 0;
    }

    public OnHideWind() {
        this.removeEvent();
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


    dispose(dispose?: boolean) {
        this._contorller = null;
        super.dispose()
    }

}