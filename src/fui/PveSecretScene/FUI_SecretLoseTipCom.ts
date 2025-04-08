/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SecretLoseTipCom extends fgui.GComponent {

	public txtTitle:fgui.GTextField;
	public btnContinue:fgui.GButton;
	public list:fgui.GList;
	public static URL:string = "ui://7g1ccuufvtoek";

	public static createInstance():FUI_SecretLoseTipCom {
		return <FUI_SecretLoseTipCom>(fgui.UIPackage.createObject("PveSecretScene", "SecretLoseTipCom"));
	}

	protected onConstruct():void {
		this.txtTitle = <fgui.GTextField>(this.getChild("txtTitle"));
		this.btnContinue = <fgui.GButton>(this.getChild("btnContinue"));
		this.list = <fgui.GList>(this.getChild("list"));
	}
}