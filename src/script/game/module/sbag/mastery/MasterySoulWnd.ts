//@ts-expect-error: External dependencies
import FUI_AttrItem from "../../../../../fui/SBag/FUI_AttrItem";
import FUI_MasteryAttrItem from "../../../../../fui/SBag/FUI_MasteryAttrItem";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import { FormularySets } from "../../../../core/utils/FormularySets";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { BaseItem } from "../../../component/item/BaseItem";
import BaseTipItem from "../../../component/item/BaseTipItem";
import { t_s_extrajobequipData } from "../../../config/t_s_extrajobequip";
import { t_s_extrajobequipstrengthenData } from "../../../config/t_s_extrajobequipstrengthen";
import { BagType } from "../../../constant/BagDefine";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { ExtraJobEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ExtraJobEquipItemInfo } from "../../bag/model/ExtraJobEquipItemInfo ";
import ExtraJobModel from "../../bag/model/ExtraJobModel";
import GeniusPanel from "../../skill/content/GeniusPanel";
import { InlayCom } from "./InlayCom";
import { MasteryInlayItem } from "./MasteryInlayItem";

/**
 * 魂器培养界面
 */
export default class MasterySoulWnd extends BaseWindow {
  public frame: fgui.GComponent;
  //强 化
  private btn_stren: UIButton;
  //进阶
  private btn_advance: UIButton;
  //消耗货币-910的数量
  txt_cash: fairygui.GTextField;
  //消耗黄金
  txt_gold: fairygui.GTextField;
  txt_cash1: fairygui.GTextField;
  txt_lv1: fairygui.GTextField;
  txt_lv2: fairygui.GTextField;
  txt_stage1: fairygui.GTextField;
  txt_stage2: fairygui.GTextField;
  txt_name: fairygui.GTextField;
  txt_stage: fairygui.GTextField;
  txt_stren: fairygui.GTextField;
  txt_needProp: fairygui.GTextField;
  txt_open: fairygui.GTextField;
  costBox: fgui.GGroup;
  g2: fgui.GGroup;
  tipItemProp: BaseTipItem;
  tipItemCoin: BaseTipItem;
  private iconLoader: fgui.GLoader;
  /** tab功能切换 */
  private c1: fgui.Controller;
  /** 最高等级切换 */
  private c2: fgui.Controller;
  private attack: FUI_MasteryAttrItem;
  private magicAttack: FUI_MasteryAttrItem;
  private defence: FUI_MasteryAttrItem;
  private magicDefence: FUI_MasteryAttrItem;
  private live: FUI_MasteryAttrItem;
  //左侧的tab
  public tab: fgui.GList;
  private _info: ExtraJobEquipItemInfo;
  // public strenAni: fgui.GMovieClip;
  // public mc_loading: fgui.GMovieClip;
  // private strenResult: boolean = false;
  /** 是否收到服务器返回的强化结果 */
  // private _recvMsg: boolean = false;
  // private _curStrenLevel: number = 0;
  // private isMax: boolean = false;

