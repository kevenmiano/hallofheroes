/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CarnivalInfoItem from "./FUI_CarnivalInfoItem";

export default class FUI_CarnivalDayTaskPage extends fgui.GComponent {

	public Img_Role_3:fgui.GLoader;
	public list:fgui.GList;
	public carnival_reset:FUI_CarnivalInfoItem;
	public static URL:string = "ui://qvbm8hnzpf9kgi";

	public static createInstance():FUI_CarnivalDayTaskPage {
		return <FUI_CarnivalDayTaskPage>(fgui.UIPackage.createObject("Carnival", "CarnivalDayTaskPage"));
	}

	protected onConstruct():void {
		this.Img_Role_3 = <fgui.GLoader>(this.getChild("Img_Role_3"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.carnival_reset = <FUI_CarnivalInfoItem>(this.getChild("carnival_reset"));
	}
}