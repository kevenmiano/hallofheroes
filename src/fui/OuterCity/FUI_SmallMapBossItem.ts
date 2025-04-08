// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SmallMapBossItem extends fgui.GComponent {

	public bossLevel:fgui.GTextField;
	public static URL:string = "ui://xcvl5694fuyfmix3";

	public static createInstance():FUI_SmallMapBossItem {
		return <FUI_SmallMapBossItem>(fgui.UIPackage.createObject("OuterCity", "SmallMapBossItem"));
	}

	protected onConstruct():void {
		this.bossLevel = <fgui.GTextField>(this.getChild("bossLevel"));
	}
}