import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { RoleCtrl } from "../../bag/control/RoleCtrl";
import FUI_TattooHoleView from "../../../../../fui/SBag/FUI_TattooHoleView";
import { TattooHole } from "./model/TattooHole";
import LangManager from "../../../../core/lang/LangManager";
import { TattooModel } from "./model/TattooModel";
import StringUtils from "../../../utils/StringUtils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/1/9 19:58
 * @ver 1.0
 */

export class TattooHoleView extends FUI_TattooHoleView {
  private _index: number = 0;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    // this.refresh();
  }

  /**
   * 设置龙纹槽信息
   * @param type  龙纹所在的位置类型, 1: 在龙纹主界面；2: 洗炼界面旧龙纹；3: 洗炼界面新龙纹
   * @param hole
   */
  public setHoleInfo(type: number, hole: TattooHole): void {
    switch (type) {
      case 1:
        this.tattooExp2.getChild("title").visible = false;
        this.progressType.selectedIndex = 1;
        this.showTxt.selectedIndex = 0;
        this.g_value.visible = hole.oldAddProperty >= 0;
        this.isLock.selectedIndex = hole.isLock ? 0 : 1;
        let step: number = hole.oldStep;
        if (step <= 2) {
          this.img_lv_bg.url = "";
        } else if (step >= 5) {
          this.img_lv_bg.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            `Img_Lv3_${TattooModel.PROPERTY_NAME[hole.oldAddProperty]}`,
          );
        } else {
          this.img_lv_bg.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            `Img_Lv2_${TattooModel.PROPERTY_NAME[hole.oldAddProperty]}`,
          );
        }

        if (hole.oldAddProperty >= 0) {
          //上一阶
          let preStep = step - 1;
          //上一阶上限值
          let preStepVal =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(
              preStep,
            );
          //本阶上限值
          let curStepVal =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(step);
          let barVal = hole.oldAddingValue - preStepVal;
          this.tattooExp1.max = curStepVal - preStepVal;
          this.tattooExp2.max = curStepVal - preStepVal;
          let realMax =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(step);
          this.showTxt.selectedIndex = 0;
          this.g_exp.visible = true;
          this.icon_tattoo.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            "Icon_Tattoo_" + TattooModel.PROPERTY_NAME[hole.oldAddProperty],
          );
          //{name=力量} [color=#ffecc6]+{value=560}[/color]
          this.txt_name
            .setVar(
              "name",
              LangManager.Instance.GetTranslation(
                "tattoo.TattooPopFrame.propertyName" + hole.oldAddProperty,
              ),
            )
            .setVar("value", "" + hole.oldAddingValue)
            .flushVars();

          this.txt_attr1
            .setVar(
              "name",
              LangManager.Instance.GetTranslation(
                "tattoo.TattooPopFrame.propertyName" + hole.oldReduceProperty,
              ),
            )
            .setVar("value", "" + hole.oldReduceValue)
            .flushVars();
          this.txt_step1.text = this.txt_step2.text =
            StringUtils.getRomanNumber(step);
          // this.tattooExp1.value = hole.oldAddingValue;

          //槽位的进度条修改为“上阶上限到本阶上限的差值为100%”
          //2阶上限为120, 3阶上限为210, 显示为3阶, 则进度条应该为: （120-120）/（210-120）=0
          this.tattooExp2.value = this.tattooExp1.value = barVal;
          this.tattooExp1.getChild("title").asTextField.text =
            hole.oldAddingValue + "/" + realMax;
          this.tattooExp2.getChild("title").asTextField.text =
            hole.oldAddingValue + "/" + realMax;
        } else {
          this.showTxt.selectedIndex = 1;
          this.icon_tattoo.url = "";
          this.g_exp.visible = false;
        }
        break;
      case 2:
        this.progressType.selectedIndex = 0;
        this.isLock.selectedIndex = 1;
        let oldStep: number = hole.oldStep;
        if (oldStep <= 2) {
          this.img_lv_bg.url = "";
        } else if (oldStep >= 5) {
          this.img_lv_bg.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            `Img_Lv3_${TattooModel.PROPERTY_NAME[hole.oldAddProperty]}`,
          );
        } else {
          this.img_lv_bg.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            `Img_Lv2_${TattooModel.PROPERTY_NAME[hole.oldAddProperty]}`,
          );
        }

        if (hole.oldAddProperty >= 0) {
          //上一阶
          let preStep = oldStep - 1;
          //上一阶上限值
          let preStepVal =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(
              preStep,
            );
          //本阶上限值
          let curStepVal =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(
              oldStep,
            );
          let barVal = hole.oldAddingValue - preStepVal;
          this.tattooExp1.max = curStepVal - preStepVal;
          this.tattooExp2.max = curStepVal - preStepVal;
          let realMax =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(
              oldStep,
            );
          this.g_exp.visible = true;
          this.icon_tattoo.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            "Icon_Tattoo_" + TattooModel.PROPERTY_NAME[hole.oldAddProperty],
          );
          //{name=力量} [color=#ffecc6]+{value=560}[/color]
          this.txt_name
            .setVar(
              "name",
              LangManager.Instance.GetTranslation(
                "tattoo.TattooPopFrame.propertyName" + hole.oldAddProperty,
              ),
            )
            .setVar("value", "" + hole.oldAddingValue)
            .flushVars();
          this.txt_step1.text = this.txt_step2.text =
            StringUtils.getRomanNumber(oldStep);
          this.tattooExp1.value = barVal;
          this.tattooExp2.value = barVal;
          this.tattooExp1.getChild("title").asTextField.text =
            hole.oldAddingValue + "/" + realMax;
          this.tattooExp2.getChild("title").asTextField.text =
            hole.oldAddingValue + "/" + realMax;
        } else {
          this.icon_tattoo.url = "";
          this.g_exp.visible = false;
        }
        break;
      case 3:
        this.progressType.selectedIndex = 0;
        this.isLock.selectedIndex = 1;
        let newStep: number = hole.newStep;
        if (newStep <= 2) {
          this.img_lv_bg.url = "";
        } else if (newStep >= 5) {
          this.img_lv_bg.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            `Img_Lv3_${TattooModel.PROPERTY_NAME[hole.newAddProperty]}`,
          );
        } else {
          this.img_lv_bg.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            `Img_Lv2_${TattooModel.PROPERTY_NAME[hole.newAddProperty]}`,
          );
        }

        if (hole.newAddProperty >= 0) {
          //上一阶
          let preStep = newStep - 1;
          //上一阶上限值
          let preStepVal =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(
              preStep,
            );
          //本阶上限值
          let curStepVal =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(
              newStep,
            );
          let barVal = hole.newAddingValue - preStepVal;
          this.tattooExp1.max = curStepVal - preStepVal;
          this.tattooExp2.max = curStepVal - preStepVal;
          let realMax =
            this.tattooController.tattooModel.getProtertyValueMaxByStep(
              newStep,
            );
          this.g_exp.visible = true;
          this.icon_tattoo.url = fgui.UIPackage.getItemURL(
            EmWindow.SBag,
            "Icon_Tattoo_" + TattooModel.PROPERTY_NAME[hole.newAddProperty],
          );
          //{name=力量} [color=#ffecc6]+{value=560}[/color]
          this.txt_name
            .setVar(
              "name",
              LangManager.Instance.GetTranslation(
                "tattoo.TattooPopFrame.propertyName" + hole.newAddProperty,
              ),
            )
            .setVar("value", "" + hole.newAddingValue)
            .flushVars();
          this.txt_step1.text = this.txt_step2.text =
            StringUtils.getRomanNumber(newStep);
          this.tattooExp1.value = barVal;
          this.tattooExp2.value = barVal;
          this.tattooExp1.getChild("title").asTextField.text =
            hole.newAddingValue + "/" + realMax;
          this.tattooExp2.getChild("title").asTextField.text =
            hole.newAddingValue + "/" + realMax;
        } else {
          this.icon_tattoo.url = "";
          this.g_exp.visible = false;
        }
        break;
    }
  }

  private get tattooController(): RoleCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
  }

  public get index(): number {
    return this._index;
  }

  public set index(value: number) {
    this._index = value;
  }

  dispose() {
    super.dispose();
  }
}
