//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2022-06-29 15:41:38
 * @LastEditors: jeremy.xu
 * @Description:
 */

import LangManager from "../../../core/lang/LangManager";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { BagType } from "../../constant/BagDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import ForgeData from "./ForgeData";
import ForgeTargetItem from "./item/ForgeTargetItem";
import { StoreIntensifyCell } from "../../component/item/StoreIntensifyCell";
import { EmWindow } from "../../constant/UIDefine";
import ItemID from "../../constant/ItemID";
import { GoodsManager } from "../../manager/GoodsManager";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";

export default class UIXiangQian extends BaseFguiCom {
  private sourceEquipItem: fgui.GComponent;

  private txtRecommend: fgui.GLabel;
  private txtSparkCount: fgui.GLabel;
  private _txtEquipName: fgui.GRichTextField;
  private _equipItem: StoreIntensifyCell;
  private tipItem: BaseTipItem;

  private _itemDic: SimpleDictionary = new SimpleDictionary();
  constructor(comp: fgui.GComponent) {
    super(comp);

    for (let index = 1; index <= ForgeData.XQJewelNum; index++) {
      let inlayIem = this["sourceJewelItem" + index] as ForgeTargetItem;
      inlayIem.pos = index;
      inlayIem.index = index;
      inlayIem.bagType = BagType.Hide;
      // inlayIem.bSSEquipOpen = index == ForgeData.XQJewelNum
      this._itemDic.add(index + "_0_" + BagType.Hide, inlayIem);
    }

    this._txtEquipName = this.sourceEquipItem.getChild(
      "rTxtDesc",
    ) as fgui.GRichTextField;
    this._equipItem = this.sourceEquipItem.getChild(
      "item",
    ) as StoreIntensifyCell;
    this._equipItem.item.pos = 0;
    this._itemDic.add("0_0_" + BagType.Hide, this._equipItem);

    this.updateSparkCount();
    let playerJob = ArmyManager.Instance.thane.job % 3;
    this.txtRecommend.text = LangManager.Instance.GetTranslation(
      "store.view.mount.MountView.JobTipTxt" + (playerJob + 1),
    );
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD_ZUAN);
  }

  refresh(tag: string, data: any) {
    switch (tag) {
      case "BagItemUpdate":
        this.__bagItemUpdateHandler(data);
        break;
      case "BagItemDelete":
        this.__bagItemDeleteHandler(data);
        break;
      default:
        break;
    }
  }

  refreshResources() {}

  private __bagItemUpdateHandler(info: GoodsInfo) {
    let item: StoreIntensifyCell | ForgeTargetItem =
      this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
    if (item) {
      info.isInlay = true;
      item.info = info;
      if (item instanceof StoreIntensifyCell) {
        item.item.tipType = EmWindow.ForgeEquipTip;
      } else {
        item.item.tipType = EmWindow.ForgePropTip;
      }
      this.updateView(info);
    }
    if (info && info.templateId == ItemID.BORT_PROP) {
      this.updateSparkCount();
    }
  }

  private __bagItemDeleteHandler(info: GoodsInfo) {
    let item: StoreIntensifyCell | ForgeTargetItem =
      this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
    if (item) {
      item.info = null;
      this.updateView(info);
    }
    if (info && info.templateId == ItemID.BORT_PROP) {
      this.updateSparkCount();
    }
  }

  private updateSparkCount() {
    this.txtSparkCount.text =
      "x" + GoodsManager.Instance.getGoodsNumByTempId(ItemID.BORT_PROP);
  }

  private updateView(value: GoodsInfo) {
    let equipInfo = this._equipItem.info;
    if (equipInfo) {
      this._txtEquipName.text = equipInfo.templateInfo.TemplateNameLang;
      this._txtEquipName.color =
        ForgeData.Colors[equipInfo.templateInfo.Profile - 1];
    } else {
      this._txtEquipName.text = "";
    }

    for (let i = 1; i <= ForgeData.XQJewelNum; i++) {
      let item: ForgeTargetItem = this["sourceJewelItem" + i];
      item.info = equipInfo ? equipInfo : null;
      item.item.tipType = EmWindow.ForgePropTip;
      item.setIconTick(
        item.bNotOpen ? ForgeData.getLockIcon() : ForgeData.getAddIcon(),
      );

      if (!equipInfo) {
        item.setIconTick("");
        continue;
      }

      let rTxtDesc = item.rTxtDesc;
      if (item.bNotOpen) {
        // if (item.bSSEquipOpen) {
        //     rTxtDesc.color = "#FF2E2E"
        // }
        //开启第四个宝石孔不需要史诗装备限制
        let desc = LangManager.Instance.GetTranslation(
          "Forge.Inlay.ClickToOpen",
        ); // LangManager.Instance.GetTranslation(item.bSSEquipOpen ? "Forge.Inlay.OpenEpicEquip" : "Forge.Inlay.ClickToOpen")
        rTxtDesc.text = desc;
      } else {
        if (item.info) {
          rTxtDesc.text = item.item.info.templateInfo.DescriptionLang;
        } else {
          rTxtDesc.text = LangManager.Instance.GetTranslation(
            "Forge.Inlay.CanInlay",
          );
        }
      }
    }

    let index = this.getCanInlayItemIndex();
    if (index != -1) {
      (this["sourceJewelItem" + index] as ForgeTargetItem).selected = true;
    }
  }

  /**
   * 找一个可镶嵌的位置
   * @returns
   */
  private getCanInlayItemIndex(): number {
    let equipInfo = this._equipItem.info;
    if (!equipInfo) return -1;

    for (let i = 1; i <= ForgeData.XQJewelNum; i++) {
      let item: ForgeTargetItem = this[
        "sourceJewelItem" + i
      ] as ForgeTargetItem;
      if (!item.info && !item.bNotOpen) {
        return i;
      }
    }
    return -1;
  }

  public resetView() {
    for (let i = 1; i <= ForgeData.XQJewelNum; i++) {
      let item: ForgeTargetItem = this[
        "sourceJewelItem" + i
      ] as ForgeTargetItem;
      item.info = null;
      item.setIconTick("");
    }

    this._txtEquipName.text = "";
  }

  public resetTarget() {
    this._equipItem.info = null;
  }
}
