/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DragRuneIcon extends fgui.GComponent {

	public iconloader:fgui.GLoader;
	public static URL:string = "ui://v98hah2oluk8ilk";

	public static createInstance():FUI_DragRuneIcon {
		return <FUI_DragRuneIcon>(fgui.UIPackage.createObject("Skill", "DragRuneIcon"));
	}

	protected onConstruct():void {
		this.iconloader = <fgui.GLoader>(this.getChild("iconloader"));
	}
}