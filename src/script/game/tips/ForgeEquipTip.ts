/*
 * @Author: jeremy.xu
 * @Date: 2021-11-25 14:27:26
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-10-12 11:47:48
 * @Description:
 */

import AudioManager from "../../core/audio/AudioManager";
import LangManager from "../../core/lang/LangManager";
import UIButton from "../../core/ui/UIButton";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { t_s_attributeData } from "../config/t_s_attribute";
import { BagType } from "../constant/BagDefine";
import { TipsEvent } from "../constant/event/NotificationEvent";
import { GoodsType } from "../constant/GoodsType";
import { SoundIds } from "../constant/SoundIds";
import { EmWindow } from "../constant/UIDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { SharedManager } from "../manager/SharedManager";
import { TempleteManager } from "../manager/TempleteManager";
import ForgeCtrl from "../module/forge/ForgeCtrl";
import ForgeData from "../module/forge/ForgeData";
import { VicePasswordUtil } from "../module/vicePassword/VicePasswordUtil";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import ComponentSetting from "../utils/ComponentSetting";
import BaseTips from "./BaseTips";
import { EquipTipView } from "./EquipTipView";

export class ForgeEquipTip extends BaseTips {
  private equipTipView: EquipTipView;
  public btnEquip: UIButton;
  private btnEquip2: UIButton;
  private btnLock: UIButton;
  private cEquiped: fgui.Controller;
  private totalBox: fgui.GGroup;

  private _info: GoodsInfo;

  public OnInitWind() {
    super.OnInitWind();

    this._info = this.params[0];
    this.equipTipView.info = this._info;
    this.initView();
    this.addEvent();
    this.ensureBoundsCorrect();
  }

  public ensureBoundsCorrect() {
    this.equipTipView.leftBox.ensureBoundsCorrect();
    this.equipTipView.width = this.equipTipView.leftBox.width;
    this.equipTipView.height = this.equipTipView.leftBox.height;
    this.totalBox.ensureBoundsCorrect();
    // FIXME contentPane 与 equipTipView 宽高不一样
    this.contentPane.width = this.totalBox.width;
    this.contentPane.height = this.totalBox.height;
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this,
    );
  }

  private initView() {
    this.cEquiped = this.getController("cEquiped");
    this.cEquiped.selectedIndex = this.isEquiped ? 1 : 0;
    this.btnLock.title = LangManager.Instance.GetTranslation(
      this.isLocked ? "public.unLock" : "public.lock",
    );
    this.btnEquip.title = LangManager.Instance.GetTranslation(
      this.isEquiped ? "public.unEquip" : "public.putIn",
    );
    if (!ComponentSetting.PROP_LOCK) {
      this.btnLock.visible = false;
    }
  }

  private btnLockClick() {
    MessageTipManager.Instance.show(
      LangManager.Instance.GetTranslation("public.unopen"),
    );
    return;
    if (!this._info) return;
    VicePasswordUtil.vpLockOp(3, this._info.pos);
  }

  private btnEquip2Click() {
    this.btnEquipClick();
  }

  private btnEquipClick() {
    if (!this.forgeModel) {
      this.hide();
      return;
    }

    if (this._info.templateInfo.MasterType != GoodsType.EQUIP) {
      this.hide();
      return;
    }

    if (this.isEquiped) {
      this.moveBagToBag(
        this._info.bagType,
        this._info.objectId,
        this._info.pos,
        BagType.Player,
        0,
        0,
        1,
      );
    } else {
      // if (this.forgeModel.curTabIndex == ForgeData.TabIndex.FJ) {
      //     let endPos = ForgeData.isResolveEquip(this._info);
      //     if (endPos >= 0) {
      //         if (this._info.strengthenGrade > 0 && ForgeData.showResolveAlert()) {
      //             let content: string = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.resolveStrengthenAlert");
      //             let checkTxt: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
      //             SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, (b: boolean, check: boolean) => {
      //                 if (!this._info || !b) return;
      //                 SharedManager.Instance.resolveStrengthen = check;
      //                 SharedManager.Instance.resolveStrengthenCheckDate = new Date();
      //                 SharedManager.Instance.saveResolveStrengthenTipCheck();
      //                 this.moveBagToBag(this._info.bagType, this._info.objectId, this._info.pos, BagType.Hide, 0, endPos, 1);
      //             });
      //         } else {
      //             this.moveBagToBag(this._info.bagType, this._info.objectId, this._info.pos, BagType.Hide, 0, endPos, 1);
      //         }
      //     }
      // } else {
      this.moveBagToBag(
        this._info.bagType,
        this._info.objectId,
        this._info.pos,
        BagType.Hide,
        0,
        0,
        1,
      );
      // }
    }
    this.hide();
  }

  private moveBagToBag(
    beginBagType: number,
    beginObjectId: number,
    beginPos: number,
    endBagType: number,
    endObjectId: number,
    endPos: number,
    count: number,
  ) {
    AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
    PlayerManager.Instance.moveBagToBag(
      beginBagType,
      beginObjectId,
      beginPos,
      endBagType,
      endObjectId,
      endPos,
      count,
    );
  }

  private showResolveAlert(): boolean {
    let preDate: Date = new Date(
      SharedManager.Instance.resolveStrengthenCheckDate,
    );
    let now: Date = new Date();
    let outdate: boolean = false;
    let check: boolean = SharedManager.Instance.resolveStrengthen;
    if (
      !check ||
      (preDate.getMonth() <= preDate.getMonth() &&
        preDate.getDate() < now.getDate())
    ) {
      outdate = true;
    }
    return outdate;
  }

  private get isLocked(): boolean {
    return this._info && this._info.isLock;
  }

  private get isEquiped(): boolean {
    if (!this._info) {
      return false;
    }

    let arr: GoodsInfo[] = GoodsManager.Instance.getGoodsByBagType(
      BagType.Hide,
    );
    for (let i = 0; i < arr.length; i++) {
      const goods: GoodsInfo = arr[i];
      if (this._info.pos == goods.pos && this._info.id == goods.id) {
        return true;
      }
    }

    return false;
  }

  private get forgeModel(): ForgeData {
    return this.forgeControler.data;
  }

  private get forgeControler(): ForgeCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl;
  }

  protected OnClickModal() {
    super.OnClickModal();
    this.hide();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
