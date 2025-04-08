/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_PetSkillItem from "./FUI_PetSkillItem";

export default class FUI_PetFastSkillItem extends fgui.GComponent {

	public indexTxt:fgui.GTextField;
	public item:FUI_PetSkillItem;
	public selectFlag:fgui.GImage;
	public selectBorder:fgui.GImage;
	public static URL:string = "ui://4x3i47txgwinirb";

	public static createInstance():FUI_PetFastSkillItem {
		return <FUI_PetFastSkillItem>(fgui.UIPackage.createObject("BaseCommon", "PetFastSkillItem"));
	}

	protected onConstruct():void {
		this.indexTxt = <fgui.GTextField>(this.getChild("indexTxt"));
		this.item = <FUI_PetSkillItem>(this.getChild("item"));
		this.selectFlag = <fgui.GImage>(this.getChild("selectFlag"));
		this.selectBorder = <fgui.GImage>(this.getChild("selectBorder"));
	}
}