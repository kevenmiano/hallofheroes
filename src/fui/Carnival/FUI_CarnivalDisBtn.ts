/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalDisBtn extends fgui.GButton {

	public showIcon:fgui.Controller;
	public static URL:string = "ui://qvbm8hnzjirvgx";

	public static createInstance():FUI_CarnivalDisBtn {
		return <FUI_CarnivalDisBtn>(fgui.UIPackage.createObject("Carnival", "CarnivalDisBtn"));
	}

	protected onConstruct():void {
		this.showIcon = this.getController("showIcon");
	}
}