// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TaskPhoneView extends fgui.GComponent {

	public tab:fgui.Controller;
	public phoneTxt:fgui.GTextField;
	public sendBg:fgui.GImage;
	public phoneNumber:fgui.GTextInput;
	public sendBtn:fgui.GButton;
	public sendTimeBtn:fgui.GButton;
	public group1:fgui.GGroup;
	public checkTitleTxt:fgui.GTextField;
	public checkInputBg:fgui.GImage;
	public checkNumber:fgui.GTextInput;
	public checkBtn:fgui.GButton;
	public checkBackBtn:fgui.GButton;
	public checkedTimeBtn:fgui.GButton;
	public checkDescTxt:fgui.GTextField;
	public group2:fgui.GGroup;
	public phoneDescTxt:fgui.GRichTextField;
	public static URL:string = "ui://m40vdx3k6l80ru";

	public static createInstance():FUI_TaskPhoneView {
		return <FUI_TaskPhoneView>(fgui.UIPackage.createObject("Task", "TaskPhoneView"));
	}

	protected onConstruct():void {
		this.tab = this.getController("tab");
		this.phoneTxt = <fgui.GTextField>(this.getChild("phoneTxt"));
		this.sendBg = <fgui.GImage>(this.getChild("sendBg"));
		this.phoneNumber = <fgui.GTextInput>(this.getChild("phoneNumber"));
		this.sendBtn = <fgui.GButton>(this.getChild("sendBtn"));
		this.sendTimeBtn = <fgui.GButton>(this.getChild("sendTimeBtn"));
		this.group1 = <fgui.GGroup>(this.getChild("group1"));
		this.checkTitleTxt = <fgui.GTextField>(this.getChild("checkTitleTxt"));
		this.checkInputBg = <fgui.GImage>(this.getChild("checkInputBg"));
		this.checkNumber = <fgui.GTextInput>(this.getChild("checkNumber"));
		this.checkBtn = <fgui.GButton>(this.getChild("checkBtn"));
		this.checkBackBtn = <fgui.GButton>(this.getChild("checkBackBtn"));
		this.checkedTimeBtn = <fgui.GButton>(this.getChild("checkedTimeBtn"));
		this.checkDescTxt = <fgui.GTextField>(this.getChild("checkDescTxt"));
		this.group2 = <fgui.GGroup>(this.getChild("group2"));
		this.phoneDescTxt = <fgui.GRichTextField>(this.getChild("phoneDescTxt"));
	}
}