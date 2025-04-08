// @ts-nocheck
import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import { PackageIn } from '../../core/net/PackageIn';
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { SocketManager } from '../../core/net/SocketManager';
import { DateFormatter } from '../../core/utils/DateFormatter';
import { AlertTipAction } from '../battle/actions/AlertTipAction';
import { FunnyEvent } from '../constant/event/NotificationEvent';
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { PlayerModel } from '../datas/playerinfo/PlayerModel';
import { TipMessageData } from '../datas/TipMessageData';
import FunnyBagData from '../module/funny/model/FunnyBagData';
import FunnyData from '../module/funny/model/FunnyData';
import FunnyRewardData from '../module/funny/model/FunnyRewardData';
import FunnyType from '../module/funny/model/FunnyType';
import { DelayActionsUtils } from '../utils/DelayActionsUtils';
import { PlayerManager } from './PlayerManager';
import { ShopManager } from './ShopManager';
import { TempleteManager } from './TempleteManager';
import LangManager from '../../core/lang/LangManager';
import { TaskTraceTipManager } from './TaskTraceTipManager';
import { PlayerInfo } from '../datas/playerinfo/PlayerInfo';
import { SharedManager } from './SharedManager';
import Dictionary from '../../core/utils/Dictionary';
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import ActivityManager from './ActivityManager';
import ActiveInfo from '../module/activity/ActiveInfo';
import FunnyConditionData from '../module/funny/model/FunnyConditionData';

import ActiveData = com.road.yishi.proto.active.ActiveData;
import PackageConditionMsg = com.road.yishi.proto.active.PackageConditionMsg;
import PackageData = com.road.yishi.proto.active.PackageData;
import SumActiveDataMsg = com.road.yishi.proto.active.SumActiveDataMsg;
import SumActiveGetPackageMsg = com.road.yishi.proto.active.SumActiveGetPackageMsg;
import SumActiveItemInfoMsg = com.road.yishi.proto.active.SumActiveItemInfoMsg;
import SumActivePackageMsg = com.road.yishi.proto.active.SumActivePackageMsg;
import SumActiveinfoMsg = com.road.yishi.proto.active.SumActiveinfoMsg;
import SumActivesMsg = com.road.yishi.proto.active.SumActivesMsg;
import { MemoryCardManager } from '../module/funny/control/MemoryCardManager';
import LuckyExchangeManager from './LuckyExchangeManager';
import LuckExchangeTempMsg = com.road.yishi.proto.active.LuckExchangeTempMsg;
import SumActiveActivateRespMsg = com.road.yishi.proto.active.SumActiveActivateRespMsg;
import {MessageTipManager} from "./MessageTipManager";

/**
 * 精彩活动管理类 
 */
export default class FunnyManager extends GameEventDispatcher {

    private static _instance: FunnyManager;

    public static get Instance(): FunnyManager {
        if (!this._instance) this._instance = new FunnyManager();
        return this._instance;
    }
    private version: number = 0;//数据标记, 数值越大, 表示越新
    private total: number = 0;//对于分包发送数据的计数

    /**精彩活动数据Map */
    private _dataMaps: Map<string, FunnyData> = new Map();

    /**
     * 精彩活动数据列表 
     */
    private _data: Array<FunnyData> = [];
    /**
     *  当前选择的活动ID
     */
    public selectedId: string = "";
    /**
     * 删档充值当前领取项
     */
    public deleteChargeRewardIndex:number = 0;
    public showData: Array<FunnyData> = [];
    /**
     *  精彩活动按钮是否可以闪烁
     */
    public canShine: boolean = true;
    /**
     * 活动兑奖的兑奖列表 
     */
    private _activityArr: Array<any> = [];
    /**
     * 是否需要提示
     */
    private _needTipRegression: boolean = true;
    /**
     * 是否已经领取回归礼包
     */
    private _hasGetGift: boolean = false;
    /**
     * 回归礼包活动id
     */
    private _regressionActiveId: string = "";
    /**
     * 回归礼包活动充值金额
     */
    private _regressionActiveCost: number = 0;
    public backPlayerBtnEnable: boolean;
    public get regressionActiveId(): string {
        return this._regressionActiveId;
    }

    public get regressionActiveCost(): number {
        return this._regressionActiveCost;
    }

    constructor() {
        super();
        this._data = [];
        this._dataMaps = new Map();
        this.oldDic[FunnyType.ACTIVITY_CODE_ID] = FunnyType.ACTIVITY_CODE_ID;
    }
    
