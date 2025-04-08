/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ArtifactItem extends fgui.GComponent {

	public petItem:fgui.GComponent;
	public art1:fgui.GButton;
	public art2:fgui.GButton;
	public static URL:string = "ui://i5djjunlc6b3ehisd";

	public static createInstance():FUI_ArtifactItem {
		return <FUI_ArtifactItem>(fgui.UIPackage.createObject("PlayerInfo", "ArtifactItem"));
	}

	protected onConstruct():void {
		this.petItem = <fgui.GComponent>(this.getChild("petItem"));
		this.art1 = <fgui.GButton>(this.getChild("art1"));
		this.art2 = <fgui.GButton>(this.getChild("art2"));
	}
}