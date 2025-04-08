// @ts-nocheck
import { ConsortiaModel } from "../model/ConsortiaModel";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerManager } from "../../../manager/PlayerManager";
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { ConsortiaSocketOutManager } from "../../../manager/ConsortiaSocketOutManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { FilterWordManager } from "../../../manager/FilterWordManager";
import { PackageIn } from "../../../../core/net/PackageIn";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { ConsortiaUpgradeType } from "../../../constant/ConsortiaUpgradeType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignManager } from "../../../manager/CampaignManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { ItemHelper } from "../../../utils/ItemHelper";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import { ConsortiaInfo } from "../data/ConsortiaInfo";
import { ConsortiaInviteInfo } from "../data/ConsortiaInviteInfo";
import { ConsortiaVotingUserInfo } from "../data/ConsortiaVotingUserInfo";
import { ConsortiaUserInfo } from "../data/ConsortiaUserInfo";
import { t_s_consortialevelData } from "../../../config/t_s_consortialevel";
import { SocketManager } from "../../../../core/net/SocketManager";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { ConsortiaEventInfo } from "../data/ConsortiaEventInfo";
import { ConsortiaTempleteInfo } from "../data/ConsortiaTempleteInfo";
import { ConsortiaSkillHelper } from "../../../utils/ConsortiaSkillHelper";
import EmailSocketOutManager from "../../../manager/EmailSocketOutManager";
import Logger from "../../../../core/logger/Logger";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import ConsortiaSearchRspMsg = com.road.yishi.proto.consortia.ConsortiaSearchRspMsg;
import ConsortiaInfoMsg = com.road.yishi.proto.consortia.ConsortiaInfoMsg;
import ConsortiaMsg = com.road.yishi.proto.consortia.ConsortiaMsg;
import ConsortiaContributeRspMsg = com.road.yishi.proto.consortia.ConsortiaContributeRspMsg;
import ConsortiaContributeMsg = com.road.yishi.proto.consortia.ConsortiaContributeMsg;
import SimplePlayerSearchReqMsg = com.road.yishi.proto.simple.SimplePlayerSearchReqMsg;
import ConsortiaEventListRspMsg = com.road.yishi.proto.consortia.ConsortiaEventListRspMsg;
import ConsortiaEventInfoMsg = com.road.yishi.proto.consortia.ConsortiaEventInfoMsg;
import ConsortiaVotingUsersMsg = com.road.yishi.proto.consortia.ConsortiaVotingUsersMsg;
import ConsortiaVotingUserMsg = com.road.yishi.proto.consortia.ConsortiaVotingUserMsg;
import ConsortiaVotingRspMsg = com.road.yishi.proto.consortia.ConsortiaVotingRspMsg;
/**
 * 公会controller
 * @author yuanzhan.yu
 */
export class ConsortiaControler extends FrameCtrlBase {
    private _model: ConsortiaModel;
    private _contributeFrame: any;
    private _buildingFrame: any;
    private _skillFrame: any;
    private _altarFrame: any;

    constructor() {
        super();

        this._model = ConsortiaManager.Instance.model;
        this.shineConsortiaBtn();
    }

    private shineConsortiaBtn() {
        if (!ConsortiaManager.Instance.isFirstRecord) {
            ConsortiaManager.Instance.isFirstRecord = true;
            this.getConsortiaInviteInfos();               //上线有邀请记录就要求公会按钮闪动
        }
    }

