/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 10:24:06
 * @LastEditTime: 2024-04-28 10:18:46
 * @LastEditors: jeremy.xu
 * @Description: 战斗技能列表 
 */

import ConfigMgr from "../../../../../core/config/ConfigMgr";
import Logger from "../../../../../core/logger/Logger";
import { ArrayConstant, ArrayUtils } from "../../../../../core/utils/ArrayUtils";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { BattleCooldownModel } from "../../../../battle/data/BattleCooldownModel";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { BattleNotic } from "../../../../constant/event/NotificationEvent";
import { BattlePropItem } from "../../../../datas/BattlePropItem";
import { TrailPropInfo } from "../../../../datas/TrailPropInfo";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import NewbieModule from "../../../guide/NewbieModule";
import NewbieConfig from "../../../guide/data/NewbieConfig";
import { PetData } from "../../../pet/data/PetData";
import BattleWnd from "../../BattleWnd";
import { BattleSkillItemII } from "./BattleSkillItemII";
import { BattleTrailPropItem } from "./BattleTrailPropItem";
import { PropSkillBattleItem } from "./PropSkillBattleItem";
import { SkillItemListController } from "./SkillItemListController";;

export class SkillItemListView {
    public static TalentIndex = 6;
    public static TrailSkillCnt = 4;
    public static PropCnt = 3;

    /**
     * 战斗技能 包括符文
     */
    private _heroSkills: BattleSkillItemII[] = [];

    /**
     * 变身技能 
     */
    private _petSkills: BattleSkillItemII[] = [];

    /**
     * 所有的技能, 包括符文
     */
    private _skillItemViews: BattleSkillItemII[];

    /**
     * 战斗技能控制器 
     */
    private controller: SkillItemListController;

    /**
     * 整个技能栏是否可用, 兵根据该只决定技能栏显示状态 
     */
    private _enable: boolean = false;

    private _heroSkillData = [];
    private _petSkillData = [];
    public isPetSkill: boolean;

    private view: BattleWnd;
    constructor(view: BattleWnd) {
        this.view = view;
        this._skillItemViews = [];
        this.controller = new SkillItemListController(this);
    }
    /**
     * 初始化技能栏 
     * @param skills
     * 
     */
    public initView(skills: any[]) {
        if (!this.battleModel) return;
        this._heroSkillData = skills;

        Logger.battle("携带技能数据: ", skills);

        for (let i = 0; i < 10; i++) {
            let item: BattleSkillItemII;
            if (i < SkillItemListView.TalentIndex) {//前6个为普通技能
                let btnName = "itemSkill_" + (i + 1)
                let comp = this.view[btnName];
                item = new BattleSkillItemII(comp);
                item.index = i;
            } if (i == SkillItemListView.TalentIndex) {//第七个技能为天赋技能
                let comp = this.view["itemTalent"]
                item = new BattleSkillItemII(comp);
                item.index = i;
            } else {//后两个为符文技能
                let index
                if (i == 7) index = 1
                if (i == 8) index = 2
                if (i == 9) index = 3
                if (index) {
                    let comp = this.view["itemRune_" + index]
                    item = new PropSkillBattleItem(comp);
                    item.index = i;
                }
            }

            if (!item) return
            item.subIndex = i;
            item.numCount = i + 1;
            if (i == SkillItemListView.TalentIndex && this.battleModel.isLockTalent) {
                (<BattleSkillItemII>item).enabled = false;
                (<BattleSkillItemII>item).setState(BattleSkillItemII.STATE_LOCK);
            } else {
                item.enabled = true;
                if (this.checkNotShowHeroSkill(i)) {
                    item.data = null;
                } else {
                    item.data = skills[i];
                }
            }
            let talentCtrl = this.view.getController("cTalent");
            if (talentCtrl) {
                talentCtrl.selectedIndex = this.battleModel.isLockTalent ? 0 : 1;
            }
            this._skillItemViews.push(item);
            this._heroSkills.push(item);
            item.setClicked(this.__skillClick.bind(this))
        }

        //试练技能 & 随机BOSS技能 & 新天穹之径 & 新永恒之战& 阿瑞斯之战 & 外域泰坦
        // if (this.battleModel.isTrail() || this.battleModel.isRandomBoss()
        //     || this.battleModel.isSkyboxRoad() || this.battleModel.isMateLords()
        //     || this.battleModel.isAresLords() || this.battleModel.isOutyardTitan()
        //     || this.battleModel.isCrossGuild()) 
        this.view.skill_trail.visible = false;
        if (this.battleModel.isTrail()) {
            if (this.battleModel.selfHero) {
                this.view.skill_trail.visible = true;
                var list = this.battleModel.selfHero.trialProps;
                list = ArrayUtils.sortOn(list, ["index"], ArrayConstant.NUMERIC);
                Logger.battle("携带试炼技能", list);
                for (let i = 0; i < list.length; i++) {
                    let btnName = "itemExtraSkill_" + (i + 1)
                    let comp = this.view[btnName];
                    let item = new BattleTrailPropItem(comp);
                    item.index = i;
                    item.setClicked(this.__skillClick.bind(this))
                    item.data = list[i];
                    this._skillItemViews.push(item);
                }
            }
        }
    }

