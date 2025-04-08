/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ConsortiaAltarGoodsItem from "./FUI_ConsortiaAltarGoodsItem";

export default class FUI_ConsortiaAltarItem extends fgui.GComponent {

	public showPic:fgui.Controller;
	public goodsItem:FUI_ConsortiaAltarGoodsItem;
	public selectedMc:fgui.Transition;
	public static URL:string = "ui://8w3m5duwlajki9o";

	public static createInstance():FUI_ConsortiaAltarItem {
		return <FUI_ConsortiaAltarItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaAltarItem"));
	}

	protected onConstruct():void {
		this.showPic = this.getController("showPic");
		this.goodsItem = <FUI_ConsortiaAltarGoodsItem>(this.getChild("goodsItem"));
		this.selectedMc = this.getTransition("selectedMc");
	}
}