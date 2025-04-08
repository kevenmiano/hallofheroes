// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetChallengeRankHeadItem extends fgui.GButton {

	public item:fgui.GButton;
	public imgFlag:fgui.GImage;
	public static URL:string = "ui://qwu5t408ysufq";

	public static createInstance():FUI_PetChallengeRankHeadItem {
		return <FUI_PetChallengeRankHeadItem>(fgui.UIPackage.createObject("PetChallenge", "PetChallengeRankHeadItem"));
	}

	protected onConstruct():void {
		this.item = <fgui.GButton>(this.getChild("item"));
		this.imgFlag = <fgui.GImage>(this.getChild("imgFlag"));
	}
}