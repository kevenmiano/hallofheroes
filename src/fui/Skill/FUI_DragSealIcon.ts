// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DragSealIcon extends fgui.GComponent {

	public iconloader:fgui.GLoader;
	public textbg:fgui.GImage;
	public level:fgui.GTextField;
	public levelGroup:fgui.GGroup;
	public static URL:string = "ui://v98hah2ofqebimb";

	public static createInstance():FUI_DragSealIcon {
		return <FUI_DragSealIcon>(fgui.UIPackage.createObject("Skill", "DragSealIcon"));
	}

	protected onConstruct():void {
		this.iconloader = <fgui.GLoader>(this.getChild("iconloader"));
		this.textbg = <fgui.GImage>(this.getChild("textbg"));
		this.level = <fgui.GTextField>(this.getChild("level"));
		this.levelGroup = <fgui.GGroup>(this.getChild("levelGroup"));
	}
}