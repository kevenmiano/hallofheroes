/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_LastPageBtn from "./FUI_LastPageBtn";
import FUI_NextPageBtn from "./FUI_NextPageBtn";

export default class FUI_RemotePetTurnUpView extends fgui.GComponent {

	public _lastPageBtn:FUI_LastPageBtn;
	public _nextPageBtn:FUI_NextPageBtn;
	public _line1:fgui.GImage;
	public _line2:fgui.GImage;
	public static URL:string = "ui://dq4xsyl3usc91k";

	public static createInstance():FUI_RemotePetTurnUpView {
		return <FUI_RemotePetTurnUpView>(fgui.UIPackage.createObject("RemotePet", "RemotePetTurnUpView"));
	}

	protected onConstruct():void {
		this._lastPageBtn = <FUI_LastPageBtn>(this.getChild("_lastPageBtn"));
		this._nextPageBtn = <FUI_NextPageBtn>(this.getChild("_nextPageBtn"));
		this._line1 = <fgui.GImage>(this.getChild("_line1"));
		this._line2 = <fgui.GImage>(this.getChild("_line2"));
	}
}