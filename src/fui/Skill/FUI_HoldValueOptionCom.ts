// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoldValueLock2 from "./FUI_RuneHoldValueLock2";

export default class FUI_HoldValueOptionCom extends fgui.GComponent {

	public fb:fgui.GImage;
	public tb:fgui.GImage;
	public title:fgui.GTextField;
	public valueItem:FUI_RuneHoldValueLock2;
	public valueBtn:fgui.GButton;
	public curLvBg:fgui.GImage;
	public curLvPointBg:fgui.GImage;
	public curLv:fgui.GTextField;
	public nextLvBg:fgui.GImage;
	public nextLvPointBg:fgui.GImage;
	public nextLv:fgui.GTextField;
	public arrow:fgui.GImage;
	public curDesc:fgui.GTextField;
	public nextDesc:fgui.GTextField;
	public levelupDetail:fgui.GGroup;
	public openTipBg:fgui.GImage;
	public openTips:fgui.GTextField;
	public lockedGroup:fgui.GGroup;
	public runeCarve:fgui.GButton;
	public costTxt:fgui.GTextField;
	public costGroup:fgui.GGroup;
	public static URL:string = "ui://v98hah2olin8ipf";

	public static createInstance():FUI_HoldValueOptionCom {
		return <FUI_HoldValueOptionCom>(fgui.UIPackage.createObject("Skill", "HoldValueOptionCom"));
	}

	protected onConstruct():void {
		this.fb = <fgui.GImage>(this.getChild("fb"));
		this.tb = <fgui.GImage>(this.getChild("tb"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.valueItem = <FUI_RuneHoldValueLock2>(this.getChild("valueItem"));
		this.valueBtn = <fgui.GButton>(this.getChild("valueBtn"));
		this.curLvBg = <fgui.GImage>(this.getChild("curLvBg"));
		this.curLvPointBg = <fgui.GImage>(this.getChild("curLvPointBg"));
		this.curLv = <fgui.GTextField>(this.getChild("curLv"));
		this.nextLvBg = <fgui.GImage>(this.getChild("nextLvBg"));
		this.nextLvPointBg = <fgui.GImage>(this.getChild("nextLvPointBg"));
		this.nextLv = <fgui.GTextField>(this.getChild("nextLv"));
		this.arrow = <fgui.GImage>(this.getChild("arrow"));
		this.curDesc = <fgui.GTextField>(this.getChild("curDesc"));
		this.nextDesc = <fgui.GTextField>(this.getChild("nextDesc"));
		this.levelupDetail = <fgui.GGroup>(this.getChild("levelupDetail"));
		this.openTipBg = <fgui.GImage>(this.getChild("openTipBg"));
		this.openTips = <fgui.GTextField>(this.getChild("openTips"));
		this.lockedGroup = <fgui.GGroup>(this.getChild("lockedGroup"));
		this.runeCarve = <fgui.GButton>(this.getChild("runeCarve"));
		this.costTxt = <fgui.GTextField>(this.getChild("costTxt"));
		this.costGroup = <fgui.GGroup>(this.getChild("costGroup"));
	}
}