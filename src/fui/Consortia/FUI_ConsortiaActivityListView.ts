/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaActivityListView extends fgui.GComponent {

	public listActivity:fgui.GList;
	public static URL:string = "ui://8w3m5duwqtkki8e";

	public static createInstance():FUI_ConsortiaActivityListView {
		return <FUI_ConsortiaActivityListView>(fgui.UIPackage.createObject("Consortia", "ConsortiaActivityListView"));
	}

	protected onConstruct():void {
		this.listActivity = <fgui.GList>(this.getChild("listActivity"));
	}
}