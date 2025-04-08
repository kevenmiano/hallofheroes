// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoldRuneItem2 from "./FUI_RuneHoldRuneItem2";

export default class FUI_RuneOptionCom extends fgui.GComponent {

	public fb:fgui.GImage;
	public tb:fgui.GImage;
	public title:fgui.GTextField;
	public runeItem:FUI_RuneHoldRuneItem2;
	public openLockBtn:fgui.GButton;
	public levelUpBtn:fgui.GButton;
	public replaceBtn:fgui.GButton;
	public equipBtn:fgui.GButton;
	public btn_getGem:fgui.GButton;
	public optionGroup:fgui.GGroup;
	public arrow:fgui.GImage;
	public levelTxt:fgui.GRichTextField;
	public nextLevelTxt:fgui.GRichTextField;
	public s1:fgui.GRichTextField;
	public sa1:fgui.GRichTextField;
	public s2:fgui.GRichTextField;
	public sa2:fgui.GRichTextField;
	public a2:fgui.GImage;
	public a1:fgui.GImage;
	public u1:fgui.GTextField;
	public u2:fgui.GTextField;
	public maxHideGroup:fgui.GGroup;
	public detailGroup:fgui.GGroup;
	public tipItem1:fgui.GButton;
	public propCost:fgui.GTextField;
	public ppropGroup:fgui.GGroup;
	public tipItem2:fgui.GButton;
	public lockedCost:fgui.GTextField;
	public costGroup:fgui.GGroup;
	public static URL:string = "ui://v98hah2olin8ipe";

	public static createInstance():FUI_RuneOptionCom {
		return <FUI_RuneOptionCom>(fgui.UIPackage.createObject("Skill", "RuneOptionCom"));
	}

	protected onConstruct():void {
		this.fb = <fgui.GImage>(this.getChild("fb"));
		this.tb = <fgui.GImage>(this.getChild("tb"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.runeItem = <FUI_RuneHoldRuneItem2>(this.getChild("runeItem"));
		this.openLockBtn = <fgui.GButton>(this.getChild("openLockBtn"));
		this.levelUpBtn = <fgui.GButton>(this.getChild("levelUpBtn"));
		this.replaceBtn = <fgui.GButton>(this.getChild("replaceBtn"));
		this.equipBtn = <fgui.GButton>(this.getChild("equipBtn"));
		this.btn_getGem = <fgui.GButton>(this.getChild("btn_getGem"));
		this.optionGroup = <fgui.GGroup>(this.getChild("optionGroup"));
		this.arrow = <fgui.GImage>(this.getChild("arrow"));
		this.levelTxt = <fgui.GRichTextField>(this.getChild("levelTxt"));
		this.nextLevelTxt = <fgui.GRichTextField>(this.getChild("nextLevelTxt"));
		this.s1 = <fgui.GRichTextField>(this.getChild("s1"));
		this.sa1 = <fgui.GRichTextField>(this.getChild("sa1"));
		this.s2 = <fgui.GRichTextField>(this.getChild("s2"));
		this.sa2 = <fgui.GRichTextField>(this.getChild("sa2"));
		this.a2 = <fgui.GImage>(this.getChild("a2"));
		this.a1 = <fgui.GImage>(this.getChild("a1"));
		this.u1 = <fgui.GTextField>(this.getChild("u1"));
		this.u2 = <fgui.GTextField>(this.getChild("u2"));
		this.maxHideGroup = <fgui.GGroup>(this.getChild("maxHideGroup"));
		this.detailGroup = <fgui.GGroup>(this.getChild("detailGroup"));
		this.tipItem1 = <fgui.GButton>(this.getChild("tipItem1"));
		this.propCost = <fgui.GTextField>(this.getChild("propCost"));
		this.ppropGroup = <fgui.GGroup>(this.getChild("ppropGroup"));
		this.tipItem2 = <fgui.GButton>(this.getChild("tipItem2"));
		this.lockedCost = <fgui.GTextField>(this.getChild("lockedCost"));
		this.costGroup = <fgui.GGroup>(this.getChild("costGroup"));
	}
}