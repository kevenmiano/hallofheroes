// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetHeadItemView extends fgui.GComponent {

	public bg:fgui.GImage;
	public _icon:fgui.GLoader;
	public sel:fgui.GImage;
	public colorFlag:fgui.GLoader;
	public static URL:string = "ui://dq4xsyl3tllov";

	public static createInstance():FUI_RemotePetHeadItemView {
		return <FUI_RemotePetHeadItemView>(fgui.UIPackage.createObject("RemotePet", "RemotePetHeadItemView"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this._icon = <fgui.GLoader>(this.getChild("_icon"));
		this.sel = <fgui.GImage>(this.getChild("sel"));
		this.colorFlag = <fgui.GLoader>(this.getChild("colorFlag"));
	}
}