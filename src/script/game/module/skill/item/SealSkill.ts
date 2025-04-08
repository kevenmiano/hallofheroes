// @ts-nocheck
import FUI_SealSkill from "../../../../../fui/Skill/FUI_SealSkill";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { SkillInfo } from "../../../datas/SkillInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";

/**
 * 圣印技能ITEM
 */
export default class SealSkill extends FUI_SealSkill implements ITipedDisplay{
    extData: any='center';
    tipData: any;
    tipType: EmWindow;
    canOperate: boolean = false;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    private _isOpen: boolean;
    private _canAdd: boolean;
    private _itemdata:SkillInfo;
    // private _dragCom:DragSealIcon;

    onConstruct(){
        super.onConstruct();
        // this._dragCom = this.dragcom as DragSealIcon; 
    }

    // public set selected(v : boolean) {
    //     this.c1.selectedIndex = v ? 1 : 0;
    // }


    setData(value:SkillInfo){
        this._itemdata = value;
        if (!this._itemdata) {
            this.visible = false;
            return;
        }
        this.refreshView();
    }

    /**
     * 
     * @param bool 
     */
    setSelected(bool:boolean,point:number){
        if(!this._itemdata) return;
        if(bool){//当前选择圣印: 技能图标+玩家圣印等级/圣印总等级
            let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, "SonType"+this._itemdata.templateInfo.SonType);
            this.level.text = this._itemdata.grade +'/'+skillTemplateDic.length;
            if(this._itemdata.grade > 1){
                this.thane.talentData.curUsedTalentPoint += this._itemdata.grade ;
            }
            this.select.selectedIndex = 1;
        }else{ //非选中状态圣印: 黑色半透明遮罩技能图标+文本“已投入”+玩家对该技能树投入天赋点数（包含圣印在内, 属于该技能树所有技能所已消耗的天赋点数量）
            let val = point+this._itemdata.grade-1;
            val = Math.max(0,val);
            this.level.text = LangManager.Instance.GetTranslation('talent.usedNum',val);
            this.select.selectedIndex = 0;
            if(val > 1){
                this.thane.talentData.curUsedTalentPoint += val ;
            }
        }
    }

    updatePoint(point){
        let arr = this.level.text.split(':');
        let curpint = parseInt(arr[1]);
        curpint += point;
        this.level.text = LangManager.Instance.GetTranslation('talent.usedNum',curpint);
    }

    private refreshView() {
        var condition: Array<string> = [];
        
        // this.level.text = 'Lv.' + this._itemdata.grade;
       
        if(this._itemdata.templateInfo.Icons)
            this.itemIcon.icon = IconFactory.getTecIconByIcon(this._itemdata.templateInfo.Icons);
        // if (this._itemdata.grade == 0) {
        //     if (this.level.visible)
        //         this.level.visible = false;
        //     if (this.textbg.visible)
        //         this.textbg.visible = false;
        // } else {
        //     if (!this.level.visible)
        //         this.level.visible = true;
        //     if (!this.textbg.visible)
        //         this.textbg.visible = true;
        // }
        // this.level.text = this._itemdata.templateInfo.TemplateNameLang;
        this.checkCondition();
        var nextTemp: t_s_skilltemplateData = this._itemdata.nextTemplateInfo;
        let condictionValue = true;
        if (nextTemp) {
            condition = this._itemdata.checkTalentUpgradeCondition(nextTemp);
        }
        condictionValue = condition.length == 0;
        let point = this.thane.talentData.talentPoint > 0;
        this.upgrade.selectedIndex = (this._canAdd && condictionValue && point && nextTemp) ? 1 : 0;
        if(this.tipType !== EmWindow.TalentItemTips){
            this.tipType = EmWindow.TalentItemTips;
            ToolTipsManager.Instance.register(this);
        }
        this.tipData = this._itemdata;
    }
    /**
     * s升级后天赋点变化需要更新是否能升级
     */
    public updateLevelUpState(){
        
        if(this.upgrade.selectedIndex == 1){
            this.upgrade.selectedIndex = this.checkCanAdd() ? 1 : 0
        }
    }

    
    public set tipEnable(v : boolean) {
        if(!v){
            ToolTipsManager.Instance.unRegister(this);
        }
    }
    

    public checkCondition() {
        if (!this._itemdata) return;
        this._isOpen = false;
        this._canAdd = false;  
        if (this.checkCanAdd()) {//可加点
            UIFilter.normal(this.itemIcon.displayObject);
            this._canAdd = true;
        } else {//不可加点
            UIFilter.gray(this.itemIcon.displayObject);
        }
        if (this._itemdata.grade > 0) {//已经激活的
            UIFilter.normal(this.itemIcon.displayObject);
            this._canAdd = true;
        }
    }

    private checkCanAdd(): boolean {
        if (!this._itemdata.nextTemplateInfo) return false;
        if (this.thane.talentData.talentPoint <= 0) return false;
        if (this._itemdata.checkTalentUpgradeCondition(this._itemdata.nextTemplateInfo).length > 0) return false;
        return true
    }

    public get Itemdata(): SkillInfo {
        return this._itemdata;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

}