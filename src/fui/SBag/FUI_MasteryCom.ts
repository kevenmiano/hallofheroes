/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MasteryCom extends fgui.GComponent {

	public txt_active:fgui.GRichTextField;
	public txt_add:fgui.GRichTextField;
	public secret_list:fgui.GList;
	public btn_attr:fgui.GButton;
	public item6:fgui.GButton;
	public item1:fgui.GButton;
	public item2:fgui.GButton;
	public item5:fgui.GButton;
	public item3:fgui.GButton;
	public item4:fgui.GButton;
	public txt1:fgui.GRichTextField;
	public txt_level:fgui.GRichTextField;
	public btn_help:fgui.GButton;
	public static URL:string = "ui://6fvk31suho9tehixh";

	public static createInstance():FUI_MasteryCom {
		return <FUI_MasteryCom>(fgui.UIPackage.createObject("SBag", "MasteryCom"));
	}

	protected onConstruct():void {
		this.txt_active = <fgui.GRichTextField>(this.getChild("txt_active"));
		this.txt_add = <fgui.GRichTextField>(this.getChild("txt_add"));
		this.secret_list = <fgui.GList>(this.getChild("secret_list"));
		this.btn_attr = <fgui.GButton>(this.getChild("btn_attr"));
		this.item6 = <fgui.GButton>(this.getChild("item6"));
		this.item1 = <fgui.GButton>(this.getChild("item1"));
		this.item2 = <fgui.GButton>(this.getChild("item2"));
		this.item5 = <fgui.GButton>(this.getChild("item5"));
		this.item3 = <fgui.GButton>(this.getChild("item3"));
		this.item4 = <fgui.GButton>(this.getChild("item4"));
		this.txt1 = <fgui.GRichTextField>(this.getChild("txt1"));
		this.txt_level = <fgui.GRichTextField>(this.getChild("txt_level"));
		this.btn_help = <fgui.GButton>(this.getChild("btn_help"));
	}
}