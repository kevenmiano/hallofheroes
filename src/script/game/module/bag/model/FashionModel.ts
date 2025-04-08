// @ts-nocheck
import FrameDataBase from "../../../mvc/FrameDataBase";
import { BagType } from "../../../constant/BagDefine";
import { GoodsManager } from "../../../manager/GoodsManager";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import Dictionary from "../../../../core/utils/Dictionary";
import { FashionInfo } from "./FashionInfo";
import { FashionTryInfo } from "./FashionTryInfo";
import { FashionEvent } from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ArmyManager } from "../../../manager/ArmyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { GoodsType } from "../../../constant/GoodsType";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { t_s_skillpropertytemplateData } from "../../../config/t_s_skillpropertytemplate";
import { ResourceManager } from "../../../manager/ResourceManager";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/19 17:35
 * @ver 1.0
 *
 */
export class FashionModel extends FrameDataBase {
    public static INDENTITY_OPEN_GRADE: number = 27;
    /**目标位置**/
    public to_pos: number = 0;
    /**选择的面板*/
    private _selectedPanel: string;
    /**合成界面**/
    public static FASHION_COMPOSE_PANEL: string = "FASHION_COMPOSE_PANEL";
    /**图鉴界面**/
    public static FASHION_SWITCH_PANEL: string = "FASHION_SWITCH_PANEL";
    /**时装界面**/
    public static FASHION_PANEL: string = "FASHION_PANEL";
    /**装备界面**/
    public static EQUIP_PANEL: string = "EQUIP_PANEL";
    /**时装背包的打开场景**/
    private _openScene: string;
    /**商城打开**/
    public static SHOP_SCENE: string = "SHOP_SCENE";
    /**时装合成、转换打开**/
    public static FASHION_STORE_SCENE: string = "FASHION_STORE_SCENE";
    /**时装商城中展示的英雄形象**/
    private _showThane: ThaneInfo;
    /**时装商城中当前的试穿时装列表**/
    private _showDic: SimpleDictionary;
    /**时装商城中操作步骤的记录**/
    private _stepList: FashionTryInfo[];
    /**穿上**/
    public static TRY_ON: string = "TRY_ON";
    /**脱下**/
    public static GET_OFF: string = "GET_OFF";
    /**时装之魄*/
    public static FASHION_SOUL: number = 208020;
    /**幸运符**/
    public static FASHION_LUCKYCHARM: number = 208021;
    public static F_WING_COMPOSE_NEED_CNT: number = 5;
    /**合成转换操作的一个状态 用于与动画配合**/
    public opState: number = 0;
    public tryOnShopInfo: ShopGoodsInfo;
    public randomArray: Array<number> = [];
    public isIdentify:boolean=false;//是否正在鉴定或洗练
    /**
     * 时装合成与转换的tap位置
     */
    public tapNum: number = 0;

    /**
     * 存在的所有时装模版id列表
     */
    private _fashionIds: number[] = [];
    /**
     * 激活过的时装图鉴信息
     */
    private _bookList: Dictionary;
    /**
     * 穿上(点击)的图鉴信息(模版id的列表)
     */
    private _saveList: Dictionary;
    /** 有时装可进行鉴定时, 背包处需给红点提示 */
    // private _showRedPoint:boolean=false;

    /**
     * 鉴定过的时装
     */
    public identityedList: FashionInfo[] = [];

    constructor() {
        super();
    }

    public get stepList(): FashionTryInfo[] {
        if (!this._stepList) {
            this._stepList = [];
        }
        return this._stepList;
    }

    
    // public get showRedPoint() : boolean {
    //     return this._showRedPoint
    // }
    

    /**
     * 取得英雄试穿的Avata, 
     * 其中装备Avata始终与英雄实际的装备一致
     * 时装Avata为当前试穿的Avata
     * */
    public get showThane(): ThaneInfo {
        if (!this._showThane) {
            this._showThane = new ThaneInfo();
            this._showThane.templateId = this.thane.templateId;
            this._showThane.wingAvata = this.thane.wingEquipAvata;
            this._showThane.hairFashionAvata = this.thane.hairFashionAvata;
            this._showThane.bodyFashionAvata = this.thane.bodyFashionAvata;
            this._showThane.armsFashionAvata = this.thane.armsFashionAvata;
        }
        this._showThane.hairEquipAvata = this.thane.hairEquipAvata;
        this._showThane.bodyEquipAvata = this.thane.bodyEquipAvata;
        this._showThane.armsEquipAvata = this.thane.armsEquipAvata;
        return this._showThane;
    }

