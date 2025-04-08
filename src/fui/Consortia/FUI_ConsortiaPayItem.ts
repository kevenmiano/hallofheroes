/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaPayItem extends fgui.GComponent {

	public hasGet:fgui.Controller;
	public goodsIcon:fgui.GLoader;
	public profile:fgui.GLoader;
	public countTxt:fgui.GRichTextField;
	public descTxt:fgui.GTextField;
	public static URL:string = "ui://8w3m5duwwj2kie1";

	public static createInstance():FUI_ConsortiaPayItem {
		return <FUI_ConsortiaPayItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaPayItem"));
	}

	protected onConstruct():void {
		this.hasGet = this.getController("hasGet");
		this.goodsIcon = <fgui.GLoader>(this.getChild("goodsIcon"));
		this.profile = <fgui.GLoader>(this.getChild("profile"));
		this.countTxt = <fgui.GRichTextField>(this.getChild("countTxt"));
		this.descTxt = <fgui.GTextField>(this.getChild("descTxt"));
	}
}