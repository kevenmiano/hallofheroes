/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetIntensifyItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public title:fgui.GTextField;
	public txtValue:fgui.GTextField;
	public txtAddValue:fgui.GTextField;
	public prog:fgui.GProgressBar;
	public static URL:string = "ui://t0l2fizvn9ly1l";

	public static createInstance():FUI_PetIntensifyItem {
		return <FUI_PetIntensifyItem>(fgui.UIPackage.createObject("Pet", "PetIntensifyItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.txtValue = <fgui.GTextField>(this.getChild("txtValue"));
		this.txtAddValue = <fgui.GTextField>(this.getChild("txtAddValue"));
		this.prog = <fgui.GProgressBar>(this.getChild("prog"));
	}
}