// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetPotencyItem extends fgui.GComponent {

	public titleTxt:fgui.GRichTextField;
	public txtValue:fgui.GTextField;
	public addTxt:fgui.GRichTextField;
	public prog1:fgui.GProgressBar;
	public commGroup:fgui.GGroup;
	public prog2:fgui.GProgressBar;
	public prog3:fgui.GProgressBar;
	public hpGroup:fgui.GGroup;
	public progressGroup:fgui.GGroup;
	public static URL:string = "ui://t0l2fizvl20eis1";

	public static createInstance():FUI_PetPotencyItem {
		return <FUI_PetPotencyItem>(fgui.UIPackage.createObject("Pet", "PetPotencyItem"));
	}

	protected onConstruct():void {
		this.titleTxt = <fgui.GRichTextField>(this.getChild("titleTxt"));
		this.txtValue = <fgui.GTextField>(this.getChild("txtValue"));
		this.addTxt = <fgui.GRichTextField>(this.getChild("addTxt"));
		this.prog1 = <fgui.GProgressBar>(this.getChild("prog1"));
		this.commGroup = <fgui.GGroup>(this.getChild("commGroup"));
		this.prog2 = <fgui.GProgressBar>(this.getChild("prog2"));
		this.prog3 = <fgui.GProgressBar>(this.getChild("prog3"));
		this.hpGroup = <fgui.GGroup>(this.getChild("hpGroup"));
		this.progressGroup = <fgui.GGroup>(this.getChild("progressGroup"));
	}
}