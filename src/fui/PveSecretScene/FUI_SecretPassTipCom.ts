/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SecretPassTipCom extends fgui.GComponent {

	public txtTitle:fgui.GTextField;
	public btnConfirm:fgui.GButton;
	public list:fgui.GList;
	public static URL:string = "ui://7g1ccuufvtoei";

	public static createInstance():FUI_SecretPassTipCom {
		return <FUI_SecretPassTipCom>(fgui.UIPackage.createObject("PveSecretScene", "SecretPassTipCom"));
	}

	protected onConstruct():void {
		this.txtTitle = <fgui.GTextField>(this.getChild("txtTitle"));
		this.btnConfirm = <fgui.GButton>(this.getChild("btnConfirm"));
		this.list = <fgui.GList>(this.getChild("list"));
	}
}