/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-02 11:06:01
 * @Description: 公会升级 v2.46 ConsortiaUpgradeFrame 已完成
 */
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import UIButton from "../../../../../core/ui/UIButton";
import { BaseIcon } from "../../../../component/BaseIcon";
import { ConsortiaEvent } from "../../../../constant/event/NotificationEvent";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { ConsortiaUpgradeType } from "../../../../constant/ConsortiaUpgradeType";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { ConsortiaInfo } from "../../data/ConsortiaInfo";
import LangManager from "../../../../../core/lang/LangManager";
import { t_s_consortialevelData } from "../../../../config/t_s_consortialevel";
import { ConsortiaUpgradeInfo } from "../../data/ConsortiaUpgradeInfo";

export class ConsortiaUpgradeWnd extends BaseWindow {
  private _contorller: ConsortiaControler;
  private _data: ConsortiaModel;
  private list: fgui.GList;
  private itemCurLevel: fgui.GButton;
  private itemNextLevel: fgui.GButton;
  private itemUpgradeRequirements: fgui.GButton; //要求
  private itemUpgradeConsume: fgui.GButton; //消耗财富
  private itemUpgradeCool: fgui.GButton; //冷却时间
  private txtUpgradeTitle: fgui.GLabel;
  private txtCountDown: fgui.GLabel;
  private imgCountDownBg: fgui.GImage;
  private btnQuickCool: UIButton;
  private btnUpgrade: UIButton;

