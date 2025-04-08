/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaSkillTowerItem extends fgui.GButton {

	public skillIcon:fgui.GButton;
	public txt_name:fgui.GTextField;
	public txt_level:fgui.GTextField;
	public static URL:string = "ui://8w3m5duwhipoi8r";

	public static createInstance():FUI_ConsortiaSkillTowerItem {
		return <FUI_ConsortiaSkillTowerItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaSkillTowerItem"));
	}

	protected onConstruct():void {
		this.skillIcon = <fgui.GButton>(this.getChild("skillIcon"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_level = <fgui.GTextField>(this.getChild("txt_level"));
	}
}