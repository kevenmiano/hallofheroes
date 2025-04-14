//@ts-expect-error: External dependencies
import FUI_OfferRewardItem from "../../../../fui/Space/FUI_OfferRewardItem";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { KingContractManager } from "../../manager/KingContractManager";
import OfferRewardManager from "../../manager/OfferRewardManager";
import { OfferRewardModel } from "../../mvc/model/OfferRewardModel";
import { KingContractInfo } from "../kingcontract/KingContractInfo";
import OfferRewardTemplate from "./OfferRewardTemplate";
import LangManager from "../../../core/lang/LangManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { EmWindow } from "../../constant/UIDefine";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import { VIPManager } from "../../manager/VIPManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { MopupManager } from "../../manager/MopupManager";
import FUIHelper from "../../utils/FUIHelper";
import UIManager from "../../../core/ui/UIManager";
export default class OfferRewardItem extends FUI_OfferRewardItem {
  public rewardPos: number;
  private _vdata: OfferRewardTemplate;
  private _state: number;
  private _profile: number;
  protected onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  private addEvent() {
    this.Btn_accept.onClick(this, this.__onAcceptClick.bind(this));
    this.Btn_quick.onClick(this, this.__onQuickClick.bind(this));
    this.Btn_recive.onClick(this, this.__onReciveClick.bind(this));
    this.giveBtn.onClick(this, this.__onGiveUpClick.bind(this));
    this.onClick(this, this.onClickHandler);
  }

  private removeEvent() {
    this.Btn_accept.offClick(this, this.__onAcceptClick.bind(this));
    this.Btn_quick.offClick(this, this.__onQuickClick.bind(this));
    this.Btn_recive.offClick(this, this.__onReciveClick.bind(this));
    this.giveBtn.offClick(this, this.__onGiveUpClick.bind(this));
    this.offClick(this, this.onClickHandler);
  }

  private onClickHandler() {
    if (this._state == OfferRewardModel.REWARD_STATE_ACCEPTED) {
      SwitchPageHelp.skipPageByTaskCondictionType(
        this._vdata,
        this.openTaskFrame,
        this,
      );
      UIManager.Instance.HideWind(EmWindow.OfferRewardWnd);
    }
  }

  private __onAcceptClick(event: Laya.Event) {
    if (this._vdata && this.checkCanAccept) {
      if (this.rewardPos == -1) {
        //接取悬赏公文任务
        if (this._vdata.NeedMaxLevel < ArmyManager.Instance.thane.grades) {
          //等级条件不满足
          var confirm: string =
            LangManager.Instance.GetTranslation("public.confirm");
          var cancel: string =
            LangManager.Instance.GetTranslation("public.cancel");
          var prompt: string =
            LangManager.Instance.GetTranslation("public.prompt");
          var content: string = LangManager.Instance.GetTranslation(
            "offerRewardItem.acceptClick.content1",
          );
          SimpleAlertHelper.Instance.Show(
            SimpleAlertHelper.SIMPLE_ALERT,
            null,
            prompt,
            content,
            confirm,
            cancel,
            this.onAcceptConfirm.bind(this),
          );
        } else {
          OfferRewardManager.Instance.sendAddRewardTask(this.rewardPos);
        }
      } else {
        //接取普通任务
        if (this._vdata.NeedMaxLevel < ArmyManager.Instance.thane.grades) {
          //等级条件不满足
          var confirm: string =
            LangManager.Instance.GetTranslation("public.confirm");
          var cancel: string =
            LangManager.Instance.GetTranslation("public.cancel");
          var prompt: string =
            LangManager.Instance.GetTranslation("public.prompt");
          var content: string = LangManager.Instance.GetTranslation(
            "offerRewardItem.acceptClick.content2",
          );
          SimpleAlertHelper.Instance.Show(
            SimpleAlertHelper.SIMPLE_ALERT,
            null,
            prompt,
            content,
            confirm,
            cancel,
            this.onAcceptConfirm.bind(this),
          );
        } else {
          OfferRewardManager.Instance.sendAddRewardTask(this.rewardPos);
        }
      }
    }
    event.stopPropagation();
  }

  private onAcceptConfirm(b: boolean, flag: boolean) {
    if (b) {
      OfferRewardManager.Instance.sendAddRewardTask(this.rewardPos);
    }
  }

