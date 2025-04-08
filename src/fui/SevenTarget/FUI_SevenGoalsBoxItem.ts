/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SevenGoalsBoxItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public movie:fgui.GMovieClip;
	public countValueTxt:fgui.GTextField;
	public baseItem:fgui.GButton;
	public static URL:string = "ui://tctdlybezy3d3";

	public static createInstance():FUI_SevenGoalsBoxItem {
		return <FUI_SevenGoalsBoxItem>(fgui.UIPackage.createObject("SevenTarget", "SevenGoalsBoxItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.movie = <fgui.GMovieClip>(this.getChild("movie"));
		this.countValueTxt = <fgui.GTextField>(this.getChild("countValueTxt"));
		this.baseItem = <fgui.GButton>(this.getChild("baseItem"));
	}
}