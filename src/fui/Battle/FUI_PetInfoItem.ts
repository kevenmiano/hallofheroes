/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetInfoItem extends fgui.GComponent {

	public selectCtr:fgui.Controller;
	public petIcon:fgui.GLoader;
	public imgShortKeyBg:fgui.GImage;
	public txtShortKey:fgui.GTextField;
	public imgHp:fgui.GImage;
	public static URL:string = "ui://tybyzkwzhp9vmif8";

	public static createInstance():FUI_PetInfoItem {
		return <FUI_PetInfoItem>(fgui.UIPackage.createObject("Battle", "PetInfoItem"));
	}

	protected onConstruct():void {
		this.selectCtr = this.getController("selectCtr");
		this.petIcon = <fgui.GLoader>(this.getChild("petIcon"));
		this.imgShortKeyBg = <fgui.GImage>(this.getChild("imgShortKeyBg"));
		this.txtShortKey = <fgui.GTextField>(this.getChild("txtShortKey"));
		this.imgHp = <fgui.GImage>(this.getChild("imgHp"));
	}
}