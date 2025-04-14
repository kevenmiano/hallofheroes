//@ts-expect-error: External dependencies
import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { DragObject, DragType } from "../../../component/DragObject";
import {
  NotificationEvent,
  SkillEvent,
} from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { SkillInfo } from "../../../datas/SkillInfo";
import DragManager from "../../../manager/DragManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import SkillWnd from "../SkillWnd";
import SkillItemCom from "./SkillItemCom";

/**
 * @author:pzlricky
 * @data: 2021-02-22 15:49
 * @description 技能操作栏
 */
export default class FastSkillItem
  extends fgui.GComponent
  implements DragObject, ITipedDisplay
{
  extData: any = "center";
  tipData: any;
  tipType: EmWindow;
  canOperate: boolean = false;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 0);

  private comPart: fgui.GComponent;
  public selectBorder: fgui.GImage;
  private indexTxt: fgui.GTextField;
  private skillitem: SkillItemCom;
  private _data: SkillInfo;
  private _index: number;

  public dragType: DragType = null;
  public dragEnable: boolean = false;
  private selectFlag: fgui.GImage;

  /**
   *技能快捷键视图
   *监听了技能重置, 技能升级等事件
   *通过交换 SkillInfo 实现技能快捷键之间的技能交换
   */
  constructor() {
    super();
    this.enabled = true;
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
    return this.vdata;
  }

  setDragData(value: any) {
    this.vdata = value;
    this.setSkillItemPos();
  }

  protected onConstruct() {
    this.setDragEnable(true); //设置当前容器可容纳
    this.setDragType(DragType.SKILL);
    this.indexTxt = this.getChild("indexTxt").asTextField;
    this.selectBorder = this.getChild("selectBorder").asImage;
    this.selectFlag = this.getChild("selectFlag").asImage;
    this.skillitem = fgui.UIPackage.createObject(
      "Skill",
      "SkillItemCom",
      SkillItemCom,
    ) as SkillItemCom;
    this.skillitem.isFastSkill = true;
    this.skillitem.switchEditMode(true);
    this.setSkillItemPos();
    this.skillitem.setDragEnable(true);
    this.skillitem.setDragType(DragType.SKILL);
    this.addChildAt(this.skillitem, 1);
    // NotificationManager.Instance.addEventListener(SkillEvent.SKILL_RESET, this.__resetHandler, this);
  }

  private setSkillItemPos() {
    this.skillitem.x = this.skillitem.y = 8;
  }

  private removeEvent() {
    // NotificationManager.Instance.removeEventListener(SkillEvent.SKILL_RESET, this.__resetHandler, this);
  }

  private __resetHandler(e: NotificationEvent) {
    this.data = null;
    this.skillitem.vdata = null;
    this.isUsed = false;
  }

  /**交换数据 */
  private swap(self, target) {
    let selfParent: any = self.parent;
    let targetParent: any = target.parent;
    let temp = targetParent.getDragData();
    targetParent.setDragData(selfParent.getDragData());
    selfParent.setDragData(temp);
  }

  public set selected(b: boolean) {
    this.selectFlag.visible = b;
  }

  public get selected() {
    return this.selectFlag.visible;
  }

  public set index(value: number) {
    this.indexTxt.text = value.toString();
    this._index = value - 1;
  }

  public get index(): number {
    return this._index;
  }

  public set isFastSkill(value: boolean) {
    if (this.skillitem) this.skillitem.isFastSkill = value;
  }

  public get isFastSkill(): boolean {
    if (this.skillitem) return this.skillitem.isFastSkill;
    return true;
  }

  setDragState(isdrag: boolean = true) {
    if (isdrag) {
      if (this.isUsed) {
        ToolTipsManager.Instance.unRegister(this);
        DragManager.Instance.registerDragObject(
          this.skillitem,
          this.onDragComplete.bind(this),
        );
      }
    } else {
      DragManager.Instance.removeDragObject(this.skillitem);
      this.showType = TipsShowType.onClick;
      this.tipType = EmWindow.SkillItemTips;
      this.tipData = this._data;
      ToolTipsManager.Instance.register(this);
    }
  }

  public set vdata(value: SkillInfo) {
    this._data = value;
    if (!this._data) {
      this.isUsed = false;
      // if(skillPanel && skillPanel.checkIsSetting()){
      //     if(!this._data && this.dragEnable){
      //         this.setDragState(false);
      //     }
      // }
    } else {
      let skillPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd)
        .skillPanel;
      if (skillPanel && skillPanel.checkIsSetting()) {
        if (!this.isUsed) {
          this.isUsed = true;
          this.setDragState(true);
        }
      }
      this.isUsed = true;
    }
    if (this._data) {
      this.skillitem.vdata = this._data;
      this.skillitem.enableSelect(false);
      this.skillitem.isUsed = true;
      this.skillitem.visible = true;
      this.tipData = this._data;
      if (this.tipType != EmWindow.SkillItemTips) {
        this.showType = TipsShowType.onClick;
        this.tipType = EmWindow.SkillItemTips;
        ToolTipsManager.Instance.register(this);
      }
    } else {
      this.tipData = null;
      this.tipType = null;
      ToolTipsManager.Instance.unRegister(this);
      this.skillitem.isUsed = false;
      this.skillitem.visible = false;
    }
    this.setSkillItemPos();
    this.skillitem.upgrade.selectedIndex = 0;
    this.indexTxt.visible = !this.isUsed;
    this.skillitem.getChild("txt_name").visible = false;
  }

  public set equiping(v: boolean) {
    // if (this.selectBorder.visible == v) return;
    this.selectBorder.visible = v;
    if (v) {
      this.stopBlink();
      this.blink();
    } else {
      this.stopBlink();
    }
  }

  private onDragComplete(dropTarget, sourTarget) {
    if (dropTarget) {
      Logger.log("拖拽交换！！！！");
      if (dropTarget instanceof SkillItemCom) {
        //目标对象存在
        //父容器为原始对象,则还原
        if (sourTarget != dropTarget) {
          //两者交换
          this.swap(dropTarget, sourTarget);
          NotificationManager.Instance.sendNotification(
            SkillEvent.SET_FAST_KEY,
            null,
          );
        } else {
          this.setSkillItemPos();
          return;
        }
      } else if (dropTarget instanceof FastSkillItem) {
        if (dropTarget == this) {
          this.setSkillItemPos();
          return;
        }
        let selfDragData = this.getDragData();
        let dropTargetData = dropTarget.getDragData();
        dropTarget.setDragData(selfDragData);
        this.setDragData(dropTargetData);
        NotificationManager.Instance.sendNotification(
          SkillEvent.SET_FAST_KEY,
          null,
        );
      } else {
        return;
      }
    } else {
      this.setSkillItemPos();
      //拖出技能栏外释放时删除
      NotificationManager.Instance.dispatchEvent(SkillEvent.PUTOFF, this);
    }
  }
  private blink() {
    this.selectBorder.visible = true;
    this.selectBorder.alpha = 1;
    TweenMax.to(this.selectBorder, 0.5, {
      alpha: 0.2,
      repeat: -1,
      yoyo: true,
      ease: Sine.easeInOut,
    });
  }

  private stopBlink() {
    this.selectBorder.visible = false;
    TweenMax.killTweensOf(this.selectBorder);
  }

  public get vdata(): SkillInfo {
    return this._data;
  }

  public isUsed: boolean = false;

  dispose() {
    ToolTipsManager.Instance.unRegister(this);
    this.stopBlink();
    this.removeEvent();
    ObjectUtils.disposeObject(this.comPart);
  }
}
