// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIManager from '../../../core/ui/UIManager';
import GTabIndex from '../../constant/GTabIndex';
import { EmWindow } from '../../constant/UIDefine';
import { ArmyManager } from '../../manager/ArmyManager';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { TempleteManager } from '../../manager/TempleteManager';
import GeniusPanel from './content/GeniusPanel';
import RunesPanel from './content/RunesPanel';
import SkillPanel from './content/SkillPanel';
import { UIFilter } from '../../../core/ui/UIFilter';
import { PlayerManager } from '../../manager/PlayerManager';
import ComponentSetting from '../../utils/ComponentSetting';
import { BagHelper } from '../bag/utils/BagHelper';
import { NotificationManager } from '../../manager/NotificationManager';
import { RuneEvent, SkillEvent, TalentEvent } from '../../constant/event/NotificationEvent';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { SkillPointBalance } from './item/SkillPointBalance';
import { RuneBalance } from './item/RuneBalance';
import { TalentBalance } from './item/TalentBalance';
import { RuneHoldPanel } from './runeHold/RuneHoldPanel';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import SkillWndCtrl from './SkillWndCtrl';
import SkillWndData from './SkillWndData';
import { HoleBalance } from './item/HoleBalance';
import OpenGrades from '../../constant/OpenGrades';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { SkillInfo } from '../../datas/SkillInfo';
import FUIHelper from '../../utils/FUIHelper';
/**
* @author:pzlricky
* @data: 2021-02-20 11:10
* @description *** 
*/
export default class SkillWnd extends BaseWindow {
    protected setSceneVisibleOpen: boolean = true
    protected resizeContent: boolean = true;
    public setOptimize = false;
    private frame: fgui.GComponent;
    public skillPanel: SkillPanel = null;//技能面板
    public runesPanel: RunesPanel = null;//符文面板
    public geniusPanel: GeniusPanel = null;//天赋面板
    public runeHoldCom: RuneHoldPanel;//符孔面板

    public talent_balance: TalentBalance;
    public skill_point: SkillPointBalance;
    public rune_balance: RuneBalance;
    public hole_balance: HoleBalance;

    private tabGroupText: string[] = [];
    private tabGroup: fgui.GButton[] = [];


    private _fuWenOpenLevel: number = 0;

    c1: fairygui.Controller;

    public static page_JN = 0;
    public static page_FW = 1;
    public static page_TF = 2;
    public static page_FK = 3;

    /**界面初始化 */
    public OnInitWind() {
        super.OnInitWind();
        Logger.info('SkillWnd OnInit!!!');
        this.tabGroupText = [
            LangManager.Instance.GetTranslation("armyII.SkillFrame.title"),
            LangManager.Instance.GetTranslation("armyII.SkillFrame.runeTitle"),
            LangManager.Instance.GetTranslation("armyII.SkillFrame.runeHole"),
            LangManager.Instance.GetTranslation("armyII.SkillFrame.talentTitle"),
        ];
        this.tabGroup = [this["tabMenu_1"], this["tabMenu_2"], this["tabMenu_3"], this["tabMenu_4"]];
        this.c1 = this.contentPane.getController('c1');

        this.skillPanel.onConStructor();
        this.runesPanel.onConStructor();
        this.geniusPanel.onConStructor();


        for (let index = 0; index < this.tabGroup.length; index++) {
            let btnItem = this.tabGroup[index];
            btnItem.text = this.tabGroupText[index];
        }

        this.c1.on(fgui.Events.STATE_CHANGED, this, this.onTabChange)


        PlayerManager.Instance.currentPlayerModel.setFightingCapacityRecord("start");
        this._fuWenOpenLevel = Number(TempleteManager.Instance.getConfigInfoByConfigName("OpenRuneGrade").ConfigValue);
        this._updateBtnFilter();
        this._updateBtnRuneHole();
        this._updateBtnGenius();
        NotificationManager.Instance.addEventListener(RuneEvent.ACTIVE_RUNEGEM, this.onActiveGem, this);
        this.__updateRuneReddot();
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.RUNE_GEM_ENERGY, this.__updateRuneReddot, this);
        NotificationManager.Instance.addEventListener(SkillEvent.SKILL_UPGRADE, this.__skillChangeHandler, this);
        NotificationManager.Instance.addEventListener(SkillEvent.SKILL_RESET, this.__skillChangeHandler, this);
        NotificationManager.Instance.addEventListener(RuneEvent.RUNE_UPGRADE, this.__runeRefreshHandler, this);
        NotificationManager.Instance.addEventListener(TalentEvent.TALENT_UPGRADE, this.talenChangeHanler, this);
        NotificationManager.Instance.addEventListener(TalentEvent.TALENT_RESET, this.onResetTalent, this);
        this.rune_balance.initView();
        this.skill_point.initView();
        this.talent_balance.initView();
        this.hole_balance.initView();
        this.controler.reqRuneHoldInfo();
        this["tabMenu_1"].getChild('redDot').icon = FUIHelper.getItemURL("Base", "Lab_Arrow_Better");
        this["tabMenu_4"].getChild('redDot').icon = FUIHelper.getItemURL("Base", "Lab_Arrow_Better");
        this["tabMenu_1"].getChild('redDot').x -= 12;
        this["tabMenu_2"].getChild('redDot').x -= 12;
        this["tabMenu_3"].getChild('redDot').x -= 12;
        this["tabMenu_4"].getChild('redDot').x -= 12;
        this.checkSkillReddot();
        this.checkRuneReddot();
        this.checkTalentReddot();
        if (this.frameData && this.frameData.tabIndex) {
            let tabIndex = this.frameData.tabIndex;
            let converTabIndex = [GTabIndex.Skill_JN, GTabIndex.Skill_FW, GTabIndex.Skill_TF, GTabIndex.Skill_FK].indexOf(tabIndex);
            this.c1.selectedIndex = converTabIndex;
        }
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private checkTalentReddot() {
        let talentPoint = this.thane.talentData.talentPoint
        this.setBtnState(this["tabMenu_4"], talentPoint > 0 || this.thane.talentData.checkUpgrade())
    }

