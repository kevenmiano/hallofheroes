/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BufferItemCell extends fgui.GComponent {

	public cIsDebuff:fgui.Controller;
	public cannotdisperse:fgui.Controller;
	public bufferIcon:fgui.GLoader;
	public txtLayerCount:fgui.GTextField;
	public disperse:fgui.GImage;
	public static URL:string = "ui://tybyzkwzefdtf0";

	public static createInstance():FUI_BufferItemCell {
		return <FUI_BufferItemCell>(fgui.UIPackage.createObject("Battle", "BufferItemCell"));
	}

	protected onConstruct():void {
		this.cIsDebuff = this.getController("cIsDebuff");
		this.cannotdisperse = this.getController("cannotdisperse");
		this.bufferIcon = <fgui.GLoader>(this.getChild("bufferIcon"));
		this.txtLayerCount = <fgui.GTextField>(this.getChild("txtLayerCount"));
		this.disperse = <fgui.GImage>(this.getChild("disperse"));
	}
}