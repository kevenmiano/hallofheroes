/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CumulativeRechargeView extends fgui.GComponent {

	public banner:fgui.GImage;
	public nameTitle:fgui.GTextField;
	public tips:fgui.GRichTextField;
	public times:fgui.GRichTextField;
	public rechargeCount:fgui.GRichTextField;
	public list:fgui.GList;
	public BtnLeft:fgui.GButton;
	public BtnRight:fgui.GButton;
	public btn_active:fgui.GButton;
	public static URL:string = "ui://lzu8jcp2hk1w5d";

	public static createInstance():FUI_CumulativeRechargeView {
		return <FUI_CumulativeRechargeView>(fgui.UIPackage.createObject("Funny", "CumulativeRechargeView"));
	}

	protected onConstruct():void {
		this.banner = <fgui.GImage>(this.getChild("banner"));
		this.nameTitle = <fgui.GTextField>(this.getChild("nameTitle"));
		this.tips = <fgui.GRichTextField>(this.getChild("tips"));
		this.times = <fgui.GRichTextField>(this.getChild("times"));
		this.rechargeCount = <fgui.GRichTextField>(this.getChild("rechargeCount"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.BtnLeft = <fgui.GButton>(this.getChild("BtnLeft"));
		this.BtnRight = <fgui.GButton>(this.getChild("BtnRight"));
		this.btn_active = <fgui.GButton>(this.getChild("btn_active"));
	}
}