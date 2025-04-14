//@ts-expect-error: External dependencies
import FUI_MountRefiningItem from "../../../../fui/Mount/FUI_MountRefiningItem";
import { t_s_mounttemplateData } from "../../config/t_s_mounttemplate";
import LangManager from "../../../core/lang/LangManager";
import { MountsManager } from "../../manager/MountsManager";
import { MountInfo } from "./model/MountInfo";

export default class MountRefiningItem extends FUI_MountRefiningItem {
  private _vData: t_s_mounttemplateData;
  private _index: number = 0;
  private _isMax: boolean = false;
  private _starLevel: number = 0;
  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
  }

  public get vData(): t_s_mounttemplateData {
    return this._vData;
  }

  public get starLevel(): number {
    return this._starLevel;
  }

  public set starLevel(value: number) {
    this._starLevel = value;
  }

  public get index(): number {
    return this._index;
  }

  public set index(value: number) {
    this._index = value;
  }

  public get isMax(): boolean {
    return this._isMax;
  }

  public set isMax(value: boolean) {
    this._isMax = value;
  }

  public set vData(value: t_s_mounttemplateData) {
    this._vData = value;
    if (!this._vData) {
      this.clear();
    } else {
      this.refreshView();
    }
  }

  private clear() {
    this.typeNameTxt2.text = "";
    this.valueTxt1.text = "";
    this.valueTxt2.text = "";
    this.valueTxt3.text = "";
  }

  private refreshView() {
    this.typeNameTxt.text = this.typeNameTxt2.text = this.getName(this._index);
    if (this._isMax) {
      //达到最大
      this.c1.selectedIndex = 1;
      if (this._index == 4) {
        //显示兽魂值
        this.maxValueTxt.text =
          "+" + (this.starLevel * this._vData.StarSoulScore).toString();
      } else {
        this.maxValueTxt.text =
          "+" + (this.starLevel * this._vData.StarPower).toString();
      }
    } else {
      this.c1.selectedIndex = 0;
    }
    if (this._index == 4) {
      this.valueTxt1.text =
        "+" + (this.starLevel * this._vData.StarSoulScore).toString();
      this.valueTxt2.text =
        "+" + ((this.starLevel + 1) * this._vData.StarSoulScore).toString();
      this.valueTxt3.text = "(" + this._vData.StarSoulScore.toString() + ")";
    } else {
      this.valueTxt1.text =
        "+" + (this.starLevel * this._vData.StarPower).toString();
      this.valueTxt2.text =
        "+" + ((this.starLevel + 1) * this._vData.StarPower).toString();
      this.valueTxt3.text = "(" + this._vData.StarPower.toString() + ")";
    }
  }

  private getName(index: number): string {
    let nameStr: string;
    switch (index) {
      case 0:
        nameStr = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip01",
        );
        break;
      case 1:
        nameStr = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip03",
        );
        break;
      case 2:
        nameStr = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip04",
        );
        break;
      case 3:
        nameStr = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip02",
        );
        break;
      case 4:
        nameStr = LangManager.Instance.GetTranslation(
          "sort.view.MemberTitleView.soulScore",
        );
        break;
    }
    return nameStr;
  }

  private get curMountInfo(): MountInfo {
    return MountsManager.Instance.mountInfo;
  }

  public dispose() {
    super.dispose();
  }
}
