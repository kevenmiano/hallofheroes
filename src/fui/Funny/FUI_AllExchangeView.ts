/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AllExchangeView extends fgui.GComponent {

	public bg:fgui.GGroup;
	public txt0:fgui.GRichTextField;
	public helpBtn:fgui.GButton;
	public propItem:fgui.GButton;
	public txt1:fgui.GRichTextField;
	public txt_point:fgui.GRichTextField;
	public bar:fgui.GProgressBar;
	public list0:fgui.GList;
	public remainTImes:fgui.GRichTextField;
	public txt2:fgui.GRichTextField;
	public list1:fgui.GList;
	public static URL:string = "ui://lzu8jcp2zi1962";

	public static createInstance():FUI_AllExchangeView {
		return <FUI_AllExchangeView>(fgui.UIPackage.createObject("Funny", "AllExchangeView"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GGroup>(this.getChild("bg"));
		this.txt0 = <fgui.GRichTextField>(this.getChild("txt0"));
		this.helpBtn = <fgui.GButton>(this.getChild("helpBtn"));
		this.propItem = <fgui.GButton>(this.getChild("propItem"));
		this.txt1 = <fgui.GRichTextField>(this.getChild("txt1"));
		this.txt_point = <fgui.GRichTextField>(this.getChild("txt_point"));
		this.bar = <fgui.GProgressBar>(this.getChild("bar"));
		this.list0 = <fgui.GList>(this.getChild("list0"));
		this.remainTImes = <fgui.GRichTextField>(this.getChild("remainTImes"));
		this.txt2 = <fgui.GRichTextField>(this.getChild("txt2"));
		this.list1 = <fgui.GList>(this.getChild("list1"));
	}
}