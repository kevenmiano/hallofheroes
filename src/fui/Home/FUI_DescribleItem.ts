/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DescribleItem extends fgui.GComponent {

	public describleTxt:fgui.GTextField;
	public static URL:string = "ui://tny43dz1vxbvhsu";

	public static createInstance():FUI_DescribleItem {
		return <FUI_DescribleItem>(fgui.UIPackage.createObject("Home", "DescribleItem"));
	}

	protected onConstruct():void {
		this.describleTxt = <fgui.GTextField>(this.getChild("describleTxt"));
	}
}