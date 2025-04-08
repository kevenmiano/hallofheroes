// @ts-nocheck
/**
 * 英雄战斗属性集合
 */
export class AttackProrertyInfo {
    //总值
    public totalPhyAttack: number = 0;
    public totalPhyDefence: number = 0;
    public totalMagicAttack: number = 0;
    public totalMagicDefence: number = 0;
    public totalForceHit: number = 0;
    public totalLive: number = 0;
    public totalConatArmy: number = 0;// 带兵数
    public totalParry: number = 0;//格挡
    public totalIntensity: number = 0;//强度
    public totalTenacity: number = 0;//韧性

    //基础值
    public basePhyAttack: number = 0;
    public basePhyDefence: number = 0;
    public baseMagicAttack: number = 0;
    public baseMagicDefence: number = 0;
    public baseForceHit: number = 0;
    public baseConatArmy: number = 0;
    public baseLive: number = 0;
    public baseParry: number = 0;//格挡
    public baseIntensity: number = 0;//强度
    public baseTenacity: number = 0;//韧性


    constructor() {
    }

    /**
     * 判断某种属性是否有加成, 1为没有, 2为有
     * @param property
     * @return
     *
     */
    public hasEffect(property: string): number {
        if (property == "basePhyAttack" && this.totalPhyAttack - this.basePhyAttack > 0) {
            return 2;
        }
        else if (property == "basePhyDefence" && this.totalPhyDefence - this.basePhyDefence > 0) {
            return 2;
        }
        else if (property == "baseMagicAttack" && this.totalMagicAttack - this.baseMagicAttack > 0) {
            return 2;
        }
        else if (property == "baseMagicDefence" && this.totalMagicDefence - this.baseMagicDefence > 0) {
            return 2;
        }
        else if (property == "baseForceHit" && this.totalForceHit - this.baseForceHit > 0) {
            return 2;
        }
        else if (property == "baseConatArmy" && this.totalConatArmy - this.baseConatArmy > 0) {
            return 2;
        }
        else if (property == "baseLive" && this.totalLive - this.baseLive > 0) {
            return 2;
        }
        else if (property == "baseParry" && this.totalParry - this.baseParry > 0) {
            return 2;
        }
        else if (property == "baseTenacity" && this.totalTenacity - this.baseTenacity > 0) {
            return 2;
        }
        else if (property == "baseIntensity" && this.totalIntensity - this.baseIntensity > 0) {
            return 2;
        }
        return 1;
    }

    public get totalAttribute(): number {
        return this.totalPhyAttack + this.totalPhyDefence + Number(this.totalMagicAttack * 1.05) + this.totalMagicDefence + this.totalForceHit;
    }

    public get totalIntensityEffect(): string {
        return (this.totalIntensity * 100 / (this.totalIntensity + 8000)).toFixed(2);
    }

    public get totalTenacityEffect(): string {
        return (this.totalTenacity * 100 / (this.totalTenacity + 8000)).toFixed(2);
    }

    public commit() {

    }
}