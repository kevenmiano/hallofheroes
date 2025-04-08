/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_PetInfoItem from "./FUI_PetInfoItem";

export default class FUI_PetInfoView extends fgui.GComponent {

	public imgHp:fgui.GImage;
	public txtHp:fgui.GTextField;
	public bufferList:fgui.GList;
	public p1:FUI_PetInfoItem;
	public p2:FUI_PetInfoItem;
	public p3:FUI_PetInfoItem;
	public currentPetIcon:fgui.GLoader;
	public static URL:string = "ui://tybyzkwzhp9vmif3";

	public static createInstance():FUI_PetInfoView {
		return <FUI_PetInfoView>(fgui.UIPackage.createObject("Battle", "PetInfoView"));
	}

	protected onConstruct():void {
		this.imgHp = <fgui.GImage>(this.getChild("imgHp"));
		this.txtHp = <fgui.GTextField>(this.getChild("txtHp"));
		this.bufferList = <fgui.GList>(this.getChild("bufferList"));
		this.p1 = <FUI_PetInfoItem>(this.getChild("p1"));
		this.p2 = <FUI_PetInfoItem>(this.getChild("p2"));
		this.p3 = <FUI_PetInfoItem>(this.getChild("p3"));
		this.currentPetIcon = <fgui.GLoader>(this.getChild("currentPetIcon"));
	}
}