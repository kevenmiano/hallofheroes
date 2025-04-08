/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 17:43:04
 * @LastEditTime: 2024-02-02 14:38:40
 * @LastEditors: jeremy.xu
 * @Description: 战斗底部ui 
 */

import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import { BattleEvent, RoleEvent } from "../../../../constant/event/NotificationEvent";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { SharedManager } from "../../../../manager/SharedManager";
import BattleWnd from "../../BattleWnd";
import { SkillItemListView } from "../skill/SkillItemListView";
import { SelfAwakenView } from "./SelfAwakenView";
import { SelfBloodView } from "./SelfBloodView";
import { SelfSpView } from "./SelfSpView";
import { SelfBufferView } from "../buffer/SelfBufferView";
import Logger from "../../../../../core/logger/Logger";

export class BottomBar {
    // 英雄血量
    private _selfBloodView: SelfBloodView;
    // 英雄怒气
    private _selfSpView: SelfSpView;
    // 英雄buffer列表 
    private _bufferContainer: SelfBufferView;
    // 技能列表 
    private _skillList: SkillItemListView;
    // 英雄觉醒
    private _leftAwakenFigure: SelfAwakenView;

    private _selfInfo: HeroRoleInfo;
    private _battleModel: BattleModel;

    private view: BattleWnd;
    constructor(view: BattleWnd) {
        this.view = view

        this._battleModel = BattleManager.Instance.battleModel;
        this._selfInfo = this._battleModel.selfHero;

        this._selfBloodView = new SelfBloodView(this.view);
        this._selfSpView = new SelfSpView(this.view);
        this._skillList = new SkillItemListView(this.view);
        this._bufferContainer = new SelfBufferView(this.view);

        this.initAwakenView();
        // this.setBallRotation(SharedManager.Instance.allowSceneEffect)

        this.onHeroSpChanged(null);
        this.switchSkills(this._selfInfo && this._selfInfo.isPetState);
        this.addEvent();
    }


    private addEvent() {
        if (this._selfInfo) {
            this._selfInfo.addEventListener(RoleEvent.SP, this.onHeroSpChanged, this);
            this._selfInfo.addEventListener(RoleEvent.MORPH, this.__morphHandler, this);
        }
        NotificationManager.Instance.addEventListener(BattleEvent.SCENE_EFFECT_CLOSE, this.onSceneEffecCloseHandler, this);
    }

    private removeEvent() {
        if (this._selfInfo) {
            this._selfInfo.removeEventListener(RoleEvent.SP, this.onHeroSpChanged, this);
            this._selfInfo.removeEventListener(RoleEvent.MORPH, this.__morphHandler, this)
        }
        NotificationManager.Instance.removeEventListener(BattleEvent.SCENE_EFFECT_CLOSE, this.onSceneEffecCloseHandler, this);
        
    }

    public getSpGlobalPos(): Laya.Point {
        return new Laya.Point();
    }

    private initAwakenView() {
        if (!ArmyManager.Instance.thane.templateInfo) return

        let job: number = ArmyManager.Instance.thane.templateInfo.Job;
        this._leftAwakenFigure = new SelfAwakenView(this.view, job);
    }

    private onSceneEffecCloseHandler(event: Event) {
        // this.setBallRotation(false);
    }

    private setBallRotation(value: boolean) {
        // if (this._selfBloodView) {
        //     this._selfBloodView.setRotation(value);
        // }
        // if (this._selfSpView) {
        //     this._selfSpView.setRotation(value);
        // }
    }

    private onHeroSpChanged(evt: any) {
        if (this._selfInfo && this._selfSpView) {
            let battleModel = BattleManager.Instance.battleModel
            let destSp = battleModel.selfHero.sp;
            let maxSp = battleModel.selfHero.spMax;
            var percent: number = destSp / maxSp;
            this._selfSpView.updateHeroSp(percent, destSp, maxSp);
        }
    }

    private __morphHandler(e: Event) {
        if (!this._selfInfo) return;
        Logger.battle("切换变身技能 :" + this._selfInfo.isPetState);
        this.switchSkills(this._selfInfo.isPetState);
    }

    /**  切换技能 */
    public switchSkills(isPetSkill: boolean) {
        this._skillList.switchSkills(isPetSkill);
    }

    public get skillList(): SkillItemListView {
        return this._skillList;
    }
    public get selfBloodView(): SelfBloodView {
        return this._selfBloodView;
    }
    public get leftAwakenFigure(): SelfAwakenView {//新手用
        return this._leftAwakenFigure;
    }

    public dispose() {
        this.removeEvent();

        if (this._leftAwakenFigure) { this._leftAwakenFigure.dispose(); this._leftAwakenFigure = null; }
        if (this._skillList) { this._skillList.dispose(); this._skillList = null; }
        if (this._bufferContainer) { this._bufferContainer.dispose(); this._bufferContainer = null; }
    }
}