import Logger from "../../../../core/logger/Logger";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { DragObject, DragType } from "../../../component/DragObject";
import { SkillEvent } from "../../../constant/event/NotificationEvent";
import { SkillPriorityType } from "../../../constant/SkillSysDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { SkillInfo } from "../../../datas/SkillInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import FUI_SkillItemCom from '../../../../../fui/Skill/FUI_SkillItemCom';
import { EmWindow } from "../../../constant/UIDefine";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import DragIconCom from "./DragIconCom";
import DragManager from "../../../manager/DragManager";
import FastSkillItem from "./FastSkillItem";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import SkillWnd from "../SkillWnd";
import SkillPanel from "../content/SkillPanel";
import { ResourceManager } from "../../../manager/ResourceManager";
import ExtraJobModel from "../../bag/model/ExtraJobModel";
import MasterySkillItem from "./MasterySkillItem";

/**
* @author:pzlricky
* @data: 2021-02-22 16:12
* @description *** 
*/
export default class SkillItemCom extends FUI_SkillItemCom implements DragObject,ITipedDisplay {
    extData: any ='center';
    tipData: any;
    tipType: EmWindow;
    canOperate: boolean = false;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    private _data: SkillInfo;
    // private _filter: IFilterFormat;
    private _skillIcon: fgui.GLoader;
    // private _passitive: fgui.GComponent;
    // private _superSkill: fgui.GComponent;
    private _equipedIcon: fgui.GImage;
    private _SIcon: fgui.GImage;
    private _passiveSkillBox: fgui.GGroup;
    private _skillLevelBox: fgui.GGroup;
    private _levelTxt: fgui.GTextField;
    // private n10: fgui.GTextField;
    private _isOpen: boolean;
    // private _canAdd: boolean;
    public index: number = 0;
    private isCheck: boolean = false;
    private _isUsed: boolean = false;//是否正在使用
    private _isFastSkill: boolean = false;//是否是快捷技能
    private _enableSelect: boolean = false;//取消选中状态
    private isMasterySkill: boolean = false;//
    dragType: DragType = null;
    dragEnable: boolean = false;

    constructor() {
        super();
        if (!this.displayObject['dyna']) {
            this.displayObject['dyna'] = true;
        }
    }

    showEquipIcon(bool:boolean=true){
        this._equipedIcon.visible = bool;
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
    }
    /**
     * 编辑模式长按弹出, 否则单击弹出
     * @param isEdit 
     */
    switchEditMode(isEdit:boolean=false){
        ToolTipsManager.Instance.unRegister(this);
        if(this.isDraging){
            return;
        }
        if(isEdit){
            // this.showType = TipsShowType.onLongPress;
        }else{
            this.showType = TipsShowType.onClick
            this.tipType = EmWindow.SkillItemTips;
            this.tipData = this._data;
            ToolTipsManager.Instance.register(this);
        }
    }

    /**
     *技能item
     *根据传入的 SkillInfo 显示不同的状态
     *在判断是否可以加点的时候需要考虑多种情况
     *1, 没有下一级可加
     *2, 可用点数为0
     *3, 未达到升级条件
     */
    onConstruct() {
        super.onConstruct();
        this.displayObject['dyna'] = true;
        this._skillIcon = this.getChild('icon').asLoader;
        this._equipedIcon = this.equiped;
        this._SIcon = this.S;
        this._passiveSkillBox = this.passiveSkillBox;
        this._skillLevelBox = this.skillLevelBox;
        this._levelTxt = this.num;
        this.setDragEnable(false);
        this.setDragType(null);
        this.initEvent();
    }

    /**取消选中状态 */
    enableSelect(value: boolean) {
        this._enableSelect = value;
        this.selectBorder.visible = value;
    }

