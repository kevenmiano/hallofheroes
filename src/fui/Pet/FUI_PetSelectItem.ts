// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetSelectItem extends fgui.GComponent {

	public petSelect:fgui.Controller;
	public petitem:fgui.GComponent;
	public txt_petname:fgui.GTextField;
	public txt_petsword:fgui.GTextField;
	public btn_putin:fgui.GButton;
	public btn_takeout:fgui.GButton;
	public btn_discontent:fgui.GButton;
	public static URL:string = "ui://t0l2fizvnn34ilv";

	public static createInstance():FUI_PetSelectItem {
		return <FUI_PetSelectItem>(fgui.UIPackage.createObject("Pet", "PetSelectItem"));
	}

	protected onConstruct():void {
		this.petSelect = this.getController("petSelect");
		this.petitem = <fgui.GComponent>(this.getChild("petitem"));
		this.txt_petname = <fgui.GTextField>(this.getChild("txt_petname"));
		this.txt_petsword = <fgui.GTextField>(this.getChild("txt_petsword"));
		this.btn_putin = <fgui.GButton>(this.getChild("btn_putin"));
		this.btn_takeout = <fgui.GButton>(this.getChild("btn_takeout"));
		this.btn_discontent = <fgui.GButton>(this.getChild("btn_discontent"));
	}
}