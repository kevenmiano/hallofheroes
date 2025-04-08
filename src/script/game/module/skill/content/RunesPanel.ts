import FUI_Runes_Panel from '../../../../../fui/Skill/FUI_Runes_Panel';
import LangManager from '../../../../core/lang/LangManager';
import { isCNLanguage } from '../../../../core/lang/LanguageDefine';
import LayerMgr from '../../../../core/layer/LayerMgr';
import Logger from '../../../../core/logger/Logger';
import ResMgr from '../../../../core/res/ResMgr';
import BaseFguiCom from '../../../../core/ui/Base/BaseFguiCom';
import UIButton from '../../../../core/ui/UIButton';
import { EmLayer } from '../../../../core/ui/ViewInterface';
import { IconFactory } from '../../../../core/utils/IconFactory';
import { t_s_runetemplateData } from '../../../config/t_s_runetemplate';
import { RuneEvent } from '../../../constant/event/NotificationEvent';
import { EmWindow } from '../../../constant/UIDefine';
import { RuneInfo } from '../../../datas/RuneInfo';
import { ArmyManager } from '../../../manager/ArmyManager';
import { MessageTipManager } from '../../../manager/MessageTipManager';
import { NotificationManager } from '../../../manager/NotificationManager';
import { TempleteManager } from '../../../manager/TempleteManager';
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import FastRuneItem from '../item/FastRuneItem';
import RuneItem from '../item/RuneItem';
import SkillWndCtrl from '../SkillWndCtrl';
/**
* @author:pzlricky
* @data: 2021-02-22 17:07
* @description 符文页签窗体
*/
export default class RunesPanel extends FUI_Runes_Panel {

    // public isOversea: fgui.Controller;

    // private runesList: fgui.GList;//左侧符文栏
    // private equipRunes: fgui.GList;//装备快捷符文栏

    public runeLan: fgui.GTextField;
    // public tipTxt: fgui.GTextField;
    private _runelist: Array<RuneInfo>;//符文列表信息
    private _runeKeyList: Array<RuneInfo>;//快捷符文信息
    private _selectRuneData: RuneInfo = null;//当前选择符文信息
  
    // private btn_set: UIButton;//
    /** 当前选中的符文ID */
    public static curRuneId: number = 0;

    constructor() {
        super();
    }

    onConStructor() {
        this.initEvent();
        this.initView();
       
    }

    public initView(){
        this.isSetting = this.tipTxt.visible = false;
        this.btn_set.title = LangManager.Instance.GetTranslation('setting.SettingFrame.title');
        this.tipTxt.text = LangManager.Instance.GetTranslation('rune.equipTip');
        this.initRuneKeyList(); 
        this.refreshRune();
        this.isOversea = this.getController("isOversea");
        if (this.isOversea)
            this.isOversea.selectedIndex = isCNLanguage() ? 0 : 1;
    }

     /**
     * 编辑过程中退出不保存
     */
    public cancel(){
        this.equipRunes.numItems =0;
        this.initView();
        this.updateEditMode();
    }

    private isSetting:boolean=false;
    public onSet(){
        if(this.btn_set.title == LangManager.Instance.GetTranslation('setting.SettingFrame.title')){
            this.btn_set.title = LangManager.Instance.GetTranslation('armyII.viewII.information.InformationView.save');
            this.isSetting = true;
            // this.equiping = true;
            // this.showFastSkillEquiping(true);
            this.tipTxt.visible = true;
        }else
        {   //保存 点击保存按钮可保存技能配置
            this.btn_set.title = LangManager.Instance.GetTranslation('setting.SettingFrame.title')
            this.isSetting = false;
            this.control.sendTakeRune(this.fastKey);
            this.tipTxt.visible = false;

        }
        this.updateEditMode();
    }

    private updateEditMode(){
        for (let i = 0; i < this.runesList.numChildren; i++) {
            const skillItem:RuneItem = this.runesList.getChildAt(i) as RuneItem;
            if(skillItem){
                skillItem.setDragState(this.isSetting);
                skillItem.switchEditMode(this.isSetting);
            }
        }

        for (let i = 0; i < this.equipRunes.numChildren; i++) {
            const skillItem:FastRuneItem = this.equipRunes.getChildAt(i) as FastRuneItem;
            if(skillItem && skillItem.ItemData && !skillItem.isLock){
                skillItem.setDragState(this.isSetting);
            }
            (skillItem.item as RuneItem).switchEditMode(this.isSetting);

        }
    }