    private initEvent() {
        this.on(Laya.Event.CLICK, this, this.__clickHandler);
        NotificationManager.Instance.addEventListener(SkillEvent.SKILL_UPGRADE, this.__skillChangeHandler, this);
        NotificationManager.Instance.addEventListener(SkillEvent.CLICK_MASTERY_SKILL, this.onResetBtnState, this);
    }
    private removeEvent() {
        this.off(Laya.Event.CLICK, this, this.__clickHandler);
        NotificationManager.Instance.removeEventListener(SkillEvent.SKILL_UPGRADE, this.__skillChangeHandler, this);
        NotificationManager.Instance.removeEventListener(SkillEvent.CLICK_MASTERY_SKILL, this.onResetBtnState, this);
    }

    onResetBtnState(item){
        if(item != this){
            this.enableSelect(false);
        }else{
            this.enableSelect(true);
        }
    }

    /**单机选中 */
    __clickHandler(evt: Event) {
        Logger.log('__clickHandler:', this._data);
        // UIManager.Instance.ShowWind(EmWindow.SkillItemTips,this._data);
        if(this.isMasterySkill){
            NotificationManager.Instance.dispatchEvent(SkillEvent.CLICK_MASTERY_SKILL,this);
        }
    }

    checkIsMasterySkill(skillInfo){
        return skillInfo.templateInfo.MasterType >=41 && skillInfo.templateInfo.MasterType <= 44;
    }

    private __skillChangeHandler(skillInfo: SkillInfo) {
        if (!this._data) return;
        //如果是不同类型的技能则return掉
        if(this.parent instanceof MasterySkillItem){
            if(!this.checkIsMasterySkill(skillInfo)){
                return;
            }
            if(skillInfo.templateInfo.Index != this._data.templateInfo.Index) return; 
        }
        
        this.refreshView();
        this.moveSkill(skillInfo);
    }

    private moveSkill(info: SkillInfo) {
        if (!this._data) return;
        if (info != this._data) return;
        if (this._data.grade != 1 || (this._data.templateInfo.UseWay == 2)) return;
        if (this.thane.skillCate.fastKey.indexOf(this._data.templateInfo.SonType.toString()) > 0) return;
        if (this.thane.fastKeyLength >= SkillPanel.SKILL_NUM) return;
        let point = this.parent.localToGlobal(this.x, this.y);
        NotificationManager.Instance.sendNotification(SkillEvent.FAST_KEY_MOVE, { data: this._data, point: point });   
    }

    private isDraging:boolean=false;
    /**
     * 被动技能、未开启的技能不能拖动
     */
    setDragState(isdrag:boolean=true){
        if(this._data && this._data.templateInfo.UseWay != 2 && this._data.grade != 0){
            let dragCom = this.dragCom as DragIconCom;
            if(isdrag){
                this.setDragEnable(true);//设置当前容器可容纳
                this.setDragType(DragType.SKILL);
                this.isDraging = true;
                dragCom.visible = true;
                dragCom.vdata = this._data;
                dragCom.setDragEnable(true);
                dragCom.setDragType(DragType.SKILL);
                DragManager.Instance.registerDragObject(dragCom, this.onDragComplete.bind(this));
            }else{
                this.isDraging = false;
                dragCom.visible = false;
                // dragCom.vdata = this._data;
                dragCom.setDragEnable(false);
                // dragCom.setDragType(DragType.SKILL);
                DragManager.Instance.removeDragObject(dragCom);
            }
        }
    }

