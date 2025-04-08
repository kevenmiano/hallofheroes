// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description  
 **/

export class DamageData
{
    /**
     * 伤害处理类型 
     */		
    public bloodType :number;
    /**
     * 伤害值 
     */		
    public damageValue:number;
    /**
     * 显示的伤害值 
     */		
    public displayBlood :number;
    /**
     * 剩余生命值 
     */		
    public leftValue:number;
    /**
     * 是否暴击 0x0001 
     */		
    public extraData:number;
    /**
     * 目标ID 
     */		
    public target :number;
    /**
     * 是否是格档 
     */		
    public parry : boolean;
    /**
     * 掉落列表 
     */		
    public dropList:Array<any> = [];
    /**
     * 第几次伤害时 
     */		
    public damageCount:number;
    
    /** 增加的生命上限 */
    public hpMaxAdd:number = 0;
    // public isExecuted:boolean = false;
    // public skillData:SkillData;
}
