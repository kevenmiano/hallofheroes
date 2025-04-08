/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_inputItem extends fgui.GComponent {

	public title_line:fgui.GImage;
	public static URL:string = "ui://hu55xxyzphcur";

	public static createInstance():FUI_inputItem {
		return <FUI_inputItem>(fgui.UIPackage.createObject("QuestionNaire", "inputItem"));
	}

	protected onConstruct():void {
		this.title_line = <fgui.GImage>(this.getChild("title_line"));
	}
}