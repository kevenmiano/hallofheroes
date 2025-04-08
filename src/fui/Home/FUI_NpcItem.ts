/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_NpcItem extends fgui.GComponent {

	public npcImg:fgui.GImage;
	public static URL:string = "ui://tny43dz1o249pv";

	public static createInstance():FUI_NpcItem {
		return <FUI_NpcItem>(fgui.UIPackage.createObject("Home", "NpcItem"));
	}

	protected onConstruct():void {
		this.npcImg = <fgui.GImage>(this.getChild("npcImg"));
	}
}