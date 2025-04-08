// @ts-nocheck
import FUI_TalentBalance from "../../../../../fui/Skill/FUI_TalentBalance";
import LangManager from "../../../../core/lang/LangManager";
import { FormularySets } from "../../../../core/utils/FormularySets";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { ResourceEvent, TalentEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ArmySocketOutManager } from "../../../manager/ArmySocketOutManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import GeniusPanel from "../content/GeniusPanel";

export class TalentBalance extends FUI_TalentBalance {

    //@ts-ignore
    public tipItem1:BaseTipItem;
     //@ts-ignore
    public tipItem2:BaseTipItem;
    onConstruct() {
        super.onConstruct();
    }

    public initView(){
        this.addEvent();
        this.updateView();
        this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_EXP);
    }

    private addEvent() {
        this.skillResetBtn.onClick(this, this.__washPoint);
        ResourceManager.Instance.gold.addEventListener(ResourceEvent.RESOURCE_UPDATE, this.updateView, this);
        ArmyManager.Instance.addEventListener(TalentEvent.TALENT_GRADUP_SUCC, this.talenChangeHanler, this);
        NotificationManager.Instance.addEventListener(TalentEvent.TALENT_UPGRADE, this.talenChangeHanler, this);
        ArmyManager.Instance.addEventListener(TalentEvent.UPDATE_TREE, this.talenChangeHanler, this);
        NotificationManager.Instance.addEventListener(TalentEvent.TALENT_RESET, this.updateView, this);
    }

    private removeEvent() {
        this.skillResetBtn.offClick(this, this.__washPoint)
        ResourceManager.Instance.gold.addEventListener(ResourceEvent.RESOURCE_UPDATE, this.updateView, this);
        ArmyManager.Instance.removeEventListener(TalentEvent.TALENT_GRADUP_SUCC, this.talenChangeHanler, this);
        NotificationManager.Instance.removeEventListener(TalentEvent.TALENT_UPGRADE, this.talenChangeHanler, this);
        ArmyManager.Instance.removeEventListener(TalentEvent.UPDATE_TREE, this.talenChangeHanler, this);
        NotificationManager.Instance.removeEventListener(TalentEvent.TALENT_RESET, this.updateView, this);
    }

    private talenChangeHanler(){
        this.updateView();
    }

    protected __washPoint(event: MouseEvent) {
        //armyII.viewII.talent.content04 未进行消耗天赋点时, 应当提示“当前未进行天赋技能升级, 无需重置”, 不需要扣钱
        if(this.thane.talentData.curUsedTalentPoint == 0){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("armyII.viewII.talent.content04"));
            return;
        }
        let cfgValue = 100;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("talent_reset_gold");
        if(cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        cfgValue *= ArmyManager.Instance.thane.talentData.talentGrade;
        var str: string = LangManager.Instance.GetTranslation("armyII.viewII.talent.content03", cfgValue);
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        // let isVIP = VIPManager.Instance.model.vipInfo.IsVipAndNoExpirt;
        // let vipPrivilege: boolean = false;
        // if (isVIP) {
        //     let userVIPGrade = VIPManager.Instance.model.vipInfo.VipGrade;
        //     vipPrivilege = VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.TALENT, userVIPGrade);//是否有特权
        // }
        // if (vipPrivilege) {
        //     str = LangManager.Instance.GetTranslation("armyII.viewII.talent.content02");//该操作将使天赋点数变为初始状态, 是否重置天赋点数？
        //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, { point: cfgValue }, prompt, str, confirm, cancel, this.payCallBack.bind(this));
        // } else {
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, { point: cfgValue }, prompt, str, confirm, cancel, this.payCallBack.bind(this));
        // }
    }

    
    private payCallBack(b: boolean, flag: boolean = false, id: number = 0, type: number = 0) {
        if (b) {
            if (flag)
                ArmySocketOutManager.sendWashSkillPoint(0, 1, true);
            else
                ArmySocketOutManager.sendWashSkillPoint(type, 1, flag);

            this.thane.talentData.curUsedTalentPoint = 0;
        }
    }

    updateView(){
        //天赋点显示: 文本“天赋点: ”+玩家当前可使用的天赋点数/玩家获得的天赋点数量
        let str = this.thane.talentData.talentPoint + '/'+ArmyManager.Instance.thane.talentData.talentGrade
        this.talentPoint.text = LangManager.Instance.GetTranslation("armyII.viewII.talent.TalentView.TalentPoint") + str;
        this.txt_gold.text = FormularySets.toStringSelf(ResourceManager.Instance.gold.count,GeniusPanel.STEP);
        this.txt_exp.text = FormularySets.toStringSelf(this.thane.gp,GeniusPanel.STEP);
        ArmyManager.Instance.thane.skillCate.dispatchEvent(PlayerEvent.THANE_SKILL_POINT);
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }
    
    onHide(){
        this.removeEvent();
    }

    dispose(): void {
        super.dispose();
    }
}