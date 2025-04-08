// @ts-nocheck
import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import LangManager from '../../core/lang/LangManager';
import UIManager from '../../core/ui/UIManager';
import { ArrayConstant, ArrayUtils } from '../../core/utils/ArrayUtils';
import { SimpleDictionary } from '../../core/utils/SimpleDictionary';
import FightingType from '../constant/FightingType';
import GTabIndex from '../constant/GTabIndex';
import { EmWindow } from '../constant/UIDefine';
import { GoodsInfo } from '../datas/goods/GoodsInfo';
import { PlayerInfo } from '../datas/playerinfo/PlayerInfo';
import { ThaneInfo } from '../datas/playerinfo/ThaneInfo';
import { SkillInfo } from '../datas/SkillInfo';
import { MountInfo } from '../module/mount/model/MountInfo';
import { PetData } from '../module/pet/data/PetData';
import FightIngModel from '../mvc/model/FightIngModel';
import { SwitchPageHelp } from '../utils/SwitchPageHelp';
import { ArmyManager } from './ArmyManager';
import { GoodsManager } from './GoodsManager';
import { MessageTipManager } from './MessageTipManager';
import { MountsManager } from './MountsManager';
import { PlayerManager } from './PlayerManager';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { JobType } from '../constant/JobType';
import { TempleteManager } from './TempleteManager';
import { t_s_skilltemplateData } from '../config/t_s_skilltemplate';
import { t_s_skillpropertytemplateData } from '../config/t_s_skillpropertytemplate';
import FightCondtionType from '../constant/FightCondtionType';
import { PropertyInfo } from '../module/mount/model/PropertyInfo';
import t_s_value, { t_s_valueData } from '../config/t_s_value';
import { StarManager } from './StarManager';
import { t_s_itemtemplateData } from '../config/t_s_itemtemplate';
import ComponentSetting from '../utils/ComponentSetting';
import { NotificationManager } from './NotificationManager';
import { BAG_EVENT } from '../constant/event/NotificationEvent';
import OpenGrades from '../constant/OpenGrades';
import Logger from '../../core/logger/Logger';
import { BuildInfo } from '../map/castle/data/BuildInfo';
import BuildingType from '../map/castle/consant/BuildingType';
import BuildingManager from '../map/castle/BuildingManager';
import { MasterTypes } from '../map/castle/data/MasterTypes';
import { PlayerModel } from '../datas/playerinfo/PlayerModel';
import { StarBagType } from '../constant/StarDefine';
import { ConsortiaInfo } from '../module/consortia/data/ConsortiaInfo';
import { ConsortiaControler } from '../module/consortia/control/ConsortiaControler';
import { ConsortiaModel } from '../module/consortia/model/ConsortiaModel';
import { ConsortiaTempleteInfo } from '../module/consortia/data/ConsortiaTempleteInfo';
import GoodsSonType from '../constant/GoodsSonType';
import { t_s_pawntemplateData } from '../config/t_s_pawntemplate';
import FirstPayModel from '../module/firstpay/FirstPayModel';
import FirstPayManager from './FirstPayManager';
/**
* @author:pzlricky
* @data: 2021-06-08 09:37
* @description *** 
*/
export default class FightingManager extends GameEventDispatcher {

    private static _Instance: FightingManager;

    // 公会技能&科技(FightingType.F_CONSORTIATETECHNOLOGY)暂不使用
    public get levelList() {
        return [OpenGrades.INTENSIFY, OpenGrades.INSERT, OpenGrades.TALENT, OpenGrades.STAR, OpenGrades.PET, OpenGrades.INVALID, OpenGrades.MOUNT]
    }

    private needGemArr: Array<number> = [1, 4, 16, 64, 256, 1024, 4096, 16384, 49152, 147456, 294912, 589824];

    private list: Array<any>;

    /** 最差的强化装备 */
    public worstStrengEquip: GoodsInfo;
    /** 最差的洗练装备 */
    public worstRefreshEquip: GoodsInfo;
    /** 最差洗练装备是否有最优属性 */
    public worstEquipHasBestPro: boolean;
    /** 最差洗练装备是否有护甲&体质属性 */
    public worstEquipHasgoodPro: boolean;
    /** 镶嵌最差宝石的装备 */
    public worstGemEquip: GoodsInfo;

    public showEquipDesc: string = "";
    public showGemDesc: string = "";
    public showPetDesc: string = "";
    public showTalentDesc: string = "";
    public showStarDesc: string = "";
    public showMountDesc: string = "";

    public equipFun: Function;
    public gemFun: Function;
    public petFun: Function;
    public talentFun: Function;
    public starFun: Function;
    public mountFun: Function;
    public static FIRST_GRADE: number = 1;
    public static SECOND_GRADE: number = 2;
    public static THIRD_GRADE: number = 3;
    public static FOUR_GRADE: number = 4;
    public showTipDesc: string = "";
    public openPetWndFlag: boolean = false;
    private _dataList:Array<FightIngModel> = [];
    public static get Instance(): FightingManager {
        if (!this._Instance) this._Instance = new FightingManager();
        return this._Instance;
    }

    
    public get dataList() : Array<FightIngModel> {
        this.initDataList();
        return this._dataList;
    }
    
    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
    
    private get isFirstChargeOpen(): boolean {
        let flag: boolean = true;

        if (this.thane.grades < OpenGrades.FIRST_PAY) {
            flag = false;
        } else if (this.thane.grades >= OpenGrades.FIRST_PAY) {
            if (this.playerInfo.isFirstCharge
                && FirstPayManager.Instance.model.state1 == FirstPayModel.HAS_GETED
                && FirstPayManager.Instance.model.state2 == FirstPayModel.HAS_GETED
                && FirstPayManager.Instance.model.state3 == FirstPayModel.HAS_GETED) {
                flag = false;
            }
        }

        if (this.thane.grades < OpenGrades.SHOP) {
            flag = false
        }
        return flag;
    }


