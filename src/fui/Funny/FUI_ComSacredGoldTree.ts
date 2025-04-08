/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ComGoldsRain from "./FUI_ComGoldsRain";

export default class FUI_ComSacredGoldTree extends fgui.GComponent {

	public effect_gold:FUI_ComGoldsRain;
	public tranSacredGoldTree:fgui.Transition;
	public static URL:string = "ui://lzu8jcp2jb9sico";

	public static createInstance():FUI_ComSacredGoldTree {
		return <FUI_ComSacredGoldTree>(fgui.UIPackage.createObject("Funny", "ComSacredGoldTree"));
	}

	protected onConstruct():void {
		this.effect_gold = <FUI_ComGoldsRain>(this.getChild("effect_gold"));
		this.tranSacredGoldTree = this.getTransition("tranSacredGoldTree");
	}
}