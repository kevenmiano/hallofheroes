/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MineralShopItem extends fgui.GComponent {

	public bg:fgui.GImage;
	public item:fgui.GButton;
	public Btn_Exchange:fgui.GButton;
	public count:fgui.GTextField;
	public txt_Name:fgui.GTextField;
	public mineralIcon:fgui.GLoader;
	public txt_num:fgui.GTextInput;
	public txt_Level:fgui.GTextField;
	public static URL:string = "ui://8rzfeklswnft7";

	public static createInstance():FUI_MineralShopItem {
		return <FUI_MineralShopItem>(fgui.UIPackage.createObject("Mineral", "MineralShopItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this.Btn_Exchange = <fgui.GButton>(this.getChild("Btn_Exchange"));
		this.count = <fgui.GTextField>(this.getChild("count"));
		this.txt_Name = <fgui.GTextField>(this.getChild("txt_Name"));
		this.mineralIcon = <fgui.GLoader>(this.getChild("mineralIcon"));
		this.txt_num = <fgui.GTextInput>(this.getChild("txt_num"));
		this.txt_Level = <fgui.GTextField>(this.getChild("txt_Level"));
	}
}