//@ts-expect-error: External dependencies
import FUI_MineralShopItem from "../../../../fui/Mineral/FUI_MineralShopItem";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import LangManager from "../../../core/lang/LangManager";
import { ShopManager } from "../../manager/ShopManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import UIButton from "../../../core/ui/UIButton";
import { MountsManager } from "../../manager/MountsManager";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { BaseItem } from "../../component/item/BaseItem";

/**
 * @author:pzlricky
 * @data: 2021-11-05 16:58
 * @description ***
 */
export default class MineralShopItem extends FUI_MineralShopItem {
  private _shopData: ShopGoodsInfo;
  private btnExchange: UIButton;

  public item: BaseItem;

  onConstruct() {
    super.onConstruct();
    this.addEvent();
    this.btnExchange = new UIButton(this.Btn_Exchange);
  }

  private addEvent() {
    this.txt_num.on(Laya.Event.FOCUS, this, this.__focusHandler);
    this.txt_num.on(Laya.Event.BLUR, this, this.__blurHandler);
    this.Btn_Exchange.onClick(this, this.__clickHandler);
  }

  private removeEvent() {
    if (this.txt_num) {
      this.txt_num.off(Laya.Event.FOCUS, this, this.__focusHandler);
      this.txt_num.off(Laya.Event.BLUR, this, this.__blurHandler);
    }
    if (this.Btn_Exchange)
      this.Btn_Exchange.offClick(this, this.__clickHandler);
  }

  private __focusHandler() {
    this.disableScroll();
  }

  private __blurHandler() {
    this.enableScroll();
    let input: number = Number(this.txt_num.text);
    let max: number = Math.floor(
      this.playerInfo.mineral / this._shopData.MineScore,
    );
    this.txt_num.text = input + "";
    if (input <= 0 || max <= 0) {
      this.txt_num.text = "1";
    } else if (input >= max) {
      this.txt_num.text = max + "";
    }
  }

  enableScroll() {
    if (!this.parent || !this.parent.scrollPane) return;
    this.parent.scrollPane.touchEffect = true;
    this.parent.scrollPane.mouseWheelEnabled = true;
  }

  disableScroll() {
    if (!this.parent || !this.parent.scrollPane) return;
    this.parent.scrollPane.touchEffect = false;
    this.parent.scrollPane.mouseWheelEnabled = false;
  }

  protected __clickHandler(event: MouseEvent) {
    if (this.playerInfo.mineral < this._shopData.MineScore) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "view.subshop.MineralShopItem.notEnough",
        ),
      );
      return;
    }

    // let goods: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._shopData.ItemId);
    // if (goods.SonType == 218 && goods.Property2 < 0) { //坐骑
    //     if (MountsManager.Instance.avatarList.isLightTemplate(goods.Property1)) {
    //         //坐骑已经存在, 不能继续购买
    //         let s: string = LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.mopupexitst");
    //         MessageTipManager.Instance.show(s);
    //         return;
    //     }
    // }

    ShopManager.Instance.sendShoping(
      this._shopData.Id,
      Number(this.txt_num.text),
      this.playerInfo.userId,
      false,
    );
    this.txt_num.text = "1";
  }

  private setEnable() {
    if (this._shopData.NeedMinGrade > this.thane.grades) {
      this.txt_Level.text = LangManager.Instance.GetTranslation(
        "view.subshop.MineralShopItem.minLevel",
        this._shopData.NeedMinGrade,
      );
      this.txt_Level.visible = true;
      this.Btn_Exchange.visible = false;
    } else {
      this.txt_Level.visible = false;
      this.Btn_Exchange.visible = true;
    }
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public set info(value: ShopGoodsInfo) {
    if (value == null) return;
    this._shopData = value;

    let goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = this._shopData.ItemId;
    this.item.info = goodsInfo;
    this.txt_Name.text =
      "[color='" +
      goodsInfo.templateInfo.profileColor +
      " ']" +
      goodsInfo.templateInfo.TemplateNameLang +
      "[/color]";

    this.count.text = this._shopData.MineScore + "";
    this.txt_num.text = "1";
    this.setEnable();
    let goods: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(
        this._shopData.ItemId,
      );
    if (goods.SonType == 218) {
      //坐骑
      this.txt_num.editable = false;
    } else {
      this.txt_num.editable = true;
    }
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
