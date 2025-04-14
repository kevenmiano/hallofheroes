//@ts-expect-error: External dependencies
import Logger from "../../../../core/logger/Logger";
import { DragObject, DragType } from "../../../component/DragObject";
import { RuneEvent } from "../../../constant/event/NotificationEvent";
import { RuneInfo } from "../../../datas/RuneInfo";
import DragManager from "../../../manager/DragManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import FUI_FastRuneItem from "../../../../../fui/Skill/FUI_FastRuneItem";
import RuneItem from "./RuneItem";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import { EmWindow } from "../../../constant/UIDefine";
import LangManager from "../../../../core/lang/LangManager";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import SkillWnd from "../SkillWnd";
/**
 * @author:pzlricky
 * @data: 2021-04-21 17:57
 * @description ***
 */
export default class FastRuneItem
  extends FUI_FastRuneItem
  implements ITipedDisplay, DragObject
{
  tipType: EmWindow = EmWindow.CommonTips;
  tipData: any;
  showType?: TipsShowType = TipsShowType.onClick;
  canOperate?: boolean;
  extData?: any;
  startPoint?: Laya.Point = new Laya.Point(0, 0);
  iSDown?: boolean;
  isMove?: boolean;
  mouseDownPoint?: Laya.Point;
  moveDistance?: number;
  tipDirctions?: string;
  tipGapV?: number;
  tipGapH?: number;
  private _index: number;
  public _isUsed: boolean = false;
  /** false:已解锁  true没解锁*/
  public _isLock: boolean = false;
  private _itemData: RuneInfo;

  public dragType: DragType = null;
  public dragEnable: boolean = false;

  onConstruct() {
    super.onConstruct();
    this.setDragEnable(true); //设置当前容器可容纳
    this.setDragType(DragType.RUNE);
    (this.item as RuneItem).isfast = true;
    (this.item as RuneItem).setDragEnable(true);
    (this.item as RuneItem).setDragType(DragType.RUNE);
    // (this.item as RuneItem).isFastSkill = true;
    // (this.item as RuneItem).switchEditMode(true);
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
    this.setSkillItemPos();
  }

  private setSkillItemPos() {
    this.item.x = -6;
    this.item.y = 11;
  }

  public set ItemData(value: RuneInfo) {
    if (this._itemData) {
      this._itemData.removeEventListener(
        RuneEvent.RUNE_UPGRADE,
        this.__upgradeHandler,
        this,
      );
    }
    this._itemData = value;
    if (this._itemData) {
      this.isUsed = true;
      this._itemData.addEventListener(
        RuneEvent.RUNE_UPGRADE,
        this.__upgradeHandler,
        this,
      );
      this.indexTxt.visible = false;
      let skillPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd)
        .runesPanel;
      if (skillPanel) {
        // (this.item as RuneItem).setDragState();
        (this.item as RuneItem).switchEditMode(skillPanel.checkIsSetting());
      }
      this.item.visible = true;
      this.item.y = -11;
    } else {
      //卸下
      this.isUsed = false;
      // (this.item as RuneItem).getController('button').selectedIndex = 0;
      // (this.item as RuneItem).select.visible = false;
      this.item.visible = false;
    }
    this.lock.visible = this.isLock;
    this.indexTxt.visible = !(this.isUsed || this.isLock);

    (this.item as RuneItem).isUsed = this.isUsed;
    (this.item as RuneItem).isLock = this.isLock;
    (this.item as RuneItem).ItemData = this._itemData;
    (this.item as RuneItem).upgradeIndex = 0; //装备符文无升级图标
    (this.item as RuneItem).txt_name.text = "";
    // let test = (this.item as RuneItem).textNumGroup.visible;
    // console.log(test);
    // (this.item as RuneItem).visible = false;
    ToolTipsManager.Instance.unRegister(this);
    DragManager.Instance.removeDragObject(this.item);
    if (!this._isLock) {
    } else {
      this.tipData = LangManager.Instance.GetTranslation(
        "armyII.viewII.rune.FastRuneItem.OpenTipTxt2",
      );
      ToolTipsManager.Instance.register(this);
    }
  }

  public set isUsed(value: boolean) {
    this._isUsed = value;
    if (this.item) {
      (this.item as RuneItem).isUsed = value;
    }
  }

  public get isUsed(): boolean {
    if (this.item) {
      return (this.item as RuneItem).isUsed;
    } else {
      return this._isUsed;
    }
  }

  public set isLock(value: boolean) {
    this._isLock = value;
    if (this.item) {
      (this.item as RuneItem).isLock = value;
    }
  }

  public get isLock(): boolean {
    if (this.item) {
      return (this.item as RuneItem).isLock;
    } else {
      return this._isLock;
    }
  }

  setDragState(isdrag: boolean = true) {
    if (isdrag) {
      if (!this._isLock) {
        (this.item as RuneItem).switchEditMode(true);
        DragManager.Instance.registerDragObject(
          this.item,
          this.onDragComplete.bind(this),
        );
      }
    } else {
      DragManager.Instance.removeDragObject(this.item);
    }
  }

  private onDragComplete(dropTarget, sourTarget) {
    if (dropTarget) {
      Logger.log("拖拽交换！！！！");
      if (dropTarget instanceof RuneItem) {
        //目标对象存在
        //父容器为原始对象,则还原
        if (sourTarget != dropTarget && dropTarget.isfast) {
          //两者交换
          this.swap(dropTarget, sourTarget);
          NotificationManager.Instance.sendNotification(
            RuneEvent.SET_FAST_KEY,
            null,
          );
        } else {
          return;
        }
      } else if (dropTarget instanceof FastRuneItem) {
        if (dropTarget == this || dropTarget.isLock) {
          return;
        }

        let selfDragData = this._itemData;
        dropTarget.ItemData = selfDragData;
        dropTarget.setDragState(true);
        this.ItemData = null;
        NotificationManager.Instance.sendNotification(
          RuneEvent.SET_FAST_KEY,
          null,
        );
      } else {
        return;
      }
    } else {
      //不处理交换
      this.setSkillItemPos();
      //拖出技能栏外释放时删除
      NotificationManager.Instance.dispatchEvent(
        RuneEvent.SET_FAST_KEY,
        this._itemData,
      );
    }
  }

  private swap(self, target) {
    var temp = target.ItemData;
    var tempUsed = target.isUsed;
    let tempLock = target.isLock;
    target.ItemData = self.ItemData;
    target.isUsed = self.isUsed;
    target.isLock = self.isLock;
    self.isUsed = tempUsed;
    self.isLock = tempLock;
    self.ItemData = temp;
  }

  public set index(value) {
    this._index = value;
    this.indexTxt.text = (value + 1).toString();
  }

  public get index(): number {
    return this._index;
  }

  public get ItemData(): RuneInfo {
    if (this.item) return (this.item as RuneItem).ItemData;
    return null;
  }

  private __upgradeHandler(evt) {
    if (this._itemData && this.item && !this.item.isDisposed) {
      (this.item as RuneItem).ItemData = this._itemData;
      NotificationManager.Instance.sendNotification(
        RuneEvent.SET_FAST_KEY,
        null,
      );
    }
  }

  dispose() {
    this._itemData &&
      this._itemData.removeEventListener(
        RuneEvent.RUNE_UPGRADE,
        this.__upgradeHandler,
        this,
      );
    this.item && this.item.dispose();
    super.dispose();
  }
}
