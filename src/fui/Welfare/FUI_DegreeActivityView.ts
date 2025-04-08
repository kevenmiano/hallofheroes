/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_DegreeActivityListTitle from "./FUI_DegreeActivityListTitle";

export default class FUI_DegreeActivityView extends fgui.GComponent {

	public point:fgui.GTextField;
	public todayTitleBg:fgui.GImage;
	public todayActivityTitle:fgui.GTextField;
	public dayResetTime:fgui.GTextField;
	public activityBar:fgui.GProgressBar;
	public titleBg:fgui.GImage;
	public listCell:fgui.GList;
	public dayBoxlist:fgui.GList;
	public listTitle:FUI_DegreeActivityListTitle;
	public weekTitleBg:fgui.GImage;
	public weekResetTime:fgui.GTextField;
	public weekBoxlist:fgui.GList;
	public weekAcitivtyTitle:fgui.GRichTextField;
	public weekPoint:fgui.GTextField;
	public static URL:string = "ui://vw2db6bov2103m";

	public static createInstance():FUI_DegreeActivityView {
		return <FUI_DegreeActivityView>(fgui.UIPackage.createObject("Welfare", "DegreeActivityView"));
	}

	protected onConstruct():void {
		this.point = <fgui.GTextField>(this.getChild("point"));
		this.todayTitleBg = <fgui.GImage>(this.getChild("todayTitleBg"));
		this.todayActivityTitle = <fgui.GTextField>(this.getChild("todayActivityTitle"));
		this.dayResetTime = <fgui.GTextField>(this.getChild("dayResetTime"));
		this.activityBar = <fgui.GProgressBar>(this.getChild("activityBar"));
		this.titleBg = <fgui.GImage>(this.getChild("titleBg"));
		this.listCell = <fgui.GList>(this.getChild("listCell"));
		this.dayBoxlist = <fgui.GList>(this.getChild("dayBoxlist"));
		this.listTitle = <FUI_DegreeActivityListTitle>(this.getChild("listTitle"));
		this.weekTitleBg = <fgui.GImage>(this.getChild("weekTitleBg"));
		this.weekResetTime = <fgui.GTextField>(this.getChild("weekResetTime"));
		this.weekBoxlist = <fgui.GList>(this.getChild("weekBoxlist"));
		this.weekAcitivtyTitle = <fgui.GRichTextField>(this.getChild("weekAcitivtyTitle"));
		this.weekPoint = <fgui.GTextField>(this.getChild("weekPoint"));
	}
}