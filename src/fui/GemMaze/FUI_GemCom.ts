/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GemCom extends fgui.GComponent {

	public img_select:fgui.GImage;
	public static URL:string = "ui://iwrz1divlvh758";

	public static createInstance():FUI_GemCom {
		return <FUI_GemCom>(fgui.UIPackage.createObject("GemMaze", "GemCom"));
	}

	protected onConstruct():void {
		this.img_select = <fgui.GImage>(this.getChild("img_select"));
	}
}