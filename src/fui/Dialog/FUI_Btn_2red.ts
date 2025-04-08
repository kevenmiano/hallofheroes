/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_Btn_2red extends fgui.GButton {

	public typeIcon:fgui.GLoader;
	public typeTxt:fgui.GTextField;
	public static URL:string = "ui://ulm55jf7t604i6u";

	public static createInstance():FUI_Btn_2red {
		return <FUI_Btn_2red>(fgui.UIPackage.createObject("Dialog", "Btn_2red"));
	}

	protected onConstruct():void {
		this.typeIcon = <fgui.GLoader>(this.getChild("typeIcon"));
		this.typeTxt = <fgui.GTextField>(this.getChild("typeTxt"));
	}
}