    private checkSkillReddot() {
        let skillPoint = this.thane.skillCate.skillPoint;
        let extrajobReddot = false;
        if (ArmyManager.Instance.thane.grades > OpenGrades.MASTERY) {
            extrajobReddot = this.thane.skillCate.checkExtrajobRedDot();
            this.skillPanel.getChild('masteryTab').asCom.getChild('redDot').visible = extrajobReddot;
        }
        this.setBtnState(this["tabMenu_1"], skillPoint > 0 || extrajobReddot)
    }

    private checkRuneReddot() {
        this.setBtnState(this["tabMenu_2"], this.thane.runeCate.hasActiveRune());
    }

    /**
     * 动画过程中静止点击
     * @param boo 
     */
    enableOperate(boo) {
        this["tabMenu_1"].touchable = this["tabMenu_2"].touchable = this["tabMenu_4"].touchable = boo;
        this.contentPane.getChild('frame').touchable = boo
    }

    showMask(boo) {
        // this.contentPane.getChild('maskCom').visible = boo;
    }


    onActiveGem() {
        this["tabMenu_4"].visible = true;
    }

    /** */
    private _updateBtnFilter() {
        if (ArmyManager.Instance.thane.grades < this._fuWenOpenLevel) {
            this.tabGroup[1].filters = [UIFilter.grayFilter];
        } else {
            this.tabGroup[1].filters = [];
        }
        if(ArmyManager.Instance.thane.grades < OpenGrades.RUNE_OPEN){
            this.tabGroup[2].filters = [UIFilter.grayFilter];
        }else{
            this.tabGroup[2].filters = [];
        }
        if (ArmyManager.Instance.thane.grades < OpenGrades.TALENT) {
            this.tabGroup[3].filters = [UIFilter.grayFilter];
        } else {
            this.tabGroup[3].filters = [];
        }
    }

    /**
     * 符孔开关
     */
    private _updateBtnRuneHole() {
        this["tabMenu_3"].visible = ComponentSetting.RUNE_HOLE;
    }

    /**
     * 天赋开关
     */
    private _updateBtnGenius() {
        this["tabMenu_4"].visible = ComponentSetting.GENIUS;
    }

    private onTabChange() {
        let changeToTabIndex = this.c1.selectedIndex;
        if (this.__interruptCallback(changeToTabIndex)) {
            this.c1.setSelectedIndex(this.c1.previsousIndex);
            return;
        }

        this.setSelectTab(changeToTabIndex);
    }

