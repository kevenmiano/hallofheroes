/**
 * 英雄基础属性集合
 * @author alan
 *
 */
export class BasePropertyInfo {
    //基础值
    public basePowerPoint: number = 0;
    public baseAgilityPoint: number = 0;
    public baseIntellectPoint: number = 0;
    public basePhysiquePoint: number = 0;
    public baseCaptainPoint: number = 0;
    public remainPoint: number = 0;
    //自由分配值
    public addPowerPoint: number = 0;
    public addAgilityPoint: number = 0;
    public addIntellectPoint: number = 0;
    public addPhysiquePoint: number = 0;
    public addCaptainPoint: number = 0;
    //总值
    public totalPower: number = 0;
    public totalAgility: number = 0;
    public totalIntellect: number = 0;
    public totalCaptain: number = 0;
    public totalPhysique: number = 0;

    public totalBattleWill: number = 0;
    public totalFireResi: number = 0;
    public totalWaterResi: number = 0;
    public totalWindResi: number = 0;
    public totalElecResi: number = 0;
    public totalLightResi: number = 0;
    public totalDarkResi: number = 0;
    public hasSetBattleInfoFlag: boolean = false;

    public fashionPower: number = 0;
    public fashionAgility: number = 0;
    public fashionIntellect: number = 0;
    public fashionPhysigue: number = 0;
    public hasSetFashionProperty: boolean = false;

    constructor() {
    }

    public hasEffect(property: string): number {
        if (property == "powerPoint" && this.totalPower - this.basePowerPoint > 0) {
            return 2;
        }
        else if (property == "agilityPoint" && this.totalAgility - this.baseAgilityPoint > 0) {
            return 2;
        }
        else if (property == "intellectPoint" && this.totalIntellect - this.baseIntellectPoint > 0) {
            return 2;
        }
        else if (property == "captainPoint" && this.totalCaptain - this.baseCaptainPoint > 0) {
            return 2;
        }
        else if (property == "physiquePoint" && this.totalPhysique - this.basePhysiquePoint > 0) {
            return 2;
        }
        return 1;
    }

    public commit() {

    }
}