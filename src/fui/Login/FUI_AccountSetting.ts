/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_LoginAccountBtn from "./FUI_LoginAccountBtn";

export default class FUI_AccountSetting extends fgui.GComponent {

	public btn_account:FUI_LoginAccountBtn;
	public btn_region:FUI_LoginAccountBtn;
	public static URL:string = "ui://2ydb9fb2inojsmhiha";

	public static createInstance():FUI_AccountSetting {
		return <FUI_AccountSetting>(fgui.UIPackage.createObject("Login", "AccountSetting"));
	}

	protected onConstruct():void {
		this.btn_account = <FUI_LoginAccountBtn>(this.getChild("btn_account"));
		this.btn_region = <FUI_LoginAccountBtn>(this.getChild("btn_region"));
	}
}