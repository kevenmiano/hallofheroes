/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetTurnMap extends fgui.GComponent {

	public _map:fgui.GLoader;
	public static URL:string = "ui://dq4xsyl3usc91i";

	public static createInstance():FUI_RemotePetTurnMap {
		return <FUI_RemotePetTurnMap>(fgui.UIPackage.createObject("RemotePet", "RemotePetTurnMap"));
	}

	protected onConstruct():void {
		this._map = <fgui.GLoader>(this.getChild("_map"));
	}
}