//@ts-expect-error: External dependencies
import FUI_Dialog2 from "../../../../fui/Base/FUI_Dialog2";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { IconFactory } from "../../../core/utils/IconFactory";
import { t_s_herotemplateData } from "../../config/t_s_herotemplate";
import { PetEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import OpenGrades from "../../constant/OpenGrades";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { MsgMan } from "../../manager/MsgMan";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import PetBossModel from "./PetBossModel";
/**
 * 保卫英灵岛
 */
export default class PetGuardWnd extends BaseWindow {
  private leftTimeNum: number;
  public btn_go: fgui.GButton;
  txt_time: fairygui.GTextField;
  txt_name: fairygui.GTextField;
  txt2: fairygui.GTextField;
  txt1: fairygui.GTextField;
  c1: fairygui.Controller;
  img_boss: fairygui.GLoader;
  frame: FUI_Dialog2;

  private get petBossModel(): PetBossModel {
    return CampaignManager.Instance.petBossModel;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.c1 = this.getController("c1");
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "TopToolBar.petGuard",
    );
    this.btn_go.title = LangManager.Instance.GetTranslation(
      "gameguide.GameGuideFrame.skipNow",
    );
    this.txt1.text = LangManager.Instance.GetTranslation(
      "petboss.PetbossItem.nextBossAlert",
    );
    this.txt2.text = LangManager.Instance.GetTranslation(
      "petboss.PetbossItem.describe",
    );
    this.addEvent();
    PlayerManager.Instance.synchronizedSystime();
    this.refresh();
  }

  private addEvent() {
    MsgMan.addObserver(PetEvent.PET_BOSS_ITEM_CLICK, this, this.__clickHandler);
    PlayerManager.Instance.addEventListener(
      PlayerEvent.PET_BOSS,
      this.updateSvrTime,
      this,
    );
    this.btn_go.onClick(this, this.onGo);
  }

  private refresh(): void {
    Laya.timer.clear(this, this.onTimer);
    if (this.petBossModel.isOpen) {
      //2开启后: 显示对应配置的BOSS头像及前往按钮, 玩家点击前往按钮将自动寻路到英灵岛中
      this.showBossInfo();
    } else {
      this.leftTimeNum = this.petBossModel.getNearlyOpenTimeSecond();
      //1未开启: 显示BOSS倒计时
      this.c1.setSelectedIndex(0);
      this.txt_time.text = DateFormatter.getConsortiaCountDate(
        this.leftTimeNum,
      );
      Laya.timer.loop(1000, this, this.onTimer);
    }
  }

  updateSvrTime() {
    PlayerManager.Instance.removeEventListener(
      PlayerEvent.PET_BOSS,
      this.updateSvrTime,
      this,
    );
    this.leftTimeNum = this.petBossModel.getNearlyOpenTimeSecond();
  }

  private showBossInfo() {
    this.c1.setSelectedIndex(1);
    var heroTemp: t_s_herotemplateData =
      TempleteManager.Instance.gameHeroTemplateCate(this.petBossModel.heroId);
    if (heroTemp) {
      this.txt_name.text = heroTemp.TemplateNameLang;
      this.img_boss.url = IconFactory.getHeroIconByPics(heroTemp.Icon);
    }
  }

  onTimer() {
    if (this.leftTimeNum > 0) {
      this.leftTimeNum--;
      this.txt_time.text = DateFormatter.getConsortiaCountDate(
        this.leftTimeNum,
      );
    } else {
      this.txt_time.text = "00:00:00";
      Laya.timer.clear(this, this.onTimer);
      this.showBossInfo();
    }
  }

  private onGo(): void {
    if (this.petBossModel.isOpen) {
      if (ArmyManager.Instance.thane.grades < OpenGrades.PET) {
        let str =
          LangManager.Instance.GetTranslation(
            "room.view.pve.RoomRightView.command03",
          ) +
          LangManager.Instance.GetTranslation(
            "public.level4_space2",
            OpenGrades.PET,
          );
        MessageTipManager.Instance.show(str);
      } else {
        SwitchPageHelp.walkToCrossMapTarget(
          this.petBossModel.mapId + "," + this.petBossModel.nodeId,
        );
      }
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "dayGuide.view.DailyItem.PetBossUnOpen",
        ),
      );
    }
    // _effect.stop();
    MsgMan.notifyObserver(PetEvent.PET_BOSS_ITEM_CLICK);
  }

  __clickHandler() {
    this.hide();
  }

  removeEvent() {
    PlayerManager.Instance.removeEventListener(
      PlayerEvent.PET_BOSS,
      this.updateSvrTime,
      this,
    );
    MsgMan.removeObserver(
      PetEvent.PET_BOSS_ITEM_CLICK,
      this,
      this.__clickHandler,
    );
    this.btn_go.offClick(this, this.onGo);
    Laya.timer.clear(this, this.onTimer);
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }
}
