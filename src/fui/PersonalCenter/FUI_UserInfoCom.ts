// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_UserInfoCom extends fgui.GComponent {

	public showChatBubble:fgui.Controller;
	public redStatus:fgui.Controller;
	public bg:fgui.GImage;
	public icon_head:fgui.GComponent;
	public btn_modify:fgui.GButton;
	public txt_name:fgui.GTextField;
	public txt_svr:fgui.GTextField;
	public txt_consortia:fgui.GTextField;
	public txt_job:fgui.GTextField;
	public txt_title:fgui.GRichTextField;
	public txt_honor:fgui.GTextField;
	public txt_honorName:fgui.GTextField;
	public txt_charm:fgui.GTextField;
	public txt_lv:fgui.GTextField;
	public btn_name:fgui.GButton;
	public btn_chatbubble:fgui.GButton;
	public btn_role:fgui.GButton;
	public btn_login:fgui.GButton;
	public group:fgui.GGroup;
	public airBubbleLoader:fgui.GLoader;
	public appellMovie:fgui.GLoader;
	public static URL:string = "ui://6watmcoihzsft";

	public static createInstance():FUI_UserInfoCom {
		return <FUI_UserInfoCom>(fgui.UIPackage.createObject("PersonalCenter", "UserInfoCom"));
	}

	protected onConstruct():void {
		this.showChatBubble = this.getController("showChatBubble");
		this.redStatus = this.getController("redStatus");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.icon_head = <fgui.GComponent>(this.getChild("icon_head"));
		this.btn_modify = <fgui.GButton>(this.getChild("btn_modify"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_svr = <fgui.GTextField>(this.getChild("txt_svr"));
		this.txt_consortia = <fgui.GTextField>(this.getChild("txt_consortia"));
		this.txt_job = <fgui.GTextField>(this.getChild("txt_job"));
		this.txt_title = <fgui.GRichTextField>(this.getChild("txt_title"));
		this.txt_honor = <fgui.GTextField>(this.getChild("txt_honor"));
		this.txt_honorName = <fgui.GTextField>(this.getChild("txt_honorName"));
		this.txt_charm = <fgui.GTextField>(this.getChild("txt_charm"));
		this.txt_lv = <fgui.GTextField>(this.getChild("txt_lv"));
		this.btn_name = <fgui.GButton>(this.getChild("btn_name"));
		this.btn_chatbubble = <fgui.GButton>(this.getChild("btn_chatbubble"));
		this.btn_role = <fgui.GButton>(this.getChild("btn_role"));
		this.btn_login = <fgui.GButton>(this.getChild("btn_login"));
		this.group = <fgui.GGroup>(this.getChild("group"));
		this.airBubbleLoader = <fgui.GLoader>(this.getChild("airBubbleLoader"));
		this.appellMovie = <fgui.GLoader>(this.getChild("appellMovie"));
	}
}