/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SmallMapCityItem extends fgui.GComponent {

	public status:fgui.Controller;
	public cityLoader:fgui.GLoader;
	public nameBg:fgui.GImage;
	public consortiaNameTxt:fgui.GTextField;
	public cityNameTxt:fgui.GTextField;
	public imgFlag:fgui.GLoader;
	public imgFlag2:fgui.GLoader;
	public static URL:string = "ui://xcvl5694fuyfmiwm";

	public static createInstance():FUI_SmallMapCityItem {
		return <FUI_SmallMapCityItem>(fgui.UIPackage.createObject("OuterCity", "SmallMapCityItem"));
	}

	protected onConstruct():void {
		this.status = this.getController("status");
		this.cityLoader = <fgui.GLoader>(this.getChild("cityLoader"));
		this.nameBg = <fgui.GImage>(this.getChild("nameBg"));
		this.consortiaNameTxt = <fgui.GTextField>(this.getChild("consortiaNameTxt"));
		this.cityNameTxt = <fgui.GTextField>(this.getChild("cityNameTxt"));
		this.imgFlag = <fgui.GLoader>(this.getChild("imgFlag"));
		this.imgFlag2 = <fgui.GLoader>(this.getChild("imgFlag2"));
	}
}