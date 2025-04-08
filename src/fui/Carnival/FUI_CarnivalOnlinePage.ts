/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CarnivalInfoItem from "./FUI_CarnivalInfoItem";

export default class FUI_CarnivalOnlinePage extends fgui.GComponent {

	public itemlist:fgui.GList;
	public carnival_online:FUI_CarnivalInfoItem;
	public carnival_reset:FUI_CarnivalInfoItem;
	public static URL:string = "ui://qvbm8hnzpf9kgg";

	public static createInstance():FUI_CarnivalOnlinePage {
		return <FUI_CarnivalOnlinePage>(fgui.UIPackage.createObject("Carnival", "CarnivalOnlinePage"));
	}

	protected onConstruct():void {
		this.itemlist = <fgui.GList>(this.getChild("itemlist"));
		this.carnival_online = <FUI_CarnivalInfoItem>(this.getChild("carnival_online"));
		this.carnival_reset = <FUI_CarnivalInfoItem>(this.getChild("carnival_reset"));
	}
}