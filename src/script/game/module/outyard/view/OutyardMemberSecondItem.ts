import FUI_OutyardMemberSecondItem from "../../../../../fui/OutYard/FUI_OutyardMemberSecondItem";
import { UIFilter } from "../../../../core/ui/UIFilter";
import StringHelper from "../../../../core/utils/StringHelper";
import { JobType } from "../../../constant/JobType";
import { EmWindow } from "../../../constant/UIDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import ConfigInfoManager from "../../../manager/ConfigInfoManager";
import OutyardManager from "../../../manager/OutyardManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import OutyardUserInfo from "../data/OutyardUserInfo";
//@ts-expect-error: External dependencies
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;
import OutyardModel from "../OutyardModel";
import FUIHelper from "../../../utils/FUIHelper";
export default class OutyardMemberSecondItem extends FUI_OutyardMemberSecondItem {
  private _info: OutyardUserInfo;
  private _thaneInfo: ThaneInfo;
  private _index: number;
  private _flag: boolean;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  private addEvent() {
    this.changeBtn.onClick(this, this.changeBtnHandler);
  }

  private removeEvent() {
    this.changeBtn.offClick(this, this.changeBtnHandler);
  }

  private changeBtnHandler() {
    FrameCtrlManager.Instance.open(EmWindow.OutyardChangeWnd, {
      selectSenior: this._index,
      defaultSelectInfo: this._info,
    });
  }

  public set index(value: number) {
    this._index = value;
  }

  public get info(): OutyardUserInfo {
    return this._info;
  }

  public set flag(value: boolean) {
    this._flag = value;
  }

  public set info(value: OutyardUserInfo) {
    if (value) {
      this._info = value;
      this._thaneInfo = this._info.thane;
      this.jobIcon.icon = JobType.getJobIcon(this._info.job);
      let str: string = "asset.outyard.bing" + this._index;
      this.indexIcon.icon = FUIHelper.getItemURL("OutYard", str);
      this.countValueTxt.text = this._info.defenceDebuffLevel.toString();
      this.addPrecentTxt2.text =
        (
          100 -
          OutyardManager.Instance.defenceDebuffArr[0] *
            this._info.defenceDebuffLevel
        ).toString() + "%";
      this.userNameTxt.text = this._thaneInfo.nickName
        ? this._thaneInfo.nickName
        : "";
      this.indexIcon.visible = this._thaneInfo.nickName ? true : false;
      this.fightValueTxt.text = this._thaneInfo.fightingCapacity.toString();
      var config: Array<any> =
        ConfigInfoManager.Instance.getStackHeadSeniorGeneralBuff();
      let defenceValue: number = config[this._info.index - 1];
      this.addPrecentTxt.text = defenceValue + "%";
      let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
      if (stateMsg.state == OutyardModel.FIGHTING) {
        if (
          this._info.defenceAlive ||
          StringHelper.isNullOrEmpty(this._info.userUid)
        ) {
          //如果有人是活着的或者位置没有人
          UIFilter.normal(this);
          this.changeBtn.titleColor = "#FFF6B9";
          //@ts-expect-error: chageBtn._titleObject not recognized
          this.changeBtn._titleObject.strokeColor = "#7F2101";
          if (this._flag) {
            this.changeBtn.enabled = true;
          } else {
            this.changeBtn.enabled = false;
          }
        } else {
          UIFilter.gray(this);
          this.enabled = false;
          this.changeBtn.titleColor = "#aaaaaa";
          //@ts-expect-error: chageBtn._titleObject not recognized
          this.changeBtn._titleObject.strokeColor = "#666666";
        }
      } else {
        UIFilter.normal(this);
        this.changeBtn.titleColor = "#FFF6B9";
        //@ts-expect-error: chageBtn._titleObject not recognized
        this.changeBtn._titleObject.strokeColor = "#7F2101";
        if (this._flag) {
          this.changeBtn.enabled = true;
        } else {
          this.changeBtn.enabled = false;
        }
      }
    } else {
      UIFilter.normal(this);
      this.enabled = true;
      this.changeBtn.titleColor = "#FFF6B9";
      //@ts-expect-error: chageBtn._titleObject not recognized
      this.changeBtn._titleObject.strokeColor = "#7F2101";
      this.jobIcon.icon = "";
      this.userNameTxt.text = "";
      this.fightValueTxt.text = "";
      this.addPrecentTxt.text = "";
      this.changeBtn.visible = false;
    }
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
