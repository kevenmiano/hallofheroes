/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetRoleCom extends fgui.GComponent {

	public petLoader:fgui.GLoader;
	public petFightValueTxt:fgui.GTextField;
	public static URL:string = "ui://tny43dz1nwjeipy";

	public static createInstance():FUI_PetRoleCom {
		return <FUI_PetRoleCom>(fgui.UIPackage.createObject("Home", "PetRoleCom"));
	}

	protected onConstruct():void {
		this.petLoader = <fgui.GLoader>(this.getChild("petLoader"));
		this.petFightValueTxt = <fgui.GTextField>(this.getChild("petFightValueTxt"));
	}
}