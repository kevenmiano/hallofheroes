// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetChallengeMainHeadItem extends fgui.GButton {

	public iconTick:fgui.GLoader;
	public item:fgui.GButton;
	public imgFlag:fgui.GImage;
	public txtCapacity:fgui.GTextField;
	public static URL:string = "ui://qwu5t408ysufiaq";

	public static createInstance():FUI_PetChallengeMainHeadItem {
		return <FUI_PetChallengeMainHeadItem>(fgui.UIPackage.createObject("PetChallenge", "PetChallengeMainHeadItem"));
	}

	protected onConstruct():void {
		this.iconTick = <fgui.GLoader>(this.getChild("iconTick"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this.imgFlag = <fgui.GImage>(this.getChild("imgFlag"));
		this.txtCapacity = <fgui.GTextField>(this.getChild("txtCapacity"));
	}
}