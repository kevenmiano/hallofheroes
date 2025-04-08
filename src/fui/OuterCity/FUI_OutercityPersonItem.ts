/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutercityPersonItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public addBtn:fgui.GButton;
	public headIcon:fgui.GComponent;
	public jobIcon:fgui.GLoader;
	public imgLevelBg:fgui.GImage;
	public txtLevel:fgui.GTextField;
	public playerNameTxt:fgui.GTextField;
	public static URL:string = "ui://xcvl5694siyxmj24";

	public static createInstance():FUI_OutercityPersonItem {
		return <FUI_OutercityPersonItem>(fgui.UIPackage.createObject("OuterCity", "OutercityPersonItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.addBtn = <fgui.GButton>(this.getChild("addBtn"));
		this.headIcon = <fgui.GComponent>(this.getChild("headIcon"));
		this.jobIcon = <fgui.GLoader>(this.getChild("jobIcon"));
		this.imgLevelBg = <fgui.GImage>(this.getChild("imgLevelBg"));
		this.txtLevel = <fgui.GTextField>(this.getChild("txtLevel"));
		this.playerNameTxt = <fgui.GTextField>(this.getChild("playerNameTxt"));
	}
}