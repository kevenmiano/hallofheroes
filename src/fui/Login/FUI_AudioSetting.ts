/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_Checkbox from "./FUI_Checkbox";

export default class FUI_AudioSetting extends fgui.GComponent {
  public musicProgress: fgui.GSlider;
  public effectProgress: fgui.GSlider;
  public musicCheckbox: FUI_Checkbox;
  public effectCheckbox: FUI_Checkbox;
  public music_value_txt: fgui.GTextField;
  public effect_value_txt: fgui.GTextField;
  public static URL: string = "ui://2ydb9fb2inojsmhihb";

  public static createInstance(): FUI_AudioSetting {
    return <FUI_AudioSetting>(
      fgui.UIPackage.createObject("Login", "AudioSetting")
    );
  }

  protected onConstruct(): void {
    this.musicProgress = <fgui.GSlider>this.getChild("musicProgress");
    this.effectProgress = <fgui.GSlider>this.getChild("effectProgress");
    this.musicCheckbox = <FUI_Checkbox>this.getChild("musicCheckbox");
    this.effectCheckbox = <FUI_Checkbox>this.getChild("effectCheckbox");
    this.music_value_txt = <fgui.GTextField>this.getChild("music_value_txt");
    this.effect_value_txt = <fgui.GTextField>this.getChild("effect_value_txt");
  }
}
