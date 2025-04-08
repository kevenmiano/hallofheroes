/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_MasteryInlayItem from "./FUI_MasteryInlayItem";

export default class FUI_InlayCom extends fgui.GComponent {

	public inlay1:FUI_MasteryInlayItem;
	public inlay2:FUI_MasteryInlayItem;
	public inlay3:FUI_MasteryInlayItem;
	public inlay4:FUI_MasteryInlayItem;
	public bagItemList:fgui.GList;
	public static URL:string = "ui://6fvk31suocerehiy3";

	public static createInstance():FUI_InlayCom {
		return <FUI_InlayCom>(fgui.UIPackage.createObject("SBag", "InlayCom"));
	}

	protected onConstruct():void {
		this.inlay1 = <FUI_MasteryInlayItem>(this.getChild("inlay1"));
		this.inlay2 = <FUI_MasteryInlayItem>(this.getChild("inlay2"));
		this.inlay3 = <FUI_MasteryInlayItem>(this.getChild("inlay3"));
		this.inlay4 = <FUI_MasteryInlayItem>(this.getChild("inlay4"));
		this.bagItemList = <fgui.GList>(this.getChild("bagItemList"));
	}
}