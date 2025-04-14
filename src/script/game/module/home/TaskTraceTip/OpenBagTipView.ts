import LangManager from "../../../../core/lang/LangManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { EmWindow } from "../../../constant/UIDefine";
import AudioManager from "../../../../core/audio/AudioManager";
import { ArrayUtils, ArrayConstant } from "../../../../core/utils/ArrayUtils";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { BagType } from "../../../constant/BagDefine";
import { BagEvent, TipsEvent } from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { SoundIds } from "../../../constant/SoundIds";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { GoodsType } from "../../../constant/GoodsType";
import { SharedManager } from "../../../manager/SharedManager";
import { FashionManager } from "../../../manager/FashionManager";

export class OpenBagTipView extends TaskTraceTipWnd {
  private _goodsInfo: GoodsInfo;
  private _toPos: number = -1;
  constructor() {
    super();
  }

  initView() {
    super.initView();
    PlayerManager.Instance.currentPlayerModel.openBagTipFlag = false;
    this.setContentText(this.data.content);
    this.setContentIcon(this.data.goods.templateInfo.iconPath);
    if (
      this._data &&
      this._data.goods &&
      FashionManager.Instance.fashionModel.isFashion(this._data.goods)
    ) {
      this.setBtnTitle(
        LangManager.Instance.GetTranslation(
          "tasktracetip.view.OpenBagTipView.btnTxt1",
        ),
      );
    } else {
      this.setBtnTitle(
        LangManager.Instance.GetTranslation(
          "tasktracetip.view.OpenBagTipView.btnTxt",
        ),
      );
    }
  }

