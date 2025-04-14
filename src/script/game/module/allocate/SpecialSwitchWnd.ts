import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { t_s_specialtemplateData } from "../../config/t_s_specialtemplate";
import {
  NotificationEvent,
  PawnEvent,
} from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { ArmyManager } from "../../manager/ArmyManager";
import { ArmySocketOutManager } from "../../manager/ArmySocketOutManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { BaseIcon } from "../../component/BaseIcon";
import { ResourceManager } from "../../manager/ResourceManager";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
/**
* @author:shujin.ou
特性转换
* @data: 2021-03-30 16:23
*/
export default class SpecialSwitchWnd extends BaseWindow {
  private playerCom1: BaseIcon; //兵种头像
  private playerCom2: BaseIcon; //兵种头像
  private NameTxt1: fgui.GTextField; //名字
  private NameTxt2: fgui.GTextField; //名字
  private AbilityNameTxt1: fgui.GTextField; //名字
  private AbilityNameTxt2: fgui.GTextField; //名字
  private SoulValueTxt: fgui.GTextField; //战魂数量
  private DiamondNumTxt: fgui.GTextField; //钻石数量
  private n14: fgui.GTextField; //消耗资源
  private Btn_Select: UIButton; //列表按钮
  private Btn_Cancel: UIButton; //取消按钮
  private Btn_Switch: UIButton; //转换按钮
  private SoulSelect: UIButton; //战魂选中按钮
  private DiamondSelect: UIButton; //钻石选中按钮
  private _oldPawn: ArmyPawn;
  private _newPawn: ArmyPawn;
  private n5: fgui.GComponent;
  private Btn_help: UIButton;
  private cfgNeedPoint: number = 200;
  private cfgNeedGold: number = 0;
  public tipItem1: BaseTipItem;
  public tipItem2: BaseTipItem;
  public OnInitWind() {
    this.n5.getChild("title").text = LangManager.Instance.GetTranslation(
      "buildings.casern.view.PawnSpecialAbilityFrame.title",
    );
    this.n14.text = LangManager.Instance.GetTranslation(
      "CasernRecruitWnd.costResourceTxt",
    );
    let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName(
      "PawnChange_NeedPoint",
    );
    if (cfgItem) {
      this.cfgNeedPoint = Number(cfgItem.ConfigValue);
    }
    this.addEvent();
    this.setCenter();
    this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
  }

  OnShowWind() {
    super.OnShowWind();
    this._oldPawn = this.params;
    for (var i: number = 0; i < this.tempArr.length; i++) {
      if (
        this.tempArr[i].templateId != this._oldPawn.templateId &&
        this.tempArr[i].templateInfo.Level >= 10
      ) {
        this._newPawn = this.tempArr[i] as ArmyPawn;
        break;
      }
    }
    if (!this._newPawn) this._newPawn = new ArmyPawn();
    this.setColorStyle();
    this.cfgNeedGold = Number(
      TempleteManager.Instance.getConfigInfoByConfigName(
        "PawnChange_NeedStrategy",
      ).ConfigValue,
    );
    this.SoulValueTxt.text = this.cfgNeedGold.toString();
    this.DiamondNumTxt.text = this.cfgNeedPoint.toString();
    this.SoulSelect.selected = true;
    this.DiamondSelect.selected = false;
    this.refreshView();
  }

