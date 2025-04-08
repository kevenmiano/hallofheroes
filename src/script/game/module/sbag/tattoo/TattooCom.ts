import FUI_TattooCom from "../../../../../fui/SBag/FUI_TattooCom";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ArmyEvent } from "../../../constant/event/NotificationEvent";
import { RoleCtrl } from "../../bag/control/RoleCtrl";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { TattooHole } from "./model/TattooHole";
import { TattooHoleView } from "./TattooHoleView";
import UIManager from "../../../../core/ui/UIManager";
import { TattooModel } from "./model/TattooModel";
import LangManager from "../../../../core/lang/LangManager";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import StringUtils from "../../../utils/StringUtils";
import { ArmyManager } from "../../../manager/ArmyManager";
import { TattooReinforceWnd } from "./TattooReinforceWnd";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/1/9 10:21
 * @ver 1.0
 */

export class TattooCom extends FUI_TattooCom {
    private holes: TattooHoleView[];

    constructor() {
        super();
    }

    public initView() {
        this.addEvent();

        this.displayObject.drawCallOptimize = false;
        this.tipsmask_0.width = StageReferance.stageWidth;
        this.tipsmask_0.height = StageReferance.stageHeight;
        this.tipsmask_1.width = StageReferance.stageWidth;
        this.tipsmask_1.height = StageReferance.stageHeight;

        let ctrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
        let holesData: TattooHole[] = ctrl.tattooModel.holes;
        if (!holesData) {
            holesData = [];
        }

        this.holes = [];
        for (let i: number = 0; i < 8; i++) {
            let hole: TattooHoleView = this["icon_tattoo_" + i] as TattooHoleView;
            hole.index = i;
            hole.on(Laya.Event.CLICK, this, this.holeClickHandle, [i]);
            this.holes.push(hole);
        }
        this.showHoleTips.selectedIndex = 0;
        this.showCoreTips.selectedIndex = 0;
        this.showLockTips.selectedIndex = 0;
    }

    private addEvent() {
        this.btn_help.onClick(this, this.onBtnHelpClick);
        this.icon_core.onClick(this, this.onIconCoreClick);
        this.tipsmask_0.onClick(this, this.onMaskClick, [0]);
        this.tipsmask_1.onClick(this, this.onMaskClick, [1]);
        this.tipsmask_2.onClick(this, this.onMaskClick, [2]);
        this.tipsmask_3.onClick(this, this.onMaskClick, [3]);
        this.icon_small_0.onClick(this, this.onIconSmall, [0]);
        this.icon_small_1.onClick(this, this.onIconSmall, [1]);
        this.icon_small_2.onClick(this, this.onIconSmall, [2]);
        this.icon_small_3.onClick(this, this.onIconSmall, [3]);
        this.icon_small_4.onClick(this, this.onIconSmall, [4]);
        NotificationManager.Instance.addEventListener(ArmyEvent.TATTOO_INFO, this.updateTattooInfo, this);
    }

    private onIconCoreClick() {
        let currLv: number = ArmyManager.Instance.thane.grades;
        let nextLv: number = this.tattooModel.getGradeByStep(this.tattooModel.coreStep);
        let limitNum: number = this.tattooModel.getTotalLimitTattooNum();
        let openedNum: number = this.tattooModel.getOpenNumByLevel(nextLv);
        if (limitNum >= openedNum && currLv >= nextLv) {
            this.tattooController.sendUpdateCore();
        }
        else {
            this.showCoreTips.selectedIndex = 1;
        }
    }

    private onMaskClick(index: number) {
        if (index == 0) {
            this.showHoleTips.selectedIndex = 0;
        }
        else if (index == 1) {
            this.showCoreTips.selectedIndex = 0;
        }
        else if (index == 2) {
            this.showLockTips.selectedIndex = 0;
        }
        else if (index == 3) {
            this.showTattooTips.selectedIndex = 0;
        }
    }

    private onIconSmall(index: number) {
        this.showTattooTips.selectedIndex = 1;
        this.txt_name_tips.text = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName" + (index + 1)) + " " + LangManager.Instance.GetTranslation("tattoo.frame.titleText");
        this.l_tattooName.x = this["icon_small_" + index].x + 26;
    }

