/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_HomeBigBugble extends fgui.GComponent {

	public background:fgui.GImage;
	public noticeIcon:fgui.GLoader;
	public content:fgui.GRichTextField;
	public clickRect:fgui.GGraph;
	public static URL:string = "ui://tny43dz1uk3p6e";

	public static createInstance():FUI_HomeBigBugble {
		return <FUI_HomeBigBugble>(fgui.UIPackage.createObject("Home", "HomeBigBugble"));
	}

	protected onConstruct():void {
		this.background = <fgui.GImage>(this.getChild("background"));
		this.noticeIcon = <fgui.GLoader>(this.getChild("noticeIcon"));
		this.content = <fgui.GRichTextField>(this.getChild("content"));
		this.clickRect = <fgui.GGraph>(this.getChild("clickRect"));
	}
}