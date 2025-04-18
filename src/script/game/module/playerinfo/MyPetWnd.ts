import FUI_PlayerPetFigure from "../../../../fui/PlayerInfo/FUI_PlayerPetFigure";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import Utils from "../../../core/utils/Utils";
import { ShowPetAvatar } from "../../avatar/view/ShowPetAvatar";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { BagType } from "../../constant/BagDefine";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { GoodsManager } from "../../manager/GoodsManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import FUIHelper from "../../utils/FUIHelper";
import { PetData } from "../pet/data/PetData";
import { PetEquipCell } from "../pet/view/peteuip/PetEquipCell";
import { PlayerPetWnd } from "./PlayerPetWnd";
import ArtifactItem from "./item/ArtifactItem";

/**
 * @description 我的英灵对比
 * @author zhihua.zhou
 */
export class MyPetWnd extends BaseWindow {
  private petCom: FUI_PlayerPetFigure;
  private _petView: ShowPetAvatar; //主英灵
  private _data: PetData;
  private txtPhysicsAttackValue: fgui.GLabel;
  private txtPowerVal: fgui.GLabel;
  private txtMagicAttackValue: fgui.GLabel;
  private txtStaminaVal: fgui.GLabel;
  private txtPhysicsDefenseValue: fgui.GLabel;
  private txtHpValue: fgui.GLabel;
  private txtMagicDefenseValue: fgui.GLabel;
  private txtIntelligenceVal: fgui.GLabel;
  private txtArmorVal: fgui.GLabel;
  public ptxt2: fgui.GTextField;
  public ptxt4: fgui.GTextField;
  public ptxt1: fgui.GTextField;
  public ptxt3: fgui.GTextField;
  public ptxt5: fgui.GTextField;
  public part0: fgui.GButton;
  public part4: fgui.GButton;
  public part2: fgui.GButton;
  public part1: fgui.GButton;
  public part5: fgui.GButton;
  public part3: fgui.GButton;
  public txtPPhysicsAttackValue: fgui.GLabel;
  public txtPMagicAttackValue: fgui.GLabel;
  public txtPPowerVal: fgui.GLabel;
  public txtPArmorVal: fgui.GLabel;
  public txtPPhysicsDefenseValue: fgui.GLabel;
  private strArr = [
    "Icon_Box_Earrings1",
    "Icon_Box_Earrings2",
    "Icon_Box_Accessory1",
    "Icon_Box_Accessory2",
    "Icon_Box_Artifact",
    "Icon_Box_Belt",
  ];
  public titleTxt: fgui.GRichTextField;
  public goodsList: fgui.GList;
  public arttitleTxt: fgui.GRichTextField;
  public arttxt1: fgui.GTextField;
  public artPhysicsAttackValue: fgui.GTextField;
  public arttxt2: fgui.GTextField;
  public artMagicAttackValue: fgui.GTextField;
  public arttxt5: fgui.GTextField;
  public artPhysicsDefenseValue: fgui.GTextField;
  public arttxt3: fgui.GTextField;
  public arttxt4: fgui.GTextField;
  public artPowerVal: fgui.GTextField;
  public artArmorVal: fgui.GTextField;
  public c1: fgui.Controller;
  private _petList: Array<PetData> = [];
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    if (this.frameData instanceof PetData) {
      this._data = this.frameData;
    } else {
      this._data = this.params;
    }
    this.c1 = this.getController("c1");
    this.c1.selectedIndex = 0;
    this._petView = new ShowPetAvatar();
    this._petView.width = this.petCom.displayObject.width;
    this._petView.height = this.petCom.displayObject.height;
    this._petView.data = this._data.template;
    this.petCom.displayObject.addChild(this._petView);

