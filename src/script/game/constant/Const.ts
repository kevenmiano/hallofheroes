/*
 * @Author: jeremy.xu
 * @Date: 2022-04-09 11:14:23
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-17 10:38:38
 * @Description: 常量集合
 */

/** 选中标志
 * 0不显示 1显示可选 2显示选中
 * */
export enum ItemSelectState {
  Default = 0,
  Selectable,
  Selected,
}

/** 阴影类型
 * 0所有 1人 2坐骑
 * */
export enum ShadowType {
  ALL = 0,
  Normal,
  Mount,
}

/** 阵营
 * 0中立 1攻方 2守方
 */
export enum CampType {
  Neutrality = 0,
  Attack = 1,
  Defence,
}

/** 支付类型
 * 1使用钻石  2优先使用绑钻 */
export enum PayType {
  Diamond = 1,
  BindDiamond = 2,
}

/** 数字替代的boolean类型 */
export enum BooleanType {
  FALSE = 1,
  TRUE,
}

/** 完成领取状态
 * 0未完成 1完成未领取 2已领取
 */
export enum FinishStatus {
  UN_FINISHED = 0,
  FINISHED = 1,
  RECEIVED = 2,
}

export enum AvatarInfoTag {
  All = "All",
  Info = "Info",
  PetInfo = "PetInfo",
  NickName = "NickName",
  ConsortiaName = "ConsortiaName",
  Appell = "Appell",
  Vip = "Vip",
  PetTailMC = "PetTailMC",
  PetStar = "PetStar",
  PetQualityMC = "PetQualityMC",
  ChatPopView = "ChatPopView",
  QQ_DWK = "QQ_DWK",
}

/** 英灵系别
 *
 */
export enum EmPetType {
  TYPE1 = 101, //火系
  TYPE2 = 102, //水系
  TYPE3 = 103, //电系
  TYPE4 = 104, //风系
  TYPE5 = 105, //暗系
  TYPE6 = 106, //光系
}
