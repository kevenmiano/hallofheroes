//@ts-expect-error: External dependencies
import AudioManager from "../../../core/audio/AudioManager";
import { SoundIds } from "../../constant/SoundIds";
import SevenGiftBagInfo from "../welfare/data/SevenGiftBagInfo";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import StringHelper from "../../../core/utils/StringHelper";
import { BaseItem } from "../../component/item/BaseItem";
import LangManager from "../../../core/lang/LangManager";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import Utils from "../../../core/utils/Utils";
import FUI_SevenGoalsBagView from "../../../../fui/SevenTarget/FUI_SevenGoalsBagView";
import SevenGoalsManager from "../../manager/SevenGoalsManager";
import SevenGoalsModel from "./SevenGoalsModel";
/**七日目标特惠礼包 */
export class SevenGoalsBagView extends FUI_SevenGoalsBagView {
  private _info: SevenGiftBagInfo;
  private goodsArr: Array<GoodsInfo>;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
  }

  initEvent() {
    this.buyBtn.onClick(this, this.buyHandler);
    Utils.setDrawCallOptimize(this.goodsList);
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.renderGoodsList,
      null,
      false,
    );
  }

  removeEvent() {
    this.buyBtn.offClick(this, this.buyHandler);
    Utils.clearGListHandle(this.goodsList);
  }

  /**积分 */
  renderGoodsList(index: number, item: BaseItem) {
    if (!item) return;
    item.info = this.goodsArr[index];
  }

  public set info(value: SevenGiftBagInfo) {
    this._info = value;
    this.refreshView();
  }

  refreshView() {
    if (this._info) {
      this.goodsArr = this.getGoodsArray(this._info.item);
      this.bagNameTxt.text = this._info.name;
      this.disCountTxt.text = this._info.dicount + "%";
      this.buyBtn.title = "";
      this.txt_diamond.text = this._info.price.toString();
      this.goodsList.setVirtual();
      this.goodsList.numItems = this.goodsArr.length;
      let columnGap: number = 400 / this.goodsArr.length - 82;
      this.goodsList.columnGap = columnGap;
      if (
        this.sevenGoalsModel.checkBagHasBuy(
          this.sevenGoalsModel.currentSelectedDay,
        )
      ) {
        //已经购买了
        this.buyBtn.enabled = false;
        this.hasGet.selectedIndex = 1;
      } else {
        this.buyBtn.enabled = true;
        this.hasGet.selectedIndex = 0;
      }
    }
  }

  /**
   * 购买特惠礼包
   */
  private buyHandler() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let name: string = this._info.name;
    let cost: number = this._info.price;
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
      if (this.playerInfo.point < this._info.price) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("Auction.ResultAlert11"),
        );
        return;
      }
      SevenGoalsManager.Instance.getBoxBagReward(
        2,
        this.sevenGoalsModel.currentSelectedDay,
      );
    }
  }

  private getGoodsArray(goodsStr: string): Array<GoodsInfo> {
    let strArr: Array<string> = goodsStr.split("|");
    var goodsArr: Array<GoodsInfo> = [];
    if (strArr) {
      let len = strArr.length;
      let goods: GoodsInfo;
      let strItem: string;
      for (let i = 0; i < len; i++) {
        strItem = strArr[i];
        if (!StringHelper.isNullOrEmpty(strItem)) {
          goods = new GoodsInfo();
          goods.templateId = Number(strItem.split(",")[0]);
          goods.count = Number(strItem.split(",")[1]);
          goodsArr.push(goods);
        }
      }
    }
    return goodsArr;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get sevenGoalsModel(): SevenGoalsModel {
    return SevenGoalsManager.Instance.sevenGoalsModel;
  }

  dispose() {
    this.removeEvent();
    this.goodsArr = [];
    super.dispose();
  }
}
