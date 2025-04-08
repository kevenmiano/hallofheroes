// @ts-nocheck
/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/1/9 17:24
 * @ver 1.0
 */
export class TattooHole
{
    public index:number = 0;//8个孔, 取值为1-8
    public oldAddProperty:number = 0;////旧的增值属性, 1力量  2护甲 3智力 4体质 5统帅
    public oldAddingValue:number = 0;//
    public oldReduceProperty:number = 0;//旧的减值属性, 1力量  2护甲 3智力 4体质 5统帅
    public oldReduceValue:number = 0;//
    public newAddProperty:number = 0;//新的增值属性, 1力量  2护甲 3智力 4体质 5统帅
    public newAddingValue:number = 0;//
    public newReduceProperty:number = 0;//新的减值属性, 1力量  2护甲 3智力 4体质 5统帅
    public newReduceValue:number = 0;//
    public oldStep:number = 0;//旧的阶
    public newStep:number = 0;//新的阶

    public lastAddProperty:number = 0;////保存一下上一次的旧的增值属性, 1力量  2护甲 3智力 4体质 5统帅
    public lastAddingValue:number = 0;//
    public lastReduceProperty:number = 0;//保存一下上一次的旧的减值属性, 1力量  2护甲 3智力 4体质 5统帅
    public lastReduceValue:number = 0;//
    public lastOldStep:number = 0;//

    public isLockAdd:boolean = false;//是否锁定了增加的属性
    public isLockReduce:boolean = false;//是否锁定了减少的属性

    private _isLock:boolean = false;//当前龙纹是否解锁

    constructor()
    {
    }

    get isLock():boolean
    {
        return this._isLock;
    }

    set isLock(value:boolean)
    {
        this._isLock = value;
    }
}