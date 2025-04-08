// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_EditPetItem extends fgui.GComponent {

	public cSelected:fgui.Controller;
	public cSelectBgType:fgui.Controller;
	public cLevel:fgui.Controller;
	public cState:fgui.Controller;
	public imgSelected1:fgui.GImage;
	public item:fgui.GButton;
	public imgSelected2:fgui.GImage;
	public imgStarBg:fgui.GImage;
	public imgEnterWar:fgui.GImage;
	public list:fgui.GList;
	public txtLevel:fgui.GTextField;
	public txtPractice:fgui.GTextField;
	public static URL:string = "ui://tujwwvswjckkiad";

	public static createInstance():FUI_EditPetItem {
		return <FUI_EditPetItem>(fgui.UIPackage.createObject("SkillEdit", "EditPetItem"));
	}

	protected onConstruct():void {
		this.cSelected = this.getController("cSelected");
		this.cSelectBgType = this.getController("cSelectBgType");
		this.cLevel = this.getController("cLevel");
		this.cState = this.getController("cState");
		this.imgSelected1 = <fgui.GImage>(this.getChild("imgSelected1"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this.imgSelected2 = <fgui.GImage>(this.getChild("imgSelected2"));
		this.imgStarBg = <fgui.GImage>(this.getChild("imgStarBg"));
		this.imgEnterWar = <fgui.GImage>(this.getChild("imgEnterWar"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.txtLevel = <fgui.GTextField>(this.getChild("txtLevel"));
		this.txtPractice = <fgui.GTextField>(this.getChild("txtPractice"));
	}
}