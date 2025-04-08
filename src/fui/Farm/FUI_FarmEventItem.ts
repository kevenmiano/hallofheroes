/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FarmEventItem extends fgui.GComponent {

	public descTxt:fgui.GRichTextField;
	public static URL:string = "ui://rcqiz171aw6vhsy";

	public static createInstance():FUI_FarmEventItem {
		return <FUI_FarmEventItem>(fgui.UIPackage.createObject("Farm", "FarmEventItem"));
	}

	protected onConstruct():void {
		this.descTxt = <fgui.GRichTextField>(this.getChild("descTxt"));
	}
}