/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GeniusItem extends fgui.GButton {

	public upgrade:fgui.Controller;
	public study:fgui.Controller;
	public bg:fgui.GImage;
	public itemIcon:fgui.GLoader;
	public selectBorder:fgui.GImage;
	public img_mask:fgui.GImage;
	public textbg:fgui.GImage;
	public level:fgui.GTextField;
	public levelGroup:fgui.GGroup;
	public static URL:string = "ui://v98hah2ov0imr7";

	public static createInstance():FUI_GeniusItem {
		return <FUI_GeniusItem>(fgui.UIPackage.createObject("Skill", "GeniusItem"));
	}

	protected onConstruct():void {
		this.upgrade = this.getController("upgrade");
		this.study = this.getController("study");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.itemIcon = <fgui.GLoader>(this.getChild("itemIcon"));
		this.selectBorder = <fgui.GImage>(this.getChild("selectBorder"));
		this.img_mask = <fgui.GImage>(this.getChild("img_mask"));
		this.textbg = <fgui.GImage>(this.getChild("textbg"));
		this.level = <fgui.GTextField>(this.getChild("level"));
		this.levelGroup = <fgui.GGroup>(this.getChild("levelGroup"));
	}
}