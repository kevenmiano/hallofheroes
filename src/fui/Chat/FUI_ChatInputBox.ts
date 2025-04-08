/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ChatInputBox extends fgui.GComponent {

	public inputmsg:fgui.GComponent;
	public static URL:string = "ui://5w3rpk77v66nx";

	public static createInstance():FUI_ChatInputBox {
		return <FUI_ChatInputBox>(fgui.UIPackage.createObject("Chat", "ChatInputBox"));
	}

	protected onConstruct():void {
		this.inputmsg = <fgui.GComponent>(this.getChild("inputmsg"));
	}
}