    public setup() {
        MemoryCardManager.Instance.setup();
        LuckyExchangeManager.Instance.setup();
        this.initEvent();
    }
    
    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_SUM_ACTIVE_TEMP, this, this.__funnyTemHandler);//精彩活动模版
        ServerDataManager.listen(S2CProtocol.U_C_SUMACTIVE_DATA, this, this.__funnyUserHandler);//精彩活动用户数据
        ServerDataManager.listen(S2CProtocol.U_C_NEW_PLAYER_GIFT, this, this.__backPlayerHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SUMACTIVE_ACTIVATEDATA_RESP, this, this.__funnyStateHandler);//多服参与活动的状态
    }

    protected __backPlayerHandler(event: PackageIn) {
        this.backPlayerBtnEnable = true;
    }

    protected __funnyStateHandler(pkg: PackageIn) {
        let msg: SumActiveActivateRespMsg = pkg.readBody(SumActiveActivateRespMsg) as SumActiveActivateRespMsg;
        let data:FunnyData = this.findFunnyDataById(msg.activeId);
        data.state = msg.ret == 1 ? 0 : -1;
        let data1:FunnyData = this._dataMaps.get(msg.activeId);
        data1.state = msg.ret == 1 ? 0 : -1;
        let str:string = "";
        //(1:成功激活 0: 已被其他激活、参与 -9:网络异常重试 -10:活动不存在 -11:活动过期 -12:不能参与 -13:已被其他角色激活 other:其他异常)
        switch(msg.ret)
        {
            case 0:
                str = LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed1");
                break;
            case 1:
                str = LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinsucc");
                break;
            case -9:
                str = LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed2");
                break;
            case -10:
                str = LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed3");
                break;
            case -11:
                str = LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed4");
                break;
            case -12:
                str = LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed5");
                break;
            // case -13: -13 和 0 是一样的提示, 服务端已去除 -13
            //     str = LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed6");
            //     break;
            default:
                str = LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed7");
        }
        MessageTipManager.Instance.show(str);
    }
    private cleanData() {
        while (this._data.length > 0) {
            this._data.pop().dispose();
        }
        this._data = [];
        this._dataMaps.clear();
    }
    /***
     * 接收精彩活动的模版
     * 接受完成后请求用户在此次活动中的相关数据
     * */
    private __funnyTemHandler(pkg: PackageIn) {
        let msg: SumActivesMsg = pkg.readBody(SumActivesMsg) as SumActivesMsg;
        if (msg.dataStamp > this.version) {
            this.version = msg.dataStamp;
            this.cleanData();
            this.total = 0;
        }
        this.total++;
        var actives = msg.actives;
        var packages: Array<any>;
        var items: Array<any>;
        var conditions: Array<any>;
        for (var i: number = 0; i < actives.length; i++) {
            let activesData = actives[i] as SumActiveinfoMsg;
            if (DateFormatter.parse((actives[i] as SumActiveinfoMsg).stopTime, "YYYY-MM-DD hh:mm:ss").getTime() < this.playerModel.nowDate) {
                continue;//过了展示时间则不添加
            }

            if (this._dataMaps.get(activesData.activeId)) {
                continue;//已经存在不重复添加
            }
            var funnyData: FunnyData = new FunnyData();
            funnyData.id = activesData.activeId;
            funnyData.type = activesData.activeType;
            funnyData.multiLangTitle = activesData.title;
            funnyData.multiLangdescribe = activesData.detail;
            funnyData.condition = activesData.conditionDetail;
            funnyData.getWay = activesData.getway;
            funnyData.startTime = DateFormatter.parse(activesData.beginDate, "YYYY-MM-DD hh:mm:ss").getTime();
            funnyData.endTime = DateFormatter.parse(activesData.endDate, "YYYY-MM-DD hh:mm:ss").getTime();
            funnyData.showStart = DateFormatter.parse(activesData.startTime, "YYYY-MM-DD hh:mm:ss").getTime();
            funnyData.showEnd = DateFormatter.parse(activesData.stopTime, "YYYY-MM-DD hh:mm:ss").getTime();
            funnyData.order = activesData.order;
            packages = activesData.packages;
            for (var j: number = 0; j < packages.length; j++) {
                var bagData: FunnyBagData = new FunnyBagData();
                bagData.id = (packages[j] as SumActivePackageMsg).packageId;
                bagData.order = (packages[j] as SumActivePackageMsg).order;
                items = (packages[j] as SumActivePackageMsg).items;
                conditions = (packages[j] as SumActivePackageMsg).conditions;
                for (var k1: number = 0; k1 < items.length; k1++) {
                    var item: FunnyRewardData = new FunnyRewardData();
                    item.temId = (items[k1] as SumActiveItemInfoMsg).templateId;
                    item.temType = (items[k1] as SumActiveItemInfoMsg).templateType;
                    item.count = (items[k1] as SumActiveItemInfoMsg).count;
                    item.isBind = (items[k1] as SumActiveItemInfoMsg).isbind;
                    item.strengthenGrade = (items[k1] as SumActiveItemInfoMsg).length;
                    item.job = (items[k1] as SumActiveItemInfoMsg).job;
                    bagData.rewardList.push(item);
                }
                for (var k2: number = 0; k2 < conditions.length; k2++) {
                    var condition: FunnyConditionData = new FunnyConditionData();
                    condition.id = (conditions[k2] as PackageConditionMsg).conditionId;
                    condition.value = (conditions[k2] as PackageConditionMsg).conditionValue;
                    condition.bak = (conditions[k2] as PackageConditionMsg).conditionBak;
                    condition.bak2 = (conditions[k2] as PackageConditionMsg).conditionBak2;
                    condition.bak3 = (conditions[k2] as PackageConditionMsg).conditionBak3;
                    condition.bak4 = (conditions[k2] as PackageConditionMsg).conditionBak4;
                    bagData.conditionList.push(condition);
                }
                bagData.rewardList.sort(this.sortMasterType);
                funnyData.bagList.push(bagData);
            }
            this._data.push(funnyData);
            this._dataMaps.set(funnyData.id, funnyData);
        }
        if (this.total >= msg.maxPage) {
            for (i = 0; i < this._data.length; i++) {
                this._data[i].bagList.sort(this.byOrder);
            }
            this._data.sort(this.byOrder);
            this.dispatchEvent(FunnyEvent.REFRESH_TEMP);
            this.sendGetBag(1);//查询用户个人的活动信息
        }
    }

    /**
     * 返回的精彩活动用户数据（包括消费值, 礼包领取情况等）
     * */
    private __funnyUserHandler(pkg: PackageIn) {
        let msg = pkg.readBody(SumActiveDataMsg) as SumActiveDataMsg;
        var change: boolean = false;
        var changeShine: boolean = false;
        var msgLen: number = msg.datas.length;
        for (var i: number = 0; i < msgLen; i++) {
            var funnyData: FunnyData = this.findFunnyDataById((msg.datas[i] as ActiveData).activeId);
            if (funnyData == null) {
                continue;
            }
            funnyData.anyToGet = false;
            funnyData.finishNum = (msg.datas[i] as ActiveData).value;
            funnyData.state = (msg.datas[i] as ActiveData).state;
            funnyData.type = (msg.datas[i] as ActiveData).type;
            funnyData.canGet = (msg.datas[i] as ActiveData).activeCharge;
            var pagLen: number = (msg.datas[i] as ActiveData).packdata.length;
            for (var k: number = 0; k < pagLen; k++) {
                var bagData: FunnyBagData = this.findFunnyBagDataById(funnyData, ((msg.datas[i] as ActiveData).packdata[k] as PackageData).packId);
                if (bagData == null) {
                    continue;
                }
                bagData.status = ((msg.datas[i] as ActiveData).packdata[k] as PackageData).status;
                bagData.remainTime = ((msg.datas[i] as ActiveData).packdata[k] as PackageData).countDown;
                bagData.isShow = ((msg.datas[i] as ActiveData).packdata[k] as PackageData).isShow;
                bagData.getCount = ((msg.datas[i] as ActiveData).packdata[k] as PackageData).getCount;
                bagData.finishValue = ((msg.datas[i] as ActiveData).packdata[k] as PackageData).finishValue;
                bagData.param1 = ((msg.datas[i] as ActiveData).packdata[k] as PackageData).param1;
                if (bagData.status == 1) {
                    if (funnyData.type != FunnyType.RECHARGE_TIME && funnyData.type != FunnyType.TYPE_ONLINE) {
                        changeShine = true;
                        funnyData.anyToGet = true;
                    }
                }
                if (funnyData.type == FunnyType.TYPE_LEAVE) {
                    this._regressionActiveId = funnyData.id;
                    this._regressionActiveCost = funnyData.canGet;
                    if (bagData.status == 2) {
                        this._hasGetGift = true;
                    }
                }
                change = true;
            }
        }
        if (changeShine && this.canShine) {
            this.dispatchEvent(FunnyEvent.ITEM_CANGET);
        }
        if (this._needTipRegression && this.playerInfo.isBackPlayer && !this._hasGetGift && this._regressionActiveId != "") {
            this._needTipRegression = false;
            DelayActionsUtils.Instance.addAction(new AlertTipAction("", this.__regressionDelayHandler));
        }
        if (change) {
            this.dispatchEvent(FunnyEvent.REFRESH_ITEM);
        }
    }


    public get showNumer(): number {
        var num: number = 0;
        for (var i: number = 0; i < this.activityList.length; i++) {
            if (!this.oldDic[this.activityList[i].activeId]) num++;
        }
        if (ShopManager.Instance.model.getTimeBuyList(0).length > 0) {
            if (!this.oldDic[FunnyType.HOT_BUY_ID]) num++;
        }
        if (ShopManager.Instance.model.getTimeBuyList(1).length > 0) {
            if (!this.oldDic[FunnyType.VIP_BUY_ID]) num++;
        }
        for (i = 0; i < this._data.length; i++) {
            if (this._data[i].showEnd < this.playerModel.nowDate || this._data[i].showStart > this.playerModel.nowDate) continue;//时间选择活动
            if (this._data[i].type == FunnyType.TYPE_ONLINE) continue;//不显示在线时长奖励
            if (this._data[i].type == FunnyType.RECHARGE_TIME) continue;//不显示时段性充值
            if (this._data[i].type == FunnyType.TYPE_LEAVE && !this.playerInfo.isBackPlayer) continue;//老玩家回归活动
            if (!this.oldDic[this._data[i].id]) num++;
        }
        return num;
    }
    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }


    public getShowData(id: string = ""): FunnyData {
        for (const key in this.showData) {
            if (Object.prototype.hasOwnProperty.call(this.showData, key)) {
                let data = this.showData[key];
                if (data.id == id) {
                    return data;
                }
            }
        }
        return null;
    }

    public getLuckExchangeShowData(id: string = ""): LuckExchangeTempMsg {
        let item:LuckExchangeTempMsg;
        for(let i:number = 0;i<LuckyExchangeManager.Instance.tempList.length;i++){
            item = LuckyExchangeManager.Instance.tempList[i];
            if(item && item.id == id)
            {
                return item;
            }
        }
        return null;
    }

    /**
     * 获得活动兑奖的列表 
     */
    private get activityList(): Array<ActiveInfo> {
        return ActivityManager.Instance.activityList;
    }

    private findFunnyBagDataById(funnyData: FunnyData, packId: string): FunnyBagData {
        for (var i: number = 0; i < funnyData.bagList.length; i++) {
            if (funnyData.bagList[i].id == packId) {
                return funnyData.bagList[i];
            }
        }
        return null;
    }
    private findFunnyDataById(value: string): FunnyData {
        for (var i: number = 0; i < this._data.length; i++) {
            if (this._data[i].id == value) {
                return this._data[i];
            }
        }
        return null;
    }
    private sortMasterType(info1: any, info2: any): number {
        var temp1: any;
        var temp2: any;
        var sortFlag: number = 0;
        if (info1.temType == 1) {
            temp1 = TempleteManager.Instance.getGoodsTemplatesByTempleteId(info1.temId);
        } else {
            temp1 = TempleteManager.Instance.getStarTemplateById(info1.temId);
        }
        if (info2.temType == 1) {
            temp2 = TempleteManager.Instance.getGoodsTemplatesByTempleteId(info2.temId);
        } else {
            temp2 = TempleteManager.Instance.getStarTemplateById(info2.temId);
        }
        if (temp1 && !temp2) {
            sortFlag = -1;
        } else if (!temp1 && temp2) {
            sortFlag = 1;
        } else if (!temp1 && !temp2) {
            sortFlag = 0;
        } else {
            if (temp1.Profile > temp2.Profile) {
                sortFlag = -1;
            } else if (temp1.Profile < temp2.Profile) {
                sortFlag = 1;
            } else {
                if (temp1.MasterType > temp2.MasterType) {
                    sortFlag = 1;
                } else if (temp1.MasterType < temp2.MasterType) {
                    sortFlag = -1;
                }
            }
        }
        temp1 = null;
        temp2 = null;
        return sortFlag;
    }

    private __regressionDelayHandler(result: string) {
        var data: TipMessageData = new TipMessageData();
        data.type = TipMessageData.REGRESSION_TIP_VIEW;
        data.title = LangManager.Instance.GetTranslation("public.prompt");
        TaskTraceTipManager.Instance.cleanByType(TipMessageData.REGRESSION_TIP_VIEW);
        TaskTraceTipManager.Instance.showView(data);

        // if (ModuleLoader.hasDefinition("asset.toptoolbar.regressionBack")) {
        //     this.showRegressView(null, null);
        // } else {
        //     var url: string = ComponentSetting.getUISourcePath(UIModuleTypes.TOPTOOLBAR);
        //     var type: number = LoaderInfo.MODULE_LOADER;
        //     LoaderManagerII.Instance.load(url, type, LoaderPriority.Priority_8, this.showRegressView);
        // }
    }

    private showRegressView(info, content: Object) {
        // var regressview: RegressionView = new RegressionView();
        // regressview.show();
    }
    /**
     * 获得在线时长奖励总数据 
     * @return 
     * 
     */
    public get onLineData(): FunnyData {
        for (var i: number = 0; i < this._data.length; i++) {
            if (this._data[i].type == FunnyType.TYPE_ONLINE) {
                return this._data[i];
            }
        }
        return null;
    }
    /**
     * 获得在线时长奖励当前礼包数据
     * (打开在线奖励礼包所获得的数据)
     * @return 
     * 
     */
    public get onLineCurrentData(): FunnyBagData {
        if (this.onLineData == null) return null;
        for (var i: number = 0; i < this.onLineData.bagList.length; i++) {
            if (this.onLineData.bagList[i].status != 2) {
                return this.onLineData.bagList[i];
            }
        }
        return null;
    }
    /**
     * 获得时段性充值奖励总数据 
     * @return 
     * 
     */
    public get rechargeData(): FunnyData {
        for (var i: number = 0; i < this._data.length; i++) {
            if (this._data[i].type == FunnyType.RECHARGE_TIME 
                && this._data[i].startTime <= PlayerManager.Instance.currentPlayerModel.nowDate 
                && PlayerManager.Instance.currentPlayerModel.nowDate <=this._data[i].endTime) {
                return this._data[i];
            }
        }
        return null;
    }
    /**
     * 获得时段性充值奖励礼包数据 
     * @return 
     * 
     */
    public get rechargeBagData(): FunnyBagData {
        if (this.rechargeData == null) return null;
        if (this.rechargeData.bagList.length > 0) {
            return this.rechargeData.bagList[0];
        }
        return null;
    }
    /**
     * 检查是否有新的活动兑奖, 使精彩活动按钮闪烁
     * @param arr
     * 
     */
    public setActivityBtnState() {
        if (this._activityArr == null || this._activityArr.length < 0) {
            this._activityArr = this.activityList;
        }

        if (this._activityArr.length > 0) {
            for (var i: number = 0; i < this._activityArr.length; i++) {
                if (this._activityArr.indexOf(this.activityList[i]) < 0) {//出现新的活动兑奖
                    if (this.canShine)
                        this.dispatchEvent(FunnyEvent.ITEM_CANGET);
                }
            }
        }
        this._activityArr = this.activityList;
    }
    /**
     * 获得精彩活动数组
     * */
    public get data(): Array<FunnyData> {
        return this._data;
    }
    /**
     * 获得当前选择的精彩活动数据
     * */
    public get selectedFunnyData(): FunnyData {
        for (var i: number = 0; i < this._data.length; i++) {
            if (this._data[i].id == this.selectedId)
                return this._data[i];
        }
        return null;
    }
    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
    /**
     * 按照排序字段排序
     * */
    private byOrder(a, b): number {
        if (a.order < b.order) {
            return -1;
        } else if (a.order == b.order) {
            return 0;
        } else if (a.order > b.order) {
            return 1;
        }
        return 0;
    }
    /**
     * 用户查询/领取活动（1.查询、2.领取、3:激活、参与）
     * @packageId 礼包类型
     * */
    public sendGetBag(type: number, packageId: string = "", count: number = 1) {
        var msg: SumActiveGetPackageMsg = new SumActiveGetPackageMsg();
        msg.activeId = this.selectedId;
        msg.type = type;
        msg.count = count;
        msg.packageId = packageId;
        SocketManager.Instance.send(C2SProtocol.C_SUMACTIVE_GATE, msg);
    }

    private get oldDic(): Dictionary {
        return SharedManager.Instance.funnyOldDic;
    }
}