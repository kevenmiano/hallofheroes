import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { BagSortType, BagType } from "../../constant/BagDefine";
import { t_s_skillpropertytemplateData } from "../../config/t_s_skillpropertytemplate";
import { GoodsManager } from "../../manager/GoodsManager";
import { BagModel } from "../../module/bag/model/BagModel";
import { PetData } from "../../module/pet/data/PetData";
import Utils from "../../../core/utils/Utils";
import { ItemSelectState } from "../../constant/Const";
import ForgeData from "../../module/forge/ForgeData";
import { GoodsHelp } from "../../utils/GoodsHelp";
import { GoodsType } from "../../constant/GoodsType";
import { GoodsCheck } from "../../utils/GoodsCheck";

export class GoodsInfo {
    /**
     * 物品ID
     */
    public id: number = 0;
    /**
     * 模板ID
     */
    public templateId: number = 0;
    /**
     * 所属用户ID
     */
    public userId: number = 0;
    /**
     * 位置
     */
    public pos: number = 0;
    /**
     * 是否存在
     */
    public isExist: boolean = false;
    /**
     * 所属目标ID
     */
    public objectId: number = 0;
    /**
     * 背包类型
     */
    public bagType: number = 0;
    /**
     * 是否绑定
     */
    public isBinds: boolean = false;
    /**
     * 是否激活
     */
    public isUsed: boolean = false;
    /**
     * 是否新物品
     */
    public isNew: boolean = false;
    /**
     * 有效期
     */
    public validDate: number = 0;
    /**
     * 开始使用时间,未使用时为2000-01-01 00:00:00
     */
    public beginDate: Date = new Date(2000, 1, 1, 0, 0, 0, 0);
    /**
     * 当前数量
     */
    public count: number = 0;
    public rewardType: number = 0;

    /**
     * 当前待出售数量(仅供拍卖行出售物品时使用)
     */
    public willSellCount: number = 0;

    /**
     * 当前强化等级
     */
    public strengthenGrade: number = 0;
    /**
     * 镶嵌孔 -1为未开, 0为已开 >0为镶嵌宝石的id。
     */
    public join1: number = -1;
    public join2: number = -1;
    public join3: number = -1;
    public join4: number = -1;


    public randomSkill1: number = 0;//随机技能
    public randomSkill2: number = 0;//随机技能
    public randomSkill3: number = 0;//随机技能
    public randomSkill4: number = 0;//随机技能
    public randomSkill5: number = 0;//随机技能
    /**
     * 史诗神铸祝福值
     */
    public blessValue: number = 0;

    public suitCount: number = 0;//拥有的套装数量

    public jewelGrade: number = 0;//灵魂刻印等级


    private _property1: string = null;
    /**
     *时装鉴定技能
     */
    public appraisal_skill: number = 0;
    /** 符石经验 */
    public gp: number = 0;

    //英灵装备星级
    public star: number = 0;
    //英灵装备主属性
    public masterAttr: string = null;
    // 英灵装备副属性
    public sonAttr: string = null;
    //英灵装备套装id
    public suitId: number = 0;

    public moveType: string;//移动类型（主要分为穿上或者脱下）针对时装专用

    /** 显示特效 0：不显示 1：显示 */
    public displayEffect: number = 0;

    public sortNumber:number = 0;
    /** 封印的英灵信息 <br/>
     * 宠物模板ID,宠物品质,当前品质经验,品质总经验, 当前等级,当前宠物经验,宠物总经验,
     |力量资质,智力资质,体质资质,护甲资质, 力量, 智力, 体质, 护甲
     |火系抗性, 水系抗性 电系抗性 风系抗性 暗系抗性 光系抗性
     |跟随技能
     |变身技能
     */
    public get property1(): string {
        return this._property1;
    }

    /**
     * @private
     */
    public set property1(value: string) {
        if (this._property1 == value) {
            return;
        }
        this._property1 = value;
        if (value == "1") {
            return;
        }
        this.petData = PetData.createWidthString(value);
    }

