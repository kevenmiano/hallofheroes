/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_StarItem extends fgui.GComponent {

	public txtName:fgui.GTextField;
	public txtLevel:fgui.GTextField;
	public imgLock:fgui.GLoader;
	public static URL:string = "ui://gy6qelnhpwq0a";

	public static createInstance():FUI_StarItem {
		return <FUI_StarItem>(fgui.UIPackage.createObject("Star", "StarItem"));
	}

	protected onConstruct():void {
		this.txtName = <fgui.GTextField>(this.getChild("txtName"));
		this.txtLevel = <fgui.GTextField>(this.getChild("txtLevel"));
		this.imgLock = <fgui.GLoader>(this.getChild("imgLock"));
	}
}