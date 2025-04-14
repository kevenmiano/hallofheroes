import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import FUI_MineralAwardCell from "../../../../fui/Home/FUI_MineralAwardCell";
import LangManager from "../../../core/lang/LangManager";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";

/**
 * @author:pzlricky
 * @data: 2021-11-08 20:07
 * @description 紫晶矿产奖励Cell
 */
export default class MineralAwardCell extends FUI_MineralAwardCell {
  private _data: ShopGoodsInfo;

  onConstruct() {
    super.onConstruct();
  }

  public set cellData(info: ShopGoodsInfo) {
    if (info == null) return;
    this._data = info;

    var goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = this._data.ItemId;
    this.txt_Name.text =
      "[color=" +
      goodsInfo.templateInfo.profileColor +
      "]" +
      goodsInfo.templateInfo.TemplateNameLang +
      "[/color] " +
      this._data.MineScore;
    // this.txt_count.text = this._data.MineScore + "";
    this.setEnable();
  }

  private setEnable() {
    if (this._data.NeedMinGrade > this.thane.grades) {
      this.txt_Name.text += LangManager.Instance.GetTranslation(
        "view.subshop.MineralShopItem.minLevel",
        this._data.NeedMinGrade,
      );
      // this.txt_level.visible = true;
      // this.txt_count.visible = false;
    } else {
      // this.txt_level.text = "";
      // this.txt_level.visible = false;
      // this.txt_count.visible = true;
    }
  }
  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
