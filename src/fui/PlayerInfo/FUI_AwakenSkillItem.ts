// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AwakenSkillItem extends fgui.GButton {

	public cSkillType:fgui.Controller;
	public imgBg:fgui.GImage;
	public imgP:fgui.GImage;
	public list:fgui.GList;
	public txtIndex:fgui.GTextField;
	public gFastKey:fgui.GGroup;
	public gPassive:fgui.GGroup;
	public static URL:string = "ui://i5djjunl54n6iad";

	public static createInstance():FUI_AwakenSkillItem {
		return <FUI_AwakenSkillItem>(fgui.UIPackage.createObject("PlayerInfo", "AwakenSkillItem"));
	}

	protected onConstruct():void {
		this.cSkillType = this.getController("cSkillType");
		this.imgBg = <fgui.GImage>(this.getChild("imgBg"));
		this.imgP = <fgui.GImage>(this.getChild("imgP"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.txtIndex = <fgui.GTextField>(this.getChild("txtIndex"));
		this.gFastKey = <fgui.GGroup>(this.getChild("gFastKey"));
		this.gPassive = <fgui.GGroup>(this.getChild("gPassive"));
	}
}