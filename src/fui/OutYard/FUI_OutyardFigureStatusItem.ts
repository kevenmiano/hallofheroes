/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardFigureStatusItem extends fgui.GComponent {

	public type:fgui.Controller;
	public status:fgui.Controller;
	public countTxt:fgui.GTextField;
	public static URL:string = "ui://w1giibvbo5c36hidl";

	public static createInstance():FUI_OutyardFigureStatusItem {
		return <FUI_OutyardFigureStatusItem>(fgui.UIPackage.createObject("OutYard", "OutyardFigureStatusItem"));
	}

	protected onConstruct():void {
		this.type = this.getController("type");
		this.status = this.getController("status");
		this.countTxt = <fgui.GTextField>(this.getChild("countTxt"));
	}
}