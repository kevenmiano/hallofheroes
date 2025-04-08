// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetDetail extends fgui.GComponent {

	public exist:fgui.Controller;
	public img_sourceBg:fgui.GImage;
	public btn_stage:fgui.GButton;
	public btn_petType:fgui.GButton;
	public comp_petItem:fgui.GComponent;
	public txt_petName:fgui.GRichTextField;
	public comb_starList:fgui.GList;
	public label_development:fgui.GTextField;
	public txt_development:fgui.GTextField;
	public label_powerFlair:fgui.GTextField;
	public txt_powerFlair:fgui.GTextField;
	public label_armorFlair:fgui.GTextField;
	public txt_armorFlair:fgui.GTextField;
	public label_intelligenceFlair:fgui.GTextField;
	public txt_intelligenceFlair:fgui.GTextField;
	public label_brainFlair:fgui.GTextField;
	public txt_brainFlair:fgui.GTextField;
	public txt_selectTargetTip:fgui.GTextField;
	public btn_selectTarget:fgui.GButton;
	public static URL:string = "ui://t0l2fizvnn34im0";

	public static createInstance():FUI_PetDetail {
		return <FUI_PetDetail>(fgui.UIPackage.createObject("Pet", "PetDetail"));
	}

	protected onConstruct():void {
		this.exist = this.getController("exist");
		this.img_sourceBg = <fgui.GImage>(this.getChild("img_sourceBg"));
		this.btn_stage = <fgui.GButton>(this.getChild("btn_stage"));
		this.btn_petType = <fgui.GButton>(this.getChild("btn_petType"));
		this.comp_petItem = <fgui.GComponent>(this.getChild("comp_petItem"));
		this.txt_petName = <fgui.GRichTextField>(this.getChild("txt_petName"));
		this.comb_starList = <fgui.GList>(this.getChild("comb_starList"));
		this.label_development = <fgui.GTextField>(this.getChild("label_development"));
		this.txt_development = <fgui.GTextField>(this.getChild("txt_development"));
		this.label_powerFlair = <fgui.GTextField>(this.getChild("label_powerFlair"));
		this.txt_powerFlair = <fgui.GTextField>(this.getChild("txt_powerFlair"));
		this.label_armorFlair = <fgui.GTextField>(this.getChild("label_armorFlair"));
		this.txt_armorFlair = <fgui.GTextField>(this.getChild("txt_armorFlair"));
		this.label_intelligenceFlair = <fgui.GTextField>(this.getChild("label_intelligenceFlair"));
		this.txt_intelligenceFlair = <fgui.GTextField>(this.getChild("txt_intelligenceFlair"));
		this.label_brainFlair = <fgui.GTextField>(this.getChild("label_brainFlair"));
		this.txt_brainFlair = <fgui.GTextField>(this.getChild("txt_brainFlair"));
		this.txt_selectTargetTip = <fgui.GTextField>(this.getChild("txt_selectTargetTip"));
		this.btn_selectTarget = <fgui.GButton>(this.getChild("btn_selectTarget"));
	}
}