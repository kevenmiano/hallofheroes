/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetSelectItemTitle extends fgui.GComponent {

	public title:fgui.GTextField;
	public static URL:string = "ui://t0l2fizvdk7cim1";

	public static createInstance():FUI_PetSelectItemTitle {
		return <FUI_PetSelectItemTitle>(fgui.UIPackage.createObject("Pet", "PetSelectItemTitle"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChild("title"));
	}
}