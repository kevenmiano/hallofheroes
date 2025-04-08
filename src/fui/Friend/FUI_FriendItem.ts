/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FriendItem extends fgui.GComponent {

	public icon_head:fgui.GComponent;
	public progress:fgui.GProgressBar;
	public btn_flower:fgui.GButton;
	public btn_chat:fgui.GButton;
	public btn_more:fgui.GButton;
	public txt_level:fgui.GTextField;
	public txt_name:fgui.GTextField;
	public txt_fight:fgui.GTextField;
	public txt_grade:fgui.GTextField;
	public static URL:string = "ui://kbt4qqcbniy5s";

	public static createInstance():FUI_FriendItem {
		return <FUI_FriendItem>(fgui.UIPackage.createObject("Friend", "FriendItem"));
	}

	protected onConstruct():void {
		this.icon_head = <fgui.GComponent>(this.getChild("icon_head"));
		this.progress = <fgui.GProgressBar>(this.getChild("progress"));
		this.btn_flower = <fgui.GButton>(this.getChild("btn_flower"));
		this.btn_chat = <fgui.GButton>(this.getChild("btn_chat"));
		this.btn_more = <fgui.GButton>(this.getChild("btn_more"));
		this.txt_level = <fgui.GTextField>(this.getChild("txt_level"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_fight = <fgui.GTextField>(this.getChild("txt_fight"));
		this.txt_grade = <fgui.GTextField>(this.getChild("txt_grade"));
	}
}