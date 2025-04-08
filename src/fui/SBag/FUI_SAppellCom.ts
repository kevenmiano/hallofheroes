/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SAppellCom extends fgui.GComponent {

	public c2:fgui.Controller;
	public c3:fgui.Controller;
	public title:fgui.GTextField;
	public appellList:fgui.GList;
	public appellMovie:fgui.GLoader;
	public list_tab:fgui.GList;
	public line0:fgui.GImage;
	public title0:fgui.GTextField;
	public line:fgui.GImage;
	public list_prop:fgui.GList;
	public title1:fgui.GTextField;
	public g1:fgui.GGroup;
	public txt_content:fgui.GRichTextField;
	public txt_name:fgui.GTextField;
	public line3:fgui.GImage;
	public g2:fgui.GGroup;
	public list_addprop:fgui.GList;
	public title2:fgui.GTextField;
	public line1:fgui.GImage;
	public addbox:fgui.GGroup;
	public my_appellMovie:fgui.GLoader;
	public txt_noappel:fgui.GTextField;
	public static URL:string = "ui://6fvk31suh5mpig8";

	public static createInstance():FUI_SAppellCom {
		return <FUI_SAppellCom>(fgui.UIPackage.createObject("SBag", "SAppellCom"));
	}

	protected onConstruct():void {
		this.c2 = this.getController("c2");
		this.c3 = this.getController("c3");
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.appellList = <fgui.GList>(this.getChild("appellList"));
		this.appellMovie = <fgui.GLoader>(this.getChild("appellMovie"));
		this.list_tab = <fgui.GList>(this.getChild("list_tab"));
		this.line0 = <fgui.GImage>(this.getChild("line0"));
		this.title0 = <fgui.GTextField>(this.getChild("title0"));
		this.line = <fgui.GImage>(this.getChild("line"));
		this.list_prop = <fgui.GList>(this.getChild("list_prop"));
		this.title1 = <fgui.GTextField>(this.getChild("title1"));
		this.g1 = <fgui.GGroup>(this.getChild("g1"));
		this.txt_content = <fgui.GRichTextField>(this.getChild("txt_content"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.line3 = <fgui.GImage>(this.getChild("line3"));
		this.g2 = <fgui.GGroup>(this.getChild("g2"));
		this.list_addprop = <fgui.GList>(this.getChild("list_addprop"));
		this.title2 = <fgui.GTextField>(this.getChild("title2"));
		this.line1 = <fgui.GImage>(this.getChild("line1"));
		this.addbox = <fgui.GGroup>(this.getChild("addbox"));
		this.my_appellMovie = <fgui.GLoader>(this.getChild("my_appellMovie"));
		this.txt_noappel = <fgui.GTextField>(this.getChild("txt_noappel"));
	}
}