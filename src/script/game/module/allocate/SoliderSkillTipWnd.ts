// @ts-nocheck
import Resolution from '../../../core/comps/Resolution';
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { t_s_skilltemplateData } from '../../config/t_s_skilltemplate';
import { t_s_specialtemplateData } from '../../config/t_s_specialtemplate';
import { ArmyPawn } from '../../datas/ArmyPawn';
import { SkillInfo } from '../../datas/SkillInfo';
export default class SoliderSkillTipWnd extends BaseWindow {
	private nameTxt1: fgui.GLabel;
	private nameTxt2: fgui.GLabel;
	private nameTxt3: fgui.GLabel;
	private param: any;
	public ap: ArmyPawn;
	private type: number;
	public OnInitWind() {
		this.param = this.params;
		this.setPositon();
	}

	private setPositon() {
		if (this.param.posX + 380 > Resolution.gameWidth) {
			this.x = Resolution.gameWidth - 295;
		}
		else {
			this.x = this.param.posX + 85;
		}
		if (this.param.posY + 250 > Resolution.gameHeight) {
			this.y = Resolution.gameHeight - 150;
		}
		else {
			this.y = this.param.posY + 85;
		}
	}

	OnShowWind() {
		super.OnShowWind();
		this.initData();
	}

	private initData() {
		if (this.param.pawnData instanceof t_s_skilltemplateData) {
			var skillData: t_s_skilltemplateData = this.param.pawnData;
			this.nameTxt1.text = skillData.SkillTemplateName;
			this.nameTxt2.text = this.getSkillType(skillData);
			this.nameTxt3.text = skillData.SkillDescription;
		}
		else if (this.param.pawnData instanceof t_s_specialtemplateData) {
			var specialData: t_s_specialtemplateData = this.param.pawnData;
			this.nameTxt1.text = specialData.TemplateNameLang + " " +LangManager.Instance.GetTranslation("public.level4_space2", specialData.Grades);
			this.nameTxt2.text = "";
			this.nameTxt3.text = specialData.DescriptionLang;
		}
		this.nameTxt2.visible = this.nameTxt2.text != "";
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

	OnHideWind() {
		super.OnHideWind();
	}

	dispose() {
		super.dispose();
	}

}