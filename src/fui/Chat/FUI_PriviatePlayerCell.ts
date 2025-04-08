/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PriviatePlayerCell extends fgui.GButton {

	public bg_default:fgui.GImage;
	public bg_select:fgui.GImage;
	public headIcon:fgui.GComponent;
	public userName:fgui.GTextField;
	public reddot:fgui.GImage;
	public removeBtn:fgui.GButton;
	public static URL:string = "ui://5w3rpk77viv5pe";

	public static createInstance():FUI_PriviatePlayerCell {
		return <FUI_PriviatePlayerCell>(fgui.UIPackage.createObject("Chat", "PriviatePlayerCell"));
	}

	protected onConstruct():void {
		this.bg_default = <fgui.GImage>(this.getChild("bg_default"));
		this.bg_select = <fgui.GImage>(this.getChild("bg_select"));
		this.headIcon = <fgui.GComponent>(this.getChild("headIcon"));
		this.userName = <fgui.GTextField>(this.getChild("userName"));
		this.reddot = <fgui.GImage>(this.getChild("reddot"));
		this.removeBtn = <fgui.GButton>(this.getChild("removeBtn"));
	}
}