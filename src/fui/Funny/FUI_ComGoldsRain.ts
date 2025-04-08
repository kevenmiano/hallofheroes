/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ComGolds from "./FUI_ComGolds";

export default class FUI_ComGoldsRain extends fgui.GComponent {

	public effect_0:FUI_ComGolds;
	public effect_1:FUI_ComGolds;
	public effect_2:FUI_ComGolds;
	public effect_3:FUI_ComGolds;
	public effect_4:FUI_ComGolds;
	public tranGoldsRain:fgui.Transition;
	public static URL:string = "ui://lzu8jcp2jb9sicq";

	public static createInstance():FUI_ComGoldsRain {
		return <FUI_ComGoldsRain>(fgui.UIPackage.createObject("Funny", "ComGoldsRain"));
	}

	protected onConstruct():void {
		this.effect_0 = <FUI_ComGolds>(this.getChild("effect_0"));
		this.effect_1 = <FUI_ComGolds>(this.getChild("effect_1"));
		this.effect_2 = <FUI_ComGolds>(this.getChild("effect_2"));
		this.effect_3 = <FUI_ComGolds>(this.getChild("effect_3"));
		this.effect_4 = <FUI_ComGolds>(this.getChild("effect_4"));
		this.tranGoldsRain = this.getTransition("tranGoldsRain");
	}
}