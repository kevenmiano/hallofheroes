/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHole_s from "./FUI_RuneHole_s";

export default class FUI_RuneHoleHelpItem extends fgui.GComponent {

	public img_probg1:fgui.GImage;
	public img_probg2:fgui.GImage;
	public img_probg3:fgui.GImage;
	public img_probg4:fgui.GImage;
	public img_pro1:fgui.GImage;
	public img_pro2:fgui.GImage;
	public img_pro3:fgui.GImage;
	public img_pro4:fgui.GImage;
	public rune_hole_1:FUI_RuneHole_s;
	public rune_hole_2:FUI_RuneHole_s;
	public rune_hole_3:FUI_RuneHole_s;
	public rune_hole_4:FUI_RuneHole_s;
	public rune_hole_5:FUI_RuneHole_s;
	public txt_desc1:fgui.GRichTextField;
	public txt_desc2:fgui.GRichTextField;
	public static URL:string = "ui://v98hah2owbheikg";

	public static createInstance():FUI_RuneHoleHelpItem {
		return <FUI_RuneHoleHelpItem>(fgui.UIPackage.createObject("Skill", "RuneHoleHelpItem"));
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
		this.rune_hole_1 = <FUI_RuneHole_s>(this.getChild("rune_hole_1"));
		this.rune_hole_2 = <FUI_RuneHole_s>(this.getChild("rune_hole_2"));
		this.rune_hole_3 = <FUI_RuneHole_s>(this.getChild("rune_hole_3"));
		this.rune_hole_4 = <FUI_RuneHole_s>(this.getChild("rune_hole_4"));
		this.rune_hole_5 = <FUI_RuneHole_s>(this.getChild("rune_hole_5"));
		this.txt_desc1 = <fgui.GRichTextField>(this.getChild("txt_desc1"));
		this.txt_desc2 = <fgui.GRichTextField>(this.getChild("txt_desc2"));
	}
}