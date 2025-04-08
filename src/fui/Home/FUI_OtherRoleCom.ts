/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OtherRoleCom extends fgui.GComponent {

	public playerIcon:fgui.GComponent;
	public levelTxt:fgui.GTextField;
	public userNameTxt:fgui.GTextField;
	public title:fgui.GTextField;
	public dropbox:fgui.GComponent;
	public static URL:string = "ui://tny43dz1bo11htp";

	public static createInstance():FUI_OtherRoleCom {
		return <FUI_OtherRoleCom>(fgui.UIPackage.createObject("Home", "OtherRoleCom"));
	}

	protected onConstruct():void {
		this.playerIcon = <fgui.GComponent>(this.getChild("playerIcon"));
		this.levelTxt = <fgui.GTextField>(this.getChild("levelTxt"));
		this.userNameTxt = <fgui.GTextField>(this.getChild("userNameTxt"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.dropbox = <fgui.GComponent>(this.getChild("dropbox"));
	}
}