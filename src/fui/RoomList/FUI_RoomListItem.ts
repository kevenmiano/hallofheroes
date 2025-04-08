/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RoomListItem extends fgui.GButton {

	public imgBg:fgui.GLoader;
	public imgLock:fgui.GLoader;
	public imgBgNum:fgui.GImage;
	public imgSelect:fgui.GImage;
	public txtNum:fgui.GTextField;
	public txtCapicity:fgui.GTextField;
	public txtTitle:fgui.GRichTextField;
	public static URL:string = "ui://6qd4tcidfxj90";

	public static createInstance():FUI_RoomListItem {
		return <FUI_RoomListItem>(fgui.UIPackage.createObject("RoomList", "RoomListItem"));
	}

	protected onConstruct():void {
		this.imgBg = <fgui.GLoader>(this.getChild("imgBg"));
		this.imgLock = <fgui.GLoader>(this.getChild("imgLock"));
		this.imgBgNum = <fgui.GImage>(this.getChild("imgBgNum"));
		this.imgSelect = <fgui.GImage>(this.getChild("imgSelect"));
		this.txtNum = <fgui.GTextField>(this.getChild("txtNum"));
		this.txtCapicity = <fgui.GTextField>(this.getChild("txtCapicity"));
		this.txtTitle = <fgui.GRichTextField>(this.getChild("txtTitle"));
	}
}