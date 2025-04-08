/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MemoryCardView extends fgui.GComponent {

	public itemSpecial:fgui.GButton;
	public btnRefresh:fgui.GButton;
	public btnGet:fgui.GButton;
	public btnHelp:fgui.GButton;
	public btnBuy:fgui.GButton;
	public list:fgui.GList;
	public txt_time:fgui.GTextField;
	public txt_timeDesc:fgui.GTextField;
	public txt_specialDesc:fgui.GTextField;
	public txt_freeStepDesc:fgui.GTextField;
	public txt_buyStepDesc:fgui.GTextField;
	public txt_freeStep:fgui.GTextField;
	public txt_buyStep:fgui.GTextField;
	public txt_btnBuyStep:fgui.GRichTextField;
	public static URL:string = "ui://lzu8jcp2pir4i89";

	public static createInstance():FUI_MemoryCardView {
		return <FUI_MemoryCardView>(fgui.UIPackage.createObject("Funny", "MemoryCardView"));
	}

	protected onConstruct():void {
		this.itemSpecial = <fgui.GButton>(this.getChild("itemSpecial"));
		this.btnRefresh = <fgui.GButton>(this.getChild("btnRefresh"));
		this.btnGet = <fgui.GButton>(this.getChild("btnGet"));
		this.btnHelp = <fgui.GButton>(this.getChild("btnHelp"));
		this.btnBuy = <fgui.GButton>(this.getChild("btnBuy"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.txt_time = <fgui.GTextField>(this.getChild("txt_time"));
		this.txt_timeDesc = <fgui.GTextField>(this.getChild("txt_timeDesc"));
		this.txt_specialDesc = <fgui.GTextField>(this.getChild("txt_specialDesc"));
		this.txt_freeStepDesc = <fgui.GTextField>(this.getChild("txt_freeStepDesc"));
		this.txt_buyStepDesc = <fgui.GTextField>(this.getChild("txt_buyStepDesc"));
		this.txt_freeStep = <fgui.GTextField>(this.getChild("txt_freeStep"));
		this.txt_buyStep = <fgui.GTextField>(this.getChild("txt_buyStep"));
		this.txt_btnBuyStep = <fgui.GRichTextField>(this.getChild("txt_btnBuyStep"));
	}
}