    public petData: PetData;

    /** 史诗神铸等级 */
    private _mouldGrade: number = 0;
    /**神铸阶段（1-8）*/
    private _mouldRank: number = 0;
    /**神铸星级（1-10）*/
    private _mouldStar: number = 0;
    public set mouldGrade(value: number) {
        //暂时没有月阶
        if (value > ForgeData.MOULD_MAX_GRADE) {
            this._mouldGrade = ForgeData.MOULD_MAX_GRADE;
        } else {
            this._mouldGrade = value;
        }
        if (this._mouldGrade > 0) {
            this._mouldRank = Math.floor((this._mouldGrade - 1) / 10) + 1;
            this._mouldStar = this._mouldGrade % 10;
            if (this._mouldStar == 0) {
                this._mouldStar = 10;
            }
        } else {
            this._mouldRank = 0;
            this._mouldStar = 0;
        }
    }

    public get mouldGrade(): number {
        return this._mouldGrade;
    }
    public get mouldRankShow(): number {
        if (this._mouldRank > ForgeData.MOULD_MAX_RANK && this._mouldRank <= ForgeData.MOULD_MAX_RANK_SENIOR)//8-16
        {
            return this._mouldRank - ForgeData.MOULD_MAX_RANK;
        }
        else if (this._mouldRank > ForgeData.MOULD_MAX_RANK_SENIOR)//16-24
        {
            return this._mouldRank - ForgeData.MOULD_MAX_RANK_SENIOR;
        } else {
            return this._mouldRank;
        }
    }


    public get mouldRank(): number {
        return this._mouldRank;
    }

    public set mouldRank(value: number) {
        this._mouldRank = value;
    }
    public get mouldStar(): number {
        return this._mouldStar;
    }

    public set mouldStar(value: number) {
        this._mouldStar = value;
    }

    public get MOULD_NEED_MATERIAL1(): number {
        if (this.mouldGrade < ForgeData.MOULD_MAX_GRADE) {
            return ForgeData.MOULD_NEED_MATERIAL1;
        }
        // else if (this.mouldGrade >= ForgeData.MOULD_MAX_GRADE && this.mouldGrade < ForgeData.MOULD_MAX_GRADE_SENIOR) {
        //     return ForgeData.MOULD_NEED_MATERIAL_SENIOR1;
        // }
        // else if (this.mouldGrade >= ForgeData.MOULD_MAX_GRADE_SENIOR) {
        //     return ForgeData.MOULD_NEED_MATERIAL_THREE1;
        // }
        return 0;
    }

    public get MOULD_NEED_MATERIAL2(): number {
        if (this.mouldGrade < ForgeData.MOULD_MAX_GRADE) {
            return ForgeData.MOULD_NEED_MATERIAL2;
        }
        // else if (this.mouldGrade >= ForgeData.MOULD_MAX_GRADE && this.mouldGrade < ForgeData.MOULD_MAX_GRADE_SENIOR) {
        //     return ForgeData.MOULD_NEED_MATERIAL_SENIOR2;
        // }
        // else if (this.mouldGrade >= ForgeData.MOULD_MAX_GRADE_SENIOR) {
        //     return ForgeData.MOULD_NEED_MATERIAL_THREE2;
        // }
        return 0;
    }

