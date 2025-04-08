// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetCampaignLevelItem extends fgui.GComponent {

	public isLock:fgui.Controller;
	public isSelect:fgui.Controller;
	public unlock:fgui.GImage;
	public lock:fgui.GImage;
	public select:fgui.GImage;
	public txtLevel:fgui.GTextField;
	public static URL:string = "ui://m38x8ya1aaono";

	public static createInstance():FUI_PetCampaignLevelItem {
		return <FUI_PetCampaignLevelItem>(fgui.UIPackage.createObject("PetCampaign", "PetCampaignLevelItem"));
	}

	protected onConstruct():void {
		this.isLock = this.getController("isLock");
		this.isSelect = this.getController("isSelect");
		this.unlock = <fgui.GImage>(this.getChild("unlock"));
		this.lock = <fgui.GImage>(this.getChild("lock"));
		this.select = <fgui.GImage>(this.getChild("select"));
		this.txtLevel = <fgui.GTextField>(this.getChild("txtLevel"));
	}
}