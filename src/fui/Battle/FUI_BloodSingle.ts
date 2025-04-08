/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BloodSingle extends fgui.GComponent {

	public haveBlood:fgui.Controller;
	public redBlood:fgui.Controller;
	public bg:fgui.GImage;
	public greenHp:fgui.GImage;
	public redHp:fgui.GImage;
	public bloodGroup:fgui.GGroup;
	public static URL:string = "ui://tybyzkwzhosemifd";

	public static createInstance():FUI_BloodSingle {
		return <FUI_BloodSingle>(fgui.UIPackage.createObject("Battle", "BloodSingle"));
	}

	protected onConstruct():void {
		this.haveBlood = this.getController("haveBlood");
		this.redBlood = this.getController("redBlood");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.greenHp = <fgui.GImage>(this.getChild("greenHp"));
		this.redHp = <fgui.GImage>(this.getChild("redHp"));
		this.bloodGroup = <fgui.GGroup>(this.getChild("bloodGroup"));
	}
}