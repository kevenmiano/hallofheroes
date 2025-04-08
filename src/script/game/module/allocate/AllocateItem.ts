// @ts-nocheck
import UIManager from "../../../core/ui/UIManager";
import { DragObject, DragType } from "../../component/DragObject";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { ArmyManager } from "../../manager/ArmyManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import AllocateCom from './AllocateCom';
import AllocateCtrl from "./control/AllocateCtrl";
import SoliderInfoTipWnd from "./SoliderInfoTipWnd";
import FUI_AllocateItem from '../../../../fui/Allocate/FUI_AllocateItem';
export default class AllocateItem extends FUI_AllocateItem implements DragObject {
    dragType: DragType = null;
    dragEnable: boolean = true;
    private _pawn: ArmyPawn;
    private _index: number = 0;
    public allocateCom: AllocateCom;
    constructor() {
        super();
        this.enabled = true;
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
        return this.pawn;
    }
    setDragData(value: any) {
        this.pawn = value;
    }

    onConstruct() {
        super.onConstruct();
        this.setDragEnable(true);
        this.setDragType(DragType.ALLOCATE);
        this.allocateCom = fgui.UIPackage.createObject('Allocate', 'AllocateCom', AllocateCom) as AllocateCom;
        this.allocateCom.setDragEnable(true);
        this.allocateCom.setDragType(DragType.ALLOCATE);
        this.allocateCom.x = 12;
        this.allocateCom.y = 12;
        this.addChild(this.allocateCom);
    }

    public get pawn(): ArmyPawn {
        return this._pawn;
    }

    public set index(value: number) {
        this._index = value;
        if (this.allocateCom) {
            this.allocateCom.index = this._index;
        }
    }

    public set pawn(value: ArmyPawn) {
        this._pawn = value;
        this.allocateCom.pawn = value;
        if (UIManager.Instance.isShowing(EmWindow.SoliderInfoTipWnd))//如果有弹窗
        {
            // UIManager.Instance.HideWind(EmWindow.SoliderInfoTipWnd);
        }
        if (this._pawn && this.pawn.ownPawns > 0) {
            this.on(Laya.Event.CLICK, this, this._clickHander);
        }
    }

    private _clickHander() {
        if (this._pawn && this._pawn.ownPawns > 0) {//点击士兵
            if (UIManager.Instance.isShowing(EmWindow.SoliderInfoTipWnd)) {//如果有弹窗
                let soliderInfoTipWnd: SoliderInfoTipWnd = <SoliderInfoTipWnd>UIManager.Instance.FindWind(EmWindow.SoliderInfoTipWnd);
                if (soliderInfoTipWnd && soliderInfoTipWnd.ap.templateId == this._pawn.templateId) {//点击是同一个则关闭
                    // UIManager.Instance.HideWind(EmWindow.SoliderInfoTipWnd);
                } else {//点击的不是同一个 替换里面的数据

                    let point = this.parent.localToGlobal(this.x, this.y);
                    if (this._index == 0) {
                        UIManager.Instance.ShowWind(EmWindow.SoliderInfoTipWnd, { posX: point.x, posY: point.y, pawnData: this._pawn, type: 2 });
                    } else {
                        UIManager.Instance.ShowWind(EmWindow.SoliderInfoTipWnd, { posX: point.x, posY: point.y, pawnData: this._pawn, type: 1 });
                    }
                }
            } else {//没有弹窗则弹窗
                let point = this.parent.localToGlobal(this.x, this.y);
                if (this._index == 0) {
                    UIManager.Instance.ShowWind(EmWindow.SoliderInfoTipWnd, { posX: point.x, posY: point.y, pawnData: this._pawn, type: 2 });
                } else {
                    UIManager.Instance.ShowWind(EmWindow.SoliderInfoTipWnd, { posX: point.x, posY: point.y, pawnData: this._pawn, type: 1 });
                }
            }
        } else {
            if (UIManager.Instance.isShowing(EmWindow.SoliderInfoTipWnd)) {//如果有弹窗
                // UIManager.Instance.HideWind(EmWindow.SoliderInfoTipWnd);
            }
        }
    }

    protected freePawn(from: ArmyPawn) {
        var count: number = from.ownPawns;
        ArmyManager.Instance.army.removeArmyPawnCountByIndex(0, count);
        ArmyManager.Instance.addPawnCountById(from.templateId, count);
        this.allocateControler.sendMovePawnInfo();
    }

    public get allocateControler(): AllocateCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.AllocateWnd) as AllocateCtrl;
    }

    public dispose() {
        this.off(Laya.Event.CLICK, this, this._clickHander);
        if (this.allocateCom && !this.allocateCom.isDisposed) {
            this.allocateCom.dispose();
        }
        super.dispose();
    }
}