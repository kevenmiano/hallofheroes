/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QQDawankaItem1 extends fgui.GComponent {

	public cGet:fgui.Controller;
	public cGray:fgui.Controller;
	public showIcon:fgui.GButton;
	public title:fgui.GTextField;
	public txt1:fgui.GTextField;
	public txt2:fgui.GTextField;
	public btnGet:fgui.GButton;
	public btnGray:fgui.GButton;
	public btnJump:fgui.GButton;
	public txtSoon:fgui.GTextField;
	public list:fgui.GList;
	public btnMask:fgui.GButton;
	public static URL:string = "ui://3b6uh7kjq2jjq";

	public static createInstance():FUI_QQDawankaItem1 {
		return <FUI_QQDawankaItem1>(fgui.UIPackage.createObject("QQDawanka", "QQDawankaItem1"));
	}

	protected onConstruct():void {
		this.cGet = this.getController("cGet");
		this.cGray = this.getController("cGray");
		this.showIcon = <fgui.GButton>(this.getChild("showIcon"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.txt1 = <fgui.GTextField>(this.getChild("txt1"));
		this.txt2 = <fgui.GTextField>(this.getChild("txt2"));
		this.btnGet = <fgui.GButton>(this.getChild("btnGet"));
		this.btnGray = <fgui.GButton>(this.getChild("btnGray"));
		this.btnJump = <fgui.GButton>(this.getChild("btnJump"));
		this.txtSoon = <fgui.GTextField>(this.getChild("txtSoon"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.btnMask = <fgui.GButton>(this.getChild("btnMask"));
	}
}