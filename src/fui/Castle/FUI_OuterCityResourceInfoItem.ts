/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityResourceInfoItem extends fgui.GComponent {

	public nameTxt:fgui.GRichTextField;
	public goldNumTxt:fgui.GRichTextField;
	public posTxt:fgui.GRichTextField;
	public giveUpBtn:fgui.GButton;
	public lookBtn:fgui.GButton;
	public static URL:string = "ui://sm9fel4ln8y6m";

	public static createInstance():FUI_OuterCityResourceInfoItem {
		return <FUI_OuterCityResourceInfoItem>(fgui.UIPackage.createObject("Castle", "OuterCityResourceInfoItem"));
	}

	protected onConstruct():void {
		this.nameTxt = <fgui.GRichTextField>(this.getChild("nameTxt"));
		this.goldNumTxt = <fgui.GRichTextField>(this.getChild("goldNumTxt"));
		this.posTxt = <fgui.GRichTextField>(this.getChild("posTxt"));
		this.giveUpBtn = <fgui.GButton>(this.getChild("giveUpBtn"));
		this.lookBtn = <fgui.GButton>(this.getChild("lookBtn"));
	}
}