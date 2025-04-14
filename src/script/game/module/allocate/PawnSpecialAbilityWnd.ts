import AudioManager from "../../../core/audio/AudioManager";
import LangManager from "../../../core/lang/LangManager";
import { SocketManager } from "../../../core/net/SocketManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import StringHelper from "../../../core/utils/StringHelper";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_specialtemplateData } from "../../config/t_s_specialtemplate";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import {
  PawnEvent,
  ResourceEvent,
} from "../../constant/event/NotificationEvent";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { SoundIds } from "../../constant/SoundIds";
import { EmWindow } from "../../constant/UIDefine";
import { UpgradeType } from "../../constant/UpgradeType";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
//@ts-expect-error: External dependencies
import ComprehendMsg = com.road.yishi.proto.army.ComprehendMsg;
import { BaseIcon } from "../../component/BaseIcon";
import { ResourceManager } from "../../manager/ResourceManager";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
/**
 * @author:shujin.ou
 * @data: 2021-02-19 20:37
 * @description 特性领悟
 */
export default class PawnSpecialAbilityWnd extends BaseWindow {
  private playerCom1: BaseIcon; //兵种头像
  private playerCom2: BaseIcon; //兵种头像
  private PawnSpecialNameTxt1: fgui.GTextField; //名字
  private PawnSpecialNameTxt2: fgui.GTextField; //名字
  private n5: fgui.GTextField; //祝福值
  private n6: fgui.GTextField; //消耗资源
  private ProgressTxt: fgui.GTextField; //祝福值数值
  // private SoulHasVauleTxt: fgui.GTextField;//拥有数量
  private SoulCostValueTxt: fgui.GTextField; //消耗数量
  private txt_cost: fgui.GTextField; //消耗数量X10
  private Btn_Replace: UIButton; //替换按钮
  private Btn_Apperceive: UIButton; //领悟按钮
  private btn_ten: UIButton; //领悟按钮
  private PawnSpeciaProgress: fgui.GProgressBar;
  private _pawn: ArmyPawn;
  private specila1: t_s_specialtemplateData;
  private specila2: t_s_specialtemplateData;
  private Btn_help: UIButton;
  private needCostGoldCount: number = 0;
  private barMaxVal: number = 0;
  public tipItem: BaseTipItem;
  public tipItem1: BaseTipItem;
  posCtrl: fairygui.Controller;
  public OnInitWind() {
    // this.n5.text = LangManager.Instance.GetTranslation("PawnSpecialAbilityWnd.wishesTxt");
    // this.n6.text = LangManager.Instance.GetTranslation("CasernRecruitWnd.costResourceTxt");
    this.needCostGoldCount = Number(
      TempleteManager.Instance.getConfigInfoByConfigName("Special_Stretgy")
        .ConfigValue,
    );
    this.posCtrl = this.contentPane.getControllerAt(0);
    this.addEvent();
    this.setCenter();
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
  }

  OnShowWind() {
    super.OnShowWind();
    this.Data();
  }

  private Data() {
    this._pawn = this.params;
    this.refreshView();
    this.refreshBless();
    this.changeTextColor();
  }

  private addEvent() {
    this.Btn_Replace.onClick(this, this.__onReplaceHandler.bind(this));
    this.Btn_Apperceive.onClick(this, this.__onApperceiveHandler);
    this.btn_ten.onClick(this, this.onQuick);
    this.playerCom1.on(Laya.Event.CLICK, this, this._special1ClickHander);
    this.playerCom2.on(Laya.Event.CLICK, this, this._special2ClickHander);
    this.on(Laya.Event.CLICK, this, this.click);
    this.Btn_help.onClick(this, this._helpClick.bind(this));
    ResourceManager.Instance.gold.addEventListener(
      ResourceEvent.RESOURCE_UPDATE,
      this.changeTextColor,
      this,
    );
  }

