// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 移动策略类基类。
 **/
import { FaceType } from "../../../../constant/BattleDefine";
import { BattleManager } from "../../../BattleManager";
import { AttackData } from "../../../data/AttackData";
import { SkillData } from "../../../data/SkillData";
import { BattleUtils } from "../../../utils/BattleUtils";
import { MoveFrameData } from "../../mode/framedata/FrameDatas";
import { BaseSkill } from "../BaseSkill";
import { IMoveStrategy } from "./IMoveStrategy";

export class BaseMoveStrategy implements IMoveStrategy {
    protected _skill: BaseSkill
    protected _startMoveFun: Function;
    protected _endMoveFun: Function
    constructor(skill: BaseSkill, startMoveFun: Function, endMoveFun: Function) {
        this._skill = skill;
        this._startMoveFun = startMoveFun;
        this._endMoveFun = endMoveFun;
    }

    public execute() {
        // BattleLogSystem.skillProgress(this._skill, 2);
    }


    /**
     * 获得攻击目标RoleInfo 
     * @return 
     * 
     */
    protected getToRole(): any {
        if (this.getSkillData().data.length < 1 || this.getSkillData().data[0].length < 1) {
            return null;
        }
        let item: AttackData = this.getSkillData().data[0][0];
		//	BaseRoleInfo
        let toRole: any = BattleManager.Instance.battleModel.getRoleById(item.roleId);
        return toRole;
    }

    /**
     * 获得向前移动的目的坐标点. 
     * @param role 目标角色.  BaseRoleInfo
     * @return 
     * 
     */
    protected getMoveForwardPoint(role: any): Laya.Point {
        let moveFrameData: MoveFrameData = this.getMoveForwardFrameData();
        let pos: number = 0;
        // if (moveFrameData.target)
        //     pos = moveFrameData.target;
        // else
        //     pos = role.pos;
        if (moveFrameData.target == 0)
            pos = role.pos;
        else
            pos = moveFrameData.target;

        let pt = new Laya.Point()
        pt.copy(BattleUtils.rolePointByPos(pos, role.face))
        if (this._skill.getCurrentRole().face == FaceType.LEFT_TEAM) {
            pt.x -= moveFrameData.distance;
        } else {
            pt.x += moveFrameData.distance;
        }
        return pt;
    }

    /**
     * 获得向后移动的目的坐标点. 
     * @return 
     * 
     */
    protected getMoveBackPoint(): Laya.Point {
        return BattleUtils.rolePointByPos(this._skill.getCurrentRole().pos, this._skill.getCurrentRole().face);
    }

    /**
     * 获得技能数据. 
     * @return 
     * 
     */
    protected getSkillData(): SkillData {
        return this._skill.getSkillData()
    }


    /**
     * 获得向前移动的帧数据. 
     * @return 
     * 
     */
    protected getMoveForwardFrameData(): MoveFrameData {
        return this._skill.getActionTemplate().getMoveForwardData(this._skill.getRoleSex()).moveForwardData
    }

    /**
     * 获得向后移动的帧数据. 
     * @return 
     * 
     */
    protected getMoveBackFrameData(): MoveFrameData {
        return this._skill.getActionTemplate().getMoveBackData(this._skill.getRoleSex()).moveBackData;
    }
}