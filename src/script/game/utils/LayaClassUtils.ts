import { PawnRoleInfo } from "../battle/data/objects/PawnRoleInfo";
import { CampaignOverTransaction } from "../battle/transaction/CampaignOverTransaction";
import { CreateGameTransaction } from "../battle/transaction/CreateGameTransaction";
import language from "../config/language";
import siteConfig from "../config/siteConfig";
import t_s_action from "../config/t_s_action";
import t_s_actiontemplate from "../config/t_s_actiontemplate";
import t_s_activetemplate from "../config/t_s_activetemplate";
import t_s_appell from "../config/t_s_appell";
import t_s_attribute from "../config/t_s_attribute";
import t_s_buildingtemplate from "../config/t_s_buildingtemplate";
import t_s_campaign from "../config/t_s_campaign";
import t_s_campaignbuffer from "../config/t_s_campaignbuffer";
import t_s_campaigndata from "../config/t_s_campaigndata";
import t_s_carnivaldailychallenge from "../config/t_s_carnivaldailychallenge";
import t_s_carnivalluckdraw from "../config/t_s_carnivalluckdraw";
import t_s_carnivalpointexchange from "../config/t_s_carnivalpointexchange";
import t_s_chatbubble from "../config/t_s_chatbubble";
import t_s_chattranslateset from "../config/t_s_chattranslateset";
import t_s_compose from "../config/t_s_compose";
import t_s_config from "../config/t_s_config";
import t_s_consortiaboss from "../config/t_s_consortiaboss";
import t_s_consortialevel from "../config/t_s_consortialevel";
import t_s_dirtylib from "../config/t_s_dirtylib";
import t_s_dropcondition from "../config/t_s_dropcondition";
import t_s_dropitem from "../config/t_s_dropitem";
import t_s_dropview from "../config/t_s_dropview";
import t_s_effecttemplate from "../config/t_s_effecttemplate";
import t_s_firstpay from "../config/t_s_firstpay";
import t_s_fishtemplate from "../config/t_s_fishtemplate";
import t_s_fund from "../config/t_s_fund";
import t_s_gameconfig from "../config/t_s_gameconfig";
import t_s_heroai from "../config/t_s_heroai";
import t_s_herotemplate from "../config/t_s_herotemplate";
import t_s_honorequip from "../config/t_s_honorequip";
import t_s_itemtemplate from "../config/t_s_itemtemplate";
import t_s_kingcontract from "../config/t_s_kingcontract";
import t_s_kingtowerboss from "../config/t_s_kingtowerboss";
import t_s_leedtemplate from "../config/t_s_leedtemplate";
import t_s_levelupprompt from "../config/t_s_levelupprompt";
import t_s_map from "../config/t_s_map";
import t_s_mapbossconfig from "../config/t_s_mapbossconfig";
import t_s_mapbosscount from "../config/t_s_mapbosscount";
import t_s_mapmine from "../config/t_s_mapmine";
import t_s_mapnode from "../config/t_s_mapnode";
import t_s_mapnodeoffset from "../config/t_s_mapnodeoffset";
import t_s_mapphysicposition from "../config/t_s_mapphysicposition";
import t_s_mapphysicstemplate from "../config/t_s_mapphysicstemplate";
import t_s_mapphysicstreasure from "../config/t_s_mapphysicstreasure";
import t_s_mounttemplate from "../config/t_s_mounttemplate";
import t_s_novicedialogue from "../config/t_s_novicedialogue";
import t_s_obtain from "../config/t_s_obtain";
import t_s_outcityshop from "../config/t_s_outcityshop";
import t_s_passcheck from "../config/t_s_passcheck";
import t_s_passchecktask from "../config/t_s_passchecktask";
import t_s_pawntemplate from "../config/t_s_pawntemplate";
import t_s_petequipattr from "../config/t_s_petequipattr";
import t_s_petequipquality from "../config/t_s_petequipquality";
import t_s_petequipstrengthen from "../config/t_s_petequipstrengthen";
import t_s_petequipsuit from "../config/t_s_petequipsuit";
import t_s_pettemplate from "../config/t_s_pettemplate";
import t_s_pluralpvpsegment from "../config/t_s_pluralpvpsegment";
import t_s_powcardsuitetemplate from "../config/t_s_powcardsuitetemplate";
import t_s_powcardtemplate from "../config/t_s_powcardtemplate";
import t_s_pvptimerinfo from "../config/t_s_pvptimerinfo";
import t_s_qqgrade from "../config/t_s_qqgrade";
import t_s_qqgradepackage from "../config/t_s_qqgradepackage";
import t_s_qqgradeprivilege from "../config/t_s_qqgradeprivilege";
import t_s_questcondiction from "../config/t_s_questcondiction";
import t_s_questgood from "../config/t_s_questgood";
import t_s_question from "../config/t_s_question";
import t_s_questtemplate from "../config/t_s_questtemplate";
import t_s_recharge from "../config/t_s_recharge";
import t_s_recover from "../config/t_s_recover";
import t_s_remotepet from "../config/t_s_remotepet";
import t_s_rewardcondiction from "../config/t_s_rewardcondiction";
import t_s_rewardgood from "../config/t_s_rewardgood";
import t_s_rewardtemplate from "../config/t_s_rewardtemplate";
import t_s_robottemplate from "../config/t_s_robottemplate";
import t_s_runeactivation from "../config/t_s_runeactivation";
import t_s_runegem from "../config/t_s_runegem";
import t_s_runehole from "../config/t_s_runehole";
import t_s_runetemplate from "../config/t_s_runetemplate";
import t_s_seek from "../config/t_s_seek";
import t_s_seektemplate from "../config/t_s_seektemplate";
import t_s_sevengiftbag from "../config/t_s_sevengiftbag";
import t_s_seventarget from "../config/t_s_seventarget";
import t_s_seventreasure from "../config/t_s_seventreasure";
import t_s_shop from "../config/t_s_shop";
import t_s_simpletask from "../config/t_s_simpletask";
import t_s_singlearenarewards from "../config/t_s_singlearenarewards";
import t_s_skillbuffertemplate from "../config/t_s_skillbuffertemplate";
import t_s_skillpropertytemplate from "../config/t_s_skillpropertytemplate";
import t_s_skilltemplate from "../config/t_s_skilltemplate";
import t_s_specialtemplate from "../config/t_s_specialtemplate";
import t_s_startemplate from "../config/t_s_startemplate";
import t_s_suitetemplate from "../config/t_s_suitetemplate";
import t_s_systemopentips from "../config/t_s_systemopentips";
import t_s_talenteffecttemplate from "../config/t_s_talenteffecttemplate";
import t_s_transformtemplate from "../config/t_s_transformtemplate";
import t_s_uiplaybase from "../config/t_s_uiplaybase";
import t_s_uiplaylevel from "../config/t_s_uiplaylevel";
import t_s_upgradetemplate from "../config/t_s_upgradetemplate";
import t_s_value from "../config/t_s_value";
import t_s_vehiclebufftemplate from "../config/t_s_vehiclebufftemplate";
import t_s_vehicleobjecttemplate from "../config/t_s_vehicleobjecttemplate";
import t_s_vehicleskilltemplate from "../config/t_s_vehicleskilltemplate";
import t_s_vippackage from "../config/t_s_vippackage";
import t_s_vipprerogativetemplate from "../config/t_s_vipprerogativetemplate";
import t_s_wishingpool from "../config/t_s_wishingpool";
import { BaseSnsInfo } from "../datas/BaseSnsInfo";
import FriendItemCellInfo from "../datas/FriendItemCellInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { BaseManager } from "../manager/BaseManager";
import BoxManager from "../manager/BoxManager";
import FightingManager from "../manager/FightingManager";
import { StarManager } from "../manager/StarManager";
import { CrossMapSearchAction } from "../map/crossmapsearch/CrossMapSearchAction";
import SpaceArmy from "../map/space/data/SpaceArmy";
import { AddPawnTipView } from "../module/home/TaskTraceTip/AddPawnTipView";
// import { BetterGoodsTipsView } from "../module/home/TaskTraceTip/BetterGoodsTipsView";
import { BufferDisapearTipView } from "../module/home/TaskTraceTip/BufferDisapearTipView";
import { BuyBloodTipView } from "../module/home/TaskTraceTip/BuyBloodTipView";
import { CampaignCardTipView } from "../module/home/TaskTraceTip/CampaignCardTipView";
import { DemonOpenTipView } from "../module/home/TaskTraceTip/DemonOpenTipView";
import { ExpBackTipView } from "../module/home/TaskTraceTip/ExpBackTipView";
import { FarmCanPickTipView } from "../module/home/TaskTraceTip/FarmCanPickTipView";
import { FightingTipView } from "../module/home/TaskTraceTip/FightingTipView";
import { GradeBoxTipView } from "../module/home/TaskTraceTip/GradeBoxTipView";
import { IntensifyTipView } from "../module/home/TaskTraceTip/IntensifyTipView";
import { MountOpenTipView } from "../module/home/TaskTraceTip/MountOpenTipView";
import { MountTipView } from "../module/home/TaskTraceTip/MountTipView";
import { OpenBagTipView } from "../module/home/TaskTraceTip/OpenBagTipView";
import { OpenBoxTipView } from "../module/home/TaskTraceTip/OpenBoxTipView";
import { PawnCharacteristicsTipView } from "../module/home/TaskTraceTip/PawnCharacteristicsTipView";
import { PetAddPointTip } from "../module/home/TaskTraceTip/PetAddPointTip";
import { RegressionTipView } from "../module/home/TaskTraceTip/RegressionTipView";
import { SecretTreeTipView } from "../module/home/TaskTraceTip/SecretTreeTipView";
import { ShopTimeBuyTipView } from "../module/home/TaskTraceTip/ShopTimeBuyTipView";
import { SinglepassHasBugleYipsView } from "../module/home/TaskTraceTip/SinglepassHasBugleYipsView";
import { StarTipView } from "../module/home/TaskTraceTip/StarTipView";
import { TaskEquipTipView } from "../module/home/TaskTraceTip/TaskEquipTipView";
import { TreasureMapTipView } from "../module/home/TaskTraceTip/TreasureMapTipView";
import { TreeCanPickTipView } from "../module/home/TaskTraceTip/TreeCanPickTipView";
import { UpgradePawnTipView } from "../module/home/TaskTraceTip/UpgradePawnTipView";
import { UseWearyTipView } from "../module/home/TaskTraceTip/UseWearyTipView";
import { VIPCardTipView } from "../module/home/TaskTraceTip/VIPCardTipView";
import { VIPCustomTipView } from "../module/home/TaskTraceTip/VIPCustomTipView";
import { VipGiftGetTipView } from "../module/home/TaskTraceTip/VipGiftGetTipView";
import { VipMountActivityTipView } from "../module/home/TaskTraceTip/VipMountActivityTipView";
import { VipMountLoseTipView } from "../module/home/TaskTraceTip/VipMountLoseTipView";
import { VipRechargeTipView } from "../module/home/TaskTraceTip/VipRechargeTipView";
import { VipUpGradeTipView } from "../module/home/TaskTraceTip/VipUpGradeTipView";
import { WarlordsBetTipView } from "../module/home/TaskTraceTip/WarlordsBetTipView";
import t_s_passindex from "../config/t_s_passindex";
import t_s_itempricelimit from "../config/t_s_itempricelimit";
import t_s_petartifactproperty from "../config/t_s_petartifactproperty";
import t_s_castlebattlebuilding from "../config/t_s_castlebattlebuilding";
import t_s_castlebattlebuildingskill from "../config/t_s_castlebattlebuildingskill";
import t_s_extrajob from "../config/t_s_extrajob";
import t_s_extrajobequip from "../config/t_s_extrajobequip";
import t_s_extrajobequipstrengthen from "../config/t_s_extrajobequipstrengthen";
import t_s_secret from "../config/t_s_secret";
import t_s_secretevent from "../config/t_s_secretevent";
import t_s_consortiatask from "../config/t_s_consortiatask";
import t_s_consortiataskreward from "../config/t_s_consortiataskreward";
import t_s_secretoption from "../config/t_s_secretoption";
import t_s_secrettreasure from "../config/t_s_secrettreasure";
import t_s_activityschedule from "../config/t_s_activityschedule";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/14 12:13
 * @ver 1.0
 *
 */
