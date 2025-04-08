// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SecretEventOptCom from "./FUI_SecretEventOptCom";

export default class FUI_SecretEventCom extends fgui.GComponent {

	public cFigureTitle:fgui.Controller;
	public txtTitle:fgui.GTextField;
	public gTitle:fgui.GGroup;
	public item1:FUI_SecretEventOptCom;
	public item2:FUI_SecretEventOptCom;
	public item3:FUI_SecretEventOptCom;
	public txtFigureTitle:fgui.GTextField;
	public imgHead:fgui.GLoader;
	public gFigureTitle:fgui.GGroup;
	public static URL:string = "ui://7g1ccuufvtoeg";

	public static createInstance():FUI_SecretEventCom {
		return <FUI_SecretEventCom>(fgui.UIPackage.createObject("PveSecretScene", "SecretEventCom"));
	}

	protected onConstruct():void {
		this.cFigureTitle = this.getController("cFigureTitle");
		this.txtTitle = <fgui.GTextField>(this.getChild("txtTitle"));
		this.gTitle = <fgui.GGroup>(this.getChild("gTitle"));
		this.item1 = <FUI_SecretEventOptCom>(this.getChild("item1"));
		this.item2 = <FUI_SecretEventOptCom>(this.getChild("item2"));
		this.item3 = <FUI_SecretEventOptCom>(this.getChild("item3"));
		this.txtFigureTitle = <fgui.GTextField>(this.getChild("txtFigureTitle"));
		this.imgHead = <fgui.GLoader>(this.getChild("imgHead"));
		this.gFigureTitle = <fgui.GGroup>(this.getChild("gFigureTitle"));
	}
}