//@ts-expect-error: External dependencies
import FUI_TaskRewardItem from "../../../../fui/Task/FUI_TaskRewardItem";
import Utils from "../../../core/utils/Utils";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";

export default class TaskRewardItem extends FUI_TaskRewardItem {
  declare public tipItem: BaseTipItem;

  protected onConstruct() {
    super.onConstruct();
    this.tipItem = this.getChild("tipItem") as BaseTipItem;
    Utils.setDrawCallOptimize(this);
  }

  public set propertyName(value: number) {
    let templateId: number = this.getTemplateId(value);
    this.tipItem.setInfo(templateId);
  }

  private getTemplateId(value: number): number {
    let templateId: number = 0;
    this.rewardCountTxt.x = 32;
    if (value == 1) {
      templateId = TemplateIDConstant.TEMP_ID_EXP;
      this.rewardCountTxt.x = 45;
    } else if (value == 2) {
      templateId = TemplateIDConstant.TEMP_ID_GOLD;
    } else if (value == 3) {
      templateId = TemplateIDConstant.TEMP_ID_CONSORTIA_CAIFU;
    } else {
      templateId = TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE;
    }
    return templateId;
  }

  public set propertyValue(value: string) {
    this.rewardCountTxt.text = value;
  }

  public dispose() {
    super.dispose();
  }
}
