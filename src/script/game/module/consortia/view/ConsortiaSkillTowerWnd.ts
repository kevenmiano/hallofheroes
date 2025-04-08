// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-05-29 16:01:11
 * @Description: 技能 v2.46 ConsortiaResearchSkillFrame
 */
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { ConsortiaSkillTowerItem } from "./component/ConsortiaSkillTowerItem";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { ConsortiaTempleteInfo } from "../data/ConsortiaTempleteInfo";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import { ConsortiaDutyInfo } from "../data/ConsortiaDutyInfo";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { t_s_consortialevelData } from "../../../config/t_s_consortialevel";
import { TempleteManager } from "../../../manager/TempleteManager";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { ConsortiaSkillHelper } from "../../../utils/ConsortiaSkillHelper";
import { ConsortiaUpgradeType } from "../../../constant/ConsortiaUpgradeType";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import Utils from "../../../../core/utils/Utils";
import { MessageTipManager } from "../../../manager/MessageTipManager";

export class ConsortiaSkillTowerWnd extends BaseWindow {
    public cPower: fgui.Controller;
    public frame: fgui.GLabel;
    public list: fgui.GList;
    public txt_page: fgui.GTextField;
    public contributetxt: fgui.GTextField;
    public consortiaWealthTxt: fgui.GTextField;
    public skillIcon: fgui.GButton;
    public txt_name: fgui.GTextField;
    public txt_grade: fgui.GTextField;
    public txt_currDesc: fgui.GTextField;
    public txt_nextDesc: fgui.GTextField;
    public txt_studyLimit0: fgui.GTextField;
    public txt_studyLimit1: fgui.GTextField;
    public txt_price0: fgui.GTextField;
    public studySkillBtn: fgui.GButton;
    public txt_price1: fgui.GTextField;
    public researchSkillBtn: fgui.GButton;

