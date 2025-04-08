// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetChallengeAdjustSkillItem extends fgui.GComponent {

	public _back:fgui.GImage;
	public _icon:fgui.GLoader;
	public static URL:string = "ui://qwu5t408h4lg2n";

	public static createInstance():FUI_PetChallengeAdjustSkillItem {
		return <FUI_PetChallengeAdjustSkillItem>(fgui.UIPackage.createObject("PetChallenge", "PetChallengeAdjustSkillItem"));
	}

	protected onConstruct():void {
		this._back = <fgui.GImage>(this.getChild("_back"));
		this._icon = <fgui.GLoader>(this.getChild("_icon"));
	}
}