//@ts-expect-error: External dependencies
import FUI_ColosseumBox from "../../../../../fui/Pvp/FUI_ColosseumBox";
import AudioManager from "../../../../core/audio/AudioManager";
import Logger from "../../../../core/logger/Logger";
import { t_s_singlearenarewardsData } from "../../../config/t_s_singlearenarewards";
import { SoundIds } from "../../../constant/SoundIds";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import DayGuideSocketOutManager from "../../../manager/DayGuideSocketOutManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import DegreeActivityBoxData from "../../welfare/data/DegreeActivityBoxData";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import FUIHelper from "../../../utils/FUIHelper";
import ColosseumCtrl from "./ColosseumCtrl";

/**
 * @author:pzlricky
 * @data: 2021-06-30 19:25
 * @description 活跃度宝箱
 */
export default class ColosseumBox
  extends FUI_ColosseumBox
  implements ITipedDisplay
{
  public static DEFAULT: number = 1; //还未到条件领取
  public static OPEN: number = 2; //可领取
  public static CLOSE: number = 3; //已领取

  public index: number = 0;
  private _boxdata: t_s_singlearenarewardsData = null;
  private _state: number = 1;

  tipType: EmWindow = EmWindow.CommonTips;
  tipData: any;
  showType?: TipsShowType = TipsShowType.onClick;
  canOperate?: boolean;
  extData?: any;
  startPoint?: Laya.Point = new Laya.Point(0, 0);
  tipDirctions?: string;
  tipGapV?: number;
  tipGapH?: number;

  onConstruct() {
    super.onConstruct();
    this.onEvent();
  }

  onEvent() {
    this.onClick(this, this.onBoxClick);
  }

  offEvent() {
    ToolTipsManager.Instance.unRegister(this);
    this.offClick(this, this.onBoxClick);
  }

  public setInfo(
    value: t_s_singlearenarewardsData,
    lastWinCount: number,
    winCountReward: string,
  ) {
    this._boxdata = value;
    this.iconBox.url = FUIHelper.getItemURL(
      EmPackName.Pvp,
      "Icon_Box_Dev" + (value.Id - 2000),
    );
    this.tipData = this.getTipsStr(value);
    if (value.Id != 2004) {
      this.startPoint = new Laya.Point(-100, 0);
    }
    this.state = this.getState(lastWinCount, winCountReward);
  }

  getState(lastWinCount: number, winCountReward: string) {
    if (this._boxdata.Property1 > lastWinCount) {
      return ColosseumBox.DEFAULT;
    } else {
      return winCountReward.indexOf(this._boxdata.Id + "") == -1
        ? ColosseumBox.OPEN
        : ColosseumBox.CLOSE;
    }
  }

  public set state(value: number) {
    this._state = value;
    switch (value) {
      case ColosseumBox.DEFAULT:
        this.iconBox.grayed = false;
        this.effect.selectedIndex = 0;
        ToolTipsManager.Instance.register(this);
        break;
      case ColosseumBox.OPEN:
        this.iconBox.grayed = false;
        this.effect.selectedIndex = 1;
        break;
      case ColosseumBox.CLOSE:
        this.iconBox.grayed = true;
        this.effect.selectedIndex = 0;
        ToolTipsManager.Instance.register(this);
        break;
    }
  }

  onBoxClick(evt: Laya.Event) {
    Logger.warn("领取宝箱!!!");
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (this._state == ColosseumBox.OPEN) {
      //领取宝箱奖励
      // DayGuideSocketOutManager.sendGetGoods(this._boxdata.index + 1);
      ColosseumCtrl.requestChallengeReward(this._boxdata.Id);
      evt.stopPropagation();
    }
  }

  /**获取提示 */
  private getTipsStr(data: t_s_singlearenarewardsData): string {
    let str = "";
    if (data.RewardItemID1) {
      str +=
        this.getGoodsName(data.RewardItemID1) + " x" + data.RewardItemCount1;
    }
    if (data.RewardItemID2) {
      str +=
        "<br>" +
        this.getGoodsName(data.RewardItemID2) +
        " x" +
        data.RewardItemCount2;
    }
    return str;
  }

  private getGoodsName(itemId: number): string {
    if (TempleteManager.Instance.getGoodsTemplatesByTempleteId(itemId))
      return TempleteManager.Instance.getGoodsTemplatesByTempleteId(itemId)
        .TemplateNameLang;
    else return "";
  }

  dispose() {
    this.offEvent();
    super.dispose();
  }
}
