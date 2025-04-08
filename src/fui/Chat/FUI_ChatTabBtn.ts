/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ChatTabBtn extends fgui.GButton {

	public tab_normal:fgui.GImage;
	public tab_select:fgui.GImage;
	public select_arrow:fgui.GImage;
	public titleDefault:fgui.GTextField;
	public titleSelect:fgui.GTextField;
	public redPoint:fgui.GImage;
	public static URL:string = "ui://5w3rpk77v66nt";

	public static createInstance():FUI_ChatTabBtn {
		return <FUI_ChatTabBtn>(fgui.UIPackage.createObject("Chat", "ChatTabBtn"));
	}

	protected onConstruct():void {
		this.tab_normal = <fgui.GImage>(this.getChild("tab_normal"));
		this.tab_select = <fgui.GImage>(this.getChild("tab_select"));
		this.select_arrow = <fgui.GImage>(this.getChild("select_arrow"));
		this.titleDefault = <fgui.GTextField>(this.getChild("titleDefault"));
		this.titleSelect = <fgui.GTextField>(this.getChild("titleSelect"));
		this.redPoint = <fgui.GImage>(this.getChild("redPoint"));
	}
}