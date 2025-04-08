/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardFigureMemItem extends fgui.GComponent {

	public self:fgui.Controller;
	public rankCtr:fgui.Controller;
	public consortiaNameTxt:fgui.GTextField;
	public pawnLeftTxt:fgui.GTextField;
	public pawnLeftValueTxt:fgui.GTextField;
	public scoreTxt:fgui.GTextField;
	public scoreValueTxt:fgui.GTextField;
	public rotationGroup:fgui.GGroup;
	public attackBtn:fgui.GButton;
	public static URL:string = "ui://w1giibvbfer36hidb";

	public static createInstance():FUI_OutyardFigureMemItem {
		return <FUI_OutyardFigureMemItem>(fgui.UIPackage.createObject("OutYard", "OutyardFigureMemItem"));
	}

	protected onConstruct():void {
		this.self = this.getController("self");
		this.rankCtr = this.getController("rankCtr");
		this.consortiaNameTxt = <fgui.GTextField>(this.getChild("consortiaNameTxt"));
		this.pawnLeftTxt = <fgui.GTextField>(this.getChild("pawnLeftTxt"));
		this.pawnLeftValueTxt = <fgui.GTextField>(this.getChild("pawnLeftValueTxt"));
		this.scoreTxt = <fgui.GTextField>(this.getChild("scoreTxt"));
		this.scoreValueTxt = <fgui.GTextField>(this.getChild("scoreValueTxt"));
		this.rotationGroup = <fgui.GGroup>(this.getChild("rotationGroup"));
		this.attackBtn = <fgui.GButton>(this.getChild("attackBtn"));
	}
}