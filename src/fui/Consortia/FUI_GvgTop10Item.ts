/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GvgTop10Item extends fgui.GComponent {

	public _indexTxt:fgui.GTextField;
	public _nickNameTxt:fgui.GTextField;
	public _woundTxt:fgui.GTextField;
	public _job:fgui.GLoader;
	public static URL:string = "ui://8w3m5duwpdrqi9k";

	public static createInstance():FUI_GvgTop10Item {
		return <FUI_GvgTop10Item>(fgui.UIPackage.createObject("Consortia", "GvgTop10Item"));
	}

	protected onConstruct():void {
		this._indexTxt = <fgui.GTextField>(this.getChild("_indexTxt"));
		this._nickNameTxt = <fgui.GTextField>(this.getChild("_nickNameTxt"));
		this._woundTxt = <fgui.GTextField>(this.getChild("_woundTxt"));
		this._job = <fgui.GLoader>(this.getChild("_job"));
	}
}