/*
 * @Author: jeremy.xu
 * @Date: 2021-05-25 17:18:33
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-20 16:11:19
 * @Description: 英灵属性tips
 */

import BaseTips from "../../../tips/BaseTips";
import { PetData } from "../data/PetData";

export class PetAttrTip extends BaseTips {
  public tipData: PetData;
  public extData: any;

  private txtPowerVal: fgui.GLabel;
  private txtStaminaVal: fgui.GLabel;
  private txtIntelligenceVal: fgui.GLabel;
  private txtArmorVal: fgui.GLabel;
  private txtFireResVal: fgui.GLabel;
  private txtWaterResVal: fgui.GLabel;
  private txtLightResVal: fgui.GLabel;
  private txtWindResVal: fgui.GLabel;
  private txtElectResVal: fgui.GLabel;
  private txtDarkResVal: fgui.GLabel;

  public OnShowWind() {
    super.OnShowWind();
    this.tipData = this.params[0];
    this.initView();
    this.contentPane.ensureBoundsCorrect();
  }

  private initView() {
    let value = this.tipData as PetData;
    this.txtPowerVal.text = value.strength.toString();
    this.txtStaminaVal.text = value.stamina.toString();
    this.txtIntelligenceVal.text = value.intellect.toString();
    this.txtArmorVal.text = value.armor.toString();
  }
}
