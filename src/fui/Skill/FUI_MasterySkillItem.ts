// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SkillItemCom from "./FUI_SkillItemCom";

export default class FUI_MasterySkillItem extends fgui.GComponent {

	public secretCtrl:fgui.Controller;
	public lockedCtrl:fgui.Controller;
	public mbg:fgui.GImage;
	public sbg:fgui.GImage;
	public wbg:fgui.GImage;
	public ubg:fgui.GImage;
	public skill0:FUI_SkillItemCom;
	public skill1:FUI_SkillItemCom;
	public skill2:FUI_SkillItemCom;
	public skill3:FUI_SkillItemCom;
	public skill4:FUI_SkillItemCom;
	public skill5:FUI_SkillItemCom;
	public skillsGroup:fgui.GGroup;
	public nameLab:fgui.GTextField;
	public lvLab:fgui.GTextField;
	public unlockLab:fgui.GTextField;
	public lockedMask:fgui.GImage;
	public secreBtn:fgui.GButton;
	public secretGroup:fgui.GGroup;
	public tipsLab:fgui.GTextField;
	public secreBtn2:fgui.GButton;
	public static URL:string = "ui://v98hah2opv1firi";

	public static createInstance():FUI_MasterySkillItem {
		return <FUI_MasterySkillItem>(fgui.UIPackage.createObject("Skill", "MasterySkillItem"));
	}

	protected onConstruct():void {
		this.secretCtrl = this.getController("secretCtrl");
		this.lockedCtrl = this.getController("lockedCtrl");
		this.mbg = <fgui.GImage>(this.getChild("mbg"));
		this.sbg = <fgui.GImage>(this.getChild("sbg"));
		this.wbg = <fgui.GImage>(this.getChild("wbg"));
		this.ubg = <fgui.GImage>(this.getChild("ubg"));
		this.skill0 = <FUI_SkillItemCom>(this.getChild("skill0"));
		this.skill1 = <FUI_SkillItemCom>(this.getChild("skill1"));
		this.skill2 = <FUI_SkillItemCom>(this.getChild("skill2"));
		this.skill3 = <FUI_SkillItemCom>(this.getChild("skill3"));
		this.skill4 = <FUI_SkillItemCom>(this.getChild("skill4"));
		this.skill5 = <FUI_SkillItemCom>(this.getChild("skill5"));
		this.skillsGroup = <fgui.GGroup>(this.getChild("skillsGroup"));
		this.nameLab = <fgui.GTextField>(this.getChild("nameLab"));
		this.lvLab = <fgui.GTextField>(this.getChild("lvLab"));
		this.unlockLab = <fgui.GTextField>(this.getChild("unlockLab"));
		this.lockedMask = <fgui.GImage>(this.getChild("lockedMask"));
		this.secreBtn = <fgui.GButton>(this.getChild("secreBtn"));
		this.secretGroup = <fgui.GGroup>(this.getChild("secretGroup"));
		this.tipsLab = <fgui.GTextField>(this.getChild("tipsLab"));
		this.secreBtn2 = <fgui.GButton>(this.getChild("secreBtn2"));
	}
}