/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PvpShopView extends fgui.GComponent {

	public limitCtr:fgui.Controller;
	public ItemList:fgui.GList;
	public SelectedGoodsTxt:fgui.GTextField;
	public DescribleTxt:fgui.GTextField;
	public BuyNumDescTxt:fgui.GTextField;
	public HasNumTxt:fgui.GTextField;
	public HasNumValueTxt:fgui.GTextField;
	public icon1:fgui.GButton;
	public Btn_Buy:fgui.GButton;
	public stepper:fgui.GComponent;
	public itemTips:fgui.GComponent;
	public txtJob:fgui.GTextField;
	public txtLevel:fgui.GTextField;
	public txtIntensifyLevel:fgui.GTextField;
	public specialGroup:fgui.GGroup;
	public limitDescTxt:fgui.GRichTextField;
	public limitCounTxt:fgui.GRichTextField;
	public tipItem2:fgui.GButton;
	public CostMoneyTxt:fgui.GTextField;
	public static URL:string = "ui://qcwdul6nlwbl2u";

	public static createInstance():FUI_PvpShopView {
		return <FUI_PvpShopView>(fgui.UIPackage.createObject("Shop", "PvpShopView"));
	}

	protected onConstruct():void {
		this.limitCtr = this.getController("limitCtr");
		this.ItemList = <fgui.GList>(this.getChild("ItemList"));
		this.SelectedGoodsTxt = <fgui.GTextField>(this.getChild("SelectedGoodsTxt"));
		this.DescribleTxt = <fgui.GTextField>(this.getChild("DescribleTxt"));
		this.BuyNumDescTxt = <fgui.GTextField>(this.getChild("BuyNumDescTxt"));
		this.HasNumTxt = <fgui.GTextField>(this.getChild("HasNumTxt"));
		this.HasNumValueTxt = <fgui.GTextField>(this.getChild("HasNumValueTxt"));
		this.icon1 = <fgui.GButton>(this.getChild("icon1"));
		this.Btn_Buy = <fgui.GButton>(this.getChild("Btn_Buy"));
		this.stepper = <fgui.GComponent>(this.getChild("stepper"));
		this.itemTips = <fgui.GComponent>(this.getChild("itemTips"));
		this.txtJob = <fgui.GTextField>(this.getChild("txtJob"));
		this.txtLevel = <fgui.GTextField>(this.getChild("txtLevel"));
		this.txtIntensifyLevel = <fgui.GTextField>(this.getChild("txtIntensifyLevel"));
		this.specialGroup = <fgui.GGroup>(this.getChild("specialGroup"));
		this.limitDescTxt = <fgui.GRichTextField>(this.getChild("limitDescTxt"));
		this.limitCounTxt = <fgui.GRichTextField>(this.getChild("limitCounTxt"));
		this.tipItem2 = <fgui.GButton>(this.getChild("tipItem2"));
		this.CostMoneyTxt = <fgui.GTextField>(this.getChild("CostMoneyTxt"));
	}
}