    //技能编制状态点击其他页签或退出技能系统将弹出二次确认窗口: 是否保存当前技能配置？
    checkIsSetting():boolean{
        return this.isSetting
    }

    private initEvent() {
        this.equipRunes.itemRenderer = Laya.Handler.create(this, this.renderFastRunesListItem, null, false);
        this.runesList.itemRenderer = Laya.Handler.create(this, this.renderRunesListItem, null, false);
        this.btn_set.onClick(this, this.onSet);
        this.runesList.on(fairygui.Events.CLICK_ITEM, this, this.__onRuleItemSelect);
        this.equipRunes.on(fairygui.Events.CLICK_ITEM, this, this.__onFastRuleItemSelect);
        NotificationManager.Instance.addEventListener(RuneEvent.SET_FAST_KEY, this.__setFastKeyHandler, this);
        NotificationManager.Instance.addEventListener(RuneEvent.PEPLACE,this.onReplace,this);
    }

    private removeEvent() {
        this.btn_set.offClick(this, this.onSet);
        this.runesList.off(fairygui.Events.CLICK_ITEM, this, this.__onRuleItemSelect);
        this.equipRunes.off(fairygui.Events.CLICK_ITEM, this, this.__onFastRuleItemSelect);
        NotificationManager.Instance.removeEventListener(RuneEvent.SET_FAST_KEY, this.__setFastKeyHandler, this);
        NotificationManager.Instance.removeEventListener(RuneEvent.PEPLACE,this.onReplace,this);
    }

    private _selectItem: RuneItem;

    /**列表符文  选择*/
    private __onRuleItemSelect(selectItem: RuneItem) {
        this._selectItem = selectItem;
        if (selectItem) {
            this.setRuneInfo(selectItem.ItemData);  
        }
    }

    /**装备符文  选择 */
    private __onFastRuleItemSelect(item:FastRuneItem) {
        if(this.isSetting){
            //单击符文栏中的符文可直接卸下符文
            item.ItemData = null;
            item.isUsed = false;
            let idx = this.equipRunes.selectedIndex;
            this._runeKeyList[idx] = null;
            // this.__setFastKeyHandler();
            this.updateEquipState();
        }
    }

