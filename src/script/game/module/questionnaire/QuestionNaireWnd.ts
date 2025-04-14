//@ts-expect-error: External dependencies
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import Utils from "../../../core/utils/Utils";
import { BaseItem } from "../../component/item/BaseItem";
import { t_s_configData } from "../../config/t_s_config";
import { ConfigType } from "../../constant/ConfigDefine";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import QuestionnaireManager from "../../manager/QuestionnaireManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
/**
 * @author:pzlricky
 * @data: 2021-10-15 16:07
 * @description 有奖问答
 */
export default class QuestionNaireWnd extends BaseWindow {
  public awardList: fgui.GList;
  public Btn_question: UIButton;
  private leftTime: fgui.GRichTextField;
  private awardListData: Array<any> = [];

  private _countDown: number = 0; //倒计时（秒）

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();
    this.initView();
  }

  private initView() {
    this.initListData();
    let serverNowTime = PlayerManager.Instance.currentPlayerModel.nowDate;
    let endTime = QuestionnaireManager.Instance.model.questionEndTime;
    this._countDown = (endTime - serverNowTime) / 1000;
    if (this._countDown > 0) {
      this.updateCountDown();
      Laya.timer.loop(1000, this, this.updateCountDown);
    }
  }

  private updateCountDown() {
    if (this._countDown > 0) {
      this.leftTime
        .setVar(
          "text",
          LangManager.Instance.GetTranslation(
            "map.campaign.view.ui.demon.ConsortiaDemonWoundView.activityTimeTip",
          ),
        )
        .flushVars();
      let countDown: string = DateFormatter.getFullDateString(this._countDown);
      this.leftTime.setVar("time", countDown.toString()).flushVars();
      this._countDown--;
    } else {
      this.leftTime
        .setVar(
          "text",
          LangManager.Instance.GetTranslation("answer.errinfo.end"),
        )
        .flushVars();
      this.leftTime.setVar("time", "").flushVars();
      Laya.timer.clear(this, this.updateCountDown);
    }
  }

  private addEvent() {
    Utils.setDrawCallOptimize(this.awardList);
    this.awardList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.Btn_question.onClick(this, this.onConfirm);
  }

  private offEvent() {
    // this.awardList && this.awardList.itemRenderer.recover();
    Utils.clearGListHandle(this.awardList);
    this.Btn_question.onClick(this, this.onConfirm);
  }

  /**奖励物品列表 */
  private initListData() {
    let Questionnaire_reward: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName(
        "Questionnaire_reward",
      );
    if (!Questionnaire_reward) {
      return;
    }
    let ConfigValue = Questionnaire_reward.ConfigValue;
    let datalist = ConfigValue.split("|");
    this.awardListData = [];
    let count = datalist.length;
    for (let index = 0; index < count; index++) {
      let element = datalist[index].split(",");
      let itemId = Number(element[0]);
      let itemCount = Number(element[1]);
      if (itemId != 0 && itemCount > 0) {
        let goodInfo: GoodsInfo = new GoodsInfo();
        goodInfo.id = itemId;
        goodInfo.templateId = itemId;
        goodInfo.count = itemCount;
        this.awardListData.push(goodInfo);
      }
    }
    this.awardList.numItems = this.awardListData.length;
  }

  private onConfirm() {
    FrameCtrlManager.Instance.exit(EmWindow.QuestionNaireWnd);
    FrameCtrlManager.Instance.open(EmWindow.QuestionWnd);
  }

  renderListItem(index: number, item: BaseItem) {
    let itemdata = this.awardListData[index];
    item.info = itemdata;
  }

  OnShowWind() {
    super.OnShowWind();
  }

  OnHideWind() {
    super.OnHideWind();
    Laya.timer.clear(this, this.updateCountDown);
    this.offEvent();
  }
}
