import FUI_GeniusItem from "../../../../../fui/Skill/FUI_GeniusItem";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { TalentEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { SkillInfo } from "../../../datas/SkillInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";

/**
 * @author:pzlricky
 * @data: 2021-04-25 19:49
 * @description 天赋列表Item
 */
export default class GeniusItem
  extends FUI_GeniusItem
  implements ITipedDisplay
{
  extData: any = "center";
  tipData: any;
  tipType: EmWindow;
  canOperate: boolean = false;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 0);

  private _itemdata: SkillInfo;
  private _isOpen: boolean;
  private _canAdd: boolean;

  onConstruct() {
    super.onConstruct();
    // this.addEvent();
  }

  // private addEvent() {
  //     this.onClick(this, this.__onItemSelect);
  // }

  // private offEvent() {
  //     this.onClick(this, this.__onItemSelect);
  // }

  // private __onItemSelect() {
  //     NotificationManager.Instance.dispatchEvent(TalentEvent.SELECT_TALENT, this);
  // }

  private refreshView() {
    if (!this._itemdata) return;
    var condition: Array<string> = [];
    this.level.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this._itemdata.grade,
    );
    if (this._itemdata.grade > 0) {
      this.thane.talentData.curUsedTalentPoint += this._itemdata.grade;
    }
    if (this._itemdata.templateInfo.Icons) {
      this.itemIcon.icon = IconFactory.getTecIconByIcon(
        this._itemdata.templateInfo.Icons,
      );
    }

    this.checkCondition();
    var nextTemp: t_s_skilltemplateData = this._itemdata.nextTemplateInfo;
    let condictionValue = true;
    if (nextTemp) {
      condition = this._itemdata.checkTalentUpgradeCondition(nextTemp);
    }
    condictionValue = condition.length == 0;
    let point = this.thane.talentData.talentPoint > 0;
    this.upgrade.selectedIndex =
      this._canAdd && condictionValue && point && nextTemp ? 1 : 0;
    if (this.tipType !== EmWindow.TalentItemTips) {
      this.tipType = EmWindow.TalentItemTips;
      ToolTipsManager.Instance.register(this);
    }
    this.tipData = this._itemdata;
    if (this._itemdata.grade == 0) {
      if (this.level.visible) this.level.visible = false;
      if (this.textbg.visible) this.textbg.visible = false;
      this.study.selectedIndex = 0;
    } else {
      if (!this.level.visible) this.level.visible = true;
      if (!this.textbg.visible) this.textbg.visible = true;
    }
  }

  public checkCondition() {
    if (!this._itemdata) return;
    this._isOpen = false;
    this._canAdd = false;
    if (this.checkCanAdd()) {
      //可加点
      // UIFilter.normal(this.itemIcon.displayObject);
      this._canAdd = true;
    } else {
      //不可加点
      // UIFilter.gray(this.itemIcon.displayObject);
      this.study.selectedIndex = 0;
    }
    if (this._itemdata.grade > 0) {
      //已经激活的
      // UIFilter.normal(this.itemIcon.displayObject);
      this.study.selectedIndex = 1;
      this._canAdd = true;
    }
  }

  private checkCanAdd(): boolean {
    if (!this._itemdata.nextTemplateInfo) return false;
    if (this.thane.talentData.talentPoint <= 0) return false;
    if (
      this._itemdata.checkTalentUpgradeCondition(
        this._itemdata.nextTemplateInfo,
      ).length > 0
    )
      return false;
    return true;
  }

  public set Itemdata(value: SkillInfo) {
    this._itemdata = value;
    if (!this._itemdata) {
      this.visible = false;
      return;
    }
    this.refreshView();
  }

  public get Itemdata(): SkillInfo {
    return this._itemdata;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public dispose() {
    // this.offEvent();
    ObjectUtils.disposeAllChildren(this);
    super.dispose();
  }
}
