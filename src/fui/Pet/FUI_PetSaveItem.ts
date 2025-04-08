// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetSaveItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public mbg:fgui.GImage;
	public selImg:fgui.GImage;
	public item:fgui.GButton;
	public imgFlag:fgui.GImage;
	public txt_petname:fgui.GTextField;
	public txt_petsword:fgui.GTextField;
	public static URL:string = "ui://t0l2fizvduixiri";

	public static createInstance():FUI_PetSaveItem {
		return <FUI_PetSaveItem>(fgui.UIPackage.createObject("Pet", "PetSaveItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.mbg = <fgui.GImage>(this.getChild("mbg"));
		this.selImg = <fgui.GImage>(this.getChild("selImg"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this.imgFlag = <fgui.GImage>(this.getChild("imgFlag"));
		this.txt_petname = <fgui.GTextField>(this.getChild("txt_petname"));
		this.txt_petsword = <fgui.GTextField>(this.getChild("txt_petsword"));
	}
}