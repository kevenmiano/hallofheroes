import { t_s_configData } from "../../../../config/t_s_config";
import { TattooHole } from "./TattooHole";
import { TattooHoleInfoII } from "./TattooHoleInfoII";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { ArmyEvent } from "../../../../constant/event/NotificationEvent";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { UpgradeType } from "../../../../constant/UpgradeType";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { BagType } from "../../../../constant/BagDefine";
import OpenGrades from "../../../../constant/OpenGrades";
import {RoleCtrl} from "../../../bag/control/RoleCtrl";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/1/9 17:12
 * @ver 1.0
 */
export class TattooModel {
    public currHoleIndex: number;
    public holes: TattooHole[];
    public missionType: number = 0;//任务类型  0非任务 209初次洗练任务 210替换属性任务
    public lastOpType: number = 0;//1所有信息 2洗练 3替换属性

    public holeInfoIIs: any[];
    private _selectedNewHoleInfo: TattooHoleInfoII;

    // private _primaryTattooAddRegion:string = "";
    // private _seniorTattooAddRegion:string = "";
    private _primaryTattooReduceRegion: string = "";
    private _seniorTattooReduceRegion: string = "";

    public static NEED_DYE_NUM_ONCE: number = 100;
    public coreStep: number = 0;//龙纹核心阶级

    public static PROPERTY_NAME_OLD: any[] = ["strength", "agility", "intelligence", "captain", "", "physique"];//["力量", "护甲", "智力", "统帅", "", "体质"]
    public static PROPERTY_NAME: any[] = ["", "strength", "agility", "intelligence", "physique", "captain"];//["力量", "护甲", "智力", "体质", "统帅"]
    public static DragonCrystalId: number = 208052;//龙晶
    public static DragonCrystalId2: number = 208053;//高级龙晶
    // public tattooRefreshLockPrice: number = 50;//属性上锁价格
    public tattooBaptizePrice: number = 50;//龙纹洗炼价格
    public tattooConsumeNum: number = 100;//龙晶消耗数量
    public identicalTattooNum: number = 4;//可拥有同种属性龙纹数量上限
    public proterty_value_max: string[] = [];//阶级对应属性上限（对应Ⅰ阶、Ⅱ阶、Ⅲ阶......）
    public upgrade_grade: string[] = [];//60,70,80    进阶所需角色等级（对应Ⅰ阶、Ⅱ阶、Ⅲ阶......） remark 注意: 60,70,80理解为:  60级1阶升2阶, 70级2阶升3阶, 80级3阶升4阶
    public multiplicativeBasis: number = 0.05;//洗炼增加属性乘基（百分比）Tattoo_Hight_MultiplicativeBasis
    // public isClicked: boolean = false;//龙纹页签是否被点击过, 点击过就隐藏红点

    /** 本次登陆是否提示 */
    public notAlert:boolean = false;
    public notAlertBaptizeUseDiamond:boolean = false;
    public notAlertUpdateUseDiamond:boolean = false;
    public notAlertUpdateAdvanceUseDiamond:boolean = false;
    public showBind:boolean = false;
    
    constructor() {
        this.initData();
    }