    private get control(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

    /**渲染列表 */
    private renderRunesListItem(index: number, item: RuneItem) {
        if(!item || item.isDisposed) return;
        item.index = index;
        item.isfast = false;
        item.ItemData = this._runelist[index];
        if(this.isSetting){
            item.equiped.visible = this.checkRuneEquiped(item.ItemData) != null
        }else
        {
            item.equiped.visible = this.checkRuneEquip(item.ItemData.runeId);
        }
        item.dragCom.parent.setChildIndex( item.dragCom,1);
    }

    /**渲染快捷符文列表 */
    private renderFastRunesListItem(index: number, item: FastRuneItem) {
        if (!item || item.isDisposed) return;
        item.index = index;
        let openLevel = (35 + index * 5);
        openLevel = Math.min(40,openLevel);
        let isLock = !(ArmyManager.Instance.thane.grades >= openLevel);//
        item.isLock = isLock;
        item.ItemData = this._runeKeyList[index];    
    }

    /**刷新符文信息 */
    private refreshRune() {
        this._runelist = [];
        var runeList: Array<RuneInfo> = ArmyManager.Instance.thane.runeCate.allRuneList.getList();
        runeList.sort(this.sortRune);
        for (let key in runeList) {
            if (Object.prototype.hasOwnProperty.call(runeList, key)) {
                let info: RuneInfo = runeList[key];
                this._runelist.push(info);
            }
        }
        this.runesList.numItems = this._runelist.length;
        // this.setRuneInfo(this._selectRuneData);
    }

    /**符文排序 */
    private sortRune(info1: RuneInfo, info2: RuneInfo): number {
        if (info1.templateInfo.RuneIndex < info2.templateInfo.RuneIndex) {
            return -1;
        }
        else if (info1.templateInfo.RuneIndex > info2.templateInfo.RuneIndex) {
            return 1;
        }
        return 0;
    }

    /**符文快捷栏 */
    private initRuneKeyList() {
        var keyList: Array<any> = ArmyManager.Instance.thane.runeCate.runeScript.split(",");
        var isLock: boolean = true;
        this._runeKeyList = [];
        for (var i: number = 0; i < 3; i++) {
            isLock = !(ArmyManager.Instance.thane.grades >= (35 + i * 5));
            if (!isLock && i < keyList.length) {
                var temp: t_s_runetemplateData = TempleteManager.Instance.getRuneTemplateByTid(keyList[i]);
                if (temp) {
                    var info: RuneInfo = ArmyManager.Instance.thane.runeCate.getInfoByIndex(temp.RuneIndex);
                    this._runeKeyList.push(info);
                } else {
                    this._runeKeyList.push(null);
                }
            } else {
                this._runeKeyList.push(null);
            }
        }
        this.equipRunes.numItems = this._runeKeyList.length;
    }

    getCurSelectRuneId(){
        if(this._selectRuneData){
            return this._selectRuneData.runeId;
        }
        return 0;
    }

    /**选择符文详细信息 */
    private setRuneInfo(runeData: RuneInfo) {
        if (!runeData || this.isDisposed || this.displayObject == null) {
            this._selectRuneData = null;
            return;
        }

        this._selectRuneData = runeData;
        RunesPanel.curRuneId = this._selectRuneData.runeId;
        if (runeData.grade > 0) {
            //检查是否已经装备
            let isEquip = this.checkRuneEquip(runeData.runeId);
            if(this.isSetting){
                //单击已装备的技能图标可直接卸下技能
                if(isEquip){
                    this.__onEquipOffRune(this._selectRuneData.runeId);
                }else{
                    let item = this.getEmputyItem();
                    if(!item){
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.isfull'));
                    }else{
                        this.__onEquipOnRune(item);
                    } 
                }
           }
        }
    }

    __runeRefreshHandler(evt) {
        if(!this._selectRuneData) return;
        if (evt instanceof RuneInfo) {
            if (evt.runeId == this._selectRuneData.runeId) {
                this._selectRuneData = evt;
            } else {
                return;
            }
        }
        this.refreshRune();
    }

    checkIsFull():boolean{
        let isfull:boolean=true;
        let count: number = this.equipRunes.numChildren;
        for (var i: number = 0; i < count; i++) {
            var item: FastRuneItem = this.equipRunes.getChildAt(i) as FastRuneItem;
            if (!item || !item.ItemData) {
                isfull = false;
                break;
            }
        }
        if(isfull){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.isfull'));
            return true;
        }
        return false;
    }

    private onReplace(selfDragData?, dropTarget?){
        let fastItem: FastRuneItem = this.checkRuneEquiped(dropTarget.getDragData()); //检查是否已经装备
        if (fastItem) {
            //下卸下
            this.__onEquipOffRune(fastItem.ItemData.runeId);
            //再装备
            this._selectRuneData = selfDragData;
            this.__onEquipOnRune(fastItem);
            this.updateEquipState();
        }
    }

    /**
     * 
     * @param selfDragData 被拖动对象数据
     * @param dropTarget 拖动至目标对象
     * @returns 
     */
    private __setFastKeyHandler(selfDragData?,dropTarget?) {
        if(selfDragData){
            let fastItem: FastRuneItem = this.checkRuneEquiped(selfDragData); //检查是否已经装备
            if(fastItem){
                this.__onEquipOffRune(fastItem.ItemData.runeId);
                return;
            }else{
                this._selectRuneData = selfDragData;
                if(dropTarget && !dropTarget.isLock){
                    this.__onEquipOnRune(dropTarget);
                    this.updateEquipState();
                }
            }
        }else{
            // this.control.sendTakeRune(this.fastKey);
        }
    }


    private isFastMoving: boolean = false;
    /**快速装备 */
    private __fastKeyMoveHandler(infoData,fastItem:FastRuneItem) {
        if (this.isFastMoving) return;
        var info: RuneInfo = infoData;
        let point: Laya.Point = infoData.point;
        let isEquip = this.checkRuneEquip(info.runeId);
        if (!fastItem || isEquip) return;

        this.isFastMoving = true;
        if (point) {
            let iconUrl = IconFactory.getTecIconByIcon(info.templateInfo.Icon);
            let dragTarget = new Laya.Sprite();
            let res = ResMgr.Instance.getRes(iconUrl)
            if (res) {
                dragTarget.texture = res
            } else {
                ResMgr.Instance.loadRes(iconUrl, (res) => {
                    dragTarget.texture = res;
                })
            }
            dragTarget.x = point.x;
            dragTarget.y = point.y;
            LayerMgr.Instance.addToLayer(dragTarget, EmLayer.STAGE_DRAG_LAYER);

            var toPoint: Laya.Point = fastItem.parent.localToGlobal(fastItem.x, fastItem.y);
            Laya.Tween.to(dragTarget, { x: toPoint.x, y: toPoint.y }, 100, null, Laya.Handler.create(this, () => {
                this.isFastMoving = false;
                Laya.Tween.clearAll(dragTarget);
                dragTarget.texture = null;
                dragTarget.removeSelf();
                dragTarget = null;
                fastItem.ItemData = info;
                // this.__setFastKeyHandler();
                // this.setRuneInfo(this._selectRuneData);
            }));
        } else {
            fastItem.ItemData = info;
         
            // this.__setFastKeyHandler();
            this.isFastMoving = false;
            fastItem.setDragState(this.isSetting);
            fastItem.item.dragCom.visible = false;
            // this.setRuneInfo(this._selectRuneData);
        }
    }

    /**检查技能是否已经装备 */
    checkRuneEquiped(runeInfo: RuneInfo): FastRuneItem {
        var len: number = this.equipRunes.numChildren;
        for (var i: number = 0; i < len; i++) {
            var item: FastRuneItem = this.equipRunes.getChildAt(i) as FastRuneItem;
            if (item.ItemData == runeInfo){
                return item;
            }
        }
    }

    /**检查符文是否装备 */
    public checkRuneEquip(skillSongType: number): boolean {
        let keys = this.fastKey;
        let keysTemp = keys.split(',');
        if (keysTemp.indexOf(skillSongType.toString()) != -1) {
            return true;
        }
        return false;
    }

    public studyEquip(item:FastRuneItem){
        this.__onEquipOnRune(item);
        this.control.sendTakeRune(this.fastKey);
    }

    private __onEquipOnRune(item:FastRuneItem) {
        Logger.warn('装备符文');
        this.__fastKeyMoveHandler(this._selectRuneData,item);
        this.updateEquipState();
    }

    private __onEquipOffRune(runeId:number) {
        Logger.warn('卸下符文');
        let count: number = this.equipRunes.numChildren;
        for (var i: number = 0; i < count; i++) {
            var item: FastRuneItem = this.equipRunes.getChildAt(i) as FastRuneItem;
            if (item && item.ItemData && item.ItemData.runeId == runeId) {
                item.ItemData = null;
                item.isUsed = false;
                this._runeKeyList[i] = null;

                this.updateEquipState();
                break;
            }
        }
        this.__setFastKeyHandler();
    }

    updateEquipState(){
        this.runesList.numItems = this._runelist.length;
    }


    // private hasRuneGoods(): boolean {
    //     var arr: Array<any> = GoodsManager.Instance.getGeneralBagGoodsBySonType(GoodsSonType.SONTYPE_PASSIVE_SKILL);
    //     return arr.length > 0 ? true : false;
    // }

    /**符文快捷键 */
    public get fastKey(): string {
        var str: string = "";
        var len: number = this.equipRunes.numChildren;
        for (var i: number = 0; i < len; i++) {
            var item: FastRuneItem = this.equipRunes.getChildAt(i) as FastRuneItem;
            if (item.ItemData) {
                str += (item.ItemData.runeId + ",");
            }
            else {
                str += "-1,"
            }
        }
        return str;
    }

    /**获取快速符文 空格位置 */
    public getEmputyItem(): FastRuneItem {
        var len: number = this.equipRunes.numChildren;
        for (var i: number = 0; i < len; i++) {
            var item: FastRuneItem = this.equipRunes.getChildAt(i) as FastRuneItem;
            if (!item.ItemData && !item.isUsed && !item.isLock) {
                item.isUsed = true;
                return item;
            }
        }
        return null;
    }


    dispose() {
        this.removeEvent();
        super.dispose();
    }

}