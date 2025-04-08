/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 瞬移动作.
 * 该动作属于技能动作中的一个分支, 可与技能动作并行执行 
 **/
import { FaceType, InheritIActionType } from "../../constant/BattleDefine";
import { BattleManager } from "../BattleManager";
import { AttackData } from "../data/AttackData";
import { SkillEffect } from "../skillsys/effect/SkillEffect";
import { DisplacementFrameData } from "../skillsys/mode/framedata/FrameDatas";
import { BaseSkill } from "../skillsys/skills/BaseSkill";
import { BattleUtils } from "../utils/BattleUtils";
import { GameBaseAction } from "./GameBaseAction";

export class DisplacementAction extends GameBaseAction
{
    public inheritType:InheritIActionType = InheritIActionType.DisplacementAction

    private _frameData : DisplacementFrameData;
    private _count : number = 0
    private _skill : BaseSkill
    
	/**
	*role BaseRoleInfo
	**/
    constructor(role, frameData : DisplacementFrameData, skill : BaseSkill)
    {
        super()
        this._currentRole = role;
        this._frameData = frameData
        this._skill = skill
        this._currentRole.addConcurrentAction(this);//添加到可与技能动作队列并行执行的队列中
        
        if(!this._currentRole){
            this.finished = true;
            return;
        }
        this._currentRole.hideBody();//隐藏自己
        if(this._frameData.disappearEffect && this._frameData.disappearEffect != ""){
            this.addEffect(this._frameData.disappearEffect);
        }
    }
    public update()
    {
        this._count++;
        if(this._count >= this._frameData.persistentFrames){
            this._count = 0
            this.showBody();//显示自己
        }
    }
    
    private showBody()
    {
        this.finished = true;
        if(this._currentRole){
            if(this._frameData.isForward){
                this._currentRole.point = this.getAppearPointForward();
                this._currentRole.setAttactDirection();
            }else{
                this._currentRole.point = this.getAppearPointBack();
                this._currentRole.point = this._currentRole.point
            }
            
            this._currentRole.showBody()
            if(this._frameData.appearEffect && this._frameData.appearEffect != ""){
                this.addEffect(this._frameData.appearEffect);
            }
        }
    }
    /**
     * 添加瞬移效果 
     * @param effectName
     * 
     */		
    private addEffect(effectName : string)
    {
        let effect:SkillEffect = new SkillEffect(effectName);
        
        effect.getDisplayObject().x = this._currentRole.point.x;
        effect.getDisplayObject().y = this._currentRole.point.y;				
        if(this._currentRole.map){
            this._currentRole.map.addEffect(effect);
        }
    }
    /**
     * 取得瞬移前的位置 
     * @return 
     * 
     */		
    private getAppearPointForward():Laya.Point
    {
        let pt : Laya.Point
        let toRoleFace : number = this._currentRole.face==1?2:1
        if(this._frameData.target == 0){	
            let toRole : any
            let item : AttackData = (this._skill.getSkillData().data[0][0] as AttackData);
            toRole = BattleManager.Instance.battleModel.getRoleById(item.roleId);
            
            let resPt = BattleUtils.rolePointByPos(toRole.pos,toRoleFace)
            pt = new Laya.Point().copy(resPt)
            if(toRoleFace == FaceType.RIGHT_TEAM){
                pt.x -= this._frameData.offsetX
            }else{
                pt.x += this._frameData.offsetX
            };
        }else{
            let toPos:number = this._frameData.target;
            pt = BattleUtils.rolePointByPos(toPos,toRoleFace)
        }
        pt.y += this._frameData.offsetY
        return pt;
    }
    /**
     *  取得瞬移以后出现的位置
     * @return 
     * 
     */		
    private getAppearPointBack():Laya.Point
    {
        return BattleUtils.rolePointByPos(this._currentRole.pos,this._currentRole.face);
    }
    public dispose()
    {
        this.finished = true;
    }
}