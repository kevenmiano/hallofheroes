// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description 奥义效果的一个删减版, 去掉其中的一些特效,  用于宠物变身的前奏 
 **/

import ResMgr from "../../../../core/res/ResMgr";
import { MovieClip } from "../../../component/MovieClip";
import { ActionLabesType } from "../../../constant/BattleDefine";
import { PathManager } from "../../../manager/PathManager";
import { BattleManager } from "../../BattleManager";
import { BaseRoleInfo } from "../../data/objects/BaseRoleInfo";
import { ResourceModel } from "../../data/ResourceModel";
import { BaseRoleView } from "../../view/roles/BaseRoleView";
import { MovieClipEffect } from "./MovieClipEffect";
import { SkillEffect } from "./SkillEffect";

export class ProfoundEffectII {
    private _executer: BaseRoleView;
    private _callback: Function;

    private _executerEffect: MovieClipEffect;
    private _disperseEffect: MovieClipEffect;

    constructor(executer: BaseRoleView, callback: Function) {
        this._executer = executer;
        this._callback = callback;

        this.play();
    }

    private play() {
        let roleInfo = this._executer.info

        this._executerEffect = new SkillEffect(ResourceModel.PublicSkill_Names[3]);
        let mc = this._executerEffect.getDisplayObject() as MovieClip
        mc.curCacheName = ResourceModel.PublicSkill_Prefix + ResourceModel.PublicSkill_Names[3] + "/"
        // 挂点在人物中心点
        let spBodyPos = roleInfo.getSpecialPos(BaseRoleInfo.POS_BODY)
        let spLegPos = roleInfo.getSpecialPos(BaseRoleInfo.POS_LEG)
        mc.x = spBodyPos.x - spLegPos.x;
        mc.y = spBodyPos.y - spLegPos.y;
        let fullUrl = PathManager.solveSkillPublicResPath(ResourceModel.PublicSkill_Names[3])
        let resJson = ResMgr.Instance.getRes(fullUrl)
        // 修正pos_leg
        if (resJson && resJson.offset && resJson.offset.footX && resJson.offset.footY) {
            mc.pos_leg = new Laya.Point(Math.floor(resJson.offset.footX), Math.floor(resJson.offset.footY))
        }
        // 加入容器
        this._executer.effectContainer.addEffect(this._executerEffect);

        this._disperseEffect = new SkillEffect(ResourceModel.PublicSkill_Names[7]);
        mc = this._disperseEffect.getDisplayObject() as MovieClip
        mc.curCacheName = ResourceModel.PublicSkill_Prefix + ResourceModel.PublicSkill_Names[7] + "/"
        this.updateBgPosition();
        roleInfo.map.effectContainer.addEffect(this._disperseEffect);

        BattleManager.Instance.battleUIView.hideTopView();

        roleInfo.map.backGroundToColor(0xffffff, 0.4, 0.7, false, true);
        roleInfo.map.shakeScreen(1, 7);
        roleInfo.action(ActionLabesType.READY);
        setTimeout(this.completeFun.bind(this), 1000);
    }

    private completeFun() {
        if (this._callback != null) {
            this._callback();
            this._callback = null;
        }
        if (BattleManager.Instance.battleUIView) {
            BattleManager.Instance.battleUIView.showTopView();
        }

        this._executerEffect = null;
        this._disperseEffect = null;
        this._executer = null;
    }

    /**
     * 更新效果的背景的坐标.  
     * 
     */
    private updateBgPosition() {
        let pt: Laya.Point = new Laya.Point();
        pt.x = BattleManager.Instance.mainViewContainer.view.x;
        pt.y = BattleManager.Instance.mainViewContainer.view.y;

        pt = this._executer.info.map.effectContainer.globalToLocal(pt);
        pt.x = this._executer.x;
        pt.y = this._executer.y;

        pt = (this._executer.parent as Laya.Sprite).localToGlobal(pt)
        pt = (this._executer.info.map.effectContainer as Laya.Sprite).globalToLocal(pt);

        this._disperseEffect.getDisplayObject().x = pt.x;
        this._disperseEffect.getDisplayObject().y = pt.y;
    }
}