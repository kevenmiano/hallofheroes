// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoleSkill from "./FUI_RuneHoleSkill";
import FUI_RuneHoldEffectLock2 from "./FUI_RuneHoldEffectLock2";

export default class FUI_HoldEffectOptionlCom extends fgui.GComponent {

	public costPos:fgui.Controller;
	public fb:fgui.GImage;
	public tb:fgui.GImage;
	public title:fgui.GTextField;
	public curSkill:FUI_RuneHoleSkill;
	public saveSkill:FUI_RuneHoleSkill;
	public curLvPointBg:fgui.GImage;
	public curLv:fgui.GTextField;
	public nextLvPointBg:fgui.GImage;
	public nextLv:fgui.GTextField;
	public arrow:fgui.GImage;
	public nextFlag:fgui.GGroup;
	public levelupDetail:fgui.GGroup;
	public openTipBg:fgui.GImage;
	public openTips:fgui.GTextField;
	public noEffectTips:fgui.GRichTextField;
	public lockedGroup:fgui.GGroup;
	public effectItem:FUI_RuneHoldEffectLock2;
	public saveBtn:fgui.GButton;
	public valueBtn:fgui.GButton;
	public optionBtns:fgui.GGroup;
	public runeCarve:fgui.GButton;
	public costTxt:fgui.GTextField;
	public costGroup:fgui.GGroup;
	public static URL:string = "ui://v98hah2olin8ipg";

	public static createInstance():FUI_HoldEffectOptionlCom {
		return <FUI_HoldEffectOptionlCom>(fgui.UIPackage.createObject("Skill", "HoldEffectOptionlCom"));
	}

	protected onConstruct():void {
		this.costPos = this.getController("costPos");
		this.fb = <fgui.GImage>(this.getChild("fb"));
		this.tb = <fgui.GImage>(this.getChild("tb"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.curSkill = <FUI_RuneHoleSkill>(this.getChild("curSkill"));
		this.saveSkill = <FUI_RuneHoleSkill>(this.getChild("saveSkill"));
		this.curLvPointBg = <fgui.GImage>(this.getChild("curLvPointBg"));
		this.curLv = <fgui.GTextField>(this.getChild("curLv"));
		this.nextLvPointBg = <fgui.GImage>(this.getChild("nextLvPointBg"));
		this.nextLv = <fgui.GTextField>(this.getChild("nextLv"));
		this.arrow = <fgui.GImage>(this.getChild("arrow"));
		this.nextFlag = <fgui.GGroup>(this.getChild("nextFlag"));
		this.levelupDetail = <fgui.GGroup>(this.getChild("levelupDetail"));
		this.openTipBg = <fgui.GImage>(this.getChild("openTipBg"));
		this.openTips = <fgui.GTextField>(this.getChild("openTips"));
		this.noEffectTips = <fgui.GRichTextField>(this.getChild("noEffectTips"));
		this.lockedGroup = <fgui.GGroup>(this.getChild("lockedGroup"));
		this.effectItem = <FUI_RuneHoldEffectLock2>(this.getChild("effectItem"));
		this.saveBtn = <fgui.GButton>(this.getChild("saveBtn"));
		this.valueBtn = <fgui.GButton>(this.getChild("valueBtn"));
		this.optionBtns = <fgui.GGroup>(this.getChild("optionBtns"));
		this.runeCarve = <fgui.GButton>(this.getChild("runeCarve"));
		this.costTxt = <fgui.GTextField>(this.getChild("costTxt"));
		this.costGroup = <fgui.GGroup>(this.getChild("costGroup"));
	}
}