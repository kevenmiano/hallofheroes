import FUI_AttrItem from "../../../../../fui/SBag/FUI_AttrItem";
import FUI_HonorCom from "../../../../../fui/SBag/FUI_HonorCom";
import LangManager from "../../../../core/lang/LangManager";
import { t_s_honorequipData } from "../../../config/t_s_honorequip";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PathManager } from "../../../manager/PathManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { BagHelper } from "../../bag/utils/BagHelper";

/**
 * 新版背包
 * @description 荣誉
 * @author zhihua.zhou
 * @date 2023/2/14
 * @ver 1.5
 */
export class HonorCom extends FUI_HonorCom {
  private isInited: boolean = false;
  private tabData: Array<string>;
  /** 当前等级 */
  private curLevel: number = 0;
  /** 当前阶 */
  private curRank: number = 0;

  public tipItem1: BaseTipItem;

  public tipItem2: BaseTipItem;
  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  onConstruct() {
    super.onConstruct();
    this.helpBtn.onClick(this, this.btnHelpClick);
    this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_XUNZHANG);
  }

  btnHelpClick() {
    let title = "";
    let content = "";
    title = LangManager.Instance.GetTranslation("public.help");
    content =
      LangManager.Instance.GetTranslation("honor.levelup.tips") +
      this.getHonorStr();
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  public init() {
    this.txt1.text = LangManager.Instance.GetTranslation("honorEquip.str1");
    this.txt2.text = LangManager.Instance.GetTranslation("honorEquip.str2");
    this.txt3.text = LangManager.Instance.GetTranslation("honorEquip.str3");
    this.txt4.text = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.skill.ConsortiaSkillItem.tip.title2",
    );
    this.txt5.text = LangManager.Instance.GetTranslation("honorEquip.str4");
    this.txt6.text = LangManager.Instance.GetTranslation("honorEquip.str5");
    this.txt7.text = LangManager.Instance.GetTranslation("honorEquip.str6");
    this.txt8.text = LangManager.Instance.GetTranslation("honorEquip.str9");
    this.item0.getChild("txt_cur").text =
      LangManager.Instance.GetTranslation("honorEquip.str7");
    this.item1.getChild("txt_cur").text =
      LangManager.Instance.GetTranslation("honorEquip.str8");
    this.addEvent();
    this.tabData = [
      LangManager.Instance.GetTranslation("armyII.viewII.skill.btnUpgrade"),
      LangManager.Instance.GetTranslation("honorEquip.rank"),
    ];
    this.tab.numItems = this.tabData.length;
    this.tab.selectedIndex = 0;
    this.onTab();
  }

  getHonorStr(): string {
    let value = "";
    let honorCfg = TempleteManager.Instance.getHonorCfgs();
    for (const key in honorCfg) {
      if (Object.prototype.hasOwnProperty.call(honorCfg, key)) {
        let item: t_s_honorequipData = honorCfg[key];
        if (item.HonorequipnameLang != "" && item.Honor > 0)
          value += LangManager.Instance.GetTranslation(
            "honor.levelup.tipsItem",
            item.HonorequipnameLang,
            item.Honor,
          );
      }
    }
    return value;
  }

  onShow() {
    this.curLevel = this.thane.honorEquipLevel;
    this.curRank = this.thane.honorEquipStage;
    if (!this.isInited) {
      this.init();
      this.isInited = true;
    }
    this.updateLevelAttr();
    this.updateRankAttr();
  }

  onHide() {
    if (this.isInited) {
      this.removeEvent();
    }
    this.isInited = false;
  }

  /**
   * 升级属性
   */
  private updateLevelAttr() {
    this.txtLv0.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this.curLevel,
    );
    this.txtLv1.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this.curLevel + 1,
    );
    //升级读取[t_s_honorequip]的UpgradeType=0时, 为升级类型 再根据对应的Level, 读取提升消耗ConsumeMedal和ConsumeGold提升属性值
    let ismax: boolean = false;
    let curCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      0,
      this.curLevel,
    );
    let nextCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      0,
      this.curLevel + 1,
    );
    if (nextCfg) {
      this.txt_gold.text = curCfg.ConsumeGold + "";
      this.txt_cost.text = curCfg.ConsumeMedal + "";
      let own_num = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.MEDAL_TEMPID,
      );
      this.txt_cost.color =
        own_num >= curCfg.ConsumeMedal ? "#FFECC6" : "#ff0000";
      this.txt_gold.color =
        ResourceManager.Instance.gold.count >= curCfg.ConsumeGold
          ? "#FFECC6"
          : "#ff0000";
      this.btn_levelUp.getChild("redDot").visible = this.tab
        .getChildAt(0)
        .asButton.getChild("redDot").visible =
        BagHelper.Instance.checkHonorUpLevel(this.curLevel);

      // this.btn_levelUp.enabled = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MEDAL_TEMPID) >= curCfg.ConsumeMedal && ResourceManager.Instance.gold.count >= curCfg.ConsumeGold;
    } else {
      ismax = true;
      this.btn_levelUp.getChild("redDot").visible = this.tab
        .getChildAt(0)
        .asButton.getChild("redDot").visible = false;
    }
    this.c2.selectedIndex = ismax ? 1 : 0;

    let attrIndex: number = 0;

    if (
      curCfg.Power > 0 ||
      (this.curLevel == 0 && nextCfg.Power > curCfg.Power)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.Power") + ":";
      item.getChild("txt_value").text = curCfg.Power.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Power - curCfg.Power
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Power != curCfg.Power;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.Agility > 0 ||
      (this.curLevel == 0 && nextCfg.Agility > curCfg.Agility)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.Agility") + ":";
      item.getChild("txt_value").text = curCfg.Agility.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Agility - curCfg.Agility
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Agility != curCfg.Agility;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.Intellect > 0 ||
      (this.curLevel == 0 && nextCfg.Intellect > curCfg.Intellect)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.Intellect") + ":";
      item.getChild("txt_value").text = curCfg.Intellect.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Intellect - curCfg.Intellect
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Intellect != curCfg.Intellect;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.Physique > 0 ||
      (this.curLevel == 0 && nextCfg.Physique > curCfg.Physique)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.Physique") + ":";
      item.getChild("txt_value").text = curCfg.Physique.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Physique - curCfg.Physique
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Physique != curCfg.Physique;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.Captain > 0 ||
      (this.curLevel == 0 && nextCfg.Captain > curCfg.Captain)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.Captain") + ":";
      item.getChild("txt_value").text = curCfg.Captain.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Captain - curCfg.Captain
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Captain != curCfg.Captain;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.Attack > 0 ||
      (this.curLevel == 0 && nextCfg.Attack > curCfg.Attack)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip06") +
        ":";
      item.getChild("txt_value").text = curCfg.Attack.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Attack - curCfg.Attack
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Attack != curCfg.Attack;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.Defence > 0 ||
      (this.curLevel == 0 && nextCfg.Defence > curCfg.Defence)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip07") +
        ":";
      item.getChild("txt_value").text = curCfg.Defence.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Defence - curCfg.Defence
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Defence != curCfg.Defence;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.MagicAttack > 0 ||
      (this.curLevel == 0 && nextCfg.MagicAttack > curCfg.MagicAttack)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip08") +
        ":";
      item.getChild("txt_value").text = curCfg.MagicAttack.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.MagicAttack - curCfg.MagicAttack
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.MagicAttack != curCfg.MagicAttack;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.MagicDefence > 0 ||
      (this.curLevel == 0 && nextCfg.MagicDefence > curCfg.MagicDefence)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip09") +
        ":";
      item.getChild("txt_value").text = curCfg.MagicDefence.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.MagicDefence - curCfg.MagicDefence
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.MagicDefence != curCfg.MagicDefence;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.ForceHit > 0 ||
      (this.curLevel == 0 && nextCfg.ForceHit > curCfg.ForceHit)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.ForceHit") + ":";
      item.getChild("txt_value").text = curCfg.ForceHit.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.ForceHit - curCfg.ForceHit
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.ForceHit != curCfg.ForceHit;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.Parry > 0 ||
      (this.curLevel == 0 && nextCfg.Parry > curCfg.Parry)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.Parry") + ":";
      item.getChild("txt_value").text = curCfg.Parry.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Parry - curCfg.Parry
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Parry != curCfg.Parry;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (curCfg.Live > 0 || (this.curLevel == 0 && nextCfg.Live > curCfg.Live)) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.Live") + ":";
      item.getChild("txt_value").text = curCfg.Live.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (nextCfg.Live - curCfg.Live).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Live != curCfg.Live;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      attrIndex++;
      item.visible = true;
    }
    if (
      curCfg.Conat > 0 ||
      (this.curLevel == 0 && nextCfg.Conat > curCfg.Conat)
    ) {
      let item: FUI_AttrItem = this["attrItem" + attrIndex];
      item.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("property.Conat") + ":";
      item.getChild("txt_value").text = curCfg.Conat.toString();
      if (nextCfg) {
        item.getChild("txt_add").text = (
          nextCfg.Conat - curCfg.Conat
        ).toString();
        item.getChild("txt_add").visible = item.getChild("arrow").visible =
          nextCfg.Conat != curCfg.Conat;
      } else {
        item.getChild("arrow").visible = item.getChild("txt_add").visible =
          false;
      }
      item.visible = true;
    }
  }

  /**
   * 升阶属性 升阶读取[t_s_honorequip]的UpgradeType=1时, 为升级类型 读取honorequipname和icon进行显示 再根据对应的Level, 读取所需荣誉值honor和提升属性值
   */
  private updateRankAttr() {
    let ismax: boolean = false;
    let item0: FUI_AttrItem = this["attr_item" + 0];
    let item1: FUI_AttrItem = this["attr_item" + 1];
    //当前等级荣誉
    let stage = this.curRank;
    let curCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      1,
      stage,
    );
    if (curCfg) {
      this.item0.getChild("txt_name").text = curCfg.HonorequipnameLang;
      let url =
        PathManager.resourcePath +
        "icon" +
        PathManager.toLowerCase(curCfg.Icon);
      this.item0.getChild("iconLoader").asLoader.icon = url;

      //升级属性
      item0.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip23") +
        ":";
      item0.getChild("txt_value").text = curCfg.Strength.toString();
      item0.visible = true;
      item1.getChild("txt_name").text =
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip24") +
        ":";
      item1.getChild("txt_value").text = curCfg.Tenacity.toString();
      item1.visible = true;
    }

    let nextstage = this.curRank + 1;
    let nextCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      1,
      nextstage,
    );
    if (curCfg && nextCfg) {
      //下一等级荣誉
      this.item1.getChild("txt_name").text = nextCfg.HonorequipnameLang;
      let url =
        PathManager.resourcePath +
        "icon" +
        PathManager.toLowerCase(nextCfg.Icon);
      this.item1.getChild("iconLoader").asLoader.icon = url;
      //荣誉值进度
      let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
      let val = (playerInfo.honer / nextCfg.Honor) * 100;
      val = val > 100 ? 100 : val;
      this.bar.value = val;
      this.bar.getChild("title").text = playerInfo.honer + "/" + nextCfg.Honor;
      this.btn_gradeUp.enabled =
        this.btn_gradeUp.getChild("redDot").visible =
        this.tab.getChildAt(1).asButton.getChild("redDot").visible =
          this.bar.value >= 100;

      item0.getChild("txt_add").text = (
        nextCfg.Strength - curCfg.Strength
      ).toString();
      item0.getChild("txt_add").visible = item0.getChild("arrow").visible =
        nextCfg.Strength != curCfg.Strength;
      item1.getChild("txt_add").text = (
        nextCfg.Tenacity - curCfg.Tenacity
      ).toString();
      item1.getChild("txt_add").visible = item1.getChild("arrow").visible =
        nextCfg.Tenacity != curCfg.Tenacity;
    } else {
      ismax = true;
      this.btn_gradeUp.getChild("redDot").visible = this.tab
        .getChildAt(1)
        .asButton.getChild("redDot").visible = false;
      item0.getChild("txt_add").visible = item0.getChild("arrow").visible =
        false;
      item1.getChild("txt_add").visible = item1.getChild("arrow").visible =
        false;
    }
    this.c3.selectedIndex = ismax ? 1 : 0;
  }

  private addEvent() {
    this.btn_levelUp.onClick(this, this.onLevelup);
    this.btn_gradeUp.onClick(this, this.onGradeUp);
    this.tab.on(Laya.Event.CLICK, this, this.onTab.bind(this));
    this.tab.itemRenderer = Laya.Handler.create(
      this,
      this.onRender,
      null,
      false,
    );
  }

  private removeEvent() {
    this.btn_levelUp.offClick(this, this.onLevelup);
    this.btn_gradeUp.offClick(this, this.onGradeUp);
    this.tab.off(Laya.Event.CLICK, this, this.onTab.bind(this));
  }

  onRender(index: number, item: any) {
    if (item) {
      item.title = this.tabData[index];
    }
  }

  private onTab() {
    let btnIndex = this.tab.selectedIndex;
    this.pageCtrl.selectedIndex = btnIndex;
    switch (btnIndex) {
      case HONOR_TAB.LEVEL:
        break;
      case HONOR_TAB.RANK:
        break;
    }
  }

  private onLevelup() {
    let curCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      0,
      this.curLevel,
    );
    if (curCfg) {
      let nextCfg: t_s_honorequipData =
        TempleteManager.Instance.geHonorLevelByHonor(1, curCfg.Honor);
      if (nextCfg) {
        if (this.curRank < nextCfg.Level) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("honorEquip.levelLack"),
          );
          return;
        }
      }
    }
    if (this.txt_cost.color == "#ff0000") {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "shop.view.frame.BuyFrameI.MedalLack",
        ),
      );
      return;
    }
    if (this.txt_gold.color == "#ff0000") {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("public.gold"),
      );
      return;
    }
    PlayerManager.Instance.reqHonorEquipLevelUp(1);
  }

  private onGradeUp() {
    PlayerManager.Instance.reqHonorEquipLevelUp(2);
  }
}

export enum HONOR_TAB {
  LEVEL = 0, //升级
  RANK, //升阶
}