  private addEvent() {
    this.Btn_Select.onClick(this, this.__onSelectHandler.bind(this));
    this.Btn_Cancel.onClick(this, this.__onCancelHandler.bind(this));
    this.Btn_Switch.onClick(this, this.__onSwitchHandler.bind(this));
    this.SoulSelect.onClick(this, this.__onSoulSelectHandler.bind(this));
    this.DiamondSelect.onClick(this, this.__onDiamondSelectHandler.bind(this));
    this.Btn_help.onClick(this, this._helpClick.bind(this));
    for (let key in this.tempArr) {
      if (Object.prototype.hasOwnProperty.call(this.tempArr, key)) {
        let ap: ArmyPawn = this.tempArr[key];
        ap.addEventListener(
          PawnEvent.SPECIAL_ALIBITY,
          this.__converSucceeded,
          this,
        );
      }
    }
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_CONFIRM_SPECIALSELECTITEM,
      this.__refreshHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CLOSE_SPECIALSELECTWND,
      this.__resetPosHandler,
      this,
    );
  }

  private removeEvent() {
    this.Btn_Select.offClick(this, this.__onSelectHandler.bind(this));
    this.Btn_Cancel.offClick(this, this.__onCancelHandler.bind(this));
    this.Btn_Switch.offClick(this, this.__onSwitchHandler.bind(this));
    this.SoulSelect.offClick(this, this.__onSoulSelectHandler.bind(this));
    this.DiamondSelect.offClick(this, this.__onDiamondSelectHandler.bind(this));
    this.Btn_help.offClick(this, this._helpClick.bind(this));
    for (let key in this.tempArr) {
      if (Object.prototype.hasOwnProperty.call(this.tempArr, key)) {
        let ap: ArmyPawn = this.tempArr[key];
        ap.removeEventListener(
          PawnEvent.SPECIAL_ALIBITY,
          this.__converSucceeded,
          this,
        );
      }
    }
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_CONFIRM_SPECIALSELECTITEM,
      this.__refreshHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CLOSE_SPECIALSELECTWND,
      this.__resetPosHandler,
      this,
    );
  }

  private setColorStyle() {
    if (ResourceManager.Instance.gold.count < this.cfgNeedGold) {
      this.SoulValueTxt.color = "#FF0000";
    } else {
      this.SoulValueTxt.color = "#FFECC6";
    }
    if (this.model.playerInfo.point < this.cfgNeedPoint) {
      this.DiamondNumTxt.color = "#FF0000";
    } else {
      this.DiamondNumTxt.color = "#FFECC6";
    }
  }

  private get tempArr(): any[] {
    var arr: any[];
    arr = ArmyManager.Instance.casernPawnList.getList();
    arr.sort(this.sortByNeedBuild);
    return arr;
  }

  private sortByNeedBuild(pawn1: ArmyPawn, pawn2: ArmyPawn): number {
    var needBuild1: number = parseInt(
      pawn1.templateInfo.NeedBuilding.toString(),
    );
    var needBuild2: number = parseInt(
      pawn2.templateInfo.NeedBuilding.toString(),
    );
    if (needBuild1 > needBuild2) return 1;
    else if (needBuild1 < needBuild2) return -1;
    else return 0;
  }

  private refreshView() {
    var oldTemp: t_s_specialtemplateData =
      TempleteManager.Instance.getPawnSpecialTemplateByID(
        parseInt(this._oldPawn.specialAbility),
      );
    var newTemp: t_s_specialtemplateData =
      TempleteManager.Instance.getPawnSpecialTemplateByID(
        parseInt(this._newPawn.specialAbility),
      );
    this.playerCom1.setIcon(IconFactory.getCommonIconPath(oldTemp.ResPath));
    this.playerCom2.setIcon(IconFactory.getCommonIconPath(newTemp.ResPath));
    this.NameTxt1.text =
      oldTemp.TemplateNameLang +
      " " +
      LangManager.Instance.GetTranslation(
        "public.level2",
        oldTemp.Grades.toString(),
      );
    this.NameTxt2.text =
      newTemp.TemplateNameLang +
      " " +
      LangManager.Instance.GetTranslation(
        "public.level2",
        newTemp.Grades.toString(),
      );
    this.AbilityNameTxt1.text = this._oldPawn.templateInfo.PawnNameLang;
    this.AbilityNameTxt2.text = this._newPawn.templateInfo.PawnNameLang;
    this.setColorStyle();
  }

  private __onSelectHandler() {
    if (UIManager.Instance.isShowing(EmWindow.SpecialSelecteWnd)) {
      UIManager.Instance.HideWind(EmWindow.SpecialSelecteWnd);
      this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
    } else {
      this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2 - 307;
      let point: Laya.Point = new Laya.Point(this.x + 605, this.y);
      UIManager.Instance.ShowWind(EmWindow.SpecialSelecteWnd, {
        postion: point,
        pawn: this._newPawn,
      });
    }
  }

  private __onCancelHandler() {
    this.OnBtnClose();
  }

  private __onSwitchHandler() {
    if (!this._oldPawn || !this._newPawn) return;
    var needAlert: boolean = false;
    if (needAlert) {
      var content: string = LangManager.Instance.GetTranslation(
        "armyII.viewII.pawnupgrade.PawnAbilityConvertFrame.pawnSpecial",
      );
      var checkTxt: string = LangManager.Instance.GetTranslation(
        "yishi.view.base.ThewAlertFrame.text",
      );
      if (this.SoulSelect.selected) {
        //战魂
        // var frame:TodayNotAlertFrame = ComponentFactory.Instance.creatComponentByStylename("armyII.PawnAbilityConvertAlert");
        // frame.width += 20;
        // frame.show(content,checkTxt, __converSureCall, null, "center", LayerManager.ALPHA_BLOCKGOUND, true,200);
      } else if (this.DiamondSelect.selected) {
        //钻石
        // var frame2:TodayNotAlertFrame = ComponentFactory.Instance.creatComponentByStylename("armyII.PawnAbilityConvertAlert2");
        // frame2.width += 20;
        // frame2.show(content,checkTxt, __converSureCall, null, "center", LayerManager.ALPHA_BLOCKGOUND, true,200);
      }
    } else {
      this.__converSureCall(false, true);
    }
  }

  private __converSureCall(b: boolean, useBind: boolean = true) {
    if (this.SoulSelect.selected) {
      this.sendConverBySoul(useBind);
    } else if (this.DiamondSelect.selected) {
      this.sendConverByPoint(useBind);
    }
  }

  private __onSoulSelectHandler() {
    if (this.SoulSelect.selected) {
      this.DiamondSelect.selected = false;
    } else {
      this.DiamondSelect.selected = true;
    }
  }

  private sendConverByPoint(useBind: boolean) {
    var str: string;
    if (this._oldPawn.templateId == this._newPawn.templateId) {
      str = LangManager.Instance.GetTranslation(
        "armyII.viewII.pawnupgrade.samePawn",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    var hasMoney: number = this.model.playerInfo.point;
    if (useBind) {
      hasMoney = this.model.playerInfo.giftToken + this.playerInfo.point;
    }
    if (hasMoney < this.cfgNeedPoint) {
      RechargeAlertMannager.Instance.show();
      // str = LangManager.Instance.GetTranslation("Auction.ResultAlert11");
      // MessageTipManager.Instance.show(str);
      return;
    }
    ArmySocketOutManager.sendPawnChange(
      this._oldPawn.templateId,
      this._newPawn.templateId,
      1,
      useBind,
    );
  }

  private sendConverBySoul(useBind: boolean) {
    var str: string;
    if (this._oldPawn.templateId == this._newPawn.templateId) {
      str = LangManager.Instance.GetTranslation(
        "armyII.viewII.pawnupgrade.samePawn",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ResourceManager.Instance.gold.count < this.cfgNeedGold) {
      str = LangManager.Instance.GetTranslation(
        "buildings.casern.view.PawnLevelUpFrame.command05",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    ArmySocketOutManager.sendPawnChange(
      this._oldPawn.templateId,
      this._newPawn.templateId,
      2,
      useBind,
    );
  }

  private __onDiamondSelectHandler() {
    if (this.DiamondSelect.selected) {
      this.SoulSelect.selected = false;
    } else {
      this.SoulSelect.selected = true;
    }
  }

  private _helpClick() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "buildings.casern.view.PawnAbilityConvertFrame.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private __converSucceeded() {
    this.refreshView();
  }

  private __resetPosHandler() {
    this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
  }

  private __refreshHandler(data: ArmyPawn) {
    this._newPawn = data;
    this.refreshView();
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public get model(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    UIManager.Instance.HideWind(EmWindow.SpecialSelecteWnd);
  }

  dispose() {
    super.dispose();
  }
}