    private initData() {
        let configInfo: t_s_configData;
        configInfo = TempleteManager.Instance.getConfigInfoByConfigName("Tattoo_consume");
        if (configInfo && configInfo.ConfigValue) {
            TattooModel.DragonCrystalId = Number(configInfo.ConfigValue.split(",")[0]);
            this.tattooConsumeNum = Number(configInfo.ConfigValue.split(",")[1]);
        }

        // configInfo = TempleteManager.Instance.getConfigInfoByConfigName("Tattoo_refresh_lock_price");
        // if (configInfo && configInfo.ConfigValue) {
        //     this.tattooRefreshLockPrice = Number(configInfo.ConfigValue);
        // }

        configInfo = TempleteManager.Instance.getConfigInfoByConfigName("Tattoo_refresh_price");
        if (configInfo && configInfo.ConfigValue) {
            this.tattooBaptizePrice = Number(configInfo.ConfigValue);
        }

        configInfo = TempleteManager.Instance.getConfigInfoByConfigName("Identical_tattoo");
        if (configInfo && configInfo.ConfigValue) {
            this.identicalTattooNum = parseInt(configInfo.ConfigValue);
        }

        configInfo = TempleteManager.Instance.getConfigInfoByConfigName("Tattoo_Class_Proterty_Value_Max");
        if (configInfo && configInfo.ConfigValue) {
            this.proterty_value_max = configInfo.ConfigValue.split(",");
        }

        configInfo =TempleteManager.Instance.getConfigInfoByConfigName( "Tattoo_Upgrade_Grade");
        if (configInfo && configInfo.ConfigValue) {
            this.upgrade_grade = configInfo.ConfigValue.split(",");
        }

        configInfo = TempleteManager.Instance.getConfigInfoByConfigName( "Tattoo_Hight_MultiplicativeBasis");
        if (configInfo && configInfo.ConfigValue) {
            this.multiplicativeBasis = Number(configInfo.ConfigValue) / 100;
        }
    }

    /**
     * 计算每个类型的龙纹数量
     */
    public calculatePropertyTypeNum(): number[] {
        let propertyTypeNum: number[] = [0, 0, 0, 0, 0];//(力量,护甲,智力,体质,统帅)
        for (let i: number = 0; i < this.holes.length; i++) {
            let hole: TattooHole = this.holes[i] as TattooHole;
            switch (hole.oldAddProperty) {
                case 1:
                    {
                        propertyTypeNum[0]++;
                        break;
                    }
                case 2:
                    {
                        propertyTypeNum[1]++;
                        break;
                    }
                case 3:
                    {
                        propertyTypeNum[2]++;
                        break;
                    }
                case 4:
                    {
                        propertyTypeNum[3]++;
                        break;
                    }
                case 5:
                    {
                        propertyTypeNum[4]++;
                        break;
                    }
            }
        }
        return propertyTypeNum;
    }

    public calculateAddProperty(): number[] {
        let addProperty: number[] = [0, 0, 0, 0, 0];//(力量,护甲,智力,体质,统帅)
        for (let i: number = 0; i < this.holes.length; i++) {
            let hole: TattooHole = this.holes[i] as TattooHole;
            switch (hole.oldAddProperty) {
                case 1:
                    {
                        addProperty[0] += hole.oldAddingValue;
                        break;
                    }
                case 2:
                    {
                        addProperty[1] += hole.oldAddingValue;
                        break;
                    }
                case 3:
                    {
                        addProperty[2] += hole.oldAddingValue;
                        break;
                    }
                case 4:
                    {
                        addProperty[3] += hole.oldAddingValue;
                        break;
                    }
                case 5:
                    {
                        addProperty[4] += hole.oldAddingValue;
                        break;
                    }
            }
            switch (hole.oldReduceProperty) {
                case 1:
                    {
                        addProperty[0] += hole.oldReduceValue;
                        break;
                    }
                case 2:
                    {
                        addProperty[1] += hole.oldReduceValue;
                        break;
                    }
                case 3:
                    {
                        addProperty[2] += hole.oldReduceValue;
                        break;
                    }
                case 4:
                    {
                        addProperty[3] += hole.oldReduceValue;
                        break;
                    }
                case 5:
                    {
                        addProperty[4] += hole.oldReduceValue;
                        break;
                    }
            }
        }
        // let _isSelf:boolean = true;
        // let _thaneInfo:ThaneInfo;
        // let targetArr:any[] = _isSelf ? this.holeInfoIIs : _thaneInfo.tattooPrintHoles;
        let targetArr: any[] = this.holeInfoIIs;
        let addStrengthPrecentStr: string = "";
        if (this.getImprintTotalCountByProperity(0, targetArr) > 0) {
            let addStrengthPrecent: number = this.getImprintTotalCountByProperity(0, targetArr) * addProperty[0] / 100;
            addProperty[0] += addStrengthPrecent;
        }
        let addAgilityPrecentStr: string = "";
        if (this.getImprintTotalCountByProperity(1, targetArr) > 0) {
            let addAgilityPrecent: number = this.getImprintTotalCountByProperity(1, targetArr) * addProperty[1] / 100;
            addProperty[1] += addAgilityPrecent;
        }
        let addIntelligencePrecentStr: string = "";
        if (this.getImprintTotalCountByProperity(2, targetArr) > 0) {
            let addIntelligencePrecent: number = this.getImprintTotalCountByProperity(2, targetArr) * addProperty[2] / 100;
            addProperty[2] += addIntelligencePrecent;
        }
        let addCaptainPrecentStr: string = "";
        if (this.getImprintTotalCountByProperity(3, targetArr) > 0) {
            let addCaptainPrecent: number = this.getImprintTotalCountByProperity(3, targetArr) * addProperty[4] / 100;
            addProperty[4] += addCaptainPrecent;
        }
        let addPhysiquePrecentStr: string = "";
        if (this.getImprintTotalCountByProperity(5, targetArr) > 0) {
            let addPhysiquePrecent: number = this.getImprintTotalCountByProperity(5, targetArr) * addProperty[3] / 100;
            addProperty[3] += addPhysiquePrecent;
        }
        return addProperty;
    }

