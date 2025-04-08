/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetChallengeRankItem extends fgui.GButton {

	public imgRank:fgui.GLoader;
	public txtRank:fgui.GTextField;
	public txtScore:fgui.GTextField;
	public txtUserName:fgui.GTextField;
	public txtTotalFightPower:fgui.GTextField;
	public petList:fgui.GList;
	public static URL:string = "ui://qwu5t408ysufiaz";

	public static createInstance():FUI_PetChallengeRankItem {
		return <FUI_PetChallengeRankItem>(fgui.UIPackage.createObject("PetChallenge", "PetChallengeRankItem"));
	}

	protected onConstruct():void {
		this.imgRank = <fgui.GLoader>(this.getChild("imgRank"));
		this.txtRank = <fgui.GTextField>(this.getChild("txtRank"));
		this.txtScore = <fgui.GTextField>(this.getChild("txtScore"));
		this.txtUserName = <fgui.GTextField>(this.getChild("txtUserName"));
		this.txtTotalFightPower = <fgui.GTextField>(this.getChild("txtTotalFightPower"));
		this.petList = <fgui.GList>(this.getChild("petList"));
	}
}