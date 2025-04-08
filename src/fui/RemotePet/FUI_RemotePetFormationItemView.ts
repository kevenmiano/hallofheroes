// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetFormationItemView extends fgui.GComponent {

	public _rolestage:fgui.GImage;
	public normal_platform:fgui.GImage;
	public sel_platform:fgui.GImage;
	public container:fgui.GComponent;
	public txtName:fgui.GTextField;
	public static URL:string = "ui://dq4xsyl36mxo1d";

	public static createInstance():FUI_RemotePetFormationItemView {
		return <FUI_RemotePetFormationItemView>(fgui.UIPackage.createObject("RemotePet", "RemotePetFormationItemView"));
	}

	protected onConstruct():void {
		this._rolestage = <fgui.GImage>(this.getChild("_rolestage"));
		this.normal_platform = <fgui.GImage>(this.getChild("normal_platform"));
		this.sel_platform = <fgui.GImage>(this.getChild("sel_platform"));
		this.container = <fgui.GComponent>(this.getChild("container"));
		this.txtName = <fgui.GTextField>(this.getChild("txtName"));
	}
}