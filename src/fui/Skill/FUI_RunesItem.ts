/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_DragRuneIcon from "./FUI_DragRuneIcon";

export default class FUI_RunesItem extends fgui.GButton {

	public showBorder:fgui.Controller;
	public bgBox:fgui.Controller;
	public shouCount:fgui.Controller;
	public upgrade:fgui.Controller;
	public defaultSkillBoxIcon:fgui.GImage;
	public dragCom:FUI_DragRuneIcon;
	public runeIcon:fgui.GLoader;
	public select:fgui.GImage;
	public num:fgui.GTextField;
	public textNumGroup:fgui.GGroup;
	public inlayItem1:fgui.GLoader;
	public inlayItem2:fgui.GLoader;
	public inlayItem3:fgui.GLoader;
	public inlayItem4:fgui.GLoader;
	public inlayItem5:fgui.GLoader;
	public inlay_group:fgui.GGroup;
	public txt_name:fgui.GTextField;
	public equiped:fgui.GImage;
	public static URL:string = "ui://v98hah2ooicxr2";

	public static createInstance():FUI_RunesItem {
		return <FUI_RunesItem>(fgui.UIPackage.createObject("Skill", "RunesItem"));
	}

	protected onConstruct():void {
		this.showBorder = this.getController("showBorder");
		this.bgBox = this.getController("bgBox");
		this.shouCount = this.getController("shouCount");
		this.upgrade = this.getController("upgrade");
		this.defaultSkillBoxIcon = <fgui.GImage>(this.getChild("defaultSkillBoxIcon"));
		this.dragCom = <FUI_DragRuneIcon>(this.getChild("dragCom"));
		this.runeIcon = <fgui.GLoader>(this.getChild("runeIcon"));
		this.select = <fgui.GImage>(this.getChild("select"));
		this.num = <fgui.GTextField>(this.getChild("num"));
		this.textNumGroup = <fgui.GGroup>(this.getChild("textNumGroup"));
		this.inlayItem1 = <fgui.GLoader>(this.getChild("inlayItem1"));
		this.inlayItem2 = <fgui.GLoader>(this.getChild("inlayItem2"));
		this.inlayItem3 = <fgui.GLoader>(this.getChild("inlayItem3"));
		this.inlayItem4 = <fgui.GLoader>(this.getChild("inlayItem4"));
		this.inlayItem5 = <fgui.GLoader>(this.getChild("inlayItem5"));
		this.inlay_group = <fgui.GGroup>(this.getChild("inlay_group"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.equiped = <fgui.GImage>(this.getChild("equiped"));
	}
}