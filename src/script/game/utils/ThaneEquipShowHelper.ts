import { BagType } from "../constant/BagDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { GoodsManager } from "../manager/GoodsManager";

export class ThaneEquipShowHelper {
  public static POS_WEAPON = 0;
  public static POS_HEADDRESS = 1;
  public static POS_CLOTHES = 2;
  public static POS_WING = 8;
  public static POS_HEADDRESS_FASHION = 9;
  public static POS_CLOTHES_FASHION = 10;
  public static POS_WEAPON_FASHION = 11;

  public static getAvatarByEquipPos(pos: number): string {
    let avatar: string = "";
    let equipInfo: GoodsInfo = new GoodsInfo();
    let equipBagType = BagType.HeroEquipment;
    let equipObjectId = ArmyManager.Instance.thane.id;
    equipInfo = GoodsManager.Instance.getItemByPOB(
      pos,
      equipObjectId,
      equipBagType,
    );
    if (!equipInfo) {
      return avatar;
    }
    if (equipInfo.templateInfo) {
      return equipInfo.templateInfo.Avata;
    }
    return avatar;
  }

  public static getAvatarByEquipInfo(equipInfo: GoodsInfo): string {
    let avatar: string = "";
    let equipObjectId = ArmyManager.Instance.thane.id;
    if (!equipInfo) {
      return avatar;
    }
    if (equipInfo.templateInfo) {
      return equipInfo.templateInfo.Avata;
    }
    return avatar;
  }

  // public static getAvatarByEquipTemplateInfo(equipTemplateInfo, isViceHero: boolean): string {
  //     let avatar = "";
  //     let equipObjectId = ArmyManager.Instance.thane.id;
  //     if (!equipTemplateInfo) {
  //         return avatar;
  //     }
  //     if (equipTemplateInfo) {
  //         return equipTemplateInfo.Avata;
  //     }
  //     return avatar;
  // }
}
