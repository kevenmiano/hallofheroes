// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoleSkill from "./FUI_RuneHoleSkill";
import FUI_HolePropertyItem from "./FUI_HolePropertyItem";

export default class FUI_HoldOptionlCom extends fgui.GComponent {

	public fb:fgui.GImage;
	public tb:fgui.GImage;
	public title:fgui.GTextField;
	public holdSkill:FUI_RuneHoleSkill;
	public skillLocked:fgui.GRichTextField;
	public s1:FUI_HolePropertyItem;
	public s2:FUI_HolePropertyItem;
	public s3:FUI_HolePropertyItem;
	public s4:FUI_HolePropertyItem;
	public s5:FUI_HolePropertyItem;
	public s6:FUI_HolePropertyItem;
	public s7:FUI_HolePropertyItem;
	public txt_desc:fgui.GRichTextField;
	public detailGroup:fgui.GGroup;
	public equipTips1:fgui.GTextField;
	public equipTips2:fgui.GTextField;
	public equipTipGroup:fgui.GGroup;
	public openTips:fgui.GTextField;
	public moreBg:fgui.GButton;
	public static URL:string = "ui://v98hah2olin8ipd";

	public static createInstance():FUI_HoldOptionlCom {
		return <FUI_HoldOptionlCom>(fgui.UIPackage.createObject("Skill", "HoldOptionlCom"));
	}

	protected onConstruct():void {
		this.fb = <fgui.GImage>(this.getChild("fb"));
		this.tb = <fgui.GImage>(this.getChild("tb"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.holdSkill = <FUI_RuneHoleSkill>(this.getChild("holdSkill"));
		this.skillLocked = <fgui.GRichTextField>(this.getChild("skillLocked"));
		this.s1 = <FUI_HolePropertyItem>(this.getChild("s1"));
		this.s2 = <FUI_HolePropertyItem>(this.getChild("s2"));
		this.s3 = <FUI_HolePropertyItem>(this.getChild("s3"));
		this.s4 = <FUI_HolePropertyItem>(this.getChild("s4"));
		this.s5 = <FUI_HolePropertyItem>(this.getChild("s5"));
		this.s6 = <FUI_HolePropertyItem>(this.getChild("s6"));
		this.s7 = <FUI_HolePropertyItem>(this.getChild("s7"));
		this.txt_desc = <fgui.GRichTextField>(this.getChild("txt_desc"));
		this.detailGroup = <fgui.GGroup>(this.getChild("detailGroup"));
		this.equipTips1 = <fgui.GTextField>(this.getChild("equipTips1"));
		this.equipTips2 = <fgui.GTextField>(this.getChild("equipTips2"));
		this.equipTipGroup = <fgui.GGroup>(this.getChild("equipTipGroup"));
		this.openTips = <fgui.GTextField>(this.getChild("openTips"));
		this.moreBg = <fgui.GButton>(this.getChild("moreBg"));
	}
}