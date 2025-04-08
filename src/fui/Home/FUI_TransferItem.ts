/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TransferItem extends fgui.GComponent {

	public transferImg:fgui.GImage;
	public static URL:string = "ui://tny43dz1o249py";

	public static createInstance():FUI_TransferItem {
		return <FUI_TransferItem>(fgui.UIPackage.createObject("Home", "TransferItem"));
	}

	protected onConstruct():void {
		this.transferImg = <fgui.GImage>(this.getChild("transferImg"));
	}
}