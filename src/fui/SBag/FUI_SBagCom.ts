// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SBagCom extends fgui.GComponent {

	public onSale:fgui.Controller;
	public list:fgui.GList;
	public btn_sale:fgui.GButton;
	public btn_tidy:fgui.GButton;
	public btn_sure:fgui.GButton;
	public btn_cancel:fgui.GButton;
	public btn_cancel_1:fgui.GButton;
	public batch_put:fgui.GButton;
	public btn_tidy2:fgui.GButton;
	public consortiaGroup1:fgui.GGroup;
	public btn_put:fgui.GButton;
	public btn_cancel2:fgui.GButton;
	public consortiaGroup2:fgui.GGroup;
	public list_tab:fgui.GList;
	public txt_page:fgui.GTextField;
	public static URL:string = "ui://6fvk31sujoqd1n";

	public static createInstance():FUI_SBagCom {
		return <FUI_SBagCom>(fgui.UIPackage.createObject("SBag", "SBagCom"));
	}

	protected onConstruct():void {
		this.onSale = this.getController("onSale");
		this.list = <fgui.GList>(this.getChild("list"));
		this.btn_sale = <fgui.GButton>(this.getChild("btn_sale"));
		this.btn_tidy = <fgui.GButton>(this.getChild("btn_tidy"));
		this.btn_sure = <fgui.GButton>(this.getChild("btn_sure"));
		this.btn_cancel = <fgui.GButton>(this.getChild("btn_cancel"));
		this.btn_cancel_1 = <fgui.GButton>(this.getChild("btn_cancel_1"));
		this.batch_put = <fgui.GButton>(this.getChild("batch_put"));
		this.btn_tidy2 = <fgui.GButton>(this.getChild("btn_tidy2"));
		this.consortiaGroup1 = <fgui.GGroup>(this.getChild("consortiaGroup1"));
		this.btn_put = <fgui.GButton>(this.getChild("btn_put"));
		this.btn_cancel2 = <fgui.GButton>(this.getChild("btn_cancel2"));
		this.consortiaGroup2 = <fgui.GGroup>(this.getChild("consortiaGroup2"));
		this.list_tab = <fgui.GList>(this.getChild("list_tab"));
		this.txt_page = <fgui.GTextField>(this.getChild("txt_page"));
	}
}