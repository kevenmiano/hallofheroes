/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_singlePassComUnFolder from "./FUI_singlePassComUnFolder";

export default class FUI_SinglePassBugleItem extends fgui.GComponent {

	public imgFolderBg:fgui.GImage;
	public comUnFolder:FUI_singlePassComUnFolder;
	public ItemsTxt:fgui.GTextField;
	public pointsIcon:fgui.GImage;
	public PointsTxt:fgui.GTextField;
	public costContainer:fgui.GGroup;
	public static URL:string = "ui://udjm963khiemw";

	public static createInstance():FUI_SinglePassBugleItem {
		return <FUI_SinglePassBugleItem>(fgui.UIPackage.createObject("SinglePass", "SinglePassBugleItem"));
	}

	protected onConstruct():void {
		this.imgFolderBg = <fgui.GImage>(this.getChild("imgFolderBg"));
		this.comUnFolder = <FUI_singlePassComUnFolder>(this.getChild("comUnFolder"));
		this.ItemsTxt = <fgui.GTextField>(this.getChild("ItemsTxt"));
		this.pointsIcon = <fgui.GImage>(this.getChild("pointsIcon"));
		this.PointsTxt = <fgui.GTextField>(this.getChild("PointsTxt"));
		this.costContainer = <fgui.GGroup>(this.getChild("costContainer"));
	}
}