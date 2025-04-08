// @ts-nocheck
import { FaceType, InheritIActionType } from "../../constant/BattleDefine";
import { BattleManager } from "../BattleManager";
import { ResourceModel } from "../data/ResourceModel";
import { BattleEffect } from "../skillsys/effect/BattleEffect";
import { SkillEffect } from "../skillsys/effect/SkillEffect";
import { BaseRoleView } from "../view/roles/BaseRoleView";
import { GameBaseAction } from "./GameBaseAction";
import ResMgr from "../../../core/res/ResMgr";
import { MovieClip } from "../../component/MovieClip";
import { PathManager } from "../../manager/PathManager";

/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 召唤 动作.
 **/
export class AwakenAppearAction extends GameBaseAction {
    public inheritType: InheritIActionType = InheritIActionType.AwakenAppearAction

    /**
     * 召唤怪出现的效果 
     */
    private _appearEffect: BattleEffect;
    /**
     * 召唤怪的数量 
     */
    private _count: number = 0;
    /**
    *BaseRoleInfo
    **/
    constructor(role) {
        super(false);
        this._currentRole = role;
        this._currentRole.addAction(this);

        var roleView: BaseRoleView = BattleManager.Instance.battleMap.rolesDict[role.livingId] as BaseRoleView
        roleView.visible = false;
        roleView.active = false;
        //设置召唤怪的朝向
        if (this._currentRole.face == FaceType.RIGHT_TEAM)
            this._currentRole.direction = "left";
        else
            this._currentRole.direction = "right";
    }
    /**
     * 准备好召唤怪出现的特效 
     * 
     */
    public prepare() {
        super.prepare();
        let effectName = ResourceModel.PublicSkill_Names[0];
        this._appearEffect = new SkillEffect(effectName);

        let mc = this._appearEffect.getDisplayObject() as MovieClip
        mc.x = this._currentRole.point.x;
        mc.y = this._currentRole.point.y;
        // 修正curCacheName
        mc.curCacheName = ResourceModel.PublicSkill_Prefix + effectName + "/"

        let fullUrl = PathManager.solveSkillPublicResPath(effectName)
        let resJson = ResMgr.Instance.getRes(fullUrl)
        // 修正pos_leg
        if (resJson && resJson.offset && resJson.offset.footX && resJson.offset.footY) {
            mc.pos_leg = new Laya.Point(Math.floor(resJson.offset.footX), Math.floor(resJson.offset.footY))
        }

        BattleManager.Instance.battleMap.addEffect(this._appearEffect);
    }
    public update() {
        this._count++;
        if (this._count >= 12) {
            var roleView: BaseRoleView = BattleManager.Instance.battleMap.rolesDict[this._currentRole.livingId] as BaseRoleView
            roleView.visible = true;
            roleView.active = true;
            this.finished = true;
        }
    }
}