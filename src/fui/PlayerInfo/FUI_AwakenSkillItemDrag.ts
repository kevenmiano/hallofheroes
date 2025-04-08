// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AwakenSkillItemDrag extends fgui.GButton {

	public baseIcon:fgui.GButton;
	public imgFlag:fgui.GLoader;
	public static URL:string = "ui://i5djjunl54n6iae";

	public static createInstance():FUI_AwakenSkillItemDrag {
		return <FUI_AwakenSkillItemDrag>(fgui.UIPackage.createObject("PlayerInfo", "AwakenSkillItemDrag"));
	}

	protected onConstruct():void {
		this.baseIcon = <fgui.GButton>(this.getChild("baseIcon"));
		this.imgFlag = <fgui.GLoader>(this.getChild("imgFlag"));
	}
}