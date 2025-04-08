// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SkillBalance extends fgui.GComponent {

	public c1:fgui.Controller;
	public skillRestTips:fgui.GTextField;
	public skillPoint:fgui.GTextField;
	public skillResetBtn:fgui.GButton;
	public img_icon0:fgui.GImage;
	public txt_gold:fgui.GTextField;
	public static URL:string = "ui://v98hah2ovvezim9";

	public static createInstance():FUI_SkillBalance {
		return <FUI_SkillBalance>(fgui.UIPackage.createObject("Skill", "SkillBalance"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.skillRestTips = <fgui.GTextField>(this.getChild("skillRestTips"));
		this.skillPoint = <fgui.GTextField>(this.getChild("skillPoint"));
		this.skillResetBtn = <fgui.GButton>(this.getChild("skillResetBtn"));
		this.img_icon0 = <fgui.GImage>(this.getChild("img_icon0"));
		this.txt_gold = <fgui.GTextField>(this.getChild("txt_gold"));
	}
}