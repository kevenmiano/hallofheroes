// @ts-nocheck
import FUI_SealItem from "../../../../../fui/Skill/FUI_SealItem";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { DragObject, DragType } from "../../../component/DragObject";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { RuneEvent, SkillEvent, TalentEvent } from "../../../constant/event/NotificationEvent";
import { SkillInfo } from "../../../datas/SkillInfo";
import DragManager from "../../../manager/DragManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import DragSealIcon from "./DragSealIcon";
/**
 * 圣印图标
 */
export default class SealItem extends FUI_SealItem {
    extData: any='center';
    tipData: any;
    tipType: EmWindow;
    canOperate: boolean = false;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    
    private _itemdata:SkillInfo;
    private _dragCom:DragSealIcon;
    onConstruct(){
        super.onConstruct();
        this._dragCom = this.dragcom as DragSealIcon; 
    }

    public set selected(v : boolean) {
        this.c1.selectedIndex = v ? 1 : 0;
    }
    
    
    public get itemdata() : SkillInfo {
        return this._dragCom.skillInfo;
    }

    setData(value:SkillInfo){
        this._itemdata = value;
        this._dragCom.skillInfo = value;
        this.tipData = this._itemdata;
        if(this.tipType !== EmWindow.TalentItemTips){
            this.tipType = EmWindow.TalentItemTips;
            ToolTipsManager.Instance.register(this);
        }
    }

    setDragState(bool:boolean){
        if(bool){
            this._dragCom.setDragEnable(true);
            this._dragCom.setDragType(DragType.TALENT);
            DragManager.Instance.registerDragObject(this._dragCom, this.onDragComplete.bind(this));
            ToolTipsManager.Instance.unRegister(this);
            this.tipData = null;
        }else{
            this._dragCom.setDragEnable(false);
            DragManager.Instance.removeDragObject(this._dragCom);
            ToolTipsManager.Instance.register(this);
            this.tipData = this._itemdata;;
        }
    }

    private onDragComplete(dropTarget, sourTarget) {
        this.parent.touchable = false;
        if (dropTarget) {
            if (dropTarget instanceof DragSealIcon) {//目标对象存在
                //父容器为原始对象,则还原
                if (sourTarget != dropTarget) {//两者交换
                    this.swap(dropTarget, sourTarget);
                    NotificationManager.Instance.sendNotification(TalentEvent.SET_FAST_KEY);        
                } 
                // else {
                //     // this.setSkillItemPos();
                //     // return;
                // }
            } 
        }
        this.setSkillItemPos();
        Laya.timer.once(500,this,function(){//避免频繁快速点击导致的意外问题
            this.parent.touchable = true;
        })
    }

    private swap(self:DragSealIcon, target:DragSealIcon) {
        var temp = target.skillInfo;
        var selfData = self.skillInfo;
        (target.parent as SealItem).setData(selfData);
        // target.skillInfo = self.skillInfo;
        // self.skillInfo = temp;
        (self.parent as SealItem).setData(temp)
    }

    setSkillItemPos(){
        this._dragCom.x = 7;
        this._dragCom.y = 7;
        this._dragCom.parent.setChildIndex( this._dragCom,2);
    }
}