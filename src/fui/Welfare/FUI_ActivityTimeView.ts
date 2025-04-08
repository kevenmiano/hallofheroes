// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ActivityTimeView extends fgui.GComponent {

	public typeList:fgui.GList;
	public static URL:string = "ui://vw2db6bomjw59miek";

	public static createInstance():FUI_ActivityTimeView {
		return <FUI_ActivityTimeView>(fgui.UIPackage.createObject("Welfare", "ActivityTimeView"));
	}

	protected onConstruct():void {
		this.typeList = <fgui.GList>(this.getChild("typeList"));
	}
}