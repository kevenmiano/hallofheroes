// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetTurnDownView extends fgui.GComponent {

	public t1:fgui.GImage;
	public t2:fgui.GImage;
	public _curLvText:fgui.GTextField;
	public _maxLvText:fgui.GTextField;
	public _curLvNum:fgui.GTextField;
	public _maxLvNum:fgui.GTextField;
	public _btnRank:fgui.GButton;
	public _btnReward:fgui.GButton;
	public _btnAdjust:fgui.GButton;
	public _btnMopup:fgui.GButton;
	public _petList:fgui.GList;
	public static URL:string = "ui://dq4xsyl3usc91j";

	public static createInstance():FUI_RemotePetTurnDownView {
		return <FUI_RemotePetTurnDownView>(fgui.UIPackage.createObject("RemotePet", "RemotePetTurnDownView"));
	}

	protected onConstruct():void {
		this.t1 = <fgui.GImage>(this.getChild("t1"));
		this.t2 = <fgui.GImage>(this.getChild("t2"));
		this._curLvText = <fgui.GTextField>(this.getChild("_curLvText"));
		this._maxLvText = <fgui.GTextField>(this.getChild("_maxLvText"));
		this._curLvNum = <fgui.GTextField>(this.getChild("_curLvNum"));
		this._maxLvNum = <fgui.GTextField>(this.getChild("_maxLvNum"));
		this._btnRank = <fgui.GButton>(this.getChild("_btnRank"));
		this._btnReward = <fgui.GButton>(this.getChild("_btnReward"));
		this._btnAdjust = <fgui.GButton>(this.getChild("_btnAdjust"));
		this._btnMopup = <fgui.GButton>(this.getChild("_btnMopup"));
		this._petList = <fgui.GList>(this.getChild("_petList"));
	}
}