/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ForgeRefreshItem extends fgui.GComponent {

	public bgLeft:fgui.GImage;
	public bgRight:fgui.GImage;
	public btnLock:fgui.GButton;
	public txtCur:fgui.GTextField;
	public txtNext:fgui.GTextField;
	public static URL:string = "ui://eolsofv9w6yf16";

	public static createInstance():FUI_ForgeRefreshItem {
		return <FUI_ForgeRefreshItem>(fgui.UIPackage.createObject("Forge", "ForgeRefreshItem"));
	}

	protected onConstruct():void {
		this.bgLeft = <fgui.GImage>(this.getChild("bgLeft"));
		this.bgRight = <fgui.GImage>(this.getChild("bgRight"));
		this.btnLock = <fgui.GButton>(this.getChild("btnLock"));
		this.txtCur = <fgui.GTextField>(this.getChild("txtCur"));
		this.txtNext = <fgui.GTextField>(this.getChild("txtNext"));
	}
}