    private _elementIndex: number = -1;
    private __interruptCallback(changeToTabIndex: number): boolean {
        this._elementIndex = -1;
        switch (changeToTabIndex) {
            case SkillWnd.page_FW:
                if (ArmyManager.Instance.thane.grades < this._fuWenOpenLevel) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("armyII.SkillFrame.AlertMsg", this._fuWenOpenLevel));
                    return true;
                }
                this.checkEditTalent()
                if (this.checkEditSill()) {
                    this._elementIndex = changeToTabIndex;
                    return true;
                }
                return false
            case SkillWnd.page_TF:
                var limitGrade: number = 50;
                if (ArmyManager.Instance.thane.grades < limitGrade) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("armyII.SkillFrame.AlertMsg", limitGrade));
                    return true;
                }
                this.checkEditTalent()
                if (this.checkEditRune()) {
                    this._elementIndex = changeToTabIndex;
                    return true;
                }
                if (this.checkEditSill()) {
                    this._elementIndex = changeToTabIndex;
                    return true;
                }

                return false
            case SkillWnd.page_JN:
                this.checkEditTalent()
                if (this.checkEditRune()) {
                    this._elementIndex = changeToTabIndex;
                    return true;
                }
                return false;
            case SkillWnd.page_FK:
                if (ArmyManager.Instance.thane.grades < OpenGrades.RUNE_OPEN) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("armyII.SkillFrame.AlertMsg", OpenGrades.RUNE_OPEN));
                    return true;
                }
                this.checkEditTalent()
                if (this.checkEditRune()) {
                    this._elementIndex = changeToTabIndex;
                    return true;
                }
            default:
                return false;
        }
    }

    private checkEditRune(): boolean {
        if (this.runesPanel && this.runesPanel.checkIsSetting()) {
            let content = LangManager.Instance.GetTranslation('rune.editSave');
            var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.saveBack1.bind(this));
            return true;
        }
        return false;
    }

    private checkEditSill(): boolean {
        //技能编制状态点击其他页签或退出技能系统将弹出二次确认窗口: 是否保存当前技能配置
        if (this.skillPanel && this.skillPanel.checkIsSetting()) {
            let content = LangManager.Instance.GetTranslation('skill.editSave');
            var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.saveBack.bind(this));

            return true;
        }
        return false;
    }

    private checkEditTalent() {
        if (this.geniusPanel.checkIsSetting()) {
            this.geniusPanel.cancel();
        }

    }


    /**普通确认回调 */
    private saveBack(b: boolean, flag: boolean) {
        if (b) {
            this.skillPanel.onSet();
        } else {
            this.skillPanel.cancel();
        }
        // this._tabbar.selectIndex(this._elementIndex / 10 - 1);
        this.c1.selectedIndex = this._elementIndex;
    }
    /**普通确认回调 */
    private saveBack1(b: boolean, flag: boolean) {
        if (b) {
            this.runesPanel.onSet();
        } else {
            this.runesPanel.cancel();
        }
        // this._tabbar.selectIndex(this._elementIndex / 10 - 1);
        this.c1.selectedIndex = this._elementIndex;

    }


    helpBtnClick() {
        let title = '';
        let content = '';
        switch (this.c1.selectedIndex) {
            case SkillWnd.page_JN://技能
                title = LangManager.Instance.GetTranslation("armyII.SkillFrame.HelpBtn.Tipdata");
                if (this.skillPanel.isJobSkill) {
                    content = LangManager.Instance.GetTranslation("armyII.SkillHelpFrame.helpContent");
                } else {
                    title = LangManager.Instance.GetTranslation("Skill.masterySkillHelpTitle");
                    content = LangManager.Instance.GetTranslation("Skill.masterySkillHelp");
                }
                break;
            case SkillWnd.page_FW://符文
                title = LangManager.Instance.GetTranslation("armyII.SkillFrame.HelpBtn.RuneTipdata");
                content = LangManager.Instance.GetTranslation("armyII.RuneHelpFrame.helpContent");
                break;
            case SkillWnd.page_TF://天赋
                title = LangManager.Instance.GetTranslation("armyII.SkillFrame.HelpBtn.TalentTipdata");
                content = LangManager.Instance.GetTranslation("armyII.TalentHelpFrame.helpContent");
                break;
            case SkillWnd.page_FK:
                title = LangManager.Instance.GetTranslation("armyII.SkillFrame.HelpBtn.RuneHoleTipdata");
                content = LangManager.Instance.GetTranslation("armyII.RuneHelpFrame.runeHoleContent");
                break;
        }
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private onResetTalent() {
        if (this.geniusPanel) {
            this.geniusPanel.onReset();
        }
        this.checkTalentReddot();
    }

    private talenChangeHanler(info: SkillInfo) {
        if (this.geniusPanel) {
            this.geniusPanel.talenChangeHanler(info);
        }
        this.checkTalentReddot();
    }
    private __skillChangeHandler() {
        if (this.skillPanel) {
            this.skillPanel.__skillChangeHandler();
        }
        this.checkSkillReddot();
    }

    private __runeRefreshHandler(evt) {
        if (this.runesPanel) {
            this.runesPanel.__runeRefreshHandler(evt);
        }
        this.checkRuneReddot();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
    }

    /**关闭界面 */
    OnHideWind() {
        NotificationManager.Instance.removeEventListener(RuneEvent.RUNE_UPGRADE, this.__runeRefreshHandler, this);
        NotificationManager.Instance.removeEventListener(SkillEvent.SKILL_UPGRADE, this.__skillChangeHandler, this);
        NotificationManager.Instance.removeEventListener(SkillEvent.SKILL_RESET, this.__skillChangeHandler, this);
        NotificationManager.Instance.removeEventListener(TalentEvent.TALENT_UPGRADE, this.talenChangeHanler, this);
        NotificationManager.Instance.removeEventListener(TalentEvent.TALENT_RESET, this.onResetTalent, this);
        NotificationManager.Instance.removeEventListener(RuneEvent.ACTIVE_RUNEGEM, this.onActiveGem, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.RUNE_GEM_ENERGY, this.__updateRuneReddot, this);
        if (this.rune_balance) this.rune_balance.onHide();
        if (this.skill_point) this.skill_point.onHide();
        if (this.skillPanel) {
            if (this.skillPanel.checkIsSetting()) {
                this.skillPanel.cancel();
            }
        }
        if (this.runesPanel) {
            if (this.runesPanel.checkIsSetting()) {
                this.runesPanel.cancel();
            }
            this.runesPanel.dispose();
        }
        if (this.geniusPanel) {
            if (this.geniusPanel.checkIsSetting()) {
                this.geniusPanel.cancel();
            }
            this.geniusPanel.dispose();
        }

        this.runeHoldCom.dispose();

        this.skillPanel = null;
        this.runesPanel = null;
        this.geniusPanel = null;
        PlayerManager.Instance.currentPlayerModel.setFightingCapacityRecord("start");
        UIManager.Instance.HideWind(EmWindow.RuneGemWnd);
        super.OnHideWind();
    }

    /**选中某个Tab(0,1,2) */
    setSelectTab(tabIndex: number = 0) {
        let title = '';

        let runeGemWnd = UIManager.Instance.FindWind(EmWindow.RuneGemWnd);
        if (runeGemWnd) {
            runeGemWnd.visible = false;
        }

        switch (tabIndex) {
            case SkillWnd.page_JN://技能
                title = LangManager.Instance.GetTranslation("armyII.SkillFrame.title");
                break;
            case SkillWnd.page_FW://符文
                title = LangManager.Instance.GetTranslation("armyII.SkillFrame.runeTitle");
                BagHelper.OPEN_RUNE_BAG_TYPE = -1;
                break;
            case SkillWnd.page_TF://天赋
                title = LangManager.Instance.GetTranslation("armyII.SkillFrame.talentTitle");
                break;

            case SkillWnd.page_FK:
                title = LangManager.Instance.GetTranslation("armyII.SkillFrame.runeHole");
                this.runeHoldCom.init();
                break;
        }
        this.frame.getChild('title').text = title;
    }

    /**
     * 更新红点展示
     */
    __updateRuneReddot() {
        //符孔按钮
        if (this["tabMenu_3"].visible) {
            let state = PlayerManager.Instance.currentPlayerModel.playerInfo.runePowerPoint >= 100 && ArmyManager.Instance.thane.grades >= OpenGrades.RUNE_OPEN;
            //是否已开启符文
            this.setBtnState(this["tabMenu_3"], state);
        }
    }

    /**
     * 设置Tab按钮红点状态
     * @param tabIndex Tab索引
     * @param redPointState 是否展示红点
     */
    private setBtnState(btn: fgui.GComponent, redPointState: boolean, count: number = 0) {
        let btnView = btn;
        if (btnView) {
            let view = btnView;
            let dot = view.getChild('redDot');
            let redDotLabel = view.getChild('redDotLabel');
            if (count > 0 && redPointState) {
                dot.visible = false;
                redDotLabel.visible = true;
                redDotLabel.text = count.toString();
            }
            else {
                dot.visible = redPointState ? true : false;
                redDotLabel.visible = false;
                redDotLabel.text = "";
            }
        }
    }

    public get controler(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }
    public get model(): SkillWndData {
        return this.controler.data as SkillWndData;
    }

}