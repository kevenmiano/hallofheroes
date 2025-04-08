// @ts-nocheck
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import { BagSortType, BagType } from "../constant/BagDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { BagEvent } from "../constant/event/NotificationEvent";
import { TipMessageData } from "../datas/TipMessageData";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
import Logger from "../../core/logger/Logger";
import GoodsSonType from "../constant/GoodsSonType";
import { ItemHelper } from "../utils/ItemHelper";
import { GoodsType } from "../constant/GoodsType";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "./ArmyManager";
import { PlayerManager } from "./PlayerManager";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { NotificationManager } from "./NotificationManager";
import { GoodsCheck } from "../utils/GoodsCheck";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import AudioManager from "../../core/audio/AudioManager";
import { SoundIds } from "../constant/SoundIds";
import { ComposeGoodsInfo } from "../datas/goods/ComposeGoodsInfo";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import ItemMovedListMsg = com.road.yishi.proto.item.ItemMovedListMsg;
import ItemMoveUpdateMsg = com.road.yishi.proto.item.ItemMoveUpdateMsg;
import ItemInfoMsg = com.road.yishi.proto.item.ItemInfoMsg;
import ArrangeReq = com.road.yishi.proto.item.ArrangeReq;
import ArrangeInfo = com.road.yishi.proto.item.ArrangeInfo;
import { ThaneInfoHelper } from "../utils/ThaneInfoHelper";
import StarInfo from "../module/mail/StarInfo";
import FoisonHornManager from "./FoisonHornManager";
import { TempleteManager } from "./TempleteManager";
import { CommonConstant } from "../constant/CommonConstant";
import ForgeData from "../module/forge/ForgeData";

/**
 * 道具管理
 */
export class GoodsManager extends GameEventDispatcher {
    private static _Instance: GoodsManager;
    public static get Instance(): GoodsManager {
        if (!GoodsManager._Instance) {
            GoodsManager._Instance = new GoodsManager();
        }
        return GoodsManager._Instance;
    }

    private _goodsListByPos: SimpleDictionary;
    private _goodsCountByTempId: SimpleDictionary;
    private _preGoodsCount: SimpleDictionary;
    private _newGoodsCount: SimpleDictionary;

    public filterFlag: boolean = false;
    private _sellPosList: number[];

    constructor() {
        super();
    }

    public preSetup() {
        this._goodsListByPos = new SimpleDictionary();
        this._goodsCountByTempId = new SimpleDictionary();
        this._preGoodsCount = new SimpleDictionary();
        this._newGoodsCount = new SimpleDictionary();
        this.initEvent();
    }