    private initDataList(){
        this._dataList = [];
        let level = ArmyManager.Instance.thane.grades;
        //首充礼包，点击打开首充界面。若已充值并领取完，则不提示
        if(this.isFirstChargeOpen){
            let item: FightIngModel = new FightIngModel();
            item.type = FightingType.F_CHARGE;
            this._dataList.push(item);
        }
        //1、强化装备, 点击打开铁匠铺界面。若武器和衣服强化均高于5, 则不提示
        if(level >= OpenGrades.INTENSIFY){
            let grade0 = FightingManager.Instance.getHeroEquipStrenGrade(GoodsSonType.SONTYPE_WEAPON);
            let grade1 = FightingManager.Instance.getHeroEquipStrenGrade(GoodsSonType.SONTYPE_CLOTHES);
            if(grade0 < 5 || grade1 < 5){
                let item: FightIngModel = new FightIngModel();
                item.type = FightingType.F_EQUIP;
                this._dataList.push(item);
            }
        }
       
        //2、升级士兵, 点击打开兵营界面。若当前携带士兵等级高于20级, 则不提示
        if(level >= OpenGrades.ARMY){
            let armyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
            if (armyPawn && armyPawn.templateInfo) {
                let temp: t_s_pawntemplateData = armyPawn.templateInfo;
                let pawnLevel = temp.Level
                if (pawnLevel < 20) {
                    let item: FightIngModel = new FightIngModel();
                    item.type = FightingType.F_PAWN;
                    this._dataList.push(item);
                }
            }
        }
       
        if(level >= OpenGrades.SEMINARY){
            if(FightingManager.Instance.checkSeminary()){
                let item: FightIngModel = new FightIngModel();
                item.type = FightingType.F_TECHNOLOGY;
                this._dataList.push(item);
            }
        }
       
        if(level >= OpenGrades.CONSORTIA){
            if(FightingManager.Instance.checkGuildLevel()){
                let item: FightIngModel = new FightIngModel();
                item.type = FightingType.F_CONSORTIATETECHNOLOGY;
                this._dataList.push(item);
            }
        }
       
        if(level >= OpenGrades.STAR){
            if(FightingManager.Instance.checkStarLevel()){
                let item: FightIngModel = new FightIngModel();
                item.type = FightingType.F_START;
                this._dataList.push(item);
            }
        }
    
    }

