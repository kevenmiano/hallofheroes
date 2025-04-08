// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import { IconFactory } from '../../../core/utils/IconFactory';
import { EmWindow } from '../../constant/UIDefine';
import { ArmyPawn } from '../../datas/ArmyPawn';
import { ArmyManager } from '../../manager/ArmyManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import AllocateCtrl from './control/AllocateCtrl';
import { BaseIcon } from "../../component/BaseIcon";
import { PlayerManager } from '../../manager/PlayerManager';
import { GlobalConfig } from '../../constant/GlobalConfig';
import StringHelper from '../../../core/utils/StringHelper';
/**
 * 配兵
 */
import { MessageTipManager } from '../../manager/MessageTipManager';
export default class ConfigSoliderWnd extends BaseWindow {
    private n3: BaseIcon;//兵种头像
    private NameTxt: fgui.GLabel;//名字
    public btn_min: fgui.GButton;
    public btn_max: fgui.GButton;
    public progressSlider: fgui.GSlider;
    public txt_num: fgui.GTextInput;
    public BtnConfirm: UIButton;//确认
    private _pawn: ArmyPawn;
    private _maxNumber: number = 0;
    private _soliderNumber: number = 0;
    private _min: number = 0;
    private _limit: number = 0;
    public OnInitWind() {
        this.addEvent();
        this.setCenter();
    }

    OnShowWind() {
        super.OnShowWind();
        this._pawn = this.params;
        if (this._pawn) {
            this._maxNumber = this._pawn.ownPawns;
            this.Data();
        }
    }

    private Data() {
        let str: string = this._pawn.templateInfo.PawnNameLang + this._pawn.templateInfo.Level;
        this.NameTxt.text = LangManager.Instance.GetTranslation("public.level4_space2", str);
        this.n3.setIcon(IconFactory.getSoldierIconByIcon(this._pawn.templateInfo.Icon));
        this._limit = this._maxNumber;
        this._min = 1;
        this.txt_num.text = this._maxNumber.toString();
        this._soliderNumber = this._maxNumber;
        this.progressSlider.value = 100;
        this.btn_max.enabled = false;
        if (this._maxNumber == 1) {
            this.btn_min.enabled = false;
        }
        else {
            this.btn_min.enabled = true;
        }
    }

    private addEvent() {
        this.BtnConfirm.onClick(this, this.__onOKHandler.bind(this));
        this.txt_num.on(Laya.Event.INPUT, this, this.__buyNumChange);
        this.btn_min.onClick(this, this.minBtnHandler.bind(this));
        this.btn_max.onClick(this, this.maxBtnHandler.bind(this));
        this.progressSlider.on(fairygui.Events.STATE_CHANGED, this, this.onChanged);
    }

    private removeEvent() {
        this.BtnConfirm.offClick(this, this.__onOKHandler.bind(this));
        this.txt_num.off(Laya.Event.INPUT, this, this.__buyNumChange);
        this.btn_min.offClick(this, this.minBtnHandler.bind(this));
        this.btn_max.offClick(this, this.maxBtnHandler.bind(this));
        this.progressSlider.off(fairygui.Events.STATE_CHANGED, this, this.onChanged);
    }

    private onChanged() {
        if (this._maxNumber == 1) {
            this.txt_num.text = "1";
            this.btn_min.enabled = false;
            this.btn_max.enabled = false;
        }
        else {
            let value: number = this.progressSlider.value;
            let num: number = parseInt((value * this._maxNumber / 100).toString());
            if (num == 0) {
                this.txt_num.text = "1";
                this.btn_min.enabled = false;
                this.btn_max.enabled = true;
            }
            else if (num == this._maxNumber) {
                this.txt_num.text = this._maxNumber.toString();
                this.btn_min.enabled = true;
                this.btn_max.enabled = false;
            }
            else {
                this.txt_num.text = num.toString();
                this.btn_min.enabled = true;
                this.btn_max.enabled = true;
            }
        }
    }

    private minBtnHandler() {
        this.txt_num.text = "1";
        this.progressSlider.value = 0;
        this.btn_min.enabled = false;
        this.btn_max.enabled = true;
    }

