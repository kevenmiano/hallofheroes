/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-18 20:32:29
 * @LastEditTime: 2022-07-11 15:22:58
 * @LastEditors: jeremy.xu
 * @Description: 试炼之塔
 */

import WXAdapt from "@/script/core/sdk/wx/adapt/WXAdapt";
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import Utils from "../../../core/utils/Utils";
import { UIAlignType } from "../../constant/UIAlignType";
// import WXAdapt from "../../../core/adapt/WXAdapt"; // Import WXAdapt
import { EmWindow } from "../../constant/UIDefine";
import UIButton from "@/script/core/ui/UIButton";

export default class TrailMapWnd extends BaseWindow {
  protected resizeContent: boolean = true;
  // private btnInOut: fgui.GButton;//弹出按钮
  private trailMapPanel: fgui.GComponent; //试炼之塔Panel窗口
  // private isMoving: boolean = false;
  private btnSetting: fgui.GButton | null = null; // Define btnSetting property
  private btnShop: fgui.GButton | null = null; // Define btnShop property
  private rTxtContent: fgui.GRichTextField | null = null; // Define rTxtContent property
  // private isMoving: boolean = false;

  public OnInitWind() {
    super.OnShowWind();
    this.rTxtContent = this.trailMapPanel.getChild(
      "rTxtContent",
    ) as fgui.GRichTextField;
    // let model = CampaignManager.Instance.trialModel
    // if(model){
    //     let str = "当前层数: [color=#FFECC6]" + model.currentLayer +"[/color]<br/>"
    //     str += "已获得经验: [color=#FFECC6]" + model.rewardExp +"[/color]<br/>"
    //     str += "已获得试炼宝箱: [color=#FFECC6]" + model.rewardBox +"[/color]"
    //     this.rTxtContent.text = str
    // }

    this.rTxtContent.text =
      LangManager.Instance.GetTranslation("TrailMapWnd.Tip");
    if (this.btnShop) {
      WXAdapt.Instance.wxMenuAdapt(this.btnShop as unknown as UIButton); // Ensure valid statement
    }
    if (Utils.isWxMiniGame()) {
      if (this.btnShop) {
        WXAdapt.Instance.wxMenuAdapt(this.btnShop as unknown as UIButton);
      }

      if (this.btnSetting) {
        WXAdapt.Instance.wxMenuAdapt(this.btnSetting as unknown as UIButton);
      }
    }
  }

  OnShowWind() {
    super.OnShowWind();
  }

  /**
   * 试炼之塔剩余次数窗口
   */
  // btnInOutClick() {
  //     if (this.isMoving) {
  //         return;
  //     }
  //     this.isMoving = true;
  //     let localX: number = this.trailMapPanel.x;
  //     if (this.btnInOut.selected) {
  //         Laya.Tween.to(this.trailMapPanel, { x: localX - 310 }, 100, undefined,
  //             Laya.Handler.create(this, () => {
  //                 this.isMoving = false;
  //                 this.btnInOut.selected = false;
  //             }));
  //     } else {
  //         Laya.Tween.to(this.trailMapPanel, { x: localX + 310 }, 100, undefined,
  //             Laya.Handler.create(this, () => {
  //                 this.isMoving = false;
  //                 this.btnInOut.selected = true;
  //             }));
  //     }
  // }

  /**
   * 商城按钮点击
   */
  btnShopClick() {
    Logger.error("商城点击");
    UIManager.Instance.ShowWind(EmWindow.TrailMapShop);
  }
}
