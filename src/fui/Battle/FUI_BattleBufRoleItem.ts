/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BattleBufRoleItem extends fgui.GButton {

	public cDir:fgui.Controller;
	public imgProgL:fgui.GImage;
	public imgProgR:fgui.GImage;
	public prog:fgui.GGroup;
	public txtNameR:fgui.GTextField;
	public txtLevelR:fgui.GTextField;
	public txtNameL:fgui.GTextField;
	public txtLevelL:fgui.GTextField;
	public static URL:string = "ui://tybyzkwzkaf014e";

	public static createInstance():FUI_BattleBufRoleItem {
		return <FUI_BattleBufRoleItem>(fgui.UIPackage.createObject("Battle", "BattleBufRoleItem"));
	}

	protected onConstruct():void {
		this.cDir = this.getController("cDir");
		this.imgProgL = <fgui.GImage>(this.getChild("imgProgL"));
		this.imgProgR = <fgui.GImage>(this.getChild("imgProgR"));
		this.prog = <fgui.GGroup>(this.getChild("prog"));
		this.txtNameR = <fgui.GTextField>(this.getChild("txtNameR"));
		this.txtLevelR = <fgui.GTextField>(this.getChild("txtLevelR"));
		this.txtNameL = <fgui.GTextField>(this.getChild("txtNameL"));
		this.txtLevelL = <fgui.GTextField>(this.getChild("txtLevelL"));
	}
}