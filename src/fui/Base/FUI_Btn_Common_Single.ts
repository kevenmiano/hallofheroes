/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_Btn_Common_Single extends fgui.GButton {

	public redPointState:fgui.Controller;
	public selectShapeImg:fgui.GLoader;
	public txtTitle2:fgui.GRichTextField;
	public redDot:fgui.GLoader;
	public redDotLabel:fgui.GTextField;
	public static URL:string = "ui://og5jeos3qd1xi61";

	public static createInstance():FUI_Btn_Common_Single {
		return <FUI_Btn_Common_Single>(fgui.UIPackage.createObject("Base", "Btn_Common_Single"));
	}

	protected onConstruct():void {
		this.redPointState = this.getController("redPointState");
		this.selectShapeImg = <fgui.GLoader>(this.getChild("selectShapeImg"));
		this.txtTitle2 = <fgui.GRichTextField>(this.getChild("txtTitle2"));
		this.redDot = <fgui.GLoader>(this.getChild("redDot"));
		this.redDotLabel = <fgui.GTextField>(this.getChild("redDotLabel"));
	}
}