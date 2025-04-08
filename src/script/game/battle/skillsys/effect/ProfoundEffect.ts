// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description 奥义效果.
 **/

import { ActionLabesType } from "../../../constant/BattleDefine";
import { BattleManager } from "../../BattleManager";
import { BaseRoleView } from "../../view/roles/BaseRoleView";
import { SkillEffect } from "./SkillEffect";

export class ProfoundEffect {
    private _executer: BaseRoleView;
    private _callback: Function;

    private _executerEffect: SkillEffect;
    private _disperseEffect: SkillEffect;
    private _timeId: any = 0;
    /**
    * 构造函数. 
    * @param executer 执行者,指施法奥义的角色视图.
    * @param callback 奥义播放完后的回调方法.
    * 
    */
    constructor(executer: BaseRoleView, callback: Function) {
        this._executer = executer;
        this._callback = callback;

        this.play();
    }

    private play() {
        let roleInfo = this._executer.info

        // this._executerEffect = new SkillEffect(ResourceModel.PublicSkill_Names[2]);
        // let mc = this._executerEffect.getDisplayObject() as MovieClip
        // mc.curCacheName = ResourceModel.PublicSkill_Prefix + ResourceModel.PublicSkill_Names[2] + "/"
        // // 挂点在人物中心点
        // let spBodyPos = roleInfo.getSpecialPos(BaseRoleInfo.POS_BODY)
        // let spLegPos = roleInfo.getSpecialPos(BaseRoleInfo.POS_LEG)
        // mc.x = spBodyPos.x - spLegPos.x;
        // mc.y = spBodyPos.y - spLegPos.y;
        // let fullUrl = PathManager.solveSkillPublicResPath(ResourceModel.PublicSkill_Names[2])
        // let resJson = ResMgr.Instance.getRes(fullUrl)
        // // 修正pos_leg
        // if (resJson && resJson.offset && resJson.offset.footX && resJson.offset.footY) {
        //     mc.pos_leg = new Laya.Point(Math.floor(resJson.offset.footX), Math.floor(resJson.offset.footY))
        // }
        // this._executer.effectContainer.addEffect(this._executerEffect, -1);

        // this._disperseEffect = new SkillEffect(ResourceModel.PublicSkill_Names[4]);
        // mc = this._disperseEffect.getDisplayObject() as MovieClip
        // mc.curCacheName = ResourceModel.PublicSkill_Prefix + ResourceModel.PublicSkill_Names[4] + "/"
        // roleInfo.map.effectContainer.addEffect(this._disperseEffect);

        // this._executer.scaleX = this._executer.scaleY = BattleModel.AWAKEN_SCALE;
        BattleManager.Instance.battleUIView.hideTopView();

        roleInfo.map.backGroundToColor(0xffffff, 0.1, 0.7, false, true);
        // roleInfo.map.shakeScreen(1, 7);
        roleInfo.action(ActionLabesType.READY);

        this._timeId = setTimeout(this.completeFun.bind(this), 100);
    }

    private completeFun() {
        if (this._timeId > 0) {
            clearTimeout(this._timeId);
            this._timeId = 0;
        }
        if (this._callback != null) {
            this._callback();
        }
        // this._executer.scaleX = this._executer.scaleY = BattleModel.DEFAULT_SCALE;
        BattleManager.Instance.battleUIView.showTopView();
    }
}