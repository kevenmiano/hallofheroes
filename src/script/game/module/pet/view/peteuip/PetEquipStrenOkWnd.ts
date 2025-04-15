//@ts-expect-error: External dependencies
import FUI_StrenAtrriItem from "../../../../../../fui/Pet/FUI_Str";
import LangManager from "../../../../../core/lang/LangManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import { t_s_attributeData } from "../../../../config/t_s_attribute";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { PetEquipCell } from "./PetEquipCell";
/**
 * 英灵装备强化成功弹窗
 */
export default class PetEquipStrenOkWnd extends BaseWindow {
  //消耗黄金
  txt_lv1: fairygui.GTextField;
  txt_lv2: fairygui.GTextField;
  //要强化的英灵装备
  item: PetEquipCell;
  private _goodsInfo: GoodsInfo;
  private _curStrenLevel: number = 0;
  private isMax: boolean = false;
  private son_attr: string = "";
  //强化前有多少条属性
  private attr_len: number = 0;

  item1: FUI_StrenAtrriItem;
  item2: FUI_StrenAtrriItem;
  item3: FUI_StrenAtrriItem;
  item4: FUI_StrenAtrriItem;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this._goodsInfo = this.params.info;
    this.son_attr = this.params.son_attr;
    let array = this.son_attr.split(";");
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.length > 0) {
        this.attr_len++;
      }
    }
  }

  OnShowWind() {
    super.OnShowWind();
    this.txt_lv1.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this.params.level,
    );
    this.txt_lv2.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this._goodsInfo.strengthenGrade,
    );
    if (this._goodsInfo) {
      this.item.info = this._goodsInfo;

      this.updateAttr(this._goodsInfo.masterAttr, this._goodsInfo.sonAttr);
    }
  }

  /**
   * masterAttr  英灵装备主属性(属性类型:基础属性值:增幅:)attId1:basenum1:addNum;
   * sonAttr 字符串, 属性Id:基础属性值:每次增长值
   */
  private updateAttr(masterAttr: string, sonAttr: string) {
    let attr_num: number = 0; //属性数量
    if (masterAttr) {
      let tempArr = masterAttr.split(";");
      for (let i = 0; i < tempArr.length; i++) {
        const element = tempArr[i];
        if (element.length > 0) {
          attr_num++;
          let arr = element.split(":");
          let attId = Number(arr[0]);
          let cfg: t_s_attributeData =
            TempleteManager.Instance.getPetEquipAttri(attId);
          if (cfg) {
            this["item" + attr_num].getChild("txt_attr_key").text =
              cfg.AttributeNameLang;
            this["item" + attr_num].getChild("txt_attr_val1").text = arr[1];
            this["item" + attr_num].getChild("txt_attr_val").text =
              Number(arr[1]) - Number(arr[2]) + "";
            this["item" + attr_num].visible = true;
          }
        }
      }
    }

    if (sonAttr) {
      let tempArr = sonAttr.split(";");
      for (let i = 0; i < tempArr.length; i++) {
        const element = tempArr[i];
        if (element.length > 0) {
          attr_num++;
          let arr = element.split(":");
          let attId = Number(arr[0]);
          let cfg: t_s_attributeData =
            TempleteManager.Instance.getPetEquipAttri(attId);
          if (cfg && this["item" + attr_num]) {
            this["item" + attr_num].visible = true;
            this["item" + attr_num].getChild("txt_attr_key").text =
              cfg.AttributeNameLang;
            this["item" + attr_num].getChild("txt_attr_val1").text = arr[1];
            let val = parseInt(arr[1]) - parseInt(arr[2]);
            this["item" + attr_num].getChild("txt_attr_val").text = val + "";
            if (attr_num > this.attr_len + 1) {
              this["item" + attr_num].getChild("img_new").visible = true;
            }
          }
        }
      }
    }
  }

  // private closeBtnClick() {

  // }

  OnHideWind() {
    super.OnHideWind();
  }
}
