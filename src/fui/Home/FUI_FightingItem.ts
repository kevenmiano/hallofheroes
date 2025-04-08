/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FightingItem extends fgui.GComponent {

	public state:fgui.Controller;
	public bg:fgui.GImage;
	public typeIcon:fgui.GLoader;
	public nameTxt:fgui.GTextField;
	public scoreValueTxt:fgui.GTextField;
	public scoreTxt:fgui.GTextField;
	public descTxt:fgui.GTextField;
	public lookInfoBtn:fgui.GButton;
	public upBtn:fgui.GButton;
	public static URL:string = "ui://tny43dz1g2sehue";

	public static createInstance():FUI_FightingItem {
		return <FUI_FightingItem>(fgui.UIPackage.createObject("Home", "FightingItem"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.typeIcon = <fgui.GLoader>(this.getChild("typeIcon"));
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.scoreValueTxt = <fgui.GTextField>(this.getChild("scoreValueTxt"));
		this.scoreTxt = <fgui.GTextField>(this.getChild("scoreTxt"));
		this.descTxt = <fgui.GTextField>(this.getChild("descTxt"));
		this.lookInfoBtn = <fgui.GButton>(this.getChild("lookInfoBtn"));
		this.upBtn = <fgui.GButton>(this.getChild("upBtn"));
	}
}