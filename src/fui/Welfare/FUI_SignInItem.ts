// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SignInItem extends fgui.GComponent {

	public signStateCtrl:fgui.Controller;
	public txt_day:fgui.GRichTextField;
	public item:fgui.GButton;
	public maskobj:fgui.GImage;
	public btn_resign:fgui.GButton;
	public signAni:fgui.GMovieClip;
	public static URL:string = "ui://vw2db6boh67k9midx";

	public static createInstance():FUI_SignInItem {
		return <FUI_SignInItem>(fgui.UIPackage.createObject("Welfare", "SignInItem"));
	}

	protected onConstruct():void {
		this.signStateCtrl = this.getController("signStateCtrl");
		this.txt_day = <fgui.GRichTextField>(this.getChild("txt_day"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this.maskobj = <fgui.GImage>(this.getChild("maskobj"));
		this.btn_resign = <fgui.GButton>(this.getChild("btn_resign"));
		this.signAni = <fgui.GMovieClip>(this.getChild("signAni"));
	}
}