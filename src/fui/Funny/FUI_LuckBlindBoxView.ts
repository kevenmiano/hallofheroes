/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_LuckBlindBox_Background from "./FUI_LuckBlindBox_Background";
import FUI_LuckBlindBox_ChanceBox from "./FUI_LuckBlindBox_ChanceBox";
import FUI_LuckBlindBox_RuneBox from "./FUI_LuckBlindBox_RuneBox";
import FUI_LuckBlindBox_ButtomBox from "./FUI_LuckBlindBox_ButtomBox";

export default class FUI_LuckBlindBoxView extends fgui.GComponent {

	public background:FUI_LuckBlindBox_Background;
	public chanceBox:FUI_LuckBlindBox_ChanceBox;
	public diamondTip:fgui.GButton;
	public diamondTotalTxt:fgui.GTextField;
	public btn_buy:fgui.GButton;
	public diamondTotalBox:fgui.GGroup;
	public blindDiamondTip:fgui.GButton;
	public diamondConsumeTxt:fgui.GTextField;
	public diamondConsumeBox:fgui.GGroup;
	public simBox:fgui.GComponent;
	public runeBtn:FUI_LuckBlindBox_RuneBox;
	public buttomBox:FUI_LuckBlindBox_ButtomBox;
	public static URL:string = "ui://lzu8jcp2kolxmigb";

	public static createInstance():FUI_LuckBlindBoxView {
		return <FUI_LuckBlindBoxView>(fgui.UIPackage.createObject("Funny", "LuckBlindBoxView"));
	}

	protected onConstruct():void {
		this.background = <FUI_LuckBlindBox_Background>(this.getChild("background"));
		this.chanceBox = <FUI_LuckBlindBox_ChanceBox>(this.getChild("chanceBox"));
		this.diamondTip = <fgui.GButton>(this.getChild("diamondTip"));
		this.diamondTotalTxt = <fgui.GTextField>(this.getChild("diamondTotalTxt"));
		this.btn_buy = <fgui.GButton>(this.getChild("btn_buy"));
		this.diamondTotalBox = <fgui.GGroup>(this.getChild("diamondTotalBox"));
		this.blindDiamondTip = <fgui.GButton>(this.getChild("blindDiamondTip"));
		this.diamondConsumeTxt = <fgui.GTextField>(this.getChild("diamondConsumeTxt"));
		this.diamondConsumeBox = <fgui.GGroup>(this.getChild("diamondConsumeBox"));
		this.simBox = <fgui.GComponent>(this.getChild("simBox"));
		this.runeBtn = <FUI_LuckBlindBox_RuneBox>(this.getChild("runeBtn"));
		this.buttomBox = <FUI_LuckBlindBox_ButtomBox>(this.getChild("buttomBox"));
	}
}