/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TattooHoleView extends fgui.GComponent {

	public showTxt:fgui.Controller;
	public progressType:fgui.Controller;
	public isLock:fgui.Controller;
	public img_glow:fgui.GImage;
	public img_lv_bg:fgui.GLoader;
	public icon_tattoo:fgui.GLoader;
	public tattooExp1:fgui.GProgressBar;
	public txt_step1:fgui.GTextField;
	public g_exp:fgui.GGroup;
	public tattooExp2:fgui.GProgressBar;
	public txt_step2:fgui.GTextField;
	public txt_name:fgui.GTextField;
	public txt_attr1:fgui.GTextField;
	public g_value:fgui.GGroup;
	public t0:fgui.Transition;
	public static URL:string = "ui://6fvk31sunu47ehij9";

	public static createInstance():FUI_TattooHoleView {
		return <FUI_TattooHoleView>(fgui.UIPackage.createObject("SBag", "TattooHoleView"));
	}

	protected onConstruct():void {
		this.showTxt = this.getController("showTxt");
		this.progressType = this.getController("progressType");
		this.isLock = this.getController("isLock");
		this.img_glow = <fgui.GImage>(this.getChild("img_glow"));
		this.img_lv_bg = <fgui.GLoader>(this.getChild("img_lv_bg"));
		this.icon_tattoo = <fgui.GLoader>(this.getChild("icon_tattoo"));
		this.tattooExp1 = <fgui.GProgressBar>(this.getChild("tattooExp1"));
		this.txt_step1 = <fgui.GTextField>(this.getChild("txt_step1"));
		this.g_exp = <fgui.GGroup>(this.getChild("g_exp"));
		this.tattooExp2 = <fgui.GProgressBar>(this.getChild("tattooExp2"));
		this.txt_step2 = <fgui.GTextField>(this.getChild("txt_step2"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_attr1 = <fgui.GTextField>(this.getChild("txt_attr1"));
		this.g_value = <fgui.GGroup>(this.getChild("g_value"));
		this.t0 = this.getTransition("t0");
	}
}