    private checkNotShowHeroSkill(itemIndex: number) {
        let b = itemIndex == 1 && !NewbieModule.Instance.checkNodeFinish(NewbieConfig.NEWBIE_70)
        if (b) {
            Logger.battle("还未引导获得第二个技能, 不显示")
        }
        return b
    }

    public updateTalentSkill(info: t_s_skilltemplateData) {
        let item = this._skillItemViews[SkillItemListView.TalentIndex] as BattleSkillItemII;
        item.data = info;
    }

    public initCD() {
        let cdInfos: any[] = this.battleModel.cooldownInfo;
        Logger.battle("[SkillItemListView]initCD", cdInfos);
        if (cdInfos) {//初始化所有技能的cd时间
            cdInfos.forEach((cdMode: BattleCooldownModel) => {
                let cooldown: number = Math.max(cdMode.cooldown, cdMode.appearCoolDown);
                if (cooldown > 0) {
                    // cdMode.stop();
                    this.startCD(cdMode.templateId, 0, cooldown * 1000);
                }
            });
        }
    }

    public refreshCD() {
        let cdInfos: any[] = this.battleModel.cooldownInfo;
        if (cdInfos) {//初始化所有技能的cd时间
            cdInfos.forEach((cdMode: BattleCooldownModel) => {
                let cooldown: number = Math.max(cdMode.cooldown, cdMode.appearCoolDown);
                if (cooldown > 0) {
                    cdMode.stop();
                    this.startCD(cdMode.templateId, 0, cooldown * 1000);
                }
            });
        }
    }

    public initPetSkills(arr: any[]/* of skillId*/) {
        if (!arr) return;
        this._petSkills = [];
        this._petSkillData = arr;
    }

    public switchSkills(isPetSkill: boolean) {
        this.isPetSkill = isPetSkill;
        let skillDatalist = []
        if (isPetSkill) {
            skillDatalist = this._petSkillData;
        } else {
            skillDatalist = this._heroSkillData;
        }
        // Logger.battle("[SkillItemListView]switchSkills isPetSkill:", isPetSkill, skillDatalist)
        for (let index = 0; index < this._skillItemViews.length; index++) {
            let item = this._skillItemViews[index];
            let skillData = skillDatalist[index];
            item.isPetSkill = isPetSkill;
            if (index < SkillItemListView.TalentIndex) {
                if (this.checkNotShowHeroSkill(index)) {
                    item.data = null;
                } else {
                    item.data = skillData;
                }
                item.resetCD();
            }
        }
        this.startAppearCd()
        this.initCD()
        NotificationManager.Instance.sendNotification(BattleNotic.BUFFER_SKILL_ENABLE);
        if (isPetSkill) {

        } else {
            // v1.7被动改版 v1.6原先有一个被动技能每次加怒气 刷新技能可用状态
            //【ID1037120】【英灵】手动取消变身会, 卡2~3回合无法使用技能
            this.setEnable(true);
        }
    }

    public startAppearCd() {
        this._heroSkills.forEach((item: BattleSkillItemII) => {
            if (item.view.visible) {
                item.startAppearCD();
            }
        });
        this._petSkills.forEach((item: BattleSkillItemII) => {
            if (item.view.visible) {
                item.startAppearCD();
            }
        });
    }

