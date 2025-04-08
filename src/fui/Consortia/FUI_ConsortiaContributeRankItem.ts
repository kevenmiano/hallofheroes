/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaContributeRankItem extends fgui.GButton {

	public isTitle:fgui.Controller;
	public iconTitle:fgui.GLoader;
	public imgRank:fgui.GLoader;
	public txt1:fgui.GTextField;
	public txt2:fgui.GTextField;
	public txt3:fgui.GTextField;
	public static URL:string = "ui://8w3m5duwfszci89";

	public static createInstance():FUI_ConsortiaContributeRankItem {
		return <FUI_ConsortiaContributeRankItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaContributeRankItem"));
	}

	protected onConstruct():void {
		this.isTitle = this.getController("isTitle");
		this.iconTitle = <fgui.GLoader>(this.getChild("iconTitle"));
		this.imgRank = <fgui.GLoader>(this.getChild("imgRank"));
		this.txt1 = <fgui.GTextField>(this.getChild("txt1"));
		this.txt2 = <fgui.GTextField>(this.getChild("txt2"));
		this.txt3 = <fgui.GTextField>(this.getChild("txt3"));
	}
}