  protected __btnHandler(evt) {
    super.__btnHandler(evt);
    if (!this._data || !this._data.goods) {
      this.dispose();
      return;
    }
    if (FashionManager.Instance.fashionModel.isFashion(this._data.goods)) {
      FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, {
        openFashionSwall: true,
      });
      return;
    }
    this._goodsInfo = GoodsManager.Instance.getGoodsByGoodsIdFromGeneralBag(
      this._data.goods.id,
    );
    if (this._goodsInfo == null) {
      var str: string = LangManager.Instance.GetTranslation(
        "tasktracetip.view.BetterGoodsTipsView.command01",
      );
      MessageTipManager.Instance.show(str);
      TaskTraceTipManager.Instance.cleanByType(this._data.type);
      return;
    }
    if (!GoodsCheck.checkGoodsBetterThanHero(this._goodsInfo)) {
      TaskTraceTipManager.Instance.cleanByType(this._data.type);
      return;
    }
    if (this._goodsInfo) {
      let heroBag: GoodsInfo[] =
        GoodsManager.Instance.getHeroGoodsListByTypeAndId(
          this._goodsInfo.templateInfo.MasterType,
          this.thane.id,
        ).getList();
      let pos_arr: number[] = GoodsSonType.getSonTypePos(
        this._goodsInfo.templateInfo.SonType,
      );
      heroBag = ArrayUtils.sortOn(heroBag, "pos", ArrayConstant.NUMERIC);
      let t_index: number = 0;
      if (pos_arr.length > 1) {
        for (const key in heroBag) {
          if (heroBag.hasOwnProperty(key)) {
            let i: GoodsInfo = heroBag[key];
            if (
              i.templateInfo.SonType == this._goodsInfo.templateInfo.SonType &&
              i.pos == pos_arr[0] + t_index
            ) {
              t_index++;
            }
          }
        }
        if (t_index >= pos_arr.length) {
          let targetInfos: GoodsInfo[] = [];
          for (let i = 0, len = pos_arr.length; i < len; i++) {
            const pos = pos_arr[i];
            targetInfos.push(
              GoodsManager.Instance.getHeroEquipByPos(this.thane.id, pos),
            );
          }
          targetInfos.sort((a, b) => {
            return a.getEquipTotalScore() - b.getEquipTotalScore();
          });
          this._toPos = targetInfos[0].pos;
        } else {
          this._toPos = pos_arr[t_index];
        }
      } else {
        this._toPos = pos_arr[0];
      }
      if (this._goodsInfo.templateInfo.MasterType == GoodsType.HONER) {
        this._toPos = GoodsManager.Instance.getEmputyHonerPos();
        if (this._toPos == -1) {
          this._toPos = 0;
        }
        this.moveBagToBag(
          this._goodsInfo.bagType,
          this._goodsInfo.objectId,
          this._goodsInfo.pos,
          BagType.Honer,
          this.thane.id,
          this._toPos,
          1,
        );
      } else {
        if (this._toPos != -1) {
          AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
          let goodsInfo: GoodsInfo = this.getGoodsInfoByPos(this._toPos);
          if (!goodsInfo.existJewel()) {
            this.moveBagToBag(
              this._goodsInfo.bagType,
              this._goodsInfo.objectId,
              this._goodsInfo.pos,
              BagType.HeroEquipment,
              this.thane.id,
              this._toPos,
              1,
            );
          } else {
            //有宝石
            var confirm: string =
              LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string =
              LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string =
              LangManager.Instance.GetTranslation("public.prompt");
            var content: string = LangManager.Instance.GetTranslation(
              "OpenBagTipView.exchange.content",
            );
            SimpleAlertHelper.Instance.Show(
              SimpleAlertHelper.SIMPLE_ALERT,
              null,
              prompt,
              content,
              confirm,
              cancel,
              this.moveConfirm.bind(this),
            );
          }
        }
      }
      TaskTraceTipManager.Instance.cleanByType(this._data.type);
      this.decetiveEquip();
    }
  }

  private moveConfirm(b: boolean, flag: boolean) {
    if (b) {
      //确定替换
      this.moveBagToBag(
        this._goodsInfo.bagType,
        this._goodsInfo.objectId,
        this._goodsInfo.pos,
        BagType.HeroEquipment,
        this.thane.id,
        this._toPos,
        1,
        true,
      );
    } else {
      this.moveBagToBag(
        this._goodsInfo.bagType,
        this._goodsInfo.objectId,
        this._goodsInfo.pos,
        BagType.HeroEquipment,
        this.thane.id,
        this._toPos,
        1,
        false,
      );
    }
  }

  private getGoodsInfoByPos(pos: number): GoodsInfo {
    let goods: GoodsInfo = new GoodsInfo();
    let dic: SimpleDictionary =
      GoodsManager.Instance.getHeroGoodsListByTypeAndId(
        GoodsType.EQUIP,
        this.thane.id,
      );
    for (const key in dic) {
      if (dic.hasOwnProperty(key)) {
        let info: GoodsInfo = dic[key];
        if (info && info.pos == pos && info.bagType == BagType.HeroEquipment) {
          goods.templateId = info.templateId;
          goods.join1 = info.join1;
          goods.join2 = info.join2;
          goods.join3 = info.join3;
          goods.join4 = info.join4;
        }
      }
    }
    return goods;
  }

  private moveBagToBag(
    beginBagType: number,
    beginObjectId: number,
    beginPos: number,
    endBagType: number,
    endObjectId: number,
    endPos: number,
    count: number,
    isUninstall: boolean = false,
  ) {
    PlayerManager.Instance.currentPlayerModel.openBagTipFlag = true;
    PlayerManager.Instance.moveBagToBag(
      beginBagType,
      beginObjectId,
      beginPos,
      endBagType,
      endObjectId,
      endPos,
      count,
      isUninstall,
    );
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  protected onCloseWnd(evt: any): void {
    super.onCloseWnd(evt);
  }

  protected onDecetiveWnd() {
    super.onDecetiveWnd();
  }

  private decetiveEquip() {
    // SharedManager.Instance.betterEquipFlag = false;
    // SharedManager.Instance.saveBetterEquipFlag();
    NotificationManager.Instance.dispatchEvent(BagEvent.NEW_EQUIP, false);
  }
}
