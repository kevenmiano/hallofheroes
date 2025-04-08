/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ExcSvrItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public eff:fgui.GComponent;
	public txt_score:fgui.GRichTextField;
	public static URL:string = "ui://lzu8jcp2zi1964";

	public static createInstance():FUI_ExcSvrItem {
		return <FUI_ExcSvrItem>(fgui.UIPackage.createObject("Funny", "ExcSvrItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.eff = <fgui.GComponent>(this.getChild("eff"));
		this.txt_score = <fgui.GRichTextField>(this.getChild("txt_score"));
	}
}