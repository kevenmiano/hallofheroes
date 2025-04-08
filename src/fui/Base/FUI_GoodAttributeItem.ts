/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GoodAttributeItem extends fgui.GComponent {

	public txt_attributeName:fgui.GTextField;
	public txt_attributeValue:fgui.GTextField;
	public txt_attributeAdd:fgui.GTextField;
	public static URL:string = "ui://og5jeos3e0t0i41";

	public static createInstance():FUI_GoodAttributeItem {
		return <FUI_GoodAttributeItem>(fgui.UIPackage.createObject("Base", "GoodAttributeItem"));
	}

	protected onConstruct():void {
		this.txt_attributeName = <fgui.GTextField>(this.getChild("txt_attributeName"));
		this.txt_attributeValue = <fgui.GTextField>(this.getChild("txt_attributeValue"));
		this.txt_attributeAdd = <fgui.GTextField>(this.getChild("txt_attributeAdd"));
	}
}