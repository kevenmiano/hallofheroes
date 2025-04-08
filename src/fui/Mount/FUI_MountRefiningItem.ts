// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MountRefiningItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public typeNameTxt:fgui.GTextField;
	public valueTxt1:fgui.GTextField;
	public currentValueGroup:fgui.GGroup;
	public valueTxt2:fgui.GTextField;
	public valueTxt3:fgui.GTextField;
	public nextValueGroup:fgui.GGroup;
	public typeNameTxt2:fgui.GTextField;
	public maxValueTxt:fgui.GTextField;
	public maxValueGroup:fgui.GGroup;
	public static URL:string = "ui://b2almfghxgibb";

	public static createInstance():FUI_MountRefiningItem {
		return <FUI_MountRefiningItem>(fgui.UIPackage.createObject("Mount", "MountRefiningItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.typeNameTxt = <fgui.GTextField>(this.getChild("typeNameTxt"));
		this.valueTxt1 = <fgui.GTextField>(this.getChild("valueTxt1"));
		this.currentValueGroup = <fgui.GGroup>(this.getChild("currentValueGroup"));
		this.valueTxt2 = <fgui.GTextField>(this.getChild("valueTxt2"));
		this.valueTxt3 = <fgui.GTextField>(this.getChild("valueTxt3"));
		this.nextValueGroup = <fgui.GGroup>(this.getChild("nextValueGroup"));
		this.typeNameTxt2 = <fgui.GTextField>(this.getChild("typeNameTxt2"));
		this.maxValueTxt = <fgui.GTextField>(this.getChild("maxValueTxt"));
		this.maxValueGroup = <fgui.GGroup>(this.getChild("maxValueGroup"));
	}
}