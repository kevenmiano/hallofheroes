// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetOrderItemView extends fgui.GComponent {

	public _bg:fgui.GImage;
	public rankIcon:fgui.GLoader;
	public txt_rank:fgui.GTextField;
	public txt_name:fgui.GTextField;
	public txt_pow:fgui.GTextField;
	public txt_lv:fgui.GTextField;
	public static URL:string = "ui://dq4xsyl3m8wx20";

	public static createInstance():FUI_RemotePetOrderItemView {
		return <FUI_RemotePetOrderItemView>(fgui.UIPackage.createObject("RemotePet", "RemotePetOrderItemView"));
	}

	protected onConstruct():void {
		this._bg = <fgui.GImage>(this.getChild("_bg"));
		this.rankIcon = <fgui.GLoader>(this.getChild("rankIcon"));
		this.txt_rank = <fgui.GTextField>(this.getChild("txt_rank"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_pow = <fgui.GTextField>(this.getChild("txt_pow"));
		this.txt_lv = <fgui.GTextField>(this.getChild("txt_lv"));
	}
}