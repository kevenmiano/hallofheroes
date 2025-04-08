/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RankItemR3 extends fgui.GButton {

	public imgRank:fgui.GLoader;
	public txt1:fgui.GTextField;
	public txt2:fgui.GTextField;
	public txt3:fgui.GTextField;
	public static URL:string = "ui://og5jeos3t3q6l";

	public static createInstance():FUI_RankItemR3 {
		return <FUI_RankItemR3>(fgui.UIPackage.createObject("Base", "RankItemR3"));
	}

	protected onConstruct():void {
		this.imgRank = <fgui.GLoader>(this.getChild("imgRank"));
		this.txt1 = <fgui.GTextField>(this.getChild("txt1"));
		this.txt2 = <fgui.GTextField>(this.getChild("txt2"));
		this.txt3 = <fgui.GTextField>(this.getChild("txt3"));
	}
}