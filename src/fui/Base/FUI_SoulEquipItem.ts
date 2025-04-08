/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SoulEquipItem extends fgui.GButton {

	public c1:fgui.Controller;
	public back:fgui.GLoader;
	public iconLoader:fgui.GLoader;
	public txt_stren:fgui.GRichTextField;
	public txt_stage:fgui.GTextField;
	public img_better:fgui.GImage;
	public inlayItem1:fgui.GLoader;
	public inlayItem2:fgui.GLoader;
	public inlayItem3:fgui.GLoader;
	public inlayItem4:fgui.GLoader;
	public reddot:fgui.GImage;
	public static URL:string = "ui://og5jeos3ho9twu8wyi";

	public static createInstance():FUI_SoulEquipItem {
		return <FUI_SoulEquipItem>(fgui.UIPackage.createObject("Base", "SoulEquipItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.back = <fgui.GLoader>(this.getChild("back"));
		this.iconLoader = <fgui.GLoader>(this.getChild("iconLoader"));
		this.txt_stren = <fgui.GRichTextField>(this.getChild("txt_stren"));
		this.txt_stage = <fgui.GTextField>(this.getChild("txt_stage"));
		this.img_better = <fgui.GImage>(this.getChild("img_better"));
		this.inlayItem1 = <fgui.GLoader>(this.getChild("inlayItem1"));
		this.inlayItem2 = <fgui.GLoader>(this.getChild("inlayItem2"));
		this.inlayItem3 = <fgui.GLoader>(this.getChild("inlayItem3"));
		this.inlayItem4 = <fgui.GLoader>(this.getChild("inlayItem4"));
		this.reddot = <fgui.GImage>(this.getChild("reddot"));
	}
}