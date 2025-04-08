/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_StarItem from "./FUI_StarItem";

export default class FUI_StarItemBase extends fgui.GComponent {

	public cOpened:fgui.Controller;
	public cSelectState:fgui.Controller;
	public starBg:fgui.GImage;
	public starLock:fgui.GImage;
	public txtOpenDesc:fgui.GTextField;
	public item:FUI_StarItem;
	public stopper:fgui.GGraph;
	public selectedPic:fgui.GImage;
	public canOperationMc:fgui.Transition;
	public static URL:string = "ui://gy6qelnhebuxs";

	public static createInstance():FUI_StarItemBase {
		return <FUI_StarItemBase>(fgui.UIPackage.createObject("Star", "StarItemBase"));
	}

	protected onConstruct():void {
		this.cOpened = this.getController("cOpened");
		this.cSelectState = this.getController("cSelectState");
		this.starBg = <fgui.GImage>(this.getChild("starBg"));
		this.starLock = <fgui.GImage>(this.getChild("starLock"));
		this.txtOpenDesc = <fgui.GTextField>(this.getChild("txtOpenDesc"));
		this.item = <FUI_StarItem>(this.getChild("item"));
		this.stopper = <fgui.GGraph>(this.getChild("stopper"));
		this.selectedPic = <fgui.GImage>(this.getChild("selectedPic"));
		this.canOperationMc = this.getTransition("canOperationMc");
	}
}