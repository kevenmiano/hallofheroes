/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DropListItem extends fgui.GComponent {

	public goodsItem:fgui.GButton;
	public txt_name:fgui.GTextField;
	public static URL:string = "ui://iwrz1divkscu5h";

	public static createInstance():FUI_DropListItem {
		return <FUI_DropListItem>(fgui.UIPackage.createObject("GemMaze", "DropListItem"));
	}

	protected onConstruct():void {
		this.goodsItem = <fgui.GButton>(this.getChild("goodsItem"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
	}
}