    private holeClickHandle(index: number, e: Laya.Event) {
        let clickHole: TattooHole = this.tattooModel.holes[index];
        if (clickHole.isLock) {
            this.showLockTips.selectedIndex = 1;

            // let id:number = index + 1;
            let id: number = this.tattooModel.getOpenedNum() + 1;
            let openLv: number = 55 + 5 * (id - 3);
            //角色等级达到{lv=80}级开放第{index=8}个龙纹槽
            this.txt_lock_tips.setVar("lv", openLv.toString())
                .setVar("index", id.toString()).flushVars();
        }
        else {
            this.tattooModel.currHoleIndex = index;
            UIManager.Instance.ShowWind(EmWindow.TattooReinforceWnd);
        }
    }

    public refresh(): void {
        let holesData: TattooHole[] = this.tattooModel.holes;
        if (!holesData) {
            holesData = [];
        }
        //更新龙纹槽和火焰特效
        for (let i: number = 0; i < 8; i++) {
            // this.holes[i].refresh();
            this.holes[i].setHoleInfo(1, holesData[i]);
            // (this["effect_tattoo_" + i] as fgui.GLoader).url = "";
            // if(i < holesData.length)
            // {
            //     if(holesData[i].oldAddProperty > -1)
            //     {
            //         if(holesData[i].oldStep <= 8)
            //         {
            //             (this["effect_tattoo_" + i] as fgui.GLoader).url = fgui.UIPackage.getItemURL(EmWindow.SBag, "effect_tattoo_" + i);
            //         }
            //         else
            //         {
            //             (this["effect_tattoo_" + i] as fgui.GLoader).url = fgui.UIPackage.getItemURL(EmWindow.SBag, "effect_tattoo_" + i + i);
            //         }
            //     }
            // }
        }
        this.updateTips();
        this.updateTotalNum();
        this.updateCore();

    }

