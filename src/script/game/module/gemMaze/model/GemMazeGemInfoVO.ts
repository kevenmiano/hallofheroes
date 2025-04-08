// @ts-nocheck
/**
 * 夺宝奇兵 宝石数据 
 */
 export default class GemMazeGemInfoVO{
    private  _index:number; 
    private  _type:number; //宝石类型 1-5 
    
    public  isRemove:Boolean = false; //是否是需要消除的宝石
    public  isAdd:Boolean = false; //是否是新增的宝石
    public  isMove:Boolean = false; //是否是需要移动的宝石

    public  nextIndex:number; //-1 表示将要消除 
    
    constructor(){

    }

    public  get type():number
    {
        return this._type;
    }

    public  set type(value:number)
    {
        this._type = value;
    }

    public  get index():number
    {
        return this._index;
    }

    public  set index(value:number)
    {
        this._index = value;
    }

 }