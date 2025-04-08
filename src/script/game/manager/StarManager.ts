// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 11:52:24
 * @LastEditTime: 2023-01-09 16:43:33
 * @LastEditors: jeremy.xu
 * @Description: 主要负责占星模块的协议处理, 提供协议发送、数据操作的API
 */

import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { StarBagType, StarEvent } from "../constant/StarDefine";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import StarInfo from "../module/mail/StarInfo";
import StarModel from "../module/star/StarModel";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import Logger from '../../core/logger/Logger';

import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import StarComposeReqMsg = com.road.yishi.proto.star.StarComposeReqMsg;
import OpStarReqMsg = com.road.yishi.proto.star.OpStarReqMsg;
import ItemInfo = com.road.yishi.proto.star.ItemInfo;
import StarLockReqMsg = com.road.yishi.proto.star.StarLockReqMsg;
import StarMoveMsg = com.road.yishi.proto.star.StarMoveMsg;
import StarMoveReqMsg = com.road.yishi.proto.star.StarMoveReqMsg;
import StarMoveRspMsg = com.road.yishi.proto.star.StarMoveRspMsg;
import StarPickReqMsg = com.road.yishi.proto.star.StarPickReqMsg;
import StarRandMsg = com.road.yishi.proto.star.StarRandMsg;
import StarRandReqMsg = com.road.yishi.proto.star.StarRandReqMsg;
import StarRandRspMsg = com.road.yishi.proto.star.StarRandRspMsg;
import StarShopMsg = com.road.yishi.proto.star.StarShopMsg;
import StarVipEventMsg = com.road.yishi.proto.star.StarVipEventMsg;
import { StarHelper } from "../utils/StarHelper";
import { MessageTipManager } from "./MessageTipManager";
import { DataCommonManager } from "./DataCommonManager";
import { TempleteManager } from "./TempleteManager";

export class StarManager extends GameEventDispatcher {
    private static _instance: StarManager;
    public static get Instance(): StarManager {
        if (!StarManager._instance) StarManager._instance = new StarManager();
        return StarManager._instance;
    }

    private _tempStarList: SimpleDictionary = new SimpleDictionary();
    private _startList: SimpleDictionary = new SimpleDictionary();
    private _randomPosList: any[];
    private _starModel: StarModel = new StarModel();

    public aKeyComposeBagType: number = StarBagType.TEMP;