  // private _isMoving: boolean;
  private _satisfy: boolean;
  private _currentBtnInfo: ConsortiaUpgradeInfo;

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initEvent();
    this.initView();
    this.setCenter();
  }

  private initEvent() {
    this._data.addEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__onConsortiaInfoUpdata,
      this,
    );
    this._data.addEventListener(
      ConsortiaEvent.UPDA_COOLDOWN_TIME,
      this.__onCooldownTimeUpdata,
      this,
    );
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._data = this._contorller.model;
  }

  private initView() {
    this.list.on(fgui.Events.CLICK_ITEM, this, this.__clickItem);
  }

  public OnShowWind() {
    super.OnShowWind();
    this.initList();
    this.refreshView();
    this.refreshCoolTime();
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  private initList() {
    for (let index = 0; index < this.list.numItems; index++) {
      const element = this.list.getChildAt(index);
      let info: ConsortiaUpgradeInfo;
      switch (index) {
        case 0:
          info = new ConsortiaUpgradeInfo(
            index,
            ConsortiaUpgradeType.CONSORTIA,
            this.consortiaInfo.levels,
          );
          break;
        case 1:
          info = new ConsortiaUpgradeInfo(
            index,
            ConsortiaUpgradeType.SAFE_DEPOSIT_BOX,
            this.consortiaInfo.storeLevel,
          );
          break;
        case 2:
          info = new ConsortiaUpgradeInfo(
            index,
            ConsortiaUpgradeType.CONSORTIA_ALTAR,
            this.consortiaInfo.altarLevel,
          );
          break;
        case 3:
          info = new ConsortiaUpgradeInfo(
            index,
            ConsortiaUpgradeType.LING_SHI,
            this.consortiaInfo.schoolLevel,
          );
          break;
        case 4:
          info = new ConsortiaUpgradeInfo(
            index,
            ConsortiaUpgradeType.CONSORTIA_SHOP,
            this.consortiaInfo.shopLevel,
          );
          break;
        default:
          break;
      }
      element.data = info;
    }
    this.refreshGrade();

    this.itemCurLevel.getChild("txtName").text =
      LangManager.Instance.GetTranslation("Consortia.Upgrade.Introductions");
    this.itemNextLevel.getChild("txtName").text =
      LangManager.Instance.GetTranslation("Consortia.Upgrade.NextLevel");
    this.itemUpgradeRequirements.getChild("txtName").text =
      LangManager.Instance.GetTranslation("Consortia.Upgrade.Demand");
    this.itemUpgradeConsume.getChild("txtName").text =
      LangManager.Instance.GetTranslation("Consortia.Upgrade.Consume");
    this.itemUpgradeCool.getChild("txtName").text =
      LangManager.Instance.GetTranslation("Consortia.Upgrade.CoolTime");

    this.list.selectedIndex = 0;
    this._currentBtnInfo = this.list.getChildAt(0).data as ConsortiaUpgradeInfo;
  }

  private __clickItem(item: BaseIcon) {
    if (this._currentBtnInfo == item.data) return;
    this._currentBtnInfo = item.data as ConsortiaUpgradeInfo;
    this.refreshView();
    this.refreshCoolTime();
  }

  private btnQuickCoolClick() {
    let cfgValue = 1;
    let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName(
      "ConsortiaQuic_Price",
    );
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    let point: number = cfgValue * Math.ceil(this._data.timeLeft / 600);
    let content: string = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.ConsortiaFrameTopView.quickBtnAlertTipData",
      point,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      { point: point, checkDefault: true },
      null,
      content,
      null,
      null,
      (b: boolean, check: boolean, data: any) => {
        if (b) this._contorller.sendQuickTime(check);
      },
    );
  }

  private btnUpgradeClick(evt: Event) {
    let tInfo: t_s_consortialevelData =
      TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
        this._currentBtnInfo.type,
        this._currentBtnInfo.grade + 1,
      );
    if (this.consortiaInfo.offer < tInfo.NeedOffer) {
      var content = LangManager.Instance.GetTranslation(
        "consortia.helper.ConsortiaUpgradeHelper.content",
      );
      SimpleAlertHelper.Instance.Show(
        null,
        null,
        null,
        content,
        null,
        null,
        (b: boolean) => {
          if (b) FrameCtrlManager.Instance.open(EmWindow.ConsortiaContribute);
        },
      );
      return;
    }
    this._contorller.consortiaUpgrade(this._currentBtnInfo);
  }

  private __onConsortiaInfoUpdata() {
    this.refreshGrade();
    this.refreshView();
    this.refreshCoolTime();
  }

  private __onCooldownTimeUpdata() {
    this.refreshCoolTime();
  }

  private refreshCoolTime() {
    let timeLeft = this._data.timeLeft;
    if (timeLeft > 0) {
      this.txtCountDown.text =
        LangManager.Instance.GetTranslation(
          "Consortia.Upgrade.UpgradeCoolDownTime",
        ) + DateFormatter.getConsortiaCountDate(timeLeft);
      this.imgCountDownBg.visible = true;
      if (this.isMaxLevel) {
        this.btnUpgrade.enabled = false;
        this.btnQuickCool.enabled = false;
      } else {
        // this._isMoving = true;
        this.btnUpgrade.enabled = false;
        this.btnQuickCool.enabled = true;
      }
    } else {
      // this._isMoving = false;
      this.btnQuickCool.enabled = false;
      this.txtCountDown.text = "";
      this.imgCountDownBg.visible = false;
      this.checkEnable();
    }
  }

  private refreshGrade() {
    for (let index = 0; index < this.list.numItems; index++) {
      const element = this.list.getChildAt(index);
      let vData = element.data as ConsortiaUpgradeInfo;
      switch (index) {
        case 0: //公会等级
          vData.grade = this.consortiaInfo.levels;
          break;
        case 1: //公会任务等级
          vData.grade = this.consortiaInfo.storeLevel;
          break;
        case 2: //公会祭坛
          vData.grade = this.consortiaInfo.altarLevel;
          break;
        case 3: //公会技能
          vData.grade = this.consortiaInfo.schoolLevel;
          break;
        case 4: //公会商店
          vData.grade = this.consortiaInfo.shopLevel;
          break;
        default:
          break;
      }
      element.text = LangManager.Instance.GetTranslation(
        "public.level2",
        vData.grade,
      );
    }
  }

  private refreshView() {
    switch (this._currentBtnInfo.type) {
      case ConsortiaUpgradeType.CONSORTIA:
        this.txtUpgradeTitle.text = LangManager.Instance.GetTranslation(
          "Consortia.Upgrade.GradeTitle",
        );
        break;
      case ConsortiaUpgradeType.SAFE_DEPOSIT_BOX:
        this.txtUpgradeTitle.text = LangManager.Instance.GetTranslation(
          "Consortia.Upgrade.BagTitle",
        );
        break;
      case ConsortiaUpgradeType.CONSORTIA_ALTAR:
        this.txtUpgradeTitle.text = LangManager.Instance.GetTranslation(
          "Consortia.Upgrade.AltarTitle",
        );
        break;
      case ConsortiaUpgradeType.LING_SHI:
        this.txtUpgradeTitle.text = LangManager.Instance.GetTranslation(
          "Consortia.Upgrade.SkillTitle",
        );
        break;
      case ConsortiaUpgradeType.CONSORTIA_SHOP:
        this.txtUpgradeTitle.text = LangManager.Instance.GetTranslation(
          "Consortia.Upgrade.ShopTitle",
        );
        break;
    }
    //当前等级
    this.itemCurLevel.text = this._currentBtnInfo.templete
      ? this._currentBtnInfo.templete.DescriptionLang
      : "";

    if (this.checkMaxLevel()) return;

    //下一等级
    let tInfo = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
      this._currentBtnInfo.type,
      this._currentBtnInfo.grade + 1,
    );
    this.itemNextLevel.text = tInfo.DescriptionLang;

    // 前置要求
    this._satisfy = true;
    let preTemp: t_s_consortialevelData =
      TempleteManager.Instance.getConsortiaTempleteById(tInfo.PreTemplateId);
    if (preTemp) {
      let c = this.itemUpgradeRequirements.getController("showColor");
      if (
        this.consortiaInfo.getLevelByUpgradeType(preTemp.Types) < preTemp.Levels
      ) {
        c.selectedIndex = 1;
        this._satisfy = false;
      } else {
        c.selectedIndex = 0;
      }
      this.itemUpgradeRequirements.title = LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.chairmanPath.ConsortiaUpgradeFrame.needed",
        preTemp.LevelNameLang,
        preTemp.Levels,
      );
      this.itemUpgradeRequirements.visible = true;
    } else {
      this.itemUpgradeRequirements.visible = false;
    }

    //消耗财富
    this.itemUpgradeConsume.getController("showColor").selectedIndex =
      this.consortiaInfo.offer < tInfo.NeedOffer ? 1 : 0;
    this.itemUpgradeConsume.title = tInfo.NeedOffer + "";
    // this.itemUpgradeConsume.title = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaUpgradeFrame.consume", tInfo.NeedOffer)

    //需要时间
    this.itemUpgradeCool.text = DateFormatter.getConsortiaCountDate(
      tInfo.CodeTime,
    );

    this.checkEnable();
  }

  private checkEnable() {
    if (this._satisfy && !this.isMaxLevel) this.btnUpgrade.enabled = true;
    else this.btnUpgrade.enabled = false;
  }

  private checkMaxLevel(): boolean {
    this.itemCurLevel.visible = this.isMaxLevel;
    this.itemNextLevel.visible = !this.isMaxLevel;
    this.itemUpgradeRequirements.visible = !this.isMaxLevel;
    this.itemUpgradeConsume.visible = !this.isMaxLevel;
    this.itemUpgradeCool.visible = !this.isMaxLevel;
    this.btnUpgrade.enabled = !this.isMaxLevel;
    return this.isMaxLevel;
  }

  private get isMaxLevel(): boolean {
    return this._currentBtnInfo.grade == ConsortiaUpgradeType.MAX_LEVEL;
  }

  private get consortiaInfo(): ConsortiaInfo {
    return this._data.consortiaInfo;
  }

  private removeEvent() {
    this._data.removeEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__onConsortiaInfoUpdata,
      this,
    );
    this._data.removeEventListener(
      ConsortiaEvent.UPDA_COOLDOWN_TIME,
      this.__onCooldownTimeUpdata,
      this,
    );
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
