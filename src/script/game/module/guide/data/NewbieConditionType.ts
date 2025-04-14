/*
 * @Author: jeremy.xu
 * @Date: 2022-06-08 18:09:07
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-08-31 15:20:48
 * @Description:
 */

export default class NewbieConditionType {
  public static c1: string = "NewbieBaseConditionMediator|checkPlayerGrade"; //检查玩家等级
  public static c2: string = "NewbieBaseConditionMediator|checkInScene"; //检查是否处于该场景
  public static c3: string = "NewbieBaseConditionMediator|checkCastleBuild"; //检查内城建筑是否存在
  public static c4: string = "NewbieBaseConditionMediator|checkTaskIsComplete"; //检查任务是否完成
  public static c5: string = "NewbieBaseConditionMediator|checkSkillInfo"; //检查技能是否存在
  public static c6: string = "NewbieBaseConditionMediator|checkFrameByType"; //检查模块窗口是否打开
  public static c7: string =
    "NewbieBaseConditionMediator|checkCampaignNodeState"; //检查副本节点是否处于某状态
  public static c8: string = "NewbieBaseConditionMediator|checkNotInScene"; //检查是否不处于该场景
  public static c9: string = "NewbieBaseConditionMediator|checkConditionCommon"; //条件集
  public static c10: string =
    "NewbieBaseConditionMediator|checkCampaignNodeView"; //检查副本节点视图是否存在
  public static c11: string = "NewbieBaseConditionMediator|checkGoodsNum"; //检查物品数量
  public static c12: string =
    "NewbieBaseConditionMediator|checkTaskHasCompleted"; //检查是否完成过此任务
  public static c13: string =
    "NewbieBaseConditionMediator|checkPlayerBagItemIsExistData"; //检查背包格子是否存在物品
  public static c14: string =
    "NewbieBaseConditionMediator|checkEquipBagItemIsExistData"; //检查装备格子是否存在物品
  public static c15: string = "NewbieBaseConditionMediator|checkHavePawn"; //检查是否拥有某类士兵
  public static c17: string =
    "NewbieBaseConditionMediator|checkInCastleOrSpace"; //检查是否在内城或天空之城
  public static c18: string =
    "NewbieBaseConditionMediator|checkRolesNumInBattle"; //检查战斗中角色数量
  public static c20: string =
    "NewbieBaseConditionMediator|checkCampaignNodeAvatarState"; //检查副本节点avatar状态
  public static c21: string = "NewbieBaseConditionMediator|checkNodeIsOccupy"; //判断外城某个金矿节点是否已被占领
  public static c22: string = "NewbieBaseConditionMediator|checkTaskProcess"; //判断任务进度
  public static c23: string =
    "NewbieBaseConditionMediator|getTransferOuterCityActionIsFinish"; //判断外城人物传送动画是否完成
  public static c24: string =
    "NewbieBaseConditionMediator|checkNewbieNodeFinish"; //检查是否已经结束新手节点
  public static c25: string = "NewbieBaseConditionMediator|checkHasConsortia"; //检查是否加入了公会

  public static c50: string = "NewbieBaseConditionMediator|checkConditionFlag"; //判断可通过条件
}
