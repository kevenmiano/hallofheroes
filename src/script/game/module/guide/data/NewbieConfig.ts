import { EmWindow } from "../../../constant/UIDefine";

export default class NewbieConfig {
  //
  static NEWBIE_10: number = 10;
  static NEWBIE_70: number = 70;
  // 判断是否进内城的节点
  static NEWBIE_150: number = 150;

  //打开内政厅界面
  static NEWBIE_200: number = 200;
  //打开兵营界面
  static NEWBIE_210: number = 210;
  //打开征战界面
  static NEWBIE_211: number = 211;
  //打开单人战役（当前选中战役扫荡按钮可点时）
  static NEWBIE_212: number = 212;
  //打开技能界面
  static NEWBIE_214: number = 214;
  //进入铁匠铺-强化分页
  static NEWBIE_220: number = 220;
  //打开农场界面
  static NEWBIE_230: number = 230;
  //打开公会界面（已加入公会时）
  static NEWBIE_240: number = 240;
  //进入铁匠铺-镶嵌分页
  static NEWBIE_250: number = 250;
  //打开悬赏界面
  static NEWBIE_260: number = 260;
  //打开地下迷宫界面
  static NEWBIE_270: number = 270;
  //打开占星界面
  static NEWBIE_280: number = 280;
  //打开坐骑界面
  static NEWBIE_290: number = 290;
  //进入技能-符文分页
  static NEWBIE_300: number = 300;
  //打开英灵界面
  static NEWBIE_310: number = 310;
  //打开英灵战役界面
  static NEWBIE_320: number = 320;
  //打开英灵远征界面
  static NEWBIE_330: number = 330;
  //进入技能-天赋分页
  static NEWBIE_340: number = 340;
  //进入背包-龙纹分页
  static NEWBIE_350: number = 350;
  //打开龙纹升级界面
  static NEWBIE_360: number = 360;
  //打开专精界面
  static NEWBIE_370: number = 370;
  //打开专精技能界面
  static NEWBIE_374: number = 374;
  //打开秘境界面
  static NEWBIE_380: number = 380;
  //打开市场商品列表页签时
  static NEWBIE_400: number = 400;
  //打开市场商品详情弹窗时
  static NEWBIE_401: number = 401;
  //打开市场商品出售弹窗时
  static NEWBIE_402: number = 402;

  public static Type2EmWindow = {};

  public static init() {
    /***
     * key加Wnd结尾增强在配置中的可读性
     */
    NewbieConfig.Type2EmWindow = {
      PoliticsFrameWnd: EmWindow.PoliticsFrameWnd, //内政厅
      SeminaryWnd: EmWindow.SeminaryWnd, //神学院
      SeminaryUpWnd: EmWindow.SeminaryUpWnd, //神学院升级
      CasernWnd: EmWindow.CasernWnd, //兵营
      PawnLevelUpWnd: EmWindow.PawnLevelUp, //士兵升级
      ResidenceFrameWnd: EmWindow.ResidenceFrameWnd, //民居
      DepotWnd: EmWindow.DepotWnd, //仓库
      HookWnd: EmWindow.Hook, //修行神殿
      TransferBuildWnd: EmWindow.TransferBuildWnd, //传送阵
      MazeFrameWnd: EmWindow.MazeFrameWnd, //迷宮
      WorldMapWnd: EmWindow.WorldMapWnd, //世界地图
      SpaceTaskInfoWnd: EmWindow.SpaceTaskInfoWnd, //
      OfferRewardWnd: EmWindow.OfferRewardWnd, //
      SmallMapWnd: EmWindow.SmallMapWnd, //
      SpaceDialogWnd: EmWindow.SpaceDialogWnd, //
      PveSelectCampaignWnd: EmWindow.PveMultiCampaignWnd, //
      PveRoomListWnd: EmWindow.PveRoomList, //
      ColosseumWnd: EmWindow.Colosseum, //
      RoomListWnd: EmWindow.RoomList, //
      RoomHallWnd: EmWindow.RoomHall, //
      PvpShopWnd: EmWindow.PvpShop, //
      BagWnd: EmWindow.BagWnd, //
      RoleWnd: EmWindow.RoleWnd, //
      SRoleWnd: EmWindow.SRoleWnd, //
      PetWnd: EmWindow.Pet, //
      ForgeWnd: EmWindow.Forge, //
      StarWnd: EmWindow.Star, //
      StarBagWnd: EmWindow.StarBag, //
      SkillWnd: EmWindow.Skill, //
      AllocateWnd: EmWindow.AllocateWnd, //
      FormationExWnd: EmWindow.AllocateFormationWnd, //
      CasernRecruitWnd: EmWindow.CasernRecruitWnd, //
      ConfigSoliderWnd: EmWindow.ConfigSoliderWnd, //
      FriendWnd: EmWindow.FriendWnd, //
      ConsortiaWnd: EmWindow.Consortia, //
      MountsWnd: EmWindow.MountsWnd, //
      SelectCampaignWnd: EmWindow.PveCampaignWnd, //
      ShopWnd: EmWindow.ShopWnd, //
      MagicCardWnd: EmWindow.MagicCard,
      LevelUpWnd: EmWindow.LevelUp, //升级
      HomeWnd: EmWindow.Home,
      OuterCityCastleInfoWnd: EmWindow.OuterCityCastleInfoWnd, //外城城堡
      OuterCityFieldInfoWnd: EmWindow.OuterCityFieldInfoWnd, //外城金矿
      OuterCityAttackAlertWnd: EmWindow.OuterCityAttackAlertWnd, //外城城堡攻击信息
      AlertWnd: EmWindow.Alert,
      FriendsWnd: EmWindow.FriendWnd,
      AddFriendsWnd: EmWindow.AddFriendsWnd,
      BattleWnd: EmWindow.Battle,
      ConsortiaApplyWnd: EmWindow.ConsortiaApply,
      AutoWalkWnd: EmWindow.AutoWalkWnd,

      /**
       * 提示
       */
      EquipContrastTipsWnd: EmWindow.EquipContrastTips,
      SoliderInfoTipWnd: EmWindow.SoliderInfoTipWnd, //配兵
      ForgeEquipTipWnd: EmWindow.ForgeEquipTip,
      OuterCityFieldTipsWnd: EmWindow.OuterCityFieldTips, //外城金矿tips
      OuterCityCastleTipsWnd: EmWindow.OuterCityCastleTips, //外城城堡tips
      OuterCityOperateMenuWnd: EmWindow.OuterCityOperateMenu, //外城操作界面
      OuterCityMapWnd: EmWindow.OuterCityMapWnd,
    };
  }
}
