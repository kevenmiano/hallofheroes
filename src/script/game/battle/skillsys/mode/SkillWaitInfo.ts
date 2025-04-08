/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description  技能等待相关的信息类.
 * 当遇到需要等待执行(到了执行时间而又不能执行时,如要攻击的对象正在行走时), 将会创建技能等待信息对象.
 * 对于后继接收到的技能,会根据等待信息相应地调整技能的生效时间.
 * 详见SkillSystem.
 **/

export class SkillWaitInfo
{
    public roleId : number = 0;
    public count : number = 0;
    
    private _completeFun : Function;

    /**
     * 启动倒计时. 
     * @param completeFun
     */		
    countDown(completeFun : Function)
    {
        this._completeFun = completeFun;
        Laya.timer.once(300, this, this.onComplete);
    }

    onComplete(){
        this._completeFun(this);
    }

    clear(){
        Laya.timer.clear(this, this.onComplete);
    }
}