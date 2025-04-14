//@ts-expect-error: External dependencies
import FUI_ComTalentsCirle from "../../../../../fui/Skill/FUI_ComTalentsCirle";
// import FUI_ComTalentsMask from "../../../../../fui/Skill/FUI_ComTalentsMask";
// import FUI_FastkeyTalent from "../../../../../fui/Skill/FUI_FastkeyTalent";
import FUI_Genius_Panel from "../../../../../fui/Skill/FUI_Genius_Panel";
import FUI_TalentSwitchButton from "../../../../../fui/Skill/FUI_TalentSwitchButton";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import Dictionary from "../../../../core/utils/Dictionary";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { TalentEvent } from "../../../constant/event/NotificationEvent";
import { SkillInfo } from "../../../datas/SkillInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import FUIHelper from "../../../utils/FUIHelper";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import SkillWnd from "../SkillWnd";
import SkillWndCtrl from "../SkillWndCtrl";
import GeniusItem from "../item/GeniusItem";
import SealItem from "../item/SealItem";
import SealSkill from "../item/SealSkill";
/**
 * @author:pzlricky
 * @data: 2021-02-22 17:07
 * @description 天赋页签窗体
 */
export default class GeniusPanel extends FUI_Genius_Panel {
  // telent_com: FUI_ComTalentsMask;
  public static STEP: number = 9999999;
  private list: fgui.GList;
  private _skillDic: Dictionary;
  // private _controller: fgui.Controller;
  // private selectTalentItemCell = null;
  btn_grade: fairygui.GButton; //天赋等级
  btn_set: fairygui.GButton;
  btn_up: fairygui.GButton;
  btn_down: fairygui.GButton;
  btn_cancel: fairygui.GButton;
  private _sealOrder: number[]; //圣印顺序 id,id,id
  txt_tip: fairygui.GTextField;
  txt1: fairygui.GTextField;
  txt_level: fairygui.GTextField;
  txt_cancel: fairygui.GTextField;
  // maskCom:fairygui.GComponent;
  // fastkey: FUI_FastkeyTalent;
  // c1: fairygui.Controller
  currentBranch: number = 1002;
  //顺时针
  circleCom: FUI_ComTalentsCirle;
  item1: SealSkill;
  item2: SealSkill;
  item3: SealSkill;
  item0: SealSkill;
  img_arrow: fairygui.GImage;
  tipGroup: fairygui.GGroup;
  private listData: Array<SkillInfo>;
  // private itemArr: Array<SkillInfo>;

  private _nextLevelNeedCoin: number = 0;
  private _nextLevelExp: number = 0;
  // private selectSealSkill: SealSkill;
  private isAnimating: boolean = false;
  /** 顺时针转 */
  // private rotateArr = ['0,1,2', '2,0,1', '1,2,0'];
  /** 当前选中第几个item */
  private curIndex: number = 2;

  private sw1: FUI_TalentSwitchButton;

  private sw2: FUI_TalentSwitchButton;
  private talent_index: number = 0;
  private trans: fairygui.Transition;

  constructor() {
    super();
    // this.onConStructor();
  }

