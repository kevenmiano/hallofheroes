/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_TattooHoleView from "./FUI_TattooHoleView";

export default class FUI_TattooCom extends fgui.GComponent {
  public showHoleTips: fgui.Controller;
  public showCoreTips: fgui.Controller;
  public showLockTips: fgui.Controller;
  public showTattooTips: fgui.Controller;
  public step: fgui.Controller;
  public canUpgrade: fgui.Controller;
  public maxLevel: fgui.Controller;
  public bttn_props: fgui.GButton;
  public icon_small_0: fgui.GLoader;
  public icon_small_1: fgui.GLoader;
  public icon_small_2: fgui.GLoader;
  public icon_small_3: fgui.GLoader;
  public icon_small_4: fgui.GLoader;
  public txt_num_0: fgui.GTextField;
  public txt_num_1: fgui.GTextField;
  public txt_num_2: fgui.GTextField;
  public txt_num_3: fgui.GTextField;
  public txt_num_4: fgui.GTextField;
  public icon_tattoo_0: FUI_TattooHoleView;
  public icon_tattoo_1: FUI_TattooHoleView;
  public icon_tattoo_2: FUI_TattooHoleView;
  public icon_tattoo_3: FUI_TattooHoleView;
  public icon_tattoo_4: FUI_TattooHoleView;
  public icon_tattoo_5: FUI_TattooHoleView;
  public icon_tattoo_6: FUI_TattooHoleView;
  public icon_tattoo_7: FUI_TattooHoleView;
  public icon_core: fgui.GLoader;
  public tipsmask_0: fgui.GGraph;
  public txt_tips: fgui.GTextField;
  public tipsmask_1: fgui.GGraph;
  public txt_tips_core_name: fgui.GTextField;
  public txt_tips_core_0: fgui.GRichTextField;
  public txt_tips_core_1: fgui.GRichTextField;
  public txt_state: fgui.GTextField;
  public g_coreInfo: fgui.GGroup;
  public g_coreTips: fgui.GGroup;
  public tipsmask_2: fgui.GGraph;
  public txt_lock_tips: fgui.GTextField;
  public tipsmask_3: fgui.GGraph;
  public l_tattooName: fgui.GLoader;
  public txt_name_tips: fgui.GTextField;
  public btn_help: fgui.GButton;
  public txt_condition: fgui.GTextField;
  public txt_tips_core_2: fgui.GRichTextField;
  public upgrade: fgui.Transition;
  public static URL: string = "ui://6fvk31sunu47ehid6";

  public static createInstance(): FUI_TattooCom {
    return <FUI_TattooCom>fgui.UIPackage.createObject("SBag", "TattooCom");
  }

  protected onConstruct(): void {
    this.showHoleTips = this.getController("showHoleTips");
    this.showCoreTips = this.getController("showCoreTips");
    this.showLockTips = this.getController("showLockTips");
    this.showTattooTips = this.getController("showTattooTips");
    this.step = this.getController("step");
    this.canUpgrade = this.getController("canUpgrade");
    this.maxLevel = this.getController("maxLevel");
    this.bttn_props = <fgui.GButton>this.getChild("bttn_props");
    this.icon_small_0 = <fgui.GLoader>this.getChild("icon_small_0");
    this.icon_small_1 = <fgui.GLoader>this.getChild("icon_small_1");
    this.icon_small_2 = <fgui.GLoader>this.getChild("icon_small_2");
    this.icon_small_3 = <fgui.GLoader>this.getChild("icon_small_3");
    this.icon_small_4 = <fgui.GLoader>this.getChild("icon_small_4");
    this.txt_num_0 = <fgui.GTextField>this.getChild("txt_num_0");
    this.txt_num_1 = <fgui.GTextField>this.getChild("txt_num_1");
    this.txt_num_2 = <fgui.GTextField>this.getChild("txt_num_2");
    this.txt_num_3 = <fgui.GTextField>this.getChild("txt_num_3");
    this.txt_num_4 = <fgui.GTextField>this.getChild("txt_num_4");
    this.icon_tattoo_0 = <FUI_TattooHoleView>this.getChild("icon_tattoo_0");
    this.icon_tattoo_1 = <FUI_TattooHoleView>this.getChild("icon_tattoo_1");
    this.icon_tattoo_2 = <FUI_TattooHoleView>this.getChild("icon_tattoo_2");
    this.icon_tattoo_3 = <FUI_TattooHoleView>this.getChild("icon_tattoo_3");
    this.icon_tattoo_4 = <FUI_TattooHoleView>this.getChild("icon_tattoo_4");
    this.icon_tattoo_5 = <FUI_TattooHoleView>this.getChild("icon_tattoo_5");
    this.icon_tattoo_6 = <FUI_TattooHoleView>this.getChild("icon_tattoo_6");
    this.icon_tattoo_7 = <FUI_TattooHoleView>this.getChild("icon_tattoo_7");
    this.icon_core = <fgui.GLoader>this.getChild("icon_core");
    this.tipsmask_0 = <fgui.GGraph>this.getChild("tipsmask_0");
    this.txt_tips = <fgui.GTextField>this.getChild("txt_tips");
    this.tipsmask_1 = <fgui.GGraph>this.getChild("tipsmask_1");
    this.txt_tips_core_name = <fgui.GTextField>(
      this.getChild("txt_tips_core_name")
    );
    this.txt_tips_core_0 = <fgui.GRichTextField>(
      this.getChild("txt_tips_core_0")
    );
    this.txt_tips_core_1 = <fgui.GRichTextField>(
      this.getChild("txt_tips_core_1")
    );
    this.txt_state = <fgui.GTextField>this.getChild("txt_state");
    this.g_coreInfo = <fgui.GGroup>this.getChild("g_coreInfo");
    this.g_coreTips = <fgui.GGroup>this.getChild("g_coreTips");
    this.tipsmask_2 = <fgui.GGraph>this.getChild("tipsmask_2");
    this.txt_lock_tips = <fgui.GTextField>this.getChild("txt_lock_tips");
    this.tipsmask_3 = <fgui.GGraph>this.getChild("tipsmask_3");
    this.l_tattooName = <fgui.GLoader>this.getChild("l_tattooName");
    this.txt_name_tips = <fgui.GTextField>this.getChild("txt_name_tips");
    this.btn_help = <fgui.GButton>this.getChild("btn_help");
    this.txt_condition = <fgui.GTextField>this.getChild("txt_condition");
    this.txt_tips_core_2 = <fgui.GRichTextField>(
      this.getChild("txt_tips_core_2")
    );
    this.upgrade = this.getTransition("upgrade");
  }
}
