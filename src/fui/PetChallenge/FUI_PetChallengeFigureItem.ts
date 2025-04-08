// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetChallengeFigureItem extends fgui.GComponent {

	public txtRank:fgui.GTextField;
	public btnChanllenge:fgui.GButton;
	public container:fgui.GComponent;
	public imgFlag:fgui.GImage;
	public txtScore:fgui.GTextField;
	public txtScoreValue:fgui.GTextField;
	public txtCapacity:fgui.GTextField;
	public txtName:fgui.GTextField;
	public gTitle:fgui.GGroup;
	public static URL:string = "ui://qwu5t408ysufa";

	public static createInstance():FUI_PetChallengeFigureItem {
		return <FUI_PetChallengeFigureItem>(fgui.UIPackage.createObject("PetChallenge", "PetChallengeFigureItem"));
	}

	protected onConstruct():void {
		this.txtRank = <fgui.GTextField>(this.getChild("txtRank"));
		this.btnChanllenge = <fgui.GButton>(this.getChild("btnChanllenge"));
		this.container = <fgui.GComponent>(this.getChild("container"));
		this.imgFlag = <fgui.GImage>(this.getChild("imgFlag"));
		this.txtScore = <fgui.GTextField>(this.getChild("txtScore"));
		this.txtScoreValue = <fgui.GTextField>(this.getChild("txtScoreValue"));
		this.txtCapacity = <fgui.GTextField>(this.getChild("txtCapacity"));
		this.txtName = <fgui.GTextField>(this.getChild("txtName"));
		this.gTitle = <fgui.GGroup>(this.getChild("gTitle"));
	}
}