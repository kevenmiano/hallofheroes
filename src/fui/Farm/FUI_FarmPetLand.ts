/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BtnFarmOpt from "./FUI_BtnFarmOpt";

export default class FUI_FarmPetLand extends fgui.GButton {

	public cState:fgui.Controller;
	public petCon:fgui.GComponent;
	public btnCancel:fgui.GButton;
	public txtPetName:fgui.GTextField;
	public txtCownDown:fgui.GTextField;
	public gCownDown:fgui.GGroup;
	public btnOpt:FUI_BtnFarmOpt;
	public static URL:string = "ui://rcqiz171pkchht7";

	public static createInstance():FUI_FarmPetLand {
		return <FUI_FarmPetLand>(fgui.UIPackage.createObject("Farm", "FarmPetLand"));
	}

	protected onConstruct():void {
		this.cState = this.getController("cState");
		this.petCon = <fgui.GComponent>(this.getChild("petCon"));
		this.btnCancel = <fgui.GButton>(this.getChild("btnCancel"));
		this.txtPetName = <fgui.GTextField>(this.getChild("txtPetName"));
		this.txtCownDown = <fgui.GTextField>(this.getChild("txtCownDown"));
		this.gCownDown = <fgui.GGroup>(this.getChild("gCownDown"));
		this.btnOpt = <FUI_BtnFarmOpt>(this.getChild("btnOpt"));
	}
}