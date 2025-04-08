/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_PreviewGoodsItem extends fgui.GComponent {

	public goodsItem:FUI_BaseItem;
	public goodsName:fgui.GTextField;
	public static URL:string = "ui://og5jeos3vjciwu8wth";

	public static createInstance():FUI_PreviewGoodsItem {
		return <FUI_PreviewGoodsItem>(fgui.UIPackage.createObject("Base", "PreviewGoodsItem"));
	}

	protected onConstruct():void {
		this.goodsItem = <FUI_BaseItem>(this.getChild("goodsItem"));
		this.goodsName = <fgui.GTextField>(this.getChild("goodsName"));
	}
}