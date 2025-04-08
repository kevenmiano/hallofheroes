/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetRewardItem extends fgui.GComponent {

	public _item:fgui.GButton;
	public static URL:string = "ui://dq4xsyl3h0f62b";

	public static createInstance():FUI_RemotePetRewardItem {
		return <FUI_RemotePetRewardItem>(fgui.UIPackage.createObject("RemotePet", "RemotePetRewardItem"));
	}

	protected onConstruct():void {
		this._item = <fgui.GButton>(this.getChild("_item"));
	}
}