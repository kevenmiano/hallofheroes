/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SinglePassBtnItem extends fgui.GButton {

	public selectedBtn:fgui.Controller;
	public picType:fgui.Controller;
	public tollgateBtn:fgui.GButton;
	public selectedImg:fgui.GImage;
	public judge:fgui.GLoader;
	public static URL:string = "ui://udjm963kp87np";

	public static createInstance():FUI_SinglePassBtnItem {
		return <FUI_SinglePassBtnItem>(fgui.UIPackage.createObject("SinglePass", "SinglePassBtnItem"));
	}

	protected onConstruct():void {
		this.selectedBtn = this.getController("selectedBtn");
		this.picType = this.getController("picType");
		this.tollgateBtn = <fgui.GButton>(this.getChild("tollgateBtn"));
		this.selectedImg = <fgui.GImage>(this.getChild("selectedImg"));
		this.judge = <fgui.GLoader>(this.getChild("judge"));
	}
}