// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetHeadSelectView extends fgui.GComponent {

	public bg:fgui.GImage;
	public petList:fgui.GList;
	public static URL:string = "ui://dq4xsyl36mxo1f";

	public static createInstance():FUI_RemotePetHeadSelectView {
		return <FUI_RemotePetHeadSelectView>(fgui.UIPackage.createObject("RemotePet", "RemotePetHeadSelectView"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.petList = <fgui.GList>(this.getChild("petList"));
	}
}