    /***
     * 是否能点击上一步
     * */
    public get canGotoPreStep(): boolean {
        return this._stepList.length > 0;
    }

    public get showDic(): SimpleDictionary {
        if (!this._showDic) {
            this.initShowDic();
        }
        return this._showDic;
    }

    public initShowDic() {
        if (!this._showDic) {
            this._showDic = new SimpleDictionary();
        }
        let equipList: any[] = this.fashionEquipList;
        for (let i: number = 0; i < equipList.length; i++) {
            this._showDic.add(this.getSonTypeByInfo(equipList[i]), equipList[i]);
        }
        this.dispatchEvent(FashionEvent.REFRESH_BAG, null);
    }

    /***
     * 试穿动作(穿上)
     * */
    public wearFahion(info: Object) {
        if (!info) {
            return;
        }
        let sonType: number = this.getSonTypeByInfo(info);
        let tryInfo: FashionTryInfo = new FashionTryInfo();
        tryInfo.sonType = sonType;
        tryInfo.oldInfo = this.showDic[sonType];
        switch (sonType) {
            case GoodsSonType.FASHION_HEADDRESS://帽子
                if (this.getAvataByInfo(info) != "") {
                    this.showThane.hairFashionAvata = this.getAvataByInfo(info);
                }
                break;
            case GoodsSonType.FASHION_CLOTHES://衣服
                if (this.getAvataByInfo(info) != "") {
                    this.showThane.bodyFashionAvata = this.getAvataByInfo(info);
                }

                break;
            case GoodsSonType.FASHION_WEAPON://武器
                if (this.getAvataByInfo(info) != "") {
                    this.showThane.armsFashionAvata = this.getAvataByInfo(info);
                }
                break;
            case GoodsSonType.SONTYPE_WING://翅膀
                if (this.getAvataByInfo(info) != "") {
                    this.showThane.wingAvata = this.getAvataByInfo(info);
                }
                break;
        }
        this.stepList.push(tryInfo);
        this.showDic.add(sonType, info);
        this.showThane.commit();
        this.dispatchEvent(FashionEvent.REFRESH_BAG, null);
    }

    /***
     * 试穿动作(脱下)
     * */
    public getOffFashion(info: Object) {
        if (!info) {
            return;
        }
        let tryInfo: FashionTryInfo = new FashionTryInfo();
        tryInfo.sonType = this.getSonTypeByInfo(info);
        tryInfo.oldInfo = this.showDic[this.getSonTypeByInfo(info)];
        switch (this.getSonTypeByInfo(info)) {
            case GoodsSonType.FASHION_HEADDRESS://帽子
                this.showThane.hairFashionAvata = "";
                break;
            case GoodsSonType.FASHION_CLOTHES://衣服
                this.showThane.bodyFashionAvata = "";
                break;
            case GoodsSonType.FASHION_WEAPON://武器
                this.showThane.armsFashionAvata = "";
                break;
            case GoodsSonType.SONTYPE_WING://翅膀
                this.showThane.wingAvata = "";
                break;
        }
        this.stepList.push(tryInfo);
        this.showDic.add(this.getSonTypeByInfo(info), null);
        this.showThane.commit();
        this.dispatchEvent(FashionEvent.REFRESH_BAG, null);
    }

    /***
     * 返回上一部
     * */
    public gotoPreStep() {
        if (this.stepList.length <= 0) {
            return;
        }
        this.showDic.add(this.stepList[this.stepList.length - 1].sonType, this.stepList[this.stepList.length - 1].oldInfo);
        this.showThane.hairFashionAvata = "";
        this.showThane.bodyFashionAvata = "";
        this.showThane.armsFashionAvata = "";
        this.showThane.wingAvata = "";
        for (let i: number = 0; i < this.showDic.getList().length; i++) {
            switch (this.getSonTypeByInfo(this.showDic.getList()[i])) {
                case GoodsSonType.FASHION_HEADDRESS://帽子
                    this.showThane.hairFashionAvata = this.getAvataByInfo(this.showDic.getList()[i]);
                    break;
                case GoodsSonType.FASHION_CLOTHES://衣服
                    this.showThane.bodyFashionAvata = this.getAvataByInfo(this.showDic.getList()[i]);
                    break;
                case GoodsSonType.FASHION_WEAPON://武器
                    this.showThane.armsFashionAvata = this.getAvataByInfo(this.showDic.getList()[i]);
                    break;
                case GoodsSonType.SONTYPE_WING://翅膀
                    this.showThane.wingAvata = this.getAvataByInfo(this.showDic.getList()[i]);
                    break;
            }
        }
        this.stepList.pop();
        this.showThane.commit();
        this.dispatchEvent(FashionEvent.REFRESH_BAG, null);
    }

