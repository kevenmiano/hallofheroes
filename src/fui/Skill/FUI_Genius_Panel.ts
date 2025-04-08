// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ComTalentsMask from "./FUI_ComTalentsMask";
import FUI_FastkeyTalent from "./FUI_FastkeyTalent";

export default class FUI_Genius_Panel extends fgui.GComponent {

	public c1:fgui.Controller;
	public telent_com:FUI_ComTalentsMask;
	public fastkey:FUI_FastkeyTalent;
	public static URL:string = "ui://v98hah2of7eoilu";

	public static createInstance():FUI_Genius_Panel {
		return <FUI_Genius_Panel>(fgui.UIPackage.createObject("Skill", "Genius_Panel"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.telent_com = <FUI_ComTalentsMask>(this.getChild("telent_com"));
		this.fastkey = <FUI_FastkeyTalent>(this.getChild("fastkey"));
	}
}