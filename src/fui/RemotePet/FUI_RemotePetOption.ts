/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetOption extends fgui.GComponent {

	public mopupLab:fgui.GTextField;
	public petText:fgui.GTextField;
	public petNum:fgui.GTextField;
	public _mountBtn:fgui.GButton;
	public _challengeBtn:fgui.GButton;
	public _btnAdjust:fgui.GButton;
	public petList:fgui.GList;
	public powerBtn:fgui.GButton;
	public costLab:fgui.GTextField;
	public static URL:string = "ui://dq4xsyl3h0f62c";

	public static createInstance():FUI_RemotePetOption {
		return <FUI_RemotePetOption>(fgui.UIPackage.createObject("RemotePet", "RemotePetOption"));
	}

	protected onConstruct():void {
		this.mopupLab = <fgui.GTextField>(this.getChild("mopupLab"));
		this.petText = <fgui.GTextField>(this.getChild("petText"));
		this.petNum = <fgui.GTextField>(this.getChild("petNum"));
		this._mountBtn = <fgui.GButton>(this.getChild("_mountBtn"));
		this._challengeBtn = <fgui.GButton>(this.getChild("_challengeBtn"));
		this._btnAdjust = <fgui.GButton>(this.getChild("_btnAdjust"));
		this.petList = <fgui.GList>(this.getChild("petList"));
		this.powerBtn = <fgui.GButton>(this.getChild("powerBtn"));
		this.costLab = <fgui.GTextField>(this.getChild("costLab"));
	}
}