/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FoisonHornView extends fgui.GComponent {

	public banner:fgui.GImage;
	public goodsList:fgui.GList;
	public activeBtn:fgui.GButton;
	public hasAtiveBtn:fgui.GButton;
	public picBtn:fgui.GButton;
	public leftTimeTxt:fgui.GTextField;
	public timeDescTxt:fgui.GRichTextField;
	public timeValueTxt:fgui.GRichTextField;
	public descTxt:fgui.GRichTextField;
	public rechargeCount:fgui.GRichTextField;
	public static URL:string = "ui://lzu8jcp2bheric5";

	public static createInstance():FUI_FoisonHornView {
		return <FUI_FoisonHornView>(fgui.UIPackage.createObject("Funny", "FoisonHornView"));
	}

	protected onConstruct():void {
		this.banner = <fgui.GImage>(this.getChild("banner"));
		this.goodsList = <fgui.GList>(this.getChild("goodsList"));
		this.activeBtn = <fgui.GButton>(this.getChild("activeBtn"));
		this.hasAtiveBtn = <fgui.GButton>(this.getChild("hasAtiveBtn"));
		this.picBtn = <fgui.GButton>(this.getChild("picBtn"));
		this.leftTimeTxt = <fgui.GTextField>(this.getChild("leftTimeTxt"));
		this.timeDescTxt = <fgui.GRichTextField>(this.getChild("timeDescTxt"));
		this.timeValueTxt = <fgui.GRichTextField>(this.getChild("timeValueTxt"));
		this.descTxt = <fgui.GRichTextField>(this.getChild("descTxt"));
		this.rechargeCount = <fgui.GRichTextField>(this.getChild("rechargeCount"));
	}
}