/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CarnivalInfoItem from "./FUI_CarnivalInfoItem";

export default class FUI_CarnivalGamePage extends fgui.GComponent {

	public isSummer:fgui.Controller;
	public carnival_reset:FUI_CarnivalInfoItem;
	public split_line:fgui.GGraph;
	public list:fgui.GList;
	public btn_arrow_r:fgui.GButton;
	public btn_arrow_l:fgui.GButton;
	public static URL:string = "ui://qvbm8hnzpf9kgk";

	public static createInstance():FUI_CarnivalGamePage {
		return <FUI_CarnivalGamePage>(fgui.UIPackage.createObject("Carnival", "CarnivalGamePage"));
	}

	protected onConstruct():void {
		this.isSummer = this.getController("isSummer");
		this.carnival_reset = <FUI_CarnivalInfoItem>(this.getChild("carnival_reset"));
		this.split_line = <fgui.GGraph>(this.getChild("split_line"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.btn_arrow_r = <fgui.GButton>(this.getChild("btn_arrow_r"));
		this.btn_arrow_l = <fgui.GButton>(this.getChild("btn_arrow_l"));
	}
}