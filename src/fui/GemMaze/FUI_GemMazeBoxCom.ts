/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_GemMazeBoxItem from "./FUI_GemMazeBoxItem";
import FUI_barCom from "./FUI_barCom";

export default class FUI_GemMazeBoxCom extends fgui.GComponent {

	public box1:FUI_GemMazeBoxItem;
	public box2:FUI_GemMazeBoxItem;
	public box3:FUI_GemMazeBoxItem;
	public box4:FUI_GemMazeBoxItem;
	public box5:FUI_GemMazeBoxItem;
	public txt_point1:fgui.GTextField;
	public txt_point2:fgui.GTextField;
	public txt_point3:fgui.GTextField;
	public txt_point4:fgui.GTextField;
	public txt_point5:fgui.GTextField;
	public bar_com:FUI_barCom;
	public static URL:string = "ui://iwrz1divfdq9m";

	public static createInstance():FUI_GemMazeBoxCom {
		return <FUI_GemMazeBoxCom>(fgui.UIPackage.createObject("GemMaze", "GemMazeBoxCom"));
	}

	protected onConstruct():void {
		this.box1 = <FUI_GemMazeBoxItem>(this.getChild("box1"));
		this.box2 = <FUI_GemMazeBoxItem>(this.getChild("box2"));
		this.box3 = <FUI_GemMazeBoxItem>(this.getChild("box3"));
		this.box4 = <FUI_GemMazeBoxItem>(this.getChild("box4"));
		this.box5 = <FUI_GemMazeBoxItem>(this.getChild("box5"));
		this.txt_point1 = <fgui.GTextField>(this.getChild("txt_point1"));
		this.txt_point2 = <fgui.GTextField>(this.getChild("txt_point2"));
		this.txt_point3 = <fgui.GTextField>(this.getChild("txt_point3"));
		this.txt_point4 = <fgui.GTextField>(this.getChild("txt_point4"));
		this.txt_point5 = <fgui.GTextField>(this.getChild("txt_point5"));
		this.bar_com = <FUI_barCom>(this.getChild("bar_com"));
	}
}