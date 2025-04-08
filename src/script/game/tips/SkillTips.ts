import BaseWindow from "../../core/ui/Base/BaseWindow";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import LangManager from '../../core/lang/LangManager';
import StringUtils from "../utils/StringUtils";
import { SkillInfo } from '../datas/SkillInfo';
import { TempleteManager } from "../manager/TempleteManager";
import { ArmyManager } from "../manager/ArmyManager";
import { PlayerManager } from "../manager/PlayerManager";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import BaseTips from "./BaseTips";

/**
 * 技能提示
 */
export default class SkillTips extends BaseTips {

    public txt_name: fgui.GTextField;
    public txt_useLevel: fgui.GTextField;

    public txt_gp: fgui.GRichTextField;
    public txt_cd: fgui.GRichTextField;

    public txt_fis: fgui.GTextField;
    public txt_dis: fgui.GTextField;

    public txt_defSkill: fgui.GTextField;

    private tipData: any;
    private extData: any;

    private _petTypeList: Array<number> = [101, 102, 103, 104, 105, 106, 107];
    private _petTypeNameList: Array<string> = [];

    public OnInitWind() {
        super.OnInitWind();
        this.tipData = this.params[0];
        this.extData = this.params[2];
        this.setTipsData();
        this.autoSize = true;
    }

    protected onClickEvent() {
        this.onInitClick();
    }

    setTipsData() {
        if (!this.tipData) return;
        var mType: number = 0;
        var isPetSkill: boolean = false;
        if (this.tipData instanceof SkillInfo) {
            var condition: Array<string> = [];
            var str: string = "";
            var txt: string = "";
            var info: SkillInfo = this.tipData as SkillInfo;
            var nextTemp: t_s_skilltemplateData = info.nextTemplateInfo;
            this.txt_dis.text = this.getSkillType(info.templateInfo);
            mType = info.templateInfo.MasterType;
            isPetSkill = (this._petTypeList.indexOf(mType) >= 0);
            if (isPetSkill && this._petTypeNameList[mType - 101]) {
                this.txt_fis.text = this._petTypeNameList[mType - 101];
            } else {
                this.txt_fis.text = "";
            }
            
            this.txt_useLevel.text = LangManager.Instance.GetTranslation("public.level3", this.tipData.grade);
            if (info.grade == 0) {
                this.txt_name.text = nextTemp.SkillTemplateName;

                if (nextTemp.CoolDown > 0) {
                    this.txt_cd.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(nextTemp.CoolDown * 0.001));
                } else if (isPetSkill) {//如果是英灵技能, 此处空一行以显示英灵类型
                    this.txt_cd.text = "";
                }
                if (Number(nextTemp.Cost) < 0) {
                    var num: number = Math.abs(Number(nextTemp.Cost));
                    this.txt_gp.text = this.getCostString(isPetSkill, num);
                }
                let effectDes: string = StringUtils.stringFormat2(nextTemp.SkillDescription, { key: "Parameter1", value: nextTemp.Parameter1 }, { key: "Parameter2", value: nextTemp.Parameter2 }, { key: "Parameter3", value: nextTemp.Parameter3 })
                this.txt_defSkill.text = effectDes;
               
                // condition = info.checkUpgradeCondition(nextTemp)
                // if (condition.length > 0) {
                //     _need.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.need");
                // }
                // for (const key in condition) {
                //     if (Object.prototype.hasOwnProperty.call(condition, key)) {
                //         let str = condition[key];
                //         _condition1.text = str;
                //     }
                // }
            } else if (nextTemp) {
                txt = LangManager.Instance.GetTranslation("buildings.casern.view.RecruitPawnCell.command06", info.templateInfo.Grades);
                this.txt_name.text = info.templateInfo.SkillTemplateName;

                if (info.templateInfo.CoolDown > 0) {
                    this.txt_cd.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(info.templateInfo.CoolDown * 0.001));
                }
                if (Number(info.templateInfo.Cost) < 0) {
                    num = Math.abs(Number(info.templateInfo.Cost));
                    this.txt_gp.text = this.getCostString(isPetSkill, num);
                }
                // _nextGrade.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.nextGrade");
                txt = LangManager.Instance.GetTranslation("buildings.casern.view.RecruitPawnCell.command06", nextTemp.Grades);
                this.txt_name.text = nextTemp.SkillTemplateName + " " + txt + "</font>";

                if (nextTemp.CoolDown > 0) {
                    this.txt_cd.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(nextTemp.CoolDown * 0.001));
                }
                if (Number(nextTemp.Cost) < 0) {
                    this.txt_gp.text = this.getCostString(isPetSkill, nextTemp.Cost);
                }
                let nextEffectDes: string = StringUtils.stringFormat2(nextTemp.SkillDescription, { key: "Parameter1", value: nextTemp.Parameter1 }, { key: "Parameter2", value: nextTemp.Parameter2 }, { key: "Parameter3", value: nextTemp.Parameter3 })
                this.txt_defSkill.text = nextEffectDes;

