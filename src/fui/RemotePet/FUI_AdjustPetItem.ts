// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AdjustPetItem extends fgui.GButton {

	public _petIcon:fgui.GLoader;
	public nameLab:fgui.GTextField;
	public powerLab:fgui.GRichTextField;
	public resetBtn:fgui.GButton;
	public fightBtn:fgui.GButton;
	public dieFlag:fgui.GTextField;
	public colorFlag:fgui.GLoader;
	public selectedFlag:fgui.GImage;
	public static URL:string = "ui://dq4xsyl3h0f62j";

	public static createInstance():FUI_AdjustPetItem {
		return <FUI_AdjustPetItem>(fgui.UIPackage.createObject("RemotePet", "AdjustPetItem"));
	}

	protected onConstruct():void {
		this._petIcon = <fgui.GLoader>(this.getChild("_petIcon"));
		this.nameLab = <fgui.GTextField>(this.getChild("nameLab"));
		this.powerLab = <fgui.GRichTextField>(this.getChild("powerLab"));
		this.resetBtn = <fgui.GButton>(this.getChild("resetBtn"));
		this.fightBtn = <fgui.GButton>(this.getChild("fightBtn"));
		this.dieFlag = <fgui.GTextField>(this.getChild("dieFlag"));
		this.colorFlag = <fgui.GLoader>(this.getChild("colorFlag"));
		this.selectedFlag = <fgui.GImage>(this.getChild("selectedFlag"));
	}
}