  private removeEvent() {
    this.Btn_Replace.offClick(this, this.__onReplaceHandler.bind(this));
    this.Btn_Apperceive.offClick(this, this.__onApperceiveHandler);
    this.btn_ten.offClick(this, this.onQuick);
    this._pawn &&
      this._pawn.removeEventListener(
        PawnEvent.SPECIAL_ALIBITY,
        this.__changeChangeHandler,
        this,
      );
    this._pawn &&
      this._pawn.removeEventListener(
        PawnEvent.SPECIAL_BLESS,
        this.__blessChangeHandler,
        this,
      );
    this.playerCom1.off(Laya.Event.CLICK, this, this._special1ClickHander);
    this.playerCom2.off(Laya.Event.CLICK, this, this._special2ClickHander);
    this.off(Laya.Event.CLICK, this, this.click);
    this.Btn_help.offClick(this, this._helpClick.bind(this));
    ResourceManager.Instance.gold.removeEventListener(
      ResourceEvent.RESOURCE_UPDATE,
      this.changeTextColor,
      this,
    );
  }

  private __onReplaceHandler() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var content: string = LangManager.Instance.GetTranslation(
      "armyII.viewII.pawnupgrade.PawnSpecialAbilityFrame.sureFrameDescribe",
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.activeAlertBack.bind(this),
    );
  }

  private activeAlertBack(b: boolean, flag: boolean) {
    if (b) {
      let msg: ComprehendMsg = new ComprehendMsg();
      msg.templateId = this._pawn.templateId;
      SocketManager.Instance.send(C2SProtocol.C_SAVESPECIAL, msg);
    }
  }

  private onComprehend(isquick?) {
    let newTemp: t_s_specialtemplateData =
      TempleteManager.Instance.getPawnSpecialTemplateByID(
        parseInt(this._pawn.tempSpecial),
      );
    let oldTemp: t_s_specialtemplateData =
      TempleteManager.Instance.getPawnSpecialTemplateByID(
        parseInt(this._pawn.specialAbility),
      );
    if (newTemp && oldTemp && newTemp.Grades > oldTemp.Grades) {
      let str: string = LangManager.Instance.GetTranslation(
        "buildings.casern.view.PawnSpecialAbilityFrame.BetterAlert",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    let msg: ComprehendMsg = new ComprehendMsg();
    msg.templateId = this._pawn.templateId;
    msg.quick = isquick;
    SocketManager.Instance.send(C2SProtocol.C_COMPREHEND, msg);
  }

  private __onApperceiveHandler() {
    this.onComprehend(false);
  }

  private onQuick() {
    this.onComprehend(true);
  }

  private clear() {
    this.playerCom1.setIcon("");
    this.PawnSpecialNameTxt1.text = "";
    this.playerCom2.setIcon("");
    this.PawnSpecialNameTxt2.text = "";
    this.specila2 = null;
    this.specila1 = null;
  }

  private _helpClick() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "buildings.casern.view.PawnSpecialAbilityFrame.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private refreshView() {
    if (this._pawn) {
      this.clear();
      let newTemp: t_s_specialtemplateData =
        TempleteManager.Instance.getPawnSpecialTemplateByID(
          parseInt(this._pawn.tempSpecial),
        );
      let oldTemp: t_s_specialtemplateData =
        TempleteManager.Instance.getPawnSpecialTemplateByID(
          parseInt(this._pawn.specialAbility),
        );

      if (oldTemp) {
        this.playerCom1.setIcon(IconFactory.getCommonIconPath(oldTemp.ResPath));
        this.specila1 = oldTemp;
        this.PawnSpecialNameTxt1.text = LangManager.Instance.GetTranslation(
          "public.level.name",
          oldTemp.TemplateNameLang,
          oldTemp.Grades,
        );
      }
      if (newTemp) {
        this.specila2 = newTemp;
        this.playerCom2.setIcon(IconFactory.getCommonIconPath(newTemp.ResPath));
        this.PawnSpecialNameTxt2.text = LangManager.Instance.GetTranslation(
          "public.level.name",
          newTemp.TemplateNameLang,
          newTemp.Grades,
        );
      }
      this._pawn &&
        this._pawn.addEventListener(
          PawnEvent.SPECIAL_ALIBITY,
          this.__changeChangeHandler,
          this,
        );
      this._pawn &&
        this._pawn.addEventListener(
          PawnEvent.SPECIAL_BLESS,
          this.__blessChangeHandler,
          this,
        );
      this.Btn_Replace.enabled = !StringHelper.isNullOrEmpty(
        this._pawn.tempSpecial,
      );
      this.refreshBless();
      if (oldTemp.Grades >= 10) {
        this.n5.visible = false;
        this.ProgressTxt.visible = false;
        this.PawnSpeciaProgress.visible = false;
        this.posCtrl.selectedIndex = 1;
      } else {
        this.n5.visible = true;
        this.ProgressTxt.visible = true;
        this.PawnSpeciaProgress.visible = true;
        this.posCtrl.selectedIndex = 0;
      }
      this.__refreshGold();
    }
  }

  private __changeChangeHandler() {
    this.refreshView();
  }

  private __refreshGold() {
    this.SoulCostValueTxt.text = this.needCostGoldCount.toString();
    let count = this.barMaxVal - this._pawn.blessNum + 1;
    if (count > 10) {
      count = 10;
    }
    this.txt_cost.text = this.needCostGoldCount * count + "";
    this.changeTextColor();
  }

  /**
   * 消耗不足时改变文本颜色
   */
  private changeTextColor() {
    if (ResourceManager.Instance.gold.count >= this.needCostGoldCount) {
      this.SoulCostValueTxt.color = "#FFECC6";
    } else {
      this.SoulCostValueTxt.color = "#FF0000";
    }
    let count = this.barMaxVal - this._pawn.blessNum + 1;
    if (count > 10) {
      count = 10;
    }
    if (ResourceManager.Instance.gold.count >= this.needCostGoldCount * count) {
      this.txt_cost.color = "#FFECC6";
    } else {
      this.txt_cost.color = "#FF0000";
    }
  }

  private __blessChangeHandler() {
    this.refreshBless();
    this.__refreshGold();
  }

  private _special1ClickHander() {
    if (UIManager.Instance.isShowing(EmWindow.SoliderSkillTipWnd)) {
      //如果有弹窗
      UIManager.Instance.HideWind(EmWindow.SoliderSkillTipWnd);
    } else {
      let point = this.playerCom1.parent.localToGlobal(
        this.playerCom1.x,
        this.playerCom1.y,
      );
      UIManager.Instance.ShowWind(EmWindow.SoliderSkillTipWnd, {
        posX: point.x,
        posY: point.y,
        pawnData: this.specila1,
      });
    }
  }

  private _special2ClickHander() {
    if (UIManager.Instance.isShowing(EmWindow.SoliderSkillTipWnd)) {
      //如果有弹窗
      UIManager.Instance.HideWind(EmWindow.SoliderSkillTipWnd);
    } else {
      if (!this.specila2) return;
      let point = this.playerCom2.parent.localToGlobal(
        this.playerCom2.x,
        this.playerCom2.y,
      );
      UIManager.Instance.ShowWind(EmWindow.SoliderSkillTipWnd, {
        posX: point.x,
        posY: point.y,
        pawnData: this.specila2,
      });
    }
  }

  private click() {
    if (UIManager.Instance.isShowing(EmWindow.SoliderSkillTipWnd)) {
      //如果有弹窗
      UIManager.Instance.HideWind(EmWindow.SoliderSkillTipWnd);
    }
  }

  private refreshBless() {
    if (this._pawn) {
      let oldTemp: t_s_specialtemplateData =
        TempleteManager.Instance.getPawnSpecialTemplateByID(
          parseInt(this._pawn.specialAbility),
        );
      var temp: t_s_upgradetemplateData =
        TempleteManager.Instance.getTemplateByTypeAndLevel(
          oldTemp.Grades,
          UpgradeType.UPGRADE_TYPE_PAWNSPECIAL_BLESS,
        );
      this.PawnSpeciaProgress.value = Math.floor(
        (this._pawn.blessNum / temp.Data) * 100,
      );
      this.barMaxVal = temp.Data;
      this.ProgressTxt.text = this._pawn.blessNum + "/" + temp.Data;
    }
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  OnHideWind() {
    super.OnHideWind();
    if (UIManager.Instance.isShowing(EmWindow.SoliderSkillTipWnd)) {
      //如果有弹窗
      UIManager.Instance.HideWind(EmWindow.SoliderSkillTipWnd);
    }
    this.removeEvent();
  }

  dispose() {
    super.dispose();
  }
}
