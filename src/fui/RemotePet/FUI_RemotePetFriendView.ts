/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetFriendView extends fgui.GComponent {

	public bg:fgui.GImage;
	public title_bg:fgui.GImage;
	public fl:fgui.GImage;
	public titleLab:fgui.GTextField;
	public fr:fgui.GImage;
	public title:fgui.GGroup;
	public petList:fgui.GList;
	public emptyLab:fgui.GTextField;
	public static URL:string = "ui://dq4xsyl3m8wx1v";

	public static createInstance():FUI_RemotePetFriendView {
		return <FUI_RemotePetFriendView>(fgui.UIPackage.createObject("RemotePet", "RemotePetFriendView"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.title_bg = <fgui.GImage>(this.getChild("title_bg"));
		this.fl = <fgui.GImage>(this.getChild("fl"));
		this.titleLab = <fgui.GTextField>(this.getChild("titleLab"));
		this.fr = <fgui.GImage>(this.getChild("fr"));
		this.title = <fgui.GGroup>(this.getChild("title"));
		this.petList = <fgui.GList>(this.getChild("petList"));
		this.emptyLab = <fgui.GTextField>(this.getChild("emptyLab"));
	}
}