/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardShowView extends fgui.GComponent {

	public progress:fgui.GProgressBar;
	public generalBmp1:fgui.GImage;
	public generalBmp2:fgui.GImage;
	public generalBmp3:fgui.GImage;
	public generalBmp4:fgui.GImage;
	public leftArmyTxt:fgui.GRichTextField;
	public guildArmyTxt:fgui.GRichTextField;
	public static URL:string = "ui://tybyzkwzo5c3ic4";

	public static createInstance():FUI_OutyardShowView {
		return <FUI_OutyardShowView>(fgui.UIPackage.createObject("Battle", "OutyardShowView"));
	}

	protected onConstruct():void {
		this.progress = <fgui.GProgressBar>(this.getChild("progress"));
		this.generalBmp1 = <fgui.GImage>(this.getChild("generalBmp1"));
		this.generalBmp2 = <fgui.GImage>(this.getChild("generalBmp2"));
		this.generalBmp3 = <fgui.GImage>(this.getChild("generalBmp3"));
		this.generalBmp4 = <fgui.GImage>(this.getChild("generalBmp4"));
		this.leftArmyTxt = <fgui.GRichTextField>(this.getChild("leftArmyTxt"));
		this.guildArmyTxt = <fgui.GRichTextField>(this.getChild("guildArmyTxt"));
	}
}