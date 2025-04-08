/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BaseIcon extends fgui.GButton {

	public bg:fgui.GLoader;
	public imgSelect:fgui.GLoader;
	public static URL:string = "ui://og5jeos3y90ti5q";

	public static createInstance():FUI_BaseIcon {
		return <FUI_BaseIcon>(fgui.UIPackage.createObject("Base", "BaseIcon"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GLoader>(this.getChild("bg"));
		this.imgSelect = <fgui.GLoader>(this.getChild("imgSelect"));
	}
}