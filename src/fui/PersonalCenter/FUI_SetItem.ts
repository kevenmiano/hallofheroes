// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ButtonSwitch from "./FUI_ButtonSwitch";

export default class FUI_SetItem extends fgui.GComponent {

	public btn_switch:FUI_ButtonSwitch;
	public txt_name:fgui.GRichTextField;
	public static URL:string = "ui://6watmcoiiqag12";

	public static createInstance():FUI_SetItem {
		return <FUI_SetItem>(fgui.UIPackage.createObject("PersonalCenter", "SetItem"));
	}

	protected onConstruct():void {
		this.btn_switch = <FUI_ButtonSwitch>(this.getChild("btn_switch"));
		this.txt_name = <fgui.GRichTextField>(this.getChild("txt_name"));
	}
}