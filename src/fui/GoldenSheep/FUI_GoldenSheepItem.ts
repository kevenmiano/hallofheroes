/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GoldenSheepItem extends fgui.GComponent {

	public luck:fgui.Controller;
	public luckImg:fgui.GImage;
	public nameTxt:fgui.GTextField;
	public goodsNameTxt:fgui.GRichTextField;
	public baseItem:fgui.GButton;
	public static URL:string = "ui://60ewj63vpu3fa";

	public static createInstance():FUI_GoldenSheepItem {
		return <FUI_GoldenSheepItem>(fgui.UIPackage.createObject("GoldenSheep", "GoldenSheepItem"));
	}

	protected onConstruct():void {
		this.luck = this.getController("luck");
		this.luckImg = <fgui.GImage>(this.getChild("luckImg"));
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.goodsNameTxt = <fgui.GRichTextField>(this.getChild("goodsNameTxt"));
		this.baseItem = <fgui.GButton>(this.getChild("baseItem"));
	}
}