// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PayItem extends fgui.GButton {

	public isDouble:fgui.Controller;
	public canLottery:fgui.Controller;
	public bg:fgui.GLoader;
	public doubleIcon:fgui.GImage;
	public iconBind:fgui.GImage;
	public txt_addName:fgui.GTextField;
	public txt_add:fgui.GTextField;
	public txt_diamond:fgui.GTextField;
	public txt_price:fgui.GTextField;
	public txt_times:fgui.GTextField;
	public txt_leftTimes:fgui.GTextField;
	public static URL:string = "ui://qcwdul6nl35xv";

	public static createInstance():FUI_PayItem {
		return <FUI_PayItem>(fgui.UIPackage.createObject("Shop", "PayItem"));
	}

	protected onConstruct():void {
		this.isDouble = this.getController("isDouble");
		this.canLottery = this.getController("canLottery");
		this.bg = <fgui.GLoader>(this.getChild("bg"));
		this.doubleIcon = <fgui.GImage>(this.getChild("doubleIcon"));
		this.iconBind = <fgui.GImage>(this.getChild("iconBind"));
		this.txt_addName = <fgui.GTextField>(this.getChild("txt_addName"));
		this.txt_add = <fgui.GTextField>(this.getChild("txt_add"));
		this.txt_diamond = <fgui.GTextField>(this.getChild("txt_diamond"));
		this.txt_price = <fgui.GTextField>(this.getChild("txt_price"));
		this.txt_times = <fgui.GTextField>(this.getChild("txt_times"));
		this.txt_leftTimes = <fgui.GTextField>(this.getChild("txt_leftTimes"));
	}
}