/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WarlordsBetSelectItem extends fgui.GButton {

	public icon_head:fgui.GLoader;
	public txt_level:fgui.GTextField;
	public txt_name:fgui.GTextField;
	public txt_fight:fgui.GTextField;
	public selecteBtn:fgui.GButton;
	public static URL:string = "ui://6fsn69didw9z1a";

	public static createInstance():FUI_WarlordsBetSelectItem {
		return <FUI_WarlordsBetSelectItem>(fgui.UIPackage.createObject("Warlords", "WarlordsBetSelectItem"));
	}

	protected onConstruct():void {
		this.icon_head = <fgui.GLoader>(this.getChild("icon_head"));
		this.txt_level = <fgui.GTextField>(this.getChild("txt_level"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_fight = <fgui.GTextField>(this.getChild("txt_fight"));
		this.selecteBtn = <fgui.GButton>(this.getChild("selecteBtn"));
	}
}