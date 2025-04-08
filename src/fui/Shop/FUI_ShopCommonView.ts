/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ShopCommonView extends fgui.GComponent {

	public tab:fgui.Controller;
	public typeCtr:fgui.Controller;
	public ItemList:fgui.GList;
	public DescribleTxt:fgui.GTextField;
	public BuyNumDescTxt:fgui.GTextField;
	public tipItem2:fgui.GButton;
	public CostMoneyTxt:fgui.GTextField;
	public Btn_Buy:fgui.GButton;
	public icon1:fgui.GButton;
	public costPointTxt2:fgui.GTextField;
	public stepper:fgui.GComponent;
	public noteTxt:fgui.GRichTextField;
	public SelectedGoodsTxt:fgui.GTextField;
	public limitTitleTxt:fgui.GRichTextField;
	public limitCountTxt:fgui.GRichTextField;
	public limitBuyGroup:fgui.GGroup;
	public HasNumTxt:fgui.GTextField;
	public HasNumValueTxt:fgui.GTextField;
	public tab_0:fgui.GButton;
	public tab_1:fgui.GButton;
	public tab_2:fgui.GButton;
	public static URL:string = "ui://qcwdul6nlwbl2r";

	public static createInstance():FUI_ShopCommonView {
		return <FUI_ShopCommonView>(fgui.UIPackage.createObject("Shop", "ShopCommonView"));
	}

	protected onConstruct():void {
		this.tab = this.getController("tab");
		this.typeCtr = this.getController("typeCtr");
		this.ItemList = <fgui.GList>(this.getChild("ItemList"));
		this.DescribleTxt = <fgui.GTextField>(this.getChild("DescribleTxt"));
		this.BuyNumDescTxt = <fgui.GTextField>(this.getChild("BuyNumDescTxt"));
		this.tipItem2 = <fgui.GButton>(this.getChild("tipItem2"));
		this.CostMoneyTxt = <fgui.GTextField>(this.getChild("CostMoneyTxt"));
		this.Btn_Buy = <fgui.GButton>(this.getChild("Btn_Buy"));
		this.icon1 = <fgui.GButton>(this.getChild("icon1"));
		this.costPointTxt2 = <fgui.GTextField>(this.getChild("costPointTxt2"));
		this.stepper = <fgui.GComponent>(this.getChild("stepper"));
		this.noteTxt = <fgui.GRichTextField>(this.getChild("noteTxt"));
		this.SelectedGoodsTxt = <fgui.GTextField>(this.getChild("SelectedGoodsTxt"));
		this.limitTitleTxt = <fgui.GRichTextField>(this.getChild("limitTitleTxt"));
		this.limitCountTxt = <fgui.GRichTextField>(this.getChild("limitCountTxt"));
		this.limitBuyGroup = <fgui.GGroup>(this.getChild("limitBuyGroup"));
		this.HasNumTxt = <fgui.GTextField>(this.getChild("HasNumTxt"));
		this.HasNumValueTxt = <fgui.GTextField>(this.getChild("HasNumValueTxt"));
		this.tab_0 = <fgui.GButton>(this.getChild("tab_0"));
		this.tab_1 = <fgui.GButton>(this.getChild("tab_1"));
		this.tab_2 = <fgui.GButton>(this.getChild("tab_2"));
	}
}