    /**
     * 根据传进来的ShopGoodsInfo或者GoodsInfo取得SonType
     * */
    private getSonTypeByInfo(info: Object): number {
        let shopInfo: ShopGoodsInfo = <ShopGoodsInfo>info;
        let gInfo: GoodsInfo = <GoodsInfo>info;
        if (shopInfo) {
            let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, shopInfo.ItemId);
            return temp.SonType;
        }
        if (gInfo) {
            return gInfo.templateInfo.SonType;
        }
        return 0;
    }

    /**
     * 根据传进来的ShopGoodsInfo或者GoodsInfo取得模版Id
     * */
    private getIdByInfo(info: Object): number {
        let shopInfo: ShopGoodsInfo = <ShopGoodsInfo>info;
        let gInfo: GoodsInfo = <GoodsInfo>info;
        if (shopInfo) {
            return shopInfo.ItemId;
        }
        if (gInfo) {
            return gInfo.templateId;
        }
        return 0;
    }

    /**
     * 根据传进来的ShopGoodsInfo或者GoodsInfo取得Avata
     * */
    private getAvataByInfo(info: Object): string {
        let shopInfo: ShopGoodsInfo = <ShopGoodsInfo>info;
        let gInfo: GoodsInfo = <GoodsInfo>info;
        if (shopInfo) {
            let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, shopInfo.ItemId);
            return temp.Avata;
        }
        if (gInfo) {
            return gInfo.templateInfo.Avata;
        }
        return "";
    }

    public get selectedPanel(): string {
        return this._selectedPanel;
    }

    public set selectedPanel(value: string) {
        if (this._selectedPanel == value) {
            return;
        }
        this._selectedPanel = value;
        this.dispatchEvent(FashionEvent.FASHION_STORE_CHANGE, null);
    }

    public get scene(): string {
        return this._openScene;
    }

    public set scene(value: string) {
        this._openScene = value;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    /**
     * 根据时装的合成、转换、商城界面, 返回相应的数组
     * */
    public get fashionList(): GoodsInfo[] {
        let arr: GoodsInfo[] = [];
        if (this._openScene == FashionModel.FASHION_STORE_SCENE)//时装合成分解界面
        {
            if (this._selectedPanel == FashionModel.FASHION_SWITCH_PANEL) {
                arr = arr.concat(this.fashionEquipList).concat(this.fashionBagList);
            }
            else {
                arr = arr.concat(this.fashionBagList).concat(this.fashionSoulBagList).concat(this.fashionLuckyBagList)
            }
        }
        else if (this._openScene == FashionModel.SHOP_SCENE)//时装商城界面
        {
            arr = arr.concat(this.fashionEquipList).concat(this.fashionBagList);
            for (let i: number = 0; i < arr.length; i++) {
                for (let j: number = 0; j < this.showDic.getList().length; j++) {
                    if (this.showDic.getList()[j] instanceof GoodsInfo) {
                        if (arr[i] && ((arr[i] as GoodsInfo).id == this.showDic.getList()[j].id)) {
                            arr.splice(i, 1);
                            i = -1;
                        }
                    }
                }
            }
        }
        return arr;
    }

    /**
     * 相应位置是否装备了时装
     * @param sonType: 位置
     * @return 布尔值
     *
     */
    public hasFashionAtSonType(sonType: number): boolean {
        if (sonType != GoodsSonType.FASHION_WEAPON && sonType != GoodsSonType.FASHION_CLOTHES &&
            sonType != GoodsSonType.FASHION_HEADDRESS && sonType != GoodsSonType.SONTYPE_WING) {
            return false;
        }

        for (let i = 0; i < this.fashionEquipList.length; i++) {
            const info: GoodsInfo = this.fashionEquipList[i];
            if (info.templateInfo.SonType == sonType) {
                return true;
            }
        }
        return false;
    }

    /**
     * 取得已装备时装
     * */
    public get fashionEquipList(): GoodsInfo[] {
        let arr: GoodsInfo[] = [];
        let arr1: GoodsInfo[] = GoodsManager.Instance.getHeroEquipListById(this.thane.id).getList();
        for (let i = 0; i < arr1.length; i++) {
            const info: GoodsInfo = arr1[i];
            if (this.isFashion(info)) {
                arr.push(info);
            }
        }
        return arr;
    }

    /**
     * 取得背包内时装
     * */
    public get fashionBagList(): GoodsInfo[] {
        let arr: any[] = [];
        let arr1: any[] = GoodsManager.Instance.getGeneralBagEquipList();
        for (let i = 0; i < arr1.length; i++) {
            const info: GoodsInfo = arr1[i];
            if (this.isFashion(info)) {
                arr.push(info);
            }
        }
        return arr;
    }

    /**
 * 取得背包内幸运符
 * */
    public get fashionLuckyBagList() {
        let arr: GoodsInfo[] = [];
        for (let info of GoodsManager.Instance.getGoodsByGoodsTId(FashionModel.FASHION_LUCKYCHARM)) {
            if (info.bagType == BagType.Player) arr.push(info);
        }
        return arr;
    }

    /**
     * 取得背包内时装之魄
     * */
    public get fashionSoulBagList(): GoodsInfo[] {
        let arr: any[] = [];
        let arr1: GoodsInfo[] = GoodsManager.Instance.getGoodsByGoodsTId(FashionModel.FASHION_SOUL);
        for (let i = 0; i < arr1.length; i++) {
            const info: GoodsInfo = arr1[i];
            if (info.bagType == BagType.Player) {
                arr.push(info);
            }
        }
        return arr;
    }

    /**
     * 取得背包内时装之魄数量
     * */
    public get fashionSoulBagCount(): number {
        let count: number = 0;
        for (let i = 0; i < this.fashionSoulBagList.length; i++) {
            const info: GoodsInfo = this.fashionSoulBagList[i];
            count += info.count;
        }
        return count;
    }

    /**
     * 取得背包内绑定的时装之魄
     * */
    public get fashionSoulBagBindList(): GoodsInfo[] {
        let arr: any[] = [];
        for (let i = 0; i < this.fashionSoulBagList.length; i++) {
            const info: GoodsInfo = this.fashionSoulBagList[i];
            if (info.isBinds) {
                arr.push(info);
            }
        }
        return arr;
    }

    /**
     * 取得背包内绑定的时装之魄数量
     * */
    public get fashionSoulBagBindCount(): number {
        let count: number = 0;
        for (let i = 0; i < this.fashionSoulBagBindList.length; i++) {
            const info: GoodsInfo = this.fashionSoulBagBindList[i];
            count += info.count;
        }
        return count;
    }

    /**
     * 将隐藏背包物品移回去
     */
    public moveGoodsBack() {
        let arr: GoodsInfo[] = GoodsManager.Instance.getGoodsByBagType(BagType.Hide);
        for (let i = 0; i < arr.length; i++) {
            const goods: GoodsInfo = arr[i];
            PlayerManager.Instance.moveBagToBag(goods.bagType, goods.objectId, goods.pos, BagType.Player, 0, 0, 1);
        }
    }

    /**
     * 是否时装（根据GoodsInfo）
     */
    public isFashion(info: GoodsInfo): boolean {
        if (!info || !info.templateInfo) {
            return false;
        }
        if (info.templateInfo.MasterType != GoodsType.EQUIP) {
            return false;
        }
        if (info.templateInfo.SonType == GoodsSonType.FASHION_CLOTHES) {
            return true;
        }//时装衣服
        if (info.templateInfo.SonType == GoodsSonType.FASHION_HEADDRESS) {
            return true;
        }//时装帽子
        if (info.templateInfo.SonType == GoodsSonType.FASHION_WEAPON) {
            return true;
        }//时装武器
        if (info.templateInfo.SonType == GoodsSonType.SONTYPE_WING) {
            return true;
        }//时装翅膀
        return false;
    }

    /**
     * 是否时装（根据sontype）
     */
    public isFashionBySonType(sontype: number): boolean {
        if (sontype == GoodsSonType.FASHION_CLOTHES) {
            return true;
        }//时装衣服
        if (sontype == GoodsSonType.FASHION_HEADDRESS) {
            return true;
        }//时装帽子
        if (sontype == GoodsSonType.FASHION_WEAPON) {
            return true;
        }//时装武器
        if (sontype == GoodsSonType.SONTYPE_WING) {
            return true;
        }//时装翅膀
        return false;
    }

    public resetMovieclip() {
        this.opState = 0;
        this.dispatchEvent(FashionEvent.RESET_MOVIECLIP, this);
    }

    public get fashionIds(): number[] {
        return this._fashionIds;
    }

    public set fashionIds(list: number[]) {
        this._fashionIds = list;
        this._weaponTems.length = 0;
        this._clothesTems.length = 0;
        this._hatTems.length = 0;
        this._wingTems.length = 0;

        for (let i = 0; i < list.length; i++) {
            const tempid: number = list[i];
            let goodsTemp: t_s_itemtemplateData = this.getTemplateByID(tempid);
            if (!goodsTemp) {
                continue;
            }
            switch (goodsTemp.SonType) {
                case GoodsSonType.FASHION_WEAPON:
                    this._weaponTems.push(goodsTemp);
                    break;
                case GoodsSonType.FASHION_CLOTHES:
                    this._clothesTems.push(goodsTemp);
                    break;
                case GoodsSonType.FASHION_HEADDRESS:
                    this._hatTems.push(goodsTemp);
                    break;
                case GoodsSonType.SONTYPE_WING:
                    this._wingTems.push(goodsTemp);
                    break;
                default:
                    break;
            }
        }
        // this._showRedPoint = false;
        this._weaponTems = this.sortByIdentiable(this._weaponTems,0);
        this._clothesTems = this.sortByIdentiable(this._clothesTems,1);
        this._hatTems = this.sortByIdentiable(this._hatTems,2);
        this._wingTems = this.sortByIdentiable(this._wingTems,3);

        // this._weaponTems.sort(this.fashionCompareFunction.bind(this));
        // this._clothesTems.sort(this.fashionCompareFunction.bind(this));
        // this._hatTems.sort(this.fashionCompareFunction.bind(this));
        // this._wingTems.sort(this.fashionCompareFunction.bind(this));
    }

    //1、玩家不到27级时, 不显示可鉴定的红点 2、玩家金币不足时, 不显示可鉴定的红点
    public get preconditions() : boolean {
        return this.thane.grades >= 27;
    }

    /**
     * 金币有变化就要检测是否可以鉴定
     * @returns 
     */
    public checkRedDot(checkAll:boolean=false):boolean{
        if(checkAll){
            return this.checkIdentiable(this._weaponTems,0) && this.checkIdentiable(this._clothesTems,1) && this.checkIdentiable(this._hatTems,2) && this.checkIdentiable(this._wingTems,3)
        }
        if(this.checkIdentiable(this._weaponTems,0)){
            return true;
        }
        if(this.checkIdentiable(this._clothesTems,1)){
            return true;
        }
        if(this.checkIdentiable(this._hatTems,2)){
            return true;
        }
        if(this.checkIdentiable(this._wingTems,3)){
            return true;
        }
        return false;
    }

    private checkIdentiable(array:t_s_itemtemplateData[],tag:number):boolean{
        this._redPointArr[tag] = false;
        //1、优先显示可鉴定的时装, 其次为已鉴定, 最后是未鉴定；
        let arr0:t_s_itemtemplateData[] = [];//可鉴定
        array.forEach(element => {
            if(this.hasIdentityedBook(element.TemplateId) == false){//没鉴定过
                if (element.TemplateId in this.bookList) {
                    arr0.push(element);
                }
            }
        }); 
        if(arr0.length>0 && this.preconditions){
            //可鉴定的时装金币数量满不满足
            for (let j = 0; j < arr0.length; j++) {
                const element = array[j];
                let needgold = (6 - element.Property2) * 200000;
                if(ResourceManager.Instance.gold.count >= needgold){
                    this._redPointArr[tag] = true;
                    // this._showRedPoint = true;
                    return true;
                }
            }
        }
        return false;
    }
    

    private _redPointArr:Array<boolean>=[];
    
    public get redPointArr() : Array<boolean> {
        return this._redPointArr
    }
    
    private _weaponTems: t_s_itemtemplateData[] = [];
    private _clothesTems: t_s_itemtemplateData[] = [];
    private _hatTems: t_s_itemtemplateData[] = [];
    private _wingTems: t_s_itemtemplateData[] = [];

    /**
     * 筛选出所有可以鉴定的
     * @param array 
     */
    sortByIdentiable(array:t_s_itemtemplateData[],tag:number):t_s_itemtemplateData[]{
        this._redPointArr[tag] = false;
        //1、优先显示可鉴定的时装, 其次为已鉴定, 最后是未鉴定；
        let arr0:t_s_itemtemplateData[] = [];//可鉴定
        let arr1:t_s_itemtemplateData[] = [];//已鉴定
        let arr2:t_s_itemtemplateData[] = [];//不可鉴定
        array.forEach(element => {
            if(this.hasIdentityedBook(element.TemplateId) == false){//没鉴定过
                if (element.TemplateId in this.bookList) {
                    arr0.push(element);
                }else{
                    arr2.push(element);
                }
            }else{
                arr1.push(element);
            }
        });
        //2、可鉴定、已鉴定和未鉴定时装的内部排序为按照时装品质, S-A-B-C；
        arr0.sort(this.fashionCompareFunction.bind(this));
        arr1.sort(this.fashionCompareFunction.bind(this));
        arr2.sort(this.fashionCompareFunction.bind(this));
        if(arr0.length>0 && this.preconditions){
            //可鉴定的时装金币数量满不满足
            for (let j = 0; j < arr0.length; j++) {
                const element = array[j];
                let needgold = (6 - element.Property2) * 200000;
                if(ResourceManager.Instance.gold.count >= needgold){
                    this._redPointArr[tag] = true;
                    // this._showRedPoint = true;
                    break;
                }
            }
        }
        return arr0.concat(arr1.concat(arr2.concat()));
    }

    /**
     * 是否可鉴定
     */
    canIdentify(tempId:number):boolean{
        let result:boolean;
        if(this.hasIdentityedBook(tempId) == false){//没鉴定过
            if (tempId in this.bookList) {
               result = true;//可鉴定
            }else{
                result = false;//不可鉴定
            }
        }
        return result;
    }

    /**
     *  若返回值为负, 则表示 A 在排序后的序列中出现在 B 之前。
     若返回值为 0, 则表示 A 和 B 具有相同的排序顺序。
     若返回值为正, 则表示 A 在排序后的序列中出现在 B 之后
     * @param a
     * @param b
     * @return
     *
     */
    private fashionCompareFunction(a: t_s_itemtemplateData, b: t_s_itemtemplateData): number {
        if (a.TransformId < b.TransformId) {
            return -1;
        }
        else if (a.TransformId > b.TransformId) {
            return 1;
        }
        else {
            let p1: number = this.getFashionPropity(a);
            let p2: number = this.getFashionPropity(b);
            if (p1 < p2) {
                return -1;
            }
            else if (p1 > p2) {
                return 1;
            }
            else {
                if (a.TemplateId > b.TemplateId) {
                    return -1;
                }
                else if (a.TemplateId < b.TemplateId) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }
    }

    private getFashionPropity(a: t_s_itemtemplateData): number {
        let p: number = 3;
        if (a.Property4 == 0) {
            p = 1;
        }
        else if (a.Property4 == 2) {
            p = 2;
        }
        else {
            p = 3;
        }
        return p;
    }

    public get newFashionDic(): Dictionary {
        let dic: Dictionary = new Dictionary();
        dic["weapon"] = 0;
        dic["clothes"] = 0;
        dic["hat"] = 0;
        dic["wing"] = 0;
        let goodsTemp: t_s_itemtemplateData;
        for (const key in this.bookList) {
            if (this.bookList.hasOwnProperty(key) && !key.startsWith("__")) {
                if (this.bookList[key] == false) {
                    goodsTemp = this.getTemplateByID(Number(key));
                    if (goodsTemp.SonType == GoodsSonType.FASHION_CLOTHES) {
                        dic["clothes"]++;
                    }//时装衣服
                    if (goodsTemp.SonType == GoodsSonType.FASHION_HEADDRESS) {
                        dic["hat"]++;
                    }//时装帽子
                    if (goodsTemp.SonType == GoodsSonType.FASHION_WEAPON) {
                        dic["weapon"]++;
                    }//时装武器
                    if (goodsTemp.SonType == GoodsSonType.SONTYPE_WING) {
                        dic["wing"]++;
                    }//时装翅膀
                }
            }
        }
        return dic;
    }

    private getTemplateByID(id: number): t_s_itemtemplateData {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, id);
    }

    public get weaponTems(): t_s_itemtemplateData[] {
        return this._weaponTems;
    }

    public get clothesTems(): t_s_itemtemplateData[] {
        return this._clothesTems;
    }

    public get hatTems(): t_s_itemtemplateData[] {
        return this._hatTems;
    }

    public get wingTems(): t_s_itemtemplateData[] {
        return this._wingTems;
    }

    public get bookList(): Dictionary {
        if (this._bookList == null) {
            this._bookList = new Dictionary();
        }
        return this._bookList;
    }

    public get newFashionCount(): number {
        let count: number = 0;
        for (const key in this.bookList) {
            if (this.bookList.hasOwnProperty(key) && !key.startsWith("__")) {
                if (this.bookList[key] == false) {
                    count += 1;
                }
            }
        }
        return count;
    }

    public get saveList(): Dictionary {
        if (this._saveList == null) {
            this._saveList = new Dictionary();
        }
        return this._saveList;
    }

    public isInSaveList(temId: number): boolean {
        let b: boolean = false;
        for (const key in this.saveList) {
            if (this.saveList.hasOwnProperty(key) && !key.startsWith("__")) {
                if (this.saveList[key] == temId) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取鉴定时装消耗的黄金的数量
     * @param tempId
     * @return
     *
     */
    public getCountForIdentityBook(temp: t_s_itemtemplateData): number {
        return temp.Property1;
    }

    /**
     * 获取洗练时装消耗的时装之魄的数量
     * @param tempId
     * @return
     *
     */
    public getCountForRefresh(temp: t_s_itemtemplateData): number {
        return temp.Property2;
    }

    /**
     * 鉴定成功率
     * @return
     *
     */
    public getSuccessRateForIdentityBook(temp: t_s_itemtemplateData): number {
        let rate: any[] = [0, 20, 30, 40, 50, 60];
        return rate[temp.TransformId];
    }

    /**
     * 获得时装鉴定对应的技能 (力量+99)
     * @param temp
     * @return
     *
     */
    public getFashionObjectSkillTemplate(temp: t_s_itemtemplateData): t_s_skilltemplateData {
        let skillInfo: t_s_skilltemplateData;
        for (let i = 0; i < this.identityedList.length; i++) {
            const info: FashionInfo = this.identityedList[i];
            if (temp && info.fashionTempId == temp.TemplateId) {
                skillInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, info.appraisalSkill);
            }
        }
        return skillInfo;
    }

    /**
     * 判断是否已经鉴定过
     * @param tempid
     * @return
     *
     */
    public hasIdentityedBook(tempid: number): boolean {
        for (let i = 0; i < this.identityedList.length; i++) {
            const info: FashionInfo = this.identityedList[i];
            if (info.fashionTempId == tempid) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断是否已鉴定/洗练到最高级
     * @param tempid
     */
    public hasRefreshFull(tempid: number): boolean {
        for (let i = 0; i < this.identityedList.length; i++) {
            const info: FashionInfo = this.identityedList[i];
            if (info.fashionTempId == tempid) {
                let skillTemp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, info.appraisalSkill);
                if (skillTemp && skillTemp.Grades == 5) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    /**
     * 力量 护甲 智力 体质
     * @return
     *
     */
    public getIdentityedProperties(): any[] {
        let result: any[] = [0, 0, 0, 0];
        for (let i = 0; i < this.identityedList.length; i++) {
            const info: FashionInfo = this.identityedList[i];
            let goods: t_s_itemtemplateData = this.getTemplateByID(info.fashionTempId);
            if (!goods) {
                continue;
            }
            let skillPropTemp: t_s_skillpropertytemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillpropertytemplate, info.appraisalSkill);
            if (!skillPropTemp) {
                continue;
            }
            result[0] += skillPropTemp.Power;
            result[1] += skillPropTemp.Agility;
            result[2] += skillPropTemp.Intellect;
            result[3] += skillPropTemp.Physique;
        }
        return result;
    }

    /**
     * 根据GoodsInfo获得时装的等级
     * */
    public getFashionLevelByInfo(info: GoodsInfo): number {
        if (!info) {
            return 0;
        }
        if (info.templateId == FashionModel.FASHION_SOUL) {
            return 1;
        }
        let skillId: number = info.randomSkill1;
        if (!ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, skillId)) {
            skillId = Number(info.templateInfo.DefaultSkill.split(",")[0]);
        }
        let cfg = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, skillId);
        if(cfg){
           return cfg.Grades;
        }
        return 0;
    }

}