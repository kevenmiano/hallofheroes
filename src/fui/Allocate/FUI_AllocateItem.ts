/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AllocateItem extends fgui.GComponent {

	public bg:fgui.GImage;
	public static URL:string = "ui://u5b8u6g0m7ttl";

	public static createInstance():FUI_AllocateItem {
		return <FUI_AllocateItem>(fgui.UIPackage.createObject("Allocate", "AllocateItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
	}
}