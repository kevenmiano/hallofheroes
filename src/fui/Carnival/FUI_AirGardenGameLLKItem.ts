/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AirGardenGameLLKItem extends fgui.GButton {

	public selectCtrl:fgui.Controller;
	public mcType:fgui.Controller;
	public empty:fgui.Controller;
	public nodeBg:fgui.GImage;
	public goodIcon:fgui.GLoader;
	public nodeBg2:fgui.GImage;
	public mc_0:fgui.GMovieClip;
	public mc_1:fgui.GMovieClip;
	public mc_2:fgui.GMovieClip;
	public txt_mcType:fgui.GTextField;
	public static URL:string = "ui://qvbm8hnzr0pch4";

	public static createInstance():FUI_AirGardenGameLLKItem {
		return <FUI_AirGardenGameLLKItem>(fgui.UIPackage.createObject("Carnival", "AirGardenGameLLKItem"));
	}

	protected onConstruct():void {
		this.selectCtrl = this.getController("selectCtrl");
		this.mcType = this.getController("mcType");
		this.empty = this.getController("empty");
		this.nodeBg = <fgui.GImage>(this.getChild("nodeBg"));
		this.goodIcon = <fgui.GLoader>(this.getChild("goodIcon"));
		this.nodeBg2 = <fgui.GImage>(this.getChild("nodeBg2"));
		this.mc_0 = <fgui.GMovieClip>(this.getChild("mc_0"));
		this.mc_1 = <fgui.GMovieClip>(this.getChild("mc_1"));
		this.mc_2 = <fgui.GMovieClip>(this.getChild("mc_2"));
		this.txt_mcType = <fgui.GTextField>(this.getChild("txt_mcType"));
	}
}