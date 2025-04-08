/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneBagCom_S extends fgui.GComponent {

	public c1:fgui.Controller;
	public btn_close_bag:fgui.GButton;
	public combox1:fgui.GComboBox;
	public list:fgui.GList;
	public img_select:fgui.GImage;
	public static URL:string = "ui://v98hah2ohsemsh";

	public static createInstance():FUI_RuneBagCom_S {
		return <FUI_RuneBagCom_S>(fgui.UIPackage.createObject("Skill", "RuneBagCom_S"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.btn_close_bag = <fgui.GButton>(this.getChild("btn_close_bag"));
		this.combox1 = <fgui.GComboBox>(this.getChild("combox1"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.img_select = <fgui.GImage>(this.getChild("img_select"));
	}
}