    /** 跳转到打来品质说明界面 */
    public qualityDescFun() {
        SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_HC_ZB);
    }

    /** 链接到装备提升界面 */
    public strengEquipfun() {
        var str: string;
        if (this.getAllHeroEquip().length <= 0) {
            str = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotEquip");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(str);
            return
        }
        if (this.worstStrengEquip) {
            SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_QH);
        }
        else {
            str = LangManager.Instance.GetTranslation("fighting.FightingItem.equipnotStreng");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(str);
        }
    }
    /** 链接到装备洗练 */
    public refreshEquipFun() {
        if (this.getAllHeroEquip().length <= 0) {
            var str: string = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotEquip");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(str);
            return
        }
        if (this.worstRefreshEquip) {
            SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_XL);
        }
    }
    /** 装备镶嵌界面 */
    public gemgotoFun() {
        if (this.getAllHeroEquip().length <= 0) {
            var str: string = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotEquip");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(str);
            return
        }
        if (this.worstGemEquip) {
            SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_XQ);
        }
    }

    /** 没有英灵 */
    public notHavePet() {
        if (PlayerManager.Instance.currentPlayerModel.petSystemIsOpened) {
            var _str: string = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotPet");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(_str);
        }
        else {
            var str: string = LangManager.Instance.GetTranslation("fighting.FightingItem.petNotOpen");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(str);
        }
    }
    /** 灵魂刻印 */
    public markinggotoFun() {
        NotificationManager.Instance.dispatchEvent(BAG_EVENT.JEWEL);
        FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { openJewel: true });
    }
    /** 宠物品质提升 */
    public toPetadvanceBtn() {
        FrameCtrlManager.Instance.open(EmWindow.Pet, { tabIndex: GTabIndex.Pet_AttrAdvance });
        FightingManager.Instance.openPetWndFlag = true;
    }
    /** 宠物资质提升 */
    public toPetstrength() {
        if (PlayerManager.Instance.currentPlayerModel.petSystemIsOpened) {
            FrameCtrlManager.Instance.open(EmWindow.Pet, { tabIndex: GTabIndex.Pet_AttrIntensify });
            FightingManager.Instance.openPetWndFlag = true;
        }
        else {
            var str: string = LangManager.Instance.GetTranslation("fighting.FightingItem.petNotOpen");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(str);
        }
    }

    /** 宠物技能 */
    public topetSkill() {
        if (PlayerManager.Instance.currentPlayerModel.petSystemIsOpened) {
            FrameCtrlManager.Instance.open(EmWindow.Pet, { tabIndex: GTabIndex.Pet_Skill });
            FightingManager.Instance.openPetWndFlag = true;
        }
        else {
            var str: string = LangManager.Instance.GetTranslation("fighting.FightingItem.petNotOpen");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(str);
        }
    }

    /** 技能天赋界面 */
    public toRunnerSkill() {
        if (PlayerManager.Instance.currentPlayerModel.petSystemIsOpened) {
            SwitchPageHelp.gotoMarkingSkill();
        }
        else {
            var str: string = LangManager.Instance.GetTranslation("fighting.FightingItem.petNotOpen");// "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(str);
        }
    }

    /** 坐骑界面 */
    public toMount() {
        FrameCtrlManager.Instance.open(EmWindow.MountsWnd);
    }

    /** 星运界面 */
    public tostar() {
        FrameCtrlManager.Instance.open(EmWindow.Star);
    }

    /** 获取装备的总体评分 */
    public getEquipScore(): number {
        var strengScore: number = this.getEquipStrengScore();
        var refreshScore: number = this.getEquipRefreshScore();
        var qualityScore: number = this.getEquipQualityScore();
        var equipScore: number = 0;
        var level: number = this.thaneInfo.grades;
        if (level >= 1 && level < 10)  //开放了装备品质
        {
            equipScore = qualityScore;
            var qualityIndex: number = this.getIndexByScore(qualityScore);
            this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction3_" + qualityIndex);
            this.equipFun = this.qualityDescFun;//跳转到打来品质说明界面
        }
        else if (level >= 10 && level < 19) //开放了 装备品质 	 强化 
        {
            equipScore = (qualityScore + strengScore) / 2;

            var scoreIndex: number = 0;
            if (strengScore < 100) {
                if (this.getAllHeroEquip().length > 0)  //没有穿戴装备
                {
                    scoreIndex = this.getIndexByScore(strengScore); //强化级别
                    switch (scoreIndex) {
                        case FightingManager.FIRST_GRADE:
                        case FightingManager.SECOND_GRADE:
                        case FightingManager.THIRD_GRADE:
                            this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction1_1"); //"装备强化可以大幅提高战力";
                            break;
                        case FightingManager.FOUR_GRADE:
                            this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction1_4");//装备强化已达到上限
                            break;
                    }
                }
                else {
                    this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotEquip") //请穿戴合适等级的装备";
                }
                this.equipFun = this.strengEquipfun;	 //链接到装备提升
            }
            else if (qualityScore < 100) {
                if (this.getAllHeroEquip().length > 0)  //没有穿戴装备
                {
                    scoreIndex = this.getIndexByScore(refreshScore);
                    this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction3_" + scoreIndex);
                }
                else {
                    this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotEquip") //请穿戴合适等级的装备";
                }
                this.equipFun = this.qualityDescFun; //链接到品质说明
            }
            else {
                this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.EquipIsGood");
            }
        }
        else if (level >= 19) //开放了 装备品质  强化  洗练
        {

            equipScore = (qualityScore + strengScore + refreshScore) / 3;

            if (strengScore < 100) {
                if (this.getAllHeroEquip().length > 0)  //没有穿戴装备
                {
                    var strengIndex: number = this.getIndexByScore(strengScore);
                    switch (strengIndex) {
                        case FightingManager.FIRST_GRADE:
                        case FightingManager.SECOND_GRADE:
                        case FightingManager.THIRD_GRADE:
                            this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction1_1"); //"装备强化可以大幅提高战力";
                            break;
                        case FightingManager.FOUR_GRADE:
                            this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction1_4");//装备强化已达到上限
                            break;
                    }
                }
                else {
                    this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotEquip") //请穿戴合适等级的装备";
                }
                this.equipFun = this.strengEquipfun	 //链接到装备提升
            }
            else if (refreshScore < 80) {
                if (this.getAllHeroEquip().length > 0) {
                    var refreshIndex: number = this.getIndexByScore(refreshScore);
                    this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction2_" + refreshIndex); //"洗练可以获得更合适的装备属性";
                }
                else {
                    this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotEquip") //请穿戴合适等级的装备";
                }

                this.equipFun = this.refreshEquipFun //链接到装备洗练
            }
            else if (qualityScore < 100) {

                if (this.getAllHeroEquip().length > 0)  //没有穿戴装备
                {
                    var index: number = this.getIndexByScore(refreshScore);
                    this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction3_" + index);
                }
                else {
                    this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotEquip") //请穿戴合适等级的装备";
                }
                this.equipFun = this.qualityDescFun //链接到品质说明
            }
            else {
                this.showEquipDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.EquipIsGood");
            }
        }

        this.showTipDesc = this.showEquipDesc;
        equipScore = parseInt(equipScore.toString());
        return equipScore;
    }
    /** 获取装备强化积分 */
    public getEquipStrengScore(): number {
        var equipArr: Array<any> = this.getAllHeroEquip();
        var goods: GoodsInfo;
        var minScore: number = 100;
        var currScore: number = 0;
        var len: number = equipArr.length;
        if (len <= 0) {
            minScore = 0;
            this.worstStrengEquip = null;
        }
        for (var i: number = 0; i < len; i++) {
            goods = equipArr[i] as GoodsInfo;
            var num: number = goods.strengthenGrade / goods.templateInfo.StrengthenMax;
            var num2: number = Math.pow(num, 10);
            currScore = parseInt((100 * num2).toString());
            if (minScore > currScore) {
                minScore = currScore;
                this.worstStrengEquip = goods;
            }
        }
        if (minScore < 10) minScore = 10;
        return minScore;
    }

    /** 获取装备洗练积分 */
    public getEquipRefreshScore(): number {
        var equipArr: Array<any> = this.getAllHeroEquip();
        var len: number = equipArr.length;
        var goods: GoodsInfo;
        var minScore: number = 100;
        if (len <= 0) //没有穿戴装备
        {
            minScore = 0;
            this.worstRefreshEquip = null;
            return 0;
        }
        for (var i: number = 0; i < len; i++) {
            goods = equipArr[i] as GoodsInfo;
            var job: number = this.thaneInfo.templateInfo.Job;
            var hasBesePro: boolean = false; //是否有最优属性
            var hasPhysiquePro: boolean = false;     //是否有体质属性
            var hasArmor: boolean = false; //是否有护甲属性 
            var currScore: number = 0;
            var proScore: number = 50; //属性分
            var levelScore: number = 0; //洗练星级分
            for (var j: number = 1; j < 6; j++) {
                let skillId = goods["randomSkill" + j]
                if (skillId > 0) {
                    var temp: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(skillId);
                    if (!temp) {
                        Logger.warn("[FightingManager]技能模板不存在", skillId)
                        continue
                    }
                    var skillProtemp: t_s_skillpropertytemplateData = TempleteManager.Instance.getSkillPropertyTemplateCate(temp.TemplateId);
                    if (job == JobType.HUNTER || job == JobType.WARRIOR)  //战士和射手
                    {
                        if (skillProtemp.Power > 0) {
                            hasBesePro = true;
                        }
                    }
                    else if (job == JobType.WIZARD) //法师
                    {
                        if (skillProtemp.Intellect > 0) {
                            hasBesePro = true;
                        }
                    }
                    if (skillProtemp.Physique) //体质
                    {
                        hasPhysiquePro = true;
                    }

                    if (skillProtemp.Agility) //敏捷
                    {
                        hasArmor = true;
                    }
                    levelScore += temp.Grades;     //当前的洗练等级
                }
            }

            if (!hasBesePro) {
                proScore -= 25;
            }
            if (!hasPhysiquePro || !hasArmor) {
                proScore -= 25;
            }
            currScore = proScore + levelScore;

            if (minScore >= currScore) {
                minScore = currScore;
                this.worstRefreshEquip = goods;
                this.worstEquipHasBestPro = hasBesePro;
                this.worstEquipHasgoodPro = (hasPhysiquePro && hasArmor);
            }
        }
        return minScore;
    }
    /** 获取装备品质积分 */
    public getEquipQualityScore(): number {
        var equipArr: Array<any> = this.getAllHeroEquip();
        var len: number = equipArr.length;
        if (len <= 0) {
            return 0;
        }
        var goods: GoodsInfo;
        var playerLevel: number = this.thaneInfo.grades;
        var score: number = 0; //装备品质评分
        for (var i: number = 0; i < len; i++) {
            goods = equipArr[i] as GoodsInfo;
            var suiteId: number = goods.templateInfo.SuiteId;    //装备的套装ID;
            var needLv: number = goods.templateInfo.NeedGrades; //装备穿戴的最小等级
            var quality: number = goods.templateInfo.Profile;    //装备品质
            score += this.getSimpleEquipScore(playerLevel, needLv, suiteId, quality);
        }
        if (score == 96) {
            score = 100;
        }
        return score;
    }

    /** 判断单件装备的评分  lv1为人物当前等级  ,  lv2为装备等级,   suiteId 为装备套装ID*/
    public getSimpleEquipScore(lv1: number, lv2: number, suiteId: number, quality: number): number {
        if (suiteId <= 0)  //非套装
        {
            return 4;
        }
        else  //套装
        {
            if (lv2 % 10 == 0) //非竞技装
            {
                if (quality == 5) //史诗套装
                {
                    var count: number = parseInt((lv1 / 10).toString()) - parseInt((lv2 / 10).toString());
                    switch (count) {
                        case 0:
                            return 12;
                            break;
                        case 1:
                            return 8;
                            break
                        default:
                            return 4;
                            break;
                    }
                    return 12;
                }
                else if (quality == 4)  //副本套装
                {
                    var count2: number = parseInt((lv1 / 10).toString()) - parseInt((lv2 / 10).toString());
                    switch (count2) {
                        case 0:
                            return 9;
                            break;
                        case 1:
                            return 6;
                            break;
                        default:
                            return 4;
                            break
                    }
                }
            }
            else if (lv2 % 10 == 5) //竞技装
            {
                var lv3: number = lv1 % 10;
                var count3: number = parseInt((lv1 / 10).toString()) - parseInt((lv2 / 10).toString());
                if (lv3 >= 5) {
                    switch (count3) {
                        case 0:
                            return 7;
                            break;
                        case 1:
                            return 5;
                            break;
                        default:
                            return 4;
                            break;
                    }
                }
                else if (lv3 < 5) {
                    switch (count3) {
                        case 0:
                            return -1000; //不可能存在
                            break;
                        case 1:
                            return 7;
                            break;
                        case 2:
                            return 5;
                            break;
                        default:
                            return 4;
                            break;
                    }
                }
            }
        }

        return 4;
    }

    public getAllHeroEquip(): Array<GoodsInfo> {
        var arr: Array<GoodsInfo> = new Array();
        var equipDic: SimpleDictionary = GoodsManager.Instance.getHeroEquipListById(this.thaneInfo.id);
        for (const key in equipDic) {
            if (Object.prototype.hasOwnProperty.call(equipDic, key)) {
                var goods: GoodsInfo = equipDic[key];
                if (goods && goods.templateInfo &&
                    (goods.templateInfo.SonType == 101 ||
                        goods.templateInfo.SonType == 103 ||
                        goods.templateInfo.SonType == 104 ||
                        goods.templateInfo.SonType == 106 ||
                        goods.templateInfo.SonType == 107 ||
                        goods.templateInfo.SonType == 108
                    )) {//装备 
                    arr.push(goods);
                }
            }
        }
        return arr;
    }
    /**
     * 根据子类型获取身上装备的强化等级
     * @param sontype 
     * @returns 
     */
    public getHeroEquipStrenGrade(sontype:number):number{
        var equipDic: SimpleDictionary = GoodsManager.Instance.getHeroEquipListById(this.thaneInfo.id);
        for (const key in equipDic) {
            if (Object.prototype.hasOwnProperty.call(equipDic, key)){
                var goods: GoodsInfo = equipDic[key];
                if (goods && goods.templateInfo && goods.templateInfo.SonType == sontype)
                {//装备 
                    return goods.strengthenGrade;
                }
            }
        }
        return 0;
    }

    /** 获取英灵的总体评分 */
    public getPetScore(): number {
        var petQualityScore: number = this.getPetQualityScore();
        var QualificationScore: number = this.getQualificationScore();
        var petSkillScore: number = this.getPetSkillScore();
        var level: number = this.thaneInfo.grades;
        var score: number = 0;
        if (!this.getCurrPet()) {
            this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.hasNotPet");//没有出战英灵";
            this.showTipDesc = this.showPetDesc;
            this.petFun = this.notHavePet;
            return 0;
        }
        if (level < 55)  //开放了英灵品质 ,  资质
        {
            score = (petQualityScore + QualificationScore) / 2;
            var index: number = 0;
            if (petQualityScore <= QualificationScore) {
                index = this.getIndexByScore(petQualityScore);
                this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction10_" + petQualityScore);
                this.petFun = this.toPetadvanceBtn; //跳转到英灵提升品质
            }
            else {
                index = this.getIndexByScore(QualificationScore);
                this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction11_" + index);
                this.petFun = this.toPetstrength; //跳转到英灵提升资质

            }
        }
        else //开放了英灵 品质 资质 技能  
        {
            score = (petQualityScore + QualificationScore + petSkillScore) / 3;
            if (petQualityScore <= QualificationScore && petQualityScore <= petSkillScore) {
                switch (petQualityScore) {
                    case 20:
                        this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction10_20");
                        break;
                    case 40:
                        this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction10_40");
                        break;
                    case 60:
                        this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction10_60");
                        break;
                    case 80:
                        this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction10_80");
                        break;
                    case 100:
                        this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction10_100");
                        break;
                }
                this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction10_" + petQualityScore);
                this.petFun = this.toPetadvanceBtn; //跳转到英灵提升品质
            }
            else if (QualificationScore <= petQualityScore && QualificationScore <= petSkillScore) {
                index = this.getIndexByScore(QualificationScore);
                this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction11_" + index);
                this.petFun = this.toPetstrength; //跳转到英灵提升资质
            }
            else if (petSkillScore <= petQualityScore && petSkillScore <= QualificationScore) {
                if (petSkillScore < 100 && petSkillScore >= 80) {
                    this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction12_2");//"建议学习更多英灵技能"
                }
                else if (petSkillScore < 80) {
                    this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction12_1");//"建议学习更多英灵技能"
                }
                else if (petSkillScore == 100) {
                    this.showPetDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction12_3");
                }
                this.petFun = this.topetSkill; //跳转到英灵技能资质
            }
        }

        this.showTipDesc = this.showPetDesc;
        score = parseInt(score.toString());
        return score
    }
    /** 获取英灵品质评分 */
    public getPetQualityScore(): number {
        if (!this.getCurrPet()) {
            return 0;
        }
        var quality: number = this.getCurrPet().quality;
        return quality * 20;
    }
    /** 获取英灵资评分 */
    public getQualificationScore(): number {
        var petdata: PetData = this.getCurrPet();
        if (!petdata || !petdata.template) {
            return 0;
        }
        var pettype: number = petdata.template.PetType;
        var currValue: number = 0;
        var arr: Array<any> = TempleteManager.Instance.getValueArrByType(FightCondtionType.PET);
        var paramA: number = 0;
        var paramB: number = 0;
        var paramC: number = 0;
        if (pettype == 104 || pettype == 101 || pettype == 105) //物理宠物
        {
            currValue = petdata.coeStrength + petdata.coeStamina + petdata.coeArmor;
        }
        else if (pettype == 102 || pettype == 106 || pettype == 103) //智力宠物
        {
            currValue = petdata.coeIntellect + petdata.coeStamina + petdata.coeArmor;
        }
        for (var i: number = 0; i < arr.length; i++) {
            var guideinfo: t_s_valueData = arr[i];
            if (this.getCurrPet().quality == guideinfo.Parameter1) {
                paramA = guideinfo.Parameter2;
                paramB = guideinfo.Parameter3;
                paramC = guideinfo.Parameter4;
                break;
            }
        }


        if (currValue < paramA) {
            return parseInt(((currValue / paramA) * 60).toString());
        }
        else if (currValue >= paramA && currValue < paramB) {
            return parseInt((60 + (currValue - paramA) / (paramB - paramA) * 20).toString())
        }
        else if (currValue >= paramB && currValue < paramC) {
            return parseInt((80 + (currValue - paramB) / (paramC - paramB) * 20).toString());
        }
        else if (currValue >= paramC) {
            return 100;
        }
    }
    /** 获取英灵技能评分 */
    public getPetSkillScore(): number {
        var pData: PetData = this.getCurrPet();
        if (!pData) {
            return 0;
        }
        var skillArr1: Array<any> = pData.activeSkillList; //主动技能
        var skillArr2: Array<any> = pData.passiveSkillList; //跟随技能
        var hasLength: number = skillArr1.length + skillArr2.length; //拥有技能的总数
        switch (hasLength) {
            case 4:
                return 60;
                break;
            case 5:
                return 70;
                break;
            case 6:
                return 80;
                break;
            case 7:
                return 90;
                break;
            case 8:
                return 100;
                break;
        }
        return -1;
    }

    public getCurrPet(): PetData {
        return this.thaneInfo.enterWarPet;
    }

    /** 获取公会科技的总体评分 */
    public getConsortiaTechnologyScore(): number {
        return 10;
    }

    /** 获取宝石的灵魂刻印总体评分 */
    public getGemAndMarkingScore(): number {
        var level: number = this.thaneInfo.grades;
        var gemScore: number = this.getGemScore();
        var markingScore: number = this.getMarkingScore();
        var score: number = 0;
        if (level < 35) //未开放灵魂刻印
        {
            score = gemScore;
            var index: number = this.getIndexByScore(score);
            this.showGemDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction4_" + index);
            this.gemFun = this.gemgotoFun// 跳转到宝石镶嵌
        }
        else  //开放了镶嵌, 灵魂刻印
        {
            score = (gemScore + markingScore) / 2;
            if (gemScore <= markingScore) {
                var getIndex: number = this.getIndexByScore(gemScore);
                this.showGemDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction4_" + getIndex);
                this.gemFun = this.gemgotoFun;// 跳转到宝石镶嵌
            }
            else {
                var markingIndex: number = this.getIndexByScore(markingScore);
                this.showGemDesc = LangManager.Instance.GetTranslation("");
                this.showGemDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction5_" + markingIndex);
                this.gemFun = this.markinggotoFun; //跳转到灵魂刻印界面
            }
        }
        this.showTipDesc = this.showGemDesc;
        score = score >> 0;
        return score;
    }

    /** 获取宝石评分 */
    public getGemScore(): number {
        var equipArr: Array<GoodsInfo> = this.getAllHeroEquip();
        var len: number = equipArr.length;
        var minNum: number = 10000000; //某一颗宝石的最低数 
        var goods: GoodsInfo;
        var gemNum: number = 0;//1级宝石的数量
        var allNum: number = 0;
        var score: number = 0;
        allNum = this.getMaxGemNum(this.thaneInfo.grades);
        if (len <= 0) {
            this.worstGemEquip = null;
            return 0;
        }
        var isNotFull: boolean = false;
        for (var i: number = 0; i < len; i++) {
            goods = equipArr[i] as GoodsInfo;
            if (goods.templateInfo.Profile == 5) {
                if (goods.join1 <= 0 || goods.join2 <= 0 || goods.join3 <= 0 || goods.join4 <= 0) {
                    this.worstGemEquip = goods;
                    isNotFull = true;
                }
            }
            else {
                if (goods.join1 <= 0 || goods.join2 <= 0 || goods.join3 <= 0) {
                    this.worstGemEquip = goods;
                    isNotFull = true;
                }
            }
            for (var j: number = 1; j <= 4; j++) {
                var gemId: number = goods["join" + j];
                if (gemId > 0) {
                    var gemGoods: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(gemId);
                    var gemLv: number = gemGoods.TransformId;
                    gemNum += this.needGemArr[gemLv - 1];
                    if (!isNotFull) {
                        if (minNum >= this.needGemArr[gemLv - 1]) {
                            minNum = this.needGemArr[gemLv - 1];
                            this.worstGemEquip = goods;
                        }
                    }
                }
            }
        }
        //gemNum<=0会出现无穷数。Math.log(4) 换成1.386, 减少浮点计算。>>0 去除小数。
        if (gemNum <= 0) gemNum = 0.1;
        score = (20 * (Math.log(gemNum / allNum) / 1.386) + 60) >> 0;
        if (score > 95) {
            score = 95;
        }
        if (score < 10) {
            score = 10;
        }
        return score;
    }

    public getMaxGemNum(level: number): number {
        var arr: Array<any> = TempleteManager.Instance.getValueArrByType(FightCondtionType.GEM);
        var len: number = arr.length;
        for (var i: number = 0; i < len; i++) {
            var guideInfo: t_s_valueData = arr[i];
            if (level >= guideInfo.MinLv && level <= guideInfo.MaxLv) {
                return guideInfo.Parameter1;
            }
        }
    }

    /** 获取刻印评分 */
    public getMarkingScore(): number {
        var level: number = this.thaneInfo.grades;
        var arr: Array<any> = TempleteManager.Instance.getValueArrByType(FightCondtionType.SOUL);
        var paramA: number = 0;
        var paramB: number = 0;
        var paramC: number = 0;
        var currLevel: number = this.thaneInfo.jewelGrades; //当前灵魂刻印等级
        for (var i: number = 0; i < arr.length; i++) {
            var guideinfo: t_s_valueData = arr[i];
            if (guideinfo.MaxLv == level) {
                paramA = guideinfo.Parameter1;
                paramB = guideinfo.Parameter2;
                paramC = guideinfo.Parameter3;
                break;
            }
        }
        if (currLevel < paramA) {
            return parseInt(((currLevel / paramA) * 60).toString());
        }
        else if (currLevel >= paramA && currLevel < paramB) {
            return parseInt((60 + (currLevel - paramA) / (paramB - paramA) * 20).toString())
        }
        else if (currLevel >= paramB && currLevel < paramC) {
            return parseInt((80 + (currLevel - paramB) / (paramC - paramB) * 20).toString());
        }
        else if (currLevel >= paramC) {
            return 100;
        }
    }

    /** 获取星运的整体评分 */
    public getStartScore(): number {
        var starScore: number = 0;
        var level: number = this.thaneInfo.grades;
        var arr: Array<any> = TempleteManager.Instance.getValueArrByType(FightCondtionType.STAR);
        var paramA: number = 0;
        var paramB: number = 0;
        var paramC: number = 0;
        var currValue: number = StarManager.Instance.starModel.getStarPow(); //当前星运等级
        for (var i: number = 0; i < arr.length; i++) {
            var guideinfo: t_s_valueData = arr[i];
            if (guideinfo.MaxLv == level) {

                paramA = guideinfo.Parameter1;
                paramB = guideinfo.Parameter2;
                paramC = guideinfo.Parameter3;
                break;
            }
        }
        if (currValue < paramA) {
            starScore = parseInt(((currValue / paramA) * 60).toString());
        }
        else if (currValue >= paramA && currValue < paramB) {
            starScore = parseInt((60 + (currValue - paramA) / (paramB - paramA) * 20).toString())
        }
        else if (currValue >= paramB && currValue < paramC) {
            starScore = parseInt((80 + (currValue - paramB) / (paramC - paramB) * 20).toString());
        }
        else if (currValue >= paramC) {
            starScore = 100;
        }
        this.starFun = this.tostar; //跳转到星运界面
        if (starScore > 95) starScore = 95;
        var getIndex: number = this.getIndexByScore(starScore);
        this.showStarDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction6_" + getIndex);
        this.showTipDesc = this.showStarDesc;
        starScore = parseInt(starScore.toString());
        return starScore;
    }

    /** 获取天赋&符文总体评分 */
    public getTalentAndRuneScore(): number {
        var talentScore: number = this.getTalentScore();
        var runeScore: number = this.getRuneScore();
        var score: number = (talentScore + runeScore) / 2;

        if (talentScore <= runeScore) {
            var index: number = this.getIndexByScore(talentScore);
            this.showTalentDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction7_" + index);
        }
        else {
            var runeIndex: number = this.getIndexByScore(runeIndex);
            this.showTalentDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction8_" + runeIndex);
        }
        this.talentFun = this.toRunnerSkill;//跳转到技能天赋界面
        this.showTipDesc = this.showTalentDesc;
        score = parseInt(score.toString());
        return score;
    }

    public getTalentScore(): number {
        var level: number = this.thaneInfo.grades;
        var arr: Array<any> = TempleteManager.Instance.getValueArrByType(FightCondtionType.TALENT);
        var paramA: number = 0;
        var paramB: number = 0;
        var paramC: number = 0;
        var score: number = 0;
        var currValue: number = this.thaneInfo.talentData.talentGrade;
        for (var i: number = 0; i < arr.length; i++) {
            var guideinfo: t_s_valueData = arr[i];
            if (guideinfo.MaxLv == level) {

                paramA = guideinfo.Parameter1;
                paramB = guideinfo.Parameter2;
                paramC = guideinfo.Parameter3;
                break;
            }
        }

        if (currValue < paramA) {
            score = parseInt(((currValue / paramA) * 60).toString());
        }
        else if (currValue >= paramA && currValue < paramB) {
            score = parseInt((60 + (currValue - paramA) / (paramB - paramA) * 20).toString())
        }
        else if (currValue >= paramB && currValue < paramC) {
            score = parseInt((80 + (currValue - paramB) / (paramC - paramB) * 20).toString());
        }
        else if (currValue >= paramC) {
            score = 100;
        }
        return score;
    }

    public getRuneScore(): number {
        var skillInfo: SkillInfo = this.thaneInfo.talentData.allTalentList[0];
        if (!skillInfo) return 0;
        var level: number = this.thaneInfo.grades;
        var arr: Array<any> = TempleteManager.Instance.getValueArrByType(FightCondtionType.MASKING);
        var paramA: number = 0;
        var paramB: number = 0;
        var paramC: number = 0;
        var score: number = 0;
        var currValue: number = skillInfo.grade;
        for (var i: number = 0; i < arr.length; i++) {
            var guideinfo: t_s_valueData = arr[i];
            if (guideinfo.MaxLv == level) {

                paramA = guideinfo.Parameter1;
                paramB = guideinfo.Parameter2;
                paramC = guideinfo.Parameter3;
                break;
            }
        }

        if (currValue < paramA) {
            score = parseInt(((currValue / paramA) * 60).toString());
        }
        else if (currValue >= paramA && currValue < paramB) {
            score = parseInt((60 + (currValue - paramA) / (paramB - paramA) * 20).toString())
        }
        else if (currValue >= paramB && currValue < paramC) {
            score = parseInt((80 + (currValue - paramB) / (paramC - paramB) * 20).toString());
        }
        else if (currValue >= paramC) {
            score = 100;
        }
        return score;
    }

    /** 获取坐骑积分 */
    public getMountScore(): number {
        var level: number = this.thaneInfo.grades;
        var arr: Array<any> = TempleteManager.Instance.getValueArrByType(FightCondtionType.MOUNT);
        var paramA: number = 0;
        var paramB: number = 0;
        var paramC: number = 0;
        var score: number = 0;
        var currValue: number = this.mountInfo.getProperty(PropertyInfo.STRENGTH).addition + this.mountInfo.getProperty(PropertyInfo.INTELLECT).addition + this.mountInfo.getProperty(PropertyInfo.STAMINA).addition + this.mountInfo.getProperty(PropertyInfo.ARMOR).addition;
        for (var i: number = 0; i < arr.length; i++) {
            var guideinfo: t_s_valueData = arr[i];
            if (guideinfo.MaxLv == level) {
                paramA = guideinfo.Parameter1;
                paramB = guideinfo.Parameter2;
                paramC = guideinfo.Parameter3;
                break;
            }
        }
        if (currValue < paramA) {
            score = parseInt(((currValue / paramA) * 60).toString());
        }
        else if (currValue >= paramA && currValue < paramB) {
            score = parseInt((60 + (currValue - paramA) / (paramB - paramA) * 20).toString())
        }
        else if (currValue >= paramB && currValue < paramC) {
            score = parseInt((80 + (currValue - paramB) / (paramC - paramB) * 20).toString());
        }
        else if (currValue >= paramC) {
            score = 100;
        }
        var index: number = this.getIndexByScore(score);
        this.showMountDesc = LangManager.Instance.GetTranslation("fighting.FightingItem.desction9_" + index);
        this.mountFun = this.toMount;//跳转到坐骑界面
        this.showTipDesc = this.showMountDesc;
        score = parseInt(score.toString());
        return score;
    }

    /** 根据Type获取总体评分 */
    public getScoreByType(type: number): number {
        var score: number = 0;
        switch (type) {
            case FightingType.F_EQUIP:
                score = this.getEquipScore();
                break;
            case FightingType.F_GEM:
                score = this.getGemAndMarkingScore();
                break;
            case FightingType.F_PET:
                score = this.getPetScore();
                break;
            case FightingType.F_START:
                score = this.getStartScore();
                break;
            case FightingType.F_CONSORTIATETECHNOLOGY:
                break;
            case FightingType.F_TALENT:
                if (ComponentSetting.GENIUS) {
                    score = this.getTalentAndRuneScore();
                }
                else {
                    score = Number.MAX_VALUE;
                }
                break;
            case FightingType.F_MOUNT:
                score = this.getMountScore();
                break;
        }
        return score;
    }

    public getMinScoreItem(): Object {
        var arr: Array<any> = this.initMainList();
        var item: FightIngModel = arr[0];
        return item;
    }

    /** 初始化战斗力 */
    public initMainList(): Array<FightIngModel> {
        this.list = new Array();
        for (var i: number = 1; i <= 7; i++) {
            var item: FightIngModel = new FightIngModel();
            item.type = i;
            item.level = this.levelList[i - 1];
            if (this.thaneInfo.grades >= item.level) {
                item.score = this.getScoreByType(item.type);
                if (item.type == FightingType.F_TALENT) {
                    if (ComponentSetting.GENIUS) {
                        this.list.push(item);
                    }
                }
                else {
                    this.list.push(item);
                }
            }
        }
        this.list = ArrayUtils.sortOn(this.list, ["score"], [ArrayConstant.NUMERIC]);
        return this.list;
    }

    /** 根据评分显示区间 */
    public getIndexByScore(score: number): number {
        var index: number = 0;
        if (score < 60) {
            index = FightingManager.FIRST_GRADE;
        }
        else if (score >= 60 && score < 80) {
            index = FightingManager.SECOND_GRADE;
        }
        else if (score >= 80 && score <= 99) {
            index = FightingManager.THIRD_GRADE;
        }
        else if (score >= 100) {
            index = FightingManager.FOUR_GRADE;
        }
        return index;
    }
    /**
     * //3、升级科技, 点击打开神学院界面。若有任意科技高于20级, 则不提示
     */
    public checkSeminary():boolean{
        let isshow:boolean=true;
        let bInfo: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(BuildingType.SEMINARY);
        if(bInfo && bInfo.level >= 20){
            let dic: BuildInfo[] = BuildingManager.Instance.model.buildingListByID.getList();
            dic.forEach((element: BuildInfo) => {
                if(element && element.templeteInfo) {
                    if (element.templeteInfo.MasterType == MasterTypes.MT_INTERNALTECHNOLOGY|| element.templeteInfo.MasterType == MasterTypes.MT_WARTECHNOLOGY) {
                        if(element.templeteInfo.BuildingGrade >= 20){
                            isshow = false;
                            return;
                        }
                    }
                }
            });
        }
        return isshow;
    }

    /**
     * 升级星运, 点击打开星运界面。若有任意星运高于3级, 则不提示
     */
    public checkStarLevel():boolean{
        for (let i: number = 0; i < PlayerModel.PLAYER_STAR_BAG_COUNT; i++) {
            let info = StarManager.Instance.getStarInfoByBagTypeAndPos(StarBagType.PLAYER, i);
            if (info && info.grade >= 3) {
                return false;
            }
        }
        for (let i: number = 0; i < PlayerModel.EQUIP_STAR_BAG_COUNT; i++) {
            let info = StarManager.Instance.getStarInfoByBagTypeAndPos(StarBagType.THANE, i);
            if (info && info.grade >= 3) {
                return false;
            }
        }
        return true;
    }

    /**
     * 学习公会技能, 点击打开公会技能界面。若有任意公会技能高于3级, 或没有公会技能塔, 则不提示
     */
    public checkGuildLevel():boolean{
        if(this.consortiaModel.consortiaInfo){
            if(this.consortiaModel.consortiaInfo.schoolLevel == 0){
                return false;
            }
            let array: ConsortiaTempleteInfo[] = this.consortiaModel.baseSkillList.getList();
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if(element.level >= 3){
                    return false;
                }
            }
        }
        return true;
    }

    private get consortiaModel():ConsortiaModel
    {
        return (FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler).model;
    }

    public getCurrPetAvatar(): string {
        var petData: PetData = this.thaneInfo.enterWarPet;
        if (petData) {
            return petData.template.PetAvatar;
        }
        return "";
    }

    private get mountInfo(): MountInfo {
        return MountsManager.Instance.mountInfo
    }

    private get thaneInfo(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

}