    private _contorller: ConsortiaControler;
    private _model: ConsortiaModel;
    private _skillInfos: ConsortiaTempleteInfo[];
    private _selectedSkillInfo: ConsortiaTempleteInfo;
    private _currSelectedIndex: number = 0;
    //@ts-ignore
    public tipItem1: BaseTipItem;
    //@ts-ignore
    public tipItem2: BaseTipItem;
    //@ts-ignore
    public tipItem3: BaseTipItem;
    //@ts-ignore
    public tipItem4: BaseTipItem;
    public c1: fgui.Controller;
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initData();
        this.initEvent();
        this.initView();
        this.c1.selectedIndex = 0;
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._model = this._contorller.model;
        this.cPower = this.contentPane.getController("cPower");
        this.c1 = this.contentPane.getController("c1");
        this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
        this.tipItem3.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CAIFU);
        this.tipItem4.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CAIFU);
    }

    private initEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.onListItemRender, null, false);
        this.list.on(fgui.Events.CLICK_ITEM, this, this.onListItemClick);
        this.list.on(fgui.Events.SCROLL_END, this, this.updateBagPage);
        this.studySkillBtn.onClick(this, this.onStudySkillBtnClick);
        this.researchSkillBtn.onClick(this, this.onResearchSkillBtnClick);

        this._model.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_SKILL_LIST, this.__onSkillListUpdata, this);
        this._model.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_RIGHTS, this.__onSkillListUpdata, this);
        this._model.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.__onSkillListUpdata, this);
        this.playerInfo.addEventListener(ConsortiaEvent.CONSORTIA_STUDY, this.__onSkillListUpdata, this);
        this.playerInfo.addEventListener(ConsortiaEvent.CONSORTIA_STUDY_UPGRADE, this.__onSkillListUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onContributeUpdata, this);
        this._model.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.__onContributeUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_JIANSE_CHANGE, this.__onContributeUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__onSkillListUpdata, this);
        this.c1.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    }

    private onTabChanged(cc: fgui.Controller) {
        let tabIndex = cc.selectedIndex;
        let arr: ConsortiaTempleteInfo[];
        if (tabIndex == 0) {//基础技能
            arr = this._model.baseSkillList.getList();
            this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
            this.tipItem3.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CAIFU);
            this.tipItem4.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CAIFU);
            this.contributetxt.text = this.playerInfo.consortiaOffer + "";
            this.consortiaWealthTxt.text = this._model.consortiaInfo.offer + "";
        }
        else {//高级技能
            arr = this._model.highSkillList.getList();
            this.tipItem1.setInfo(TemplateIDConstant.GUILD_CONTRIBUTION);
            this.tipItem3.setInfo(TemplateIDConstant.GUILD_CONTRIBUTION);
            this.tipItem2.setInfo(TemplateIDConstant.GUILD_GOODS);
            this.tipItem4.setInfo(TemplateIDConstant.GUILD_GOODS);
            this.contributetxt.text = this.playerInfo.consortiaJianse + "";
            this.consortiaWealthTxt.text = this._model.consortiaInfo.consortiaMaterials + "";
        }
        this._skillInfos = ArrayUtils.sortOn(arr, "type", ArrayConstant.NUMERIC);
        this.list.numItems = this._skillInfos.length;

        this.list.selectedIndex = 0;
        if(this._skillInfos.length >0){
            let childIndex: number = this.list.itemIndexToChildIndex(this.list.selectedIndex);
            this.onListItemClick(this.list.getChildAt(childIndex) as ConsortiaSkillTowerItem, null);
        }
        this.updateBagPage();
    }

    private initView() {
        this._contorller.getShowSkills();
        this._contorller.getShowHighSkills();
        let flag: boolean = this._contorller.getRightsByIndex(ConsortiaDutyInfo.UPDATESKILL);
        if (flag) {
            this.cPower.selectedIndex = 1;
        }
        else {
            this.cPower.selectedIndex = 0;
        }
    }

    public OnShowWind() {
        super.OnShowWind();
        this.__onContributeUpdata();
    }

    private onListItemRender(index: number, item: ConsortiaSkillTowerItem) {
        item.info = this._skillInfos[index];
    }

    private __onSkillListUpdata() {
        if (!this._model) {
            return;
        }
        let arr: ConsortiaTempleteInfo[];
        if (this.c1.selectedIndex == 0) {//基础技能
            arr = this._model.baseSkillList.getList();
        }
        else {//高级技能
            arr = this._model.highSkillList.getList();
        }
        this._skillInfos = ArrayUtils.sortOn(arr, "type", ArrayConstant.NUMERIC);
        this.list.numItems = this._skillInfos.length;
        this.list.selectedIndex = this._currSelectedIndex;
        let childIndex: number = this.list.itemIndexToChildIndex(this.list.selectedIndex);
        this.onListItemClick(this.list.getChildAt(childIndex) as ConsortiaSkillTowerItem, null);
        // this.updateBagPage();
    }

    private updateBagPage() {
        // this.txt_page.text = (this.list.scrollPane.currentPageX + 1) + "/" + Math.max(Math.ceil(this.list.numItems / 8), 1);
    }

    private __onContributeUpdata() {
        if(this.c1.selectedIndex == 0){
            this.contributetxt.text = this.playerInfo.consortiaOffer + "";
            this.consortiaWealthTxt.text = this._model.consortiaInfo.offer + "";
        }else{
            this.contributetxt.text = this.playerInfo.consortiaJianse + "";
            this.consortiaWealthTxt.text = this._model.consortiaInfo.consortiaMaterials + "";
        }
    }

    private __existConsortiaHandler() {
        if (this.playerInfo.consortiaID == 0) {
            this.OnBtnClose();
        }
    }

    /**
     * 学习
     * @private
     */
    private onStudySkillBtnClick() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        this._contorller.consortiaStudy(this._selectedSkillInfo.nextTemplateInfo);
    }

    /**
     * 研究
     * @private
     */
    private onResearchSkillBtnClick() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        if(this.c1.selectedIndex == 0){
            if (this._selectedSkillInfo.nextTemplateInfo.NeedOffer > this._model.consortiaInfo.offer) {
                ConsortiaSkillHelper.addWealth();
                return;
            }
            this._contorller.consortiaUpgrade(this._selectedSkillInfo.nextTemplateInfo);
        }else{
            if (this._selectedSkillInfo.nextTemplateInfo.NeedOffer > this._model.consortiaInfo.consortiaMaterials) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaSkillTowerWnd.researchSkillBtn.tips"));
                return;
            }
            this._contorller.consortiaUpgrade(this._selectedSkillInfo.nextTemplateInfo);
        }
        
    }

    private onListItemClick(item: ConsortiaSkillTowerItem, evt: Laya.Event) {
        this._currSelectedIndex = this.list.selectedIndex;
        this._selectedSkillInfo = item.info;
        this._selectedSkillInfo.addEventListener(ConsortiaEvent.ON_TEMPLETEID_UPDATA, this.__onSkillListUpdata, this);

        this.updateSelectedSkillInfo();
    }

    private updateSelectedSkillInfo() {
        let skillTowerLevel: number = this._model.consortiaInfo.schoolLevel;//技能塔等级
        let consortiaSkillLevel: number;
        let playerSkillLevel: number;
        if(this.c1.selectedIndex == 0){
            consortiaSkillLevel = this._model.consortiaInfo.getLevelByUpgradeType(this._selectedSkillInfo.type);//公会的技能等级
            playerSkillLevel = PlayerManager.Instance.currentPlayerModel.getConsortiaSkillLevel(this._selectedSkillInfo.type);//玩家自身的公会技能等级
            
        }else{//高级公会技能
            consortiaSkillLevel = this._model.consortiaInfo.getHighLevelByUpgradeType(this._selectedSkillInfo.type);//公会的技能等级
            playerSkillLevel = PlayerManager.Instance.currentPlayerModel.getConsortiaHighSkillLevel(this._selectedSkillInfo.type);//玩家自身的公会技能等级
        }
        // Logger.yyz("🀄技能塔等级: ", skillTowerLevel, "    🀄公会的技能等级: ", consortiaSkillLevel, "   🀄玩家自身的公会技能等级: ", playerSkillLevel);

        let currPlayerTemp: t_s_consortialevelData = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(this._selectedSkillInfo.type, playerSkillLevel);//玩家个人的技能等级相关的模板数据
        let nextPlayerTemp: t_s_consortialevelData = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(this._selectedSkillInfo.type, playerSkillLevel + 1);//玩家个人的技能等级相关的模板数据
        let temp = currPlayerTemp ? currPlayerTemp : nextPlayerTemp;
        this.skillIcon.icon = IconFactory.getTecIconByIcon(temp.Icon);
        this.txt_name.text = temp.LevelNameLang;
        this.txt_grade.text = LangManager.Instance.GetTranslation("public.level3", `${playerSkillLevel}/${consortiaSkillLevel}`);
        this.txt_currDesc.text = currPlayerTemp ? currPlayerTemp.DescriptionLang : LangManager.Instance.GetTranslation("public.notHave");
        this.txt_nextDesc.text = nextPlayerTemp ? nextPlayerTemp.DescriptionLang : LangManager.Instance.GetTranslation("Consortia.SkillTower.ReachMaxLevel");

        //学习条件
        if (!nextPlayerTemp) {
            this.txt_studyLimit0.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.skill.ConsortiaSkillItem.tip.title2");
        }
        else {
            this.txt_studyLimit0.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.skill.ConsortiaSkillItem.tips");
        }
        if (consortiaSkillLevel <= playerSkillLevel || !nextPlayerTemp) {
            this.studySkillBtn.enabled = false;
            this.txt_studyLimit0.color = "#FE2E2C";
        }
        else {
            this.studySkillBtn.enabled = true;
            this.txt_studyLimit0.color = "#FFC68F";
        }
        //研究条件
        let nextTemplateInfo 
        let levelTemp: t_s_consortialevelData;
        if(this.c1.selectedIndex == 0){
            levelTemp = TempleteManager.Instance.getConsortiaTempleteById(this._selectedSkillInfo.nextTemplateInfo.PreTemplateId)
            if (consortiaSkillLevel >= ConsortiaUpgradeType.MAX_LEVEL) {
                this.txt_studyLimit1.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.skill.ConsortiaSkillItem.tip.title2");
            }
            else {
                this.txt_studyLimit1.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.skill.ConsortiaResearchSkillItem.limitTxtTip", levelTemp.Levels);
            }
            if (skillTowerLevel < levelTemp.Levels || consortiaSkillLevel >= ConsortiaUpgradeType.MAX_LEVEL) {
                this.researchSkillBtn.enabled = false;
                this.txt_studyLimit1.color = "#FE2E2C";
            }
            else {
                this.researchSkillBtn.enabled = true;
                this.txt_studyLimit1.color = "#FFC68F";
            }
            this.txt_price0.text = nextPlayerTemp ? nextPlayerTemp.Property2.toString() : "---";
        }else if(this.c1.selectedIndex == 1){
            nextTemplateInfo = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(this._selectedSkillInfo.type, consortiaSkillLevel + 1);
            if(nextTemplateInfo){
                levelTemp = TempleteManager.Instance.getConsortiaTempleteById(nextTemplateInfo.PreTemplateId);
            }
            if (!nextTemplateInfo) {
                this.txt_studyLimit1.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.skill.ConsortiaSkillItem.tip.title2");
            }
            else {
                this.txt_studyLimit1.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.skill.ConsortiaResearchSkillItem.limitTxtTip", levelTemp.Levels);
            }
            if ((levelTemp && skillTowerLevel < levelTemp.Levels) || !nextTemplateInfo) {
                this.researchSkillBtn.enabled = false;
                this.txt_studyLimit1.color = "#FE2E2C";
            }
            else {
                this.researchSkillBtn.enabled = true;
                this.txt_studyLimit1.color = "#FFC68F";
            }
            this.txt_price0.text = nextPlayerTemp ? nextPlayerTemp.Property1.toString() : "---";
        }
        
        let nextConsortiaTemp: t_s_consortialevelData = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(this._selectedSkillInfo.type, consortiaSkillLevel + 1);//公会的技能等级相关的模板数据
        this.txt_price1.text = nextConsortiaTemp ? nextConsortiaTemp.NeedOffer.toString() : "---";
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private removeEvent() {
        Utils.clearGListHandle(this.list);
        this.list.off(fgui.Events.CLICK_ITEM, this, this.onListItemClick);
        this.list.off(fgui.Events.SCROLL_END, this, this.updateBagPage);
        this.studySkillBtn.offClick(this, this.onStudySkillBtnClick);
        this.researchSkillBtn.offClick(this, this.onResearchSkillBtnClick);

        this._model.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_SKILL_LIST, this.__onSkillListUpdata, this);
        this._model.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_RIGHTS, this.__onSkillListUpdata, this);
        this._model.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.__onSkillListUpdata, this);
        this.playerInfo.removeEventListener(ConsortiaEvent.CONSORTIA_STUDY, this.__onSkillListUpdata, this);
        this.playerInfo.removeEventListener(ConsortiaEvent.CONSORTIA_STUDY_UPGRADE, this.__onSkillListUpdata, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onContributeUpdata, this);
        this._model.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.__onContributeUpdata, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_JIANSE_CHANGE, this.__onContributeUpdata, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__onSkillListUpdata, this);
        this._selectedSkillInfo && this._selectedSkillInfo.removeEventListener(ConsortiaEvent.ON_TEMPLETEID_UPDATA, this.__onSkillListUpdata, this);
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._contorller = null;
        this._model = null;
        this._skillInfos = null;
        this._selectedSkillInfo = null;

        super.dispose(dispose);
    }
}