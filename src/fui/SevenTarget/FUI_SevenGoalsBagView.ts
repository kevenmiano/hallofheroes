// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SevenGoalsBagView extends fgui.GComponent {

	public hasGet:fgui.Controller;
	public goodsList:fgui.GList;
	public buyBtn:fgui.GButton;
	public txt_diamond:fgui.GTextField;
	public gDiamond:fgui.GGroup;
	public disCountTxt:fgui.GRichTextField;
	public bagNameTxt:fgui.GTextField;
	public static URL:string = "ui://tctdlybezy3d6";

	public static createInstance():FUI_SevenGoalsBagView {
		return <FUI_SevenGoalsBagView>(fgui.UIPackage.createObject("SevenTarget", "SevenGoalsBagView"));
	}

	protected onConstruct():void {
		this.hasGet = this.getController("hasGet");
		this.goodsList = <fgui.GList>(this.getChild("goodsList"));
		this.buyBtn = <fgui.GButton>(this.getChild("buyBtn"));
		this.txt_diamond = <fgui.GTextField>(this.getChild("txt_diamond"));
		this.gDiamond = <fgui.GGroup>(this.getChild("gDiamond"));
		this.disCountTxt = <fgui.GRichTextField>(this.getChild("disCountTxt"));
		this.bagNameTxt = <fgui.GTextField>(this.getChild("bagNameTxt"));
	}
}