    private updateTips(): void {
        let addStrength: number = 0;
        let addAgility: number = 0;
        let addIntelligence: number = 0;
        let addCaptain: number = 0;
        let addPhysique: number = 0;
        let ctrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
        let holesData: TattooHole[] = ctrl.tattooModel.holes;
        if (!holesData) {
            holesData = [];
            return;
        }
        for (let i: number = 0; i < holesData.length; i++) {
            let hole: TattooHole = holesData[i] as TattooHole;
            switch (hole.oldAddProperty) {
                case 1:
                    {
                        addStrength += hole.oldAddingValue;
                        break;
                    }
                case 2:
                    {
                        addAgility += hole.oldAddingValue;
                        break;
                    }
                case 3:
                    {
                        addIntelligence += hole.oldAddingValue;
                        break;
                    }
                case 4:
                    {
                        addPhysique += hole.oldAddingValue;
                        break;
                    }
                case 5:
                    {
                        addCaptain += hole.oldAddingValue;
                        break;
                    }
            }
            switch (hole.oldReduceProperty) {
                case 1:
                    {
                        addStrength += hole.oldReduceValue;
                        break;
                    }
                case 2:
                    {
                        addAgility += hole.oldReduceValue;
                        break;
                    }
                case 3:
                    {
                        addIntelligence += hole.oldReduceValue;
                        break;
                    }
                case 4:
                    {
                        addPhysique += hole.oldReduceValue;
                        break;
                    }
                case 5:
                    {
                        addCaptain += hole.oldReduceValue;
                        break;
                    }
            }
        }
        let targetArr: any[] = this.tattooModel.holeInfoIIs;
        let addStrengthPrecentStr: string = "";
        if (this.tattooModel.getImprintTotalCountByProperity(0, targetArr) > 0) {
            let addStrengthPrecent: number = this.tattooModel.getImprintTotalCountByProperity(0, targetArr) * addStrength / 100;
            if (addStrength > 0) {
                addStrengthPrecentStr = "<font color='#59cd41'>+" + addStrengthPrecent + "</font>";
            }
            else {
                addStrengthPrecentStr = "<font color='#fa0600'>" + addStrengthPrecent + "</font>";
            }
        }
        let addAgilityPrecentStr: string = "";
        if (this.tattooModel.getImprintTotalCountByProperity(1, targetArr) > 0) {
            let addAgilityPrecent: number = this.tattooModel.getImprintTotalCountByProperity(1, targetArr) * addAgility / 100;
            if (addAgility > 0) {
                addAgilityPrecentStr = "<font color='#59cd41'>+" + addAgilityPrecent + "</font>";
            }
            else {
                addAgilityPrecentStr = "<font color='#fa0600'>" + addAgilityPrecent + "</font>";
            }
        }
        let addIntelligencePrecentStr: string = "";
        if (this.tattooModel.getImprintTotalCountByProperity(2, targetArr) > 0) {
            let addIntelligencePrecent: number = this.tattooModel.getImprintTotalCountByProperity(2, targetArr) * addIntelligence / 100;
            if (addIntelligence > 0) {
                addIntelligencePrecentStr = "<font color='#59cd41'>+" + addIntelligencePrecent + "</font>";
            }
            else {
                addIntelligencePrecentStr = "<font color='#fa0600'>" + addIntelligencePrecent + "</font>";
            }
        }
        let addCaptainPrecentStr: string = "";
        if (this.tattooModel.getImprintTotalCountByProperity(3, targetArr) > 0) {
            let addCaptainPrecent: number = this.tattooModel.getImprintTotalCountByProperity(3, targetArr) * addCaptain / 100;
            if (addCaptain > 0) {
                addCaptainPrecentStr = "<font color='#59cd41'>+" + addCaptainPrecent + "</font>";
            }
            else {
                addCaptainPrecentStr = "<font color='#fa0600'>" + addCaptainPrecent + "</font>";
            }
        }
        let addPhysiquePrecentStr: string = "";
        if (this.tattooModel.getImprintTotalCountByProperity(5, targetArr) > 0) {
            let addPhysiquePrecent: number = this.tattooModel.getImprintTotalCountByProperity(5, targetArr) * addPhysique / 100;
            if (addPhysique > 0) {
                addPhysiquePrecentStr = "<font color='#59cd41'>+" + addPhysiquePrecent + "</font>";
            }
            else {
                addPhysiquePrecentStr = "<font color='#fa0600'>" + addPhysiquePrecent + "</font>";
            }
        }
        let tipStr: string = "";
        if (addStrength > 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName1") + " +" + addStrength + "  " + addStrengthPrecentStr + "\n";
        }
        else if (addStrength < 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName1") + "  " + addStrength + "  " + addStrengthPrecentStr + "\n";
        }
        if (addAgility > 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName2") + " +" + addAgility + "  " + addAgilityPrecentStr + "\n";
        }
        else if (addAgility < 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName2") + "  " + addAgility + "  " + addAgilityPrecentStr + "\n";
        }
        if (addIntelligence > 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName3") + "  " + " +" + addIntelligence + "  " + addIntelligencePrecentStr + "\n";
        }
        else if (addIntelligence < 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName3") + "  " + addIntelligence + "  " + addIntelligencePrecentStr + "\n";
        }

        if (addPhysique > 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName4") + " +" + addPhysique + "  " + addPhysiquePrecentStr + "\n";
        }
        else if (addPhysique < 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName4") + "  " + addPhysique + "  " + addPhysiquePrecentStr + "\n";
        }

        if (addCaptain > 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName5") + " +" + addCaptain + "  " + addCaptainPrecentStr + "\n";
        }
        else if (addCaptain < 0) {
            tipStr += LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName5") + "  " + addCaptain + "  " + addCaptainPrecentStr + "\n";
        }

        if (tipStr == "") {
            this.txt_tips.text = LangManager.Instance.GetTranslation("AppellPowerTip.noneProps");
        }
        else {
            this.txt_tips.text = tipStr;
        }
    }