    /**
     * 取得单项属性加成(神铸)
     * @param preValue 原有属性值,为0时表示没有该项属性,返回0;
     * @return 
     * 
     */
    private getMouldAddition(preValue: number): number {
        if (preValue == 0) {
            return 0;
        }
        return GoodsHelp.getMouldAddition(preValue, this.mouldGrade);
    }
    /** 神铸等级上限改为config配置 */
    private mouldMaxGrade:number = 0;
    public get MOULD_MAX_GRADE(): number {
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("Divinecast_Upperlimit");
        if (cfgItem) {
            this.mouldMaxGrade = Number(cfgItem.ConfigValue);
        }
        return this.mouldMaxGrade;
        // return 10;//临时需求, 神铸最多开发至1阶10星
        ////暂时没有月阶
        return ForgeData.MOULD_MAX_GRADE;
        if (this.isSeniorEquip) {
            return ForgeData.MOULD_MAX_GRADE_SENIOR;
        }
        // else if(isThreeEquip)//9.0补充需求三转暂不开发日阶段（160-240）
        // {
        //     if(VersionSwitch.AVENGER_CAST_SUN)
        //     {
        //         return ForgeData.MOULD_MAX_GRADE_THREE;
        //     }
        //     else
        //     {
        //         return ForgeData.MOULD_MAX_GRADE_SENIOR;
        //     }
        // }
        else {
            return ForgeData.MOULD_MAX_GRADE;
        }
    }
    public get isSeniorEquip(): boolean {
        if (this.templateInfo && this.templateInfo.MasterType == GoodsType.EQUIP && !GoodsCheck.isFashion(this.templateInfo)) {
            if (this.templateInfo.Profile == 6) {
                return true;
            }
        }
        return false;
    }

    public get isSeniorEquipMaterial(): boolean {
        if (this.templateInfo && this.templateInfo.StrengthenMax > 0 && this.templateInfo.Profile == 5 && this.templateInfo.NeedGrades == 80) {
            return true;
        }
        return false;
    }

    public get MOULD_MAX_RANK(): number {
        if (this.isSeniorEquip) {
            return ForgeData.MOULD_MAX_RANK_SENIOR;
        }
        // else if(isThreeEquip)
        // {
        //     return ForgeData.MOULD_MAX_RANK_THREE;
        // }
        else {
            return ForgeData.MOULD_MAX_RANK;
        }
    }

    /**
     * 9.2需求日阶段修改消耗 
     * @return 
     * 
     */
    public getMouldNeedCount(type: number): number {
        if (this.mouldGrade < ForgeData.MOULD_MAX_GRADE_SENIOR) {
            return type == 1 ? 5 : 15;
        }
        else if (this.mouldGrade < 180) {
            return 15;
        }
        else if (this.mouldGrade < 200) {
            return 25;
        }
        else if (this.mouldGrade < 220) {
            return 40;
        }
        else {
            return 60;
        }
    }

