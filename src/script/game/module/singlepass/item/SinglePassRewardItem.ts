//@ts-expect-error: External dependencies
import FUI_SinglePassRewardItem from "../../../../../fui/SinglePass/FUI_SinglePassRewardItem";
import { EmWindow } from "../../../constant/UIDefine";
import SinglePassManager from "../../../manager/SinglePassManager";
import SinglePassSocketOutManager from "../../../manager/SinglePassSocketOutManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import { SinglePassAreaRewardData } from "../model/SinglePassAreaRewardData";
import SinglePassModel from "../SinglePassModel";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";

export default class SinglePassRewardItem
  extends FUI_SinglePassRewardItem
  implements ITipedDisplay
{
  extData: any;
  tipData: any;
  tipType: EmWindow;
  canOperate: boolean = false;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 0);
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.addEvent();
    ToolTipsManager.Instance.register(this);
    this.tipType = EmWindow.CommonTips;
  }

  private addEvent() {
    this.rewardBtn.onClick(this, this.rewardBtnHandler);
  }

  private removeEvent() {
    this.rewardBtn.offClick(this, this.rewardBtnHandler);
  }

  public refreshRegister(value: boolean) {
    let singlePassAreaRewardData: SinglePassAreaRewardData =
      TempleteManager.Instance.getAreaRewardByAreaId(
        this.singlePassModel.selectArea,
      );
    let goodsTemplateInfo: t_s_itemtemplateData;
    let item: GoodsInfo;
    let str: string = "";
    for (let i = 0; i < singlePassAreaRewardData.goodsInfoArr.length; i++) {
      item = singlePassAreaRewardData.goodsInfoArr[i];
      str = str + "<br>";
      goodsTemplateInfo =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(item.templateId);
      str += goodsTemplateInfo.TemplateNameLang + "*" + item.count;
    }
    this.tipData = str;
    if (value) {
      ToolTipsManager.Instance.register(this);
    } else {
      ToolTipsManager.Instance.unRegister(this);
    }
  }

  private rewardBtnHandler() {
    ToolTipsManager.Instance.unRegister(this);
    if (
      this.singlePassModel.areaRewardArray &&
      this.singlePassModel.areaRewardArray.indexOf(
        this.singlePassModel.selectArea.toString(),
      ) != -1
    ) {
      //已经领取点击给提示
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "mainBar.TopToolsBar.rechargeBtn.click02",
        ),
      );
      return;
    } else {
      if (
        this.singlePassModel.selectArea <= this.singlePassModel.area &&
        this.singlePassModel.maxIndex >=
          this.singlePassModel.selectArea * SinglePassModel.TOLLGATE_PER_FLOOR
      ) {
        SinglePassSocketOutManager.sendRequestGetAreaReward(
          this.singlePassModel.selectArea,
        );
      } else {
        ToolTipsManager.Instance.register(this);
      }
    }
  }

  private get singlePassModel(): SinglePassModel {
    return SinglePassManager.Instance.model;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
