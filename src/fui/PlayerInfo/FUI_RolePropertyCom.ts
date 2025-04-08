// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RolePropertyCom extends fgui.GComponent {

	public c1:fgui.Controller;
	public frame:fgui.GLabel;
	public txt_point_0:fgui.GRichTextField;
	public txt_point_1:fgui.GRichTextField;
	public txt_point_2:fgui.GRichTextField;
	public txt_point_3:fgui.GRichTextField;
	public txt_point_4:fgui.GRichTextField;
	public txt_point_5:fgui.GRichTextField;
	public txt_point_6:fgui.GRichTextField;
	public txt_property_0:fgui.GRichTextField;
	public txt_property_1:fgui.GRichTextField;
	public txt_property_2:fgui.GRichTextField;
	public txt_property_3:fgui.GRichTextField;
	public txt_property_4:fgui.GRichTextField;
	public txt_property_5:fgui.GRichTextField;
	public txt_property_6:fgui.GRichTextField;
	public txt_property_7:fgui.GRichTextField;
	public attList:fgui.GList;
	public txt_intellect:fgui.GRichTextField;
	public txt_agility:fgui.GRichTextField;
	public txt_power:fgui.GRichTextField;
	public txt_physique:fgui.GRichTextField;
	public fashionAttr:fgui.GGroup;
	public static URL:string = "ui://i5djjunlpzzq20";

	public static createInstance():FUI_RolePropertyCom {
		return <FUI_RolePropertyCom>(fgui.UIPackage.createObject("PlayerInfo", "RolePropertyCom"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.frame = <fgui.GLabel>(this.getChild("frame"));
		this.txt_point_0 = <fgui.GRichTextField>(this.getChild("txt_point_0"));
		this.txt_point_1 = <fgui.GRichTextField>(this.getChild("txt_point_1"));
		this.txt_point_2 = <fgui.GRichTextField>(this.getChild("txt_point_2"));
		this.txt_point_3 = <fgui.GRichTextField>(this.getChild("txt_point_3"));
		this.txt_point_4 = <fgui.GRichTextField>(this.getChild("txt_point_4"));
		this.txt_point_5 = <fgui.GRichTextField>(this.getChild("txt_point_5"));
		this.txt_point_6 = <fgui.GRichTextField>(this.getChild("txt_point_6"));
		this.txt_property_0 = <fgui.GRichTextField>(this.getChild("txt_property_0"));
		this.txt_property_1 = <fgui.GRichTextField>(this.getChild("txt_property_1"));
		this.txt_property_2 = <fgui.GRichTextField>(this.getChild("txt_property_2"));
		this.txt_property_3 = <fgui.GRichTextField>(this.getChild("txt_property_3"));
		this.txt_property_4 = <fgui.GRichTextField>(this.getChild("txt_property_4"));
		this.txt_property_5 = <fgui.GRichTextField>(this.getChild("txt_property_5"));
		this.txt_property_6 = <fgui.GRichTextField>(this.getChild("txt_property_6"));
		this.txt_property_7 = <fgui.GRichTextField>(this.getChild("txt_property_7"));
		this.attList = <fgui.GList>(this.getChild("attList"));
		this.txt_intellect = <fgui.GRichTextField>(this.getChild("txt_intellect"));
		this.txt_agility = <fgui.GRichTextField>(this.getChild("txt_agility"));
		this.txt_power = <fgui.GRichTextField>(this.getChild("txt_power"));
		this.txt_physique = <fgui.GRichTextField>(this.getChild("txt_physique"));
		this.fashionAttr = <fgui.GGroup>(this.getChild("fashionAttr"));
	}
}