  onConStructor() {
    this.c1 = this.fastkey.getController("c1");
    this.list = this.fastkey.getChild("list").asList;
    this.btn_set = this.fastkey.getChild("btn_set").asButton;
    this.btn_cancel = this.fastkey.getChild("btn_cancel").asButton;
    this.txt_cancel = this.fastkey.getChild("txt_cancel").asTextField;
    this.txt1 = this.fastkey.getChild("txt1").asTextField;
    this.txt_tip = this.fastkey.getChild("txt_tip").asTextField;
    this.tipGroup = this.fastkey.getChild("tipGroup").asGroup;

    this.sw1 = this.fastkey.getChild("swb1") as FUI_TalentSwitchButton;
    this.sw2 = this.fastkey.getChild("swb2") as FUI_TalentSwitchButton;

    this.txt_tip.text = LangManager.Instance.GetTranslation("talent.dragTip");
    this.txt_cancel.text = LangManager.Instance.GetTranslation(
      "armyII.viewII.information.InformationView.save",
    );
    this.txt1.text = LangManager.Instance.GetTranslation("talent.sealTitle");
    this.circleCom = this.telent_com.getChild(
      "clockwise",
    ) as FUI_ComTalentsCirle;
    this.btn_grade = this.telent_com.getChild("btn_grade").asButton;
    this.img_arrow = this.telent_com.getChild("img_arrow").asImage;
    this.txt_level = this.telent_com.getChild("txt_level").asTextField;
    this.trans = this.telent_com.getTransitionAt(0);
    this.item1 = this.circleCom.getChild("item1") as SealSkill;
    this.item2 = this.circleCom.getChild("item2") as SealSkill;
    this.item3 = this.circleCom.getChild("item3") as SealSkill;
    this.item0 = this.circleCom.getChild("item0") as SealSkill;

    this.btn_up = this.telent_com.getChild("btn_up").asButton;
    this.btn_down = this.telent_com.getChild("btn_down").asButton;
    this.talent_index = this.thane.talentData.talent_index;
    this.addEvent();
    this.initView();
    FUIHelper.setTipData(
      this.btn_grade,
      EmWindow.TalentItemTips,
      1,
      undefined,
      TipsShowType.onClick,
    );
  }

  private initView() {
    this.circleCom.rotation = 0;
    for (let i = 0; i < 4; i++) {
      const element = this.circleCom.getChild("item" + i);
      element.rotation = 0;
    }
    // this.currentBranch = this.thane.talentData.currentBranch;
    this.updateSonTypeItem();
    this.updateTelentTree();
    this.updateTalentGrade();
    this.updateSwitchBtn();
    this.list.numItems = this.listData.length;

    this.showMask(2);
    this.curIndex = 2;
    this.currentBranch = 1002;
    this.controler.reqTelentTree(this.currentBranch);
  }

  showMask(index: number) {
    for (let i = 0; i < 4; i++) {
      const element: SealSkill = this.circleCom.getChild(
        "item" + i,
      ) as SealSkill;
      let maskImg = element.getChild("img_mask");
      maskImg.visible = i != index;
    }
  }

