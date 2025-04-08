/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ChatOerateBtn extends fgui.GComponent {

	public btn:fgui.GButton;
	public static URL:string = "ui://5w3rpk779l1zpb";

	public static createInstance():FUI_ChatOerateBtn {
		return <FUI_ChatOerateBtn>(fgui.UIPackage.createObject("Chat", "ChatOerateBtn"));
	}

	protected onConstruct():void {
		this.btn = <fgui.GButton>(this.getChild("btn"));
	}
}