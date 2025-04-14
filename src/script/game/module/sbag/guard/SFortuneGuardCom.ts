import FUI_SFortuneGuardCom from "../../../../../fui/SBag/FUI_SFortuneGuardCom";
import LangManager from "../../../../core/lang/LangManager";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import UIManager from "../../../../core/ui/UIManager";
import { BagType } from "../../../constant/BagDefine";
import GoodsSonType from "../../../constant/GoodsSonType";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../../constant/UIDefine";
import { FateRotarySkillInfo } from "../../../datas/FateRotarySkillInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { BagHelper } from "../../bag/utils/BagHelper";
import { SFateRotarySkillItem } from "../SFateRotarySkillItem";

/**
 * 新版背包
 * @description 命运守护
 * @author zhihua.zhou
 * @date 2022/12/5
 * @ver 1.3
 */
export class SFortuneGuardCom extends FUI_SFortuneGuardCom {
  private item0: SFateRotarySkillItem;
  private item1: SFateRotarySkillItem;
  private _showingTip: boolean = false;
  private isInit: boolean = false;

  onConstruct() {
    super.onConstruct();
    this.item0 = this.atkFortune as SFateRotarySkillItem;
    this.item1 = this.protectFortune as SFateRotarySkillItem;
  }

  onShow() {
    this.initView();
    this.checkRedDot();
  }

  onHide() {
    if (this.isInit) {
      this.isInit = false;
      this.removeEvent();
    }
  }

  checkRedDot() {
    if (this.item0.itemData) {
      this.modeList.getChildAt(0).asButton.getChild("redDot").visible =
        this.canLevelUp(this.item0.itemData);
      this.modeList.getChildAt(1).asButton.getChild("redDot").visible =
        this.canLevelUp(this.item1.itemData);
    }
  }

  private canLevelUp(element: FateRotarySkillInfo) {
    if (!element) return false;
    let goodsCount = GoodsManager.Instance.getCountBySontypeAndBagType(
      GoodsSonType.SONTYPE_FATE_STONE,
      BagType.Player,
    );
    let temp = element.template;
    let nextTemp = element.nextUpgradeTemp;
    let nextSkillTemp =
      TempleteManager.Instance.getSkillTemplateInfoBySonTypeAndGrade(
        temp.SonType,
        temp.Grades + 2,
      );
    if (!nextSkillTemp) {
      return false;
    }
    nextSkillTemp =
      TempleteManager.Instance.getSkillTemplateInfoBySonTypeAndGrade(
        temp.SonType,
        temp.Grades + 1,
      );
    if (nextSkillTemp) {
      let need = nextTemp.Data - element.currentGp;
      if (goodsCount >= need) {
        return true;
      }
    }
    return false;
  }

  private initView() {
    if (!this.isInit) {
      this.isInit = true;
      this.addEvent();
    }
    this.initSkill();
    this.refreshRunCircleView();
    this.modeList.selectedIndex = 0;
    this.c1.selectedIndex = this.modeList.selectedIndex;
  }

  private compare(x: FateRotarySkillInfo, y: FateRotarySkillInfo) {
    if (x.templateId > y.templateId) {
      return 1;
    } else if (x.templateId == y.templateId) {
      return 0;
    } else {
      return -1;
    }
  }

  private initSkill() {
    let list = ArmyManager.Instance.thane.fateRotarySkillList;
    list.sort(this.compare);
    if (list[0]) {
      this.item0.setData(list[0]);
      this.item0.refreshRunCircleView();
      this.atkLvLab.text = list[0].template.SkillTemplateName;
    }

    if (list[1]) {
      this.item1.setData(list[1]);
      this.item1.refreshRunCircleView();
      this.protectLvLab.text = list[1].template.SkillTemplateName;
    }
  }

  private addEvent() {
    this.fateIcon.onClick(this, this.onShowTip);
    this.modeList.on(fgui.Events.CLICK_ITEM, this, this.__clickModeItem);
    ServerDataManager.listen(
      S2CProtocol.U_C_FATE_REQUEST,
      this,
      this.__resuleHandler,
    );
  }

  private removeEvent() {
    this.fateIcon.offClick(this, this.onShowTip);
    this.modeList.off(fgui.Events.CLICK_ITEM, this, this.__clickModeItem);
    ServerDataManager.cancel(
      S2CProtocol.U_C_FATE_REQUEST,
      this,
      this.__resuleHandler,
    );
  }

  private __clickModeItem(itemObject: fgui.GObject) {
    this.c1.selectedIndex = this.modeList.selectedIndex;
  }

  public __resuleHandler() {
    this.refreshRunCircleView();
  }

  public refreshRunCircleView() {
    let list = ArmyManager.Instance.thane.fateRotarySkillList;
    let count = 0;
    let info: FateRotarySkillInfo;
    for (let i = 0, length = list.length; i < length; i++) {
      info = list[i];
      count += info.totalGp;
    }
    this.ownFateLab.text = count * 10 + "";
    this.fortuneLab.text = this.ownFateLab.text;
    let grade0 = list[0] ? list[0].grades : 0;
    let grade1 = list[1] ? list[1].grades : 0;
    this.atkLab.text = this.txt_lv0.text = LangManager.Instance.GetTranslation(
      "public.level3",
      grade0,
    );
    this.protectLab.text = this.txt_lv1.text =
      LangManager.Instance.GetTranslation("public.level3", +grade1);
  }

  onShowTip(evt?: any) {
    this._showingTip = !this._showingTip;
    this.fortuneTip.visible = this._showingTip;
    if (this._showingTip)
      Laya.stage.on(Laya.Event.CLICK, this, this.onStageClick);
    else Laya.stage.off(Laya.Event.CLICK, this, this.onStageClick);
    evt.stopPropagation();
  }

  onStageClick(evt: Laya.Event) {
    let sourceTarget = evt.target["$owner"];
    if (this.fateIcon.displayObject == sourceTarget) {
      this.onShowTip(evt);
      evt.stopPropagation();
      return;
    }
    if (this._showingTip) {
      this.onShowTip(evt);
    }
  }

  /**
   * 帮助说明
   */
  private helpBtnClick() {
    let title = LangManager.Instance.GetTranslation("public.help");
    let content = LangManager.Instance.GetTranslation(
      "DragonSoulView.HelpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }
}
