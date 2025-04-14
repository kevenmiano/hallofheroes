import FUI_RuneDrawCom from "../../../../../fui/Skill/FUI_RuneDrawCom";
import LangManager from "../../../../core/lang/LangManager";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { BaseItem } from "../../../component/item/BaseItem";
import { BagType } from "../../../constant/BagDefine";
import { CommonConstant } from "../../../constant/CommonConstant";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import SkillWndCtrl from "../SkillWndCtrl";
import UIManager from "../../../../core/ui/UIManager";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";

//@ts-expect-error: External dependencies
import LotteryRuneRspMsg = com.road.yishi.proto.army.LotteryRuneRspMsg;
/**
 * 符文石抽取面板
 */
export default class RuneGemDrawCom extends FUI_RuneDrawCom {
  private spot: string = "";
  private maxPoint: number = 200;
  private _countDown: number = 0;
  private btn_ok: fairygui.GButton;
  private runehole_spot_use: number = 10;

  public tipItem: BaseTipItem;
  private openGridNum: number = 0;

  onConstruct() {
    super.onConstruct();
    this.btn_ok = this.rewardTip.getChild("btn_ok").asButton;
    let cfg =
      TempleteManager.Instance.getConfigInfoByConfigName("runehole_spot");
    if (cfg && cfg.ConfigValue) {
      let arr = cfg.ConfigValue.split(",");
      this.spot = arr[0];
      this.maxPoint = parseInt(arr[2]);
    }
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_STONE_ENERGY);
    this.btn_start.getChild("txtTitle2").asTextField.text =
      LangManager.Instance.GetTranslation("runeGem.str14", 1);
    this.btn_ten.getChild("txtTitle2").asTextField.text =
      LangManager.Instance.GetTranslation("runeGem.str14", 10);
    this.btn_start.getChild("txtTitle").asTextField.text =
      "x" + this.runehole_spot_use;
    this.btn_ten.getChild("txtTitle").asTextField.text =
      "x" + this.runehole_spot_use * 10;
    (this.item.getChild("back") as fgui.GLoader).url =
      fgui.UIPackage.getItemURL("Base", "Img_Tips2_Bg");
    this.item.getChild("back").visible = true;
  }

  updateView(value: string) {
    this.runehole_spot_use = parseInt(value);
    this.onHideRewardTip(true);
    this.initRewardTip();
    this.addEvent();
  }

  private get controler(): SkillWndCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
  }

  private addEvent() {
    this.btn_start.onClick(this, this.onStart);
    this.btn_ten.onClick(this, this.onTen);
    this.btn_buy.onClick(this, this.onBuy);
    this.click_rect.onClick(this, this.onHideRewardTip, [true]);
    this.btn_help.onClick(this, this.onHideRewardTip, [false]);
    this.btn_ok.onClick(this, this.onHideRewardTip, [true]);

    ServerDataManager.listen(
      S2CProtocol.U_C_LOTTERY_RUNE_INFO,
      this,
      this.onRecvLottery,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdate,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(
      PlayerEvent.RUNE_GEM_ENERGY,
      this.updateEnergy,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(
      PlayerEvent.RUNE_GEM_BAG_CAPICITY,
      this.updateBag,
      this,
    );
  }

  private removeEvent() {
    Laya.timer.clear(this, this.updateCountDown);
    this.btn_ten.offClick(this, this.onTen);
    this.btn_start.offClick(this, this.onStart);
    this.btn_ok.offClick(this, this.onHideRewardTip);
    this.btn_help.offClick(this, this.onHideRewardTip);
    this.click_rect.offClick(this, this.onHideRewardTip);
    this.btn_buy.offClick(this, this.onBuy);

    ServerDataManager.cancel(
      S2CProtocol.U_C_LOTTERY_RUNE_INFO,
      this,
      this.onRecvLottery,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdate,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(
      PlayerEvent.RUNE_GEM_ENERGY,
      this.updateEnergy,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(
      PlayerEvent.RUNE_GEM_BAG_CAPICITY,
      this.updateBag,
      this,
    );
  }

  private initRewardTip() {
    this.rewardTip.getChild("txt0").text =
      LangManager.Instance.GetTranslation("runeGem.reward0");
    this.rewardTip.getChild("txt1").text =
      LangManager.Instance.GetTranslation("runeGem.reward1");
    this.rewardTip.getChild("txt2").text =
      LangManager.Instance.GetTranslation("runeGem.reward2");
  }

  onHideRewardTip(ishide: boolean) {
    this.rewardTip.visible = !ishide;
    this.click_rect.visible = !ishide;
    this.txt_val.visible = ishide;
  }

  updateBag(playerInfo: PlayerInfo) {
    let str =
      TempleteManager.Instance.getConfigInfoByConfigName(
        "runehole_bag",
      ).ConfigValue;
    let arr = str.split(",");
    this.openGridNum = Number(arr[0]) + playerInfo.runeGemBagCount;
  }

  private rewardStr: string = "";
  __bagItemUpdate(arr) {
    let goodsInfo: GoodsInfo = arr[0];
    if (goodsInfo.isNew && goodsInfo.bagType == BagType.RUNE) {
      (this.item as BaseItem).info = goodsInfo;
      this.rewardStr = goodsInfo.templateInfo.TemplateNameLang;
      this.playAni5();
    } else if (goodsInfo.templateId == CommonConstant.RUNE_GEM_FRAGMENT) {
      if (goodsInfo.isNew) {
        (this.item as BaseItem).info = null;
        this.rewardStr = goodsInfo.templateInfo.TemplateNameLang;
      }
    }
  }

  private flyAni() {
    Laya.Tween.clearAll(this.img_fragment);
    this.img_fragment.x = 475;
    this.img_fragment.y = 295;
    this.img_fragment.visible = true;
    this.img_fragment.alpha = 1;
    Laya.Tween.to(
      this.img_fragment,
      { x: 0, y: 0 },
      600,
      Laya.Ease.sineOut,
      Laya.Handler.create(this, this._moveComplete),
    );
  }

  private _moveComplete() {
    Laya.Tween.to(this.img_fragment, { alpha: 0 }, 300);
  }

  private showTip() {
    let str = LangManager.Instance.GetTranslation(
      "ruenGem.drawReward",
      this.rewardStr,
    );
    MessageTipManager.Instance.show(str);
  }

  updateEnergy(playerinfo: PlayerInfo) {
    this.txt_energy1.text = playerinfo.runePowerPoint.toString();
    if (playerinfo.runePowerPoint >= this.maxPoint) {
      this.hideTime();
    }
  }

  /**
     *  int32 powerPointNum = 1; //能量点数量
        int32 runeChipNum = 2; //符文碎片数量
        int32 runePointNum = 3; //符文点数量
        int32 leftTime = 4; //剩余时间(倒计时结束,请求更新能量点)
     * @param pkg
     */
  private onRecvLottery(pkg: PackageIn): void {
    let msg: LotteryRuneRspMsg = pkg.readBody(
      LotteryRuneRspMsg,
    ) as LotteryRuneRspMsg;
    if (msg) {
      this.txt_energy1.text = msg.powerPointNum.toString();
      this.txt_val.text = msg.runePointNum + "/" + 1000;
      let posy = 68 + (-30 - 68) * (msg.runePointNum / 1000);
      this.ball_pro.getChild("ani").y = posy;
      this._countDown = msg.leftTime;

      if (this._countDown >= 0 && msg.powerPointNum < this.maxPoint) {
        Laya.timer.loop(1000, this, this.updateCountDown);
        this.updateCountDown();
      } else {
        this.txt_time.text = "";
      }
    }
  }

  private updateCountDown() {
    if (this._countDown > 0) {
      let countDown: string = DateFormatter.getConsortiaCountDate(
        this._countDown,
      );
      this.txt_time.text = LangManager.Instance.GetTranslation(
        "ruenGem.leftTime",
        countDown,
        this.spot,
      );
      this._countDown--;
    } else {
      this.hideTime();
      this.controler.reqRuneGemLottery(1); //倒计时结束重新请求数据
    }
  }

  private hideTime() {
    this.txt_time.text = "";
    Laya.timer.clear(this, this.updateCountDown);
  }

  onTen() {
    this.c1.selectedIndex = 0;
    if (Number(this.txt_energy1.text) < 10) {
      this.controler.reqRuneGemLottery(2);
      this.btn_start.enabled = true;
      return;
    }
    (this.item as BaseItem).info = null;
    this.item.visible = false;
    this.controler.reqRuneGemLottery(3);
  }

  onStart() {
    this.c1.selectedIndex = 0;
    if (Number(this.txt_energy1.text) < 10) {
      this.controler.reqRuneGemLottery(2);
      this.btn_start.enabled = true;
      return;
    }
    (this.item as BaseItem).info = null;
    this.item.visible = false;
    this.controler.reqRuneGemLottery(2);
  }

  playAni5() {
    if ((this.item as BaseItem).info) {
      this.c1.selectedIndex = 1;
      this.item.visible = true;
      setTimeout(() => {
        this.item.visible = false;
      }, 500);
    } else {
      this.flyAni();
    }
    this.btn_start.enabled = true;
    this.btn_start.visible = true;
    // this.showTip();
  }

  onBuy() {
    let data: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(
      CommonConstant.RUNE_GEM_ENERGY,
    );
    let obj = {
      info: data,
      count: 1,
      callback: this.buySucCallback.bind(this),
    };
    FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
  }

  buySucCallback() {}

  dispose(): void {
    this.removeEvent();
  }
}
