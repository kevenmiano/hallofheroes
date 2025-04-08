/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHole from "./FUI_RuneHole";
import FUI_RuneGemItem from "./FUI_RuneGemItem";
import FUI_GemAttriItem from "./FUI_GemAttriItem";
import FUI_Component1 from "./FUI_Component1";

export default class FUI_RuneHoleGem extends fgui.GComponent {

	public img_probg1:fgui.GImage;
	public img_probg2:fgui.GImage;
	public img_probg3:fgui.GImage;
	public img_probg4:fgui.GImage;
	public img_pro1:fgui.GImage;
	public img_pro2:fgui.GImage;
	public img_pro3:fgui.GImage;
	public img_pro4:fgui.GImage;
	public rune_hole_1:FUI_RuneHole;
	public rune_hole_2:FUI_RuneHole;
	public rune_hole_3:FUI_RuneHole;
	public rune_hole_4:FUI_RuneHole;
	public rune_hole_5:FUI_RuneHole;
	public rune_gem_1:FUI_RuneGemItem;
	public rune_gem_2:FUI_RuneGemItem;
	public rune_gem_3:FUI_RuneGemItem;
	public rune_gem_4:FUI_RuneGemItem;
	public rune_gem_5:FUI_RuneGemItem;
	public txt_desc0:fgui.GTextField;
	public attri_1:FUI_GemAttriItem;
	public attri_2:FUI_GemAttriItem;
	public attri_3:FUI_GemAttriItem;
	public attri_4:FUI_GemAttriItem;
	public attri_5:FUI_GemAttriItem;
	public descCom:FUI_Component1;
	public static URL:string = "ui://v98hah2os7q5s9";

	public static createInstance():FUI_RuneHoleGem {
		return <FUI_RuneHoleGem>(fgui.UIPackage.createObject("Skill", "RuneHoleGem"));
	}

	protected onConstruct():void {
		this.img_probg1 = <fgui.GImage>(this.getChild("img_probg1"));
		this.img_probg2 = <fgui.GImage>(this.getChild("img_probg2"));
		this.img_probg3 = <fgui.GImage>(this.getChild("img_probg3"));
		this.img_probg4 = <fgui.GImage>(this.getChild("img_probg4"));
		this.img_pro1 = <fgui.GImage>(this.getChild("img_pro1"));
		this.img_pro2 = <fgui.GImage>(this.getChild("img_pro2"));
		this.img_pro3 = <fgui.GImage>(this.getChild("img_pro3"));
		this.img_pro4 = <fgui.GImage>(this.getChild("img_pro4"));
		this.rune_hole_1 = <FUI_RuneHole>(this.getChild("rune_hole_1"));
		this.rune_hole_2 = <FUI_RuneHole>(this.getChild("rune_hole_2"));
		this.rune_hole_3 = <FUI_RuneHole>(this.getChild("rune_hole_3"));
		this.rune_hole_4 = <FUI_RuneHole>(this.getChild("rune_hole_4"));
		this.rune_hole_5 = <FUI_RuneHole>(this.getChild("rune_hole_5"));
		this.rune_gem_1 = <FUI_RuneGemItem>(this.getChild("rune_gem_1"));
		this.rune_gem_2 = <FUI_RuneGemItem>(this.getChild("rune_gem_2"));
		this.rune_gem_3 = <FUI_RuneGemItem>(this.getChild("rune_gem_3"));
		this.rune_gem_4 = <FUI_RuneGemItem>(this.getChild("rune_gem_4"));
		this.rune_gem_5 = <FUI_RuneGemItem>(this.getChild("rune_gem_5"));
		this.txt_desc0 = <fgui.GTextField>(this.getChild("txt_desc0"));
		this.attri_1 = <FUI_GemAttriItem>(this.getChild("attri_1"));
		this.attri_2 = <FUI_GemAttriItem>(this.getChild("attri_2"));
		this.attri_3 = <FUI_GemAttriItem>(this.getChild("attri_3"));
		this.attri_4 = <FUI_GemAttriItem>(this.getChild("attri_4"));
		this.attri_5 = <FUI_GemAttriItem>(this.getChild("attri_5"));
		this.descCom = <FUI_Component1>(this.getChild("descCom"));
	}
}