  private __onQuickClick(event: Laya.Event) {
    if (
      VIPManager.Instance.model.isOpenPrivilege(
        VipPrivilegeType.OFFER_REWARD_LIMIT,
        VIPManager.Instance.model.vipInfo.VipGrade,
      )
    ) {
      //有特权, 直接完成
      OfferRewardManager.Instance.sendFinishRewardTask(this._vdata.TemplateId);
    } else {
      if (this._state == OfferRewardModel.REWARD_STATE_ACCEPTED) {
        SwitchPageHelp.skipPageByTaskCondictionType(
          this._vdata,
          this.openTaskFrame,
          this,
        );
        UIManager.Instance.HideWind(EmWindow.OfferRewardWnd);
      }
    }
    event.stopPropagation();
  }

  private openTaskFrame() {
    if (MopupManager.Instance.model.isMopup) {
      var str: string = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.TaskWnd, this._vdata);
  }

  private __onGiveUpClick(event: Laya.Event) {
    if (this._vdata) {
      var confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      var content: string = LangManager.Instance.GetTranslation(
        "task.TaskFrameII.content",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        this.removeRewardTaskCallBack.bind(this),
      );
    }
    event.stopPropagation();
  }

  private __onReciveClick() {
    OfferRewardManager.Instance.sendFinishRewardTask(this._vdata.TemplateId);
  }

  private removeRewardTaskCallBack(b: boolean, flag: boolean) {
    if (b) {
      if (this._vdata && this._vdata.TemplateId) {
        let rewardData =
          OfferRewardManager.Instance.model.baseRewardDic[
            this._vdata.TemplateId
          ];
        if (rewardData) {
          OfferRewardManager.Instance.sendRemoveRewardTask(rewardData.rewardID);
        }
      }
    }
  }

