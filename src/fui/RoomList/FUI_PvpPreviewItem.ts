// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RankStarItem from "./FUI_RankStarItem";

export default class FUI_PvpPreviewItem extends fgui.GComponent {

	public cPos:fgui.Controller;
	public rankStarItem:FUI_RankStarItem;
	public txtName:fgui.GTextField;
	public imgIcon:fgui.GLoader;
	public txtPower:fgui.GTextField;
	public txtValue:fgui.GTextField;
	public static URL:string = "ui://6qd4tcids7fhig0";

	public static createInstance():FUI_PvpPreviewItem {
		return <FUI_PvpPreviewItem>(fgui.UIPackage.createObject("RoomList", "PvpPreviewItem"));
	}

	protected onConstruct():void {
		this.cPos = this.getController("cPos");
		this.rankStarItem = <FUI_RankStarItem>(this.getChild("rankStarItem"));
		this.txtName = <fgui.GTextField>(this.getChild("txtName"));
		this.imgIcon = <fgui.GLoader>(this.getChild("imgIcon"));
		this.txtPower = <fgui.GTextField>(this.getChild("txtPower"));
		this.txtValue = <fgui.GTextField>(this.getChild("txtValue"));
	}
}