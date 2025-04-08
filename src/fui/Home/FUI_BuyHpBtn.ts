/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BuyHpBtn extends fgui.GButton {

	public hpIcon:fgui.GLoader;
	public isNullPic:fgui.GImage;
	public t1:fgui.Transition;
	public static URL:string = "ui://tny43dz1qkuphqa";

	public static createInstance():FUI_BuyHpBtn {
		return <FUI_BuyHpBtn>(fgui.UIPackage.createObject("Home", "BuyHpBtn"));
	}

	protected onConstruct():void {
		this.hpIcon = <fgui.GLoader>(this.getChild("hpIcon"));
		this.isNullPic = <fgui.GImage>(this.getChild("isNullPic"));
		this.t1 = this.getTransition("t1");
	}
}