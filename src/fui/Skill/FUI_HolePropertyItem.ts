/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_HolePropertyItem extends fgui.GComponent {

	public s1:fgui.GRichTextField;
	public v1:fgui.GRichTextField;
	public a1:fgui.GRichTextField;
	public static URL:string = "ui://v98hah2ofeawipv";

	public static createInstance():FUI_HolePropertyItem {
		return <FUI_HolePropertyItem>(fgui.UIPackage.createObject("Skill", "HolePropertyItem"));
	}

	protected onConstruct():void {
		this.s1 = <fgui.GRichTextField>(this.getChild("s1"));
		this.v1 = <fgui.GRichTextField>(this.getChild("v1"));
		this.a1 = <fgui.GRichTextField>(this.getChild("a1"));
	}
}