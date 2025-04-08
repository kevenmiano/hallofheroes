/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaEventItem extends fgui.GComponent {

	public tfEvent:fgui.GRichTextField;
	public static URL:string = "ui://8w3m5duwfszci7x";

	public static createInstance():FUI_ConsortiaEventItem {
		return <FUI_ConsortiaEventItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaEventItem"));
	}

	protected onConstruct():void {
		this.tfEvent = <fgui.GRichTextField>(this.getChild("tfEvent"));
	}
}