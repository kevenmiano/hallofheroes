// @ts-nocheck
import FUI_CommonFrame3 from "../../../../../fui/Base/FUI_CommonFrame3";
import FUI_TabButton from "../../../../../fui/Base/FUI_TabButton";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_runetemplateData } from "../../../config/t_s_runetemplate";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { PetEvent, SkillEvent } from "../../../constant/event/NotificationEvent";
import OpenGrades from "../../../constant/OpenGrades";
import { EmWindow } from "../../../constant/UIDefine";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { PetData } from "../../pet/data/PetData";
import FightEditCtrl from "../FightEditCtrl";
import { SkillEditData } from "../SkillEditData";
import { SkillEditModel } from "../SkillEditModel";
import { EditPetItem } from "./item/EditPetItem";
import { EditSkillItem } from "./item/EditSkillItem";

/**
* @author:zhihua.zhou
* @data: 2022-07-6 18:40
* @description 自动化战斗编辑功能
*/
export default class SkillEditWnd extends BaseWindow {

    private txt1:fairygui.GTextField;
    private txt2:fairygui.GTextField;
    private txt3:fairygui.GTextField;
    private txt4:fairygui.GTextField;
    private txt5:fairygui.GTextField;
    private txt6:fairygui.GTextField;
    private txt7:fairygui.GTextField;
    private btn_reset:fairygui.GButton;
    private btn_save:fairygui.GButton;
    private checkBtn:UIButton;
    private btn_pet:fairygui.GButton;
    private list_tab:fairygui.GList;
    private imgLock:fairygui.GImage;
    private frame:FUI_CommonFrame3;
    private txt_input: fairygui.GTextInput;
    // private hasEdited:boolean = false;
    private _max: number = 95;
    private _min: number = 30;
    private defaultSkill:t_s_skilltemplateData;
    petItem:EditPetItem;
    skillItem:EditSkillItem;
    private _curJob:number=1;
    private _percent:number=50;
    private _skillEditData:SkillEditData;
    private normalArr:Array<string>=["","","",""];
    private specialArr:Array<string>=["","","",""];
    private isEditing:boolean = false;//是否正在编辑中
    private isClickReset:boolean=false;

    private titleArr = [];

