/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemoteSkillItemView extends fgui.GComponent {

	public talent:fgui.GImage;
	public _icon:fgui.GLoader;
	public _selected:fgui.GImage;
	public _locked:fgui.GImage;
	public static URL:string = "ui://dq4xsyl3tllo6";

	public static createInstance():FUI_RemoteSkillItemView {
		return <FUI_RemoteSkillItemView>(fgui.UIPackage.createObject("RemotePet", "RemoteSkillItemView"));
	}

	protected onConstruct():void {
		this.talent = <fgui.GImage>(this.getChild("talent"));
		this._icon = <fgui.GLoader>(this.getChild("_icon"));
		this._selected = <fgui.GImage>(this.getChild("_selected"));
		this._locked = <fgui.GImage>(this.getChild("_locked"));
	}
}