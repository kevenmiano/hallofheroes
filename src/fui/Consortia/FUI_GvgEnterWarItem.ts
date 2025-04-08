/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GvgEnterWarItem extends fgui.GComponent {

	public state:fgui.Controller;
	public _captionIcon:fgui.GImage;
	public _jobIcon:fgui.GLoader;
	public _vipIcon:fgui.GImage;
	public txt_name:fgui.GTextField;
	public txt_lv:fgui.GTextField;
	public txt_state:fgui.GTextField;
	public txt_power:fgui.GTextField;
	public _delBtn:fgui.GButton;
	public static URL:string = "ui://8w3m5duws4bpi8x";

	public static createInstance():FUI_GvgEnterWarItem {
		return <FUI_GvgEnterWarItem>(fgui.UIPackage.createObject("Consortia", "GvgEnterWarItem"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this._captionIcon = <fgui.GImage>(this.getChild("_captionIcon"));
		this._jobIcon = <fgui.GLoader>(this.getChild("_jobIcon"));
		this._vipIcon = <fgui.GImage>(this.getChild("_vipIcon"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_lv = <fgui.GTextField>(this.getChild("txt_lv"));
		this.txt_state = <fgui.GTextField>(this.getChild("txt_state"));
		this.txt_power = <fgui.GTextField>(this.getChild("txt_power"));
		this._delBtn = <fgui.GButton>(this.getChild("_delBtn"));
	}
}