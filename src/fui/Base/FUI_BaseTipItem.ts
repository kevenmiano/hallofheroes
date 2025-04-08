/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BaseTipItem extends fgui.GButton {

	public tipBtn:fgui.GButton;
	public group:fgui.GGroup;
	public static URL:string = "ui://og5jeos3wb8qwu8wt8";

	public static createInstance():FUI_BaseTipItem {
		return <FUI_BaseTipItem>(fgui.UIPackage.createObject("Base", "BaseTipItem"));
	}

	protected onConstruct():void {
		this.tipBtn = <fgui.GButton>(this.getChild("tipBtn"));
		this.group = <fgui.GGroup>(this.getChild("group"));
	}
}