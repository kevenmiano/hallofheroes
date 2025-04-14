import FUI_Skill_Panel from "../../../../../fui/Skill/FUI_Skill_Panel";
import LangManager from "../../../../core/lang/LangManager";
import { isCNLanguage } from "../../../../core/lang/LanguageDefine";
import LayerMgr from "../../../../core/layer/LayerMgr";
import Logger from "../../../../core/logger/Logger";
import ResMgr from "../../../../core/res/ResMgr";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../../core/ui/UIButton";
import { EmLayer } from "../../../../core/ui/ViewInterface";
import { IconFactory } from "../../../../core/utils/IconFactory";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import NewbieEvent, {
  SkillEvent,
} from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import OpenGrades from "../../../constant/OpenGrades";
import { EmWindow } from "../../../constant/UIDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { SkillInfo } from "../../../datas/SkillInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import DragManager from "../../../manager/DragManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import NewbieConfig from "../../guide/data/NewbieConfig";
import FastSkillItem from "../item/FastSkillItem";
import SkillItemCom from "../item/SkillItemCom";
import SkillWndCtrl from "../SkillWndCtrl";
import MasterySkillPanel from "./MasterySkillPanel";

/**
 * @author:pzlricky
 * @data: 2021-02-22 16:59
 * @description ***
 */
export default class SkillPanel extends FUI_Skill_Panel {
  // public isOversea: fgui.Controller;
  /**文本 */
  // private skillPoint: fgui.GTextField;//技能点
  // private skillLan: fgui.GTextField;//技能栏
  //升级条件
  // private upgradeLimit: fgui.GTextField;//升级所需条件
  // private selectSkillItem: BaseIcon;//当前右侧选中技能
  // private tipTxt: fgui.GTextField;//洗点技能提示
  // private nextSkillEffectBox: fgui.GComponent;//下一级效果框
  //满级
  // private fullLabel: fgui.GTextField;//已满级
  //左侧技能
  // private skillList: fgui.GList;//技能栏
  // private fastskillList: fgui.GList;//快捷技能栏
  // private skillSimBtn1: UIButton;//切换按钮1
  // private skillSimBtn2: UIButton;//切换按钮2
  // private duobleSkilBgl: fairygui.Image;
  // private _petTypeList: Array<number> = [101, 102, 103, 104, 105, 106, 107];
  // private _petTypeNameList: Array<string> = [];
  // private openGrade: number = 25;
  // private btn_set: UIButton;//
  private skillItems: SkillItemCom[] = []; //技能
  private _skillDic: SkillItemCom[] = [];
  private _fastKeyList: FastSkillItem[] = [];
  private selectSkillData: SkillInfo = null;
  public selectFastSkillData: SkillInfo = null;
  private equiping = false; //正在准备技能
  private isSwitching = false; //是否切换技能
  declare public masterySkillPanel: MasterySkillPanel;
  /** 当前是否职业技能 */
  isJobSkill: boolean = true;
  private isSetting: boolean = false;
  private isFastMovingSkill: boolean = false;
  private isopenMastery: boolean = false;
  public static SKILL_NUM: number = 6;

