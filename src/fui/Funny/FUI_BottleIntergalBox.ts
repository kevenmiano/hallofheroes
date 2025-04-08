/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BottleIntergalBoxView from "./FUI_BottleIntergalBoxView";

export default class FUI_BottleIntergalBox extends fgui.GComponent {

	public state:fgui.Controller;
	public box:FUI_BottleIntergalBoxView;
	public g_click:fgui.GGraph;
	public static URL:string = "ui://lzu8jcp2rabumifh";

	public static createInstance():FUI_BottleIntergalBox {
		return <FUI_BottleIntergalBox>(fgui.UIPackage.createObject("Funny", "BottleIntergalBox"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this.box = <FUI_BottleIntergalBoxView>(this.getChild("box"));
		this.g_click = <fgui.GGraph>(this.getChild("g_click"));
	}
}