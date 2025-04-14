//@ts-expect-error: External dependencies
import FUI_LevelGiftItem2 from "../../../../../../fui/Welfare/FUI_LevelGiftItem2";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import LangManager from "../../../../../core/lang/LangManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import WelfareCtrl from "../../WelfareCtrl";
import AudioManager from "../../../../../core/audio/AudioManager";
import { SoundIds } from "../../../../constant/SoundIds";
import BoxItem from "./BoxItem";
import LevelGiftItemInfo from "../../data/LevelGiftItemInfo";
import WelfareData from "../../WelfareData";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { ArmyManager } from "../../../../manager/ArmyManager";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";
import StringHelper from "../../../../../core/utils/StringHelper";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { BaseItem } from "../../../../component/item/BaseItem";
import { RewardItem } from "../../../../component/item/RewardItem";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/23 16:04
 * @ver 1.0
 *
 */
export class LevelGiftItem2 extends FUI_LevelGiftItem2 {
  private _info: LevelGiftItemInfo;

  public boxItem: BoxItem;

  public tipBtn1: BaseTipItem;

  public tipBtn2: BaseTipItem;

  /** */
  private goodsArr: Array<GoodsInfo>;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public set info(vInfo: LevelGiftItemInfo) {
    if (!vInfo) {
      this.clear();
      this.removeEvent();
    } else {
      this._info = vInfo;
      this.refreshView();
      this.addEvent();
    }
    this.tipBtn1.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
    this.tipBtn2.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
  }

  private clear() {
    this.txt_lv.text = "";
    this.txt_originalPrice.text = "";
    this.txt_currPrice.text = "";
    this.btn_buy.enabled = false;
  }

  private refreshView() {
    this.txt_lv.setVar("lv", this._info.grade.toString()).flushVars();
    this.txt_originalPrice.text = this._info.price.toString();
    this.txt_currPrice.text = this._info.discount.toString();
    this.boxItem.info = this._info;
    this.boxItem.tipDirctions = "5,4,7,6";
    if (this._info.packageState2 == 1) {
      //可领取
      this.hasGet.selectedIndex = 0;
      if (ArmyManager.Instance.thane.grades >= this._info.grade) {
        this.btn_buy.enabled = true;
        this.btn_buy.title = LangManager.Instance.GetTranslation(
          "LevelGiftItem2.buyTitle1",
        );
      } else {
        this.btn_buy.title = LangManager.Instance.GetTranslation(
          "guidetask.GuideTaskItem.taskFalgTxt.text02",
        );
        this.btn_buy.enabled = false;
      }
    } else if (this._info.packageState2 == 2) {
      //已领取
      this.btn_buy.enabled = false;
      this.hasGet.selectedIndex = 1;
      this.btn_buy.title = LangManager.Instance.GetTranslation(
        "LevelGiftItem2.buyTitle2",
      );
    }

    this.goodsArr = [];
    if (!StringHelper.isNullOrEmpty(this._info.diamondStr)) {
      let itemArr: Array<string> = this._info.diamondStr.split("|");
      if (itemArr) {
        let len = itemArr.length;
        for (let i = 0; i < len; i++) {
          let subItems: string[] = itemArr[i].split(",");
          let goodsItem: GoodsInfo = new GoodsInfo();
          goodsItem.templateId = parseInt(subItems[0]);
          goodsItem.count = parseInt(subItems[1]);

          const displayEffect: number = parseInt(subItems[2]);
          goodsItem.displayEffect = isNaN(displayEffect) ? 0 : displayEffect;
          this.goodsArr.push(goodsItem);
        }
      }
    }
    this.itemList.numItems = this.goodsArr.length;
  }

  private addEvent() {
    this.btn_buy.onClick(this, this.buyHandler);

    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
  }

  private removeEvent() {
    this.btn_buy.offClick(this, this.buyHandler);

    this.itemList.itemRenderer = null;
  }

  private renderListItem(index: number, item: RewardItem) {
    item.info = this.goodsArr[index];
  }

  private buyHandler() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let name: string = LangManager.Instance.GetTranslation(
      "vip.view.VipGiftItem.vipTxt",
      this._info.grade,
    );
    let cost: number = this._info.discount;
    let content: string = LangManager.Instance.GetTranslation(
      "campaign.TrailShop.BuyConfirmTxt",
      name,
      cost,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.getPackage.bind(this),
    );
  }

  private getPackage(result: boolean, flag: boolean) {
    if (result) {
      if (this.playerInfo.point < this._info.discount) {
        //改为弹窗提示
        RechargeAlertMannager.Instance.show(() => {
          this.control.exit();
        });
        return;
      }
      this.control.sendLevelGiftReward(3, this._info.id);
    }
  }

  private get control(): WelfareCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get ctrlData(): WelfareData {
    return this.control.data;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
