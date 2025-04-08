import FUI_SkillBalance from "../../../../../fui/Skill/FUI_SkillBalance";
import LangManager from "../../../../core/lang/LangManager";
import { FormularySets } from "../../../../core/utils/FormularySets";
import StringHelper from "../../../../core/utils/StringHelper";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { ResourceEvent, SkillEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { BagHelper } from "../../bag/utils/BagHelper";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import GeniusPanel from "../content/GeniusPanel";
import SkillWnd from "../SkillWnd";
import SkillWndCtrl from "../SkillWndCtrl";

export class SkillPointBalance extends FUI_SkillBalance {

    private openGrade: number = 25;

    onConstruct() {
        super.onConstruct();
    }

    initView() {
        this.addEvent();
        this.updateResetBtn(true);
        this.updateView();
        this.updateGold();
        // 策划要求删除2024-03-26
        // this.skillRestTips.text = LangManager.Instance.GetTranslation('armyII.viewII.skill.describe', this.openGrade);
        // this.skillRestTips.visible = this.thane.grades < this.openGrade;
    }

    private addEvent() {
        this.skillResetBtn.onClick(this, this._onRestSkill);
        NotificationManager.Instance.addEventListener(SkillEvent.RESET_SKILL_STATE, this.updateResetBtn, this)
        NotificationManager.Instance.addEventListener(SkillEvent.UPDATE_SKILL_POINT, this.updateView, this)
        NotificationManager.Instance.addEventListener(SkillEvent.SWITCH_MASTERY, this.onMastery, this)
        ResourceManager.Instance.gold.addEventListener(ResourceEvent.RESOURCE_UPDATE, this.updateGold, this);
    }

    private removeEvent() {
        this.skillResetBtn.offClick(this, this._onRestSkill);
        NotificationManager.Instance.removeEventListener(SkillEvent.RESET_SKILL_STATE, this.updateResetBtn, this)
        NotificationManager.Instance.removeEventListener(SkillEvent.UPDATE_SKILL_POINT, this.updateView, this)
        NotificationManager.Instance.removeEventListener(SkillEvent.SWITCH_MASTERY, this.onMastery, this)
        ResourceManager.Instance.gold.removeEventListener(ResourceEvent.RESOURCE_UPDATE, this.updateGold, this);
    }

    onMastery(index){
        this.c1.selectedIndex = index;
    }

    updateResetBtn(bool) {
        this.skillResetBtn.enabled = bool;
    }

    /**
     *洗点 重置技能点
     * @param e
     */
    _onRestSkill() {
        if (this.thane.grades < this.openGrade) {
            str = LangManager.Instance.GetTranslation("armyII.viewII.skill.content02");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, str, confirm, cancel, this.alertBack.bind(this));
            return;
        }
        let cfgValue = 500;//技能重置条件调整为只消耗黄金
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("skill_reset_gold");
        if (cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        //公式: 固定黄金基数*玩家等级
        cfgValue *= this.thane.grades;
        if (ResourceManager.Instance.gold.count < cfgValue) {
            let str = LangManager.Instance.GetTranslation('public.gold') + cfgValue;
            MessageTipManager.Instance.show(str);
            return;
        }
        var str: string = LangManager.Instance.GetTranslation("armyII.viewII.skill.content01", cfgValue);//是否花费{0}钻石, 重置技能点数
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, { point: cfgValue }, prompt, str, confirm, cancel, this.payCallBack.bind(this));
    }

    private get control(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

    /**普通确认回调 */
    private alertBack(b: boolean, flag: boolean) {
        if (b) {
            this.control.sendWashSkillPoint(0, true);
            let skillPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).skillPanel;
            if (skillPanel) {
                skillPanel.resetSetting();
            }
        }
    }


    /**支付确认回调 */
    private payCallBack(b: boolean, flag: boolean = false, id: number = 0, type: number = 0) {
        if (b) {
            this.control.sendWashSkillPoint(type, flag);
            let skillPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).skillPanel;
            if (skillPanel) {
                skillPanel.resetSetting();
            }
        }
    }

    updateView(isSetting: boolean = false) {
        //当前可使用的技能点数/获得的技能点数（额外技能点数）
        let total = BagHelper.Instance.calcSkillPoint(0, this.thane.grades);
        let extra = this.thane.skillCate.extraSkillPoint;
        let canuse = this.thane.skillCate.skillPoint;
        let str = extra > 0 ? +canuse + '/' + total + '(+' + extra + ')' : canuse + '/' + total;
        this.skillPoint.text = LangManager.Instance.GetTranslation("SkillPanel.skillPointTxt") + str;
        if (!isSetting) {
            this.skillResetBtn.enabled = !StringHelper.isNullOrEmpty(this.thane.skillCate.skillScript);
        }
    }

    private updateGold(){
        this.txt_gold.text = FormularySets.toStringSelf(ResourceManager.Instance.gold.count,GeniusPanel.STEP);
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    onHide() {
        this.removeEvent();
    }
    dispose(): void {
        super.dispose();
    }
}