    public setup() {

    }
    //断线重连之前进行一次清理。ps 固包后, 感觉要重构一次。
    public clear() {
        this._goodsListByPos.clear();
        this._goodsCountByTempId.clear();
        this._preGoodsCount.clear();
        this._newGoodsCount.clear();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_BAG_MOVE_UPDATE, this, this.__bagUpdateHandler);
    }

    /**
     *
     * @param pkg
     */
    private __bagUpdateHandler(pkg: PackageIn): void {
        //fixme 贼耗性能
        this._preGoodsCount.clear();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.bagType == BagType.Player) {
                    let count: number = info.count;
                    if (this._preGoodsCount[info.templateId]) {
                        this._preGoodsCount.add(info.templateId, ~~(this._preGoodsCount[info.templateId]) + count);
                    }
                    else {
                        this._preGoodsCount.add(info.templateId, count);
                    }
                }
            }
        }

        let msg: ItemMovedListMsg = pkg.readBody(ItemMovedListMsg) as ItemMovedListMsg;
        let newGoodsArr: GoodsInfo[] = [];
        let arr: Array<GoodsInfo> = [];
        let needRefreshFoisonHornData: boolean = false;
        let isRuneGemFragment: boolean = false;
        if (FoisonHornManager.Instance.model && FoisonHornManager.Instance.model.isOpen) {
            arr = FoisonHornManager.Instance.model.goodsList;
        }

        let delGoodes: GoodsInfo[];
        let updateGoodes: GoodsInfo[];
        let addCounts: number[];
        for (let i: number = 0; i < msg.moved.length; i++) {
            let itemMsg: ItemMoveUpdateMsg = msg.moved[i] as ItemMoveUpdateMsg;
            let changeBagType: number = itemMsg.changeType;
            let changeObjectId: number = itemMsg.changeObjId;
            let changePos: number = itemMsg.changePos;

            let good_info: GoodsInfo;
            let flag: boolean = itemMsg.hasOwnProperty("item");
            if (flag) {
                let id: number = itemMsg.item.id;
                let isAdd: boolean = false;
                good_info = this._goodsListByPos[changePos + "_" + changeObjectId + "_" + changeBagType];
                if (!good_info) {
                    good_info = new GoodsInfo();
                    this._goodsListByPos.add(changePos + "_" + changeObjectId + "_" + changeBagType, good_info);
                    isAdd = true;
                }
                good_info = ItemHelper.readGoodsInfo(itemMsg.item as ItemInfoMsg, good_info);
                if (!good_info.templateInfo) continue;
                if (good_info.isNew && (good_info.bagType == BagType.Player)) {
                    if (good_info.templateId == CommonConstant.RUNE_GEM_FRAGMENT) {
                        isRuneGemFragment = true;
                    }
                    newGoodsArr.push(good_info);
                }
                Logger.info("更新物品" + changeBagType + "_" + changeObjectId + "_" + changePos + "---ID:" + good_info.id + "----name:" + good_info.templateInfo.TemplateNameLang + "----count:" + good_info.count);
                Logger.info("物品模板id", good_info.templateId)
                if (good_info.bagType == BagType.Bottle) {
                    this.dispatchEvent(BagEvent.UPDATE_BOTTLE_BAG, good_info);
                }
                if (isAdd) {
                    this.dispatchEvent(BagEvent.ADD_GOODS, good_info);
                }
                if (good_info.templateId == 2032101) {
                    if (good_info.property1 == "1") {
                        let tipData: TipMessageData = new TipMessageData();
                        tipData.type = TipMessageData.CAMPAIGN_CARD;
                        tipData.goods = good_info;
                        TaskTraceTipManager.Instance.showView(tipData);
                    }
                }
                if (good_info.isNew && good_info.bagType == BagType.RUNE) {
                    this.dispatchEvent(BagEvent.ADD_RUNE_GEM, good_info);
                }
                // if(good_info.bagType == BagType.PET_EQUIP_BAG ){
                //     Logger.xjy("PET_EQUIP_BAG", good_info)
                //     this.dispatchEvent(BagEvent.ADD_PET_EQUIP, good_info);
                // }
                // else if(good_info.bagType == BagType.PET_BAG){
                //     this.dispatchEvent(BagEvent.DELETE_BAG, good_info);
                // }

                let addCount = 0;
                if (this._preGoodsCount[good_info.templateId]) {
                    addCount = good_info.count - this._preGoodsCount[good_info.templateId];
                }
                if (!updateGoodes) updateGoodes = [];
                if (!addCounts) addCounts = [];
                updateGoodes.push(good_info);
                addCounts.push(addCount);
            }
            else {
                Logger.info("删除物品" + changeBagType + "_" + changeObjectId + "_" + changePos);
                good_info = this._goodsListByPos[changePos + "_" + changeObjectId + "_" + changeBagType] as GoodsInfo;
                if (good_info) {
                    this._goodsListByPos.del(changePos + "_" + changeObjectId + "_" + changeBagType);
                    good_info.pos = changePos;
                    good_info.objectId = changeObjectId;
                    good_info.bagType = changeBagType;
                    if (!delGoodes) delGoodes = [];
                    delGoodes.push(good_info);
                    if (good_info.bagType == BagType.Bottle) {
                        this.dispatchEvent(BagEvent.DELETE_BOTTLE_BAG, good_info);
                    }
                    else if (good_info.bagType == BagType.Fish) {
                        this.dispatchEvent(BagEvent.DELETE_FISH_BAG, good_info);
                    } else if (good_info.bagType == BagType.PET_BAG) {
                        this.dispatchEvent(BagEvent.DELETE_PET_EQUIP, good_info);
                    }
                    if (good_info.templateInfo.SonType == GoodsSonType.SONTYPE_TREASURE_MAP) {
                        this.dispatchEvent(BagEvent.DELETE_TREASURE_MAP, good_info);
                    }
                }
            }
            if (arr.length > 0) {
                for (let j: number = 0; j < arr.length; j++) {
                    if (good_info && arr[j].templateId == good_info.templateId) {
                        needRefreshFoisonHornData = true;
                    }
                }
            }
        }
        //更新物品
        updateGoodes && this.dispatchEvent(BagEvent.UPDATE_BAG, updateGoodes, addCounts);
        //删除物品事件
        delGoodes && this.dispatchEvent(BagEvent.DELETE_BAG, delGoodes);

        if (newGoodsArr.length > 0) {
            AudioManager.Instance.playSound(SoundIds.GET_GOODS_SOUND);
            if (!isRuneGemFragment) {
                this.dispatchEvent(BagEvent.NEW_GOODS, newGoodsArr);
            }
        }
        this.countGoods();
        if (needRefreshFoisonHornData) {
            FoisonHornManager.Instance.sendRequest(FoisonHornManager.OPEN_FRAME);
        }
        this.dispatchEvent(BagEvent.CHECK_BAG_FULL, null);
    }

    private countGoods() {
        this._newGoodsCount.clear();
        let info: GoodsInfo
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                info = this._goodsListByPos[key];
                // if (info.bagType == BagType.Player) {
                let count: number = info.count;
                if (this._newGoodsCount[info.templateId]) {
                    this._newGoodsCount.add(info.templateId, ~~(this._newGoodsCount[info.templateId]) + count);
                }
                else {
                    this._newGoodsCount.add(info.templateId, count);
                }
                // }
            }
        }
        this._newGoodsCount.keys.forEach(id => {
            if (!this._preGoodsCount[id]) {
                this._goodsCountByTempId.add(id, this._newGoodsCount[id]);
            }
            else {
                if (~~(this._preGoodsCount[id]) != ~~(this._newGoodsCount[id])) {
                    this._goodsCountByTempId.add(id, this._newGoodsCount[id]);
                }
                this._preGoodsCount.del(id);
            }
        });
        this._preGoodsCount.keys.forEach(id => {
            this._goodsCountByTempId.del(id);
        });
    }

    public getCountByTempId(tempId: number) {
        let c = this._goodsCountByTempId.get(tempId);
        if (c == undefined) {
            c = 0;
        }
        return +c;
    }

    public fixBagItem(oldPlaces: any[], newPlaces: any[], bagType: number, isOverlay: boolean) {
        let msg: ArrangeReq = new ArrangeReq();
        msg.isStackItem = isOverlay;
        msg.bagType = bagType;
        for (let i: number = 0; i < oldPlaces.length; i++) {
            let info: ArrangeInfo = new ArrangeInfo();
            info.newplace = newPlaces[i];
            info.oldplace = oldPlaces[i];
            msg.arrangeInfo.push(info);
        }
        SocketManager.Instance.send(C2SProtocol.C_BAG_ARRANGE, msg);
    }

    /**
     * 取得魔罐
     * @return
     *
     */
    // public getBottleBagList():SimpleDictionary
    // {
    // 	let dic:SimpleDictionary = new SimpleDictionary(true);
    // 	for each(let info:GoodsInfo in _goodsListByPos)
    // 	{
    // 		if(isBottleBagGoods(info))
    // 			dic.add(info.id,info);
    // 	}
    // 	return dic;
    // }
    /**
     * 判断物品是否是魔罐
     * @param goods
     * @return
     *
     */
    public isBottleBagGoods(goods: GoodsInfo): boolean {
        if (goods.objectId == 0 && goods.bagType == BagType.Bottle) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 取得迷阵背包
     * @return
     *
     */
    public getMazeBagList(): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            let info: GoodsInfo = this._goodsListByPos[key];
            if (this.isMazeBagGoods(info)) {
                dic.add(info.id, info);
            }
        }
        return dic;
    }
    /**
     * 判断物品是否是夺宝奇兵
     * @param goods
     * @return
     *
     */
    public isMazeBagGoods(goods: GoodsInfo): boolean {
        if (goods.objectId == 0 && goods.bagType == BagType.Maze) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 取得鱼篓
     * @return
     *
     */
    public getFishBagList(): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (this.isFishBagGoods(info)) {
                    dic.add(info.id, info);
                }
            }
        }
        return dic;
    }

    /**
     * 判断物品是否是鱼篓
     * @param goods
     * @return
     *
     */
    public isFishBagGoods(goods: GoodsInfo): boolean {
        if (goods.objectId == 0 && goods.bagType == BagType.Fish) {
            return true;
        }
        else {
            return false;
        }
    }

    public getGeneralBagList(): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();

        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (this.isGneralBagGoods(goods)) {
                    dic.add(goods.id, goods);
                }
            }
        }
        return dic;
    }

    public getCountBySontypeAndBagType(sontype: number, bagType: number): number {
        let count: number = 0;
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.bagType == bagType && info.templateInfo && info.templateInfo.SonType == sontype) {
                    count += info.count;
                }
            }
        }
        return count;
    }

    /**
     * 获得背包内指定模版Id的物品数量
     * @param bagType:背包类型
     * @param tempId: 物品模版Id
     * @return : 物品数量
     *
     */
    public getBagCountByTempId(bagType: number, tempId: number): number {
        let count: number = 0;
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.bagType == bagType && info.templateId == tempId) {
                    count += info.count;
                }
            }
        }
        return count;
    }

    public getBagCountByTempIdAndPos(bagType: number, tempId: number, pos: number): number {
        let count: number = 0;
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.bagType == bagType && info.templateId == tempId && info.pos == pos) {
                    count += info.count;
                }
            }
        }
        return count;
    }

    public getHeroEquipBagAndPlayerBagList(): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];

                if (this.isGneralBagGoods(goods) || this.isGneralStoreBagGoods(goods) || goods.bagType == BagType.HeroEquipment || goods.bagType == BagType.Hide) {
                    // if(goods.isViceEquip)
                    // {
                    // 	if(goods.strengthenGrade == goods.templateInfo.StrengthenMax)
                    // 	{
                    // 		dic.add(goods.id,goods);
                    // 	}
                    // } else 
                    // if (goods.isSeniorEquipMaterial) {
                    //     if (goods.strengthenGrade == goods.templateInfo.StrengthenMax && goods.mouldGrade >= ForgeData.COMPOSE_SENIOR_EQUIP_NEED_MOULD_GRADE) {
                    //         dic.add(goods.id, goods);
                    //     }
                    // }
                    // else {
                    //     dic.add(goods.id, goods);
                    // }
                    dic.add(goods.id, goods);
                }
            }
        }
        return dic;
    }

    public isGneralBagGoods(goods: GoodsInfo): boolean {
        if (goods.objectId == 0 && goods.bagType == BagType.Player) {
            return true;
        }
        else {
            return false;
        }
    }

    public get consoritaBagList(): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.bagType == BagType.Storage) {
                    dic.add(info.id, info);
                }
            }
        }
        return dic;
    }

    public get equipBagList(): any[] {
        let arr: any[] = [];
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.objectId == 0 && info.templateInfo && info.templateInfo.MasterType == GoodsType.EQUIP && info.bagType == BagType.Player) {
                    arr.push(info);
                }
            }
        }
        return arr;
    }

    public get skillBagList(): any[] {
        let arr: any[] = [];
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.objectId == 0 && info.templateInfo && info.templateInfo.MasterType == GoodsType.HONER && info.bagType == BagType.Player) {
                    arr.push(info);
                }
            }
        }
        return arr;
    }

    public findEmputyPos(): number {
        for (let i: number = 0; i < this.playerInfo.bagTotalCount; i++) {
            if (!this._goodsListByPos[i + "_" + 0 + "_" + BagType.Player]) {
                return i;
            }
        }
        return -1;
    }

    public findPetBagEmputyPos(): number {
        let str = TempleteManager.Instance.getConfigInfoByConfigName("pet_bag").ConfigValue
        let len = this.playerInfo.petBagCount + Number(str.split(',')[0]);
        for (let i: number = 0; i < len; i++) {
            if (!this._goodsListByPos[i + "_" + 0 + "_" + BagType.PET_BAG]) {
                return i;
            }
        }
        return -1;
    }

    public getEmputyPosCount(): number {
        let count: number = 0;
        for (let i: number = 0; i < this.playerInfo.bagTotalCount; i++) {
            if (!this._goodsListByPos[i + "_" + 0 + "_" + BagType.Player]) {
                count++;
            }
        }
        return count;
    }

    public findEmputyPosByPage(page: number = 1): number {
        for (let i: number = (page - 1) * 25; i < page * 25; i++) {
            if (i >= this.playerInfo.bagTotalCount) {
                return -1;
            }
            if (!this._goodsListByPos[i + "_" + 0 + "_" + BagType.Player]) {
                return i;
            }
        }
        return -1;
    }

    public findSuperpositionPos(gInfo: GoodsInfo): number {
        for (let key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let item: GoodsInfo = this._goodsListByPos[key];
                if (item && item.templateInfo && item.bagType == BagType.Player
                    && item.templateId == gInfo.templateId
                    && item.templateInfo.MaxCount > 1
                    && item.isBinds == gInfo.isBinds) {
                    return ~~(key.charAt(0));
                }
            }
        }
        return -1;
    }


    public getGoodsByTemplateId(tid: number): any[] {
        let arr: any[] = [];
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.templateId == tid) {
                    arr.push(goods);
                }
            }
        }
        return arr;
    }


    public getBagGoodsByTemplateId(tid: number): GoodsInfo[] {
        let arr: GoodsInfo[] = [];
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.templateId == tid && goods.bagType == BagType.Player) {
                    arr.push(goods);
                }
            }
        }
        return arr;
    }

    public getGoodsCountByBagType(type: number): number {
        let count: number = 0;
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.bagType == type) {
                    count++;
                }
            }
        }
        return count;
    }

    public getGoodsByBagType(type: number): GoodsInfo[] {
        let arr: GoodsInfo[] = [];
        let list: any[] = this._goodsListByPos.getList();
        let len: number = list.length;
        let goods: GoodsInfo;
        for (let i: number = 0; i < len; i++) {
            goods = list[i];
            if (goods.bagType == type) {
                arr.push(goods);
            }
        }
        return arr;
    }

    public getGoodsByBagTypeAndId(type: number, id: number): GoodsInfo {
        let list: any[] = this._goodsListByPos.getList();
        let len: number = list.length;
        let goods: GoodsInfo;
        for (let i: number = 0; i < len; i++) {
            goods = list[i];
            if (goods.bagType == type && goods.id == id) {
                return goods
            }
        }
        return null
    }

    /**
     * 是否存在TemplateId=id的物品
     * @param id
     * @return
     *
     */
    public isExitByTemplateId(id: number): boolean {
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.templateId == id && goods.bagType == BagType.Player) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取英雄身上的装备列表
     * @param id
     * @return
     *
     */
    public getHeroEquipListById(id: number): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (this.isHeroGoods(id, goods)) {
                    dic.add(goods.pos, goods);
                }
            }
        }
        return dic;
    }

    public getHeroHonorListById(id: number): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.bagType == BagType.Honer && goods.objectId == id) {
                    dic.add(goods.pos, goods);
                }
            }
        }
        return dic;
    }

    public isHeroGoods(heroId: number, goods: GoodsInfo): boolean {
        if (heroId == 0) {
            return false;
        }

        if ((goods.bagType == BagType.HeroEquipment && goods.objectId == heroId && goods.templateInfo && goods.templateInfo.MasterType == GoodsType.EQUIP)) {
            return true;
        }
        else {
            return false;
        }
    }

    public isHonerGoods(heroId: number, goods: GoodsInfo): boolean {
        if (heroId == 0) {
            return false;
        }

        if ((goods.bagType == BagType.Honer && goods.objectId == heroId && goods.templateInfo && goods.templateInfo.MasterType == GoodsType.HONER)) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 获取英雄身上的技能列表
     * @param id
     * @return
     *
     */
    public getHeroSkillListById(id: number): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.objectId == id && goods.templateInfo && goods.templateInfo.MasterType == GoodsType.HONER) {
                    dic.add(goods.id, goods);
                }
            }
        }
        return dic;
    }

    /**
     *  根据物品类型和英雄id取得英雄身上的物品
     * @param goodsType
     * @param id
     * @return
     *
     */
    public getHeroGoodsListByTypeAndId(goodsType: number, id: number): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.objectId == id && goods.templateInfo && goods.templateInfo.MasterType == goodsType) {
                    dic.add(goods.pos, goods);
                }
            }
        }
        return dic;
    }


    /**
     *  根据英雄id取得英雄装备背包的物品   英灵神器的MasterType也等于GoodsType.EQUIP
     * @param goodsType
     * @param id
     * @return
     *
     */
    public getHeroEquipmentGoodListByTypeAndId(id: number): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.bagType == BagType.HeroEquipment && goods.objectId == id && goods.templateInfo && goods.templateInfo.MasterType == GoodsType.EQUIP) {
                    dic.add(goods.pos, goods);
                }
            }
        }
        return dic;
    }

    public getBattleRunes(): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.bagType == BagType.Battle) {
                    dic.add(goods.pos, goods);
                }
            }
        }
        return dic;
    }

    public getBattleRunesByTempId(tid: number): GoodsInfo {
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.bagType == BagType.Battle && info.templateId == tid) {
                    return info;
                }
            }
        }
        return null;
    }

    public getEmputyBattleRunesPos(): number {
        let len: number;
        if (this.thane.grades >= 40) {
            len = 3;
        }
        else if (this.thane.grades >= 30) {
            len = 2;
        }
        else if (this.thane.grades >= 20) {
            len = 1;
        }
        else {
            len = 0;
        }
        for (let pos: number = 0; pos < len; pos++) {
            let info: GoodsInfo = this._goodsListByPos[pos + "_0_2"];
            if (!info) {
                return pos;
            }
        }
        if (len != 0) {
            return 0;
        }
        return -1;
    }

    public getHeroHonerEquip(id: number): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.bagType == BagType.Honer && info.objectId == id) {
                    dic.add(info.pos, info);
                }
            }
        }
        return dic;
    }

    public getEmputyHonerPos(): number {
        for (let pos: number = 0; pos < 1; pos++) {
            let info: GoodsInfo = this._goodsListByPos[pos + "_" + this.thane.id + "_" + BagType.Honer];
            if (!info) {
                return pos;
            }
        }
        return -1;
    }

    public getHeroGoodsListBySonTypeAndId(sonType: number, id: number): SimpleDictionary {
        let dic: SimpleDictionary = new SimpleDictionary();
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.objectId == id && goods.templateInfo && goods.templateInfo.SonType == sonType) {
                    dic.add(goods.pos, goods);
                }
            }
        }
        return dic;
    }

    /**
     * 通过templateID取得某个物品
     * @param id
     * @return
     *
     */
    public getGoodsByGoodsTId(id: number): GoodsInfo[] {
        let arr: GoodsInfo[] = [];
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.templateId == id) {
                    arr.push(info);
                }
            }
        }
        return arr;
    }

    public getGoodsByGoodsIdFromGeneralBag(id: number): GoodsInfo {
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (this.isGneralBagGoods(info) && info.id == id) {
                    return info;
                }
            }
        }
        return null;
    }

    public getHeroEquipByPos(hid: number, pos: number): GoodsInfo {
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.objectId == hid && info.pos == pos) {
                    return info;
                }
            }
        }
        return null;
    }

    public getGoodsByObjectIdAndGoodID(objectId: number, goodsId: number): GoodsInfo {
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.objectId == objectId && info.templateId == goodsId) {
                    return info;
                }
            }
        }
        return null;
    }

    /**
     * 通过位置取得隐藏背包的物品
     * @param pos
     * @return
     *
     */
    public getHideBagItemByPos(pos: number): GoodsInfo {
        let info: GoodsInfo = this._goodsListByPos[pos + "_0_" + BagType.Hide] as GoodsInfo;
        return info;
    }

    /**
     * 从所有背包里准确取得物品
     * @param pos,objectId,bagType
     * @return
     *
     */
    public getItemByPOB(pos: number, objectId: number, bagType: number): GoodsInfo {
        let info: GoodsInfo = this._goodsListByPos[pos + "_" + objectId + "_" + bagType] as GoodsInfo;
        return info;
    }

    public get goodsListByPos(): SimpleDictionary {
        return this._goodsListByPos;
    }

    public get goodsCountByTempId(): SimpleDictionary {
        return this._goodsCountByTempId;
    }

    /**
     * 获取背包中某种物品的数量
     * @param tempId
     * @return
     *
     */
    public getGoodsNumByTempId(tempId: number): number {
        let num: number = 0;
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.objectId == 0 && goods.bagType == BagType.Player && goods.templateId == tempId) {
                    num += goods.count;
                }
            }
        }
        return num;
    }

    public getGoodsNumByTempIdInHeroEquipBayAndPlayerBag(tempId: number): number {
        let num: number = 0
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if ((this.isHeroGoods(this.thane.id, goods) || this.isGneralBagGoods(goods)) && goods.templateId == tempId) {
                    num += goods.count;
                }
            }
        }
        return num;
    }

    public getGoodsNumBySonType(sonType: number, bagType: BagType = BagType.Player): number {
        let num: number = 0;
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods && goods.objectId == 0 && goods.bagType == bagType && goods.templateInfo && goods.templateInfo.SonType == sonType) {
                    num += goods.count;
                }
            }
        }
        return num;
    }

    public get hasDiscount(): boolean {
        let goods = GoodsManager.Instance.getGeneralBagGoodsBySonType(GoodsSonType.SONTYPE_DISCOUNT);
        return goods.length > 0;
    }

    public getGoodsBySonType(sontype: number): any[] {
        let arr: any[] = [];
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.templateInfo && goods.templateInfo.SonType == sontype) {
                    arr.push(goods);
                }
            }
        }
        return arr;
    }

    public getGeneralBagEquipList(): any[] {
        let arr: any[] = [];
        let goodsList: SimpleDictionary = this.getGeneralBagList();
        goodsList.keys.forEach(key => {
            let goods: GoodsInfo = goodsList[key];
            if (goods.templateInfo && goods.templateInfo.MasterType == GoodsType.EQUIP) {
                arr.push(goods);
            }
        });
        return arr;
    }


    public getGeneralBagPropList(): any[] {
        let arr: any[] = [];
        let goodsList: SimpleDictionary = this.getGeneralBagList();
        goodsList.keys.forEach(key => {
            let goods: GoodsInfo = goodsList[key];
            if (goods.templateInfo && goods.templateInfo.MasterType == GoodsType.PROP) {
                arr.push(goods);
            }
        })
        return arr;
    }

    public getGeneralBagGoodsBySonType(sontype: number): any[] {
        let goodsList: SimpleDictionary = this.getGeneralBagList();
        let arr: any[] = [];
        goodsList.keys.forEach(key => {
            let goods: GoodsInfo = goodsList[key];
            if (goods.templateInfo && goods.templateInfo.SonType == sontype) {
                arr.push(goods);
            }
        })
        return arr;
    }

    public checkExistGoodsByTempIdInAllBag(tid: number): boolean {
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.templateId == tid) {
                    return true;
                }
            }
        }
        return false;
    }

    public checkHeroHasEmpty(): any[] {
        let arr: any[] = [];
        let dic: SimpleDictionary = this.getHeroEquipListById(this.thane.id);
        for (let i: number = 0; i < 8; i++) {
            if (!dic[i]) {
                switch (i) {
                    case 0:
                        arr.push(GoodsSonType.SONTYPE_WEAPON);
                        break;
                    case 1:
                        arr.push(GoodsSonType.SONTYPE_HEADDRESS);
                        break;
                    case 2:
                        arr.push(GoodsSonType.SONTYPE_CLOTHES);
                        break;
                    case 3:
                        arr.push(GoodsSonType.SONTYPE_NECKLACE);
                        break;
                    case 4:
                    case 5:
                        arr.push(GoodsSonType.SONTYPE_RING);
                        break;
                    case 6:
                    case 7:
                        arr.push(GoodsSonType.SONTYPE_TRINKET);
                        break;
                }
            }
        }
        return arr;
    }

    public checkCanEquip(sontype: number): any[] {
        let arr: any[] = [];
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (!goods || !goods.templateInfo) continue;
                if (goods.bagType == BagType.Player && goods.templateInfo.SonType != GoodsSonType.SONTYPE_RUNNES
                    && GoodsCheck.checkGoodsCanEquip(goods, this.thane)
                    && GoodsCheck.isGradeFix(this.thane, goods.templateInfo, false)
                    && sontype == goods.templateInfo.SonType) {
                    arr.push(goods);
                }
            }
        }
        return arr;
    }

    /**
     * 检查英雄身上是否有可以强化的装备
     * @return
     *
     */
    public checkCanIntensify(): boolean {
        let dic: SimpleDictionary = this.getHeroEquipListById(this.thane.id);
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let info: GoodsInfo = dic[key];
                if (info.templateInfo && info.templateInfo.StrengthenMax > 0 && info.strengthenGrade != info.templateInfo.StrengthenMax) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     *  检查英雄身上是否可以镶嵌对应等级的宝石的装备
     * @return
     *
     */
    public checkCanMountByGrade(grade: number): boolean {
        let dic: SimpleDictionary = this.getHeroEquipListById(this.thane.id);
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let info: GoodsInfo = dic[key];
                if (info.existLessGradeJewel(grade)) {
                    return true;
                }
            }
        }
        return false;
    }

    public filterGoodsInGeneralAndConsortiaBag(): any[] {
        let arr: any[] = [];
        let page: number = 0;
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (info.bagType == BagType.Player && !info.checkIsFilterGoods()) {
                    page = Number(info.pos / 56) + 1;
                    if (arr.indexOf(page) < 0) {
                        arr.push(page);
                    }
                }
            }
        }
        NotificationManager.Instance.sendNotification(BagEvent.FILTER_GOODS);
        return arr;
    }

    public isType(goods: GoodsInfo, type: number): boolean {
        let flag: boolean = false;
        if (goods.templateInfo) {
            switch (type) {
                case BagSortType.Fashion:
                    if (goods.templateInfo && goods.templateInfo.MasterType == GoodsType.EQUIP) {
                        if (this.isFashion(goods.templateInfo)) {
                            flag = true;
                        }
                    }
                    break;
                case BagSortType.Prop:
                    if (goods.templateInfo.MasterType == GoodsType.PROP || goods.templateInfo.MasterType == GoodsType.HONER) {
                        if (!this.isJewel(goods)) {
                            flag = true;
                        }
                    }
                    break;
                case BagSortType.Default:
                    flag = true;
                    break;
                case BagSortType.Equip:
                    //remark by yuyuanzhan 特殊处理: 不改配置把勋章要加到装备里面
                    if (goods.templateInfo.MasterType == GoodsType.EQUIP || goods.templateInfo.SonType == GoodsSonType.SONTYPE_HONER) {
                        if (!this.isFashion(goods.templateInfo)) {
                            flag = true;
                        }
                    }
                    break;
                case BagSortType.Jewel:
                    if (goods.templateInfo.MasterType == GoodsType.PROP || goods.templateInfo.MasterType == GoodsType.HONER) {
                        if (this.isJewel(goods)) {
                            flag = true;
                        }
                    }
                    break;
            }
        }
        return flag;
    }

    /**
     * 设置pos位置是否为批量出售状态, 添加到 _sellPosList 中
     * @param pos: 位置
     * @param isAdd: true添加   false删除  （批量出售状态）
     * @param clean: true所有位置还原为正常状态
     */
    public setSellPos(pos: number, isAdd: boolean, clean: boolean = false) {
        if (this._sellPosList == null) {
            this._sellPosList = [];
        }
        if (clean) {
            while (this._sellPosList.length > 0) {
                this._sellPosList.pop();
            }
            return;
        }
        if (isAdd) {
            this._sellPosList.push(pos);
        }
        else if (this._sellPosList.indexOf(pos) >= 0) {
            this._sellPosList.splice(this._sellPosList.indexOf(pos), 1);
        }
    }

    public hasSellPos(): boolean {
        if (this._sellPosList == null || this._sellPosList.length <= 0) {
            return false;
        }
        return true;
    }

    /**
     * 检查pos位置是否为批量出售状态
     * @param pos
     * @return
     *
     */
    public isSellPos(pos: number): boolean {
        if (this._sellPosList == null) {
            return false;
        }
        return this._sellPosList.indexOf(pos) >= 0;
    }

    /**
     * 检查批量出售列表中是否有sonType物品
     * @param pos
     * @return
     *
     */
    public isInSellPos(sonType: number): boolean {
        if (this._sellPosList == null) {
            return false;
        }
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = this._goodsListByPos[key];
                if (this._sellPosList.indexOf(info.pos) >= 0 && info.templateInfo && info.templateInfo.SonType == sonType) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 是否为普通装备
     * @param temp
     */
    public isEquip(temp: t_s_itemtemplateData): boolean {
        if (!temp) {
            return false;
        }
        if (temp.SonType == GoodsSonType.SONTYPE_WEAPON || temp.SonType == GoodsSonType.SONTYPE_ASSISTANT ||
            temp.SonType == GoodsSonType.SONTYPE_HEADDRESS || temp.SonType == GoodsSonType.SONTYPE_CLOTHES ||
            temp.SonType == GoodsSonType.SONTYPE_MANTEAU || temp.SonType == GoodsSonType.SONTYPE_NECKLACE ||
            temp.SonType == GoodsSonType.SONTYPE_RING || temp.SonType == GoodsSonType.SONTYPE_TRINKET ||
            temp.SonType == GoodsSonType.SONTYPE_HERALDRY || temp.SonType == GoodsSonType.SONTYPE_RELIC) {
            return true;
        }
        return false;
    }

    /**
     * 是否为时装
     * @param temp
     */
    public isFashion(temp: t_s_itemtemplateData): boolean {
        if (!temp) {
            return false;
        }
        if (temp.SonType == GoodsSonType.SONTYPE_WING || temp.SonType == GoodsSonType.FASHION_CLOTHES ||
            temp.SonType == GoodsSonType.FASHION_HEADDRESS || temp.SonType == GoodsSonType.FASHION_WEAPON) {
            return true;
        }
        return false;
    }

    private isJewel(goods: GoodsInfo): boolean {
        if (!goods.templateInfo) return;
        if (goods.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT) {
            return true;
        }
        if (goods.templateInfo.SonType == GoodsSonType.RESIST_GEM) {
            return true;
        }
        if (goods.templateId == GoodsCheck.CRYSTAL_FRAGMENT) {
            return true;
        }
        return false;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    /**
     *根据合成公式确定是否可以合成
     * @param composeId
     * @return
     *
     */
    public checkEquipUpgrade(composeId: number): boolean {
        let composeGoodsInfo: ComposeGoodsInfo = new ComposeGoodsInfo();
        composeGoodsInfo.templateId = composeId;
        composeGoodsInfo.ownCount1 = composeGoodsInfo.template.Material1 ? this.getGoodsNumByTempIdInHeroEquipBayAndPlayerBag(composeGoodsInfo.template.Material1) : -1;
        composeGoodsInfo.ownCount2 = composeGoodsInfo.template.Material2 ? this.getGoodsNumByTempIdInHeroEquipBayAndPlayerBag(composeGoodsInfo.template.Material2) : -1;
        composeGoodsInfo.ownCount3 = composeGoodsInfo.template.Material3 ? this.getGoodsNumByTempIdInHeroEquipBayAndPlayerBag(composeGoodsInfo.template.Material3) : -1;
        composeGoodsInfo.ownCount4 = composeGoodsInfo.template.Material4 ? this.getGoodsNumByTempIdInHeroEquipBayAndPlayerBag(composeGoodsInfo.template.Material4) : -1;
        composeGoodsInfo.canMakeCount = composeGoodsInfo.getCanMakeCount();
        if (composeGoodsInfo.canMakeCount > 0) {
            return true;
        }
        return false;
    }

    public getGoodsNumByIdAndNotLockInEquipBag(tempId: number): number {
        let num: number = 0
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if ((this.isHeroGoods(this.thane.id, goods) || this.isGneralBagGoods(goods) || this.isGneralStoreBagGoods(goods)) && goods.templateId == tempId && goods.isLock == false) {
                    num += goods.count;
                }
            }
        }
        return num;
    }

    public isGneralStoreBagGoods(goods: GoodsInfo): boolean {
        if (goods.objectId == 0 && goods.bagType == BagType.Player) {
            return true;
        }
        else {
            return false;
        }
    }

    public getGoodsNumByTempIdAndNotLock(tempId: number): number {
        let num: number = 0;
        for (const key in this._goodsListByPos) {
            if (this._goodsListByPos.hasOwnProperty(key) && !key.startsWith("__")) {
                let goods: GoodsInfo = this._goodsListByPos[key];
                if (goods.objectId == 0 && goods.bagType == BagType.Player && goods.templateId == tempId && goods.isLock == false) {
                    num += goods.count;
                }
            }
        }
        return num;
    }

    /**
     * 过滤跟自己无关的装备
     * */
    public filterEquip(info: GoodsInfo): boolean {
        if (!info.templateInfo) return false;
        var myjob: number = ThaneInfoHelper.getJob(ArmyManager.Instance.thane.job);
        if (info.templateInfo.Job[0] == 0 || info.templateInfo.Job.indexOf(myjob) != -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 匹配的星运 
     * @param starInfo
     * @return 
     */
    public filterStar(starInfo: StarInfo): boolean {
        if (!starInfo || !starInfo.template) {
            return false;
        }
        if (starInfo.template.Job.indexOf(0) >= 0) {
            return true;
        }
        switch (this.thane.job) {
            case 1:
            case 4:
                if (starInfo.template.Job.indexOf(1) >= 0) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 2:
            case 5:
                if (starInfo.template.Job.indexOf(2) >= 0) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 3:
            case 6:
                if (starInfo.template.Job.indexOf(3) >= 0) {
                    return true;
                } else {
                    return false;
                }
                break;
        }
        return false;
    }

    /**
     * 背包内有更好的装备时, 背包的绿色箭头常驻
     * @returns 
     */
    public checkHasBetterEquip(): boolean {
        let array = this.equipBagList;
        let bagGoods: any[] = [];
        for (let i = 0; i < array.length; i++) {
            const info = array[i];
            if (info && this.isEquip(info.templateInfo)) {
                if (info.templateInfo) {
                    bagGoods = this.checkCanEquip(info.templateInfo.SonType);
                }
                let bestGoodsInBag: GoodsInfo = GoodsCheck.getBestGoodsInList(bagGoods);
                if (bestGoodsInBag) {
                    let result = GoodsCheck.checkGoodsBetterThanHero(info);
                    if (result) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}