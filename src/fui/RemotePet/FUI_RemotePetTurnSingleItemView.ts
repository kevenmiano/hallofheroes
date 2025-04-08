/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetTurnSingleItemView extends fgui.GComponent {

	public _bg:fgui.GImage;
	public item:fgui.GButton;
	public static URL:string = "ui://dq4xsyl3m8wx1z";

	public static createInstance():FUI_RemotePetTurnSingleItemView {
		return <FUI_RemotePetTurnSingleItemView>(fgui.UIPackage.createObject("RemotePet", "RemotePetTurnSingleItemView"));
	}

	protected onConstruct():void {
		this._bg = <fgui.GImage>(this.getChild("_bg"));
		this.item = <fgui.GButton>(this.getChild("item"));
	}
}