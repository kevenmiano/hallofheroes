/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AppellProItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public title:fgui.GTextField;
	public appellMovie:fgui.GLoader;
	public list_prop:fgui.GList;
	public static URL:string = "ui://hr3infdvqsyf5";

	public static createInstance():FUI_AppellProItem {
		return <FUI_AppellProItem>(fgui.UIPackage.createObject("Appell", "AppellProItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.appellMovie = <fgui.GLoader>(this.getChild("appellMovie"));
		this.list_prop = <fgui.GList>(this.getChild("list_prop"));
	}
}