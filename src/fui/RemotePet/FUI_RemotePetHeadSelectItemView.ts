/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetHeadSelectItemView extends fgui.GComponent {

	public _icon:fgui.GLoader;
	public imgProfile:fgui.GLoader;
	public lv_bg:fgui.GImage;
	public _lvNum:fgui.GTextField;
	public static URL:string = "ui://dq4xsyl3usc91q";

	public static createInstance():FUI_RemotePetHeadSelectItemView {
		return <FUI_RemotePetHeadSelectItemView>(fgui.UIPackage.createObject("RemotePet", "RemotePetHeadSelectItemView"));
	}

	protected onConstruct():void {
		this._icon = <fgui.GLoader>(this.getChild("_icon"));
		this.imgProfile = <fgui.GLoader>(this.getChild("imgProfile"));
		this.lv_bg = <fgui.GImage>(this.getChild("lv_bg"));
		this._lvNum = <fgui.GTextField>(this.getChild("_lvNum"));
	}
}