export class LayaClassUtils {
  /**
     * 有循环引用的话可以在这里注册一个类的别名来用<br>
     Laya.ClassUtils.regClass(Laya.ClassUtils.getClass('FriendItemCellInfo');<br>
     Laya.ClassUtils.regClass(new cls();
     */
  static register() {
    this.registerConfigClass(); //注册配置类
    Laya.ClassUtils.regClass("PawnRoleInfo", PawnRoleInfo);
    Laya.ClassUtils.regClass("BaseSnsInfo", BaseSnsInfo);
    Laya.ClassUtils.regClass("SpaceArmy", SpaceArmy);
    Laya.ClassUtils.regClass("FriendItemCellInfo", FriendItemCellInfo);
    Laya.ClassUtils.regClass("StarManager", StarManager);
    Laya.ClassUtils.regClass("BaseManager", BaseManager);
    Laya.ClassUtils.regClass("BoxManager", BoxManager);
    Laya.ClassUtils.regClass("FightingManager", FightingManager);
    Laya.ClassUtils.regClass("CreateGameTransaction", CreateGameTransaction);
    Laya.ClassUtils.regClass(
      "CampaignOverTransaction",
      CampaignOverTransaction,
    );
    Laya.ClassUtils.regClass("CrossMapSearchAction", CrossMapSearchAction);
    Laya.ClassUtils.regClass("ThaneInfo", ThaneInfo);

    //右下角提示类
    Laya.ClassUtils.regClass("AddPawnTipView", AddPawnTipView);
    // Laya.ClassUtils.regClass('BetterGoodsTipsView', BetterGoodsTipsView);
    Laya.ClassUtils.regClass("BuyBloodTipView", BuyBloodTipView);
    Laya.ClassUtils.regClass("IntensifyTipView", IntensifyTipView);
    Laya.ClassUtils.regClass("MountTipView", MountTipView);
    Laya.ClassUtils.regClass("UpgradePawnTipView", UpgradePawnTipView);
    Laya.ClassUtils.regClass("TaskEquipTipView", TaskEquipTipView);
    Laya.ClassUtils.regClass("GradeBoxTipView", GradeBoxTipView);
    Laya.ClassUtils.regClass("StarTipView", StarTipView);
    Laya.ClassUtils.regClass("OpenBagTipView", OpenBagTipView);
    Laya.ClassUtils.regClass("TreeCanPickTipView", TreeCanPickTipView);
    Laya.ClassUtils.regClass("FarmCanPickTipView", FarmCanPickTipView);
    Laya.ClassUtils.regClass("UseWearyTipView", UseWearyTipView);
    Laya.ClassUtils.regClass("BufferDisapearTipView", BufferDisapearTipView);
    Laya.ClassUtils.regClass("VIPCardTipView", VIPCardTipView);
    Laya.ClassUtils.regClass("VipUpGradeTipView", VipUpGradeTipView);
    Laya.ClassUtils.regClass("VipGiftGetTipView", VipGiftGetTipView);
    Laya.ClassUtils.regClass("VipRechargeTipView", VipRechargeTipView);
    Laya.ClassUtils.regClass(
      "VipMountActivityTipView",
      VipMountActivityTipView,
    );
    Laya.ClassUtils.regClass("VipMountLoseTipView", VipMountLoseTipView);
    Laya.ClassUtils.regClass("SecretTreeTipView", SecretTreeTipView);
    Laya.ClassUtils.regClass(
      "PawnCharacteristicsTipView",
      PawnCharacteristicsTipView,
    );
    Laya.ClassUtils.regClass("MountOpenTipView", MountOpenTipView);
    Laya.ClassUtils.regClass("DemonOpenTipView", DemonOpenTipView);
    Laya.ClassUtils.regClass("RegressionTipView", RegressionTipView);
    Laya.ClassUtils.regClass("WarlordsBetTipView", WarlordsBetTipView);
    Laya.ClassUtils.regClass("PetAddPointTip", PetAddPointTip);
    Laya.ClassUtils.regClass("ShopTimeBuyTipView", ShopTimeBuyTipView);
    Laya.ClassUtils.regClass("TreasureMapTipView", TreasureMapTipView);
    Laya.ClassUtils.regClass("ExpBackTipView", ExpBackTipView);
    Laya.ClassUtils.regClass("FightingTipView", FightingTipView);
    Laya.ClassUtils.regClass("CampaignCardTipView", CampaignCardTipView);
    Laya.ClassUtils.regClass("VIPCustomTipView", VIPCustomTipView);
    Laya.ClassUtils.regClass(
      "SinglepassHasBugleYipsView",
      SinglepassHasBugleYipsView,
    );
    Laya.ClassUtils.regClass("OpenBoxTipView", OpenBoxTipView);
  }