  inlayCom: InlayCom;
  /**当前选择的孔 */
  selectHole: MasteryInlayItem;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    // this.initLanguage();
    this.c1 = this.contentPane.getControllerAt(0);
    this.c2 = this.contentPane.getControllerAt(1);
    this.tipItemCoin.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
  }

  // private initLanguage() {
  // this.frame.getChild('title').text = LangManager.Instance.GetTranslation('petEuip.title');
  // this.btn_stren.title = LangManager.Instance.GetTranslation('HigherGradeOpenTipView.content4');
  // this.btn_advance.title = LangManager.Instance.GetTranslation('petEuip.stren');
  // }

  OnShowWind() {
    super.OnShowWind();
    this._info = this.params;
    if (!this._info) return;
    this.addEvent();
    this.tab.selectedIndex = 0;
    this.updateBaseView();
    this.updateStrenView();
    // ServerDataManager.listen(S2CProtocol.U_C_ITEM_STRENGTHEN, this, this.__onIntensifyResult);
  }

  public addEvent() {
    this.tab.on(fairygui.Events.CLICK_ITEM, this, this.onSelectTab);
    NotificationManager.Instance.addEventListener(
      ExtraJobEvent.STAGE_UP,
      this.onStageUp,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ExtraJobEvent.CLICK_INLAY,
      this.onClickInay,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ExtraJobEvent.SELECT_HOLE,
      this.onSelectHole,
      this,
    );
  }

  public removeEvent() {
    this.tab.off(fairygui.Events.CLICK_ITEM, this, this.onSelectTab);
    NotificationManager.Instance.removeEventListener(
      ExtraJobEvent.STAGE_UP,
      this.onStageUp,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ExtraJobEvent.CLICK_INLAY,
      this.onClickInay,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ExtraJobEvent.SELECT_HOLE,
      this.onSelectHole,
      this,
    );
  }

  private onSelectHole(index: number) {
    this.inlayCom.selectHole(index);
  }

  /**
   * 点击镶嵌按钮
   * @param info
   */
  private onClickInay(info: GoodsInfo) {
    if (info["isInlay"]) {
      PlayerManager.Instance.reqExtraJobEquip(
        5,
        this._info.equipType,
        info.bagType,
        info.pos,
        this.inlayCom.curSelectInlayHole.index,
      );
      return;
    }
    //若玩家未选中宝石孔：飘文字提示“请先选择镶嵌凹槽”
    if (!this.inlayCom.curSelectInlayHole) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Mastery.chooseHole"),
      );
      return;
    }
    //若当前选中宝石孔未开启：飘文字提示“魂器xx阶可开启凹槽”
    if (this.inlayCom.curSelectInlayHole.bNotOpen) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "Mastery.openHoleLevel2",
          this.inlayCom.curSelectInlayHole.needLevel,
        ),
      );
      return;
    }

    if (this.inlayCom.checkHasInlaySameGem(info.templateInfo.Property1)) {
      let str: string = LangManager.Instance.GetTranslation(
        "cell.mediator.storebag.StoreBagCellClickMediator.command03",
      );
      MessageTipManager.Instance.show(str);
      return;
    }

    if (this.inlayCom.curSelectInlayHole.item.info) {
      //若宝石孔已镶嵌其他宝石，则进行替换
      PlayerManager.Instance.reqExtraJobEquip(
        5,
        this._info.equipType,
        info.bagType,
        info.pos,
        this.inlayCom.curSelectInlayHole.index,
      );
    }

    //若宝石孔已开启且未镶嵌其他宝石，则直接镶嵌该宝石
    PlayerManager.Instance.reqExtraJobEquip(
      4,
      this._info.equipType,
      info.bagType,
      info.pos,
      this.inlayCom.curSelectInlayHole.index,
    );
  }

  onSelectTab(item: fgui.GObject) {
    let index = this.tab.selectedIndex;
    switch (index) {
      case 0: //强化
        this.updateStrenView();
        break;
      case 1: //进阶
        this.updateStageView();
        break;
      case 2: //镶嵌
        this.inlayCom.initView(this._info);
        break;
      default:
        break;
    }
    this.c1.selectedIndex = index;
  }

  private onStageUp(info: ExtraJobEquipItemInfo) {
    this._info = info;
    this.updateBaseView();
    if (this.tab.selectedIndex == 0) {
      this.updateStrenView();
    } else if (this.tab.selectedIndex == 1) {
      this.updateStageView();
    } else {
      this.inlayCom.updateHole(this._info);
    }
  }

  /**
   * 魂器基本信息
   */
  updateBaseView() {
    this.txt_name.text = LangManager.Instance.GetTranslation(
      "Mastery.soulEquip" + this._info.equipType,
    );
    if (this._info.equipLevel > 0) {
      this.txt_stage.text = LangManager.Instance.GetTranslation(
        "Mastery.stageNum",
        this._info.equipLevel,
      );
    }
    if (this._info.strengthenLevel > 0) {
      this.txt_stren.text = LangManager.Instance.GetTranslation(
        "Mastery.strenLevel",
        this._info.strengthenLevel,
      );
    }
    let url = "Icon_Mastery_Horcrux_" + this._info.equipType;
    this.iconLoader.url = fgui.UIPackage.getItemURL(EmPackName.Base, url);
  }

  /** 更新强化界面 */
  private updateStrenView() {
    this.txt_lv1.text = LangManager.Instance.GetTranslation(
      "Mastery.levelNum",
      this._info.strengthenLevel,
    );
    this.txt_lv2.text = LangManager.Instance.GetTranslation(
      "Mastery.levelNum",
      this._info.strengthenLevel + 1,
    );
    let cfg = TempleteManager.Instance.getExtrajobEquipCfg(
      this._info.equipType,
      this._info.equipLevel,
    );
    let curStrenCfg: t_s_extrajobequipstrengthenData =
      TempleteManager.Instance.getExtrajobEquipStrenthenCfg(
        this._info.strengthenLevel,
      );
    let nextStrenCfg: t_s_extrajobequipstrengthenData =
      TempleteManager.Instance.getExtrajobEquipStrenthenCfg(
        this._info.strengthenLevel + 1,
      );
    this.updateCurAttr(cfg, curStrenCfg);
    if (!nextStrenCfg) {
      //最大等级
      this.txt_open.text = LangManager.Instance.GetTranslation(
        "buildings.water.view.PlayerTreeExpView.msg01",
      );
      this.txt_open.visible = true;
      this.c2.selectedIndex = 1;
      this.attack.getControllerAt(0).selectedIndex = 1;
      this.defence.getControllerAt(0).selectedIndex = 1;
      this.magicAttack.getControllerAt(0).selectedIndex = 1;
      this.magicDefence.getControllerAt(0).selectedIndex = 1;
      this.live.getControllerAt(0).selectedIndex = 1;
    } else {
      this.c2.selectedIndex = 0;
      this.attack.getControllerAt(0).selectedIndex = 0;
      this.defence.getControllerAt(0).selectedIndex = 0;
      this.magicAttack.getControllerAt(0).selectedIndex = 0;
      this.magicDefence.getControllerAt(0).selectedIndex = 0;
      this.live.getControllerAt(0).selectedIndex = 0;
      if (nextStrenCfg && this._info.equipLevel < nextStrenCfg.NeedEquipLevel) {
        //阶数不足不能强化
        this.txt_open.text = LangManager.Instance.GetTranslation(
          "Bag.mastery07",
          nextStrenCfg.NeedEquipLevel,
        );
        this.txt_open.visible = true;
        this.costBox.visible = false;
      } else {
        this.txt_open.visible = false;
        this.costBox.visible = true;
      }
      this.updateNextStrenAttr(cfg, curStrenCfg, nextStrenCfg);
      this.updateStrenCost(nextStrenCfg);
    }
  }

  /** 更新进阶界面 */
  private updateStageView() {
    this.txt_stage1.text = LangManager.Instance.GetTranslation(
      "Mastery.stageNum",
      this._info.equipLevel,
    );
    let cfg = TempleteManager.Instance.getExtrajobEquipCfg(
      this._info.equipType,
      this._info.equipLevel,
    );
    let cfg1 = TempleteManager.Instance.getExtrajobEquipCfg(
      this._info.equipType,
      this._info.equipLevel + 1,
    );
    this.updateCurAttr(cfg, null);
    if (!cfg1) {
      //最大等级
      this.txt_open.text = LangManager.Instance.GetTranslation(
        "buildings.water.view.PlayerTreeExpView.msg01",
      );
      this.txt_open.visible = true;
      this.c2.selectedIndex = 1;
      this.attack.getControllerAt(0).selectedIndex = 1;
      this.defence.getControllerAt(0).selectedIndex = 1;
      this.magicAttack.getControllerAt(0).selectedIndex = 1;
      this.magicDefence.getControllerAt(0).selectedIndex = 1;
      this.live.getControllerAt(0).selectedIndex = 1;
    } else {
      this.c2.selectedIndex = 0;
      this.attack.getControllerAt(0).selectedIndex = 0;
      this.defence.getControllerAt(0).selectedIndex = 0;
      this.magicAttack.getControllerAt(0).selectedIndex = 0;
      this.magicDefence.getControllerAt(0).selectedIndex = 0;
      this.live.getControllerAt(0).selectedIndex = 0;
      this.txt_stage2.text = LangManager.Instance.GetTranslation(
        "Mastery.stageNum",
        this._info.equipLevel + 1,
      );
      if (cfg1 && ExtraJobModel.instance.totalLevel < cfg1.NeedTotalJobLevel) {
        //显示红色提示文本“秘典总等级达到xx级开放下一进阶等级”
        this.txt_open.text = LangManager.Instance.GetTranslation(
          "Bag.mastery06",
          cfg1.NeedTotalJobLevel,
        );
        this.txt_open.visible = true;
        this.costBox.visible = false;
      } else {
        this.txt_open.visible = false;
        this.costBox.visible = true;
      }
      this.updateNextAttr(cfg1, null);
      this.updateAdvanceCost(cfg1);
    }
  }

  /**
   * 强化消耗
   * @param nextInfo
   */
  private updateStrenCost(nextInfo) {
    if (nextInfo) {
      this.tipItemProp.setInfo(nextInfo.CostItemId);
      let ownProp = GoodsManager.Instance.getBagCountByTempId(
        BagType.Player,
        nextInfo.CostItemId,
      );
      let ownStr = ownProp.toString();
      if (ownProp < nextInfo.CostItemCount) {
        ownStr = `[color=#ff2e2e]${ownProp}[/color]`;
        this.btn_stren.enabled = false;
      }
      //升级所需消耗：秘典残页图标、玩家拥有秘典残页数量（数量不足时为红色字体）/升级所需秘典残页数量、黄金、升级所需黄金数量
      this.txt_needProp.text = LangManager.Instance.GetTranslation(
        "fish.FishFrame.countText",
        ownStr,
        nextInfo.CostItemCount,
      );
      this.txt_gold.text = FormularySets.toStringSelf(
        nextInfo.CostGold,
        GeniusPanel.STEP,
      );
      if (ResourceManager.Instance.gold.count >= nextInfo.CostGold) {
        this.txt_gold.color = "#FFECC6";
      } else {
        this.txt_gold.color = "#FF2E2E";
        this.btn_stren.enabled = false;
      }
    } else {
    }
  }

  /**
   * 进阶消耗
   * @param nextInfo
   */
  private updateAdvanceCost(nextInfo: t_s_extrajobequipData) {
    if (nextInfo) {
      this.tipItemProp.setInfo(nextInfo.CostItemId);
      let ownProp = GoodsManager.Instance.getBagCountByTempId(
        BagType.Player,
        nextInfo.CostItemId,
      );
      let ownStr = ownProp.toString();
      if (ownProp < nextInfo.CostItemCount) {
        ownStr = `[color=#ff2e2e]${ownProp}[/color]`;
        this.btn_advance.enabled = false;
      }
      //升级所需消耗：秘典残页图标、玩家拥有秘典残页数量（数量不足时为红色字体）/升级所需秘典残页数量、黄金、升级所需黄金数量
      this.txt_needProp.text = LangManager.Instance.GetTranslation(
        "fish.FishFrame.countText",
        ownStr,
        nextInfo.CostItemCount,
      );
      this.txt_gold.text = FormularySets.toStringSelf(
        nextInfo.CostGold,
        GeniusPanel.STEP,
      );
      if (ResourceManager.Instance.gold.count >= nextInfo.CostGold) {
        this.txt_gold.color = "#FFECC6";
      } else {
        this.txt_gold.color = "#FF2E2E";
        this.btn_advance.enabled = false;
      }
    } else {
    }
  }
  private updateCurAttr(
    attrCfg: t_s_extrajobequipData,
    strenCfg: t_s_extrajobequipstrengthenData,
  ) {
    if (attrCfg) {
      if (attrCfg.Attack > 0) {
        this.attack.getChild("rTxtName").text =
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip13",
          );
        //强化等级增加的属性（绿色字体） 强化属性=强化加成百分比*魂器当前阶数的属性
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.Attack
          : 0;
        addValue = Math.floor(addValue);
        this.attack.getChild("rTxtCur").text = (
          attrCfg.Attack + addValue
        ).toString();
      }
      this.attack.visible = attrCfg.Attack > 0;

      if (attrCfg.Defence > 0) {
        this.defence.getChild("rTxtName").text =
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip14",
          );
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.Defence
          : 0;
        addValue = Math.floor(addValue);
        this.defence.getChild("rTxtCur").text = (
          attrCfg.Defence + addValue
        ).toString();
      }

      if (attrCfg.MagicAttack > 0) {
        this.magicAttack.getChild("rTxtName").text =
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip15",
          );
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.MagicAttack
          : 0;
        addValue = Math.floor(addValue);
        this.magicAttack.getChild("rTxtCur").text = (
          attrCfg.MagicAttack + addValue
        ).toString();
      }
      this.magicAttack.visible = attrCfg.MagicAttack > 0;

      if (attrCfg.MagicDefence > 0) {
        this.magicDefence.getChild("rTxtName").text =
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip16",
          );
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.MagicDefence
          : 0;
        addValue = Math.floor(addValue);
        this.magicDefence.getChild("rTxtCur").text = (
          attrCfg.MagicDefence + addValue
        ).toString();
      }
      this.magicDefence.visible = attrCfg.MagicDefence > 0;

      if (attrCfg.Live > 0) {
        this.live.getChild("rTxtName").text =
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip11",
          );
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.Live
          : 0;
        addValue = Math.floor(addValue);
        this.live.getChild("rTxtCur").text = (
          attrCfg.Live + addValue
        ).toString();
        this.live.visible = true;
      }
      this.live.visible = attrCfg.Live > 0;
    }
  }

  /**
   * 显示下一强化等级配置属性
   * @param attrCfg 魂器当前阶数属性配置
   * @param strenCfg 魂器当前阶数属性强化配置
   */
  private updateNextStrenAttr(
    attrCfg: t_s_extrajobequipData,
    curStrenCfg: t_s_extrajobequipstrengthenData,
    nextStrenCfg: t_s_extrajobequipstrengthenData,
  ) {
    let cfg = TempleteManager.Instance.getExtrajobEquipCfg(
      this._info.equipType,
      this._info.equipLevel,
    );
    if (cfg) {
      let nextAdd;
      if (attrCfg.Attack > 0) {
        //强化等级增加的属性（绿色字体） 强化属性=强化加成百分比*魂器当前阶数的属性
        let addValue = curStrenCfg
          ? (curStrenCfg.ExtraPropertyPercent / 100) * attrCfg.Attack
          : 0;
        addValue = Math.floor(addValue);
        let addValue1 = nextStrenCfg
          ? (nextStrenCfg.ExtraPropertyPercent / 100) * attrCfg.Attack
          : 0;
        nextAdd = Math.floor(Math.max(addValue1 - addValue));
        if (nextStrenCfg) {
          this.attack.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.Attack + addValue,
              nextAdd,
            );
        } else {
          this.attack.getChild("rTxtNext").text = attrCfg.Attack.toString();
        }
      }
      this.attack.visible = attrCfg.Attack > 0;

      if (attrCfg.Defence > 0) {
        let addValue = curStrenCfg
          ? (curStrenCfg.ExtraPropertyPercent / 100) * attrCfg.Defence
          : 0;
        addValue = Math.floor(addValue);
        let addValue1 = nextStrenCfg
          ? (nextStrenCfg.ExtraPropertyPercent / 100) * attrCfg.Defence
          : 0;
        nextAdd = Math.floor(Math.max(addValue1 - addValue));
        if (nextStrenCfg) {
          this.defence.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.Defence + addValue,
              nextAdd,
            );
        } else {
          this.defence.getChild("rTxtNext").text = attrCfg.Defence.toString();
        }
      }
      this.defence.visible = attrCfg.Defence > 0;

      if (attrCfg.MagicAttack > 0) {
        let addValue = curStrenCfg
          ? (curStrenCfg.ExtraPropertyPercent / 100) * attrCfg.MagicAttack
          : 0;
        addValue = Math.floor(addValue);
        let addValue1 = nextStrenCfg
          ? (nextStrenCfg.ExtraPropertyPercent / 100) * attrCfg.MagicAttack
          : 0;
        nextAdd = Math.floor(Math.max(addValue1 - addValue));
        if (nextStrenCfg) {
          this.magicAttack.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.MagicAttack + addValue,
              nextAdd,
            );
        } else {
          this.magicAttack.getChild("rTxtNext").text =
            attrCfg.MagicAttack.toString();
        }
      }
      this.magicAttack.visible = attrCfg.MagicAttack > 0;

      if (attrCfg.MagicDefence > 0) {
        let addValue = curStrenCfg
          ? (curStrenCfg.ExtraPropertyPercent / 100) * attrCfg.MagicDefence
          : 0;
        addValue = Math.floor(addValue);
        let addValue1 = nextStrenCfg
          ? (nextStrenCfg.ExtraPropertyPercent / 100) * attrCfg.MagicDefence
          : 0;
        nextAdd = Math.floor(Math.max(addValue1 - addValue));
        if (nextStrenCfg) {
          this.magicDefence.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.MagicDefence + addValue,
              nextAdd,
            );
        } else {
          this.magicDefence.getChild("rTxtNext").text =
            attrCfg.MagicDefence.toString();
        }
      }
      this.magicDefence.visible = attrCfg.MagicDefence > 0;

      if (attrCfg.Live > 0) {
        let addValue = curStrenCfg
          ? (curStrenCfg.ExtraPropertyPercent / 100) * attrCfg.Live
          : 0;
        addValue = Math.floor(addValue);
        let addValue1 = nextStrenCfg
          ? (nextStrenCfg.ExtraPropertyPercent / 100) * attrCfg.Live
          : 0;
        nextAdd = Math.floor(Math.max(addValue1 - addValue));
        if (nextStrenCfg) {
          this.live.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.Live + addValue,
              nextAdd,
            );
        } else {
          this.live.getChild("rTxtNext").text = attrCfg.Live.toString();
        }
      }
      this.live.visible = attrCfg.Live > 0;
    }
  }

  /**
   * 显示下一等级或下一阶的配置属性
   * @param attrCfg 魂器当前阶数属性配置
   * @param strenCfg 魂器当前阶数属性强化配置
   */
  private updateNextAttr(
    attrCfg: t_s_extrajobequipData,
    strenCfg: t_s_extrajobequipstrengthenData,
  ) {
    let cfg = TempleteManager.Instance.getExtrajobEquipCfg(
      this._info.equipType,
      this._info.equipLevel,
    );
    if (cfg) {
      if (attrCfg.Attack > 0) {
        //强化等级增加的属性（绿色字体） 强化属性=强化加成百分比*魂器当前阶数的属性
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.Attack
          : 0;
        addValue = Math.floor(addValue);
        if (strenCfg) {
          this.attack.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.Attack + addValue,
              addValue,
            );
        } else {
          this.attack.getChild("rTxtNext").text = attrCfg.Attack.toString();
        }
      }
      this.attack.visible = attrCfg.Attack > 0;

      if (attrCfg.Defence > 0) {
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.Defence
          : 0;
        addValue = Math.floor(addValue);
        if (strenCfg) {
          this.defence.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.Defence + addValue,
              addValue,
            );
        } else {
          this.defence.getChild("rTxtNext").text = attrCfg.Defence.toString();
        }
      }
      this.defence.visible = attrCfg.Defence > 0;

      if (attrCfg.MagicAttack > 0) {
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.MagicAttack
          : 0;
        addValue = Math.floor(addValue);
        if (strenCfg) {
          this.magicAttack.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.MagicAttack + addValue,
              addValue,
            );
        } else {
          this.magicAttack.getChild("rTxtNext").text =
            attrCfg.MagicAttack.toString();
        }
      }
      this.magicAttack.visible = attrCfg.MagicAttack > 0;

      if (attrCfg.MagicDefence > 0) {
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.MagicDefence
          : 0;
        addValue = Math.floor(addValue);
        if (strenCfg) {
          this.magicDefence.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.MagicDefence + addValue,
              addValue,
            );
        } else {
          this.magicDefence.getChild("rTxtNext").text =
            attrCfg.MagicDefence.toString();
        }
      }
      this.magicDefence.visible = attrCfg.MagicDefence > 0;

      if (attrCfg.Live > 0) {
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * attrCfg.Live
          : 0;
        addValue = Math.floor(addValue);
        if (strenCfg) {
          this.live.getChild("rTxtNext").text =
            LangManager.Instance.GetTranslation(
              "PropertyCurrentAndAdd",
              attrCfg.Live + addValue,
              addValue,
            );
        } else {
          this.live.getChild("rTxtNext").text = attrCfg.Live.toString();
        }
      }
      this.live.visible = attrCfg.Live > 0;
    }
  }

  private helpBtnClick() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "Bag.masterySoulHelp",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  /** 强化 */
  private btn_strenClick() {
    PlayerManager.Instance.reqExtraJobEquip(3, this._info.equipType, 0, 0, 0);
  }

  /** 进阶 */
  private btn_advanceClick() {
    //道具数量检测
    // if (!this.cashCondition || !this.goldCondition) {
    //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('singlepass.bugle.SinglePassBugleView.NoLeftCount'));
    //     return;
    // }
    PlayerManager.Instance.reqExtraJobEquip(2, this._info.equipType, 0, 0, 0);
  }

  OnHideWind() {
    if (this.inlayCom) {
      this.inlayCom.removeEvent();
    }
    this.removeEvent();
    super.OnHideWind();
  }
}
