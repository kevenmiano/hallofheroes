// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FormationItem extends fgui.GComponent {

	public imgBg:fgui.GLoader;
	public container:fgui.GComponent;
	public static URL:string = "ui://t0l2fizvhp9virv";

	public static createInstance():FUI_FormationItem {
		return <FUI_FormationItem>(fgui.UIPackage.createObject("Pet", "FormationItem"));
	}

	protected onConstruct():void {
		this.imgBg = <fgui.GLoader>(this.getChild("imgBg"));
		this.container = <fgui.GComponent>(this.getChild("container"));
	}
}