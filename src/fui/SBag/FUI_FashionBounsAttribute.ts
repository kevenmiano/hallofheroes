/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FashionBounsAttribute extends fgui.GComponent {

	public attLab:fgui.GRichTextField;
	public hbox:fgui.GGroup;
	public static URL:string = "ui://6fvk31suerwlehiri";

	public static createInstance():FUI_FashionBounsAttribute {
		return <FUI_FashionBounsAttribute>(fgui.UIPackage.createObject("SBag", "FashionBounsAttribute"));
	}

	protected onConstruct():void {
		this.attLab = <fgui.GRichTextField>(this.getChild("attLab"));
		this.hbox = <fgui.GGroup>(this.getChild("hbox"));
	}
}