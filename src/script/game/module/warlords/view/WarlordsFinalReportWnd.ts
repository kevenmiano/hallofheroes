import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../../core/utils/StringHelper";
import WarlordsModel from "../WarlordsModel";
/**
 * 众神之战决赛战报
 */
import LangManager from "../../../../core/lang/LangManager";
export default class WarlordsFinalReportWnd extends BaseWindow {
  public c1: fgui.Controller;
  public titleTxt: fgui.GTextField;
  public myRank: fgui.GRichTextField;
  public mountTxt: fgui.GTextField;
  public appellTxt: fgui.GTextField;
  public gloryTxt: fgui.GTextField;
  public privilegeTxt: fgui.GTextField;
  public privilege: fgui.GGroup;
  public confirmBtn: fgui.GButton;
  public gloryIcon: fgui.GImage;
  private _info: any;
  public gloryGroup: fgui.GGroup;
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    if (this.frameData) {
      this._info = this.frameData;
    }
    this.initEvent();
    this.c1 = this.getController("c1");
    this.initData();
  }

  private initData() {
    if (this._info) {
      let gloryNum: number = Number(this._info["gloryNum"]);
      let mountTime: number = Number(this._info["mountTime"]);
      let mount: string = this._info["mount"];
      let appell: string = this._info["appell"];
      let hasPrivilege: boolean = this._info["hasPrivilege"];
      let displayRank: number = WarlordsModel.getDisplayRank(
        this._info["rank"],
      );
      this.myRank.setVar("rank", displayRank.toString()).flushVars();
      if (displayRank >= 1 && displayRank <= 16) {
        this.titleTxt.text =
          LangManager.Instance.GetTranslation(
            "warlords.WarlordsBetSelectFrame.temple",
          ) +
          "-" +
          LangManager.Instance.GetTranslation(
            "warlords.WarlordsFinalReportWnd.title",
          );
      } else if (displayRank <= 100) {
        this.titleTxt.text =
          LangManager.Instance.GetTranslation(
            "warlords.WarlordsBetSelectFrame.brave",
          ) +
          "-" +
          LangManager.Instance.GetTranslation(
            "warlords.WarlordsFinalReportWnd.title",
          );
      } else {
        this.titleTxt.text = LangManager.Instance.GetTranslation(
          "warlords.WarlordsFinalReportWnd.title",
        );
      }
      if (!StringHelper.isNullOrEmpty(mount)) {
        this.mountTxt.text =
          mount +
          "(" +
          LangManager.Instance.GetTranslation(
            "consortia.view.myConsortia.ConsortiaMemberItem.dayTip",
            mountTime,
          ) +
          ")";
      } else {
        this.mountTxt.text = "";
      }
      if (!StringHelper.isNullOrEmpty(appell)) {
        this.appellTxt.text = LangManager.Instance.GetTranslation(
          "yishi.view.frame.WarlordsFinalReportFrame.str01",
          appell,
        );
        this.gloryGroup.x = 344;
      } else {
        this.appellTxt.text = "";
        this.gloryGroup.x = 97;
      }
      if (gloryNum > 0) {
        this.gloryIcon.visible = true;
        this.gloryTxt.text = gloryNum.toString();
      } else {
        this.gloryIcon.visible = false;
        this.gloryTxt.text = "";
      }
      if (hasPrivilege && displayRank <= 1) {
        this.c1.selectedIndex = 1;
        this.privilegeTxt.text = LangManager.Instance.GetTranslation(
          "yishi.view.frame.WarlordsFinalReportFrame.privilegeContent",
        );
      } else {
        this.c1.selectedIndex = 0;
      }
    }
  }

  private initEvent() {
    this.confirmBtn.onClick(this, this.confirmBtnHandler);
  }

  private removeEvent() {
    this.confirmBtn.offClick(this, this.confirmBtnHandler);
  }

  confirmBtnHandler() {
    this.OnBtnClose();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
