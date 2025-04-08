// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardBattleRecordtem extends fgui.GComponent {

	public descTxt:fgui.GRichTextField;
	public static URL:string = "ui://w1giibvbpkit6hie8";

	public static createInstance():FUI_OutyardBattleRecordtem {
		return <FUI_OutyardBattleRecordtem>(fgui.UIPackage.createObject("OutYard", "OutyardBattleRecordtem"));
	}

	protected onConstruct():void {
		this.descTxt = <fgui.GRichTextField>(this.getChild("descTxt"));
	}
}