  private updateSonTypeItem() {
    this._sealOrder = ArmyManager.Instance.thane.talentData.sealOrder;
    this.listData = [];
    let array = ArmyManager.Instance.thane.talentData.talentSkill.split(",");
    for (let index = 0; index < array.length; index++) {
      const tempId = array[index];
      if (tempId.length == 0) continue;
      let temp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        tempId.toString(),
      );
      let skillInfo = new SkillInfo();
      skillInfo.templateId = temp.TemplateId;
      skillInfo.grade = skillInfo.templateInfo.Grades;
      //主类型为100, 子类型为1001,2001,3001的是新版的圣印
      if (temp.SonType == 1001) {
        this.item1.setData(skillInfo);
        let idx = this._sealOrder.indexOf(temp.SonType);
        this.listData[idx] = skillInfo;
        let point = this.getTalentPoint(1001);
        this.item1.setSelected(false, point);
        this.item1.getChild("img_mask").visible = true;
        this.item1.getChild("img_mask").alpha = 1;
      } else if (temp.SonType == 1002) {
        this.item2.setData(skillInfo);
        let point = this.getTalentPoint(1002);
        this.item2.setSelected(true, point);
        this.listData.push(skillInfo);
        let idx = this._sealOrder.indexOf(temp.SonType);
        this.listData[idx] = skillInfo;
      } else if (temp.SonType == 1003) {
        this.item3.setData(skillInfo);
        let point = this.getTalentPoint(1003);
        this.item3.setSelected(false, point);
        this.listData.push(skillInfo);
        let idx = this._sealOrder.indexOf(temp.SonType);
        this.listData[idx] = skillInfo;
        this.item3.getChild("img_mask").visible = true;
        this.item3.getChild("img_mask").alpha = 1;
      }
    }
  }

  /**
   * 计算投入点
   */
  getTalentPoint(branck: number): number {
    let result: number = 0;
    let str = branck.toString();
    let order = parseInt(str.charAt(3)) * 10;
    for (let i = 1; i < 8; i++) {
      var skillInfo: SkillInfo = this.thane.talentData.allTalentList[
        order + i
      ] as SkillInfo;
      result += skillInfo.grade;
    }
    return result;
  }

  private updateTalentGrade() {
    var gradeInfo: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        this.thane.talentData.talentGrade + 1,
        21,
      );
    if (gradeInfo) {
      this._nextLevelNeedCoin = gradeInfo.TemplateId;
      this._nextLevelExp = gradeInfo.Data;
      if (
        ResourceManager.Instance.gold.count < this._nextLevelNeedCoin ||
        this.thane.gp < this._nextLevelExp
      )
        this.img_arrow.visible = false;
      else this.img_arrow.visible = true;
      var limitGrade: number = 50;
      if (ArmyManager.Instance.thane.grades < limitGrade) {
        this.img_arrow.visible = false;
      }
    } else {
      this.img_arrow.visible = false;
    }
    this.txt_level.text = LangManager.Instance.GetTranslation(
      "public.level3",
      ArmyManager.Instance.thane.talentData.talentGrade,
    );
  }

  onReset() {
    this.initView();
    this.updateTalentGrade();
    this.updateTelentTree();
  }

  talenChangeHanler(info: SkillInfo) {
    if (info) {
      let sontype = info.templateInfo.SonType;
      if (
        info.templateInfo &&
        info.templateInfo.SonType == this.currentBranch
      ) {
        //从底部技能栏升级时更新左边选中的状态
        let rightItem: SealSkill = this["item" + this.curIndex];
        rightItem.setData(info);
        rightItem.setSelected(true, 0);
      } else {
        //从底部技能栏升级时更新左边未选中的状态
        for (let i = 0; i < 4; i++) {
          const element: SealSkill = this["item" + i];
          if (
            element.Itemdata &&
            element.Itemdata.templateInfo.SonType == sontype
          ) {
            element.setData(info);
            element.updatePoint(1);
          }
        }
      }
      for (let i = 0; i < 3; i++) {
        let sealItem: SealItem = this.list.getChildAt(i) as SealItem;
        if (sealItem.itemdata.templateInfo.SonType == sontype) {
          sealItem.setData(info);
          break;
        }
      }
    }
    this.updateTalentGrade();
    this.updateTelentTree();
    this.updateSwitchBtn();
    this.updateLevelUpstate();
  }

  private updateLevelUpstate() {
    this.item0.updateLevelUpState();
    this.item1.updateLevelUpState();
    this.item2.updateLevelUpState();
    this.item3.updateLevelUpState();
  }

  checkIsSetting(): boolean {
    return this.isSetting;
  }

  cancel() {
    this.onCancel();
  }

  /**
   * 逆时针转  需要美术做一个逆时针动效, 因为playReverse会从第一帧跳到最后一帧再开始播放, 这里的跳帧会有一个闪现的不好体验
   */
  onDown() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.touchable = false;
    let wnd = NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd;
    wnd.enableOperate(false);

    let downIdx = this.curIndex + 1; //倒推出下边是谁
    if (downIdx > 3) {
      downIdx = 0;
    }
    let leftIdx = downIdx + 1; //倒推出左边第一个是谁
    if (leftIdx > 3) {
      leftIdx = 0;
    }
    let upIdx = this.curIndex - 1; //倒推出上边是谁
    if (upIdx < 0) {
      upIdx = 3;
    }
    let rightItem: SealSkill = this["item" + this.curIndex];
    let leftItem: SealSkill = this["item" + leftIdx];
    let downItem: SealSkill = this["item" + downIdx];
    let upItem: SealSkill = this["item" + upIdx];
    leftItem.setData(upItem.Itemdata);

    this.currentBranch = downItem.Itemdata.templateInfo.SonType;
    this.controler.reqTelentTree(this.currentBranch);
    this.curIndex = parseInt(downItem.name.charAt(4));

    let point0 = 0;
    let point2 = 0;
    if (rightItem.Itemdata) {
      point0 = this.getTalentPoint(rightItem.Itemdata.templateInfo.SonType);
      point2 = this.getTalentPoint(leftItem.Itemdata.templateInfo.SonType);
    }
    rightItem.setSelected(false, point0);
    downItem.setSelected(true, 0);
    leftItem.setSelected(false, point2);

    rightItem.getChild("img_mask").visible = true;
    downItem.getChild("img_mask").alpha = 1;
    rightItem.getChild("img_mask").alpha = 0;
    Laya.Tween.to(downItem.getChild("img_mask"), { alpha: 0 }, 1000);
    Laya.Tween.to(rightItem.getChild("img_mask"), { alpha: 1 }, 1000);
    this.trans.play();
    let rotation: number = this.circleCom.rotation;
    let itemRotation: number = this.item0.rotation;
    Laya.Tween.to(
      this.item0,
      { rotation: itemRotation + 90 },
      1000,
      Laya.Ease.expoOut,
    );
    Laya.Tween.to(
      this.item1,
      { rotation: itemRotation + 90 },
      1000,
      Laya.Ease.expoOut,
    );
    Laya.Tween.to(
      this.item2,
      { rotation: itemRotation + 90 },
      1000,
      Laya.Ease.expoOut,
    );
    Laya.Tween.to(
      this.item3,
      { rotation: itemRotation + 90 },
      1000,
      Laya.Ease.expoOut,
    );
    Laya.Tween.to(
      this.circleCom,
      { rotation: rotation - 90 },
      1000,
      Laya.Ease.expoOut,
      Laya.Handler.create(this, this.onPlayEnd),
    );
  }

  /**
   * 顺时针转
   */
  onUp() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.touchable = false;
    let wnd = NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd;
    wnd.enableOperate(false);
    //更新左边看不到的ITEM的数据
    let downIdx = this.curIndex + 1; //倒推出下边是谁
    if (downIdx > 3) {
      downIdx = 0;
    }
    let leftIdx = downIdx + 1; //倒推出左边第一个是谁
    if (leftIdx > 3) {
      leftIdx = 0;
    }
    let upIdx = this.curIndex - 1; //倒推出上边是谁
    if (upIdx < 0) {
      upIdx = 3;
    }
    let rightItem: SealSkill = this["item" + this.curIndex];
    let leftItem: SealSkill = this["item" + leftIdx];
    let downItem: SealSkill = this["item" + downIdx];
    let upItem: SealSkill = this["item" + upIdx];
    leftItem.setData(downItem.Itemdata);

    this.currentBranch = upItem.Itemdata.templateInfo.SonType;
    this.controler.reqTelentTree(this.currentBranch);
    this.curIndex = parseInt(upItem.name.charAt(4));

    let point0 = 0;
    let point2 = 0;
    if (rightItem.Itemdata) {
      point0 = this.getTalentPoint(rightItem.Itemdata.templateInfo.SonType);
      point2 = this.getTalentPoint(leftItem.Itemdata.templateInfo.SonType);
    }
    rightItem.setSelected(false, point0);
    upItem.setSelected(true, 0);
    leftItem.setSelected(false, point2);

    // this.updateItemData(true);
    this.trans.play();
    upItem.getChild("img_mask").visible = true;
    rightItem.getChild("img_mask").visible = true;
    rightItem.getChild("img_mask").alpha = 1;
    upItem.getChild("img_mask").alpha = 1;
    Laya.Tween.to(upItem.getChild("img_mask"), { alpha: 0 }, 1000);
    Laya.Tween.to(rightItem.getChild("img_mask"), { alpha: 1 }, 1000);

    let rotation: number = this.circleCom.rotation;
    let itemRotation: number = this.item0.rotation;
    //Cubic.easeOut
    Laya.Tween.to(
      this.item0,
      { rotation: itemRotation - 90 },
      1000,
      Laya.Ease.expoOut,
    );
    Laya.Tween.to(
      this.item1,
      { rotation: itemRotation - 90 },
      1000,
      Laya.Ease.expoOut,
    );
    Laya.Tween.to(
      this.item2,
      { rotation: itemRotation - 90 },
      1000,
      Laya.Ease.expoOut,
    );
    Laya.Tween.to(
      this.item3,
      { rotation: itemRotation - 90 },
      1000,
      Laya.Ease.expoOut,
    );
    Laya.Tween.to(
      this.circleCom,
      { rotation: rotation + 90 },
      1000,
      Laya.Ease.expoOut,
      Laya.Handler.create(this, this.onPlayEnd),
    );
  }

  /**
   * 动画完成后更新数据
   */
  private onPlayEnd() {
    // this.updateTelentTree();
    this.isAnimating = false;
    let wnd = NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd;
    wnd.enableOperate(true);
    this.touchable = true;
  }

  /**
   * 点击圣印技能后更新对应的天赋技能树
   */
  private updateTelentTree() {
    let str = this.currentBranch.toString();
    let order = parseInt(str.charAt(3)) * 10;
    let com = this.telent_com.getChild("telents").asCom;
    this.thane.talentData.resetUserTalentSkill();
    for (let i = 1; i < 8; i++) {
      const geniusItem = com.getChild("telent" + i) as GeniusItem;
      var skillInfo: SkillInfo = this.thane.talentData.allTalentList[
        order + i
      ] as SkillInfo;
      geniusItem.Itemdata = skillInfo;
    }
  }

  private addEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRender,
      null,
      false,
    );
    this.btn_set.onClick(this, this.onSet);
    this.btn_cancel.onClick(this, this.onCancel);
    this.btn_up.onClick(this, this.onUp);
    this.btn_down.onClick(this, this.onDown);

    NotificationManager.Instance.addEventListener(
      TalentEvent.SET_FAST_KEY,
      this.__setFastKeyHandler,
      this,
    );
    ArmyManager.Instance.addEventListener(
      TalentEvent.TALENT_GRADUP_SUCC,
      this.talenChangeHanler,
      this,
    );
    ArmyManager.Instance.addEventListener(
      TalentEvent.UPDATE_TREE,
      this.updateTree,
      this,
    );
    this.sw1.onClick(this, this.onSwitchBtnTap, [0]);
    this.sw2.onClick(this, this.onSwitchBtnTap, [1]);
  }

  updateTree() {
    if (this.talent_index != this.thane.talentData.talent_index) {
      //切换模式才需要重置界面
      this.thane.talentData.resetUserTalentSkill();
      this.initView();
      this.talent_index = this.thane.talentData.talent_index;
    }
    this.updateSwitchBtn();
    Laya.timer.once(500, this, this.updateTelentTree); //为了配合动效延迟一下
  }

  private orignX: number = 0;
  private orignY: number = 0;
  private isSetting: boolean = false;
  private onSet() {
    this.c1.selectedIndex = 1;
    this.isSetting = true;
    // this.maskCom.visible =  true;
    // this.maskCom.alpha = 0.1;
    this.tipGroup.visible = true;
    let wnd = NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd;
    wnd.showMask(true);
    for (let i = 0; i < this.list.numItems; i++) {
      const sealItem: SealItem = this.list.getChildAt(i) as SealItem;
      sealItem.selected = true;
      sealItem.setDragState(true);
    }
    this.orignX = this.fastkey.x;
    this.orignY = this.fastkey.y;
    let point = this.fastkey.parent.localToGlobal(this.orignX, this.orignY);
    wnd.getContentPane().addChild(this.fastkey);
    this.fastkey.x = point.x;
    this.fastkey.y = point.y;
  }

  private onCancel() {
    this.c1.selectedIndex = 0;
    this.isSetting = false;
    this.tipGroup.visible = false;
    let wnd = NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd;
    wnd.showMask(false);
    for (let i = 0; i < this.list.numItems; i++) {
      const sealItem: SealItem = this.list.getChildAt(i) as SealItem;
      sealItem.selected = false;
      sealItem.setDragState(false);
    }
    this.addChild(this.fastkey);
    this.fastkey.x = this.orignX;
    this.fastkey.y = this.orignY;
  }

  /**渲染列表 */
  private onRender(index: number, item: SealItem) {
    if (!item || item.isDisposed) return;
    let skillInfo = this.listData[index];
    item.setData(skillInfo);
    item.indexTxt.text = (index + 1).toString();
  }

  private removeEvent() {
    this.btn_set.offClick(this, this.onSet);
    this.btn_cancel.offClick(this, this.onCancel);
    this.btn_up.offClick(this, this.onUp);
    this.btn_down.offClick(this, this.onDown);
    this.sw1.offClick(this, this.onSwitchBtnTap);
    this.sw2.offClick(this, this.onSwitchBtnTap);
    NotificationManager.Instance.removeEventListener(
      TalentEvent.TALENT_UPGRADE,
      this.talenChangeHanler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      TalentEvent.TALENT_RESET,
      this.onReset,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      TalentEvent.SET_FAST_KEY,
      this.__setFastKeyHandler,
      this,
    );
    ArmyManager.Instance.removeEventListener(
      TalentEvent.TALENT_GRADUP_SUCC,
      this.talenChangeHanler,
      this,
    );
    ArmyManager.Instance.removeEventListener(
      TalentEvent.UPDATE_TREE,
      this.updateTree,
      this,
    );
    this.isAnimating = false;
  }

  /**
   *
   * @param selfDragData 被拖动对象数据
   * @param dropTarget 拖动至目标对象
   * @returns
   */
  private __setFastKeyHandler() {
    let arr = [];
    for (let i = 0; i < this.list.numChildren; i++) {
      const element: SealItem = this.list.getChildAt(i) as SealItem;
      arr.push(element.itemdata.templateInfo.SonType);
    }
    this.controler.reqTelentSort(arr[0], arr[1], arr[2]);
  }

  private updateSwitchBtn() {
    let talentData = ArmyManager.Instance.thane.talentData;
    this.sw2.lockImg.visible = !talentData.is_activeSecond;
    this.sw1.selectedImg.visible = talentData.talent_index == 0;
    this.sw2.selectedImg.visible = !this.sw1.selectedImg.visible;
  }

  private onSwitchBtnTap(talenIndex: number) {
    if (this.isSetting) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("talent.switch"),
      );
      return;
    }
    let talentData = ArmyManager.Instance.thane.talentData;
    this.updateSwitchBtn();
    if (talenIndex == talentData.talent_index) return;
    //第二套天赋未解锁
    if (talenIndex == 1 && !talentData.is_activeSecond) {
      let cfgValue = 0;
      let cfgItem =
        TempleteManager.Instance.getConfigInfoByConfigName("Second_talent");
      if (cfgItem) {
        cfgValue = Number(cfgItem.ConfigValue);
      }
      let point: string = cfgValue.toString();
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "skill.genius.activeTelent",
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
      return;
    }
    //切换技能
    this.thane.talentData.curUsedTalentPoint = 0;
    this.controler.reqSwitchTalent(talenIndex);
  }

  private activeAlertBack(b: boolean, check: boolean, payType: number) {
    if (b) {
      if (check) {
        payType = 0;
      } else {
        payType = 1;
      }
      this.controler.reqUnlockSeconeTelent(payType);
    }
  }

  private get controler(): SkillWndCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  dispose() {
    if (this.isDisposed) return;
    Laya.Tween.clearAll(this);
    this.removeEvent();
    super.dispose();
  }
}