    /**初始化 */
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();
        // this.checkBtn.enabled = false;
        this.control.reqSkillPageInfo();
        this.initLanguage();
        this.txt_input.restrict = '0-9';
        this.txt_input.text = '50';
    }

    initLanguage(){
        for (let i = 2; i < 5; i++) {
            const element = LangManager.Instance.GetTranslation('yishi.datas.consant.JobType.Name0'+i);
            this.titleArr.push(element);
        }
        this.list_tab.numItems = this.titleArr.length;

        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('FightSkillEdit.txt1');
        this.txt1.text = LangManager.Instance.GetTranslation('FightSkillEdit.txt2');
        this.txt2.text = LangManager.Instance.GetTranslation('FightSkillEdit.txt3');
        this.txt3.text = LangManager.Instance.GetTranslation('FightSkillEdit.txt4');
        this.txt4.text = LangManager.Instance.GetTranslation('FightSkillEdit.txt16');
        this.txt5.text = LangManager.Instance.GetTranslation('FightSkillEdit.txt17');
        this.txt6.text = LangManager.Instance.GetTranslation('FightSkillEdit.txt18');
        this.txt7.text = LangManager.Instance.GetTranslation('FightSkillEdit.txt19');
        this.btn_reset.title = LangManager.Instance.GetTranslation('armyII.viewII.information.InformationView.reset');
        this.btn_save.title = LangManager.Instance.GetTranslation('FightSkillEdit.txt20');
        this.checkBtn.title = LangManager.Instance.GetTranslation('FightSkillEdit.txt5');
    }

    OnShowWind(){
        super.OnShowWind();
        //1)每个玩家的默认技能不可更改, 需要判定玩家职业获取对应的默认技能
        let sonType:number;
        let job = ArmyManager.Instance.thane.job;
        switch (job) {
            case 1:
            case 4:
                sonType = 107;
                break;
            case 2:
            case 5:
                sonType = 207;
                break;
            case 3:
            case 6:
                sonType = 307;
                break;
        }
        this.defaultSkill = TempleteManager.Instance.getMinSkillTemplateInfoBySonType(sonType);
        this.skillItem.setData(this._curJob,this.defaultSkill,false);
        // this.skillItem.touchable = false;

        let isopen = ArmyManager.Instance.thane.grades >= OpenGrades.PET;
        this.imgLock.visible = !isopen;
    }

    private addEvent(){
        for (let i = 1; i <= 4; i++) {
            let btn = this.contentPane.getChild('btn_add'+i).asButton;
            btn.onClick(this,this.onAdd,[btn]);
            let sbtn = this.contentPane.getChild('btn_s_add'+i).asButton;
            sbtn.onClick(this,this.onAdd,[sbtn]);
            let item = this.contentPane.getChild('itemSkill_'+i) as EditSkillItem;
            item.onClick(this,this.onClickSkill,[item]);
            let item1 = this.contentPane.getChild('s_itemSkill_'+i) as EditSkillItem;
            item1.onClick(this,this.onClickSkill,[item1]);
        }
        this.btn_reset.onClick(this,this.onReset);
        this.btn_save.onClick(this,this.onSave);
        this.checkBtn.onClick(this,this.onCheck);
        this.btn_pet.onClick(this,this.onPet);
        this.txt_input.on(Laya.Event.INPUT, this, this.onChange);
        this.list_tab.on(fgui.Events.CLICK_ITEM, this, this.onTabClick);
        this.list_tab.itemRenderer = Laya.Handler.create(this, this.onRenderListItem1, null, false);
        NotificationManager.Instance.addEventListener(PetEvent.PET_SELECT_CHANGE, this.onPetChange,this);
        NotificationManager.Instance.addEventListener(SkillEvent.CHANGE_SKILL, this.onChangeSkill,this);
        SkillEditModel.instance.addEventListener(SkillEvent.SKILL_EDIT,this.onRecvMsg,this);
    }

    private removeEvent():void{
        for (let i = 1; i <= 4; i++) {
            let btn = this.contentPane.getChild('btn_add'+i).asButton;
            btn.offClick(this,this.onAdd);
            let sbtn = this.contentPane.getChild('btn_s_add'+i).asButton;
            sbtn.offClick(this,this.onAdd);
            let item = this.contentPane.getChild('itemSkill_'+i) as EditSkillItem;
            item.offClick(this,this.onClickSkill);
            let item1 = this.contentPane.getChild('s_itemSkill_'+i) as EditSkillItem;
            item1.offClick(this,this.onClickSkill);
      
        }
        this.btn_reset.offClick(this,this.onReset);
        this.btn_save.offClick(this,this.onSave);
        this.checkBtn.offClick(this,this.onCheck);
        this.btn_pet.offClick(this,this.onPet);
        this.txt_input.off(Laya.Event.INPUT, this, this.onChange);
        this.list_tab.off(fgui.Events.CLICK_ITEM, this, this.onTabClick);
        NotificationManager.Instance.removeEventListener(PetEvent.PET_SELECT_CHANGE, this.onPetChange,this);
        NotificationManager.Instance.removeEventListener(SkillEvent.CHANGE_SKILL, this.onChangeSkill,this);
        SkillEditModel.instance.removeEventListener(SkillEvent.SKILL_EDIT,this.onRecvMsg,this);
    }

    private onRenderListItem1(index: number, item: FUI_TabButton)
    {
        if(item){
            item.title = this.titleArr[index];
        }
    }


    private reset(){
        if(this.isClickReset){
            this.isClickReset = false;
        }else
        {
            this.isEditing = false;
        }
        
        this._percent = 50;
        SkillEditModel.instance.curRuneNum = 0;
        this.updateButtonState();
        this.petItem.visible = false;
        this.normalArr =["","","",""];
        this.specialArr =["","","",""];
        for (let i = 1; i <= 4; i++) {
            let item = this.contentPane.getChild('itemSkill_'+i) as EditSkillItem;
            if(item){
                item.visible = false;
            }
            let btn = this.contentPane.getChild('btn_add'+i).asButton;
            btn.visible = true;
            let sbtn = this.contentPane.getChild('btn_s_add'+i).asButton;
            sbtn.visible = true;
            let item1 = this.contentPane.getChild('s_itemSkill_'+i) as EditSkillItem;
            if(item1){
                item1.visible = false;
            }
        }
    }

    private onRecvMsg(){
        if(this.list_tab.selectedIndex == -1){
            this.list_tab.selectedIndex = 0;
        }
        this.onTabClick(null,null);
        this.checkBtn.selected = SkillEditModel.instance.isOpen;
    }

    refresh(){
        this.reset();
        this._percent = this._skillEditData.percent;
        this.updatePetInfo();
        if(this._skillEditData.normalSkill != ''){
            let array = this._skillEditData.normalSkill.split(',');
            for (let index = 0; index < array.length; index++) {
                let str = array[index];
                let arr = str.split(':');
                let id: number = Number(arr[1]);
                this.normalArr[index] = str;
                SkillEditModel.instance.setNormalPos(this._curJob,index,id);
            }
    
            for (let i = 1; i <= 4; i++) {
                const str = this.normalArr[i-1];
                if(str != ''){
                    let arr = str.split(':');
                    let id: number = Number(arr[1]);
                    let temp: t_s_skilltemplateData|t_s_runetemplateData;
                    if(arr[0] == '2'){
                        temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_runetemplate, id);
                        SkillEditModel.instance.curRuneNum ++;
                    }else
                    {
                        temp = TempleteManager.Instance.getSkillTemplateInfoById(id);
                    }
                    let item = this.contentPane.getChild('itemSkill_'+i) as EditSkillItem;
                    if(item){
                        if(arr[0] == '3'){
                            (temp as t_s_skilltemplateData).Grades = 0;
                        }
                        item.setData(this._curJob,temp,false);
                        item.visible = true;
                        // this.contentPane.getChild('btn_add'+i).visible = false;
                    }
                }
            }
        }
       
        if(this._skillEditData.specialSkill != ''){
            let array1 = this._skillEditData.specialSkill.split(',');
            for (let i = 0; i < array1.length; i++) {
                let str = array1[i];
                let arr = str.split(':');
                let id: number = Number(arr[1]);
                this.specialArr[i] = str;
                SkillEditModel.instance.setSpeciallPos(this._curJob,i,id);
                
            }
    
            for (let i = 1; i <= 4; i++) {
                const str = this.specialArr[i-1];
                if(str != ''){
                    let arr = str.split(':');
                    let id: number = Number(arr[1]);
                    let temp: t_s_skilltemplateData|t_s_runetemplateData;
                    if(arr[0] == '2'){
                        SkillEditModel.instance.curRuneNum ++;
                        temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_runetemplate, id);
                    }else
                    {
                        temp = TempleteManager.Instance.getSkillTemplateInfoById(id);
                    }
                    let item = this.contentPane.getChild('s_itemSkill_'+i) as EditSkillItem;
                    if(item){
                        if(arr[0] == '3'){
                            (temp as t_s_skilltemplateData).Grades = 0;
                        }
                        item.setData(this._curJob,temp,false);
                        item.visible = true;
                        // this.contentPane.getChild('btn_s_add'+i).visible = false;
                    }
                }
            }
        }

        this.txt_input.text = this._skillEditData.percent+'';

        if(this._skillEditData.normalSkill != '' || this._skillEditData.specialSkill != ''){
            // this.hasEdited = true;
            this.updateButtonState();
        }
    }

    private updateButtonState(){
        this.btn_reset.visible = this.isEditing;
        this.txt_input.enabled = this.isEditing;
    }

    private updatePetInfo(){
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let petList = playerInfo.petList;
        if(petList.length <=0){
            this.petItem.visible = false;
            this.petItem.info = null;
        }else
        {
            let petData = this.getPetData(this._skillEditData.petId);
            if(petData){
                this.petItem.visible = true;
                this.petItem.state = EditPetItem.ItemUsing;
                this.petItem.type = EditPetItem.PetList;
                this.petItem.info = petData;
            }else
            {
                this.petItem.visible = false;
                // this.petItem.info = null;
            }
        }
    }

    private getPetData(petId:number):PetData{
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let petList = playerInfo.petList;
        for (let i = 0; i < petList.length; i++) {
            const element = petList[i];
            if(element.petId == petId){
                return element;
            }
        }
        return null;
    }

    onChangeSkill(result:string){
        let resArr = result.split(':');
        let skillId = Number(resArr[1]);
        let len = this._curSelect.name.length;
        let index = this._curSelect.name.charAt(len-1);
        if(this._curType == 0){
            let item = this.contentPane.getChild('itemSkill_'+index) as EditSkillItem;
            if(item){
                let temp: t_s_skilltemplateData|t_s_runetemplateData;
                if(resArr[0] == '2'){
                    temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_runetemplate, skillId);
                }else
                {
                    if(item.skillData && item.skillData instanceof t_s_runetemplateData){//符文被替换成其他技能
                        SkillEditModel.instance.curRuneNum --;
                    }
                    temp = TempleteManager.Instance.getSkillTemplateInfoById(skillId);
                }
                item.setData(this._curJob,temp);
                item.visible = true;
            }
            // this.normalArr.push(result);
            this.normalArr[parseInt(index)-1] = result;
            SkillEditModel.instance.setNormalPos(this._curJob,parseInt(index)-1,skillId);
        }else
        {
            let item = this.contentPane.getChild('s_itemSkill_'+index) as EditSkillItem;
            if(item){
                let temp: t_s_skilltemplateData|t_s_runetemplateData;
                if(resArr[0] == '2'){
                    temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_runetemplate, skillId);
                }else
                {
                    if(item.skillData && item.skillData instanceof t_s_runetemplateData){//符文被替换成其他技能
                        SkillEditModel.instance.curRuneNum --;
                    }
                    temp = TempleteManager.Instance.getSkillTemplateInfoById(skillId);
                }
                item.setData(this._curJob,temp);
                item.visible = true;
            }
            this.specialArr[parseInt(index)-1] = result;
            SkillEditModel.instance.setSpeciallPos(this._curJob,parseInt(index)-1,skillId);
        }
        // this.hasEdited = true;
        this.updateButtonState();
    }

    private _curSelect:fairygui.GComponent;
    private _curType:number = 0;
    onAdd(btn:fairygui.GButton){
        if(this.isEditing){
            this._curSelect = btn;
            this._curType = btn.name.indexOf('s') >= 0 ? 1 : 0;
            FrameCtrlManager.Instance.open(EmWindow.SkillEditSelectWnd,{"job":this._curJob,"type":this._curType});
        }
    }

    onClickSkill(skillItem:EditSkillItem){
        if(this.isEditing){
            this._curSelect = skillItem;
            let isClickRune = skillItem.skillData instanceof t_s_runetemplateData;
            this._curType = skillItem.name.indexOf('s') >= 0 ? 1 : 0;
            FrameCtrlManager.Instance.open(EmWindow.SkillEditSelectWnd,{"job":this._curJob,"type":this._curType,'isClickRune':isClickRune});
            setTimeout(() => {
                skillItem.selected = false;
            }, 100);
        }
    }

    onPetChange(data: PetData){
        this.petItem.state = EditPetItem.ItemUsing;
        this.petItem.type = EditPetItem.PetList;
        this.petItem.info = data;
        this.petItem.visible = true;
    }

    private onChange(): void {
        var value: number = Number(this.txt_input.text);
        if (!value) value = 0;
        if (value > this._max) {
            this.txt_input.text = this._max.toString();
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('FightSkillEdit.txt14'))
        } else{
            this.txt_input.text = value.toString();
        }
    }


    /**
     * 玩家切换职业按钮, 可以对每个职业的对手进行技能释放编辑
     * @param item 
     * @param evt 
     */
    public onTabClick(item: fgui.GObject, evt: Laya.Event) 
    {
        if(item){
            if(this.isEditing){
                this.list_tab.selectedIndex = this._curJob-1;
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('FightSkillEdit.txt21'));
                return;
            }
        }
        let job = 0;
        switch ( this.list_tab.selectedIndex) {
            case 0:
                job = 1;
                break;
            case 1:
                job = 3;
                break;
            case 2:
                job = 5;
                break;
            default:
                break;
        }
        this._curJob = this.list_tab.selectedIndex+1;
        this._skillEditData = SkillEditModel.instance.getSkillEditData(this._curJob);
        this.refresh();
    }

    onReset(){
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let content: string = LangManager.Instance.GetTranslation("FightSkillEdit.txt11");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, (b: boolean, flag: boolean, arr: any[]) => {
            if (b) {
                this.isClickReset = true;
                this.control.reqSkillEditInfo(2,this._curJob,this._percent,this._skillEditData.normalSkill,this._skillEditData.specialSkill,this._skillEditData.petId,this.checkBtn.selected)
                SkillEditModel.instance.reset();
                this.petItem.info = null;
            }
        });
    }

    onSave(){
        if(this.isEditing == false){
            this.isEditing = true;
            this.btn_save.title = LangManager.Instance.GetTranslation('FightSkillEdit.txt6');//显示保存
            this.updateButtonState();
            this.checkBtn.enabled = false;
            return;
        }else
        {
            if(Number(this.txt_input.text) < this._min){
                this.txt_input.text = this._min.toString();
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('FightSkillEdit.txt23'))
                return;
            }
            this.isEditing = false;
            this.btn_save.title = LangManager.Instance.GetTranslation('FightSkillEdit.txt20');//显示编辑
            this.checkBtn.enabled = true;
        }

        this._percent = parseInt(this.txt_input.text);

        //1:107,2:1,3:1001
        let temp:any = [];
        for (let i = 0; i < this.normalArr.length; i++) {
            const element = this.normalArr[i];
            if(element != ''){
                temp.push(element);
            }
        }
        let temp1:any = [];
        for (let i = 0; i < this.specialArr.length; i++) {
            const element = this.specialArr[i];
            if(element != ''){
                temp1.push(element);
            }
        }
        let normal = temp.join(',');
        let special = temp1.join(',');
        let petId = 0;
        if(this.petItem.info && this.petItem.visible){
            petId = this.petItem.info.petId;
        }
        this.control.reqSkillEditInfo(1,this._curJob,this._percent,normal,special,petId,this.checkBtn.selected);
        // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('FightSkillEdit.txt10'));
    }

    private get control(): FightEditCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.SkillEditPetWnd) as FightEditCtrl;
    }


    /**
     * 完成检测: 需要
     */
    onCheck(){
        //判断玩家是否三个职业都已经编辑过战斗
        if(this.checkEdit()){

            this.checkBtn.enabled = false;
            setTimeout(() => {
                if(this.checkBtn){
                    this.checkBtn.enabled = true;
                }
            }, 1000);
            //是则弹出tips: 已开启自动化战斗编辑
            // if(this.checkBtn.selected){
            //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('FightSkillEdit.txt12'))
            // }else
            // {
                
            // }
            this.control.reqSkillEditOpen(!this.checkBtn.selected);
            PlayerManager.Instance.currentPlayerModel.playerInfo.isSkillEditOpen = !this.checkBtn.selected;
        }else
        {
            setTimeout(() => {
                this.checkBtn.selected = false;
            }, 100);
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('FightSkillEdit.txt13'));
        }
    }

    onPet(){
        if(this.isEditing && !this.imgLock.visible){
            UIManager.Instance.ShowWind(EmWindow.SkillEditPetWnd);
        }
    }

    /**
     * 检测三个职业下玩家常规及特殊状态的技能编辑是否都最少存在1个技能配置
     */
    checkEdit(){
        for (let i = 1; i < 4; i++) {
            if(i != this._curJob){
                let data =  SkillEditModel.instance.getSkillEditData(i);
                if(data.normalSkill == ""||data.specialSkill == ""){
                    return false;
                }
            }
        }

        let hasNormal:boolean=false;
        let hasSpecial:boolean=false;
        for (let i = 0; i < this.normalArr.length; i++) {
            const element = this.normalArr[i];
            if(element != ''){
                hasNormal = true;
                break;
            }
        }
        for (let i = 0; i < this.specialArr.length; i++) {
            const element = this.specialArr[i];
            if(element != ''){
                hasSpecial = true;
                break;
            }
        }
        if(hasNormal && hasSpecial){
            return true;
        }
        return false;
    }

    private helpBtnClick() {
        let content: string = LangManager.Instance.GetTranslation("FightSkillEdit.help");
        UIManager.Instance.ShowWind(EmWindow.Help, { content: content });
    }

    /**关闭 */
    OnHideWind() {
        SkillEditModel.instance.reset();
        this.removeEvent();
        super.OnHideWind();
    }
}