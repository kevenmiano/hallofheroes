// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SecretGainTipCom extends fgui.GComponent {

	public txtTitle:fgui.GTextField;
	public btnNext:fgui.GButton;
	public list:fgui.GList;
	public static URL:string = "ui://7g1ccuufvtoeh";

	public static createInstance():FUI_SecretGainTipCom {
		return <FUI_SecretGainTipCom>(fgui.UIPackage.createObject("PveSecretScene", "SecretGainTipCom"));
	}

	protected onConstruct():void {
		this.txtTitle = <fgui.GTextField>(this.getChild("txtTitle"));
		this.btnNext = <fgui.GButton>(this.getChild("btnNext"));
		this.list = <fgui.GList>(this.getChild("list"));
	}
}