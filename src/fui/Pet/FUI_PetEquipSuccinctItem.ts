/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_StrenAtrriItem1 from "./FUI_StrenAtrriItem1";

export default class FUI_PetEquipSuccinctItem extends fgui.GComponent {
  public showSkillIcon: fgui.Controller;
  public showItem: fgui.Controller;
  public state: fgui.Controller;
  public title: fgui.GTextField;
  public item1: FUI_StrenAtrriItem1;
  public item1_line: fgui.GImage;
  public item2: FUI_StrenAtrriItem1;
  public item2_line: fgui.GImage;
  public item3: FUI_StrenAtrriItem1;
  public item3_line: fgui.GImage;
  public item4: FUI_StrenAtrriItem1;
  public item4_line: fgui.GImage;
  public item5: FUI_StrenAtrriItem1;
  public txt_suit_name: fgui.GTextField;
  public txt_suit_desc: fgui.GRichTextField;
  public comp_skillItem: fgui.GButton;
  public static URL: string = "ui://t0l2fizvhq3dim8";

  public static createInstance(): FUI_PetEquipSuccinctItem {
    return <FUI_PetEquipSuccinctItem>(
      fgui.UIPackage.createObject("Pet", "PetEquipSuccinctItem")
    );
  }

  protected onConstruct(): void {
    this.showSkillIcon = this.getController("showSkillIcon");
    this.showItem = this.getController("showItem");
    this.state = this.getController("state");
    this.title = <fgui.GTextField>this.getChild("title");
    this.item1 = <FUI_StrenAtrriItem1>this.getChild("item1");
    this.item1_line = <fgui.GImage>this.getChild("item1_line");
    this.item2 = <FUI_StrenAtrriItem1>this.getChild("item2");
    this.item2_line = <fgui.GImage>this.getChild("item2_line");
    this.item3 = <FUI_StrenAtrriItem1>this.getChild("item3");
    this.item3_line = <fgui.GImage>this.getChild("item3_line");
    this.item4 = <FUI_StrenAtrriItem1>this.getChild("item4");
    this.item4_line = <fgui.GImage>this.getChild("item4_line");
    this.item5 = <FUI_StrenAtrriItem1>this.getChild("item5");
    this.txt_suit_name = <fgui.GTextField>this.getChild("txt_suit_name");
    this.txt_suit_desc = <fgui.GRichTextField>this.getChild("txt_suit_desc");
    this.comp_skillItem = <fgui.GButton>this.getChild("comp_skillItem");
  }
}
