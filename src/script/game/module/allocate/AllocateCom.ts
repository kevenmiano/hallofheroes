// @ts-nocheck
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { DragObject, DragType } from "../../component/DragObject";
import { PawnEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { ArmyManager } from "../../manager/ArmyManager";
import { DoubleClickManager } from "../../manager/DoubleClickManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import AllocateCtrl from "./control/AllocateCtrl";
import FUI_AllocateCom from '../../../../fui/Allocate/FUI_AllocateCom';

export default class AllocateCom extends FUI_AllocateCom implements DragObject {
    dragType: DragType = null;
    dragEnable: boolean = false;
    private _pawn: ArmyPawn;
    private copyPawn: ArmyPawn;
    public index: number = 0;

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

    protected onConstruct() {
        super.onConstruct();
        this.setDragEnable(false);
        this.setDragType(null);
    }

    public get pawn(): ArmyPawn {
        return this._pawn;
    }
    public set pawn(value: ArmyPawn) {
        this._pawn = value;
        if (this._pawn) {
            this._pawn.addEventListener(PawnEvent.PAWN_PROPERTY_CHAGER, this.__propertiesChanged, this);
        }
        this.refreshView();
    }

    private __propertiesChanged() {
        this.refreshView();
    }
    
    /**
         * 撤销兵种 
         */
    protected freePawn(from: ArmyPawn) {
        var count: number = from.ownPawns;
        ArmyManager.Instance.army.removeArmyPawnCountByIndex(0, count);
        ArmyManager.Instance.addPawnCountById(from.templateId, count);
        this.allocateControler.sendMovePawnInfo();
    }

    private get allocateControler(): AllocateCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.AllocateWnd) as AllocateCtrl;
    }

    public refreshView() {
        if (this.isDisposed) return;
        if (this._pawn && this._pawn.ownPawns != 0) {
            this.visible = true;
            if (this.countTxt) {
                this.countTxt.text = this._pawn.ownPawns.toString();
            }
            if (this.soliderIcon) {
                this.soliderIcon.icon = IconFactory.getSoldierIconByIcon(this._pawn.templateInfo.Icon);
            }
        } else {
            this.visible = false;
            if (this.countTxt) {
                this.countTxt.text = "";
            }
            if (this.soliderIcon) {
                this.soliderIcon.icon = "";
            }
        }
    }

    public dispose() {
        if (this._pawn) {
            this._pawn.removeEventListener(PawnEvent.PAWN_PROPERTY_CHAGER, this.__propertiesChanged, this);
            DoubleClickManager.Instance.disableDoubleClick(this.soliderIcon.displayObject);
        }
        super.dispose();
    }

}