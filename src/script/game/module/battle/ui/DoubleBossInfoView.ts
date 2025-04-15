import FUI_DoubleBossInfoView from "../../../../../fui/CampaignCommon/FUI_DoubleBossInfoView";
import Resolution from "../../../../core/comps/Resolution";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import ResMgr from "../../../../core/res/ResMgr";
import UIButton, { UIButtonChangeType } from "../../../../core/ui/UIButton";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { BattleModel } from "../../../battle/BattleModel";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { StripUIView } from "../../../component/StripUIView";
import { t_s_herotemplateData } from "../../../config/t_s_herotemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { NativeEvent } from "../../../constant/event/NotificationEvent";
// import { IStrip } from "../../../interfaces/IStrip";
import { NotificationManager } from "../../../manager/NotificationManager";
import { BossBufferContainer } from "./buffer/BossBufferContainer";

interface IStrip {
  maxValue: number;
  currentValue: number;
  currentIndex: number;
  dispose(): void;
}

export class DoubleBossInfoView extends FUI_DoubleBossInfoView {
  public static UIName: string = "DoubleBossInfoView";
  protected tempEffectList: any[] = [];
  protected _stripNum1: number = 0;
  protected _stripNum2: number = 0;

  protected _headUrl1: string;
  protected _hpStrip1: IStrip;
  protected _info1: HeroRoleInfo;
  protected _buffContainer1: BossBufferContainer;

  protected _headUrl2: string;
  protected _hpStrip2: IStrip;
  protected _info2: HeroRoleInfo;
  protected _buffContainer2: BossBufferContainer;

  protected r_hp1: fgui.GTextField;
  protected r_name1: fgui.GTextField;
  protected r_grade1: fgui.GTextField;
  protected r_title1: fgui.GTextField;
  protected hpProgress1: fgui.GComponent;
  protected uibtnHead1: UIButton;

  protected r_hp2: fgui.GTextField;
  protected r_name2: fgui.GTextField;
  protected r_grade2: fgui.GTextField;
  protected r_title2: fgui.GTextField;
  protected hpProgress2: fgui.GComponent;
  protected uibtnHead2: UIButton;
  onConstruct() {
    super.onConstruct();
    this.uibtnHead1 = new UIButton(this.btnHead1);
    this.uibtnHead1.changeType = UIButtonChangeType.Light;
    this.uibtnHead2 = new UIButton(this.btnHead2);
    this.uibtnHead2.changeType = UIButtonChangeType.Light;
    this.addEvent();
  }