    private updateCore() {
        this.step.selectedIndex = this.tattooModel.coreStep - 1;
        this.icon_core.url = fgui.UIPackage.getItemURL(EmWindow.SBag, "Icon_Tattoo_Core" + Math.ceil(this.tattooModel.coreStep / 2));
        //{step=Ⅰ}阶龙纹核心
        this.txt_tips_core_name.setVar("step", StringUtils.getRomanNumber(this.tattooModel.coreStep)).flushVars();
        //当前龙纹阶级上限: [color=#ffecc6]{lv=1}阶[/color]
        // 属性上限: [color=#ffecc6]{value=1000}[/color]
        this.txt_tips_core_0.setVar("lv", StringUtils.getRomanNumber(this.tattooModel.coreStep))
            .setVar("value", this.tattooModel.getProtertyValueMaxByStep(this.tattooModel.coreStep).toString()).flushVars();

        let color1: string = "#ffecc6";
        let color2: string = "#ffecc6";
        let currLv: number = ArmyManager.Instance.thane.grades;
        let nextLv: number = this.tattooModel.getGradeByStep(this.tattooModel.coreStep);
        let limitNum: number = this.tattooModel.getTotalLimitTattooNum();
        let openedNum: number = this.tattooModel.getOpenNumByLevel(nextLv);
        if (nextLv > 0) {
            this.maxLevel.selectedIndex = 0;
            //下一阶: 
            // 龙纹阶级上限: [color=#ffecc6]{lv=2}阶[/color]
            // 属性上限: [color=#ffecc6]{value=2000}[/color]
            this.txt_tips_core_1.setVar("lv", StringUtils.getRomanNumber(this.tattooModel.coreStep + 1))
                .setVar("value", this.tattooModel.getProtertyValueMaxByStep(this.tattooModel.coreStep + 1).toString())
                .flushVars();

            //进阶要求: 
            // [color={color1=#ffecc6}]{num3=4}个龙纹达到{lv=1}阶龙纹属性值上
            // 限({num1=3}/{num2=3})[/color]
            // [color={color2=#ffecc6}]角色达到{level=80}级({lv1=60}/{lv2=80})[/color]
            this.txt_tips_core_2.setVar("color1", limitNum >= openedNum ? color1 : color2)
                .setVar("lv", StringUtils.getRomanNumber(this.tattooModel.coreStep))
                .setVar("num3", "" + openedNum)
                .setVar("num1", "" + limitNum)
                .setVar("num2", "" + openedNum)
                .setVar("color2", currLv >= nextLv ? color1 : color2)
                .setVar("level", "" + nextLv)
                .setVar("lv1", "" + currLv)
                .setVar("lv2", "" + nextLv).flushVars();
        }
        else {
            this.maxLevel.selectedIndex = 1;
        }
        this.g_coreInfo.ensureBoundsCorrect();
        this.g_coreTips.ensureBoundsCorrect();

        if (limitNum >= openedNum && currLv >= nextLv) {
            this.canUpgrade.selectedIndex = 0;
        }
        else {
            this.canUpgrade.selectedIndex = 1;
        }

        let nextStep: number = this.tattooModel.coreStep + 1;
        let grade: number = this.tattooModel.getGradeByStep(this.tattooModel.coreStep);
        if (grade > 0) {
            this.txt_condition.text = LangManager.Instance.GetTranslation("tattoo.TattooLevelUp.condition", grade, StringUtils.getRomanNumber(nextStep));
        }
        else {
            this.txt_condition.text = LangManager.Instance.GetTranslation("tattoo.TattooStepUp.limit");
        }
    }

    private updateTattooInfo(type: number) {
        this.refresh();
        if (type == 4) {
            //龙纹核心升阶成功播放特效
            let move: fgui.GMovieClip = fgui.UIPackage.createObject(EmWindow.SBag, "sj").asMovieClip;
            move.setPivot(0.5, 0.5, true);
            move.x = this.icon_core.x;
            move.y = this.icon_core.y;
            this.addChild(move);
            move.setPlaySettings(0, -1, 1, -1, Laya.Handler.create(this, () => {
                move && move.removeFromParent();
            }));
        }
    }

    private updateTotalNum() {
        let propertyTypeNum: number[] = this.tattooModel.calculatePropertyTypeNum();
        for (let i = 0; i < 5; i++) {
            this["txt_num_" + i].text = propertyTypeNum[i] + "/" + this.tattooModel.identicalTattooNum;
        }
    }

    private onBtnHelpClick() {
        let title = LangManager.Instance.GetTranslation("public.help");
        let content = LangManager.Instance.GetTranslation('tattoo.TattooView.helpContent', this.tattooModel.identicalTattooNum);
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private get tattooModel(): TattooModel {
        return this.tattooController.tattooModel;
    }

    private get tattooController(): RoleCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
    }

    private removeEvent() {
        this.btn_help.offClick(this, this.onBtnHelpClick);
        this.icon_core.offClick(this, this.onIconCoreClick);
        this.tipsmask_0.offClick(this, this.onMaskClick);
        this.tipsmask_1.offClick(this, this.onMaskClick);
        this.tipsmask_2.offClick(this, this.onMaskClick);
        this.tipsmask_3.offClick(this, this.onMaskClick);
        this.icon_small_0.offClick(this, this.onIconSmall);
        this.icon_small_1.offClick(this, this.onIconSmall);
        this.icon_small_2.offClick(this, this.onIconSmall);
        this.icon_small_3.offClick(this, this.onIconSmall);
        this.icon_small_4.offClick(this, this.onIconSmall);
        NotificationManager.Instance.removeEventListener(ArmyEvent.TATTOO_INFO, this.updateTattooInfo, this);
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
    }
}