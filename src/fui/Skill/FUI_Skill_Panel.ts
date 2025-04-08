/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SkillSimBtn from "./FUI_SkillSimBtn";
import FUI_MasterySkillPanel from "./FUI_MasterySkillPanel";

export default class FUI_Skill_Panel extends fgui.GComponent {

	public isOversea:fgui.Controller;
	public masterySkill:fgui.Controller;
	public duobleSkilBgl:fgui.GImage;
	public skillIines:fgui.GGroup;
	public skillLan:fgui.GRichTextField;
	public skillSimBtn1:FUI_SkillSimBtn;
	public skillSimBtn2:FUI_SkillSimBtn;
	public fastskillList:fgui.GList;
	public skillList:fgui.GList;
	public btn_set:fgui.GButton;
	public tipTxt:fgui.GTextField;
	public masterySkillPanel:FUI_MasterySkillPanel;
	public joyTab:fgui.GButton;
	public masteryTab:fgui.GButton;
	public skillGroup:fgui.GGroup;
	public static URL:string = "ui://v98hah2obwl5j";

	public static createInstance():FUI_Skill_Panel {
		return <FUI_Skill_Panel>(fgui.UIPackage.createObject("Skill", "Skill_Panel"));
	}

	protected onConstruct():void {
		this.isOversea = this.getController("isOversea");
		this.masterySkill = this.getController("masterySkill");
		this.duobleSkilBgl = <fgui.GImage>(this.getChild("duobleSkilBgl"));
		this.skillIines = <fgui.GGroup>(this.getChild("skillIines"));
		this.skillLan = <fgui.GRichTextField>(this.getChild("skillLan"));
		this.skillSimBtn1 = <FUI_SkillSimBtn>(this.getChild("skillSimBtn1"));
		this.skillSimBtn2 = <FUI_SkillSimBtn>(this.getChild("skillSimBtn2"));
		this.fastskillList = <fgui.GList>(this.getChild("fastskillList"));
		this.skillList = <fgui.GList>(this.getChild("skillList"));
		this.btn_set = <fgui.GButton>(this.getChild("btn_set"));
		this.tipTxt = <fgui.GTextField>(this.getChild("tipTxt"));
		this.masterySkillPanel = <FUI_MasterySkillPanel>(this.getChild("masterySkillPanel"));
		this.joyTab = <fgui.GButton>(this.getChild("joyTab"));
		this.masteryTab = <fgui.GButton>(this.getChild("masteryTab"));
		this.skillGroup = <fgui.GGroup>(this.getChild("skillGroup"));
	}
}