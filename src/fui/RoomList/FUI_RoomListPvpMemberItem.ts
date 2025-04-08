// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RoomListPvpMemberItem extends fgui.GComponent {

	public txtName:fgui.GTextField;
	public txtLevel:fgui.GTextField;
	public imgCaptain:fgui.GImage;
	public imgVip:fgui.GImage;
	public imgIcon:fgui.GLoader;
	public static URL:string = "ui://6qd4tcids7fhiff";

	public static createInstance():FUI_RoomListPvpMemberItem {
		return <FUI_RoomListPvpMemberItem>(fgui.UIPackage.createObject("RoomList", "RoomListPvpMemberItem"));
	}

	protected onConstruct():void {
		this.txtName = <fgui.GTextField>(this.getChild("txtName"));
		this.txtLevel = <fgui.GTextField>(this.getChild("txtLevel"));
		this.imgCaptain = <fgui.GImage>(this.getChild("imgCaptain"));
		this.imgVip = <fgui.GImage>(this.getChild("imgVip"));
		this.imgIcon = <fgui.GLoader>(this.getChild("imgIcon"));
	}
}