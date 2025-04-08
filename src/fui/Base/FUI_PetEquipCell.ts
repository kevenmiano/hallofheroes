/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_PetEquipCell extends fgui.GButton {

	public cSelected:fgui.Controller;
	public stateCtrl:fgui.Controller;
	public bg:fgui.GImage;
	public part_icon:fgui.GLoader;
	public baseItem:FUI_BaseItem;
	public imgStarBg:fgui.GImage;
	public list:fgui.GList;
	public txtLevel:fgui.GTextField;
	public img_gray:fgui.GGraph;
	public heroEquipIcon:fgui.GImage;
	public img_lock:fgui.GImage;
	public static URL:string = "ui://og5jeos3jvvtigy";

	public static createInstance():FUI_PetEquipCell {
		return <FUI_PetEquipCell>(fgui.UIPackage.createObject("Base", "PetEquipCell"));
	}

	protected onConstruct():void {
		this.cSelected = this.getController("cSelected");
		this.stateCtrl = this.getController("stateCtrl");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.part_icon = <fgui.GLoader>(this.getChild("part_icon"));
		this.baseItem = <FUI_BaseItem>(this.getChild("baseItem"));
		this.imgStarBg = <fgui.GImage>(this.getChild("imgStarBg"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.txtLevel = <fgui.GTextField>(this.getChild("txtLevel"));
		this.img_gray = <fgui.GGraph>(this.getChild("img_gray"));
		this.heroEquipIcon = <fgui.GImage>(this.getChild("heroEquipIcon"));
		this.img_lock = <fgui.GImage>(this.getChild("img_lock"));
	}
}