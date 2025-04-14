//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 18:26:32
 * @LastEditTime: 2021-12-06 20:35:43
 * @LastEditors: jeremy.xu
 * @Description:
 */
import LangManager from "../../../core/lang/LangManager";
import { SocketManager } from "../../../core/net/SocketManager";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import Utils from "../../../core/utils/Utils";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { StarBagType } from "../../constant/StarDefine";
import { EmWindow } from "../../constant/UIDefine";
import { TrailPropInfo } from "../../datas/TrailPropInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import FUIHelper from "../../utils/FUIHelper";

import TrialInfoMsg = com.road.yishi.proto.battle.TrialInfoMsg;

export default class TrailMapShopCellItem extends fgui.GComponent {
  private _goodItem: fgui.GButton; //物品Item
  private _costDiamond: fgui.GLoader; //花费消耗图标Icon
  private _itemName: fgui.GLabel; //物品名称
  private _costNum: fgui.GLabel; //花费数量
  private _buyBtn: UIButton; //购买按钮
  private _info: TrailPropInfo;

  protected onConstruct() {
    super.onConstruct();
    this._goodItem = this.getChild("goodItem").asButton;
    this._costDiamond = this.getChild("costDiamond").asLoader;
    this._itemName = this.getChild("itemName").asLabel;
    this._costNum = this.getChild("costNum").asLabel;
    let buyButton = this.getChild("buyBtn").asButton;
    this._buyBtn = new UIButton(buyButton);
    this._buyBtn.onClick(this, this.btnBuyClick.bind(this));
    Utils.setDrawCallOptimize(this);
  }

  public set info(data: TrailPropInfo) {
    this._info = data;
    if (data) {
      this._goodItem.text = String(data.maxCount - data.currentCount);
      this._goodItem.icon = IconFactory.getTecIconByIcon(data.skillTemp.Icons);
      this._itemName.text = String(data.skillTemp.SkillTemplateName);
      this._costNum.text = String(data.cost);
      this._buyBtn.enabled = data.currentCount < data.maxCount;
      FUIHelper.setTipData(
        this._goodItem,
        EmWindow.SkillTip,
        (<TrailPropInfo>data).skillTemp,
      );
    }
  }

  private btnBuyClick() {
    let checkStr = LangManager.Instance.GetTranslation(
      "mainBar.view.VipCoolDownFrame.useBind",
    );
    let checkStr2 = LangManager.Instance.GetTranslation(
      "mainBar.view.VipCoolDownFrame.promptTxt",
    );
    let content: string = LangManager.Instance.GetTranslation(
      "campaign.TrailShop.BuyConfirmTxt",
      this._info.skillTemp.SkillTemplateName,
      this._info.cost,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      {
        checkRickText: checkStr,
        checkRickText2: checkStr2,
        checkDefault: true,
      },
      null,
      content,
      null,
      null,
      this.__btnBuyClick.bind(this),
    );
  }

  private __btnBuyClick(b: boolean, flag: boolean) {
    if (b) {
      let cost = this._info.cost;
      let playerCount =
        PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint;
      if (playerCount < cost) {
        UIManager.Instance.HideWind(EmWindow.TrailMapShop);
        RechargeAlertMannager.Instance.show();
        return;
      }
      var msg: TrialInfoMsg = new TrialInfoMsg();
      msg.skillId = this._info.id;
      msg.count = 1;
      msg.param1 = flag ? 0 : 1;
      SocketManager.Instance.send(C2SProtocol.C_BUY_TRIAL, msg);
    }
  }

  public get info() {
    return this._info;
  }
}
