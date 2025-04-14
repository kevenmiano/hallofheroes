//@ts-expect-error: External dependencies
import FUI_RunesItem from "../../../../../fui/Skill/FUI_RunesItem";
import { RuneInfo } from "../../../datas/RuneInfo";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { ArmyManager } from "../../../manager/ArmyManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { DragObject, DragType } from "../../../component/DragObject";
import { GoodsManager } from "../../../manager/GoodsManager";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import RunesUpgradeWnd from "../RunesUpgradeWnd";
import ComponentSetting from "../../../utils/ComponentSetting";
import { CommonConstant } from "../../../constant/CommonConstant";
import { BagType } from "../../../constant/BagDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import {
  NotificationEvent,
  RuneEvent,
} from "../../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { ConfigManager } from "../../../manager/ConfigManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import DragManager from "../../../manager/DragManager";
import DragIconCom from "./DragIconCom";
import FastRuneItem from "./FastRuneItem";
import DragRuneIcon from "./DragRuneIcon";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import SkillWnd from "../SkillWnd";
import { TempleteManager } from "../../../manager/TempleteManager";

/**
 * @author:pzlricky
 * @data: 2021-04-21 17:58
 * @description ***
 */
export default class RuneItem
  extends FUI_RunesItem
  implements DragObject, ITipedDisplay
{
  extData: any = "center";
  tipData: any;
  tipType: EmWindow;
  canOperate: boolean = false;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 0);
  public dragType: DragType = null;
  public dragEnable: boolean = true;

  public index: number = 0;

  private _runeGInfo: GoodsInfo;

  private _itemData: RuneInfo = null;

  public isUsed: boolean = false;

  public isLock: boolean = false;
  // public isFastKey: boolean = false;

  private _canAdd: boolean;

  private _runeSwallowMax: number = 100;

  onConstruct() {
    super.onConstruct();
    // this.setDragEnable(false);
    if (!this.displayObject["dyna"]) {
      this.displayObject["dyna"] = true;
    }
  }

  getDragType(): DragType {
    return this.dragType;
  }

  setDragType(value: DragType) {
    this.dragType = value;
  }

  getDragEnable(): boolean {
    return this.dragEnable;
  }

  setDragEnable(value: boolean) {
    this.dragEnable = value;
  }

  getDragData() {
    return this._itemData;
  }

  setDragData(value: any) {
    this.ItemData = value;
  }
  private isDraging: boolean = false;

  /**
   * 被动技能、未开启的技能不能拖动
   */
  setDragState(isdrag: boolean = true) {
    if (this._isfast) {
      //快捷栏是拖动整个ITEM
      return;
    }
    if (this._itemData && this._itemData.grade != 0) {
      //grade
      let dragCom = this.dragCom as DragRuneIcon;
      if (isdrag) {
        this.setDragEnable(true); //设置当前容器可容纳
        this.setDragType(DragType.RUNE);
        this.isDraging = true;
        dragCom.visible = true;
        dragCom.runeInfo = this._itemData;
        dragCom.setDragEnable(true);
        dragCom.setDragType(DragType.RUNE);
        DragManager.Instance.registerDragObject(
          dragCom,
          this.onDragComplete.bind(this),
        );
      } else {
        this.isDraging = false;
        dragCom.visible = false;
        // dragCom.vdata = this._data;
        dragCom.setDragEnable(false);
        // dragCom.setDragType(DragType.SKILL);
        DragManager.Instance.removeDragObject(dragCom);
      }
    }
  }

  /**
   * 从符文列表拖动到符文栏
   * @param dropTarget 拖动至目标对象
   * @param sourTarget 被拖动的原对象
   * @returns
   */
  private onDragComplete(dropTarget, sourTarget) {
    if (dropTarget) {
      if (dropTarget instanceof RuneItem) {
        //目标对象存在
        if (dropTarget.isfast) {
          NotificationManager.Instance.sendNotification(
            RuneEvent.PEPLACE,
            sourTarget.getDragData(),
            dropTarget,
          );
          this.setSkillItemPos();
          return;
        }
        // let skillPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).runesPanel;
        // if(skillPanel){
        //     if(skillPanel.checkIsFull()){
        //         this.setSkillItemPos();
        //         return;
        //     }
        // }
        //父容器为原始对象,则还原
        if (sourTarget != dropTarget) {
          //两者交换
          // this.swap(dropTarget, sourTarget);
          // sourTarget.getDragData();
          // let selfDragData = this.getDragData();
          // let dropTargetData = dropTarget.getDragData();
          dropTarget.setDragData(sourTarget.getDragData());
          // NotificationManager.Instance.sendNotification(RuneEvent.SET_FAST_KEY, dropTarget,sourTarget.getDragData());
        } else {
          this.setSkillItemPos();
          return;
        }
      } else if (dropTarget instanceof FastRuneItem) {
        let skillPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd)
          .runesPanel;
        if (skillPanel) {
          if (skillPanel.checkIsFull()) {
            this.setSkillItemPos();
            return;
          }
        }
        let selfDragData = this.getDragData();
        let dropTargetData = dropTarget.getDragData();
        if (!dropTargetData) {
          // 装备
          // dropTarget.setDragData(selfDragData);
          NotificationManager.Instance.sendNotification(
            RuneEvent.SET_FAST_KEY,
            selfDragData,
            dropTarget,
          );
        }
      } else {
        this.setSkillItemPos();
        return;
      }
    } else {
      //不处理交换
      // let selfDragData = sourTarget.getDragData();
      // this.setDragData(selfDragData);
    }
    this.setSkillItemPos();
  }

  setSkillItemPos() {
    this.dragCom.x = 13;
    this.dragCom.y = 13;
    this.dragCom.parent.setChildIndex(this.dragCom, 1);
  }

  /**
   * 编辑模式长按弹出, 否则单击弹出
   * @param isEdit
   */
  switchEditMode(isEdit: boolean = false) {
    ToolTipsManager.Instance.unRegister(this);
    if (this.isDraging) {
      return;
    }
    if (isEdit) {
      // this.showType = TipsShowType.onLongPress;
    } else {
      this.showType = TipsShowType.onClick;
      this.tipType = EmWindow.RuneItemTips;
      this.tipData = this._itemData;
      ToolTipsManager.Instance.register(this);
    }
  }

  public set isfast(v: boolean) {
    this._isfast = v;
  }

  public get isfast(): boolean {
    return this._isfast;
  }

  private _isfast: boolean = false;
  public set ItemData(value: RuneInfo) {
    this._itemData = value;
    this.refreshView();
  }

  public get ItemData(): RuneInfo {
    return this._itemData;
  }

  private refreshView() {
    if (!this._itemData) {
      this.runeIcon.icon = "";
      // this.textNumGroup.visible = false;
      this.inlay_group.visible = false;
      this.txt_name.text = "";
      return;
    }
    if (this.isMax) {
      this.num.text = "Max";
      // if(!ComponentSetting.RUNE_HOLE && this._itemData.grade >= 10 && ConfigManager.info.SYS_OPEN){
      //     ComponentSetting.RUNE_HOLE = true;
      //     NotificationManager.Instance.dispatchEvent(RuneEvent.ACTIVE_RUNEGEM);
      // }
    } else {
      this.num.text =
        this._itemData.grade + "/" + this.getMaxLevel(this._itemData);
    }

    this.txt_name.text = this._itemData.templateInfo.TemplateNameLang;
    // this.shouCount.selectedIndex = this._itemData.grade > 0 ? 0 : 1;
    this.runeIcon.icon = IconFactory.getTecIconByIcon(
      this._itemData.templateInfo.Icon,
    );
    this.upgrade.selectedIndex = 0;
    this.checkCondition();
    if (this._itemData.swallowCount < this._runeSwallowMax) {
      UIFilter.normal(this.runeIcon.displayObject);
    } else {
      UIFilter.gray(this.runeIcon.displayObject);
    }
    if (this._itemData.grade > 0) {
      this.upgrade.selectedIndex =
        this.canUpgrade && this.checkCanAdd && !this.isMax ? 1 : 0;
    } else {
      this.upgrade.selectedIndex = this.canStudy && this.checkCanAdd ? 2 : 0;
    }
    if (this.ItemData.runeHole) {
      this.clearInlayItem();
      this.initInlay();
    }
    if (this.tipType != EmWindow.RuneItemTips) {
      this.tipType = EmWindow.RuneItemTips;
      ToolTipsManager.Instance.register(this);
    }
    this.tipData = this._itemData;
    if (this.parent instanceof FastRuneItem) {
      this.txt_name.visible = false;
      this.upgrade.selectedIndex = 0;
    } else {
      this.txt_name.visible = true;
    }
    this.inlay_group.visible = !this._isfast;
  }

  private get checkCanAdd(): boolean {
    if (!this._itemData.nextTemplateInfo) return false;
    if (
      ArmyManager.Instance.thane.grades >=
      this._itemData.nextTemplateInfo.NeedGrade
    ) {
      return true;
    }
    return false;
  }

  private get canUpgrade(): boolean {
    let tempMax =
      GoodsManager.Instance.goodsCountByTempId[RunesUpgradeWnd.LOW_RUNE_TEMPID];
    return tempMax > 0;
  }

  public set upgradeIndex(index: number) {
    this.upgrade.selectedIndex = index;
  }

  private get isMax(): boolean {
    if (!this._itemData) return false;
    if (this._itemData.grade < this.getMaxLevel(this._itemData)) {
      return false;
    } else {
      return true;
    }
  }

  private getMaxLevel(runeInfo: RuneInfo): number {
    // if(ComponentSetting.GENIUS){
    //     return 10;
    // }
    // else{
    let maxGrade: number = 10;
    if (runeInfo) {
      if (runeInfo.templateInfo) {
        let runeType: number = runeInfo.templateInfo.RuneType;
        maxGrade = TempleteManager.Instance.getRuneMaxLevel(runeType);
        // if(runeType == 2){//狂暴符文
        //     maxGrade = 9;
        // }else if(runeType == 3 || runeType == 4 || runeType == 5){//守护符文,驱散符文,驱散符文
        //     maxGrade = 6;
        // }else if(runeType == 6 || runeType == 7 || runeType == 1){//混乱符文, 遗忘符文,激怒符文
        //     maxGrade = 5;
        // }else if(runeType == 8 || runeType == 9  || runeType == 10 ){//流血符文, 恢复符文, 减速符文
        //     maxGrade = 7;
        // }
      }
    }
    return maxGrade;
    // }
  }

  public checkCondition() {
    if (!this._itemData) return;
    if (this._itemData.grade == 0) {
      this._canAdd = false;
    }
    if (this._itemData.grade > 0) {
      if (
        !this.isMax &&
        this._itemData.nextTemplateInfo &&
        ArmyManager.Instance.thane.grades >=
          this._itemData.nextTemplateInfo.NeedGrade
      ) {
        this._canAdd = true;
      } else {
        this._canAdd = false;
      }
    }
  }

  /**
   * 检查是否能够学习符文技能
   * 1, 等级是否达到
   * 2, 背包中是否有对应的符文石
   */
  private get canStudy(): boolean {
    var arr: Array<any> = GoodsManager.Instance.getGeneralBagGoodsBySonType(
      GoodsSonType.SONTYPE_PASSIVE_SKILL,
    );
    var gInfo: GoodsInfo;
    this._runeGInfo = null;
    arr = ArrayUtils.sortOn(arr, ["pos"], [ArrayConstant.NUMERIC]);
    for (var i: number = 0; i < arr.length; i++) {
      gInfo = arr[i] as GoodsInfo;
      if (
        gInfo.templateInfo.Property1 == this._itemData.templateInfo.RuneType
      ) {
        if (gInfo.isBinds) {
          this._runeGInfo = gInfo;
          return true;
        } else if (!this._runeGInfo) {
          this._runeGInfo = gInfo;
        }
      }
    }
    if (this._runeGInfo) {
      return true;
    }
    return false;
  }

  private hasRuneGoods(): boolean {
    var arr: Array<any> = GoodsManager.Instance.getGeneralBagGoodsBySonType(
      GoodsSonType.SONTYPE_PASSIVE_SKILL,
    );
    return arr.length > 0 ? true : false;
  }

  private clearInlayItem() {
    let key: string;
    for (let index = 1; index <= 5; index++) {
      key = "inlayItem" + index;
      (this[key] as fgui.GLoader).url = "";
      (this[key] as fgui.GLoader).visible = false;
    }
  }

  public initInlay() {
    this.clearInlayItem();
    //已雕刻的符孔数量
    let arr = this._itemData.runeHole.split("|");
    let holeLen: number = 0;
    if (arr[1]) {
      holeLen = arr[1].split(",").length;
    }
    let key: string = "";
    for (let i = 1; i <= holeLen; i++) {
      key = "inlayItem" + i;
      if (this.hasOwnProperty(key) && this[key] != null) {
        (this[key] as fgui.GLoader).url = fgui.UIPackage.getItemURL(
          EmPackName.Base,
          CommonConstant.RUNEGEM_ITEMS_RES[0],
        );
        (this[key] as fgui.GLoader).visible = true;
      }
    }
    this.inlay_group.visible = holeLen > 0;

    //符孔中镶嵌的符石
    // let holeLen = this._itemData.runeHole//
    this.checkInlayGem(this.index);
  }

  /**
   * 查找符文身上是否已镶嵌符文石
   * @param runePos 符文位置
   */
  checkInlayGem(runePos: number) {
    let bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
    if (bagData.length > 0) {
      for (let i = 0; i < bagData.length; i++) {
        const goodsInfo = bagData[i];
        let index =
          goodsInfo.pos - (this._itemData.templateInfo.RuneType - 1) * 10;
        if (index >= 0 && index <= 5) {
          (this["inlayItem" + (index + 1)] as fgui.GLoader).url =
            fgui.UIPackage.getItemURL(
              "Base",
              CommonConstant.RUNEGEM_ITEMS_RES[goodsInfo.templateInfo.Profile],
            );
          (this["inlayItem" + (index + 1)] as fgui.GLoader).visible = true;
        }
      }
    }
  }

  public dispose() {
    ToolTipsManager.Instance.unRegister(this);
    // this.removeEvent();
    ObjectUtils.disposeAllChildren(this);
  }
}