    // private checkFul(dropTargetData:SkillInfo){
    //     let skillPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).skillPanel;
    //     if(skillPanel){
    //         if(skillPanel.checkIsFull(dropTargetData)){
    //             this.setSkillItemPos();
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    /**
     * 
     * @param dropTarget 拖动至目标对象
     * @param sourTarget 被拖动的原对象
     * @returns 
     */
    private onDragComplete(dropTarget, sourTarget) {
        if (dropTarget) {
            let dropTargetData = dropTarget.getDragData();
            let selfDragData = this.getDragData();
            if (dropTarget instanceof SkillItemCom) {//目标对象存在
               
                if(dropTarget.isFastSkill){
                    // if(this.checkFul(dropTargetData)) return;
                    NotificationManager.Instance.sendNotification(SkillEvent.REPLACE, selfDragData,dropTarget);
                    this.setSkillItemPos();
                    return;
                }
                //父容器为原始对象,则还原
                if (sourTarget != dropTarget) {//两者交换
                    NotificationManager.Instance.sendNotification(SkillEvent.SET_FAST_KEY, selfDragData);
                } else {
                    this.setSkillItemPos();
                    return;
                }
            } else if (dropTarget instanceof FastSkillItem) {
                // if(this.checkFul(dropTargetData)) return;
                // if (dropTarget == this) {
                //     this.setSkillItemPos();
                //     return;
                // }
                if(!dropTargetData){
                    // 装备
                    // dropTarget.setDragData(selfDragData);
                    NotificationManager.Instance.sendNotification(SkillEvent.SET_FAST_KEY, selfDragData,dropTarget);
                }else{
                    if(sourTarget != dropTarget){//从上面的拖动到下面替换
                        NotificationManager.Instance.sendNotification(SkillEvent.SET_FAST_KEY, selfDragData,dropTarget);
                    }
                }
                
            } else {
                this.setSkillItemPos();
                return;
            }
        } else {//不处理交换
            // let selfDragData = sourTarget.getDragData();
            // this.setDragData(selfDragData);

        }
        this.setSkillItemPos();
    }

    setSkillItemPos(){
        this.dragCom.x = this.dragCom.y = 2;
        this.dragCom.parent.setChildIndex( this.dragCom,1);
    }

    private refreshView() {
        if (!this._data) return;
        let curGrade = this._data.grade ? this._data.grade : 0;
        let maxGrade = this._data.maxGrade ? this._data.maxGrade : 0;
        this._levelTxt.text = curGrade + "/" + maxGrade;
        this.icon = IconFactory.getTecIconByIcon(this._data.templateInfo.Icons);
        this._passiveSkillBox.visible = this._data.templateInfo.UseWay == 2;
        this._SIcon.visible = SkillPriorityType.isSuperSkill(this._data.templateInfo.Priority);// == SkillPriorityType.SUPER_SKILL;
        if(!this._isFastSkill ){
            Logger.log('this._data.templateInfo.TemplateNameLang',this._data.templateInfo.TemplateNameLang)
            let skillPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).skillPanel;
            let equipActive;
            if(skillPanel && skillPanel.checkIsSetting()){
                equipActive = skillPanel.checkSkillEquiped(this._data);
                this._equipedIcon.visible = equipActive != null;
            }else{
                if(this.isMasterySkill){//切换双套技能的时候，专精技能的的装备状态不用变化
                    if(!this._equipedIcon.visible){
                        equipActive =  this.checkEquipState(); 
                        this._equipedIcon.visible = equipActive;
                    }
                }else{
                    equipActive =  this.checkEquipState(); 
                    this._equipedIcon.visible = equipActive;
                }
            } 
        }
        