    /**
     * 龙纹洗炼增加属性值
     * 1~(10*（当前阶级的属性上限-当前属性）/（当前阶级的属性上限-上一阶级的属性上限）)(向上取整)
     * 修改: 1 ~ (（当前阶级的属性上限-当前属性）*0.05)(向上取整), 0.05可在config里配置 Tattoo_Hight_MultiplicativeBasis
     */
    public getTattooMaxAddValue(hole: TattooHole): number {
        let currMaxValue: number = this.getProtertyValueMaxByStep(hole.oldStep);
        // let preMaxValue:number = this.getProtertyValueMaxByStep(hole.newStep - 1);
        let min: number = 1;
        // let max:number = Math.ceil(10 * (currMaxValue - hole.oldAddingValue) / (currMaxValue - preMaxValue));
        let max: number = Math.ceil((currMaxValue - hole.oldAddingValue) * this.multiplicativeBasis);
        return max;
    }

    public getTattooHoleInfoIIById(id: number): TattooHoleInfoII {
        for (const info of this.holeInfoIIs) {
            if (info.holeId == id) {
                return info;
            }
        }
        return null;
    }

    public get selectedNewHoleInfo(): TattooHoleInfoII {
        return this._selectedNewHoleInfo;
    }

    public set selectedNewHoleInfo(value: TattooHoleInfoII) {
        if (this._selectedNewHoleInfo == value) {
            return;
        }
        this._selectedNewHoleInfo = value;
        NotificationManager.Instance.dispatchEvent(ArmyEvent.TATTOO_NEWHOLE_SELECT);
    }

    public getHasImprintCount(value: TattooHoleInfoII[]): number {
        let count: number = 0;
        if (!value) {
            return count;
        }
        for (const info of value) {
            if (info.property > -1) {
                count++;
            }
        }
        return count;
    }

    /**
     * 获得每个属性总的刻印加成比
     * @param properity
     * @return
     *
     */
    public getImprintTotalCountByProperity(properity: number, value: TattooHoleInfoII[]): number {
        let count: number = 0;
        if (!value) {
            return count;
        }
        for (const info of value) {
            if (info.property == properity) {
                let curUpgrdeTemp: t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevel(info.level, UpgradeType.UPGRADE_TATTOO_NEWHOLE);
                if (!curUpgrdeTemp) {
                    continue;
                }
                if (curUpgrdeTemp.Data > 0) {
                    count += curUpgrdeTemp.Data;
                }
            }
        }
        return count;
    }

