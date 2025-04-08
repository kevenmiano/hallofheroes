// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MiniRankStarItem extends fgui.GComponent {

	public cStar:fgui.Controller;
	public imgIcon:fgui.GLoader;
	public static URL:string = "ui://wd6i8g4ubd1grf";

	public static createInstance():FUI_MiniRankStarItem {
		return <FUI_MiniRankStarItem>(fgui.UIPackage.createObject("RoomHall", "MiniRankStarItem"));
	}

	protected onConstruct():void {
		this.cStar = this.getController("cStar");
		this.imgIcon = <fgui.GLoader>(this.getChild("imgIcon"));
	}
}