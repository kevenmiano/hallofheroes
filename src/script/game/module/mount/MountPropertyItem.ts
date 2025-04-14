import FUI_MountPropertyItem from "../../../../fui/Mount/FUI_MountPropertyItem";
import { MountInfo } from "./model/MountInfo";
import { PropertyInfo } from "./model/PropertyInfo";
import LangManager from "../../../core/lang/LangManager";
import { EmWindow } from "../../constant/UIDefine";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import { TipsShowType } from "../../tips/ITipedDisplay";
export default class MountPropertyItem extends FUI_MountPropertyItem {
  private _vData: MountInfo;
  private _valueType: string;

  tipType: EmWindow = EmWindow.CommonTips;
  tipData: any = null;
  showType: TipsShowType = TipsShowType.onLongPress;
  startPoint: Laya.Point = new Laya.Point(0, 0);
  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
  }

  public get vData(): MountInfo {
    return this._vData;
  }

  public set vData(value: MountInfo) {
    this._vData = value;
    this.update();
    if (this._vData) {
      this.tipData = this.getTipsText();
      if (value) ToolTipsManager.Instance.register(this);
      else ToolTipsManager.Instance.unRegister(this);
    }
  }

  private getTipsText(): string {
    var info: PropertyInfo = this._vData.getProperty(this.valueType);
    var name: Array<string> =
      LangManager.Instance.GetTranslation("mounts.command02").split(",");
    var index: number = PropertyInfo.getPropertyValue(info.name);
    var val: number = info.grade * 5;
    let content: string;
    if (info.addition - val > 0) {
      content = LangManager.Instance.GetTranslation(
        "mounts.PropertyItem.tips02",
        name[index],
        val + " +" + (info.addition - val),
      );
    } else {
      content = LangManager.Instance.GetTranslation(
        "mounts.PropertyItem.tips02",
        name[index],
        val,
      );
    }
    content = `[color=#48d72a]${content}[/color]`;
    content += "<br/>";
    content += LangManager.Instance.GetTranslation(
      "mounts.PropertyItem.tips03",
      name[index],
      info.grade,
    );
    content += "<br/>";
    content += LangManager.Instance.GetTranslation(
      "mounts.PropertyItem.tips04",
      info.gradeMax,
    );
    return content;
  }

  public set valueType(value: string) {
    this._valueType = value;
  }

  public get valueType(): string {
    return this._valueType;
  }

  public get propertyInfo(): PropertyInfo {
    return this._vData.getProperty(this.valueType);
  }

  private getTitleName(type: string): string {
    let str: string = "";
    switch (type) {
      case PropertyInfo.STRENGTH:
        str = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip01",
        );
        break;
      case PropertyInfo.INTELLECT:
        str = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip03",
        );
        break;
      case PropertyInfo.STAMINA:
        str = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip04",
        );
        break;
      case PropertyInfo.ARMOR:
        str = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip02",
        );
        break;
    }
    return str;
  }

  public update() {
    var nextAddition: string = "+" + this.propertyInfo.addition;
    this.titleNameTxt.text = this.getTitleName(this.valueType);
    this.additionTxt.text = "+" + this.propertyInfo.addition;
    this.nextAdditionTxt.visible = false;
    if (this.additionTxt.text != nextAddition) {
      this.nextAdditionTxt.text = nextAddition;
      this.nextAdditionTxt.visible = true;
    }
    this.tipData = this.getTipsText();
    this.progressValue.value =
      (this.propertyInfo.currentPropGp * 100) /
      this.propertyInfo.currentPropMaxGp;
    this.progressValue.getChild("progress").text =
      this.propertyInfo.currentPropGp +
      " / " +
      this.propertyInfo.currentPropMaxGp;
  }

  public dispose() {
    super.dispose();
  }
}
