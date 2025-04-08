// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SealSkill extends fgui.GComponent {

	public upgrade:fgui.Controller;
	public select:fgui.Controller;
	public itemIcon:fgui.GLoader;
	public img_mask:fgui.GImage;
	public textbg:fgui.GImage;
	public level:fgui.GTextField;
	public levelGroup:fgui.GGroup;
	public static URL:string = "ui://v98hah2of7eoim0";

	public static createInstance():FUI_SealSkill {
		return <FUI_SealSkill>(fgui.UIPackage.createObject("Skill", "SealSkill"));
	}

	protected onConstruct():void {
		this.upgrade = this.getController("upgrade");
		this.select = this.getController("select");
		this.itemIcon = <fgui.GLoader>(this.getChild("itemIcon"));
		this.img_mask = <fgui.GImage>(this.getChild("img_mask"));
		this.textbg = <fgui.GImage>(this.getChild("textbg"));
		this.level = <fgui.GTextField>(this.getChild("level"));
		this.levelGroup = <fgui.GGroup>(this.getChild("levelGroup"));
	}
}