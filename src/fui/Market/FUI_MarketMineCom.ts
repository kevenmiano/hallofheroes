/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MarketMineCom extends fgui.GComponent {

	public igt:fgui.GImage;
	public stateLab:fgui.GTextField;
	public mineLab:fgui.GTextField;
	public wantLab:fgui.GTextField;
	public goodsList:fgui.GList;
	public static URL:string = "ui://50f8ewazdt3za";

	public static createInstance():FUI_MarketMineCom {
		return <FUI_MarketMineCom>(fgui.UIPackage.createObject("Market", "MarketMineCom"));
	}

	protected onConstruct():void {
		this.igt = <fgui.GImage>(this.getChild("igt"));
		this.stateLab = <fgui.GTextField>(this.getChild("stateLab"));
		this.mineLab = <fgui.GTextField>(this.getChild("mineLab"));
		this.wantLab = <fgui.GTextField>(this.getChild("wantLab"));
		this.goodsList = <fgui.GList>(this.getChild("goodsList"));
	}
}