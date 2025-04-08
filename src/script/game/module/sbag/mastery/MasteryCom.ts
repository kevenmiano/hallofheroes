/**
 * @description 职业专精
 */

import FUI_MasteryCom from "../../../../../fui/SBag/FUI_MasteryCom";
import FUI_SecretListItem from "../../../../../fui/SBag/FUI_SecretListItem";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { t_s_extrajobData } from "../../../config/t_s_extrajob";
import { BagType } from "../../../constant/BagDefine";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import NewbieEvent, { ExtraJobEvent } from "../../../constant/event/NotificationEvent";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FUIHelper from "../../../utils/FUIHelper";
import { ExtraJobEquipItemInfo } from "../../bag/model/ExtraJobEquipItemInfo ";
import { ExtraJobItemInfo } from "../../bag/model/ExtraJobItemInfo";
import ExtraJobModel from "../../bag/model/ExtraJobModel";
import NewbieConfig from "../../guide/data/NewbieConfig";
import { SoulEquipItem } from "./SoulEquipItem";

export class MasteryCom extends FUI_MasteryCom {

    private activeList:Array<ExtraJobItemInfo>=[];
    private isInit:boolean=false;
    private _totalLevel:number=0;
    /** 已激活数量 */
    private _activedNum:number=0;
    /** 剩余可激活数量 */
    private _leftNum:number=0;
    constructor() {
        super();
       
    }

    private addEvent() {
        this.btn_help.onClick(this, this.onHelp);
        this.secret_list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.secret_list.on(fairygui.Events.CLICK_ITEM, this, this.onSelectItem);
        NotificationManager.Instance.addEventListener(ExtraJobEvent.LEVEL_UP, this.levelupGrade, this);
        NotificationManager.Instance.addEventListener(ExtraJobEvent.STAGE_UP, this.onStageUp, this);
    }

    private levelupGrade(){
        this.refreshView();
    }

    private onStageUp(info:ExtraJobEquipItemInfo){
        let equip = this['item'+info.equipType] as SoulEquipItem;
        if(equip){
            equip.setData(info);
        }  
        this.setSoulEquip();
    }

    public initView(){ 
        if(!this.isInit){
            this.addEvent();
            this.isInit = true;
        }
        this.refreshView();
        NotificationManager.Instance.dispatchEvent(NewbieEvent.MANUAL_TRIGGER, NewbieConfig.NEWBIE_370)
    }

    private refreshView(){
        this._totalLevel = ExtraJobModel.instance.totalLevel;
        this._activedNum = ExtraJobModel.instance.activedNum;
        this._leftNum = ExtraJobModel.instance.leftNum;
        this.txt_level.text = this._totalLevel.toString();
       
        let str = ExtraJobModel.instance.leftNum +'/'+ExtraJobModel.instance.canActiveNum
        this.txt_active.text = LangManager.Instance.GetTranslation('Bag.mastery02',str);
        if(ExtraJobModel.instance.nextLevel == 0){
            this.txt_add.text = LangManager.Instance.GetTranslation('Mastery.activeMax');
        }else{
            this.txt_add.text = LangManager.Instance.GetTranslation('Bag.mastery05',ExtraJobModel.instance.nextLevel);
        }
        this.activeList = ExtraJobModel.instance.activeList;
        this.secret_list.numItems = this.activeList.length;
        //秘典总等级变化后更新魂器
        this.setSoulEquip();
    }


    /**
     * 设置魂器
     */
    private setSoulEquip(){
        ExtraJobModel.instance.resetAllPropertys();
        let arr = ExtraJobModel.instance.equipList;
        for (let i = 1; i < 7; i++) {
            let equip = this['item'+i] as SoulEquipItem;
            let info = arr[i-1];
            equip.setData(info);
            ExtraJobModel.instance.getAttr(info);
        } 
        this.setSoulPropertyTip();
    }

    public removeEvent() {
        this.btn_help.offClick(this, this.onHelp);
        this.secret_list.off(fairygui.Events.CLICK_ITEM, this, this.onSelectItem);
        NotificationManager.Instance.removeEventListener(ExtraJobEvent.LEVEL_UP, this.levelupGrade, this);
        NotificationManager.Instance.removeEventListener(ExtraJobEvent.STAGE_UP, this.onStageUp, this);
    }

