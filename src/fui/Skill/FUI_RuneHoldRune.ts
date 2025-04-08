// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoldRuneItem2 from "./FUI_RuneHoldRuneItem2";

export default class FUI_RuneHoldRune extends fgui.GComponent {

	public RadioGroup:fgui.Controller;
	public parrern:fgui.GImage;
	public b0:fgui.GImage;
	public b1:fgui.GImage;
	public b2:fgui.GImage;
	public b3:fgui.GImage;
	public rr0:FUI_RuneHoldRuneItem2;
	public rr1:FUI_RuneHoldRuneItem2;
	public rr2:FUI_RuneHoldRuneItem2;
	public rr3:FUI_RuneHoldRuneItem2;
	public rr4:FUI_RuneHoldRuneItem2;
	public detailBtn:fgui.GButton;
	public static URL:string = "ui://v98hah2olin8imt";

	public static createInstance():FUI_RuneHoldRune {
		return <FUI_RuneHoldRune>(fgui.UIPackage.createObject("Skill", "RuneHoldRune"));
	}

	protected onConstruct():void {
		this.RadioGroup = this.getController("RadioGroup");
		this.parrern = <fgui.GImage>(this.getChild("parrern"));
		this.b0 = <fgui.GImage>(this.getChild("b0"));
		this.b1 = <fgui.GImage>(this.getChild("b1"));
		this.b2 = <fgui.GImage>(this.getChild("b2"));
		this.b3 = <fgui.GImage>(this.getChild("b3"));
		this.rr0 = <FUI_RuneHoldRuneItem2>(this.getChild("rr0"));
		this.rr1 = <FUI_RuneHoldRuneItem2>(this.getChild("rr1"));
		this.rr2 = <FUI_RuneHoldRuneItem2>(this.getChild("rr2"));
		this.rr3 = <FUI_RuneHoldRuneItem2>(this.getChild("rr3"));
		this.rr4 = <FUI_RuneHoldRuneItem2>(this.getChild("rr4"));
		this.detailBtn = <fgui.GButton>(this.getChild("detailBtn"));
	}
}