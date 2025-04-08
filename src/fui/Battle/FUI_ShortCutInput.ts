/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ShortCutInput extends fgui.GComponent {

	public inputmsg:fgui.GTextInput;
	public static URL:string = "ui://tybyzkwzxb4i1cp";

	public static createInstance():FUI_ShortCutInput {
		return <FUI_ShortCutInput>(fgui.UIPackage.createObject("Battle", "ShortCutInput"));
	}

	protected onConstruct():void {
		this.inputmsg = <fgui.GTextInput>(this.getChild("inputmsg"));
	}
}