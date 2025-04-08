/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaTreasureItem extends fgui.GComponent {

	public nameTxt:fgui.GTextField;
	public n4Txt:fgui.GTextField;
	public occpuyNameTxt:fgui.GTextField;
	public n8Txt:fgui.GTextField;
	public addDescTxt:fgui.GTextField;
	public statusTxt:fgui.GTextField;
	public leftTimeTxt:fgui.GTextField;
	public dataGroup:fgui.GGroup;
	public static URL:string = "ui://8w3m5duwbheriay";

	public static createInstance():FUI_ConsortiaTreasureItem {
		return <FUI_ConsortiaTreasureItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaTreasureItem"));
	}

	protected onConstruct():void {
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.n4Txt = <fgui.GTextField>(this.getChild("n4Txt"));
		this.occpuyNameTxt = <fgui.GTextField>(this.getChild("occpuyNameTxt"));
		this.n8Txt = <fgui.GTextField>(this.getChild("n8Txt"));
		this.addDescTxt = <fgui.GTextField>(this.getChild("addDescTxt"));
		this.statusTxt = <fgui.GTextField>(this.getChild("statusTxt"));
		this.leftTimeTxt = <fgui.GTextField>(this.getChild("leftTimeTxt"));
		this.dataGroup = <fgui.GGroup>(this.getChild("dataGroup"));
	}
}