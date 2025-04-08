/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SystemMsgCell extends fgui.GComponent {

	public channelImg:fgui.GLoader;
	public message:fgui.GRichTextField;
	public static URL:string = "ui://5w3rpk77v66n3t";

	public static createInstance():FUI_SystemMsgCell {
		return <FUI_SystemMsgCell>(fgui.UIPackage.createObject("Chat", "SystemMsgCell"));
	}

	protected onConstruct():void {
		this.channelImg = <fgui.GLoader>(this.getChild("channelImg"));
		this.message = <fgui.GRichTextField>(this.getChild("message"));
	}
}