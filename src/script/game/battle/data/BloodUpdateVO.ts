/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description  血量更新数据对象.
 * 该类用于存储血量更新信息.
 **/

export class BloodUpdateVO
{
    /**
     * 更新的血量（实际更新值, 当涉及到上限时, 此值会与displayBlood不相同）. 
     */		
    public blood : number = 0;
    /**
     * 要显示出来的更新的血量. 
     */		
    public displayBlood : number = 0;
    /**
     * 是否是暴击. 
     */		
    public havoc : boolean;
    /**
     * 掉血的类型(第一条血量还是第二条血量). 
     */		
    public type : number = 0;
    
    public selfCause : boolean;
    
    public defaultSkill : boolean;
    public parry : boolean;
}