/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_EditTalentItem extends fgui.GButton {

	public upgrade:fgui.Controller;
	public itemIcon:fgui.GLoader;
	public selectBorder:fgui.GImage;
	public imgMask:fgui.GImage;
	public txt_posIdx:fgui.GTextField;
	public static URL:string = "ui://tujwwvswpqgurb";

	public static createInstance():FUI_EditTalentItem {
		return <FUI_EditTalentItem>(fgui.UIPackage.createObject("SkillEdit", "EditTalentItem"));
	}

	protected onConstruct():void {
		this.upgrade = this.getController("upgrade");
		this.itemIcon = <fgui.GLoader>(this.getChild("itemIcon"));
		this.selectBorder = <fgui.GImage>(this.getChild("selectBorder"));
		this.imgMask = <fgui.GImage>(this.getChild("imgMask"));
		this.txt_posIdx = <fgui.GTextField>(this.getChild("txt_posIdx"));
	}
}