import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { IconFactory } from "../../../core/utils/IconFactory";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { ArmySocketOutManager } from "../../manager/ArmySocketOutManager";
import { BaseIcon } from "../../component/BaseIcon";
import StringHelper from "../../../core/utils/StringHelper";
import { MessageTipManager } from "../../manager/MessageTipManager";
/**
 * 遣散士兵
 */
export default class SeveranceSoliderWnd extends BaseWindow {
  private playerCom: BaseIcon; //兵种头像
  private NameTxt: fgui.GTextField; //名字
  private Btn_Confirm: UIButton; //确定按钮
  private _pawn: ArmyPawn;
  private _maxNumber: number = 0;
  private n1: fgui.GComponent;
  private pawnCountTxt: fgui.GTextField; //名字

  public btn_min: fgui.GButton;
  public btn_max: fgui.GButton;
  public progressSlider: fgui.GSlider;
  public txt_num: fgui.GTextInput;
  private _soliderNumber: number = 0;
  private _min: number = 0;
  private _limit: number = 0;

  public OnInitWind() {
    this.n1.getChild("title").text = LangManager.Instance.GetTranslation(
      "armyII.viewII.allocate.DissmissPawnFrame.command01",
    );
    this.addEvent();
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
    this.Data();
  }

  private Data() {
    this._pawn = this.params;
    if (this._pawn != null) {
      this._maxNumber = this._pawn.ownPawns;
      this.pawnCountTxt.text = this._maxNumber.toString();
      this.NameTxt.text =
        this._pawn.templateInfo.PawnNameLang +
        " " +
        LangManager.Instance.GetTranslation(
          "public.level4_space2",
          this._pawn.templateInfo.Level,
        );
      this.playerCom.setIcon(
        IconFactory.getSoldierIconByIcon(this._pawn.templateInfo.Icon),
      );
      this._limit = this._maxNumber;
      this._min = 1;
      this.txt_num.text = this._maxNumber.toString();
      this.progressSlider.value = 100;
      this.btn_max.enabled = false;
      if (this._maxNumber == 1) {
        this.btn_min.enabled = false;
      } else {
        this.btn_min.enabled = true;
      }
      this._soliderNumber = this._maxNumber;
    }
  }

  private addEvent() {
    this.Btn_Confirm.onClick(this, this.__onOKHandler.bind(this));
    this.txt_num.on(Laya.Event.INPUT, this, this.__buyNumChange);
    this.btn_min.onClick(this, this.minBtnHandler.bind(this));
    this.btn_max.onClick(this, this.maxBtnHandler.bind(this));
    this.progressSlider.on(fairygui.Events.STATE_CHANGED, this, this.onChanged);
  }

  private removeEvent() {
    this.Btn_Confirm.offClick(this, this.__onOKHandler.bind(this));
    this.txt_num.off(Laya.Event.INPUT, this, this.__buyNumChange);
    this.btn_min.offClick(this, this.minBtnHandler.bind(this));
    this.btn_max.offClick(this, this.maxBtnHandler.bind(this));
    this.progressSlider.off(
      fairygui.Events.STATE_CHANGED,
      this,
      this.onChanged,
    );
  }

  private onChanged() {
    if (this._maxNumber == 1) {
      this.txt_num.text = "1";
      this.btn_min.enabled = false;
      this.btn_max.enabled = false;
    } else {
      let value: number = this.progressSlider.value;
      let num: number = parseInt(((value * this._maxNumber) / 100).toString());
      if (num == 0) {
        this.txt_num.text = "1";
        this.btn_min.enabled = false;
        this.btn_max.enabled = true;
      } else if (num == this._maxNumber) {
        this.txt_num.text = this._maxNumber.toString();
        this.btn_min.enabled = true;
        this.btn_max.enabled = false;
      } else {
        this.txt_num.text = num.toString();
        this.btn_min.enabled = true;
        this.btn_max.enabled = true;
      }
    }
    this._soliderNumber = parseInt(this.txt_num.text);
  }

  private minBtnHandler() {
    this.txt_num.text = "1";
    this.progressSlider.value = 0;
    this.btn_min.enabled = false;
    this.btn_max.enabled = true;
  }

  private maxBtnHandler() {
    this.txt_num.text = this._maxNumber.toString();
    this.progressSlider.value = 100;
    this.btn_min.enabled = true;
    this.btn_max.enabled = false;
  }

  private __buyNumChange(event: Laya.Event) {
    if (!StringHelper.isNullOrEmpty(this.txt_num.text)) {
      this._soliderNumber = parseInt(this.txt_num.text);
      if (this._limit < this._soliderNumber) {
        this._soliderNumber = this._limit;
      }
      this._soliderNumber = Math.min(
        Math.max(this._soliderNumber, this._min),
        this._soliderNumber,
      );
      this.txt_num.text = isNaN(this._soliderNumber)
        ? "1"
        : this._soliderNumber.toString();
      this._soliderNumber = isNaN(this._soliderNumber)
        ? this._min
        : this._soliderNumber;
      this.setProgressSliderValue();
      if (parseInt(this.txt_num.text) == 1) {
        this.btn_min.enabled = false;
      } else {
        this.btn_min.enabled = true;
      }
      if (parseInt(this.txt_num.text) < this._maxNumber) {
        this.btn_max.enabled = true;
      } else {
        this.btn_max.enabled = false;
      }
    } else {
      this._soliderNumber = 0;
      this.setProgressSliderValue();
      this.btn_min.enabled = false;
      this.btn_max.enabled = true;
    }
  }

  private setProgressSliderValue() {
    this.progressSlider.value = Number(
      (100 * this._soliderNumber) / this._maxNumber,
    );
  }

  private __onOKHandler() {
    if (StringHelper.isNullOrEmpty(this.txt_num.text)) {
      this._soliderNumber = 0;
    } else {
      this._soliderNumber = parseInt(this.txt_num.text);
    }
    if (this._soliderNumber == 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("SeveranceSoliderWnd.moveconfig"),
      );
      return;
    } else {
      ArmySocketOutManager.sendDismissPawn(
        this._pawn.templateId,
        this._soliderNumber,
      );
      this.OnBtnClose();
    }
  }

  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  dispose() {
    super.dispose();
  }
}
