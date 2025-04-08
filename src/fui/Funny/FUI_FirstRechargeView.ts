/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FirstRechargeView extends fgui.GComponent {

	public txt2:fgui.GRichTextField;
	public remainTImes:fgui.GRichTextField;
	public group0:fgui.GGroup;
	public list:fgui.GList;
	public txt1:fgui.GRichTextField;
	public descTxt:fgui.GTextField;
	public chargeBtn:fgui.GButton;
	public static URL:string = "ui://lzu8jcp2r70i68";

	public static createInstance():FUI_FirstRechargeView {
		return <FUI_FirstRechargeView>(fgui.UIPackage.createObject("Funny", "FirstRechargeView"));
	}

	protected onConstruct():void {
		this.txt2 = <fgui.GRichTextField>(this.getChild("txt2"));
		this.remainTImes = <fgui.GRichTextField>(this.getChild("remainTImes"));
		this.group0 = <fgui.GGroup>(this.getChild("group0"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.txt1 = <fgui.GRichTextField>(this.getChild("txt1"));
		this.descTxt = <fgui.GTextField>(this.getChild("descTxt"));
		this.chargeBtn = <fgui.GButton>(this.getChild("chargeBtn"));
	}
}