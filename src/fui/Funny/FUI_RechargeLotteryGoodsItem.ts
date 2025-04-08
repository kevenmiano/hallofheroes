/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RechargeLotteryGoodsItem extends fgui.GComponent {

	public effect:fgui.Controller;
	public item:fgui.GButton;
	public static URL:string = "ui://lzu8jcp2fsg7mifw";

	public static createInstance():FUI_RechargeLotteryGoodsItem {
		return <FUI_RechargeLotteryGoodsItem>(fgui.UIPackage.createObject("Funny", "RechargeLotteryGoodsItem"));
	}

	protected onConstruct():void {
		this.effect = this.getController("effect");
		this.item = <fgui.GButton>(this.getChild("item"));
	}
}