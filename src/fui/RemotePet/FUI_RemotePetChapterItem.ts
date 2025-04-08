// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_MaskIcon from "./FUI_MaskIcon";

export default class FUI_RemotePetChapterItem extends fgui.GButton {

	public normal:fgui.GLoader;
	public select:fgui.GLoader;
	public _maskIcon:FUI_MaskIcon;
	public levelLab:fgui.GTextField;
	public levelNameLab:fgui.GTextField;
	public completeLab:fgui.GTextField;
	public circleB:fgui.GImage;
	public complateFlag:fgui.GGroup;
	public changleFlag:fgui.GImage;
	public container:fgui.GGroup;
	public lockImg:fgui.GImage;
	public static URL:string = "ui://dq4xsyl3h0f62f";

	public static createInstance():FUI_RemotePetChapterItem {
		return <FUI_RemotePetChapterItem>(fgui.UIPackage.createObject("RemotePet", "RemotePetChapterItem"));
	}

	protected onConstruct():void {
		this.normal = <fgui.GLoader>(this.getChild("normal"));
		this.select = <fgui.GLoader>(this.getChild("select"));
		this._maskIcon = <FUI_MaskIcon>(this.getChild("_maskIcon"));
		this.levelLab = <fgui.GTextField>(this.getChild("levelLab"));
		this.levelNameLab = <fgui.GTextField>(this.getChild("levelNameLab"));
		this.completeLab = <fgui.GTextField>(this.getChild("completeLab"));
		this.circleB = <fgui.GImage>(this.getChild("circleB"));
		this.complateFlag = <fgui.GGroup>(this.getChild("complateFlag"));
		this.changleFlag = <fgui.GImage>(this.getChild("changleFlag"));
		this.container = <fgui.GGroup>(this.getChild("container"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
	}
}