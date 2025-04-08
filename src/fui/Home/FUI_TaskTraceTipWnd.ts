/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TaskTraceTipWnd extends fgui.GButton {

	public iconState:fgui.Controller;
	public iconBox:fgui.GImage;
	public warnIcon:fgui.GLoader;
	public warnContent:fgui.GRichTextField;
	public closeBtn:fgui.GButton;
	public operationBtn:fgui.GButton;
	public static URL:string = "ui://tny43dz1cgr4hqd";

	public static createInstance():FUI_TaskTraceTipWnd {
		return <FUI_TaskTraceTipWnd>(fgui.UIPackage.createObject("Home", "TaskTraceTipWnd"));
	}

	protected onConstruct():void {
		this.iconState = this.getController("iconState");
		this.iconBox = <fgui.GImage>(this.getChild("iconBox"));
		this.warnIcon = <fgui.GLoader>(this.getChild("warnIcon"));
		this.warnContent = <fgui.GRichTextField>(this.getChild("warnContent"));
		this.closeBtn = <fgui.GButton>(this.getChild("closeBtn"));
		this.operationBtn = <fgui.GButton>(this.getChild("operationBtn"));
	}
}