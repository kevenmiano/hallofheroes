/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GrowthFundView extends fgui.GComponent {

	public language:fgui.Controller;
	public c1:fgui.Controller;
	public list:fgui.GList;
	public btn_active:fgui.GButton;
	public giftBtn:fgui.GButton;
	public txt_money:fgui.GTextField;
	public descTxt:fgui.GTextField;
	public txt_num:fgui.GTextField;
	public countTxt:fgui.GTextField;
	public static URL:string = "ui://vw2db6bowvo23t";

	public static createInstance():FUI_GrowthFundView {
		return <FUI_GrowthFundView>(fgui.UIPackage.createObject("Welfare", "GrowthFundView"));
	}

	protected onConstruct():void {
		this.language = this.getController("language");
		this.c1 = this.getController("c1");
		this.list = <fgui.GList>(this.getChild("list"));
		this.btn_active = <fgui.GButton>(this.getChild("btn_active"));
		this.giftBtn = <fgui.GButton>(this.getChild("giftBtn"));
		this.txt_money = <fgui.GTextField>(this.getChild("txt_money"));
		this.descTxt = <fgui.GTextField>(this.getChild("descTxt"));
		this.txt_num = <fgui.GTextField>(this.getChild("txt_num"));
		this.countTxt = <fgui.GTextField>(this.getChild("countTxt"));
	}
}