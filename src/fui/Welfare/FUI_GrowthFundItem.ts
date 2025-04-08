/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GrowthFundItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public btn_receive:fgui.GButton;
	public txt_level:fgui.GTextField;
	public item:fgui.GButton;
	public static URL:string = "ui://vw2db6bowvo23s";

	public static createInstance():FUI_GrowthFundItem {
		return <FUI_GrowthFundItem>(fgui.UIPackage.createObject("Welfare", "GrowthFundItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.btn_receive = <fgui.GButton>(this.getChild("btn_receive"));
		this.txt_level = <fgui.GTextField>(this.getChild("txt_level"));
		this.item = <fgui.GButton>(this.getChild("item"));
	}
}