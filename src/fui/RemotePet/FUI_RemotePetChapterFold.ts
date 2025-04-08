// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetChapterFold extends fgui.GButton {

	public expanded:fgui.Controller;
	public normal:fgui.GLoader;
	public select:fgui.GLoader;
	public static URL:string = "ui://dq4xsyl3h0f62e";

	public static createInstance():FUI_RemotePetChapterFold {
		return <FUI_RemotePetChapterFold>(fgui.UIPackage.createObject("RemotePet", "RemotePetChapterFold"));
	}

	protected onConstruct():void {
		this.expanded = this.getController("expanded");
		this.normal = <fgui.GLoader>(this.getChild("normal"));
		this.select = <fgui.GLoader>(this.getChild("select"));
	}
}