  private static registerConfigClass() {
    Laya.ClassUtils.regClass("language", language);
    Laya.ClassUtils.regClass("t_s_gameconfig", t_s_gameconfig);
    Laya.ClassUtils.regClass("siteConfig", siteConfig);
    Laya.ClassUtils.regClass("t_s_action", t_s_action); //战斗内人物动作（客户端）
    Laya.ClassUtils.regClass("t_s_actiontemplate", t_s_actiontemplate); //战斗内人物动作（服务器）
    Laya.ClassUtils.regClass("t_s_activetemplate", t_s_activetemplate); //时段活动/日常活动/公会活动
    // Laya.ClassUtils.regClass("t_s_alchemyformula", t_s_alchemyformula);//炼金工房配方
    // Laya.ClassUtils.regClass("t_s_alchemymine", t_s_alchemymine);//炼金工房矿
    Laya.ClassUtils.regClass("t_s_appell", t_s_appell); //称号
    // Laya.ClassUtils.regClass("t_s_archaeologyitem", t_s_archaeologyitem);//考古物品
    // Laya.ClassUtils.regClass("t_s_archaeologybook",t_s_archaeologybook);//考古图鉴
    Laya.ClassUtils.regClass("t_s_buildingtemplate", t_s_buildingtemplate); //建筑/科技
    Laya.ClassUtils.regClass("t_s_campaign", t_s_campaign); //副本
    // Laya.ClassUtils.regClass("t_s_crisisEvent",t_s_crisisEvent);//位面危机事件具体配置
    // Laya.ClassUtils.regClass("t_s_crisisMap",t_s_crisisMap);//位面危机行走坐标
    // Laya.ClassUtils.regClass("t_s_crisisMapEvent",t_s_crisisMapEvent);//位面危机各地图事件类型与数量
    // Laya.ClassUtils.regClass("t_s_dragontalker_fightmount",t_s_dragontalker_fightmount);//龙语者战兽
    Laya.ClassUtils.regClass("t_s_map", t_s_map); //地图
    Laya.ClassUtils.regClass("t_s_campaigndata", t_s_campaigndata); //副本节点
    Laya.ClassUtils.regClass("t_s_campaignbuffer", t_s_campaignbuffer); //副本buff
    // Laya.ClassUtils.regClass("t_s_childpatrolmission",t_s_childpatrolmission);//守卫巡逻
    // Laya.ClassUtils.regClass("t_s_childtemplate",t_s_childtemplate);//守卫
    // Laya.ClassUtils.regClass("t_s_childtypetemplate",t_s_childtypetemplate);//守卫图鉴（6.0版本）
    Laya.ClassUtils.regClass("t_s_compose", t_s_compose); //合成
    Laya.ClassUtils.regClass("t_s_config", t_s_config); //杂项配置
    Laya.ClassUtils.regClass("t_s_consortiaboss", t_s_consortiaboss); //公会boss
    Laya.ClassUtils.regClass("t_s_consortialevel", t_s_consortialevel); //公会建筑
    Laya.ClassUtils.regClass("t_s_dropcondition", t_s_dropcondition); //掉落条件
    Laya.ClassUtils.regClass("t_s_dropitem", t_s_dropitem); //掉落物品
    Laya.ClassUtils.regClass("t_s_effecttemplate", t_s_effecttemplate); //战斗外效果
    // Laya.ClassUtils.regClass("t_s_furniture",t_s_furniture);//家具
    Laya.ClassUtils.regClass("t_s_fishtemplate", t_s_fishtemplate); //钓鱼
    // Laya.ClassUtils.regClass("t_s_gameboxshop",t_s_gameboxshop);//游戏盒子
    // Laya.ClassUtils.regClass("t_s_guardpve",t_s_guardpve);//守卫通缉
    // Laya.ClassUtils.regClass("t_s_hearttempinfo",t_s_hearttempinfo);//夫妻答题
    Laya.ClassUtils.regClass("t_s_heroai", t_s_heroai); //战斗AI
    Laya.ClassUtils.regClass("t_s_herotemplate", t_s_herotemplate); //英雄
    Laya.ClassUtils.regClass("t_s_pawntemplate", t_s_pawntemplate); //士兵
    // Laya.ClassUtils.regClass("t_s_itemboxchain",t_s_itemboxchain);//新手福利礼包
    Laya.ClassUtils.regClass("t_s_simpletask", t_s_simpletask); //新手福利任务
    // Laya.ClassUtils.regClass("t_s_simpletaskreward",t_s_simpletaskreward);//新手福利任务奖励
    Laya.ClassUtils.regClass("t_s_itemtemplate", t_s_itemtemplate); //物品
    Laya.ClassUtils.regClass("t_s_kingcontract", t_s_kingcontract); //精灵盟约
    Laya.ClassUtils.regClass("t_s_kingtowerboss", t_s_kingtowerboss); //王者之塔机器人
    // Laya.ClassUtils.regClass("t_s_kingtowerbcoefficient",t_s_kingtowerbcoefficient);//王者之塔属性
    Laya.ClassUtils.regClass("t_s_leedtemplate", t_s_leedtemplate); //活跃度
    // Laya.ClassUtils.regClass("t_s_magiccard",t_s_magiccard);//魔法卡牌
    // Laya.ClassUtils.regClass("t_s_magicpubchat",t_s_magicpubchat);//魔法酒馆对话
    // Laya.ClassUtils.regClass("t_s_magicpubnpc",t_s_magicpubnpc);//魔法酒馆npc
    Laya.ClassUtils.regClass("t_s_mapbossconfig", t_s_mapbossconfig); //外城boss
    Laya.ClassUtils.regClass("t_s_mapbosscount", t_s_mapbosscount); //外城boss数量
    Laya.ClassUtils.regClass("t_s_mapphysicstemplate", t_s_mapphysicstemplate); //外城节点
    Laya.ClassUtils.regClass("t_s_mapnode", t_s_mapnode); //主城节点
    // Laya.ClassUtils.regClass("t_s_marryspecification",t_s_marryspecification);//婚礼
    Laya.ClassUtils.regClass("t_s_mounttemplate", t_s_mounttemplate); //坐骑
    // Laya.ClassUtils.regClass("t_s_newcattoystemplate",t_s_newcattoystemplate);//猫屋
    // Laya.ClassUtils.regClass("t_s_navigationshop",t_s_navigationshop);//航海商店
    Laya.ClassUtils.regClass("t_s_outcityshop", t_s_outcityshop); //神秘商店
    // Laya.ClassUtils.regClass("t_s_petcompose",t_s_petcompose);//英灵神格融合
    Laya.ClassUtils.regClass("t_s_pettemplate", t_s_pettemplate); //英灵
    // Laya.ClassUtils.regClass("t_s_planes",t_s_planes);//位面
    // Laya.ClassUtils.regClass("t_s_planesevent",t_s_planesevent);//位面事件
    // Laya.ClassUtils.regClass("t_s_planeslayer",t_s_planeslayer);//位面层
    Laya.ClassUtils.regClass("t_s_pvptimerinfo", t_s_pvptimerinfo); //跨服活动
    Laya.ClassUtils.regClass("t_s_questcondiction", t_s_questcondiction); //任务条件
    Laya.ClassUtils.regClass("t_s_questgood", t_s_questgood); //任务奖励
    Laya.ClassUtils.regClass("t_s_questtemplate", t_s_questtemplate); //任务
    // Laya.ClassUtils.regClass("t_s_regresstemplate",t_s_regresstemplate);//老玩家回归
    Laya.ClassUtils.regClass("t_s_remotepet", t_s_remotepet); //英灵远征
    Laya.ClassUtils.regClass("t_s_rewardcondiction", t_s_rewardcondiction); //悬赏任务条件
    Laya.ClassUtils.regClass("t_s_rewardgood", t_s_rewardgood); //悬赏任务奖励
    Laya.ClassUtils.regClass("t_s_rewardtemplate", t_s_rewardtemplate); //悬赏任务
    Laya.ClassUtils.regClass("t_s_robottemplate", t_s_robottemplate); //机器人名字
    Laya.ClassUtils.regClass("t_s_runetemplate", t_s_runetemplate); //符文技能
    Laya.ClassUtils.regClass("t_s_seek", t_s_seek); //寻宝
    Laya.ClassUtils.regClass("t_s_seektemplate", t_s_seektemplate); //寻宝
    Laya.ClassUtils.regClass("t_s_shop", t_s_shop); //商店
    Laya.ClassUtils.regClass(
      "t_s_skillbuffertemplate",
      t_s_skillbuffertemplate,
    ); //技能buff
    Laya.ClassUtils.regClass(
      "t_s_skillpropertytemplate",
      t_s_skillpropertytemplate,
    ); //技能属性
    Laya.ClassUtils.regClass("t_s_skilltemplate", t_s_skilltemplate); //技能
    // Laya.ClassUtils.regClass("t_s_skytrialevent",t_s_skytrialevent);//天穹之径事件
    // Laya.ClassUtils.regClass("t_s_skytriallayer",t_s_skytriallayer);//天穹之径层数
    // Laya.ClassUtils.regClass("t_s_skytrialportal",t_s_skytrialportal);//天穹之径门
    Laya.ClassUtils.regClass("t_s_specialtemplate", t_s_specialtemplate); //士兵特性
    Laya.ClassUtils.regClass("t_s_startemplate", t_s_startemplate); //星运
    Laya.ClassUtils.regClass("t_s_suitetemplate", t_s_suitetemplate); //套装
    Laya.ClassUtils.regClass(
      "t_s_talenteffecttemplate",
      t_s_talenteffecttemplate,
    ); //天赋
    // Laya.ClassUtils.regClass("t_s_titan",t_s_titan);//泰坦
    Laya.ClassUtils.regClass("t_s_transformtemplate", t_s_transformtemplate); //转换
    Laya.ClassUtils.regClass("t_s_upgradetemplate", t_s_upgradetemplate); //升级
    Laya.ClassUtils.regClass(
      "t_s_vehiclebufftemplate",
      t_s_vehiclebufftemplate,
    ); //载具buff
    Laya.ClassUtils.regClass(
      "t_s_vehicleobjecttemplate",
      t_s_vehicleobjecttemplate,
    ); //载具
    Laya.ClassUtils.regClass(
      "t_s_vehicleskilltemplate",
      t_s_vehicleskilltemplate,
    ); //载具技能
    Laya.ClassUtils.regClass(
      "t_s_vipprerogativetemplate",
      t_s_vipprerogativetemplate,
    ); //VIP
    // Laya.ClassUtils.regClass("t_s_crossguildnode",t_s_crossguildnode);//跨服公会战节点模板
    // Laya.ClassUtils.regClass("t_s_consortiatreasure",t_s_consortiatreasure);//公会宝藏
    // Laya.ClassUtils.regClass("t_s_explorelayer",t_s_explorelayer);//秘境探索层数
    // Laya.ClassUtils.regClass("t_s_exploreevent",t_s_exploreevent);//秘境探索事件
    // Laya.ClassUtils.regClass("t_s_consortia_newboss",t_s_consortia_newboss);//新公会boss
    Laya.ClassUtils.regClass("t_s_mapnodeoffset", t_s_mapnodeoffset); //地图渲染节点的偏移点
    Laya.ClassUtils.regClass("t_s_powcardtemplate", t_s_powcardtemplate); //
    Laya.ClassUtils.regClass(
      "t_s_powcardsuitetemplate",
      t_s_powcardsuitetemplate,
    );
    Laya.ClassUtils.regClass("t_s_firstpay", t_s_firstpay); //首充送豪礼
    Laya.ClassUtils.regClass("t_s_fund", t_s_fund); //成长基金
    Laya.ClassUtils.regClass("t_s_seventreasure", t_s_seventreasure); //七日目标积分礼包数据
    Laya.ClassUtils.regClass("t_s_seventarget", t_s_seventarget); //七日目标任务数据
    Laya.ClassUtils.regClass("t_s_sevengiftbag", t_s_sevengiftbag); //七日目标特惠礼包数据
    Laya.ClassUtils.regClass("t_s_dirtylib", t_s_dirtylib); //脏字符库
    Laya.ClassUtils.regClass("t_s_recover", t_s_recover); //资源找回
    Laya.ClassUtils.regClass("t_s_question", t_s_question); //问卷调查
    Laya.ClassUtils.regClass("t_s_dropview", t_s_dropview); //公会祈福
    Laya.ClassUtils.regClass("t_s_recharge", t_s_recharge); //充值
    Laya.ClassUtils.regClass("t_s_vippackage", t_s_vippackage); //VIP特权礼包
    Laya.ClassUtils.regClass("t_s_value", t_s_value); //战斗力提升
    Laya.ClassUtils.regClass("t_s_levelupprompt", t_s_levelupprompt); //升级
    Laya.ClassUtils.regClass("t_s_novicedialogue", t_s_novicedialogue); //剧情对话
    Laya.ClassUtils.regClass("t_s_passcheck", t_s_passcheck); //通行证
    Laya.ClassUtils.regClass("t_s_passchecktask", t_s_passchecktask); //通行证任务
    Laya.ClassUtils.regClass("t_s_passindex", t_s_passindex); //控制战令各期数的开放时间、结算时间与关闭时间
    Laya.ClassUtils.regClass("t_s_chatbubble", t_s_chatbubble); //聊天气泡
    Laya.ClassUtils.regClass("t_s_mapphysicstreasure", t_s_mapphysicstreasure); //宝藏矿脉
    Laya.ClassUtils.regClass("t_s_runehole", t_s_runehole); //符孔
    Laya.ClassUtils.regClass("t_s_runegem", t_s_runegem); //符孔
    Laya.ClassUtils.regClass("t_s_uiplaybase", t_s_uiplaybase); //英灵战役
    Laya.ClassUtils.regClass("t_s_uiplaylevel", t_s_uiplaylevel); //英灵战役关卡
    Laya.ClassUtils.regClass("t_s_petequipsuit", t_s_petequipsuit); //
    Laya.ClassUtils.regClass("t_s_petequipquality", t_s_petequipquality); //
    Laya.ClassUtils.regClass("t_s_petequipattr", t_s_petequipattr); //
    Laya.ClassUtils.regClass("t_s_petequipstrengthen", t_s_petequipstrengthen); //
    Laya.ClassUtils.regClass("t_s_chattranslateset", t_s_chattranslateset); //聊天翻译
    Laya.ClassUtils.regClass("t_s_attribute", t_s_attribute);
    Laya.ClassUtils.regClass("t_s_honorequip", t_s_honorequip); //荣誉
    Laya.ClassUtils.regClass("t_s_obtain", t_s_obtain); //获得途径
    Laya.ClassUtils.regClass("t_s_runeactivation", t_s_runeactivation);

    Laya.ClassUtils.regClass("t_s_qqgrade", t_s_qqgrade); //qq大厅
    Laya.ClassUtils.regClass("t_s_qqgradeprivilege", t_s_qqgradeprivilege); //qq大厅
    Laya.ClassUtils.regClass("t_s_qqgradepackage", t_s_qqgradepackage); //qq大厅成长礼包
    Laya.ClassUtils.regClass("t_s_pluralpvpsegment", t_s_pluralpvpsegment); //多人竞技场段位
    Laya.ClassUtils.regClass("t_s_singlearenarewards", t_s_singlearenarewards); //单人竞技场奖励

    Laya.ClassUtils.regClass(
      "t_s_carnivaldailychallenge",
      t_s_carnivaldailychallenge,
    ); //嘉年华 每日挑战
    Laya.ClassUtils.regClass("t_s_carnivalluckdraw", t_s_carnivalluckdraw); //嘉年华 每日挑战
    Laya.ClassUtils.regClass(
      "t_s_carnivalpointexchange",
      t_s_carnivalpointexchange,
    ); //嘉年华 每日挑战
    Laya.ClassUtils.regClass("t_s_wishingpool", t_s_wishingpool); //嘉年华 每日挑战
    Laya.ClassUtils.regClass("t_s_mapphysicposition", t_s_mapphysicposition); //外城地图节点配置
    Laya.ClassUtils.regClass("t_s_mapmine", t_s_mapmine); //外城矿区配置
    Laya.ClassUtils.regClass("t_s_systemopentips", t_s_systemopentips); //
    Laya.ClassUtils.regClass("t_s_itempricelimit", t_s_itempricelimit); //
    Laya.ClassUtils.regClass(
      "t_s_petartifactproperty",
      t_s_petartifactproperty,
    ); //
    Laya.ClassUtils.regClass(
      "t_s_castlebattlebuilding",
      t_s_castlebattlebuilding,
    ); //
    Laya.ClassUtils.regClass(
      "t_s_castlebattlebuildingskill",
      t_s_castlebattlebuildingskill,
    ); //
    Laya.ClassUtils.regClass("t_s_extrajob", t_s_extrajob); //
    Laya.ClassUtils.regClass("t_s_extrajobequip", t_s_extrajobequip); //
    Laya.ClassUtils.regClass(
      "t_s_extrajobequipstrengthen",
      t_s_extrajobequipstrengthen,
    ); //
    Laya.ClassUtils.regClass("t_s_secret", t_s_secret); //
    Laya.ClassUtils.regClass("t_s_secretevent", t_s_secretevent); //
    Laya.ClassUtils.regClass("t_s_secretoption", t_s_secretoption); //
    Laya.ClassUtils.regClass("t_s_secrettreasure", t_s_secrettreasure); //
    Laya.ClassUtils.regClass("t_s_consortiatask", t_s_consortiatask); //
    Laya.ClassUtils.regClass(
      "t_s_consortiataskreward",
      t_s_consortiataskreward,
    ); //
    Laya.ClassUtils.regClass("t_s_activityschedule", t_s_activityschedule); //
  }

  /**获取映射类 */
  public static getRefClass(clsName: string = "", fileName?: string): any {
    let clsObj = Laya.ClassUtils.getClass(clsName);
    if (!clsObj) {
      clsName = fileName.substring(0, fileName.lastIndexOf("."));
      clsObj = Laya.ClassUtils.getClass(clsName);
    }
    return clsObj;
  }
}
