/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WorldBossRankItem extends fgui.GComponent {

	public rankTxt:fgui.GTextField;
	public userNameTxt:fgui.GTextField;
	public scoreTxt:fgui.GTextField;
	public static URL:string = "ui://ai3g0shzukhia";

	public static createInstance():FUI_WorldBossRankItem {
		return <FUI_WorldBossRankItem>(fgui.UIPackage.createObject("WorldBoss", "WorldBossRankItem"));
	}

	protected onConstruct():void {
		this.rankTxt = <fgui.GTextField>(this.getChild("rankTxt"));
		this.userNameTxt = <fgui.GTextField>(this.getChild("userNameTxt"));
		this.scoreTxt = <fgui.GTextField>(this.getChild("scoreTxt"));
	}
}