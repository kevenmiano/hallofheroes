/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SoulIemBase extends fgui.GComponent {

	public language:fgui.Controller;
	public bgImg:fgui.GImage;
	public titleImg:fgui.GImage;
	public VipImg:fgui.GImage;
	public lockImg:fgui.GImage;
	public comStar:fgui.GComponent;
	public nameTxt:fgui.GTextField;
	public mainGroup:fgui.GGroup;
	public limitImg:fgui.GImage;
	public static URL:string = "ui://b2almfghdjflu";

	public static createInstance():FUI_SoulIemBase {
		return <FUI_SoulIemBase>(fgui.UIPackage.createObject("Mount", "SoulIemBase"));
	}

	protected onConstruct():void {
		this.language = this.getController("language");
		this.bgImg = <fgui.GImage>(this.getChild("bgImg"));
		this.titleImg = <fgui.GImage>(this.getChild("titleImg"));
		this.VipImg = <fgui.GImage>(this.getChild("VipImg"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
		this.comStar = <fgui.GComponent>(this.getChild("comStar"));
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.mainGroup = <fgui.GGroup>(this.getChild("mainGroup"));
		this.limitImg = <fgui.GImage>(this.getChild("limitImg"));
	}
}