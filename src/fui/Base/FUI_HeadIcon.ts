/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_HeadIcon extends fgui.GButton {

	public select:fgui.Controller;
	public lock:fgui.Controller;
	public redStatus:fgui.Controller;
	public c1:fgui.Controller;
	public head:fgui.GComponent;
	public masks:fgui.GGraph;
	public img_selected:fgui.GImage;
	public static URL:string = "ui://og5jeos3kiz4wu8wwk";

	public static createInstance():FUI_HeadIcon {
		return <FUI_HeadIcon>(fgui.UIPackage.createObject("Base", "HeadIcon"));
	}

	protected onConstruct():void {
		this.select = this.getController("select");
		this.lock = this.getController("lock");
		this.redStatus = this.getController("redStatus");
		this.c1 = this.getController("c1");
		this.head = <fgui.GComponent>(this.getChild("head"));
		this.masks = <fgui.GGraph>(this.getChild("masks"));
		this.img_selected = <fgui.GImage>(this.getChild("img_selected"));
	}
}