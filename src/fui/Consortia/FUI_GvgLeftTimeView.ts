/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GvgLeftTimeView extends fgui.GComponent {

	public _timeValue:fgui.GTextField;
	public GvgLeftTimeView:fgui.GGroup;
	public static URL:string = "ui://8w3m5duwc4q3ian";

	public static createInstance():FUI_GvgLeftTimeView {
		return <FUI_GvgLeftTimeView>(fgui.UIPackage.createObject("Consortia", "GvgLeftTimeView"));
	}

	protected onConstruct():void {
		this._timeValue = <fgui.GTextField>(this.getChild("_timeValue"));
		this.GvgLeftTimeView = <fgui.GGroup>(this.getChild("GvgLeftTimeView"));
	}
}