    /**
     * 指定的技能开始cd计时 
     * @param skillId 技能模板id
     * @param waitTime
     * @param cd
     * 
     */
    public startCD(skillId: number, waitTime: number = 0, cd: number = -1, cdType: number = 0) {
        let isProp: boolean = false;
        let vec: BattleSkillItemII[] = this.getItemViewBySkillId(skillId);
        if (vec.length > 0) {
            vec.forEach((item: BattleSkillItemII) => {
                if (item instanceof PropSkillBattleItem) {
                    isProp = true;
                }
                item.startCD(waitTime, cd);
            });
        }
        if (isProp) {
            this.startPropPublicCD(skillId, waitTime, cd);
        }
    }

    private startPropPublicCD(skillId: number, waitTime: number = 0, cd: number = -1) {
        let publicCd: number = Number(TempleteManager.Instance.getConfigInfoByConfigName("RuneCommonCD").ConfigValue);
        for (let index = 0; index < this._skillItemViews.length; index++) {
            const item = this._skillItemViews[index];
            if (item instanceof PropSkillBattleItem) {
                if (!item.data) continue;
                if ((<BattlePropItem>item.data).skillTempId != skillId) {
                    (<PropSkillBattleItem>item).startPublicCD(waitTime, publicCd);
                }
            }
        }
    }

    /**
     * 不要主动掉用
     * 不要在这里加条件过滤
     * @param target 
     * @param data 
     */
    private __skillClick(target: BattleSkillItemII, data: any) {
        if (this._skillItemViews) {
            this._skillItemViews.forEach((skill: BattleSkillItemII) => {
                skill.selected(skill == target);
            });
        }
        this.setEnable(false)
        NotificationManager.Instance.sendNotification(BattleNotic.ACTION_SKILL, data);
    }
    /**
     * 根据技能id取得相关技能对象, 同一个id可能会存在多个技能显示对象 
     * 如果是符文技能, 则相同类型的符文技能都要进入冷却
     * @param skillId
     * @return 
     * 
     */
    private getItemViewBySkillId(skillId: number): BattleSkillItemII[] {
        let vec: BattleSkillItemII[] = [];
        this._skillItemViews.forEach((item: BattleSkillItemII) => {
            if (item.data instanceof BattlePropItem) {
                if ((<BattlePropItem>item.data).skillTempId == skillId) vec.push(item);
            } else {
                let itemSkill: number = this.getSkillId(item.data);
                if (itemSkill == skillId) {
                    vec.push(item);
                }
                if (item.data instanceof t_s_skilltemplateData && skillId == (<t_s_skilltemplateData>item.data).Parameter3) {//使用qte以后, 收到的技能id为qte技能id, 原id为p3字段
                    vec.push(item);
                }
            }
        });
        return vec;
    }

    private getSkillId(data: any): number {
        let skillId: number = -1;
        if (data instanceof t_s_skilltemplateData) {
            skillId = (data as t_s_skilltemplateData).TemplateId;
        } else if (data instanceof TrailPropInfo) {
            skillId = (data as TrailPropInfo).id;
        }
        return skillId;
    }

    public get enable(): boolean {
        return this._enable;
    }
    /**
     * 强制使技能栏失效 ,过滤复活技能
     * @param value
     */
    public setEnableForce(value: boolean) {
        this.setEnable(value);
        this._skillItemViews.forEach((element: BattleSkillItemII) => {
            if ((element.data instanceof TrailPropInfo) && (<TrailPropInfo>element.data).skillTemp.IsUseOnDead == 1 && (<TrailPropInfo>element.data).useCount > 0) {//如果该技能为复活技能, 则自己死亡时可用
                let self: any = BattleManager.Instance.getSelfRoleView();
                if (self && self.info) {
                    element.enabled = true;
                }
            }
        });
    }
    /**
     * 设置所有技能的可使用状态 
     * @param value
     */
    public setEnable(value: boolean) {
        if (BattleManager.Instance.battleModel.isControledByBoss()) {//泰拉神庙副本里面boss控制了玩家, 持续时间内技能不可用
            this.setBeControled();
            return;
        }
        let isWait: boolean = BattleManager.Instance.battleModel.selfHero.isWaitingChangeBody;
        if (value == this._enable || (value && isWait)) {
            return;
        }
        this._enable = value;
        for (let index = 0; index < this._skillItemViews.length; index++) {
            const element: BattleSkillItemII = this._skillItemViews[index];
            if (element.isLock) continue;
            if (element.data) {
                if (this._enable && element.data.hasOwnProperty("useCount") && element.data.useCount <= 0) {
                    continue;
                }
                element.parentEnable = this._enable;
                element.enabled = this._enable;
            }
        }
        this.refreshForSpChanged();
        this.refreshForAwakenValueChanged();
    }