    public setup() {
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_START_MOVE_UPDATE, this, this.__starMoveUpdateHandler);
        ServerDataManager.listen(S2CProtocol.U_C_STAR_PICK, this, this.__starPickHandler);
        ServerDataManager.listen(S2CProtocol.U_C_STAR_RAND, this, this.__starRandHandler);
        ServerDataManager.listen(S2CProtocol.U_C_STAR_COMPOSE, this, this.__starOneKeyComposeHandler);
    }

    /**
     * 星运移动返回, 服务器返回StarMoveMsg列表, 该pb标示某类型背包的某位置是否有星运
     * , 有我们则添加或更新该位置星运info, 无则删除
     */
    private __starMoveUpdateHandler(pkg: PackageIn) {
        let msg = pkg.readBody(StarMoveRspMsg) as StarMoveRspMsg;
        let len: number = msg.move.length;
        let changeBagType: number;
        let changePos: number;
        let info: StarInfo;
        let itemMsg: StarMoveMsg;
        let quickSellGold = 0;
        for (let i: number = 0; i < len; i++) {
            itemMsg = msg.move[i] as StarMoveMsg;
            changeBagType = itemMsg.changeType;
            changePos = itemMsg.changePos;
            let flag: boolean = Boolean(itemMsg.star_Info);
            info = this._startList[changeBagType + "_" + changePos] as StarInfo;
            if (flag)// 该位置有
            {
                if (!info) {
                    info = new StarInfo();
                    this._startList.add(changeBagType + "_" + changePos, info);
                }
                info.beginChange();
                info.bagType = itemMsg.star_Info.bagType;
                info.pos = itemMsg.star_Info.pos;
                info.id = itemMsg.star_Info.id;
                info.tempId = itemMsg.star_Info.templateId;
                info.userId = itemMsg.star_Info.userId;
                info.grade = itemMsg.star_Info.grade;
                info.gp = itemMsg.star_Info.gp;
                info.composeLock = itemMsg.star_Info.isLock;
                info.commit();
                NotificationManager.Instance.dispatchEvent(StarEvent.UPDATE_STAR, info);
                if (info.bagType == StarBagType.THANE) NotificationManager.Instance.dispatchEvent(StarEvent.UPDATE_STAR_POWER, info);
            }
            else//该位置没有
            {
                info.pos = changePos;
                info.bagType = changeBagType;
                if (this.starModel.delWay == StarModel.QUICK_SELL) {
                    quickSellGold += info.template.SellGold
                }
                this._startList.del(changeBagType + "_" + changePos);
                NotificationManager.Instance.dispatchEvent(StarEvent.DELETE_STAR, info);
                if (info.bagType == StarBagType.THANE) NotificationManager.Instance.dispatchEvent(StarEvent.UPDATE_STAR_POWER, info);
            }
        }

        if (this.starModel.delWay == StarModel.QUICK_SELL && quickSellGold > 0) {
            this.starModel.delWay = 0;
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("star.view.DisplayStarView.starSellTip", quickSellGold))
        }
    }

    /**
     * 星运拾取或卖出
     */
    private __starPickHandler(pkg: PackageIn) {
        let msg = pkg.readBody(StarRandRspMsg) as StarRandRspMsg;
        let len: number = msg.starRand.length;
        let itemMsg: StarRandMsg;
        let info: StarInfo;
        for (let i: number = 0; i < len; i++) {
            itemMsg = msg.starRand[i] as StarRandMsg;
            let dropSite: number = itemMsg.dropSite;
            info = this._tempStarList[dropSite] as StarInfo;
            if (info) {
                this._tempStarList.del(dropSite);
            }
        }
    }

    /**
     * 占星返回
     */
    private __starRandHandler(pkg: PackageIn) {
        let msg = pkg.readBody(StarRandRspMsg) as StarRandRspMsg;

        if (!this._randomPosList) {
            this._randomPosList = msg.site;
        }
        else {
            let len: number = msg.site.length;
            let posChange: boolean;
            for (let i: number = 0; i < len; i++) {
                if (this._randomPosList[i] != msg.site[i]) {
                    this._randomPosList[i] = msg.site[i];
                    this._starModel.openCrystal == i ? this._starModel.openCrystal = -1 : this._starModel.openCrystal = i;
                    posChange = true;
                }
            }
            if (posChange) NotificationManager.Instance.dispatchEvent(StarEvent.RANDOMPOS_CHANGE, null);
        }
        let len = msg.starRand.length;
        let itemMsg: StarRandMsg;
        let info: StarInfo;
        for (let i = 0; i < len; i++) {
            itemMsg = msg.starRand[i] as StarRandMsg;
            let dropSite: number = itemMsg.dropSite;
            info = this._tempStarList[dropSite] as StarInfo;
            let isNew: boolean = false;
            if (!info) {
                info = new StarInfo();
                isNew = true;
            }
            info.beginChange();
            info.bagType = itemMsg.starInfo.bagType;
            info.pos = itemMsg.starInfo.pos;
            info.id = itemMsg.starInfo.id;
            info.tempId = itemMsg.starInfo.templateId;
            info.userId = itemMsg.starInfo.userId;
            info.grade = itemMsg.starInfo.grade;
            info.gp = itemMsg.starInfo.gp;
            info.composeLock = itemMsg.starInfo.isLock;
            info.commit();
            if (isNew) {
                this._tempStarList.add(dropSite, info);
            }
        }
    }

    /**
     * 占星面板一键合成返回
     */
    private __starOneKeyComposeHandler(pkg: PackageIn) {
        let msg = pkg.readBody(StarRandRspMsg) as StarRandRspMsg;

        let tempList: any[] = this._tempStarList.getList().concat();
        let remain: boolean;
        for (let index = 0; index < tempList.length; index++) {
            const info = tempList[index] as StarInfo;
            remain = false;
            for (let index = 0; index < msg.starRand.length; index++) {
                const itemMsg = msg.starRand[index] as StarRandMsg;
                if (info.pos == itemMsg.dropSite) {
                    info.beginChange();
                    info.bagType = itemMsg.starInfo.bagType;
                    info.pos = itemMsg.starInfo.pos;
                    info.id = itemMsg.starInfo.id;
                    info.tempId = itemMsg.starInfo.templateId;
                    info.userId = itemMsg.starInfo.userId;
                    info.grade = itemMsg.starInfo.grade;
                    info.gp = itemMsg.starInfo.gp;
                    info.composeLock = itemMsg.starInfo.isLock;
                    info.commit();
                    remain = true;
                    break;
                }
            }
            if (remain)
                NotificationManager.Instance.dispatchEvent(StarEvent.COMPOSE_STAR, info);
            else
                this._tempStarList.del(info.pos);
        }
    }

    /**
     * 发送占星
     */
    public sendRandomStar(site: number) {
        Logger.xjy("[StarManager]sendRandomStar", site)
        let msg: StarRandReqMsg = new StarRandReqMsg();
        msg.site = site;
        SocketManager.Instance.send(C2SProtocol.C_STAR_RAND, msg);
    }

    /**
     * 发送星运拾取或卖出
     * @param dropSite  星运位置, -2为一键拾取, -1为一键卖出(此时way参数为一键卖出类型)
     * @param way  1为拾取, 2为卖出
     */
    public sendStarPick(dropSite: number, way: number = 0) {
        let msg: StarPickReqMsg = new StarPickReqMsg();
        msg.dropsite = dropSite;
        msg.way = way;
        SocketManager.Instance.send(C2SProtocol.C_STAR_PICK, msg);
    }

    /**
     *发送占星移动（吞噬） 
        * @param beginPos 起始位置
        * @param beginType 起始背包类型
        * @param endPos 结束位置
        * @param endType 结束背包类型
        * @param isCompose 是否吞噬
        * @param count 数量
        */
    public starMove(beginPos: number, beginType: number, endPos: number, endType: number, isCompose: boolean = false, count: number = 1) {
        let msg: StarMoveReqMsg = new StarMoveReqMsg();
        msg.beginPos = beginPos;
        msg.beginStarType = beginType;
        msg.endPos = endPos;
        msg.endStarType = endType;
        msg.count = count;
        msg.eat = isCompose;
        SocketManager.Instance.send(C2SProtocol.C_STAR_MOVE, msg);
    }

    /**
     * 发送星运背包格子购买
     */
    public sendBagCellBuy() {
        let cfgValue = 100;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("Star_BagPrice");
        if (cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        let payNum: number = (this.playerInfo.starBagCount / 4 + 1) * cfgValue;
        let content: string = LangManager.Instance.GetTranslation("yishi.manager.StarManager.content", payNum);
        let checkStr = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.useBind");
        let checkStr2 = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.promptTxt");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkStr, checkRickText2: checkStr2, checkDefault: true }, null, content, null, null, this.payCallBack.bind(this));
    }

    private payCallBack(result: boolean, flag: boolean) {
        if (result) {
            let msg: PayTypeMsg = new PayTypeMsg();
            msg.payType = 0;
            if (!flag) {
                msg.payType = 1;
            }
            SocketManager.Instance.send(C2SProtocol.C_STAR_BUY, msg);
        }
    }

    /**
     *发送一键合成（背包面板） 
        * @param pos  保留星运位置
        * @param bagType 星运背包类型
        */
    public sendOneKeyCompose(pos: number, bagType: number = StarBagType.PLAYER) {
        let msg: StarComposeReqMsg = new StarComposeReqMsg();
        msg.pos = pos;
        msg.bagType = bagType;
        SocketManager.Instance.send(C2SProtocol.C_STAR_COMPOSE, msg);
    }

    /**
     *发送星运合成锁定 
        * @param bagType  背包类型
        * @param pos  位置
        */
    public sendStarComposeLock(bagType: number, pos: number) {
        let msg: StarLockReqMsg = new StarLockReqMsg();
        msg.starType = bagType;
        msg.pos = pos;
        SocketManager.Instance.send(C2SProtocol.C_STAR_LOCK, msg);
    }

    /**
     *发送重置占星数据（每日5点重置） 
        */
    public sendResetStarData() {
        SocketManager.Instance.send(C2SProtocol.C_STAR_DATA_RESET, null);
    }

    /**
     * 批量星运操作
     * @param way      1 出售  2 合并
     * @param mergePos 其他星运向该索引合并
     * @param posArr   操作的数组, 在背包位置pos
     */
    public sendBatchOpt(way: number, mergePos: number, posArr: number[], beginType: number = 0, endType: number = 0) {
        Logger.xjy("[StarManager]sendBatchOpt", way, mergePos, posArr)
        if (way == 1) {
            this.starModel.delWay = StarModel.QUICK_SELL;
        } else if (way == 2) {
            this.starModel.delWay = StarModel.QUICK_COMPOSE;
        }

        let msg: OpStarReqMsg = new OpStarReqMsg();
        msg.way = way;
        msg.mergePos = mergePos;
        msg.beginType = beginType;
        msg.endType = endType;
        let arr: ItemInfo[] = [];
        posArr.forEach(pos => {
            let info = new ItemInfo();
            info.pos = pos;
            arr.push(info);
        });
        msg.itemInfo = arr;
        SocketManager.Instance.send(C2SProtocol.C_STAR_BATCH_OP, msg);
    }

    /**
     * 发送积分商城兑换星运
     */
    public sendExchangeStar(tempId: number, num: number) {
        let msg: StarShopMsg = new StarShopMsg();
        msg.goodId = tempId;
        msg.num = num;
        SocketManager.Instance.send(C2SProtocol.C_STARSHOP_BUY, msg);
    }

    /**
     * 
     * @param tempId 星运整理
     */
    public sendBtnFinishing() {
        SocketManager.Instance.send(C2SProtocol.C_STAR_ARRANGE, null);
    }

    /**
     * 自动占星
     * @param cost 
     * @param sell 
     * @param combine 
     */
    public sendBtnAutoStar(golden: number = 0, sellMaxQuality: number = 0, composeMaxQuality: number = 0) {
        let msg: StarVipEventMsg = new StarVipEventMsg();
        msg.golden = golden;
        msg.sellMaxQuality = sellMaxQuality;
        msg.composeMaxQuality = composeMaxQuality
        SocketManager.Instance.send(C2SProtocol.C_STAR_SPECIAL, msg);
    }

    /**
     * 获取指定背包类型星运列表
     */
    public getStarListByBagType(bagType: number): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        this._startList.getList().forEach((info: StarInfo) => {
            if (info.bagType == bagType) {
                dic.add(info.pos, info);
            }
        });
        return dic;
    }

    /**
     * 获取指定背包类型和位置的星运
     */
    public getStarInfoByBagTypeAndPos(bagType: number, pos: number): StarInfo {
        let arr: any[] = this._startList.getList();
        if (arr) {
            let len: number = arr.length;
            for (let index = 0; index < len; index++) {
                let info: StarInfo = arr[index];
                if (info && info.bagType == bagType && info.pos == pos) {
                    return info;
                }
            }
        }
        return null;
    }

    /**
     * 检查星运背包是否满了（不包括星运装备背包）
     */
    public checkStarPlayerBagIsFull(): boolean {
        let playerStarNum: number = this.getPlayerStarListNum();
        if (playerStarNum >= PlayerModel.ORIGINAL_OPEN_BAG_COUNT + this.playerInfo.starBagCount)
            return true;
        return false;
    }

    public getPlayerStarListNum(): number {
        let count: number = 0;
        this._startList.getList().forEach((info: StarInfo) => {
            if (info.bagType == StarBagType.PLAYER) {
                count++;
            }
        });
        return count;
    }
    /**
     * 获取星运背包中空闲格子的数目
     */
    public getStarPlayerBagIdleNum(): number {
        let num: number = 0;
        let hasNum: number = this.getPlayerStarListNum();
        num = PlayerModel.ORIGINAL_OPEN_BAG_COUNT + this.playerInfo.starBagCount - hasNum;
        return num;
    }

    /**
     * 获取装备背包中空闲格子的数目
     */
    public getStarEquipBagIdleNum(): number {
        let num: number = 0;
        let hasNum: number = this.getStarListByBagType(StarBagType.THANE).getList().length;
        num = this.starModel.openEquipGridNum() - hasNum;
        return num;
    }

    /**
     * 获取装备背包中一个可装备的位置
     * @param srcInfo 
     * @returns -1没位置  -2已存在相同装备
     */
    public getStarEquipBagIdlePos(srcInfo: StarInfo): number {
        if (this.getStarEquipBagIdleNum() > 0) {
            let dic = this.getStarListByBagType(StarBagType.THANE);
            for (let index = 0; index < dic.getList().length; index++) {
                const info = dic.getList()[index] as StarInfo;
                if (srcInfo.template.MasterType == info.template.MasterType) {
                    return -2
                }
            }

            for (let index = 0; index < PlayerModel.EQUIP_STAR_BAG_COUNT; index++) {
                if (!dic[index]) {
                    return index
                }
            }
        }
        return -1;
    }

    //存在同类型的直接替换通类型的, 
    //不存在同类型的手动选择替换哪个
    public checkHasSameType(srcInfo: StarInfo): Array<any> {
        let flag: boolean = false;
        let pos: number = 0;
        let name: string = "";
        let dic = this.getStarListByBagType(StarBagType.THANE);
        for (let index = 0; index < dic.getList().length; index++) {
            const info = dic.getList()[index] as StarInfo;
            if (srcInfo.template.MasterType == info.template.MasterType) {
                flag = true;
                pos = info.pos;
                name = info.template.TemplateNameLang;
                break;
            }
        }
        return [flag, pos, name];
    }

    /**
     * 获取装备背包中所有可装备的位置
     * @param srcInfo 
     * @returns 
     */
    public getStarEquipBagIdlePosList(): number[] {
        let tmpList = []
        if (this.getStarEquipBagIdleNum() > 0) {
            let dic = this.getStarListByBagType(StarBagType.THANE);
            for (let index = 0; index < PlayerModel.EQUIP_STAR_BAG_COUNT; index++) {
                if (!dic[index]) {
                    tmpList.push(index)
                }
            }
        }
        return tmpList;
    }

    /**
     * 获取星运背包中一个可装备的位置
     * @param srcInfo 
     * @returns -1没位置
     */
    public getStarPlayerBagIdlePos(srcInfo?: StarInfo): number {
        let pos: number = -1;
        if (this.getStarPlayerBagIdleNum() > 0) {
            let dic = this.getStarListByBagType(StarBagType.PLAYER);
            let openedNum = PlayerModel.ORIGINAL_OPEN_BAG_COUNT + this.playerInfo.starBagCount;
            for (let index = 0; index < openedNum; index++) {
                if (!dic[index]) {
                    pos = index
                    break;
                }
            }
        }
        return pos;
    }

    // 一键合成
    public oneKeyCompose(type: number) {
        let tmpList
        switch (type) {
            case StarBagType.TEMP:
                tmpList = this.tempStarList.getList()
                break;
            case StarBagType.PLAYER:
                tmpList = this.getStarListByBagType(StarBagType.PLAYER).getList()
                break;
        }

        if (!tmpList) return

        this.aKeyComposeBagType = type

        if (tmpList.length <= 1) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("armyII.viewII.horoscope.HoroscopeView.command01"));
            return;
        }
        var target: StarInfo;
        var totalExp: number = 0;
        for (let index = 0; index < tmpList.length; index++) {
            const info: StarInfo = tmpList[index];
            if (this.__oneKeyComposeCheck(info)) {
                totalExp += StarHelper.getStarTotalExp(info);
                if (info.grade < StarHelper.getStarMaxGradeByProfile(info.template.Profile)) {
                    if (info.template.Profile == 6) continue;
                    if (!target)
                        target = info;
                    else
                        target.template.Profile < info.template.Profile ? target = info : target;
                }
            }
        }
        if (!target || (totalExp = totalExp - StarHelper.getStarTotalExp(target)) <= 0)  //总经验减目标星运经验后赋值给总经验, 再比较总经验是否<=0
        {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("armyII.viewII.horoscope.HoroscopeView.command01"));
            return;
        }
        var name: string = StarHelper.getStarHtmlName(target.template);
        var level: number = StarHelper.checkCanUpGrade(totalExp, target);

        let tmpStr = this.aKeyComposeBagType == StarBagType.TEMP ? "armyII.viewII.horoscope.HoroscopeView.command04" : "armyII.viewII.horoscope.HoroscopeView.command02"
        let str = name + LangManager.Instance.GetTranslation(tmpStr, totalExp);  //totalExp已在上面减去目标星运经验
        level > target.grade ? str += LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.Level.up", level) : str;

        SimpleAlertHelper.Instance.Show(null, target, null, str, null, null, this.__oneKeyCompose.bind(this));
    }

    private __oneKeyCompose(boolean: boolean, flag: boolean, sInfo: StarInfo) {
        Logger.xjy("[StarWnd]__starComposeHandler", sInfo)
        if (boolean) {
            var arr: any[] = [];
            var list: any[] = this.tempStarList.getList();
            list.forEach((info: StarInfo) => {
                if (info != sInfo && !info.composeLock && info.template.Profile >= 5 && info.template.Profile != 6) {
                    if (this.aKeyComposeBagType == StarBagType.PLAYER && info.grade < 10) {
                        arr.push(info);
                    } else {
                        arr.push(info);
                    }
                }
            });
            if (arr.length > 0) {
                var sname: string = "";
                arr.forEach(info => {
                    sname += StarHelper.getStarHtmlName(info.template);
                });
                let content = LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.confirmComposeTip", sname)
                // + "\n" + LangManager.Instance.GetTranslation("yishi.view.ConfirmSellFrame.content.htmlText02") +
                // "<font color='#01ccff'>[YES]</font>" +
                // LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.confirmComposeTip2")
                SimpleAlertHelper.Instance.Show(null, sInfo, null, content, null, null, this.__oneKeyComposeBack.bind(this));
                return;
            }
            this.__oneKeyComposeBack(boolean, true, sInfo);
        }
    }

    private __oneKeyComposeBack(b: boolean, check: boolean, sInfo: any) {
        Logger.xjy("[StarWnd]__starComposeHandler", sInfo)
        if (b) {
            this.starModel.delWay = StarModel.COMPOSE;
            this.sendOneKeyCompose(sInfo.pos, this.aKeyComposeBagType);
        }
    }

    private __oneKeyComposeCheck(info: StarInfo) {
        switch (this.aKeyComposeBagType) {
            case StarBagType.TEMP:
                return info.template.Profile > 1 && !info.composeLock
            case StarBagType.PLAYER:
                return info.grade < 10 && !info.composeLock
        }
    }


    public checkIsStarNotFull(): boolean {
        return this._startList.getList().length < this.playerInfo.starBagCount;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    /**
     * 临时背包星运列表
     */
    public get tempStarList(): SimpleDictionary {
        return this._tempStarList;
    }

    /**
     * 玩家和领主背包星运列表
     */
    public get startList(): SimpleDictionary {
        return this._startList;
    }

    /**
     * 水晶球状态列表
     */
    public get randomPosList(): any[] {
        return this._randomPosList;
    }

    public get starModel(): StarModel {
        return this._starModel;
    }

    public clear() {
        this._tempStarList.clear();
        this._startList.clear();
        this._randomPosList = [];
        this._starModel.dispose();
        this._starModel = new StarModel();
    }
}