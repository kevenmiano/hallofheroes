/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PlayerPetFigure extends fgui.GComponent {

	public bgLayer:fgui.GImage;
	public imgFlag:fgui.GImage;
	public curList:fgui.GList;
	public loader:fgui.GLoader;
	public txtName:fgui.GTextField;
	public txtCapacity:fgui.GTextField;
	public txt_property:fgui.GTextField;
	public static URL:string = "ui://i5djjunl54n6iac";

	public static createInstance():FUI_PlayerPetFigure {
		return <FUI_PlayerPetFigure>(fgui.UIPackage.createObject("PlayerInfo", "PlayerPetFigure"));
	}

	protected onConstruct():void {
		this.bgLayer = <fgui.GImage>(this.getChild("bgLayer"));
		this.imgFlag = <fgui.GImage>(this.getChild("imgFlag"));
		this.curList = <fgui.GList>(this.getChild("curList"));
		this.loader = <fgui.GLoader>(this.getChild("loader"));
		this.txtName = <fgui.GTextField>(this.getChild("txtName"));
		this.txtCapacity = <fgui.GTextField>(this.getChild("txtCapacity"));
		this.txt_property = <fgui.GTextField>(this.getChild("txt_property"));
	}
}