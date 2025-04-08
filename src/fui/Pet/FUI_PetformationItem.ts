// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetformationItem extends fgui.GComponent {

	public isBattle:fgui.Controller;
	public isIndex:fgui.Controller;
	public petIcon:fgui.GLoader;
	public numTxt:fgui.GTextField;
	public static URL:string = "ui://t0l2fizvhp9virt";

	public static createInstance():FUI_PetformationItem {
		return <FUI_PetformationItem>(fgui.UIPackage.createObject("Pet", "PetformationItem"));
	}

	protected onConstruct():void {
		this.isBattle = this.getController("isBattle");
		this.isIndex = this.getController("isIndex");
		this.petIcon = <fgui.GLoader>(this.getChild("petIcon"));
		this.numTxt = <fgui.GTextField>(this.getChild("numTxt"));
	}
}