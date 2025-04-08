// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_DragIconCom from "./FUI_DragIconCom";

export default class FUI_SkillItemCom extends fgui.GButton {

	public upgrade:fgui.Controller;
	public dragCom:FUI_DragIconCom;
	public defaultSkillBoxIcon:fgui.GImage;
	public equiped:fgui.GImage;
	public S:fgui.GImage;
	public passiveSkillBoxIcon:fgui.GImage;
	public passiveSkillBox:fgui.GGroup;
	public num:fgui.GTextField;
	public skillLevelBox:fgui.GGroup;
	public selectBorder:fgui.GImage;
	public txt_name:fgui.GTextField;
	public static URL:string = "ui://v98hah2obwl5m";

	public static createInstance():FUI_SkillItemCom {
		return <FUI_SkillItemCom>(fgui.UIPackage.createObject("Skill", "SkillItemCom"));
	}

	protected onConstruct():void {
		this.upgrade = this.getController("upgrade");
		this.dragCom = <FUI_DragIconCom>(this.getChild("dragCom"));
		this.defaultSkillBoxIcon = <fgui.GImage>(this.getChild("defaultSkillBoxIcon"));
		this.equiped = <fgui.GImage>(this.getChild("equiped"));
		this.S = <fgui.GImage>(this.getChild("S"));
		this.passiveSkillBoxIcon = <fgui.GImage>(this.getChild("passiveSkillBoxIcon"));
		this.passiveSkillBox = <fgui.GGroup>(this.getChild("passiveSkillBox"));
		this.num = <fgui.GTextField>(this.getChild("num"));
		this.skillLevelBox = <fgui.GGroup>(this.getChild("skillLevelBox"));
		this.selectBorder = <fgui.GImage>(this.getChild("selectBorder"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
	}
}