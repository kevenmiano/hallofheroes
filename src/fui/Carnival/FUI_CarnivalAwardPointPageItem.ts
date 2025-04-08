/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalAwardPointPageItem extends fgui.GComponent {

	public state:fgui.Controller;
	public awartState:fgui.Controller;
	public isSummer:fgui.Controller;
	public txtTitle:fgui.GRichTextField;
	public goodsList:fgui.GList;
	public goodsList2:fgui.GList;
	public btn_receive:fgui.GButton;
	public btn_unlock:fgui.GButton;
	public static URL:string = "ui://qvbm8hnzpf9kgn";

	public static createInstance():FUI_CarnivalAwardPointPageItem {
		return <FUI_CarnivalAwardPointPageItem>(fgui.UIPackage.createObject("Carnival", "CarnivalAwardPointPageItem"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this.awartState = this.getController("awartState");
		this.isSummer = this.getController("isSummer");
		this.txtTitle = <fgui.GRichTextField>(this.getChild("txtTitle"));
		this.goodsList = <fgui.GList>(this.getChild("goodsList"));
		this.goodsList2 = <fgui.GList>(this.getChild("goodsList2"));
		this.btn_receive = <fgui.GButton>(this.getChild("btn_receive"));
		this.btn_unlock = <fgui.GButton>(this.getChild("btn_unlock"));
	}
}