                condition = info.checkUpgradeCondition(nextTemp)
                // if (condition.length > 0) {
                //     _need.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.need");
                // }
                // for (const key in condition) {
                //     if (Object.prototype.hasOwnProperty.call(condition, key)) {
                //         let str = condition[key];
                //         _condition1.text = str;
                //     }
                // }
            } else {
                txt = LangManager.Instance.GetTranslation("buildings.casern.view.RecruitPawnCell.command06", info.templateInfo.Grades);
                this.txt_name.text = info.templateInfo.SkillTemplateName;

                if (info.templateInfo.CoolDown > 0) {
                    this.txt_cd.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(info.templateInfo.CoolDown * 0.001));

                }
                if (Number(info.templateInfo.Cost) < 0) {
                    this.txt_gp.text = this.getCostString(isPetSkill, Number(info.templateInfo.Cost));
                }
                let effectDes: string = StringUtils.stringFormat2(info.templateInfo.SkillDescription, { key: "Parameter1", value: info.templateInfo.Parameter1 }, { key: "Parameter2", value: info.templateInfo.Parameter2 }, { key: "Parameter3", value: info.templateInfo.Parameter3 })
                this.txt_defSkill.text = effectDes;
                // _nextGrade.text = LangManager.Instance.GetTranslation("buildings.BaseBuildFrame.maxGrade");
            }
        } else if (this.tipData instanceof t_s_skilltemplateData) {
            var temp: t_s_skilltemplateData = this.tipData as t_s_skilltemplateData;
            mType = temp.MasterType;
            isPetSkill = (this._petTypeList.indexOf(mType) >= 0);
            if (isPetSkill && this._petTypeNameList[mType - 101]) {
                this.txt_fis.text = this._petTypeNameList[mType - 101];
            } else {
                this.txt_fis.text = "";
            }
            if (temp.Grades > 0 && !isPetSkill)
                this.txt_useLevel.text = LangManager.Instance.GetTranslation("public.level3", temp.Grades);
            else
                this.txt_useLevel.text = "";
            txt = LangManager.Instance.GetTranslation("buildings.casern.view.RecruitPawnCell.command06", temp.Grades);
            this.txt_name.text = temp.SkillTemplateName;

            this.txt_dis.text = this.getSkillType(temp);
            if (temp.CoolDown > 0) {
                this.txt_cd.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(temp.CoolDown * 0.001));
            } else if (isPetSkill) {//如果是英灵技能, 此处空一行以显示英灵类型
                this.txt_cd.text = "";
            }
            if (Number(temp.Cost) < 0) {
                this.txt_gp.text = this.getCostString(isPetSkill, Number(temp.Cost));
            } else {
                this.txt_gp.text = "";
            }
            let effectDes: string = StringUtils.stringFormat2(temp.SkillDescription, { key: "Parameter1", value: temp.Parameter1 }, { key: "Parameter2", value: temp.Parameter2 }, { key: "Parameter3", value: temp.Parameter3 })
            this.txt_defSkill.text = effectDes;
        }

        if (this.extData && this.extData["notShowLevel"]) {
            this.txt_useLevel.text = "";
        }
    }

    public getCostString(isPetSkill: boolean, num: number): string {
        var str: string = "";
        num = Math.abs(num);
        if (isPetSkill) {
            //英灵技能觉醒值消耗
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown03", num);
        } else {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown02", num);
        }
        return str;
    }

    private checkCondition(needTemp: t_s_skilltemplateData) {
        var arr: Array<string> = this.thane.skillCate.skillScript.split(",");
        for (const key in arr) {
            if (Object.prototype.hasOwnProperty.call(arr, key)) {
                var id: number = Number(arr[key]);
                var temp: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(id);
                if (temp && needTemp.SonType == temp.SonType && needTemp.Grades <= temp.Grades) {
                    // _condition1.setFrame(1);
                    return;
                }
            }
        }
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }
    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private getSkillType(temp: t_s_skilltemplateData): string {
        if (temp.UseWay == 2) return "[" + LangManager.Instance.GetTranslation("yishi.datas.templates.SkillTempInfo.UseWay02") + "]";
        switch (temp.AcceptObject) {
            case 1:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type01");
                break;
            case 2:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type02");
                break;
            case 3:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type03");
                break;
            case 4:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type04");
                break;
            case 5:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type05");
                break;
            case 6:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type06");
                break;
            case 7:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type07");
                break;
            case 8:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type08");
                break;
            case 9:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type09");
                break;
            case 10:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type10");
                break;
            case 11:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type11");
                break;
            case 12:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type12");
                break;
            case 13:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type13");
                break;
            case 14:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type14");
                break;
            case 15:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type15");
                break;
            case 16:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type16");
                break;
            case 17:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type17");
                break;
            case 18:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type18");
                break;
            case 19:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type19");
                break;
            case 20:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type20");
                break;
            case 21:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type21");
                break;
        }
        return "";
    }


}