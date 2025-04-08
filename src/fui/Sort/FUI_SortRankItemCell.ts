/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SortRankItemCell extends fgui.GButton {

	public state:fgui.Controller;
	public numIcon:fgui.Controller;
	public rankIcon:fgui.GLoader;
	public para0:fgui.GTextField;
	public para1:fgui.GTextField;
	public para2:fgui.GTextField;
	public para3:fgui.GTextField;
	public para4:fgui.GTextField;
	public para5:fgui.GTextField;
	public para6:fgui.GTextField;
	public clickRect0:fgui.GGraph;
	public clickRect1:fgui.GGraph;
	public static URL:string = "ui://r92j0v2fcy4t8";

	public static createInstance():FUI_SortRankItemCell {
		return <FUI_SortRankItemCell>(fgui.UIPackage.createObject("Sort", "SortRankItemCell"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this.numIcon = this.getController("numIcon");
		this.rankIcon = <fgui.GLoader>(this.getChild("rankIcon"));
		this.para0 = <fgui.GTextField>(this.getChild("para0"));
		this.para1 = <fgui.GTextField>(this.getChild("para1"));
		this.para2 = <fgui.GTextField>(this.getChild("para2"));
		this.para3 = <fgui.GTextField>(this.getChild("para3"));
		this.para4 = <fgui.GTextField>(this.getChild("para4"));
		this.para5 = <fgui.GTextField>(this.getChild("para5"));
		this.para6 = <fgui.GTextField>(this.getChild("para6"));
		this.clickRect0 = <fgui.GGraph>(this.getChild("clickRect0"));
		this.clickRect1 = <fgui.GGraph>(this.getChild("clickRect1"));
	}
}