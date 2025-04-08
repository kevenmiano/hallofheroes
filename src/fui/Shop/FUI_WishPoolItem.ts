/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WishPoolItem extends fgui.GComponent {

	public selectedImg:fgui.GImage;
	public typeLoader:fgui.GLoader;
	public tipItem:fgui.GButton;
	public nameTxt:fgui.GTextField;
	public limitCountTxt:fgui.GRichTextField;
	public coinCountTxt:fgui.GTextField;
	public static URL:string = "ui://qcwdul6nhm0o31";

	public static createInstance():FUI_WishPoolItem {
		return <FUI_WishPoolItem>(fgui.UIPackage.createObject("Shop", "WishPoolItem"));
	}

	protected onConstruct():void {
		this.selectedImg = <fgui.GImage>(this.getChild("selectedImg"));
		this.typeLoader = <fgui.GLoader>(this.getChild("typeLoader"));
		this.tipItem = <fgui.GButton>(this.getChild("tipItem"));
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.limitCountTxt = <fgui.GRichTextField>(this.getChild("limitCountTxt"));
		this.coinCountTxt = <fgui.GTextField>(this.getChild("coinCountTxt"));
	}
}