    /**
         * 强制使技能栏失效 ,过滤复活技能
         * @param value
         * 
         */
    public setBeControled(): void {
        this._skillItemViews.forEach((element: BattleSkillItemII) => {
            if (element.data) {
                element.parentEnable = false;
                element.setState(BattleSkillItemII.STATE_GRAY);
            }
        });
    }
    /**
     * 根据英雄的愤怒值刷新技能的(可用或不可用)状态
     */
    public refreshForSpChanged() {
        if (this.isPetSkill) return;
        if (this.battleModel) {
            let self: HeroRoleInfo = this.battleModel.selfHero;
            if (self && self.totalBloodA <= 0) {
                return;
            }
        }
        let skillTInfo: t_s_skilltemplateData
        let skillId: number = 0;
        for (let index = 0; index < this._heroSkills.length; index++) {
            const item: BattleSkillItemII = this._heroSkills[index];
            if (item.isLock) continue;

            skillId = this.getSkillId(item.data);
            skillTInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, skillId.toString())
            if (!skillTInfo) continue;

            if (item.bufferUnEnable) {
                item.enabled = false;
                item.setState(BattleSkillItemII.STATE_GRAY);
                continue;
            }
            if (this._enable) {
                if (this.battleModel.selfHero.sp + skillTInfo.Cost < 0) {
                    item.setState(BattleSkillItemII.STATE_GRAY);
                }
                else {
                    item.enabled = true;
                }
            } else {
                if (this.battleModel.selfHero.sp + skillTInfo.Cost < 0) {
                    item.setState(BattleSkillItemII.STATE_GRAY);
                }
            }
        }
    }

    /**
     *  根据英雄的觉醒值刷新觉醒技能的(可用或不可用)状态
     * 
     */
    public refreshForAwakenValueChanged() {
        if (!this.isPetSkill) return;

        let self: HeroRoleInfo;
        if (this.battleModel) {
            self = this.battleModel.selfHero;
            if (self && self.totalBloodA <= 0) {
                return;
            }
        }
        let skillTInfo: t_s_skilltemplateData
        let skillId: number = 0;
        for (let index = 0; index < PetData.CHANGE_SKILL_NUM; index++) {
            const item: BattleSkillItemII = this._heroSkills[index];
            if (item.isLock) continue;

            skillId = this.getSkillId(item.data);
            skillTInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, skillId.toString())
            if (!skillTInfo) {
                continue;
            }
            if (item.bufferUnEnable) {
                item.enabled = false;
                item.setState(BattleSkillItemII.STATE_GRAY);
                continue;
            }
            if (this._enable) {
                if (!self.isPetState || this.battleModel.selfHero.awaken + skillTInfo.Cost < 0) {
                    item.enabled = false;
                    item.setState(BattleSkillItemII.STATE_GRAY);
                }
                else {
                    item.enabled = true;
                    item.setState(BattleSkillItemII.STATE_NORMAL);
                }
            } else {
                if (this.battleModel.selfHero.awaken + skillTInfo.Cost < 0) {
                    item.setState(BattleSkillItemII.STATE_GRAY);
                } else {
                    item.setState(BattleSkillItemII.STATE_NORMAL);
                }
            }
        }
    }

    public getItemView(data: any): BattleSkillItemII {
        for (let index = 0; index < this._skillItemViews.length; index++) {
            const item: BattleSkillItemII = this._skillItemViews[index];
            if (item.data == data) {
                return item;
            }
        }
        return null;
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public get skillItemViews(): BattleSkillItemII[] {
        return this._skillItemViews;
    }

    public dispose() {
        this.controller.dispose();
        this.controller = null;
        this._skillItemViews.forEach(item => {
            ObjectUtils.disposeObject(item);
        });
        this._skillItemViews = null;
        this._heroSkills = null;
        this._petSkills = null;
    }
}