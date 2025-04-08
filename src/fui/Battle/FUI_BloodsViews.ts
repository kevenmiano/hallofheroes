/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BloodSingle from "./FUI_BloodSingle";

export default class FUI_BloodsViews extends fgui.GComponent {
  public showOneSide: fgui.Controller;
  public tb: fgui.GImage;
  public bv0: FUI_BloodSingle;
  public bv1: FUI_BloodSingle;
  public bv2: FUI_BloodSingle;
  public bv3: FUI_BloodSingle;
  public bv4: FUI_BloodSingle;
  public bv5: FUI_BloodSingle;
  public bv6: FUI_BloodSingle;
  public bv7: FUI_BloodSingle;
  public bv8: FUI_BloodSingle;
  public bv9: FUI_BloodSingle;
  public bv10: FUI_BloodSingle;
  public bv11: FUI_BloodSingle;
  public static URL: string = "ui://tybyzkwzhosemife";

  public static createInstance(): FUI_BloodsViews {
    return <FUI_BloodsViews>(
      fgui.UIPackage.createObject("Battle", "BloodsViews")
    );
  }

  protected onConstruct(): void {
    this.showOneSide = this.getController("showOneSide");
    this.tb = <fgui.GImage>this.getChild("tb");
    this.bv0 = <FUI_BloodSingle>this.getChild("bv0");
    this.bv1 = <FUI_BloodSingle>this.getChild("bv1");
    this.bv2 = <FUI_BloodSingle>this.getChild("bv2");
    this.bv3 = <FUI_BloodSingle>this.getChild("bv3");
    this.bv4 = <FUI_BloodSingle>this.getChild("bv4");
    this.bv5 = <FUI_BloodSingle>this.getChild("bv5");
    this.bv6 = <FUI_BloodSingle>this.getChild("bv6");
    this.bv7 = <FUI_BloodSingle>this.getChild("bv7");
    this.bv8 = <FUI_BloodSingle>this.getChild("bv8");
    this.bv9 = <FUI_BloodSingle>this.getChild("bv9");
    this.bv10 = <FUI_BloodSingle>this.getChild("bv10");
    this.bv11 = <FUI_BloodSingle>this.getChild("bv11");
  }
}
