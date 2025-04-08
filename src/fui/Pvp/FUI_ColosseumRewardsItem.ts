// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ColosseumRewardsItem extends fgui.GComponent {

	public txtScore:fgui.GTextField;
	public itemList:fgui.GList;
	public static URL:string = "ui://5ozuvi6defyzi4g";

	public static createInstance():FUI_ColosseumRewardsItem {
		return <FUI_ColosseumRewardsItem>(fgui.UIPackage.createObject("Pvp", "ColosseumRewardsItem"));
	}

	protected onConstruct():void {
		this.txtScore = <fgui.GTextField>(this.getChild("txtScore"));
		this.itemList = <fgui.GList>(this.getChild("itemList"));
	}
}