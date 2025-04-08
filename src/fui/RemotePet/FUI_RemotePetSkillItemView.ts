/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetSkillItemView extends fgui.GComponent {

	public _back:fgui.GImage;
	public _icon:fgui.GLoader;
	public static URL:string = "ui://dq4xsyl3tllox";

	public static createInstance():FUI_RemotePetSkillItemView {
		return <FUI_RemotePetSkillItemView>(fgui.UIPackage.createObject("RemotePet", "RemotePetSkillItemView"));
	}

	protected onConstruct():void {
		this._back = <fgui.GImage>(this.getChild("_back"));
		this._icon = <fgui.GLoader>(this.getChild("_icon"));
	}
}