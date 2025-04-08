/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RankStarItem from "./FUI_RankStarItem";

export default class FUI_PvpRewardsItem extends fgui.GComponent {

	public txtTitle:fgui.GTextField;
	public txtDes:fgui.GTextField;
	public itemList:fgui.GList;
	public rankStarItem:FUI_RankStarItem;
	public static URL:string = "ui://6qd4tcids7fhifm";

	public static createInstance():FUI_PvpRewardsItem {
		return <FUI_PvpRewardsItem>(fgui.UIPackage.createObject("RoomList", "PvpRewardsItem"));
	}

	protected onConstruct():void {
		this.txtTitle = <fgui.GTextField>(this.getChild("txtTitle"));
		this.txtDes = <fgui.GTextField>(this.getChild("txtDes"));
		this.itemList = <fgui.GList>(this.getChild("itemList"));
		this.rankStarItem = <FUI_RankStarItem>(this.getChild("rankStarItem"));
	}
}