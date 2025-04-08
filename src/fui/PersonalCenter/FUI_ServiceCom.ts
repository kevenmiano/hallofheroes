/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ServiceCom extends fgui.GComponent {

	public c1:fgui.Controller;
	public txt_title:fgui.GTextInput;
	public combox1:fgui.GComboBox;
	public combox2:fgui.GComboBox;
	public combox3:fgui.GComboBox;
	public combox0:fgui.GComboBox;
	public txt_input1:fgui.GTextInput;
	public txt_input2:fgui.GTextInput;
	public txt_input3:fgui.GTextInput;
	public group0:fgui.GGroup;
	public txt_warn:fgui.GTextField;
	public btn_submit:fgui.GButton;
	public btn_upload:fgui.GButton;
	public txt_desc:fgui.GTextInput;
	public txt_num:fgui.GTextField;
	public group1:fgui.GGroup;
	public static URL:string = "ui://6watmcoiq4x71p";

	public static createInstance():FUI_ServiceCom {
		return <FUI_ServiceCom>(fgui.UIPackage.createObject("PersonalCenter", "ServiceCom"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.txt_title = <fgui.GTextInput>(this.getChild("txt_title"));
		this.combox1 = <fgui.GComboBox>(this.getChild("combox1"));
		this.combox2 = <fgui.GComboBox>(this.getChild("combox2"));
		this.combox3 = <fgui.GComboBox>(this.getChild("combox3"));
		this.combox0 = <fgui.GComboBox>(this.getChild("combox0"));
		this.txt_input1 = <fgui.GTextInput>(this.getChild("txt_input1"));
		this.txt_input2 = <fgui.GTextInput>(this.getChild("txt_input2"));
		this.txt_input3 = <fgui.GTextInput>(this.getChild("txt_input3"));
		this.group0 = <fgui.GGroup>(this.getChild("group0"));
		this.txt_warn = <fgui.GTextField>(this.getChild("txt_warn"));
		this.btn_submit = <fgui.GButton>(this.getChild("btn_submit"));
		this.btn_upload = <fgui.GButton>(this.getChild("btn_upload"));
		this.txt_desc = <fgui.GTextInput>(this.getChild("txt_desc"));
		this.txt_num = <fgui.GTextField>(this.getChild("txt_num"));
		this.group1 = <fgui.GGroup>(this.getChild("group1"));
	}
}