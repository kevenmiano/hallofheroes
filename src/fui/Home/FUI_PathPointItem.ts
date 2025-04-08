/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PathPointItem extends fgui.GComponent {

	public pathNode:fgui.GImage;
	public static URL:string = "ui://tny43dz1o249pn";

	public static createInstance():FUI_PathPointItem {
		return <FUI_PathPointItem>(fgui.UIPackage.createObject("Home", "PathPointItem"));
	}

	protected onConstruct():void {
		this.pathNode = <fgui.GImage>(this.getChild("pathNode"));
	}
}