  setParent(target) {
    if (!this.parent) {
      if (target instanceof Laya.Sprite) {
        target.addChild(this.displayObject);
      } else {
        target.addChild(this);
      }
      this.x = target.width - this.width - Resolution.deviceStatusBarHeightR;
      this.y = 0;
    }
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this,
    );
  }

  public setInfo(info1: HeroRoleInfo, info2: HeroRoleInfo) {
    this._info1 = info1;
    this._info2 = info2;
    this.initView();
  }

  protected initView() {
    this.initBossHead();
    this.initBossHp();
    this.hpProgress1 = this.progBossHp1.getChild("progress").asCom;
    this.hpProgress2 = this.progBossHp2.getChild("progress").asCom;
    let template1: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_herotemplate,
      this._info1.heroInfo.templateId.toString(),
    );
    if (!template1) {
      return;
    }
    this.r_grade1.text = template1.Grades.toString();
    this.r_name1.text = this._info1.heroInfo.nickName;

    if (template1.AddNameLang && template1.AddNameLang != "undefined") {
      this.r_title1.text = "<" + template1.AddNameLang + ">";
    }
    let template2: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_herotemplate,
      this._info2.heroInfo.templateId.toString(),
    );
    if (!template2) {
      return;
    }
    this.r_grade2.text = template2.Grades.toString();
    this.r_name2.text = this._info2.heroInfo.nickName;

    if (template2.AddNameLang && template2.AddNameLang != "undefined") {
      this.r_title2.text = "<" + template2.AddNameLang + ">";
    }
  }

  private initBossHead() {
    if (this._info1) {
      if (this._info1.playerIconId == 0) {
        this._headUrl1 = IconFactory.getHeroIconByPics(
          this._info1.heroInfo.templateInfo.Icon,
        );
      } else {
        //使用领主的icon
        this._headUrl1 = IconFactory.getHeroIconByPics(
          this._info1.heroInfo.templateInfo.Icon,
        );
      }
      this.uibtnHead1.icon = this._headUrl1;
    }
    if (this._info2) {
      if (this._info2.playerIconId == 0) {
        this._headUrl2 = IconFactory.getHeroIconByPics(
          this._info2.heroInfo.templateInfo.Icon,
        );
      } else {
        //使用领主的icon
        this._headUrl2 = IconFactory.getHeroIconByPics(
          this._info2.heroInfo.templateInfo.Icon,
        );
      }
      this.uibtnHead2.icon = this._headUrl2;
    }
  }

  private initBossHp() {
    this._stripNum1 = BattleModel.getBossHpStripNum(
      this._info1.heroInfo.templateId,
    );
    this._stripNum2 = BattleModel.getBossHpStripNum(
      this._info2.heroInfo.templateId,
    );
    this.r_name1 = this.txtRBossName1;
    this.r_grade1 = this.txtRBossGrade1;
    this.r_title1 = this.txtRBossTitleName1;
    this.progBossHp1.getChild("txtStripNum").x = 500;
    let asset1 = [];
    let comp1 = this.progBossHp1;
    let transGImg1 = comp1.getChild("transitionBar") as fgui.GImage;
    if (this._stripNum1 <= 1) {
      asset1.push(comp1.getChild("level4"));
    } else {
      for (let i = 1; i <= this._stripNum1; i++) {
        asset1.push(comp1.getChild("level" + i));
      }
    }
    this._hpStrip1 = new StripUIView(asset1, undefined, undefined, transGImg1);
    this.r_name2 = this.txtRBossName2;
    this.r_grade2 = this.txtRBossGrade2;
    this.r_title2 = this.txtRBossTitleName2;
    let asset2 = [];
    let comp2 = this.progBossHp2;
    let transGImg2 = comp2.getChild("transitionBar") as fgui.GImage;
    if (this._stripNum2 <= 1) {
      asset2.push(comp2.getChild("level4"));
    } else {
      for (let i = 1; i <= this._stripNum2; i++) {
        asset2.push(comp2.getChild("level" + i));
      }
    }
    this._hpStrip2 = new StripUIView(asset2, undefined, undefined, transGImg2);
  }

  /**
   * 总血量值.
   */
  public setTotalHp(value1: number, value2: number) {
    this._hpStrip1.maxValue = value1;
    this._hpStrip2.maxValue = value2;
  }
  /**
   * 当前血量值.
   */
  public setCurrentHp(value1: number, value2: number) {
    this._hpStrip1.currentValue = value1;
    this._hpStrip2.currentValue = value2;
  }

  public setCurrentIndex(value1: number, value2: number) {
    this._hpStrip1.currentIndex = value1;
    this._hpStrip2.currentIndex = value2;
  }

  public get stripNum1(): number {
    return this._stripNum1;
  }

  public get stripNum2(): number {
    return this._stripNum2;
  }

  protected onAfterStatusBarChange() {
    if (this.parent) {
      this.x =
        this.parent.width - this.width - Resolution.deviceStatusBarHeightR;
    }
  }
  public set bossBufferContainer1(value: BossBufferContainer) {
    this._buffContainer2 = value;
  }

  public get bossBufferContainer1(): BossBufferContainer {
    return this._buffContainer1;
  }

  public set bossBufferContainer2(value: BossBufferContainer) {
    this._buffContainer1 = value;
  }

  public get bossBufferContainer2(): BossBufferContainer {
    return this._buffContainer2;
  }

  public dispose() {
    if (this.tempEffectList) this.tempEffectList.length = 0;
    ResMgr.Instance.cancelLoadByUrl(this._headUrl1);
    ResMgr.Instance.cancelLoadByUrl(this._headUrl2);
    if (this._hpStrip1) this._hpStrip1.dispose();
    if (this._hpStrip2) this._hpStrip2.dispose();
    if (this._buffContainer1) this._buffContainer1.dispose();
    if (this._buffContainer2) this._buffContainer2.dispose();
    this.removeEvent();
    super.dispose();
  }
}
