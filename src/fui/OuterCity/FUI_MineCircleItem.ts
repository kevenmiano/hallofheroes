/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MineCircleItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public static URL:string = "ui://xcvl5694fuyfmix0";

	public static createInstance():FUI_MineCircleItem {
		return <FUI_MineCircleItem>(fgui.UIPackage.createObject("OuterCity", "MineCircleItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
	}
}