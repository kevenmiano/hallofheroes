// @ts-nocheck
import FUI_RuneOptionCom from "../../../../../fui/Skill/FUI_RuneOptionCom";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import BaseTipItem from "../../../component/item/BaseTipItem";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import SkillWndCtrl from "../SkillWndCtrl";
import { RuneHoldRuneItem2 } from "./RuneHoldRuneItem2";


export class RuneOptionCom extends FUI_RuneOptionCom {

    declare public runeItem: RuneHoldRuneItem2;

    private _info: RuneHoleInfo;
    private _pos = 0;
    private _cost = 0;
    //@ts-ignore
    public tipItem1: BaseTipItem //符石碎片
    //@ts-ignore
    public tipItem2: BaseTipItem //符孔钻
    private propertyView: { s: fairygui.GRichTextField, sa: fairygui.GRichTextField, a: fairygui.GImage, u: fairygui.GTextField }[];
    onConstruct() {
        super.onConstruct();
        this.propertyView = [{ s: this.s1, sa: this.sa1, a: this.a1, u: this.u1 }, { s: this.s2, sa: this.sa2, a: this.a2, u: this.u2 }]
        this.addEvent();
        this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_FUSHI_SUIPIAN);
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_FUKONG);
    }

    private addEvent() {
        this.openLockBtn.onClick(this, this.onOpenLockedClick);
        this.replaceBtn.onClick(this, this.onReplaceClick);
        this.equipBtn.onClick(this, this.onReplaceClick);
        this.levelUpBtn.onClick(this, this.onLevelUpClick);     

    }



    public updateView(info: RuneHoleInfo, pos: number) {
        this._info = info;
        this._pos = pos;
        this.openLockBtn.enabled = info.opened;
        let rune = this._info.getRuneByPos(pos);
        this.ppropGroup.visible = false;
        this.runeItem.info = rune;
        if (rune instanceof GoodsInfo) {
            this.levelUpBtn.visible = true;
            this.btn_getGem.visible = true;
            this.replaceBtn.visible = true;
            this.openLockBtn.visible = false;
            this.detailGroup.visible = true;
            this.costGroup.visible = false;
            this.ppropGroup.visible = true;
            this.equipBtn.visible = false;
            this.updateRuneGem(rune);
            return;
        }

        this.title.text = LangManager.Instance.GetTranslation("runeHole.hold.pos", this._pos + 1);
        this.title.color = "#FFC68F";
        this.detailGroup.visible = false;

        //已解锁未装备符石
        if (rune == -1) {
            this.levelUpBtn.visible = false;
            this.btn_getGem.visible = false;
            this.replaceBtn.visible = false;
            this.equipBtn.visible = true;
            this.openLockBtn.visible = false;
            this.costGroup.visible = false;
            return;
        }

        //未解锁
        if (rune == 0 || rune == null) {
            this.btn_getGem.visible = false;
            this.levelUpBtn.visible = false;
            this.replaceBtn.visible = false;
            this.equipBtn.visible = false;
            this.openLockBtn.visible = true;
            this.costGroup.visible = true;
            this.lockedCost.text = RuneHoleInfo.RuneOpenCost[pos];
            return;
        }

    }


    private updateRuneGem(gem: GoodsInfo) {
        this.title.text = gem.templateInfo.TemplateNameLang;
        this.title.color = GoodsSonType.getColorByProfile(gem.templateInfo.Profile);
        let ctrl = (FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl)
        let curProperty = ctrl.parsePropertyByGoodsInfo(gem);
        let temp = new GoodsInfo();
        temp.templateId = gem.templateId;
        temp.strengthenGrade = gem.strengthenGrade + 1;
        let nextProperty = ctrl.parsePropertyByGoodsInfo(temp);
        let nextlevlTmep: t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevelAndSonType(temp.strengthenGrade, 200, temp.templateInfo.SonType);
        let isMax = !nextlevlTmep;
        if (nextlevlTmep) {
            this.propCost.text = nextlevlTmep.Data - gem.gp + "";
            this._cost = nextlevlTmep.Data - gem.gp;
        }

        this.levelTxt.setVar("curLv", gem.strengthenGrade + "");
        this.nextLevelTxt.text = isMax ? "MAX" : gem.strengthenGrade + 1 + "";

        let i = 0;
        for (let s of this.propertyView) {
            s.a.visible = false;
            s.sa.visible = false;
            s.s.visible = false;
            s.u.visible = false;
        }


        for (let p in curProperty) {
            this.propertyView[i].s.setVar("property", p)
            this.propertyView[i].s.setVar("curLv", "+" + curProperty[p]);

            this.propertyView[i].s.visible = true;
            this.propertyView[i].a.visible = true;
            this.propertyView[i].u.visible = true;
            this.propertyView[i].sa.visible = true;
            i++;
        }

        i = 0;

        if (isMax) {
            nextProperty = curProperty;
        }
        for (let p in nextProperty) {

            this.propertyView[i].sa.text = isMax ? "MAX" : "+" + nextProperty[p];
            this.propertyView[i].u.text = "" + (nextProperty[p] - curProperty[p]);
            i++;
        }

        this.maxHideGroup.visible = !isMax;
        this.levelUpBtn.enabled = !isMax;
        this.ppropGroup.visible = !isMax;
        this.levelTxt.flushVars();
        this.s1.flushVars();
        this.s2.flushVars();
    }



    private onLevelUpClick() {
        let currRuneData = this._info.getRuneByPos(this._pos) as GoodsInfo;
        let cost = this._cost;
        let ctrl = (FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl)
        ctrl.reqRuneGemUpgrade(currRuneData.pos, currRuneData.id, cost, currRuneData.bagType, this._info.holeId);
    }

    private onReplaceClick() {
        FrameCtrlManager.Instance.open(EmWindow.RuneHoldEquipWnd, [this._info, this._pos]);
    }

    private onOpenLockedClick() {
        let ctrl = (FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl)
        ctrl.reqRuneHoldOpton(this._info.holeId, 3, this._pos + 1);
    }



}