    this._petView.scale(1.5, 1.5);
    this._petView.x = -100;
    this._petView.y = -230;
    this._petView.mouseEnabled = false;
    this.arttitleTxt.text = LangManager.Instance.GetTranslation(
      "UIArtifact.titleTxt",
    );
    this.titleTxt.text = LangManager.Instance.GetTranslation(
      "UIAttrCommon.potencyTxt",
    );
    for (let i: number = 1; i <= 5; i++) {
      this["arttxt" + i].text = LangManager.Instance.GetTranslation(
        "petWnd.potency.itemTitle" + i,
      );
      this["ptxt" + i].text = LangManager.Instance.GetTranslation(
        "petWnd.potency.itemTitle" + i,
      );
    }
    this.petCom.txt_property.text = this._data.petTypeLanguage;
    this.petCom.loader.icon = FUIHelper.getItemURL(
      EmPackName.Base,
      "Icon_PetType" + this._data.template.PetType,
    );
    this.petCom.txtCapacity.text = this._data.fightPower.toString();
    this.petCom.txtName.text =
      this._data.name +
      " " +
      LangManager.Instance.GetTranslation("public.level2", this._data.grade);
    this.petCom.txtName.color = PetData.getQualityColor(this._data.quality - 1);

    this.petCom.curList.removeChildrenToPool();
    let next: t_s_upgradetemplateData = this._data.qualityUpgradeTemplateInfo;
    if (next) {
      this.refreshStarList(this._data.temQuality % 5, 1);
      if (this._data.temQuality < 20) {
        this.refreshStarList((this._data.temQuality + 1) % 5, 2);
      }
    } else {
      this.refreshStarList(0, 1);
    }
    this.refreshStatsAttrInfo();
    this.initEquip();
    this.addEvent();
  }

  private addEvent() {
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_LOOKINFO_SELECTIDEX,
      this.updateView,
      this,
    );
  }

  private removeEvent() {
    Utils.clearGListHandle(this.goodsList);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_LOOKINFO_SELECTIDEX,
      this.updateView,
      this,
    );
  }

  renderListItem(index: number, item: ArtifactItem) {
    if (index < this._petList.length) {
      item.type = 2;
      item.info = this._petList[index];
    } else {
      item.info = null;
    }
  }

  private updateView(index: number) {
    this.c1.selectedIndex = index;
    this._petList =
      PlayerManager.Instance.currentPlayerModel.playerInfo.petList;
    this.goodsList.numItems = 6;
    this.artPhysicsAttackValue.text = this.getTotalAtk().toString();
    this.artMagicAttackValue.text = this.getTotalMat().toString();
    this.artPowerVal.text = this.getTotalDef().toString();
    this.artArmorVal.text = this.getTotalMdf().toString();
    this.artPhysicsDefenseValue.text = this.getTotalHp().toString();
  }
  /**
   * 计算总的物攻
   */
  private getTotalAtk(): number {
    let totalValue = 0;
    for (let i: number = 0; i < this._petList.length; i++) {
      totalValue += this._petList[i].atkbeneAtr;
    }
    return totalValue;
  }

  private getTotalMat(): number {
    let totalValue = 0;
    for (let i: number = 0; i < this._petList.length; i++) {
      totalValue += this._petList[i].matbeneAtr;
    }
    return totalValue;
  }

  private getTotalDef(): number {
    let totalValue = 0;
    for (let i: number = 0; i < this._petList.length; i++) {
      totalValue += this._petList[i].defbeneAtr;
    }
    return totalValue;
  }

  private getTotalMdf(): number {
    let totalValue = 0;
    for (let i: number = 0; i < this._petList.length; i++) {
      totalValue += this._petList[i].mdfbeneAtr;
    }
    return totalValue;
  }

  private getTotalHp(): number {
    let totalValue = 0;
    for (let i: number = 0; i < this._petList.length; i++) {
      totalValue += this._petList[i].hpbeneAtr;
    }
    return totalValue;
  }
  private initEquip() {
    for (let j = 0; j < 6; j++) {
      let cell = this["part" + j] as PetEquipCell;
      cell.info = null;
      (cell.getChild("part_icon") as fgui.GLoader).url =
        fgui.UIPackage.getItemURL(EmPackName.PlayerInfo, this.strArr[j]);
    }

    let equipArr = GoodsManager.Instance.getGoodsByBagType(
      BagType.PET_EQUIP_BAG,
    );
    for (let i = 0; i < equipArr.length; i++) {
      const goodsInfo = equipArr[i];
      //判断英灵是否有穿戴装备
      if (goodsInfo.objectId == this._data.petId) {
        let cell = this["part" + goodsInfo.pos] as PetEquipCell;
        if (cell) {
          cell.canOperate = false;
          cell.info = goodsInfo;
        }
      }
    }
  }

  private refreshStatsAttrInfo() {
    let data = this._data;
    if (this._data) {
      this.txtPhysicsAttackValue.text = (
        data.physicalAttack + data.bagAttack
      ).toString();
      this.txtPhysicsDefenseValue.text = (
        data.physicalDefense + data.bagDefence
      ).toString();
      this.txtMagicAttackValue.text = (
        data.magicAttack + data.bagMagicattack
      ).toString();
      this.txtMagicDefenseValue.text = (
        data.magicDefense + data.bagMagicdefence
      ).toString();
      this.txtHpValue.text = (data.hp + data.bagLiving).toString();
      this.txtPPhysicsAttackValue.text = data.atkpotentialAtr.toString();
      this.txtPMagicAttackValue.text = data.matpotentialAtr.toString();
      this.txtPPowerVal.text = data.defpotentialAtr.toString();
      this.txtPArmorVal.text = data.mdfpotentialAtr.toString();
      this.txtPPhysicsDefenseValue.text = data.hppotentialAtr.toString();
      this.txtPowerVal.text = data.strength.toString();
      this.txtStaminaVal.text = data.stamina.toString();
      this.txtIntelligenceVal.text = data.intellect.toString();
      this.txtArmorVal.text = data.armor.toString();
    } else {
      this.txtPhysicsAttackValue.text = "";
      this.txtPhysicsDefenseValue.text = "";
      this.txtMagicAttackValue.text = "";
      this.txtMagicDefenseValue.text = "";
      this.txtHpValue.text = "";
      this.txtPPhysicsAttackValue.text = "";
      this.txtPMagicAttackValue.text = "";
      this.txtPPowerVal.text = "";
      this.txtPArmorVal.text = "";
      this.txtPPhysicsDefenseValue.text = "";
      this.txtPowerVal.text = "";
      this.txtStaminaVal.text = "";
      this.txtIntelligenceVal.text = "";
      this.txtArmorVal.text = "";
    }
  }

  private refreshStarList(mod: number, type?: number) {
    if (mod != 0) {
      for (let i: number = 0; i < 5; i++) {
        if (type == 1) {
          let item = this.petCom.curList.addItemFromPool().asCom;
          item.getController("cShowStar").selectedIndex = i < mod ? 0 : 1;
        }
        // else if (type == 2) {
        //     let item = this.nextList.addItemFromPool().asCom
        //     item.getController("cShowStar").selectedIndex = i < mod ? 0 : 1;
        // }
      }
    } else {
      for (let i: number = 0; i < 5; i++) {
        if (type == 1) {
          let item = this.petCom.curList.addItemFromPool().asCom;
          item.getController("cShowStar").selectedIndex = 0;
        }
        // else {
        //     let item = this.nextList.addItemFromPool().asCom
        //     item.getController("cShowStar").selectedIndex = 0;
        // }
      }
    }
  }

  public dispose() {
    this.removeEvent();
    if (this._petView) {
      this._petView.dispose();
      this._petView = null;
    }
    let wnd: PlayerPetWnd = UIManager.Instance.FindWind(EmWindow.PlayerPetWnd);
    if (wnd && wnd.isShowing) {
      wnd.hide();
    }
    super.dispose();
  }
}