    /**
     *是否是三转装备 
    * @return 
    * 
    */
    public get isThreeEquip(): boolean {
        if (this.templateInfo && this.templateInfo.MasterType == GoodsType.EQUIP && !GoodsCheck.isFashion(this.templateInfo)) {
            if (this.templateInfo.Profile == 7) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否为体力药水
     */
    public get isWearyItem() {
        return this.templateInfo && this.templateInfo.Property1 == 5 && this.templateInfo.Property2 > 0
    }
    /**
     *二级密码锁 true:已上锁
     */
    public isLock: boolean = false;

    selectState: ItemSelectState = ItemSelectState.Default;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 获得物品模板
     * @return
     *
     */
    public get templateInfo(): t_s_itemtemplateData {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this.templateId);
    }

    public get leftTime(): number {
        if (this.validDate == 0) {
            return -1;
        }
        if (typeof (this.beginDate) == "string") {
            this.beginDate = new Date(this.beginDate);
        }
        return (this.validDate * 60 * 1000 - this.serverTime + this.beginDate.getTime()) / 1000;
    }

    public existLessGradeJewel(grade: number): boolean {
        let joinString: string;
        if (this.join1 <= 0) {
            return true;
        }
        joinString = this.join1.toString();
        if (Number(joinString.substring(joinString.length - 2, 2)) < grade) {
            return true;
        }

        if (this.join2 <= 0) {
            return true;
        }
        joinString = this.join2.toString();
        if (Number(joinString.substring(joinString.length - 2, 2)) < grade) {
            return true;
        }

        if (this.join3 <= 0) {
            return true;
        }
        joinString = this.join3.toString();
        if (Number(joinString.substring(joinString.length - 2, 2)) < grade) {
            return true;
        }
        return false;
    }

    public existJewel(): boolean {
        return (this.join1 > 0) || (this.join2 > 0) || (this.join3 > 0) || (this.join4 > 0);
    }

    public get totalAttribute(): number {
        return this.templateInfo.MagicAttack + this.templateInfo.Attack + this.templateInfo.MagicDefence + this.templateInfo.Defence + this.templateInfo.Conat + this.templateInfo.Live;
    }

    private get serverTime(): number {
        return PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000;
    }

    /**
     * 获得装备基础属性得分
     * @return
     *
     */
    public getBasePropertyScore(): number {
        let temp: t_s_itemtemplateData = this.templateInfo;
        let count: number = temp.Attack + temp.Defence + temp.MagicAttack + temp.MagicDefence + temp.ForceHit + Number(temp.Live / 5) +
            temp.Conat + (temp.Power + temp.Agility + temp.Intellect) * 4 + (temp.Captain + temp.Physique) * 2;

        return Math.floor(count);
    }

    /**
     * 获得装备基本得分(不包括强化和镶嵌)
     * @return
     *
     */
    public getEquipBaseScore(newRandomSkill?: number[]): number {
        let temp: t_s_itemtemplateData = this.templateInfo;
        let count: number = temp.Attack + temp.Defence + temp.MagicAttack + temp.MagicDefence + temp.ForceHit + Number(temp.Live / 5) +
            temp.Conat + (temp.Power + temp.Agility + temp.Intellect) * 4 + (temp.Captain + temp.Physique) * 2;


        count += this.getById(Number(temp.DefaultSkill));
        let i: number;
        for (i = 1; i < 6; i++) {
            let skillPropertyId: number = this["randomSkill" + i];
            if (!Utils.isEmpty(newRandomSkill) && newRandomSkill[i - 1]) {
                skillPropertyId = newRandomSkill[i - 1]
            }
            count += this.getById(skillPropertyId);
        }

        let skillString: string = temp.DefaultSkill + ",";
        for (i = 1; i < 6; i++) {
            let skillId = this["randomSkill" + i]
            if (!Utils.isEmpty(newRandomSkill) && newRandomSkill[i - 1]) {
                skillId = newRandomSkill[i - 1];
            }
            skillString += skillId + ",";
        }

        let skillList: any[] = TempleteManager.Instance.getSkillTemplateInfoByIds(skillString);
        for (let skillTemp of skillList) {
            if (skillTemp) {
                count += this.getById(skillTemp.TemplateId);
            }
        }
        return Math.floor(count);
    }

    /**
     * 获得装备基本得分(不包括强化和镶嵌)
     * @return
     *
     */
    public getEquipTrueBaseScore(): number {
        let temp: t_s_itemtemplateData = this.templateInfo;
        let count: number = temp.Attack + temp.Defence + temp.MagicAttack + temp.MagicDefence + temp.ForceHit + Number(temp.Live / 5) +
            temp.Conat + (temp.Power + temp.Agility + temp.Intellect) * 4 + (temp.Captain + temp.Physique) * 2;
        return Math.floor(count);
    }

    /**
     * 强化和镶嵌的得分.
     * @return
     *
     */
    public getEquipAdditionScore(): number {
        let count: number;
        let temp: t_s_itemtemplateData = this.templateInfo;
        count = this.getAddition(temp.Attack) +
            this.getAddition(temp.Defence) +
            this.getAddition(temp.MagicAttack) +
            this.getAddition(temp.MagicDefence) +
            this.getAddition(temp.ForceHit) +
            Number(this.getAddition(temp.Live) / 5) +
            this.getAddition(temp.Conat) +
            (this.getAddition(temp.Power) + this.getAddition(temp.Agility) + this.getAddition(temp.Intellect)) * 4 +
            (this.getAddition(temp.Captain) + this.getAddition(temp.Physique)) * 2;

        count += this.getMouldAddition(temp.Attack) +
            this.getMouldAddition(temp.Defence) +
            this.getMouldAddition(temp.MagicAttack) +
            this.getMouldAddition(temp.MagicDefence) +
            this.getMouldAddition(temp.ForceHit) +
            Number(this.getMouldAddition(temp.Live) / 5) +
            this.getMouldAddition(temp.Conat) +
            (this.getMouldAddition(temp.Power) + this.getMouldAddition(temp.Agility) + this.getMouldAddition(temp.Intellect)) * 4 +
            (this.getMouldAddition(temp.Captain) + this.getMouldAddition(temp.Physique)) * 2;

        let jewelInfo: GoodsInfo;
        if (this.join1 > 0) {
            jewelInfo = new GoodsInfo();
            jewelInfo.templateId = this.join1;

            count += jewelInfo.getJewelScore();
        }
        if (this.join2 > 0) {
            jewelInfo = new GoodsInfo();
            jewelInfo.templateId = this.join2;

            count += jewelInfo.getJewelScore();
        }
        if (this.join3 > 0) {
            jewelInfo = new GoodsInfo();
            jewelInfo.templateId = this.join3;

            count += jewelInfo.getJewelScore();
        }

        return Math.floor(count);
    }

    /**
     * 总得分
     * @return
     *
     */
    public getEquipTotalScore(): number {
        return this.getEquipBaseScore() + this.getEquipAdditionScore();
    }

    /**
     * 取得单项属性加成(强化)
     * @param preValue 原有属性值,为0时表示没有该项属性,返回0;
     * @return
     *
     */
    private getAddition(preValue: number): number {
        if (preValue == 0) {
            return 0;
        }
        return Number(preValue * this.strengthenGrade * 0.1) + this.strengthenGrade * 5;
    }

    /**
     * 获得单个宝石的得分(只针对宝石物品).
     * @return
     *
     */
    private getJewelScore(): number {
        let temp: t_s_itemtemplateData = this.templateInfo;
        let count: number = temp.Attack + temp.Defence + temp.MagicAttack + temp.MagicDefence + temp.ForceHit + Number(temp.Live / 5) +
            temp.Conat + (temp.Power + temp.Agility + temp.Intellect) * 4 + (temp.Captain + temp.Physique) * 2;
        return count;
    }

    private getById(id: number): number {
        let skillPropertyInfo: t_s_skillpropertytemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillpropertytemplate, id.toString());
        if (!skillPropertyInfo) {
            return 0;
        }
        let count: number = skillPropertyInfo.Attack + skillPropertyInfo.Defence + skillPropertyInfo.MagicAttack +
            skillPropertyInfo.MagicDefence + skillPropertyInfo.ForceHit + Number(skillPropertyInfo.Live / 5) +
            skillPropertyInfo.Conat + (skillPropertyInfo.Power + skillPropertyInfo.Agility + skillPropertyInfo.Intellect) * 4 +
            (skillPropertyInfo.Captain + skillPropertyInfo.Physique) * 2;
        return count;
    }

    public checkIsFilterGoods(): boolean {
        if (this.bagType != BagType.Player && this.bagType != BagType.Storage) {
            return false;
        }
        if (!GoodsManager.Instance.filterFlag) {
            return false;
        }
        if (BagModel.lastBagSortType == BagSortType.Default) {
            return false;
        }
        if (GoodsManager.Instance.isType(this, BagModel.lastBagSortType)) {
            return false;
        }
        return true;
    }

    public copy(info: Object) {
        for (let key in info) {
            if (Object.prototype.hasOwnProperty.call(info, key)) {
                let value = info[key];
                if (typeof value == 'number') {
                    this[key] = Number(value);
                } else if (typeof value == 'string') {
                    this[key] = value.toString();
                } else if (typeof value == 'boolean') {
                    this[key] = value.toString() == 'true' ? true : false;
                } else if(value instanceof Date){//结构体
                    this[key] = new Date(value);
                } else {//结构体
                    this[key] = value.toString();
                }
            }
        }
    }

}