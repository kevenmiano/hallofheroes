// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RvrBattleResultItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public nickNameTxt:fgui.GTextField;
	public gesteTxt:fgui.GTextField;
	public killTxt:fgui.GTextField;
	public scoreTxt:fgui.GTextField;
	public serverNameTxt:fgui.GTextField;
	public static URL:string = "ui://350g81z4ebkmy";

	public static createInstance():FUI_RvrBattleResultItem {
		return <FUI_RvrBattleResultItem>(fgui.UIPackage.createObject("RvRBattle", "RvrBattleResultItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.nickNameTxt = <fgui.GTextField>(this.getChild("nickNameTxt"));
		this.gesteTxt = <fgui.GTextField>(this.getChild("gesteTxt"));
		this.killTxt = <fgui.GTextField>(this.getChild("killTxt"));
		this.scoreTxt = <fgui.GTextField>(this.getChild("scoreTxt"));
		this.serverNameTxt = <fgui.GTextField>(this.getChild("serverNameTxt"));
	}
}