  private get checkCanAccept(): boolean {
    var str: string = "";
    if (OfferRewardManager.Instance.model.baseRewardDic.getList().length >= 1) {
      str = LangManager.Instance.GetTranslation(
        "buildings.offerreward.view.OfferTaskItem.command01",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (OfferRewardManager.Instance.model.remainRewardCount <= 0) {
      str = LangManager.Instance.GetTranslation(
        "buildings.offerreward.view.OfferTaskItem.command02",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (this._vdata.isOutDate) {
      str = LangManager.Instance.GetTranslation(
        "buildings.offerreward.view.OfferTaskItem.outDateTip",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (!this._vdata.isReachDate) {
      str = LangManager.Instance.GetTranslation(
        "buildings.offerreward.view.OfferTaskItem.unreachDateTip",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    return true;
  }

  private setColor(frame: number): string {
    let colorArray: Array<string> = [
      "#ffffff",
      "#59cd41",
      "#32a2f8",
      "#a838f7",
      "#ff8000",
    ];
    return colorArray[frame - 1];
  }

  public setData(temp: OfferRewardTemplate, profile: number, state: number) {
    this._vdata = temp;
    this._profile = profile;
    this._state = state;
    if (this._vdata) {
      let findedIndex = this._vdata.TitleLang.lastIndexOf("(");
      if (findedIndex >= 0) {
        this.TaskTitleTxt.text = this._vdata.TitleLang.substring(
          0,
          findedIndex,
        );
      } else {
        this.TaskTitleTxt.text = this._vdata.TitleLang;
      }
      this.TaskContentTxt.text =
        this._vdata.conditionList[0].CondictionTitleLang +
        " (0/" +
        this._vdata.conditionList[0].Para2 +
        ")";

      // 判断悬赏任务是否已经接取, 已经达到完成条件
      let tagColor = false;
      let baseRewardTemp = OfferRewardManager.Instance.model.getAcceptTaskTemp(
        temp.TemplateId,
      );
      if (
        baseRewardTemp &&
        this._state == OfferRewardModel.REWARD_STATE_ACCEPTED
      ) {
        let progress = baseRewardTemp.getProgress();
        if (progress.length > 0) {
          this.TaskContentTxt.text =
            this._vdata.conditionList[0].CondictionTitleLang +
            " " +
            progress[0];
        }

        if (baseRewardTemp.isCompleted) {
          this._state = OfferRewardModel.REWARD_STATE_REACH_ALLCONDITION;
        }
      }

      if (this._profile != 5) {
        this.TaskExpValueTxt.text = (
          this._vdata.RewardPlayGP *
          this._profile *
          this.thane.grades
        ).toString();
        this.TaskGoldValueTxt.text = (
          this._vdata.RewardGold *
          this._profile *
          this.thane.grades
        ).toString();
      } else {
        this.TaskGoldValueTxt.text = (
          this._vdata.RewardGold *
          (this._profile + 1) *
          this.thane.grades
        ).toString();
        this.TaskExpValueTxt.text = (
          this._vdata.RewardPlayGP *
          (this._profile + 1) *
          this.thane.grades
        ).toString();
      }
      if (this._profile <= 5 && this._profile >= 1) {
        this.TaskTitleTxt.color = this.setColor(this._profile);
      }

      this.TaskContentTxt.color = "#ffecc6";
      this.Btn_accept.enabled = true;
      this.Btn_recive.visible = false;
      switch (this._state) {
        case OfferRewardModel.REWARD_STATE_CANACCEPT:
          this.Btn_accept.visible = true;
          this.Img_HasComplete.visible = false;
          this.Btn_quick.visible = false;
          this.giveBtn.visible = false;
          if (this.rewardPos == -1) {
            //道具接受
            this.picIcon.url = FUIHelper.getItemURL("Space", "Icon_Task2_1");
          } else {
            this.picIcon.url = FUIHelper.getItemURL("Space", "Icon_Task1_1");
          }
          break;
        case OfferRewardModel.REWARD_STATE_ACCEPTED:
          this.giveBtn.visible = true;
          if (this.kingInfo.leftTime <= 0) {
            this.Btn_accept.visible = false;
            this.Img_HasComplete.visible = false;
            this.Btn_quick.visible = true;
            if (
              VIPManager.Instance.model.isOpenPrivilege(
                VipPrivilegeType.OFFER_REWARD_LIMIT,
                VIPManager.Instance.model.vipInfo.VipGrade,
              )
            ) {
              //有特权, 直接完成
              this.Btn_quick.title = LangManager.Instance.GetTranslation(
                "ui.tasktracebar.view.TaskTraceItem.CompletedImmediately",
              );
            } else {
              this.Btn_quick.title = LangManager.Instance.GetTranslation(
                "gameguide.GameGuideFrame.skipNow",
              );
            }
          } else {
            this.Btn_accept.visible = true;
            this.Btn_accept.enabled = false;
            this.Img_HasComplete.visible = false;
            this.Btn_quick.visible = false;
          }
          if (this.rewardPos == -1) {
            //道具已经接受
            this.picIcon.url = FUIHelper.getItemURL("Space", "Icon_Task2_2");
          } else {
            this.picIcon.url = FUIHelper.getItemURL("Space", "Icon_Task1_2");
          }
          break;
        case OfferRewardModel.REWARD_STATE_COMPLETED:
          this.Btn_accept.visible = false;
          this.Img_HasComplete.visible = true;
          this.Btn_quick.visible = false;
          this.giveBtn.visible = false;
          this.TaskContentTxt.text =
            this._vdata.conditionList[0].CondictionTitleLang +
            " (" +
            this._vdata.conditionList[0].Para2 +
            "/" +
            this._vdata.conditionList[0].Para2 +
            ")";
          this.picIcon.url = FUIHelper.getItemURL("Space", "Icon_Task1_2");
          break;
        case OfferRewardModel.REWARD_STATE_REACH_ALLCONDITION:
          this.TaskContentTxt.color = "#7ddf26";
          this.Btn_recive.visible = true;
          this.Btn_accept.visible = false;
          this.Img_HasComplete.visible = false;
          this.Btn_quick.visible = false;
          this.giveBtn.visible = false;
          this.TaskContentTxt.text =
            this._vdata.conditionList[0].CondictionTitleLang +
            " " +
            LangManager.Instance.GetTranslation(
              "buildings.offerreward.data.BaseOfferReward.progress",
            );
          this.picIcon.url = FUIHelper.getItemURL("Space", "Icon_Task1_2");
          break;
      }
    } else {
      this.TaskTitleTxt.text = "";
      this.TaskContentTxt.text = "";
      this.TaskExpValueTxt.text = "";
      this.TaskGoldValueTxt.text = "";
      this.Btn_accept.visible = false;
      this.Img_HasComplete.visible = false;
      this.Btn_quick.visible = false;
      this.giveBtn.visible = false;
      this.Btn_recive.visible = false;
    }
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get kingInfo(): KingContractInfo {
    return KingContractManager.Instance.model.getInfoById(2);
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
