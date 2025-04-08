// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FastSkillItem extends fgui.GComponent {

	public indexTxt:fgui.GTextField;
	public selectFlag:fgui.GImage;
	public selectBorder:fgui.GImage;
	public static URL:string = "ui://v98hah2obwl5p";

	public static createInstance():FUI_FastSkillItem {
		return <FUI_FastSkillItem>(fgui.UIPackage.createObject("Skill", "FastSkillItem"));
	}

	protected onConstruct():void {
		this.indexTxt = <fgui.GTextField>(this.getChild("indexTxt"));
		this.selectFlag = <fgui.GImage>(this.getChild("selectFlag"));
		this.selectBorder = <fgui.GImage>(this.getChild("selectBorder"));
	}
}