        this.checkCondition();
        if (!this._isFastSkill) {
            this.upgrade.selectedIndex = this.checkCanAdd() ? 1 : 0;
            if(this.tipType != EmWindow.SkillItemTips){
                this.tipType = EmWindow.SkillItemTips;

                ToolTipsManager.Instance.register(this);
            } 
            this.tipData = this._data;
        } else {
            this.upgrade.selectedIndex = 0;
            this.parent.setChildIndex(this,2);
        }
        this.txt_name.text = this._data.templateInfo.TemplateNameLang;
    }


    public checkCondition() {
        if (!this._data) return;
        this._isOpen = false;
        this._skillLevelBox.visible = true;
        if(!this._skillIcon.displayObject) return;
        UIFilter.normal(this._skillIcon.displayObject);
        // this._canAdd = false;
        if (this._data.grade == 0) {
            this._isOpen = true;
            this._skillLevelBox.visible = false;
            UIFilter.gray(this._skillIcon.displayObject);
            UIFilter.gray(this._passiveSkillBox.displayObject);
            UIFilter.gray(this._skillLevelBox.displayObject);
        }
        if (this.checkCanAdd() && this._data.grade >0) { //可加点
            UIFilter.normal(this._skillIcon.displayObject);
            UIFilter.normal(this._passiveSkillBox.displayObject);
            UIFilter.normal(this._skillLevelBox.displayObject);
            // this._canAdd = true;
        } else {//不可加点
            UIFilter.gray(this._skillIcon.displayObject);
            UIFilter.gray(this._passiveSkillBox.displayObject);
            UIFilter.gray(this._skillLevelBox.displayObject);
        }
        if (this._data.grade > 0) {//已经激活的
            UIFilter.normal(this._skillIcon.displayObject);
            UIFilter.normal(this._passiveSkillBox.displayObject);
            UIFilter.normal(this._skillLevelBox.displayObject);
            // this._canAdd = true;
        }
    }

    private checkCanAdd(): boolean {
        if (!this._data.nextTemplateInfo) return false;
        if(this.isMasterySkill){
            let jobtype = this._data.templateInfo.MasterType;
            let jobLevel = ExtraJobModel.instance.getExtrajobItemLevel(jobtype);
            if(this._data.grade == 0){
                let canStudy = jobLevel>0 && jobLevel >= this._data.templateInfo.NeedPlayerGrade;
                return canStudy;  
            }else{
                let canUpgrade = jobLevel >= this._data.nextTemplateInfo.NeedPlayerGrade;
                let isgoldEnough = ResourceManager.Instance.gold.count >= this._data.templateInfo.Parameter3;
                return canUpgrade && isgoldEnough;
            }
        }
        if (this.thane.skillCate.skillPoint <= 0) return false;
        if (this._data.checkUpgradeCondition(this._data.nextTemplateInfo).length > 0) return false;
        return true
    }

    /**
     * 专精技能是否可以升级
     * @returns 
     */
    private checkMasteryCanAdd(): boolean {
        
        return true
    }

     /**
     * 专精技能是否可以学习
     * @returns 
     */
    private checkMasteryCanStudy(): boolean {
       
        return true
    }

    public set isFastSkill(value: boolean) {
        this._isFastSkill = value;
    }

    public get isFastSkill(): boolean {
        return this._isFastSkill;
    }

    public set vdata(value: SkillInfo) {
        this._data = value;
        if (!this._data) {
            this.visible = false;
            return;
        }
        this.isMasterySkill = value.templateInfo.MasterType >=41 && value.templateInfo.MasterType <= 44;
        this.visible = true;
        this.refreshView();
    }

    getIcon() {
        return this.icon;
    }

    getData() {
        return this._data;
    }

    public get vdata(): SkillInfo {
        return this._data;
    }

    public set isUsed(value: boolean) {
        this._isUsed = value;
    }

    public get isUsed(): boolean {
        return this._isUsed;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public get isOpen(): boolean {
        return this._isOpen;
    }

    private checkEquipState() {
        var keyList: Array<string> = this.thane.skillCate.fastKey.split(",");
        for (var i: number = 0; i < SkillPanel.SKILL_NUM; i++) {
            if (i < keyList.length) {
                if(keyList[i] != '-1'){
                    var temp: SkillInfo = this.thane.getSkillBySontype(Number(keyList[i]));
                    if(!temp){
                        temp= this.thane.getExtrajobSkillBySontype(Number(keyList[i]));
                    }
                    if (temp === this._data) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public dispose() {
        ToolTipsManager.Instance.unRegister(this);
        this.removeEvent();
        ObjectUtils.disposeAllChildren(this);
    }

}