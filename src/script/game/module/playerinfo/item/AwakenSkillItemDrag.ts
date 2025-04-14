//@ts-expect-error: External dependencies
import FUI_AwakenSkillItemDrag from "../../../../../fui/PlayerInfo/FUI_AwakenSkillItemDrag";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { DragObject } from "../../../component/DragObject";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { EmWindow } from "../../../constant/UIDefine";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import PetCtrl from "../../pet/control/PetCtrl";

export default class AwakenSkillItemDrag
  extends FUI_AwakenSkillItemDrag
  implements ITipedDisplay
{
  tipData: any;
  extData: any;
  tipType: EmWindow = EmWindow.SkillTip;
  canOperate: boolean = false;
  startPoint: Laya.Point = new Laya.Point(0, 0);
  showType: TipsShowType = TipsShowType.onClick;
  // dragType: DragType = null;
  dragEnable: boolean = true;
  moveDistance = 40;

  onConstruct() {
    super.onConstruct();
    // this.setDragType(DragType.PET_AWAKEN_SKILL);
  }

  // getDragType(): DragType {
  //     return this.dragType;
  // }

  // setDragType(value: DragType) {
  //     this.dragType = value;
  // }

  getDragEnable(): boolean {
    return this.dragEnable;
  }

  setDragEnable(value: boolean) {
    this.dragEnable = value;
  }

  getDragData() {
    return this._info;
  }

  setDragData(value: any) {
    this._info = value;
  }

  // public registerDrag() {
  //     DragManager.Instance.registerDragObject(this, this.onDragComplete.bind(this));
  // }

  /**
   *
   * @param dstTarget 目标对象
   * @param srcTarget 原始对象
   */
  // private onDragComplete(dstTarget, srcTarget) {
  //     if (dstTarget) {
  //         if (dstTarget instanceof AwakenSkillItemDrag) {
  //             if (srcTarget != dstTarget) {
  //                 this.swap(dstTarget, srcTarget);
  //                 NotificationManager.Instance.sendNotification(PetEvent.PET_SKILL_CHANGE, null);
  //             } else {
  //                 this.setItemBack(srcTarget);
  //             }
  //         }
  //     } else {//不处理交换
  //         this.setItemBack(srcTarget)
  //     }
  // }

  private setItemBack(srcTarget) {
    let selfDragData = srcTarget.getDragData();
    this.setDragData(selfDragData);
  }

  public get canSwap(): boolean {
    if (this.isLock || this._skillType != 0) {
      return false;
    }
    return true;
  }

  /**逻辑处理 */
  private swap(dstTarget, srcTarget) {
    var temp: t_s_skilltemplateData = dstTarget.info;
    if (!dstTarget.canSwap) return;
    dstTarget.info = srcTarget.info;
    srcTarget.info = temp;
  }

  private _skillType: number = 0;

  public set skillType(value: number) {
    this._skillType = value;
  }

  //////////////////////////////////////////////////////////
  private _info: t_s_skilltemplateData;

  public set info(data: t_s_skilltemplateData) {
    this._info = data;
    let grade = 0;
    if (this.ctrl.selectedPet) {
      grade = this.ctrl.selectedPet.grade;
    }
    if (grade < 55) {
      this.isLock = !this._info;
    } else {
      this.isLock = false;
    }
    this.resetItem();

    if (data) {
      this.tipData = data;
      ToolTipsManager.Instance.register(this);
      this.baseIcon.icon = IconFactory.getCommonIconPath(data.Icons);
      // 觉醒标志
      // this.imgFlag.visible = data.UseWay == 1;
      // if (this._skillType == 0)
      //     this.registerDrag();
    }
  }

  public get ctrl(): PetCtrl {
    let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
    return ctrl;
  }

  public get info() {
    return this._info;
  }

  private _isLock: boolean = false;
  public get isLock(): boolean {
    return this._isLock;
  }

  public set isLock(value: boolean) {
    this._isLock = value;
    // _lockImg.visible = this._isLock;
  }

  public resetItem() {
    this.tipData = null;
    this.imgFlag.visible = false;
    this.baseIcon.icon = "";
    ToolTipsManager.Instance.unRegister(this);
  }

  public dispose() {
    this.resetItem();
  }
}
