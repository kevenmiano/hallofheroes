/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AssetAutoAnimation extends fgui.GComponent {

	public showBg:fgui.Controller;
	public txt_0:fgui.GTextField;
	public txt_1:fgui.GTextField;
	public txt_2:fgui.GTextField;
	public txt_3:fgui.GTextField;
	public txt_4:fgui.GTextField;
	public txt_5:fgui.GTextField;
	public txt_6:fgui.GTextField;
	public txt_7:fgui.GTextField;
	public static URL:string = "ui://og5jeos3qkupoz";

	public static createInstance():FUI_AssetAutoAnimation {
		return <FUI_AssetAutoAnimation>(fgui.UIPackage.createObject("Base", "AssetAutoAnimation"));
	}

	protected onConstruct():void {
		this.showBg = this.getController("showBg");
		this.txt_0 = <fgui.GTextField>(this.getChild("txt_0"));
		this.txt_1 = <fgui.GTextField>(this.getChild("txt_1"));
		this.txt_2 = <fgui.GTextField>(this.getChild("txt_2"));
		this.txt_3 = <fgui.GTextField>(this.getChild("txt_3"));
		this.txt_4 = <fgui.GTextField>(this.getChild("txt_4"));
		this.txt_5 = <fgui.GTextField>(this.getChild("txt_5"));
		this.txt_6 = <fgui.GTextField>(this.getChild("txt_6"));
		this.txt_7 = <fgui.GTextField>(this.getChild("txt_7"));
	}
}