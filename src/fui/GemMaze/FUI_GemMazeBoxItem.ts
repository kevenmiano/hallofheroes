/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GemMazeBoxItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public item:fgui.GButton;
	public static URL:string = "ui://iwrz1divfdq954";

	public static createInstance():FUI_GemMazeBoxItem {
		return <FUI_GemMazeBoxItem>(fgui.UIPackage.createObject("GemMaze", "GemMazeBoxItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.item = <fgui.GButton>(this.getChild("item"));
	}
}