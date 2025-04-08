/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaBuildPage extends fgui.GComponent {

	public storeNum:fgui.GTextField;
	public storeBtn:fgui.GButton;
	public altarNum:fgui.GTextField;
	public altarBtn:fgui.GButton;
	public skillNum:fgui.GTextField;
	public skillBtn:fgui.GButton;
	public shopNum:fgui.GTextField;
	public shopBtn:fgui.GButton;
	public static URL:string = "ui://8w3m5duwfszci88";

	public static createInstance():FUI_ConsortiaBuildPage {
		return <FUI_ConsortiaBuildPage>(fgui.UIPackage.createObject("Consortia", "ConsortiaBuildPage"));
	}

	protected onConstruct():void {
		this.storeNum = <fgui.GTextField>(this.getChild("storeNum"));
		this.storeBtn = <fgui.GButton>(this.getChild("storeBtn"));
		this.altarNum = <fgui.GTextField>(this.getChild("altarNum"));
		this.altarBtn = <fgui.GButton>(this.getChild("altarBtn"));
		this.skillNum = <fgui.GTextField>(this.getChild("skillNum"));
		this.skillBtn = <fgui.GButton>(this.getChild("skillBtn"));
		this.shopNum = <fgui.GTextField>(this.getChild("shopNum"));
		this.shopBtn = <fgui.GButton>(this.getChild("shopBtn"));
	}
}