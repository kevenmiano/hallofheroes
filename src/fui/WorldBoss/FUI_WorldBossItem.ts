/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WorldBossItem extends fgui.GComponent {

	public typeLoad1:fgui.GLoader;
	public typeLoad2:fgui.GLoader;
	public openTimeBg:fgui.GImage;
	public openTimeTxt:fgui.GTextField;
	public openStatusTxt:fgui.GTextField;
	public descTxt:fgui.GTextField;
	public openGradeTxt:fgui.GTextField;
	public checkBtn:fgui.GButton;
	public userTishenTxt:fgui.GTextField;
	public static URL:string = "ui://ai3g0shzukhi4";

	public static createInstance():FUI_WorldBossItem {
		return <FUI_WorldBossItem>(fgui.UIPackage.createObject("WorldBoss", "WorldBossItem"));
	}

	protected onConstruct():void {
		this.typeLoad1 = <fgui.GLoader>(this.getChild("typeLoad1"));
		this.typeLoad2 = <fgui.GLoader>(this.getChild("typeLoad2"));
		this.openTimeBg = <fgui.GImage>(this.getChild("openTimeBg"));
		this.openTimeTxt = <fgui.GTextField>(this.getChild("openTimeTxt"));
		this.openStatusTxt = <fgui.GTextField>(this.getChild("openStatusTxt"));
		this.descTxt = <fgui.GTextField>(this.getChild("descTxt"));
		this.openGradeTxt = <fgui.GTextField>(this.getChild("openGradeTxt"));
		this.checkBtn = <fgui.GButton>(this.getChild("checkBtn"));
		this.userTishenTxt = <fgui.GTextField>(this.getChild("userTishenTxt"));
	}
}