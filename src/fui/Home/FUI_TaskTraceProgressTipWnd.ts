/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TaskTraceProgressTipWnd extends fgui.GButton {

	public iconState:fgui.Controller;
	public iconBox:fgui.GImage;
	public warnIcon:fgui.GLoader;
	public warnContent:fgui.GComponent;
	public closeBtn:fgui.GButton;
	public operationBtn:fgui.GButton;
	public txtCountdown:fgui.GTextField;
	public stepper:fgui.GComponent;
	public static URL:string = "ui://tny43dz1gp16ipu";

	public static createInstance():FUI_TaskTraceProgressTipWnd {
		return <FUI_TaskTraceProgressTipWnd>(fgui.UIPackage.createObject("Home", "TaskTraceProgressTipWnd"));
	}

	protected onConstruct():void {
		this.iconState = this.getController("iconState");
		this.iconBox = <fgui.GImage>(this.getChild("iconBox"));
		this.warnIcon = <fgui.GLoader>(this.getChild("warnIcon"));
		this.warnContent = <fgui.GComponent>(this.getChild("warnContent"));
		this.closeBtn = <fgui.GButton>(this.getChild("closeBtn"));
		this.operationBtn = <fgui.GButton>(this.getChild("operationBtn"));
		this.txtCountdown = <fgui.GTextField>(this.getChild("txtCountdown"));
		this.stepper = <fgui.GComponent>(this.getChild("stepper"));
	}
}