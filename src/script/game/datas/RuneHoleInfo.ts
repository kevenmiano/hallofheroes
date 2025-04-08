// @ts-nocheck
import LangManager from "../../core/lang/LangManager";
import { BagType } from "../constant/BagDefine";
import { EmWindow } from "../constant/UIDefine";
import { GoodsManager } from "../manager/GoodsManager";
import { TempleteManager } from "../manager/TempleteManager";
import SkillWndCtrl from "../module/skill/SkillWndCtrl";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { SkillInfo } from "./SkillInfo";
import { GoodsInfo } from "./goods/GoodsInfo";

export class RuneHoleInfo {

    public name: string;

    private _holeId: number;

    public exp: number;

    public skill: number;

    private _pos: string = "";

    public grade: number = 0;

    public tempSkillId: number = 0;

    private runes: number[] = [0, 0, 0, 0, 0];

    private catchGoodInfo: { [key: number]: GoodsInfo } = {};

    private _tempSkillInfo: SkillInfo;

    private _skillInfo: SkillInfo;

    public opened = false;

    public get holeId() {
        return this._holeId;
    }

    public set holeId(id) {
        this._holeId = id
        this.name = LangManager.Instance.GetTranslation("runeHole.holeName" + id);
    }

    public set pos(pos: string) {
        this._pos = pos;
        let runes = this._pos.split(",");
        this.runes = [];
        for (let rune of runes) {
            this.runes.push(+rune);
        }
    }

    /**return 0 未解锁, -1 未装备***/
    public getRuneByPos(pos: number): number | GoodsInfo {
        let id = this.runes[pos];
        if (id == 0 || id == -1) {
            return id;
        }
        // 不在进行缓存
        // let goodInfo: GoodsInfo = this.catchGoodInfo[pos];

        // if (!goodInfo || goodInfo.id != id) {
        let goodInfo = GoodsManager.Instance.getGoodsByBagTypeAndId(BagType.RUNE_EQUIP, id);
        // this.catchGoodInfo[pos] = goodInfo;
        // }
        return goodInfo;
    }
    //所有符石位是否打开
    public checkOpenAllRune() {
        for (let rune of this.runes) {
            if (rune == 0) return false;
        }
        return true;
    }
    //符孔雕刻技能
    public getRuneActivation(skillId = this.skill) {
        return TempleteManager.Instance.getRuneActivationBySkillId(skillId);
    }

    public getSkillInfo() {
        if (!this.skill) return null;
        if (!this._skillInfo) {
            this._skillInfo = new SkillInfo();
        }
        this._skillInfo.templateId = this.skill;
        return this._skillInfo;
    }

    public getTempSkillInfo() {
        if (!this.tempSkillId) return null;
        if (!this._tempSkillInfo) {
            this._tempSkillInfo = new SkillInfo();
        }
        this._tempSkillInfo.templateId = this.tempSkillId;
        return this._tempSkillInfo;
    }

    //加成值
    public getBonusValue() {
        let upgrade = this.getUpgrade()
        if (!upgrade) return 0;
        return upgrade.TemplateId / 100;
    }

    public getUpgrade(grade = this.grade) {
        let arr = TempleteManager.Instance.getTemplatesByType(201);
        let curUpgrade = arr[grade - 1];
        return curUpgrade;
    }
    //下一级
    public getNextUpgrade() {
        let arr = TempleteManager.Instance.getTemplatesByType(201);
        let curUpgrade = arr[this.grade];
        return curUpgrade;
    }
    //当前技能 解锁条件
    public getSkillCondition() {
        let activation = this.getRuneActivation();
        let ctrl = (FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl)
        return ctrl.parseProperty(activation);
    }
    //替换技能 解锁条件
    public getTempSkillCondition() {
        let activation = this.getRuneActivation(this.tempSkillId);
        let ctrl = (FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl)
        return ctrl.parseProperty(activation);
    }

    //符孔属性
    public getHoldProperty() {
        let allPropertys: { [key: string]: number }[] = [];
        let ctrl = (FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl)
        for (let pos = 0; pos < 5; pos++) {
            let temp = this.getRuneByPos(pos);
            if (temp instanceof GoodsInfo) {
                allPropertys.push(ctrl.parsePropertyByGoodsInfo(temp));
            }
        }

        let theSameProperty = ctrl.concatSameProperty(allPropertys);
        return theSameProperty;
    }
    //技能是否满足解锁条件
    public get isSkillOpen() {
        if (!this.skill) return false;
        let condition = this.getSkillCondition();
        let holdProperty = this.getHoldProperty();
        let bonus = this.getBonusValue();
        let nvalue = 0;
        let cvalue = 0;
        for (let p in condition) {
            nvalue = (holdProperty[p] * (1 + bonus)) >> 0 || 0;
            cvalue = condition[p];
            if (nvalue < cvalue) return false;
        }
        return true;
    }

    public getHoldOpenLevel() {
        RuneHoleInfo.RuneHoleOpenLevel[this._holeId - 1];
    }


    private static _openLevel: string[];
    private static _openCost: string[];
    public static get RuneHoleOpenLevel() {
        if (!this._openLevel) {
            this._openLevel = TempleteManager.Instance.getConfigInfoByConfigName("RuneHole_OpenLevel").ConfigValue.split(",")
        }
        return this._openLevel
    }

    public static get RuneOpenCost() {
        if (!this._openCost) {
            this._openCost = TempleteManager.Instance.getConfigInfoByConfigName("RuneOpen_Cost").ConfigValue.split(",")
        }
        return this._openCost
    }

    public static get EffectEngravingCost() {
        return TempleteManager.Instance.getConfigInfoByConfigName("Effect_Engraving_Cost").ConfigValue;
    }
}