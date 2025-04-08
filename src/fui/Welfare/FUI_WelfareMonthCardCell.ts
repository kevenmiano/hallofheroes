/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WelfareMonthCardCell extends fgui.GComponent {

	public bgIcon:fgui.GLoader;
	public time:fgui.GRichTextField;
	public buyTitle:fgui.GTextField;
	public dayAwardTitle:fgui.GTextField;
	public lastTime:fgui.GTextField;
	public buyIcon:fgui.GButton;
	public buyCount:fgui.GTextField;
	public buyDayGetIcon:fgui.GButton;
	public buyDayGetCount:fgui.GTextField;
	public btn_active:fgui.GButton;
	public txt_money:fgui.GTextField;
	public static URL:string = "ui://vw2db6bov2103h";

	public static createInstance():FUI_WelfareMonthCardCell {
		return <FUI_WelfareMonthCardCell>(fgui.UIPackage.createObject("Welfare", "WelfareMonthCardCell"));
	}

	protected onConstruct():void {
		this.bgIcon = <fgui.GLoader>(this.getChild("bgIcon"));
		this.time = <fgui.GRichTextField>(this.getChild("time"));
		this.buyTitle = <fgui.GTextField>(this.getChild("buyTitle"));
		this.dayAwardTitle = <fgui.GTextField>(this.getChild("dayAwardTitle"));
		this.lastTime = <fgui.GTextField>(this.getChild("lastTime"));
		this.buyIcon = <fgui.GButton>(this.getChild("buyIcon"));
		this.buyCount = <fgui.GTextField>(this.getChild("buyCount"));
		this.buyDayGetIcon = <fgui.GButton>(this.getChild("buyDayGetIcon"));
		this.buyDayGetCount = <fgui.GTextField>(this.getChild("buyDayGetCount"));
		this.btn_active = <fgui.GButton>(this.getChild("btn_active"));
		this.txt_money = <fgui.GTextField>(this.getChild("txt_money"));
	}
}