    private renderListItem(index: number, item: FUI_SecretListItem) {
        let info:ExtraJobItemInfo = this.activeList[index];
        item.data = info;
        if(info){
            let name = LangManager.Instance.GetTranslation('Mastery.jobtype'+info.jobType);
            item.getChild('iconLoader').asLoader.url = this.getJobIcon(info.jobType);
            //是否已激活
            let isActived=info.jobLevel > 0;
            if(isActived){
                //是否可升级
                item.getChild('txt_name').text = LangManager.Instance.GetTranslation('NameAndLevel',name,info.jobLevel);
                item.getController('c1').selectedIndex =1;
                let canLevelUp:boolean= false;
                var nextInfo: t_s_extrajobData = TempleteManager.Instance.getExtrajobCfg(info.jobType, info.jobLevel+1);
                if (nextInfo) {
                    canLevelUp = this.checkCondition(nextInfo);
                }
                item.getController('c1').selectedIndex = canLevelUp ? 2 : 1;
            }else{
                item.getChild('txt_name').text = name;
                //是否可激活
                if(this._leftNum > 0){
                    item.getController('c1').selectedIndex =4;
                }else{
                    item.getChild('txt_name').asTextField.alpha = 0.5;
                    item.getController('c1').selectedIndex =0;
                }
            }
        }else{
            item.getChild('iconLoader').asLoader.url = fgui.UIPackage.getItemURL(EmPackName.SBag, 'Icon_Mastery_Unopened_L');
            item.getController('c1').selectedIndex = 3;
        }
    }

    private checkCondition(nextInfo:t_s_extrajobData):boolean{
        if(ArmyManager.Instance.thane.grades >=  nextInfo.NeedPlayerLevel && this._totalLevel >= nextInfo.NeedTotalJobLevel){
            if (ResourceManager.Instance.gold.count >= nextInfo.CostGold) {
                let ownProp = GoodsManager.Instance.getBagCountByTempId(BagType.Player,nextInfo.CostItemId)
                if (ownProp >= nextInfo.CostItemCount){
                    return true;
                }
            }   
        }
        return false;
    }

    onSelectItem(item: FUI_SecretListItem) {
        if(item.data){
            UIManager.Instance.ShowWind(EmWindow.SecretBookTips,item.data)
        }else{
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('Mastery.unopen'));
        }
    }


    public getJobIcon(job: number): string {
        let url: string = "";
        switch (job) {
            case 41:
                url = "Icon_Mastery_Knight_L";
                break;
            case 42:
                url = "Icon_Mastery_Archer_L";
                break;
            case 43:
                url = "Icon_Mastery_Mage_L";
                break;
            case 44:
                url = "Icon_Mastery_long_L";
                break;
        }
        return fgui.UIPackage.getItemURL(EmPackName.SBag, url);
    }


    /**
     * 点击图标弹出魂器总属性tips
     * @param thane 
     */
    private setSoulPropertyTip() {
        let selfstr = `[color=#ffc68f][size=22]${LangManager.Instance.GetTranslation("Bag.mastery04")}[/size][/color]<br>`;
        let selfData = ExtraJobModel.instance.getTotalProperty();
        let count = Object.keys(selfData).length;
        if (count > 0) {
            for (const key in selfData) {
                if (Object.prototype.hasOwnProperty.call(selfData, key)) {
                    let element = selfData[key];
                    selfstr += `[color=#ffc68f][size=20]${key + '&nbsp;:&nbsp;'}[/size][/color][size=22]${element}[/size]` + "<br>"
                }
            }
        } else {
            selfstr += LangManager.Instance.GetTranslation('AppellPowerTip.noneProps');
        }
        
        FUIHelper.setTipData(
            this.btn_attr,
            EmWindow.CommonTips,
            selfstr,
            new Laya.Point(0, 0), undefined, undefined
        )
    }

    private onHelp() {
        let title = '';
        let content = '';
        title = LangManager.Instance.GetTranslation("Bag.masteryHelpTitle");
        content = LangManager.Instance.GetTranslation("Bag.masteryHelp");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    onHide() {
        if (this.isInit) {
            this.removeEvent();
        }
        this.isInit = false;
    }
}