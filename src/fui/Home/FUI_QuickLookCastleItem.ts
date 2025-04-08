/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QuickLookCastleItem extends fgui.GComponent {

	public btnLookCastle:fgui.GButton;
	public title:fgui.GTextField;
	public static URL:string = "ui://tny43dz1wwdkmj3k";

	public static createInstance():FUI_QuickLookCastleItem {
		return <FUI_QuickLookCastleItem>(fgui.UIPackage.createObject("Home", "QuickLookCastleItem"));
	}

	protected onConstruct():void {
		this.btnLookCastle = <fgui.GButton>(this.getChild("btnLookCastle"));
		this.title = <fgui.GTextField>(this.getChild("title"));
	}
}