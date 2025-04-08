/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SinglePassCardItem extends fgui.GComponent {

	public guardCtr:fgui.Controller;
	public effect:fgui.Controller;
	public bg:fgui.GImage;
	public lightBg:fgui.GImage;
	public playerIcon:fgui.GLoader;
	public titleBg:fgui.GImage;
	public gradeBg:fgui.GImage;
	public judge:fgui.GLoader;
	public guardGroup:fgui.GGroup;
	public gradeTxt:fgui.GRichTextField;
	public getReward:fgui.GButton;
	public static URL:string = "ui://udjm963kp87ng";

	public static createInstance():FUI_SinglePassCardItem {
		return <FUI_SinglePassCardItem>(fgui.UIPackage.createObject("SinglePass", "SinglePassCardItem"));
	}

	protected onConstruct():void {
		this.guardCtr = this.getController("guardCtr");
		this.effect = this.getController("effect");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.lightBg = <fgui.GImage>(this.getChild("lightBg"));
		this.playerIcon = <fgui.GLoader>(this.getChild("playerIcon"));
		this.titleBg = <fgui.GImage>(this.getChild("titleBg"));
		this.gradeBg = <fgui.GImage>(this.getChild("gradeBg"));
		this.judge = <fgui.GLoader>(this.getChild("judge"));
		this.guardGroup = <fgui.GGroup>(this.getChild("guardGroup"));
		this.gradeTxt = <fgui.GRichTextField>(this.getChild("gradeTxt"));
		this.getReward = <fgui.GButton>(this.getChild("getReward"));
	}
}