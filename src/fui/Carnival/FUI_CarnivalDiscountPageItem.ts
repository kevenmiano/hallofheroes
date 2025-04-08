/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CarnivalDisBtn from "./FUI_CarnivalDisBtn";

export default class FUI_CarnivalDiscountPageItem extends fgui.GComponent {

	public giftBagType:fgui.Controller;
	public awardState:fgui.Controller;
	public isSummer:fgui.Controller;
	public Img_Gift_2:fgui.GLoader;
	public Img_Map_Title_Bg:fgui.GImage;
	public Img_Collected_SealBg:fgui.GImage;
	public goodsList:fgui.GList;
	public btn_receive:FUI_CarnivalDisBtn;
	public txt_title:fgui.GRichTextField;
	public static URL:string = "ui://qvbm8hnzpf9kgq";

	public static createInstance():FUI_CarnivalDiscountPageItem {
		return <FUI_CarnivalDiscountPageItem>(fgui.UIPackage.createObject("Carnival", "CarnivalDiscountPageItem"));
	}

	protected onConstruct():void {
		this.giftBagType = this.getController("giftBagType");
		this.awardState = this.getController("awardState");
		this.isSummer = this.getController("isSummer");
		this.Img_Gift_2 = <fgui.GLoader>(this.getChild("Img_Gift_2"));
		this.Img_Map_Title_Bg = <fgui.GImage>(this.getChild("Img_Map_Title_Bg"));
		this.Img_Collected_SealBg = <fgui.GImage>(this.getChild("Img_Collected_SealBg"));
		this.goodsList = <fgui.GList>(this.getChild("goodsList"));
		this.btn_receive = <FUI_CarnivalDisBtn>(this.getChild("btn_receive"));
		this.txt_title = <fgui.GRichTextField>(this.getChild("txt_title"));
	}
}