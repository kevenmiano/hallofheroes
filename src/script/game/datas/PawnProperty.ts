// @ts-nocheck
/**
 * 士兵的加成属性集合
 * @author alan
 *
 */
export class PawnProperty
{
    //值加成
    public bagData:number = 0;
    public starData:number = 0;
    public effectData:number = 0;
    public skillData:number = 0;
    //百分比加成
    public bagPer:number = 0;
    public starPer:number = 0;
    public effectPer:number = 0;
    public skillPer:number = 0;

    constructor()
    {
    }

    /**
     * 获取某种属性值的加成以后的总值
     * @param tempDatd
     * @return
     *
     */
    public getTotalJoin(tempDatd:number):number
    {
        if(tempDatd == 0)
        {
            return 0;
        }
        return (tempDatd + this.bagData + this.starData + this.effectData) * (100 + this.effectPer) / 100 * (100 + this.bagPer + this.skillPer + this.starPer) / 100 + this.skillData;
    }

    /**
     * 或者某种属性值的加成以后的基础值
     * @param tempDatd
     * @return
     *
     */
    public getBaseJoin(tempDatd:number):number
    {
        if(tempDatd == 0)
        {
            return 0;
        }
        return (tempDatd + this.effectData) * (100 + this.effectPer) / 100 * (100 + this.bagPer + this.skillPer + this.starPer) / 100 + this.skillData;
    }
}