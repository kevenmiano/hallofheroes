/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FarmFriendItem extends fgui.GButton {

	public imgOpt:fgui.GLoader;
	public headIcon:fgui.GComponent;
	public txtCount:fgui.GTextField;
	public static URL:string = "ui://rcqiz171cju8t";

	public static createInstance():FUI_FarmFriendItem {
		return <FUI_FarmFriendItem>(fgui.UIPackage.createObject("Farm", "FarmFriendItem"));
	}

	protected onConstruct():void {
		this.imgOpt = <fgui.GLoader>(this.getChild("imgOpt"));
		this.headIcon = <fgui.GComponent>(this.getChild("headIcon"));
		this.txtCount = <fgui.GTextField>(this.getChild("txtCount"));
	}
}