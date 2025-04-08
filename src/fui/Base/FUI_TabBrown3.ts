/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TabBrown3 extends fgui.GButton {

	public redDot:fgui.GLoader;
	public redDotLabel:fgui.GTextField;
	public static URL:string = "ui://og5jeos3mzrxeip0";

	public static createInstance():FUI_TabBrown3 {
		return <FUI_TabBrown3>(fgui.UIPackage.createObject("Base", "TabBrown3"));
	}

	protected onConstruct():void {
		this.redDot = <fgui.GLoader>(this.getChild("redDot"));
		this.redDotLabel = <fgui.GTextField>(this.getChild("redDotLabel"));
	}
}