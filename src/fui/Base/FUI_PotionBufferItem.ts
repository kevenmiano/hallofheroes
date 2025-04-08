/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PotionBufferItem extends fgui.GComponent {

	public picIcon:fgui.GLoader;
	public nameTxt:fgui.GTextField;
	public valueTxt:fgui.GTextField;
	public timeTxt:fgui.GTextField;
	public static URL:string = "ui://og5jeos3bgubien";

	public static createInstance():FUI_PotionBufferItem {
		return <FUI_PotionBufferItem>(fgui.UIPackage.createObject("Base", "PotionBufferItem"));
	}

	protected onConstruct():void {
		this.picIcon = <fgui.GLoader>(this.getChild("picIcon"));
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.valueTxt = <fgui.GTextField>(this.getChild("valueTxt"));
		this.timeTxt = <fgui.GTextField>(this.getChild("timeTxt"));
	}
}