    protected addEventListener() {
        this._model.addEventListener(ConsortiaEvent.IS_CONSORTIA_EXIST, this.__existHandler, this);

        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_USERINVITE, this, this.__joinConsortiaHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_INVITEDEL, this, this.__deleteApplyConsortiaHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_USERPASS, this, this.__operateConsortiaApplyResult);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_OFF, this, this.__consortiaContributeResult);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_PASS, this, this.__consortiaAcceptApplyHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_FRESHALTAR, this, this.__getAltarBlessInfo);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_OFFER_LIST, this, this.__updataOfferList);
        ServerDataManager.listen(S2CProtocol.U_C_EVENT_LIST, this, this.__refreshEventList);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_SEARCH, this, this.__refreshConsortiaList);

        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_ALTERINFO, this, this.__refreshAltarInfo);
        
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_SITE, this, this.__setGoods);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_ADDFRESH, this, this.__addFreshItem);
        //选举
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_VOTING_LIST, this, this.__setVotingUsers);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_VOTING, this, this.__updateVotingState);
    }

    protected delEventListener() {
        this._model.removeEventListener(ConsortiaEvent.IS_CONSORTIA_EXIST, this.__existHandler, this);

        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_USERINVITE, this, this.__joinConsortiaHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_INVITEDEL, this, this.__deleteApplyConsortiaHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_USERPASS, this, this.__operateConsortiaApplyResult);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_OFF, this, this.__consortiaContributeResult);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_PASS, this, this.__consortiaAcceptApplyHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_FRESHALTAR, this, this.__getAltarBlessInfo);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_OFFER_LIST, this, this.__updataOfferList);
        ServerDataManager.cancel(S2CProtocol.U_C_EVENT_LIST, this, this.__refreshEventList);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_SEARCH, this, this.__refreshConsortiaList);

        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_ALTERINFO, this, this.__refreshAltarInfo);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_SITE, this, this.__setGoods);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_ADDFRESH, this, this.__addFreshItem);
        //选举
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_VOTING_LIST, this, this.__setVotingUsers);
        ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_VOTING, this, this.__updateVotingState);
    }

    private outOfDate(): boolean {
        let nowDate: Date = new Date();
        nowDate.setTime(PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000);
        if (this._model.consortiaInfo.warnDate == null) {
            return false;
        }
        let intervalTime: number = nowDate.getTime() - this._model.consortiaInfo.warnDate.getTime();

        return intervalTime / (1000 * 3600 * 24) >= 8;
    }

    /**************************************
     *     重载逻辑
     * ***********************************/
    protected show() {
        super.show();

    }

    protected hide() {
        super.hide();
    }

    dispose() {
        super.dispose();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public get model(): ConsortiaModel {
        return this._model;
    }


    /************************************
     *     二级窗口
     * **********************************/
    /**
     * 显示公会捐献Frame
     * @param evt
     *
     */
    public showContributeFrame() {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaContribute)
    }

    /**
     *  关闭公会捐献Frame
     * @param evt
     *
     */
    public closeContributeFrame(isShow: boolean = true) {
        if (this._contributeFrame && this._contributeFrame.parent) {
            this._contributeFrame.dispose();
        }
        this._contributeFrame = null;
        if (isShow) {
            this.show();
        }
    }

    /**
     * 打开公会建筑Frame
     * @param evt
     *
     */
    public showBuildingFrame() {
        // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.CONSORTIA,1,2);
    }

    /**
     * 打开公会祈福Frame
     *
     */
    public showAltarFrame() {
        // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.CONSORTIA,4);
    }

    public closeAltarFrame() {
        this._altarFrame = null;
        this.showBuildingFrame();
    }

    public closeBuildingFrame(isShow: boolean = true) {
        if (this._buildingFrame && this._buildingFrame.parent) {
            this._buildingFrame.dispose();
        }
        this._buildingFrame = null;
        if (isShow) {
            this.show();
        }
    }

    private _openFromConsortiaFrame: number = -1000;

    public showSkillFrame(openFromConsortiaFrame: number) {
        // this._openFromConsortiaFrame = openFromConsortiaFrame;
        // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.CONSORTIA,5);
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaSkillTower);
    }

    public closeSkillFrame(value: number = 0, $isShow: boolean = true) {
        this.skillFrameClosed();
        if (!$isShow) {
            return;
        }
        switch (value) {
            case 1:
                this.show();
                break;
            case 2:
                this.showBuildingFrame();
                break;
        }
    }

    private skillFrameClosed() {
        if (this._skillFrame && this._skillFrame.parent) {
            this._skillFrame.dispose();
        }
        this._skillFrame = null;
    }

    /**
     * 申请邀请记录
     */
    public getConsortiaInviteInfos() {
        ConsortiaSocketOutManager.getConsortiaInviteInfos();
    }

    public randomCount: number = 1;

    private __refreshConsortiaList(pkg: PackageIn) {
        let msg: ConsortiaSearchRspMsg = pkg.readBody(ConsortiaSearchRspMsg) as ConsortiaSearchRspMsg;
        let arr: ConsortiaInfo[] = [];
        for (let i: number = 0; i < msg.consortiaInfo.length; i++) {
            arr.push(this.readConsortiaInfo(msg.consortiaInfo[i] as ConsortiaInfoMsg));
        }
        this._model.consortiaList = arr;
        this._model.setTotalRows = msg.totalRows;
        if (msg.isReset) {
            this.randomCount = 1;
        }
    }

    private readConsortiaInfo(info: ConsortiaInfoMsg): ConsortiaInfo {
        let consortiaInfo: ConsortiaInfo = new ConsortiaInfo();
        consortiaInfo.consortiaId = info.consortiaId;
        consortiaInfo.consortiaName = info.consortiaName;
        consortiaInfo.chairmanName = info.chairmanName;
        consortiaInfo.levels = info.levels;
        consortiaInfo.offer = info.offer;
        consortiaInfo.consortiaMaterials = info.materials;
        consortiaInfo.currentCount = info.currentCount;
        consortiaInfo.honor = info.honor;
        consortiaInfo.description = info.description;
        consortiaInfo.isRobot = info.isRobot;
        consortiaInfo.currentCount = info.currentCount;
        return consortiaInfo;
    }

    private __joinConsortiaHandler(pkg: PackageIn) {
        let msg: ConsortiaMsg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        let id: number = msg.applyId;
        if (id) {
            this.getConsortiaInviteInfos();
            NotificationManager.Instance.dispatchEvent(ConsortiaEvent.APPLY_CONSORTIA_SUCCESS);
        }
    }

    /**
     * 删除申请记录
     * @param evt
     *
     */
    private __deleteApplyConsortiaHandler() {
        this.getConsortiaInviteInfos();

    }

    /**
     * 操作公会申请
     * @param $id
     * @param $flag true为通过, false为拒绝
     *
     */
    public operateConsortiaApply($id: number, $flag: boolean) {
        ConsortiaSocketOutManager.operateConsortiaApply($id, $flag);
    }

    private __operateConsortiaApplyResult(pkg: PackageIn) {
        let msg: ConsortiaMsg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        let flag: boolean = msg.result;
        let id: number = msg.applyId;
        for (const key in this._model.inviteList) {
            if (this._model.inviteList.hasOwnProperty(key)) {
                let item: ConsortiaInviteInfo = this._model.inviteList[key];
                if (item.id == id) {
                    this._model.inviteList.splice(this._model.inviteList.indexOf(item), 1);
                    this._model.dispatchEvent(ConsortiaEvent.UPDA_RECORD_LIST, { bInvite: true });
                    break;
                }
            }
        }
    }

    private __existHandler(evt: ConsortiaEvent) {
        FrameCtrlManager.Instance.open(EmWindow.Consortia);
        if (FrameCtrlManager.Instance.isOpen(EmWindow.ConsortiaApply)) {
            FrameCtrlManager.Instance.exit(EmWindow.ConsortiaApply);
        }
    }

    /**
     * 获取公会信息
     *
     */
    public getConsortiaInfos() {
        ConsortiaSocketOutManager.getConsortiaInfos();
    }

    /**
     * 获取用户权限
     * @param index
     * @return
     *
     */
    public getRightsByIndex(index: number): boolean {
        return this._model.usrRights.getBit(index - 1);
    }

    public getSimplePlayerInfoById(id: number): ThaneInfo {
        for (const key in this._model.consortiaMemberList) {
            if (this._model.consortiaMemberList.hasOwnProperty(key)) {
                let item: ThaneInfo = this._model.consortiaMemberList[key];
                if (item.userId == id) {
                    return item;
                }
            }
        }
        return null;
    }


    /**
     * 创建公会
     * @param consortiaName
     *
     */
    public creatConsortia(consortiaName: string) {
        let num: number = PlayerManager.Instance.currentPlayerModel.playerInfo.lastOutConsortia;
        let isAuto: boolean = PlayerManager.Instance.currentPlayerModel.playerInfo.isAuto;
        let isFirst = PlayerManager.Instance.currentPlayerModel.playerInfo.addGuildCount <= 1;//加入公会次数
        if (!isFirst && isAuto && (num + 24 * 3600) > PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond) {
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            let point: string = TempleteManager.Instance.getConfigInfoByConfigName("Consortia_ClearCD_Point").ConfigValue;
            let content: string = LangManager.Instance.GetTranslation("Consortia.ConsortiaSocketOutManager.content2", point);
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, alertHandler);

            function alertHandler(b: boolean, flag: boolean) {
                if (b) {
                    if (PlayerManager.Instance.currentPlayerModel.playerInfo.point < parseInt(TempleteManager.Instance.getConfigInfoByConfigName("Consortia_ClearCD_Point").ConfigValue)) {
                        RechargeAlertMannager.Instance.show();
                        return;
                    }
                    ConsortiaSocketOutManager.creatConsortia(consortiaName, true);
                }
            }
        } else {
            ConsortiaSocketOutManager.creatConsortia(consortiaName, false);
        }
    }

    public updateConsortiaName(consortiaName: string) {
        ConsortiaSocketOutManager.creatConsortia(consortiaName, false);
    }

    /**
     * 修改公会简介
     * @param $str
     *
     */
    public modifyConsortiaDiscription($str: string) {
        if (this.checkWord($str)) {
            ConsortiaSocketOutManager.modifyConsortiaDiscription($str);
        }
    }

    /**
     * 修改公会公告
     * @param $str
     *
     */
    public modifyConsortiaPlacard($str: string) {
        if (this.checkWord($str)) {
            ConsortiaSocketOutManager.modifyConsortiaPlacard($str);
        }
    }

    private checkWord($str: string): boolean {
        if (FilterWordManager.isGotForbiddenWords($str, "name") ||
            FilterWordManager.isGotForbiddenWords($str, "chat")) {
            let str: string = LangManager.Instance.GetTranslation("consortia.ConsortiaControler.command05");
            MessageTipManager.Instance.show(str);
            return false;
        }
        return true;
    }


    /**
     *  公会捐献返回结果
     * @param evt
     *
     */
    private __consortiaContributeResult(pkg: PackageIn) {
        let msg: ConsortiaMsg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        let flag: boolean = msg.result;
        if (flag && this._model) {
            this._model.dispatchEvent(ConsortiaEvent.ON_CONSORTIA_CONTRIBUTE_SUCCEED);
        }
    }

    /**
     * 公会捐献记录
     * @param isHistory
     *
     */
    public getConsortiaOffer(isHistory: boolean) {
        this._model.isHistory = isHistory;
        this._model.contributeListCurrentPage = 1;
        this.sendGetConsortiaOffer();
    }

    public sendGetConsortiaOffer() {
        ConsortiaSocketOutManager.getConsortiaOffer(this._model.contributeListCurrentPage, this._model.isHistory);
    }

    private __updataOfferList(pkg: PackageIn) {
        let msg: ConsortiaContributeRspMsg = pkg.readBody(ConsortiaContributeRspMsg) as ConsortiaContributeRspMsg;
        let consortiaContributionList: ConsortiaUserInfo[] = [];
        this._model.contributeListTotalPage = Math.ceil(msg.totalRows / ConsortiaModel.CONTRIBUTE_RECORD_PAGE_NUM);
        for (let i: number = 0; i < msg.contributeInfo.length; i++) {
            let uInfo: ConsortiaUserInfo = new ConsortiaUserInfo();
            this.copyProperty(uInfo, msg.contributeInfo[i] as ConsortiaContributeMsg);
            consortiaContributionList.push(uInfo);
        }
        this._model.totalOffer = msg.selfInfo.totalOffer;
        this._model.todayOffer = msg.selfInfo.todayOffer;
        this._model.nickName = msg.selfInfo.nickName;
        this._model.selfOrder = msg.selfOrder;

        this._model.consortiaContributionList = consortiaContributionList;
    }

    private copyProperty(uInfo1: ConsortiaUserInfo, uInfo2: ConsortiaContributeMsg) {
        uInfo1.nickName = uInfo2.nickName;
        uInfo1.todayOffer = uInfo2.todayOffer;
        uInfo1.totalOffer = uInfo2.totalOffer;
    }

    public contributeSearchPageHandler(isLastPage: boolean) {
        if (isLastPage && this._model.contributeListCurrentPage > 1) {
            this._model.contributeListCurrentPage -= 1;
        }
        else if (!isLastPage && this._model.contributeListCurrentPage < this._model.contributeListTotalPage) {
            this._model.contributeListCurrentPage += 1;
        }
        else {
            return;
        }
        this.sendGetConsortiaOffer();
    }

    /**
     * 公会升级
     * @param $type 升级类型
     * @param $level 要升级到的等级
     *
     */
    public consortiaUpgrade($type: Object) {
        if ($type instanceof t_s_consortialevelData) {
            ConsortiaSocketOutManager.consortiaUpgrade(($type as t_s_consortialevelData).Types);
        }
        else {
            ConsortiaSocketOutManager.consortiaUpgrade(Number($type));
        }
    }

    /**
     *搜索玩家
     * @param otherNickName
     *
     */
    public SearchPlayer(otherNickName: string) {
        let msg: SimplePlayerSearchReqMsg = new SimplePlayerSearchReqMsg();
        msg.otherNickname = otherNickName;
        SocketManager.Instance.send(C2SProtocol.C_PLAYER_SEARCH, msg);
    }

    /**
     * 转让公会给其它玩家
     * @param otherNickName
     *
     */
    public consortiaTransfer($type: number) {
        ConsortiaSocketOutManager.consortiaTransfer($type);
    }


    public sendQuickTime(useBind: boolean) {
        ConsortiaSocketOutManager.sendQuickTime(useBind);
    }

    /**
     * 获取公会事件
     * @return
     *
     */
    public getConsortiaEventInfos() {
        ConsortiaSocketOutManager.getConsortiaEventInfos();
    }

    private __refreshEventList(pkg: PackageIn) {
        let msg: ConsortiaEventListRspMsg = pkg.readBody(ConsortiaEventListRspMsg) as ConsortiaEventListRspMsg;
        let arr: ConsortiaEventInfo[] = [];
        for (let i: number = 0; i < msg.eventInfo.length; i++) {
            arr.push(this.readEventInfo(msg.eventInfo[i] as ConsortiaEventInfoMsg));
        }
        this._model.consortiaEventList = ArrayUtils.sortOn(arr, "createDate", ArrayConstant.NUMERIC | ArrayConstant.DESCENDING);
    }

    private readEventInfo(info: ConsortiaEventInfoMsg): ConsortiaEventInfo {
        let eventInfo: ConsortiaEventInfo = new ConsortiaEventInfo();
        eventInfo.id = info.id;
        eventInfo.consortiaId = info.consortiaId;
        eventInfo.remark = info.remark;
        eventInfo.createDate = DateFormatter.parse(info.createDate, "YYYY-MM-DD hh:mm:ss");
        eventInfo.types = info.type;
        eventInfo.isExist = info.isExist;
        return eventInfo;
    }

    /**
     * 获取助申请公会的用户列表
     * @param index 页码
     * @return
     *
     */
    public getConsortiaApplyInfos(isPrePage: boolean = false) {
        // if(isPrePage && this._model.recruitCurrentPage > 1)
        // {
        //     this._model.recruitCurrentPage--;
        // }
        // else if(!isPrePage && this._model.recruitCurrentPage < this._model.recruitListTotalPage)
        // {
        //     this._model.recruitCurrentPage++;
        // }
        // else
        // {
        //     return;
        // }
        this.sendGetConsortiaApplyInfos();
    }

    public sendGetConsortiaApplyInfos() {
        ConsortiaSocketOutManager.getConsortiaApplyInfos(this._model.recruitCurrentPage);
    }

    /**
     *  公会通过用户申请
     * @param $id 申请编号
     * @param $flag false是拒绝, true是通过
     *
     */
    public consortiaAcceptOrRejectApply($sInfoArr: ThaneInfo[], $flag: boolean) {
        this._model.beginChanges();
        for (const key in $sInfoArr) {
            if ($sInfoArr.hasOwnProperty(key)) {
                let Item: ThaneInfo = $sInfoArr[key];
                if (Item.consortiaID && $flag) {
                    let str: string = LangManager.Instance.GetTranslation("consortia.ConsortiaControler.command08");
                    MessageTipManager.Instance.show(str);
                }
                else {
                    ConsortiaSocketOutManager.consortiaAcceptOrRejectApply(Item.parameter1, $flag);
                    // this._model.removeFromApplyConsortiaMapList(Item);
                }
                //已加入其它公会，也需要移除
                this._model.removeFromApplyConsortiaMapList(Item);
            }
        }
        this._model.commit();
    }

    private __consortiaAcceptApplyHandler() {
        this._model.recruitNum--;
        if (this._model.recruitNum <= 0) {
            this._model.recruitNum = 0;
            this.sendGetConsortiaApplyInfos();
        }
    }

    /**
     * 获取公会祭坛信息
     * @return
     *
     */
    public getConsortiaPrayInfo() {
        this._model.isBlessing = false;
        ConsortiaSocketOutManager.getConsortiaPrayInfo();
    }

    /**
     * 
     * @param type 刷新祈福/高级祈福
     */
    public refreshPrayCount(type:number){
        ConsortiaSocketOutManager.refreshPrayCount(type);
    }

    /**
     * 更新祭坛祈福次数
     * @param info
     *
     */
    private __refreshAltarInfo(pkg: PackageIn) {
        let msg: ConsortiaMsg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        this._model.alTarBlessLeftTime = msg.blessLeftTime;
    }

    /**
     * 公会祭坛祈福
     *
     */
    public consortiaAltarBless(type:number,count:number) {
        this._model.isBlessing = true;
        ConsortiaSocketOutManager.consortiaAltarBless(type,count);
    }

    /**
     * 获得祭坛祈福信息
     * @param evt
     *
     */
    private __getAltarBlessInfo(pkg: PackageIn) {
        let msg: ConsortiaMsg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        this._model.alTarBlessLeftTime = msg.blessLeftTime;
        if (msg.blessSite == -1) {
            this._model.dispatchEvent(ConsortiaEvent.UPDA_ALTAR_BLESS);
            return;
        }
        this._model.blessInfo.site = msg.blessSite;
        this._model.blessInfo.templateId = msg.blessTempId;
        this._model.blessInfo.count = msg.blessCount;
        let gInfo: GoodsInfo = new GoodsInfo();
        gInfo.templateId = this._model.blessInfo.templateId;
        gInfo.count = this._model.blessInfo.count;
        this._model.altarGoods = gInfo;
        Logger.xjy("[ConsortiaAltarItem] site==" + msg.blessSite + "templateId=" + msg.blessTempId);
        this._model.dispatchEvent(ConsortiaEvent.UPDA_ALTAR_BLESS_INFO);
    }

    /**
     * 取祭坛物品
     *
     */
    public getConsortiaAddFreshItem() {
        // ConsortiaSocketOutManager.getConsortiaAddFreshItem();
    }

    private __addFreshItem(pkg: PackageIn) {
        let msg: ConsortiaMsg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        if (msg.result) {
            this._model.altarGoods = this._model.lastaltarGoods = null;
        }
        NotificationManager.Instance.dispatchEvent(ConsortiaEvent.GET_ALTAR_GOODS, msg.result);
    }

    /**
     * 获取现有技能
     * @return
     *
     */
    public getShowSkills() {
        for (let i: number = 1; i <= this.model.consortiaInfo.schoolLevel; i++) {
            let temp: t_s_consortialevelData = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(ConsortiaUpgradeType.LING_SHI, i);
            if (temp.NextTemplateId) {
                let arr: number[] = temp.NextTemplateId;
                for (let j: number = 0; j < arr.length; j++) {
                    let nextTemp: t_s_consortialevelData = TempleteManager.Instance.getConsortiaTempleteById(arr[j]);
                    if (nextTemp) {
                        this.sortBaseSkill(nextTemp);
                    }
                }
            }
        }
        if (this.model.consortiaInfo.schoolLevel < ConsortiaUpgradeType.MAX_LEVEL) {
            this.getNextLevelSkill(this.model.consortiaInfo.schoolLevel + 1);
        }
        this.model.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_SKILL_LIST);
    }

    public getShowHighSkills() {
        for (let i: number = ConsortiaModel.HIGH_SKILL_TYPE_MIN; i <= ConsortiaModel.HIGH_SKILL_TYPE_MAX; i++) {
            let temp: t_s_consortialevelData = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(i, 1);
            if (temp) {
                this.sortHighSkill(temp);
            }
        }
        this.model.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_SKILL_LIST);
    }

    private sortHighSkill(temp: t_s_consortialevelData) {
        let tInof: ConsortiaTempleteInfo;
        if (!this._model.highSkillList.hasOwnProperty("type_" + temp.Types)) {
            tInof = new ConsortiaTempleteInfo();
            tInof.type = temp.Types;
            tInof.level = PlayerManager.Instance.currentPlayerModel.getConsortiaHighSkillLevel(tInof.type);
            this._model.highSkillList.add("type_" + tInof.type, tInof);
        }
        else {
            tInof = this._model.highSkillList["type_" + temp.Types];
            tInof.level = PlayerManager.Instance.currentPlayerModel.getConsortiaHighSkillLevel(temp.Types);
        }
    }

    private getNextLevelSkill(level: number) {
        let temp: t_s_consortialevelData = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(ConsortiaUpgradeType.LING_SHI, level);
        if (temp.NextTemplateId) {
            let arr: number[] = temp.NextTemplateId;
            for (let j: number = 0; j < arr.length; j++) {
                let nextTemp: t_s_consortialevelData = TempleteManager.Instance.getConsortiaTempleteById(arr[j]);
                if (nextTemp) {
                    this.sortBaseSkill(nextTemp, true);
                }
            }
        }
    }

    private sortBaseSkill(nextTemp: t_s_consortialevelData, isNext: boolean = false) {
        let tInof: ConsortiaTempleteInfo;
        if (!this._model.baseSkillList.hasOwnProperty("type_" + nextTemp.Types)) {
            tInof = new ConsortiaTempleteInfo();
            tInof.type = nextTemp.Types;
            tInof.isNext = isNext;
            tInof.level = this._model.consortiaInfo.getLevelByUpgradeType(tInof.type);
            this._model.baseSkillList.add("type_" + tInof.type, tInof);
        }
        else {
            tInof = this._model.baseSkillList["type_" + nextTemp.Types];
            tInof.isNext = isNext;
            tInof.level = this._model.consortiaInfo.getLevelByUpgradeType(nextTemp.Types);
        }
    }

    /**
     * 公会技能学习
     * @param $type
     *
     */
    public consortiaStudy(temp: t_s_consortialevelData) {
        if (this.ifCanUpdata(temp)) {
            ConsortiaSocketOutManager.consortiaStudy(temp.Types);
        }
    }

    private ifCanUpdata(temp: t_s_consortialevelData): boolean {
        let level: number;
        let nextTemp: t_s_consortialevelData 
        if (temp.Types >= ConsortiaModel.HIGH_SKILL_TYPE_MIN && temp.Types <= ConsortiaModel.HIGH_SKILL_TYPE_MAX) {//高级技能
            level = PlayerManager.Instance.currentPlayerModel.getConsortiaHighSkillLevel(temp.Types);
            // if (level >= ConsortiaUpgradeType.MAX_LEVEL) {
            //     let str: string = LangManager.Instance.GetTranslation("consortia.ConsortiaControler.command09");
            //     MessageTipManager.Instance.show(str);
            //     return false;
            // }
            nextTemp = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(temp.Types, level + 1);
            if (nextTemp.Property1 > this.playerInfo.consortiaJianse) {
                let str: string = LangManager.Instance.GetTranslation("ConsortiaPrayWnd.openOneBtnHandler.tips3");
                MessageTipManager.Instance.show(str);
                return false;
            }
            return true;
        }else{
            level = PlayerManager.Instance.currentPlayerModel.getConsortiaSkillLevel(temp.Types);
            if (level >= ConsortiaUpgradeType.MAX_LEVEL) {
                let str: string = LangManager.Instance.GetTranslation("consortia.ConsortiaControler.command09");
                MessageTipManager.Instance.show(str);
                return false;
            }
            nextTemp = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(temp.Types, level + 1);
            if (nextTemp.NeedOffer > this.playerInfo.consortiaOffer) {
                if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
                    if (WorldBossHelper.checkGvg(CampaignManager.Instance.mapModel.mapId)) {
                        ConsortiaSkillHelper.addWealth();
                        return false;
                    }
    
                }
                ConsortiaSkillHelper.addOffer();
                return false;
            }
            return true;
        }    
    }

    /**
     * 公会职位调整
     * @param dutyId
     * @param otherUserId
     *
     */
    public changeDuty(dutyId: number, otherUserId: number) {
        ConsortiaSocketOutManager.changeDuty(dutyId, otherUserId);
    }

    /**
     * 删除公会成员
     * @param otherUserId
     *
     */
    public fireMember(b: boolean, flag: boolean, otherUserId: number) {
        if (b) {
            ConsortiaSocketOutManager.fireMember(otherUserId);
        }
    }

    /**
     * 公会邀请用户
     * @param $id 被邀请用户ID
     *
     */
    public sendConsortiaInvitePlayer($id: number) {
        ConsortiaSocketOutManager.consortiaInvitePlayer($id);
        let str: string = LangManager.Instance.GetTranslation("consortia.ConsortiaControler.command10");
        MessageTipManager.Instance.show(str);
    }

    /**
     * 公会开放申请
     * @param isOpen
     *
     */
    public ifOpenApply(isOpen: boolean) {
        ConsortiaSocketOutManager.ifOpenApply(isOpen);
    }

    public getConsortiaSite() {
        ConsortiaSocketOutManager.getConsortiaSite();
    }

    private __setGoods(pkg: PackageIn) {
        let msg: ConsortiaInfoMsg = pkg.readBody(ConsortiaInfoMsg) as ConsortiaInfoMsg;
        NotificationManager.Instance.dispatchEvent(ConsortiaEvent.UPDE_ALTAR_SIZE, msg.site);
    }

    /**
     * 公会邮件
     * */
    public sendEmail(idList: number[], title: string, content: string, useBind: boolean = true) {
        EmailSocketOutManager.sendEmail(idList, title, content, 2, useBind);
    }

    /**
     * 请求候选人列表
     *
     */
    public getVotingUserInfos() {
        Logger.yyz("请求候选人列表");
        ConsortiaSocketOutManager.getVotingUserInfos();
    }

    /**
     * 得到候选人列表
     *
     */
    private __setVotingUsers(pkg: PackageIn) {
        Logger.yyz("收到到候选人列表");
        let userID: number = this.playerInfo.userId;
        let msg: ConsortiaVotingUsersMsg = pkg.readBody(ConsortiaVotingUsersMsg) as ConsortiaVotingUsersMsg;

        let userInfos: ConsortiaVotingUserInfo[] = [];
        for (const key in msg.info) {
            if (msg.info.hasOwnProperty(key)) {
                let userMsg: ConsortiaVotingUserMsg = msg.info[key] as ConsortiaVotingUserMsg;
                let userInfo: ConsortiaVotingUserInfo = new ConsortiaVotingUserInfo();
                userInfo.isVotingman = userMsg.isVotingman;
                userInfo.nickName = userMsg.nickName;
                userInfo.userId = userMsg.userId;
                userInfo.votingData = userMsg.votingData;
                userInfo.votingId = userMsg.votingId;
                userInfo.votingTime = userMsg.votingTime;
                userInfos.push(userInfo);

                if (userInfo.userId == userID) {
                    Logger.yyz("用户投票序号: ", userInfo.votingTime, userInfo.votingId, "  公会投票序号: ", this._model.consortiaInfo.votingId)
                    this._model.hasVoted = (userInfo.votingTime > 0);
                }
            }
        }
        this._model.votingUsers = userInfos;

        userInfos = null;
    }

    private __updateVotingState(pkg: PackageIn) {
        Logger.yyz("接受投票后的信息");
        let msg: ConsortiaVotingRspMsg = pkg.readBody(ConsortiaVotingRspMsg) as ConsortiaVotingRspMsg;

        this._model.hasVoted = msg.result;
        let tip: string;
        if (msg.result) {
            tip = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanElection.successTxt");
        }
        else {
            tip = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanElection.failTxt");
        }
        MessageTipManager.Instance.show(tip);
        this.getVotingUserInfos();
    }

    // private _devilFrame:Frame;
    public openDevilFrame() {
        // if(!_devilFrame)
        // {
        // 	_devilFrame = ComponentFactory.Instance.creatComponentByStylename("consortia.ConsortiaDevilFrame");
        // 	_devilFrame.addEventListener(Component.DISPOSE, __devilFrameDisposeHandler);
        // }
        // _devilFrame["show"]();
        let tip = LangManager.Instance.GetTranslation("mvc.controler.KingContractControler.ConfigTipTxt");

        MessageTipManager.Instance.show(tip);
    }
    private __devilFrameDisposeHandler(e: Event) {
        // _devilFrame.removeEventListener(Component.DISPOSE, __devilFrameDisposeHandler);
        // _devilFrame = null;
    }

}