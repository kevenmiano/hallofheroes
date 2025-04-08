/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FunnyExchangeItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public txt_Count:fgui.GTextField;
	public exchangeBtn:fgui.GButton;
	public overBtn:fgui.GButton;
	public check:fgui.GButton;
	public exchangeList1:fgui.GList;
	public exchangeList2:fgui.GList;
	public group:fgui.GGroup;
	public static URL:string = "ui://lzu8jcp2th2c4z";

	public static createInstance():FUI_FunnyExchangeItem {
		return <FUI_FunnyExchangeItem>(fgui.UIPackage.createObject("Funny", "FunnyExchangeItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.txt_Count = <fgui.GTextField>(this.getChild("txt_Count"));
		this.exchangeBtn = <fgui.GButton>(this.getChild("exchangeBtn"));
		this.overBtn = <fgui.GButton>(this.getChild("overBtn"));
		this.check = <fgui.GButton>(this.getChild("check"));
		this.exchangeList1 = <fgui.GList>(this.getChild("exchangeList1"));
		this.exchangeList2 = <fgui.GList>(this.getChild("exchangeList2"));
		this.group = <fgui.GGroup>(this.getChild("group"));
	}
}