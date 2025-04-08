// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SmallMapPlayerItem extends fgui.GComponent {

	public com:fgui.GComponent;
	public static URL:string = "ui://xcvl5694oqygmj12";

	public static createInstance():FUI_SmallMapPlayerItem {
		return <FUI_SmallMapPlayerItem>(fgui.UIPackage.createObject("OuterCity", "SmallMapPlayerItem"));
	}

	protected onConstruct():void {
		this.com = <fgui.GComponent>(this.getChild("com"));
	}
}