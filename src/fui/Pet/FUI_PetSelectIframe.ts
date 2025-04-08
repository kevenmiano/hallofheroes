/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetSelectIframe extends fgui.GComponent {

	public frame:fgui.GLabel;
	public list:fgui.GList;
	public static URL:string = "ui://t0l2fizvnn34ilz";

	public static createInstance():FUI_PetSelectIframe {
		return <FUI_PetSelectIframe>(fgui.UIPackage.createObject("Pet", "PetSelectIframe"));
	}

	protected onConstruct():void {
		this.frame = <fgui.GLabel>(this.getChild("frame"));
		this.list = <fgui.GList>(this.getChild("list"));
	}
}