  constructor() {
    super();
    // this.onConStructor();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  /** */
  onConStructor() {
    this.initView();
    this.addEvent();
  }

  private initView() {
    this.btn_set.title = LangManager.Instance.GetTranslation(
      "setting.SettingFrame.title",
    );
    this.tipTxt.text = LangManager.Instance.GetTranslation("skill.equipTip");
    this.selectFastSkillData = null;
    this.selectSkillData = null;
    this.equiping = false;
    this.isSetting = false;
    this.tipTxt.visible = false;
    this.activieSam();
    this.initSkillList();
    this.refreshSkill();
    this.initFastKeyList();
    this.initMasterySkill();
    this.masteryTab.visible = this.isopenMastery =
      this.thane.grades >= OpenGrades.MASTERY;
    this.isOversea = this.getController("isOversea");
    if (this.isOversea) this.isOversea.selectedIndex = isCNLanguage() ? 0 : 1;
  }

  /**双技能是否激活 */
  private activieSam() {
    let isOpen: boolean = this.thane.grades >= 38;
    let activieDouble: boolean = this.thane.skillCate.activeDouble;
    this.skillSimBtn1.visible = isOpen;
    this.skillSimBtn2.visible = isOpen;
    this.duobleSkilBgl.visible = isOpen;
    let samLock1 = this.skillSimBtn1.getController("locked");
    let samLock2 = this.skillSimBtn2.getController("locked");
    samLock1.selectedIndex = 0;
    samLock2.selectedIndex = activieDouble ? 0 : 1;
  }

  private onTab(index) {
    this.isJobSkill = index == 0;
    if (!this.isJobSkill && !this.isSetting) {
      this.showMasteryTip();
    } else {
      if (!this.isSetting) {
        this.tipTxt.visible = false;
      }
    }
    if (index == 1) {
      NotificationManager.Instance.dispatchEvent(
        NewbieEvent.MANUAL_TRIGGER,
        NewbieConfig.NEWBIE_374,
      );
    }
    NotificationManager.Instance.dispatchEvent(
      SkillEvent.SWITCH_MASTERY,
      index,
    );
  }

  private addEvent() {
    this.btn_set.onClick(this, this.onSet);
    this.joyTab.onClick(this, this.onTab, [0]);
    this.masteryTab.onClick(this, this.onTab, [1]);
    this.skillSimBtn1.onClick(this, this.__switchHandler, [this.skillSimBtn1]);
    this.skillSimBtn2.onClick(this, this.__switchHandler, [this.skillSimBtn2]);
    this.thane.skillCate.addEventListener(
      PlayerEvent.SKILL_INDEX,
      this.__switchSkillHandler,
      this,
    );
    this.thane.skillCate.addEventListener(
      PlayerEvent.ACTIVE_DOUBLE_SKILL,
      this.__doubleSkillHandler,
      this,
    );
    this.thane.skillCate.addEventListener(
      PlayerEvent.SKILL_FAST_KEY,
      this.__skillChangeHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SkillEvent.FAST_KEY_MOVE,
      this.__fastKeyMoveHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SkillEvent.SET_FAST_KEY,
      this.__setFastKeyHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SkillEvent.PUTOFF,
      this._onEquipOffSkill,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SkillEvent.PUTON,
      this._onEquipOnSkill,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SkillEvent.REPLACE,
      this.onReplace,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SkillEvent.CLICK_MASTERY_SKILL,
      this.onSelectMasterySkill,
      this,
    );
  }

  private offEvent() {
    this.btn_set.offClick(this, this.onSet);
    this.joyTab.offClick(this, this.onTab);
    this.masteryTab.offClick(this, this.onTab);
    this.skillSimBtn1.offClick(this, this.__switchHandler);
    this.skillSimBtn2.offClick(this, this.__switchHandler);
    this.thane.skillCate.removeEventListener(
      PlayerEvent.SKILL_INDEX,
      this.__switchSkillHandler,
      this,
    );
    this.thane.skillCate.removeEventListener(
      PlayerEvent.ACTIVE_DOUBLE_SKILL,
      this.__doubleSkillHandler,
      this,
    );
    this.thane.skillCate.removeEventListener(
      PlayerEvent.SKILL_FAST_KEY,
      this.__skillChangeHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      SkillEvent.FAST_KEY_MOVE,
      this.__fastKeyMoveHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      SkillEvent.SET_FAST_KEY,
      this.__setFastKeyHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      SkillEvent.REPLACE,
      this.onReplace,
      this,
    );
    this.fastskillList.off(
      fairygui.Events.CLICK_ITEM,
      this,
      this.onFastSkillSelect,
    );
    this.skillList.off(fairygui.Events.CLICK_ITEM, this, this.onSkillSelect);
    NotificationManager.Instance.removeEventListener(
      SkillEvent.PUTOFF,
      this._onEquipOffSkill,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      SkillEvent.PUTON,
      this._onEquipOnSkill,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      SkillEvent.CLICK_MASTERY_SKILL,
      this.onSelectMasterySkill,
      this,
    );
  }

  private initMasterySkill() {
    //开启专精技能页签
    let openMastery = ArmyManager.Instance.thane.grades >= OpenGrades.MASTERY;
    this.skillGroup.visible = openMastery;
    if (openMastery) {
      this.masterySkillPanel.init();
    }
  }

  /**
   *初始化技能列表
   */
  private initSkillList() {
    this._skillDic = [];
    let item: SkillItemCom;
    for (let i: number = 0; i < 24; i++) {
      item = <SkillItemCom>this.skillList.addItemFromPool();
      item.index = i;
      this._skillDic[i] = item;
    }
    this.skillList.ensureBoundsCorrect();
    this.skillList.on(fairygui.Events.CLICK_ITEM, this, this.onSkillSelect);
  }

  /**选择技能 */
  onSelectMasterySkill(masterySkill: SkillItemCom) {
    if (this.isSetting) {
      this.onSkillSelect(masterySkill);
    }
  }

  onSkillSelect(clickItem: SkillItemCom) {
    let cidx = clickItem.getChildIndex(clickItem.dragCom);
    if (cidx != 1) {
      clickItem.setChildIndex(clickItem.dragCom, 1);
    }
    this.selectFastSkillData = null;
    if (this.isJobSkill) {
      this.skillList.selectedIndex = clickItem.index;
    }
    Logger.log("选择技能", clickItem.index);
    this.selectSkillData = clickItem.vdata;
    this.selectedFastSkillItem(null);
    if (this.isSetting) {
      //被动技能与未学习技能不可拽脱
      let _isOpen: boolean = this.selectSkillData.grade == 0; //是否开放
      let _ispassiveSkill: boolean =
        this.selectSkillData.templateInfo.UseWay == 2; //被动不能装备,不能卸下
      if (_ispassiveSkill) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("skill.unequip"),
        );
        return;
      }
      if (_isOpen) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("skill.unstudy"),
        );
        return;
      }
      //单击已装备的技能图标可直接卸下技能
      let fastItem: FastSkillItem = this.checkSkillEquiped(
        this.selectSkillData,
      ); //检查是否已经装备
      if (fastItem) {
        this._onEquipOffSkill(fastItem);
        return;
      }
      //编辑模式下, 点击技能直接装备
      let skillNum: number = 0;
      for (let i = 0; i < SkillPanel.SKILL_NUM; i++) {
        const fastSkill: FastSkillItem = this._fastKeyList[i];
        if (!fastSkill.vdata) {
          fastSkill.vdata = this.selectSkillData;
          this.__setFastKeyHandler();
          skillNum = 1;
          break;
        }
      }
      if (skillNum == 0) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("skill.isfull"),
        );
      }
    }
  }

  checkIsFull(dropTargetData: SkillInfo): boolean {
    let skillNum: number = 0;
    for (let i = 0; i < SkillPanel.SKILL_NUM; i++) {
      const fastSkill: FastSkillItem = this._fastKeyList[i];
      if (!fastSkill.vdata) {
        skillNum = 1;
        break;
      }
    }
    if (skillNum == 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("skill.isfull"),
      );
      return true;
    }
    return false;
  }

  /**技能栏选择技能 */
  onFastSkillSelect(item: FastSkillItem) {
    if (this.isSetting) {
      this._onEquipOffSkill(item);
      return;
    }
    //选择装备
    if (this.equiping) {
      let temp = this.selectSkillData || this.selectFastSkillData;
      //技能栏存在该技能
      let findItem: FastSkillItem;
      for (let fitem of this._fastKeyList) {
        if (item == findItem) continue;
        if (fitem.vdata == temp) {
          findItem = fitem;
          break;
        }
      }
      if (findItem) {
        findItem.vdata = item.vdata;
      }
      item.vdata = temp;
      this.selectedFastSkillItem(this.selectSkillData ? null : item);
      // this.showFastSkillEquiping(false);
      this.__setFastKeyHandler();
      return;
    }

    let itemData = item.vdata;
    if (!itemData) return;
    this.selectedFastSkillItem(item.vdata ? item : null);
    this.selectSkillData = null;
    this.selectFastSkillData = itemData;
    // this.setSelectSkillInfo(itemData);
    this.updateSkillSelFlag(itemData);
  }

  //技能栏选择, 更新技能面板的选择标记
  updateSkillSelFlag(skill: SkillInfo) {
    let skillInfo: SkillInfo = null;
    for (let i = 0, length = this._skillDic.length; i < length; i++) {
      skillInfo = this._skillDic[i].vdata;
      if (skill == skillInfo) {
        this.skillList.selectedIndex = this._skillDic[i].index;
        break;
      }
    }
  }

  /**检查技能是否已经装备 */
  checkSkillEquiped(selectSkillData: SkillInfo): FastSkillItem {
    if (!selectSkillData) return null;
    for (var i: number = 0; i < this._fastKeyList.length; i++) {
      var item: FastSkillItem = this._fastKeyList[i] as FastSkillItem;
      if (item && item.vdata == selectSkillData) {
        return item;
      }
    }
    return null;
  }

  public getCoststring(isPetSkill: boolean, num: number): string {
    var str: string = "";
    num = Math.abs(num);
    if (isPetSkill) {
      //英灵技能觉醒值消耗
      str = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown03",
        num,
      );
    } else {
      str = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown02",
        num,
      );
    }
    return str;
  }

  private removeSkillList() {
    this.skillList.removeChildrenToPool(0, this._skillDic.length - 1);
  }

  /**
   *刷新技能
   */
  private refreshSkill() {
    let allSkillList = this.thane.skillCate.allSkillList;
    let index: number;
    let skillInfo: SkillInfo;
    let skillItem: SkillItemCom;
    for (const key in this._skillDic) {
      if (Object.prototype.hasOwnProperty.call(this._skillDic, key)) {
        index = Number(key);
        skillInfo = allSkillList[index] as SkillInfo;
        skillItem = this._skillDic[key] as SkillItemCom;
        if (skillInfo) {
          skillItem.vdata = skillInfo;
        } else {
          skillItem.vdata = null;
        }
      }
    }
    this.switchSamBtn(); //切换选中按钮
    this.updateBlink();
    NotificationManager.Instance.dispatchEvent(
      SkillEvent.UPDATE_SKILL_POINT,
      this.isSetting,
    );
    if (this.isopenMastery) {
      this.masterySkillPanel.refreshData();
    }
  }

  updateBlink() {
    if (this.isSetting) {
      for (let item of this._fastKeyList) {
        if (!item.vdata) {
          item.equiping = true;
        } else {
          item.equiping = false;
        }
      }
    }
  }

  private showFastSkillEquiping(equip = true) {
    let selectSkillData = this.selectSkillData || this.selectFastSkillData;
    for (let item of this._fastKeyList) {
      if (equip && item.vdata == selectSkillData) continue;
      if (!item.vdata) {
        item.equiping = equip;
      } else {
        item.equiping = false;
      }
    }
    this.equiping = equip;
  }

  /**
   *初始化技能快捷栏技能
   */
  private initFastKeyList() {
    var keyList: Array<string> = this.thane.skillCate.fastKey.split(",");
    this._fastKeyList = [];
    for (var i: number = 0; i < SkillPanel.SKILL_NUM; i++) {
      var item: FastSkillItem = <FastSkillItem>(
        this.fastskillList.addItemFromPool()
      );
      if (i < keyList.length) {
        var temp: SkillInfo = this.thane.getSkillBySontype(Number(keyList[i]));
        if (!temp) {
          temp = this.thane.getExtrajobSkillBySontype(Number(keyList[i]));
        }
        item.isFastSkill = true;
        item.vdata = temp;
        item.dragEnable = true;
        item.setDragState(false);
      } else {
        item.vdata = null;
      }
      this._fastKeyList[i] = item;
      item.index = i + 1;
    }
    this.fastskillList.ensureBoundsCorrect();
    this.fastskillList.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.onFastSkillSelect,
    );
  }

  private removeFastKeyList() {
    this.fastskillList.removeChildrenToPool(0, this._fastKeyList.length - 1);
    for (let item of this._fastKeyList) {
      item.dispose();
    }
    for (let item of this.skillItems) {
      item.dispose();
    }
  }

  /**
   *激活双技能回调
   * @param b
   * @param payPoint
   */
  private activeAlertBack(b: boolean, flag: boolean, obj: any) {
    if (b) {
      let hasMoney: number =
        PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint;
      let cost = parseInt(obj.point);
      if (hasMoney >= cost) {
        this.control.sendActiveDoubleSkill(b, flag, obj.point);
      } else {
        RechargeAlertMannager.Instance.show();
      }
    }
  }

  /**选择双技能索引 */
  private get SelectDoubleSkillIndex(): number {
    return ArmyManager.Instance.thane.skillCate.skillIndex;
  }

  /**
   *切换技能
   * @param e
   */
  private selectSamButton: any = null;
  private __switchHandler(targetBtn) {
    if (this.isSetting) {
      //编辑技能状态时, 不可切换技能栏, 点击时弹出TIPS: 技能编辑模式中不可切换技能栏
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("skill.edit"),
      );
      return;
    }
    let activieDouble: boolean = this.thane.skillCate.activeDouble; //未激活双技能
    if (targetBtn === this.skillSimBtn2 && !activieDouble) {
      this.onSimDoubleSkill();
      return;
    }
    if (targetBtn == this.selectSamButton) {
      return;
    }

    //切换技能页时的弹窗提示: 切换技能页后战斗编辑所登记技能将会重置, 是否进行切换
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.isSkillEditOpen) {
      let str = LangManager.Instance.GetTranslation("skillEdit.init1");
      var confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        str,
        confirm,
        cancel,
        this.alertBack1.bind(this),
      );
      return;
    }
    //技能切换后重置选择数据,技能切换事件会多次回调(1、技能切换；2、技能升级), 所以放在这里了。
    this.selectFastSkillData = null;
    this.selectSkillData = null;
    this.isSwitching = true;
    this.control.switchSkillIndex();
  }

  /**普通确认回调 */
  private alertBack1(b: boolean, flag: boolean) {
    if (!b) return;
    //技能切换后重置选择数据,技能切换事件会多次回调(1、技能切换；2、技能升级), 所以放在这里了。
    this.selectFastSkillData = null;
    this.selectSkillData = null;
    this.control.switchSkillIndex();
  }

  public resetSetting() {
    if (!this.isSetting) return;
    this.isSetting = false;
    this.btn_set.title = LangManager.Instance.GetTranslation(
      "setting.SettingFrame.title",
    );
    for (let i = 0; i < this.skillList.numChildren; i++) {
      const skillItem: SkillItemCom = this.skillList.getChildAt(
        i,
      ) as SkillItemCom;
      if (skillItem) {
        skillItem.switchEditMode(this.isSetting);
      }
    }
  }

  private __doubleSkillHandler(e: PlayerEvent) {
    this.activieSam();
    // this.switchSamBtn();
  }

  __skillChangeHandler() {
    this.refreshSkill();
  }

  private onReplace(selfDragData?, dropTarget?) {
    //判断是否已经装备过 不能装备
    let equipedFastItem: FastSkillItem = this.checkSkillEquiped(selfDragData);
    if (equipedFastItem) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("skill.equiped"),
      );
      return;
    }
    let fastItem: FastSkillItem = this.checkSkillEquiped(
      dropTarget.getDragData(),
    ); //检查是否已经装备
    if (fastItem) {
      //下卸下
      this._onEquipOffSkill(fastItem);
      //再装备
      fastItem.vdata = selfDragData;
      let item: SkillItemCom = this.getSkillItem(selfDragData);
      if (item) {
        item.showEquipIcon();
      }
      fastItem.equiping = false;
    }
  }

  /**
   *
   * @param selfDragData
   */
  private __setFastKeyHandler(selfDragData?, dropTarget?) {
    if (selfDragData) {
      let skillNum: number = 0;
      for (let i = 0; i < SkillPanel.SKILL_NUM; i++) {
        const fastSkill: FastSkillItem = this._fastKeyList[i];
        if (!fastSkill.vdata) {
          skillNum = 1;
          break;
        }
      }
      if (skillNum == 0) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("skill.isfull"),
        );
        return;
      }

      let fastItem: FastSkillItem = this.checkSkillEquiped(selfDragData); //检查是否已经装备
      if (fastItem) {
        this._onEquipOffSkill(fastItem);
        if (dropTarget) {
          dropTarget.setDragData(selfDragData);
          let item: SkillItemCom = this.getSkillItem(selfDragData);
          if (item) {
            item.showEquipIcon();
          }
        }
        return;
      } else {
        if (dropTarget) {
          dropTarget.setDragData(selfDragData);
          let item: SkillItemCom = this.getSkillItem(selfDragData);
          if (item) {
            item.showEquipIcon();
          }
        }
      }
    } else {
      this.refreshSkill();
    }
  }

  private getSkillItem(skillInfo: SkillInfo) {
    for (let i = 0; i < this.skillList.numChildren; i++) {
      const skillItem: SkillItemCom = this.skillList.getChildAt(
        i,
      ) as SkillItemCom;
      if (skillItem.vdata == skillInfo) {
        return skillItem;
      }
    }
  }

  /**快速装备技能 */
  private __fastKeyMoveHandler(skillData) {
    if (this.isFastMovingSkill) return;
    var info: SkillInfo = skillData.data;
    let point: Laya.Point = skillData.point;
    var fastItem: FastSkillItem = this.getEmputyItem();
    let isSkillEquip = this.checkSkillEquip(info.templateInfo.SonType);
    if (!fastItem || isSkillEquip) return;

    this.isFastMovingSkill = true;
    if (point) {
      let iconUrl = IconFactory.getTecIconByIcon(info.templateInfo.Icons);
      let dragTarget = new Laya.Sprite();
      let res = ResMgr.Instance.getRes(iconUrl);
      if (res) {
        dragTarget.texture = res;
      } else {
        ResMgr.Instance.loadRes(iconUrl, (res) => {
          dragTarget.texture = res;
        });
      }
      dragTarget.x = point.x;
      dragTarget.y = point.y;
      LayerMgr.Instance.addToLayer(dragTarget, EmLayer.STAGE_DRAG_LAYER);

      var toPoint: Laya.Point = fastItem.parent.localToGlobal(
        fastItem.x,
        fastItem.y,
      );
      Laya.Tween.to(
        dragTarget,
        { x: toPoint.x, y: toPoint.y },
        100,
        null,
        Laya.Handler.create(this, () => {
          this.isFastMovingSkill = false;
          Laya.Tween.clearAll(dragTarget);
          dragTarget.texture = null;
          dragTarget.removeSelf();
          dragTarget = null;
          fastItem.vdata = info;
          this.__setFastKeyHandler();
          this.control.sendSetFastKey(this.fastKey);
        }),
      );
    } else {
      fastItem.vdata = info;
      this.__setFastKeyHandler();
      this.isFastMovingSkill = false;
    }
  }
  /**技能升级也会触发这个事件**/
  /**切换技能 */
  private __switchSkillHandler(e: PlayerEvent) {
    if (this.checkIsSetting()) {
      //正在编辑的时候收到协议不能处理
      return;
    }
    this.refreshSkill();
    this.refreshFastList();
    if (this.isSwitching) {
      this.isSwitching = false;
    }
  }

  private refreshFastList() {
    var keyList: string[] = this.thane.skillCate.fastKey.split(",");
    for (var i: number = 0; i < SkillPanel.SKILL_NUM; i++) {
      var item: FastSkillItem = this._fastKeyList[i] as FastSkillItem;
      if (i < keyList.length && keyList[i] != "-1") {
        var info: SkillInfo = this.thane.getSkillBySontype(Number(keyList[i]));
        if (!info) {
          info = this.thane.getExtrajobSkillBySontype(Number(keyList[i]));
        }
        item.vdata = info;
        item.isUsed = true;
      } else {
        item.vdata = null;
        item.isUsed = false;
      }
      if (this.isSwitching) {
        item.selected = false;
      }
    }
  }

  public checkSkillEquip(skillSongType: number): boolean {
    let keys = this.fastKey;
    let keysTemp = keys.split(",");
    if (keysTemp.indexOf(skillSongType.toString()) != -1) {
      return true;
    }
    return false;
  }

  public get fastKey(): string {
    let str: string = "";
    let len: number = this._fastKeyList.length;
    for (let i: number = 0; i < len; i++) {
      let item: FastSkillItem = this._fastKeyList[i] as FastSkillItem;
      if (item.vdata) str += item.vdata.templateInfo.SonType + ",";
      else str += "-1,";
    }
    return str;
  }

  /**获取空格位置 */
  public getEmputyItem(): FastSkillItem {
    for (var i: number = 0; i < SkillPanel.SKILL_NUM; i++) {
      var item: FastSkillItem = this._fastKeyList[i] as FastSkillItem;
      if (item && !item.vdata) {
        return item;
      }
    }
    return null;
  }

  private get control(): SkillWndCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public getSkillItemByIndex(idx: number): SkillItemCom {
    return this._skillDic[idx];
  }

  public getSkillItemByInfo(info: SkillInfo): SkillItemCom {
    for (const key in this._skillDic) {
      if (Object.prototype.hasOwnProperty.call(this._skillDic, key)) {
        let item = this._skillDic[key];
        if (item.data == info) {
          return item;
        }
      }
    }
    return null;
  }

  /**学习技能 */
  _onStudySkill() {
    if (DragManager.Instance.isDraging) return;
    Logger.log("学习技能");
    this.control.sendAddSkillPoint(this.selectSkillData);
  }

  /**装备技能 */
  _onEquipOnSkill(e: Laya.Event) {
    this.showFastSkillEquiping(true);
    e.stopPropagation();
  }

  /**卸下技能 */
  _onEquipOffSkill(item: FastSkillItem) {
    Logger.log("卸下技能");
    item.vdata = null;
    item.isUsed = false;
    this.selectFastSkillData = null;
    this.selectedFastSkillItem(null);
    this.__setFastKeyHandler();
  }

  public onSet() {
    if (
      this.btn_set.title ==
      LangManager.Instance.GetTranslation("setting.SettingFrame.title")
    ) {
      this.btn_set.title = LangManager.Instance.GetTranslation(
        "armyII.viewII.information.InformationView.save",
      );
      this.isSetting = true;
      this.equiping = true;
      this.tipTxt.text = LangManager.Instance.GetTranslation("skill.equipTip");
      this.tipTxt.visible = true;
      this.showFastSkillEquiping(true);
      NotificationManager.Instance.dispatchEvent(
        SkillEvent.RESET_SKILL_STATE,
        false,
      );
    } else {
      //保存 点击保存按钮可保存技能配置
      this.btn_set.title = LangManager.Instance.GetTranslation(
        "setting.SettingFrame.title",
      );
      this.isSetting = false;
      this.equiping = false;
      if (this.isJobSkill) {
        this.tipTxt.visible = false;
      } else {
        this.showMasteryTip();
      }
      this.showFastSkillEquiping(false);
      this.control.sendSetFastKey(this.fastKey);
      NotificationManager.Instance.dispatchEvent(
        SkillEvent.RESET_SKILL_STATE,
        true,
      );
    }
    this.updateEditMode();
  }

  private showMasteryTip() {
    this.tipTxt.visible = true;
    this.tipTxt.text = LangManager.Instance.GetTranslation("Mastery.tip");
  }

  //技能编制状态点击其他页签或退出技能系统将弹出二次确认窗口: 是否保存当前技能配置？
  checkIsSetting(): boolean {
    return this.isSetting;
  }

  /**
   * 编辑过程中退出不保存
   */
  public cancel() {
    this.isSetting = false;
    this.showFastSkillEquiping(false);
    this.updateEditMode();
    this.removeSkillList();
    this.removeFastKeyList();
    this.initView();
    NotificationManager.Instance.dispatchEvent(
      SkillEvent.RESET_SKILL_STATE,
      true,
    );
  }

  updateEditMode() {
    for (let i = 0; i < this.skillList.numChildren; i++) {
      const skillItem: SkillItemCom = this.skillList.getChildAt(
        i,
      ) as SkillItemCom;
      if (skillItem) {
        skillItem.setDragState(this.isSetting);
        skillItem.switchEditMode(this.isSetting);
      }
    }
    for (let i = 0; i < this._fastKeyList.length; i++) {
      const skillItem: FastSkillItem = this._fastKeyList[i] as FastSkillItem;
      if (skillItem && skillItem.vdata) {
        skillItem.setDragState(this.isSetting);
      }
    }
    if (this.masteryTab.visible) {
      this.masterySkillPanel.updateEditMode(this.isSetting);
    }
  }

  /**切换技能 */
  onSimDoubleSkill() {
    if (DragManager.Instance.isDraging) return;
    Logger.log("切换技能");
    //锁定则打开激活双技能弹窗确定
    let cfgValue = 600;
    let cfgItem =
      TempleteManager.Instance.getConfigInfoByConfigName("Second_SkillPoint");
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    let point: string = cfgValue.toString();
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var content: string = LangManager.Instance.GetTranslation(
      "armyII.viewII.skill.ActiveAlertContent",
      point,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      { point: point, checkDefault: true },
      prompt,
      content,
      confirm,
      cancel,
      this.activeAlertBack.bind(this),
    );
  }

  private selectedFastSkillItem(selectItem: FastSkillItem) {
    for (let item of this._fastKeyList) {
      item.selected = item == selectItem;
    }
  }

  /**切换选中按钮 */
  private switchSamBtn() {
    let samSelect1 = this.skillSimBtn1.getController("select");
    let samSelect2 = this.skillSimBtn2.getController("select");
    samSelect1.selectedIndex = this.SelectDoubleSkillIndex == 0 ? 1 : 0;
    samSelect2.selectedIndex = this.SelectDoubleSkillIndex == 1 ? 1 : 0;
    if (samSelect1.selectedIndex == 1) this.selectSamButton = this.skillSimBtn1;
    else this.selectSamButton = this.skillSimBtn2;
  }

  dispose(destred = false) {
    if (this.isDisposed) return;
    this.offEvent();
    this.removeSkillList();
    this.removeFastKeyList();
    this.masterySkillPanel.dispose();
    // this.comPart = null;
    super.dispose();
  }
}
