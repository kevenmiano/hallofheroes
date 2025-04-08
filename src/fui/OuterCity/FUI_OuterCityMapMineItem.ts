/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityMapMineItem extends fgui.GComponent {

	public mineNameTxt:fgui.GTextField;
	public hasCountTxt:fgui.GTextField;
	public static URL:string = "ui://xcvl5694as2imixb";

	public static createInstance():FUI_OuterCityMapMineItem {
		return <FUI_OuterCityMapMineItem>(fgui.UIPackage.createObject("OuterCity", "OuterCityMapMineItem"));
	}

	protected onConstruct():void {
		this.mineNameTxt = <fgui.GTextField>(this.getChild("mineNameTxt"));
		this.hasCountTxt = <fgui.GTextField>(this.getChild("hasCountTxt"));
	}
}