    private maxBtnHandler() {
        this.txt_num.text = this._maxNumber.toString()
        this.progressSlider.value = 100;
        this.btn_min.enabled = true;
        this.btn_max.enabled = false;
    }

    private __buyNumChange(event: Laya.Event) {
        if (!StringHelper.isNullOrEmpty(this.txt_num.text)) {//输入数字没有清空
            this._soliderNumber = parseInt(this.txt_num.text);
            if (this._limit < this._soliderNumber) {
                this._soliderNumber = this._limit;
            }
            this._soliderNumber = Math.min(Math.max(this._soliderNumber, this._min), this._soliderNumber);
            this.txt_num.text = isNaN(this._soliderNumber) ? "" : this._soliderNumber.toString();
            this._soliderNumber = isNaN(this._soliderNumber) ? this._min : this._soliderNumber;
            this.setProgressSliderValue();
            if (this.txt_num.text == "") {
                this.btn_min.enabled = false;
            }
            else {
                this.btn_min.enabled = true;
            }
            if (parseInt(this.txt_num.text) < this._maxNumber) {
                this.btn_max.enabled = true;
            }
            else {
                this.btn_max.enabled = false;
            }
        }
        else {
            this._soliderNumber = 0;
            this.setProgressSliderValue();
            this.btn_min.enabled = false;
            this.btn_max.enabled = true;
        }
    }

    private setProgressSliderValue() {
        this.progressSlider.value = Number(100 * this._soliderNumber / this._maxNumber);
    }

    private __onOKHandler() {
        this.__mouseDoubleClick();

    }

    private __mouseDoubleClick() {
        let emputyPos: number = ArmyManager.Instance.army.getEmputyPos();
        let tarTotalNum: number = ArmyManager.Instance.army.baseHero.attackProrerty.totalConatArmy;
        let tarNeedNum: number = 0;
        if (emputyPos == 0) {
            if (StringHelper.isNullOrEmpty(this.txt_num.text)) {
                this._soliderNumber = 0;
            }
            else {
                this._soliderNumber = parseInt(this.txt_num.text);
            }
            if (this._soliderNumber == 0) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConfigSoliderwnd.moveconfig"));
                return;
            }
            else {
                tarNeedNum = tarTotalNum > this._soliderNumber ? this._soliderNumber : tarTotalNum;
                ArmyManager.Instance.army.addNewPawnByIndex(emputyPos, this._pawn, tarNeedNum);
                ArmyManager.Instance.removePawnCountById(this._pawn.templateId, tarNeedNum);
                this.allocateControler.sendMovePawnInfo();
                this.OnBtnClose();
            }
        }
        else {
            let serPawn1: ArmyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
            if ((serPawn1.ownPawns > 0) && (serPawn1.templateId == this._pawn.templateId)) {
                if (serPawn1.ownPawns >= tarTotalNum) return;
                tarNeedNum = tarTotalNum - serPawn1.ownPawns;
                tarNeedNum = tarNeedNum > this._soliderNumber ? this._soliderNumber : tarNeedNum;
                ArmyManager.Instance.army.addArmyPawnCountByIndex(0, tarNeedNum);
                ArmyManager.Instance.removePawnCountById(this._pawn.templateId, tarNeedNum);
                this.allocateControler.sendMovePawnInfo();
            }
            else {
                let toId: number = serPawn1.templateId;
                let toCount: number = serPawn1.ownPawns;
                tarNeedNum = tarTotalNum > this._soliderNumber ? this._soliderNumber : tarTotalNum;
                ArmyManager.Instance.army.addNewPawnByIndex(0, this._pawn, tarNeedNum);
                this._pawn.ownPawns -= tarNeedNum;
                this._pawn.commit();
                ArmyManager.Instance.addPawnCountById(toId, toCount);
                this.allocateControler.sendMovePawnInfo();
            }
            this.OnBtnClose();
        }
    }

    private get allocateControler(): AllocateCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.AllocateWnd) as AllocateCtrl;
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose() {
        super.dispose();
    }
}