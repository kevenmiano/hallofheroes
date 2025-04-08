// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RankStarItem extends fgui.GComponent {

	public cStar:fgui.Controller;
	public imgIcon:fgui.GLoader;
	public static URL:string = "ui://6qd4tcids7fhifs";

	public static createInstance():FUI_RankStarItem {
		return <FUI_RankStarItem>(fgui.UIPackage.createObject("RoomList", "RankStarItem"));
	}

	protected onConstruct():void {
		this.cStar = this.getController("cStar");
		this.imgIcon = <fgui.GLoader>(this.getChild("imgIcon"));
	}
}