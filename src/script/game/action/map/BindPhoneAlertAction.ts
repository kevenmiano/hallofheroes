/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-02 12:23:50
 * @LastEditTime: 2023-08-17 17:15:41
 * @LastEditors: jeremy.xu
 * @Description: 提示绑定手机弹窗
 */

import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerManager } from "../../manager/PlayerManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import NewbieBaseActionMediator from "../../module/guide/mediators/NewbieBaseActionMediator";
import { WelfareManager } from "../../module/welfare/WelfareManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import UIHelper from "../../utils/UIHelper";

export class BindPhoneAlertAction extends MapBaseAction {
  public prepare() {}

  public update() {
    this._count++;
    if (this._count >= 24) {
      this._count = 0;
      if (
        SceneManager.Instance.currentType == SceneType.SPACE_SCENE &&
        !NewbieBaseActionMediator.isExistNewbieMask &&
        !UIManager.Instance.isShowing(EmWindow.LevelUp)
      ) {
        WelfareManager.Instance.firstOpenBindPhoneAlert();
        let content = LangManager.Instance.GetTranslation(
          "BindVertify.alertGoBindPhone",
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          null,
          content,
          null,
          null,
          (b: boolean) => {
            if (b) {
              UIHelper.closeWindows();
              FrameCtrlManager.Instance.open(EmWindow.Welfare, {
                str: LangManager.Instance.GetTranslation(
                  "welfareWnd.tabTitle.bindPhone",
                ),
              });
            }
          },
        );
        this.actionOver();
      }
    }
  }

  protected actionOver() {
    super.actionOver();
  }
}