    /**
     * 获取阶级对应属性上限
     * @param step
     */
    public getProtertyValueMaxByStep(step: number): number {
        if (step - 1 >= 0 && step - 1 < this.proterty_value_max.length) {
            return parseInt(this.proterty_value_max[step - 1]);
        }
        else {
            return 0;
        }
    }

    /**
     * 从step升到下一阶所需角色等级
     * @param step  当前阶
     */
    public getGradeByStep(step: number): number {
        if (step - 1 >= 0 && step - 1 < this.proterty_value_max.length) {
            return parseInt(this.upgrade_grade[step - 1]);
        }
        else {
            return 0;
        }
    }

    /**
     * 检测当前槽位是否是锁定状态   返回true代表锁定
     * @param index 0-7
     */
    public checkHoleIsLock(index: number): boolean {
        let id: number = index + 1;
        let openLv: number = 55 + 5 * (id - 3);
        return ArmyManager.Instance.thane.grades < openLv;
    }

    /**
     * 获取角色指定等级应该解锁的龙纹槽数量,例如角色60级的话, 应该解锁了4个龙纹
     * @param level
     */
    public getOpenNumByLevel(level: number): number {
        let num: number = 0;
        num = (level - 55) / 5 + 3;
        return num;
    }

    /**
     * 获取已解锁的龙纹槽数量
     */
    public getOpenedNum(): number {
        let num: number = 0;
        for (let i = 0, len = this.holes.length; i < len; i++) {
            const hole = this.holes[i];
            if (!hole.isLock) {
                num++;
            }
        }
        return num;
    }

    /**
     * 获取达到当前阶属性上限的龙纹数量
     */
    public getTotalLimitTattooNum(): number {
        let num: number = 0;
        let max: number = this.getProtertyValueMaxByStep(this.coreStep);
        for (let i = 0, len = this.holes.length; i < len; i++) {
            const hole = this.holes[i];
            if (hole.oldAddingValue >= max) {
                num++;
            }
        }
        return num;
    }

    /**
     * 是否可以进阶 当龙纹核心可进阶时, 背包按钮、角色页签、龙纹页签有常驻红点提示（其它情况龙纹不需要红点）
     */
    public canTattoo(): boolean {
        if(ArmyManager.Instance.thane.grades < OpenGrades.TATTOO){
            return false;
        }
        let currLv:number = ArmyManager.Instance.thane.grades;
        let nextLv:number = this.getGradeByStep(this.coreStep);
        let limitNum:number = this.getTotalLimitTattooNum();
        let openedNum:number = this.getOpenNumByLevel(nextLv);
        if(limitNum >= openedNum && currLv >= nextLv){
            return true;
        }
        return false;
       
    }

    public canUpgrade(): boolean {
        let hasNum: number = GoodsManager.Instance.getBagCountByTempId(BagType.Player, TattooModel.DragonCrystalId);
        return hasNum >= this.tattooConsumeNum && ArmyManager.Instance.thane.grades >= OpenGrades.TATTOO;
    }

    public canUpgrade2(): boolean {
        let hasNum: number = GoodsManager.Instance.getBagCountByTempId(BagType.Player, TattooModel.DragonCrystalId2);
        return hasNum >= this.tattooConsumeNum && ArmyManager.Instance.thane.grades >= OpenGrades.TATTOO;
    }

    public canBaptize(hole:TattooHole): boolean {
        return hole.oldAddProperty > 0 && ArmyManager.Instance.thane.grades >= OpenGrades.TATTOO;
    }

    /**
     * 当前孔位是否有洗炼之后未替换的属性
     * 除了 op=2,6 其他返回有新属性，都是洗炼出来的
     */
    public hasNotReplaceProperty():boolean
    {
        let hole:TattooHole = this.holes[this.currHoleIndex];
        if(hole.newAddProperty > 0 && (this.lastOpType != RoleCtrl.OP_REFRESH && this.lastOpType != RoleCtrl.OP_ADVANCE_REFRESH))
        {
            return true;
        }
        return false;
    }
}