/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CommonBtn from "./FUI_CommonBtn";

export default class FUI_Dialog2 extends fgui.GLabel {

	public c1:fgui.Controller;
	public c2:fgui.Controller;
	public contentArea:fgui.GGraph;
	public closeBtn:FUI_CommonBtn;
	public helpBtn:FUI_CommonBtn;
	public static URL:string = "ui://og5jeos3iln6pb";

	public static createInstance():FUI_Dialog2 {
		return <FUI_Dialog2>(fgui.UIPackage.createObject("Base", "Dialog2"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.contentArea = <fgui.GGraph>(this.getChild("contentArea"));
		this.closeBtn = <FUI_CommonBtn>(this.getChild("closeBtn"));
		this.helpBtn = <FUI_CommonBtn>(this.getChild("helpBtn"));
	}
}