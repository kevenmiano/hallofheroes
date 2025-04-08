// @ts-nocheck
/**
* @author:jeremy.xu
* @data: 2020-11-23 10:00
* @description 动作表现类型.
* 根据表现大致分为以下几种类型:1、普通施法（含移动+攻击+移动）；2、射箭；
*/
export class ActionPresentType
{
    /**
     * 普通施法动作 
     */		
    public static COMMON_ACTION : number = 1;
    
    /**
     * 射箭类动作 
     */		
    public static SHOOT_ACTION : number = 2;
}

/**
 * description : 该类是技能帧的类型的枚举类.
 **/
export class SkillFrameType
{
    /**
     * 向前移动. 
     */		
    public static MOVE_FORWARD : number = 0;
    
    /**
     * 回退移动. 
     */		
    public static MOVE_BACK : number = 100;

    /**
     * 播放攻击动作. 
     */		
    public static PLAY_ATTACK_ACTION : number = 1;

    /**
     * 添加施法效果
     */		
    public static ADD_RELEASE_EFFECT : number = 2;

    /**
     * 添加受伤 
     */		
    public static ADD_DANNY : number = 3
    
    /**
     * 缩放地图 
     */			
    public static ZOOM : number = 4
        
    /**
     * 气浪特效 
     */			
    public static GAS_EFFECT : number = 5
        
    /**
     * 背景变色. 
     */			
    public static BG_COLOR : number = 6
        
    /**
     * 地图震动. 
     */		
    public static BG_SHOCK : number = 7;
        
    /**
     * 射箭 
     */			
    public static SHOOT : number = 11
        
    /**
     * 射箭2(带涟漪效果） 
     */		
    public static SHOOT2 : number = 12
        
    /**
     * 向前跳
     */		
    public static JUMP_FORWARD : number = 21

    /**
     * 向后跳
     */		
    public static JUMP_BACK : number = 22

    /**
     * 向前瞬移
     */		
    public static DISPLACEMENT_FORWARD : number = 23
        
    /**
     * 向后 瞬移
     */		
    public static DISPLACEMENT_BACK : number = 24
    
    /**
     * 隐藏攻击对象(或自身)
     */			
    public static HIDE : number = 25
        
    /**
     * 完成动作常量 
     */			
    public static FINISH : number = 99;
}


/**
 **	技能类型
 **/
export class SkillType
{
    public static FASTATTACK	:number = 1 ;       //	突击
    public static COUNTERATTACK	:number = 2 ;       //	反击
    public static SUCCESS		:number = 3 ;       //	胜利
    public static FAILED		:number = 4 ;       //	失败
    
    public static SPECIAL_SKILL	:number = 105 ;     //	特殊技能（针对新手第一场站斗中释放大法时需在英雄脚下加蓄力效果的需求）
    
}


export class SkillPriorityType
{
    /**
     *奥义 
     */		
    public static SUPER_SKILL:number= 3;
    
    public static SUPER_SKILL_PET:number= 4;
    
    /**
     * 是否显示奥义标示 
     * @param p
     * @return 
     * 
     */        
    public static isSuperSkill(p:number):boolean {
        return (p == SkillPriorityType.SUPER_SKILL);
    }

    public static isPetSuperSkill(p:number):boolean {
        return (p == SkillPriorityType.SUPER_SKILL_PET);
    }
}