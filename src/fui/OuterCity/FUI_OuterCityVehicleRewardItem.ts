/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityVehicleRewardItem extends fgui.GComponent {

	public goodsIcon:fgui.GLoader;
	public profile:fgui.GLoader;
	public countTxt:fgui.GRichTextField;
	public static URL:string = "ui://xcvl5694fziemj28";

	public static createInstance():FUI_OuterCityVehicleRewardItem {
		return <FUI_OuterCityVehicleRewardItem>(fgui.UIPackage.createObject("OuterCity", "OuterCityVehicleRewardItem"));
	}

	protected onConstruct():void {
		this.goodsIcon = <fgui.GLoader>(this.getChild("goodsIcon"));
		this.profile = <fgui.GLoader>(this.getChild("profile"));
		this.countTxt = <fgui.GRichTextField>(this.getChild("countTxt"));
	}
}