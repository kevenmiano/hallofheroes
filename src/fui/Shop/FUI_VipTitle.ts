/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_VipTitle extends fgui.GComponent {

	public c1:fgui.Controller;
	public awardState:fgui.Controller;
	public btnState:fgui.Controller;
	public frameBg:fgui.GImage;
	public title:fgui.GTextField;
	public list:fgui.GList;
	public Btn_Receive:fgui.GButton;
	public Btn_unReceive:fgui.GRichTextField;
	public Btn_unBuy:fgui.GRichTextField;
	public Btn_Buy:fgui.GButton;
	public txt_originalPrice:fgui.GTextField;
	public txt_currPrice:fgui.GTextField;
	public static URL:string = "ui://qcwdul6nqsyf1b";

	public static createInstance():FUI_VipTitle {
		return <FUI_VipTitle>(fgui.UIPackage.createObject("Shop", "VipTitle"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.awardState = this.getController("awardState");
		this.btnState = this.getController("btnState");
		this.frameBg = <fgui.GImage>(this.getChild("frameBg"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.Btn_Receive = <fgui.GButton>(this.getChild("Btn_Receive"));
		this.Btn_unReceive = <fgui.GRichTextField>(this.getChild("Btn_unReceive"));
		this.Btn_unBuy = <fgui.GRichTextField>(this.getChild("Btn_unBuy"));
		this.Btn_Buy = <fgui.GButton>(this.getChild("Btn_Buy"));
		this.txt_originalPrice = <fgui.GTextField>(this.getChild("txt_originalPrice"));
		this.txt_currPrice = <fgui.GTextField>(this.getChild("txt_currPrice"));
	}
}