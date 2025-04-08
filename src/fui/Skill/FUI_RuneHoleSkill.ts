// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneHoleSkill extends fgui.GComponent {

	public lockedTxt:fgui.GTextField;
	public skillName:fgui.GTextField;
	public lockedValue:fgui.GRichTextField;
	public skillDesc:fgui.GTextField;
	public skillIcon:fgui.GLoader;
	public profile:fgui.GLoader;
	public skillGroup:fgui.GGroup;
	public static URL:string = "ui://v98hah2oo4iwipp";

	public static createInstance():FUI_RuneHoleSkill {
		return <FUI_RuneHoleSkill>(fgui.UIPackage.createObject("Skill", "RuneHoleSkill"));
	}

	protected onConstruct():void {
		this.lockedTxt = <fgui.GTextField>(this.getChild("lockedTxt"));
		this.skillName = <fgui.GTextField>(this.getChild("skillName"));
		this.lockedValue = <fgui.GRichTextField>(this.getChild("lockedValue"));
		this.skillDesc = <fgui.GTextField>(this.getChild("skillDesc"));
		this.skillIcon = <fgui.GLoader>(this.getChild("skillIcon"));
		this.profile = <fgui.GLoader>(this.getChild("profile"));
		this.skillGroup = <fgui.GGroup>(this.getChild("skillGroup"));
	}
}