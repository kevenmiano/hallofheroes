/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WarlordRoomPlayerItem extends fgui.GComponent {

	public imgStage:fgui.GImage;
	public txtPlayerName:fgui.GTextField;
	public txtGuildName:fgui.GTextField;
	public gName:fgui.GGroup;
	public static URL:string = "ui://6fsn69didcpq1i";

	public static createInstance():FUI_WarlordRoomPlayerItem {
		return <FUI_WarlordRoomPlayerItem>(fgui.UIPackage.createObject("Warlords", "WarlordRoomPlayerItem"));
	}

	protected onConstruct():void {
		this.imgStage = <fgui.GImage>(this.getChild("imgStage"));
		this.txtPlayerName = <fgui.GTextField>(this.getChild("txtPlayerName"));
		this.txtGuildName = <fgui.GTextField>(this.getChild("txtGuildName"));
		this.gName = <fgui.GGroup>(this.getChild("gName"));
	}
}