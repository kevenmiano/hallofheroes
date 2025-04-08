import IManager from "../../core/Interface/IManager";
import Logger from "../../core/logger/Logger";
import Dictionary from "../../core/utils/Dictionary";
import { EmPackName, EmWindow } from "../constant/UIDefine";
import AllocateCtrl from "../module/allocate/control/AllocateCtrl";
import ArmyModel from "../module/allocate/model/ArmyModel";
import TeamFormationCtrl from "../module/army/teamFormation/TeamFormationCtrl";
import { BagCtrl } from "../module/bag/control/BagCtrl";
import { FashionCtrl } from "../module/bag/control/FashionCtrl";
import { RoleCtrl } from "../module/bag/control/RoleCtrl";
import { BagModel } from "../module/bag/model/BagModel";
import { FashionModel } from "../module/bag/model/FashionModel";
import { RoleModel } from "../module/bag/model/RoleModel";
import BattleCtrl from "../module/battle/BattleCtrl";
import BattleData from "../module/battle/BattleData";
import CampaignResultCtrl from "../module/campaignResult/CampaignResultCtrl";
import CampaignResultData from "../module/campaignResult/CampaignResultData";
import ChatControl from "../module/chat/ChatControl";
import ChestFrameCtrl from "../module/chestFrame/ChestFrameCtrl";
import ChestFrameData from "../module/chestFrame/ChestFrameData";
import { ConsortiaControler } from "../module/consortia/control/ConsortiaControler";
import DisplayItemsCtrl from "../module/displayItems/DisplayItemsCtrl";
import FarmCtrl from "../module/farm/control/FarmCtrl";
import ForgeCtrl from "../module/forge/ForgeCtrl";
import ForgeData from "../module/forge/ForgeData";
import { FriendControl } from "../module/friend/control/FriendControl";
import FunnyCtrl from "../module/funny/control/FunnyCtrl";
import MailCtrl from "../module/mail/MailCtrl";
import MailModel from "../module/mail/MailModel";
import { MazeCtrl } from "../module/maze/MazeCtrl";
import MazeModel from "../module/maze/MazeModel";
import MopupCtrl from "../module/mopup/MopupCtrl";
import MopupData from "../module/mopup/MopupData";
import RankCtrl from "../module/rank/RankCtrl";
import RankData from "../module/rank/RankData";
import { ShopControler } from "../module/shop/control/ShopControler";
import SkillWndCtrl from "../module/skill/SkillWndCtrl";
import SkillWndData from "../module/skill/SkillWndData";
import SortController from "../module/sort/SortController";
import StarCtrl from "../module/star/StarCtrl";
import TaskCtrl from "../module/task/TaskCtrl";
import TaskData from "../module/task/TaskData";
import WelfareCtrl from "../module/welfare/WelfareCtrl";
import WelfareData from "../module/welfare/WelfareData";
import InviteCtrl from "../room/room/invite/InviteCtrl";
import InviteData from "../room/room/invite/InviteData";
import RoomHallCtrl from "../room/room/roomHall/RoomHallCtrl";
import RoomHallData from "../room/room/roomHall/RoomHallData";
import RoomListCtrl from "../room/room/roomList/RoomListCtrl";
import RoomListData from "../room/room/roomList/RoomListData";
import CommonCtrl from "./CommonCtrl";
import FrameCtrlBase from "./FrameCtrlBase";
import FrameCtrlInfo from "./FrameCtrlInfo";
import FrameDataBase from "./FrameDataBase";
import WorldBossModel from "./model/worldboss/WorldBossModel";
import { GvgReadyController } from "../module/consortia/control/GvgReadyController";
import { QuestionCtrl } from "../module/questionnaire/QuestionCtrl";
import VipPrivilegeCtrl from "../module/vip/VipPrivilegeCtrl";
import AppellCtrl from "../module/appell/AppellCtrl";
import PetCtrl from "../module/pet/control/PetCtrl";
import PetModel from "../module/pet/data/PetModel";
import PersonalCenterCtrl from "../module/personalCenter/PersonalCenterCtrl";
import DialogCtrl from "../map/campaign/view/frame/DialogCtrl";
import WarlordsModel from "../module/warlords/WarlordsModel";
import { WorldMapCtrl } from "../module/castle/control/WorldMapCtrl";
import PetChallengeCtrl from "../module/petChallenge/PetChallengeCtrl";
import PetChallengeData from "../module/petChallenge/PetChallengeData";
import TreasureMapCtrl from "../module/treasuremap/TreasureMapCtrl";
import { PlayerInfoCtrl } from "../module/playerinfo/PlayerInfoCtrl";
import HookController from "../module/hook/controller/HookController";
import SinglePassModel from "../module/singlepass/SinglePassModel";
import PveRoomListCtrl from "../room/room/roomList/pve/PveRoomListCtrl";
import PveRoomListData from "../room/room/roomList/pve/PveRoomListData";
import OuterCityCtrl from "../module/outercityshop/OuterCityCtrl";
import FightEditCtrl from "../module/fightEdit/FightEditCtrl";
import { SkillEditModel } from "../module/fightEdit/SkillEditModel";
import { NotificationManager } from "../manager/NotificationManager";
import { WinEvent } from "../constant/event/NotificationEvent";
import QQDawankaModel from "../module/qqDawanka/QQDawankaModel";
import QQGiftModel from "../module/qqGift/QQGiftModel";
import OutyardModel from "../module/outyard/OutyardModel";
import { WorldBossCtrl } from "../module/worldboss/WorldBossCtrl";
import CarnivalCtrl from "../module/carnival/control/CarnivalCtrl";
import ExpBackCtr from "../module/expback/control/ExpBackCtr";
import ExpBackModel from "../module/expback/model/ExpBackModel";
import OuterCityWarCtrl from "../module/outercityWar/control/OuterCityWarCtrl";
import HeadIconCtr from "../module/bag/view/HeadIconCtr";
import HeadIconModel from "../module/bag/view/HeadIconModel";
import PveMultiCampaignCtrl from "../module/pve/pveMultiCampaign/PveMultiCampaignCtrl";
import PveMultiCampaignData from "../module/pve/pveMultiCampaign/PveMultiCampaignData";
import PveCampaignCtrl from "../module/pve/pveCampaign/PveCampaignCtrl";
import PveCampaignData from "../module/pve/pveCampaign/PveCampaignData";
import ColosseumCtrl from "../module/pvp/colosseum/ColosseumCtrl";
import ColosseumData from "../module/pvp/colosseum/ColosseumData";
import PvpGateCtrl from "../module/pvp/gate/PvpGateCtrl";
import PveGateCtrl from "../module/pve/gate/PveGateCtrl";
import PveSecretCtrl from "../module/pve/pveSecret/PveSecretCtrl";
import PveSecretSceneCtrl from "../module/pve/pveSecretScene/PveSecretSceneCtrl";
import PveSecretSceneData from "../module/pve/pveSecretScene/PveSecretSceneData";
import PveSecretData from "../module/pve/pveSecret/PveSecretData";
import { SiteZoneUICtrl } from "../module/login/manager/SiteZoneUICtrl";
import MarketCtrl from "../module/market/MarketCtrl";

/**
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 20:00:08
 * @LastEditTime: 2021-02-19 11:45:27
 * @LastEditors: jeremy.xu
 * @Description: UI控制器的管理器 负责UI模块的注册、显示、隐藏
 */
export class FrameCtrlManager {
  static _ins: FrameCtrlManager;
  static get Instance(): FrameCtrlManager {
    if (!this._ins) this._ins = new FrameCtrlManager();
    return this._ins;
  }

  public curOpeningModuleMap: Map<EmWindow, boolean> = new Map();
  private _frameInfoDic: Dictionary = new Dictionary();
  private _frameControllerDic: Dictionary = new Dictionary();

  setup() {}

  preSetup() {
    NotificationManager.Instance.addEventListener(
      WinEvent.RETURN_TO_WIN,
      this.__returnToWin,
      this
    );
    this.register(EmWindow.Login, CommonCtrl);
    this.register(EmWindow.LoginOS, CommonCtrl);
    this.register(EmWindow.DebugLogin, CommonCtrl);
    this.register(EmWindow.SiteZone, CommonCtrl);
    this.register(EmWindow.RegisterS, CommonCtrl);
    this.register(EmWindow.Waiting, CommonCtrl);
    this.register(EmWindow.LoginSetting, CommonCtrl);
    this.register(EmWindow.LoginSettingOS, CommonCtrl);
    this.register(EmWindow.Announce, CommonCtrl);

    // 注册自己的类:  view 与 ctrl必须实现
    this.register(EmWindow.Battle, BattleCtrl, BattleData);
    this.register(EmWindow.BattleBuffDetailInfo, CommonCtrl);
    this.register(EmWindow.BattleShortCutWnd, CommonCtrl);
    this.register(EmWindow.Forge, ForgeCtrl, ForgeData);
    this.register(EmWindow.Skill, SkillWndCtrl, SkillWndData);
    // this.register(EmWindow.RoleWnd, RoleCtrl, RoleModel);
    this.register(EmWindow.SRoleWnd, RoleCtrl, RoleModel);
    this.register(EmWindow.BagWnd, BagCtrl, BagModel);
    this.register(EmWindow.PveCampaignWnd, PveCampaignCtrl, PveCampaignData);
    this.register(
      EmWindow.PveMultiCampaignWnd,
      PveMultiCampaignCtrl,
      PveMultiCampaignData
    );
    this.register(EmWindow.RoomHall, RoomHallCtrl, RoomHallData, [
      EmPackName.BaseRoom,
    ]);
    this.register(EmWindow.RoomList, RoomListCtrl, RoomListData);
    this.register(EmWindow.PveRoomList, PveRoomListCtrl, PveRoomListData);
    this.register(EmWindow.RoomPwd, CommonCtrl);
    this.register(EmWindow.FindRoom, CommonCtrl);
    this.register(EmWindow.Invite, InviteCtrl, InviteData);
    this.register(EmWindow.QuickInvite, InviteCtrl);
    this.register(EmWindow.BeingInvite, InviteCtrl);
    this.register(EmWindow.TeamFormation, TeamFormationCtrl);
    this.register(EmWindow.DisplayItems, DisplayItemsCtrl);
    this.register(EmWindow.MazeFrameWnd, MazeCtrl, MazeModel);
    this.register(EmWindow.MazeShopWnd, MazeCtrl, MazeModel);
    this.register(EmWindow.MazeViewWnd, MazeCtrl, MazeModel);
    this.register(EmWindow.AllocateWnd, AllocateCtrl, ArmyModel);
    this.register(EmWindow.ChestFrame, ChestFrameCtrl, ChestFrameData);
    this.register(
      EmWindow.CampaignResult,
      CampaignResultCtrl,
      CampaignResultData
    );
    this.register(EmWindow.ConfigSoliderWnd, AllocateCtrl, ArmyModel);
    this.register(EmWindow.MailWnd, MailCtrl, MailModel);
    this.register(EmWindow.WriteMailWnd, CommonCtrl);
    this.register(EmWindow.Mopup, MopupCtrl, MopupData);
    this.register(EmWindow.TaskWnd, TaskCtrl, TaskData);
    this.register(EmWindow.FashionWnd, FashionCtrl, FashionModel);
    this.register(EmWindow.BuyFrameI, ShopControler, null);
    this.register(EmWindow.ShopWnd, ShopControler, null);
    this.register(EmWindow.FriendWnd, FriendControl, null);
    this.register(EmWindow.ChatWnd, ChatControl, null);
    this.register(EmWindow.TrailDialog, CommonCtrl, null);
    this.register(EmWindow.PveGate, PveGateCtrl, null);
    this.register(EmWindow.PvpGate, PvpGateCtrl, null);
    this.register(EmWindow.PvpShop, CommonCtrl);
    this.register(EmWindow.Colosseum, ColosseumCtrl, ColosseumData, [
      EmPackName.BaseRoom,
    ]);
    this.register(EmWindow.ColosseumEvent, CommonCtrl); //该界面一定是在Colosseum打开后打开, 所以可以使用Colosseum的数据
    this.register(EmWindow.ColosseumRankReward, CommonCtrl);
    this.register(EmWindow.Rank, RankCtrl, RankData);
    this.register(EmWindow.Star, StarCtrl);
    this.register(EmWindow.StarBag, CommonCtrl);
    this.register(EmWindow.StarOperate, CommonCtrl);
    this.register(EmWindow.StarAutoSetting, CommonCtrl);
    this.register(EmWindow.MountsWnd, CommonCtrl);
    this.register(EmWindow.WildSoulWnd, CommonCtrl);
    this.register(EmWindow.Welfare, WelfareCtrl, WelfareData); //福利
    this.register(EmWindow.Consortia, ConsortiaControler); //公会
    this.register(EmWindow.ConsortiaUpgrade, ConsortiaControler);
    this.register(EmWindow.ConsortiaTreasureBox, ConsortiaControler);
    this.register(EmWindow.ConsortiaTransfer, ConsortiaControler);
    this.register(EmWindow.ConsortiaSkillTower, ConsortiaControler);
    this.register(EmWindow.ConsortiaRename, ConsortiaControler);
    this.register(EmWindow.ConsortiaPermission, ConsortiaControler);
    this.register(EmWindow.ConsortiaEmail, ConsortiaControler);
    this.register(EmWindow.ConsortiaEmailMember, ConsortiaControler);
    this.register(EmWindow.ConsortiaCreate, ConsortiaControler);
    this.register(EmWindow.ConsortiaContribute, ConsortiaControler);
    this.register(EmWindow.ConsortiaAuditing, ConsortiaControler);
    this.register(EmWindow.ConsortiaApply, ConsortiaControler);
    this.register(EmWindow.ConsortiaRecruitMember, ConsortiaControler);
    this.register(EmWindow.ConsortiaDevil, ConsortiaControler);
    this.register(EmWindow.ConsortiaEvent, ConsortiaControler);
    this.register(EmWindow.ConsortiaStorageWnd, ConsortiaControler);
    this.register(EmWindow.ConsortiaInfoWnd, ConsortiaControler);
    this.register(EmWindow.WorldBossWnd, WorldBossCtrl, WorldBossModel); //世界Boss
    this.register(EmWindow.RvrBattleWnd, CommonCtrl, null); //战场入口
    this.register(EmWindow.RvrBattleMapRightWnd, CommonCtrl, null); //战场右侧
    this.register(EmWindow.RvrBattleMapTopCenterWnd, CommonCtrl, null); //战场中部
    this.register(EmWindow.RvrBattleMapCombatWnd, CommonCtrl, null); //战场中部
    this.register(EmWindow.RvrBattleResultWnd, CommonCtrl, null); //战场结算
    this.register(EmWindow.RvrBattlePlayerRiverWnd, CommonCtrl, null); //战场复活
    this.register(EmWindow.RvrBattleGetResourceWnd, CommonCtrl, null); //战场提交资源
    this.register(EmWindow.Farm, FarmCtrl, null); //农场
    this.register(EmWindow.FarmLandMenu, CommonCtrl, null); //农场土地操作
    this.register(EmWindow.FarmShopWnd, CommonCtrl, null); //农场商城
    this.register(EmWindow.FarmEventWnd, CommonCtrl, null); //农场日志
    this.register(EmWindow.FarmLandUpWnd, CommonCtrl, null); //农场土地升级
    this.register(EmWindow.FarmPetSelect, CommonCtrl, null);
    this.register(EmWindow.Sort, SortController); //排行榜
    this.register(EmWindow.Funny, FunnyCtrl); //精彩活动
    this.register(EmWindow.ConsortiaPrizeAllotWnd, ConsortiaControler); //公会宝箱分配
    this.register(EmWindow.GvgRankListWnd, GvgReadyController); //公会战赛程
    // this.register(EmWindow.ConsortiaRankWnd, GvgReadyController);//公会战赛程排行榜
    this.register(EmWindow.QuestionNaireWnd, QuestionCtrl); //有奖问答
    this.register(EmWindow.QuestionWnd, QuestionCtrl); //问卷调查
    this.register(EmWindow.ConsortiaAltarWnd, ConsortiaControler); //公会祭坛
    this.register(EmWindow.VipPrivilege, VipPrivilegeCtrl); //Vip特权
    this.register(EmWindow.Appell, AppellCtrl); //称号
    this.register(EmWindow.ConsortiaSecretInfoWnd, ConsortiaControler);
    this.register(EmWindow.Pet, PetCtrl, PetModel);
    this.register(EmWindow.PetPotency, CommonCtrl);
    this.register(EmWindow.PetRename, CommonCtrl);
    this.register(EmWindow.PetSelect, CommonCtrl);
    this.register(EmWindow.PetChallenge, PetChallengeCtrl, PetChallengeData);
    this.register(EmWindow.PetChallengeAdjust, CommonCtrl);
    this.register(EmWindow.PetChallengeReward, CommonCtrl);
    this.register(EmWindow.PetChallengeEvent, CommonCtrl);
    this.register(EmWindow.PetChallengeConfirm, CommonCtrl);
    this.register(EmWindow.PetChallengeRank, CommonCtrl);
    this.register(EmWindow.PersonalCenter, PersonalCenterCtrl);
    this.register(EmWindow.CheckMailWnd, PersonalCenterCtrl);
    this.register(EmWindow.SuggestWnd, PersonalCenterCtrl);
    this.register(EmWindow.ChangePasswordWnd, PersonalCenterCtrl);
    this.register(EmWindow.SetPasswordWnd, PersonalCenterCtrl);
    this.register(EmWindow.InputPasswordWnd, PersonalCenterCtrl);
    this.register(EmWindow.TreasureMapWnd, TreasureMapCtrl);
    this.register(EmWindow.TreasureClaimMapWnd, TreasureMapCtrl);
    this.register(EmWindow.WarlordsFinalReportWnd, CommonCtrl, WarlordsModel); //众神之战战报
    this.register(EmWindow.WarlordRoomWnd, CommonCtrl, WarlordsModel, [
      EmPackName.BaseRoom,
    ]); //众神之战房间
    this.register(EmWindow.WarlordsBetSelectWnd, CommonCtrl, WarlordsModel); //众神之战欢乐竞猜人员选择界面
    this.register(EmWindow.WarlordsBetWnd, CommonCtrl, WarlordsModel); //众神之战欢乐竞猜界面
    this.register(EmWindow.WarlordsCheckRewardWnd, CommonCtrl, WarlordsModel); //众神之战奖励列表
    this.register(EmWindow.WarlordsMainWnd, CommonCtrl, WarlordsModel); //众神之战主界面入口
    this.register(EmWindow.WarlordsPrelimReportWnd, CommonCtrl, WarlordsModel); //众神之战预赛结果
    this.register(EmWindow.WarlordsWinPrizesWnd, CommonCtrl, WarlordsModel); //众神之战获奖名单
    this.register(EmWindow.PetLandDialogWnd, DialogCtrl); //英灵对话框
    this.register(EmWindow.MineralDialogWnd, DialogCtrl); //紫金矿产对话框
    this.register(EmWindow.MineralShopWnd, ShopControler); //紫晶商店
    this.register(EmWindow.WorldMapWnd, WorldMapCtrl); //世界地图
    this.register(EmWindow.ConsortiaElectionWnd, ConsortiaControler); //公会选举
    this.register(EmWindow.PlayerInfoWnd, PlayerInfoCtrl);
    this.register(EmWindow.PlayerProfileWnd, PlayerInfoCtrl);
    this.register(EmWindow.MyMountWnd, PlayerInfoCtrl);
    this.register(EmWindow.PlayerMountWnd, PlayerInfoCtrl);
    this.register(EmWindow.PlayerPetWnd, PlayerInfoCtrl);
    this.register(EmWindow.MyMasteryWnd, PlayerInfoCtrl);
    this.register(EmWindow.PlayerMasteryWnd, PlayerInfoCtrl);
    this.register(EmWindow.LookPlayerList, PlayerInfoCtrl);
    this.register(EmWindow.Hook, HookController); //修行神殿
    this.register(EmWindow.SinglePassWnd, CommonCtrl, SinglePassModel);
    this.register(EmWindow.SinglePassRankWnd, CommonCtrl, SinglePassModel);
    this.register(EmWindow.SinglepassResultWnd, CommonCtrl, SinglePassModel);
    this.register(EmWindow.MountInfoWnd, CommonCtrl);
    this.register(EmWindow.OuterCityResourceInfoWnd, CommonCtrl);
    this.register(EmWindow.CumulativeRechargeItemInfoWnd, CommonCtrl);
    this.register(EmWindow.LevelUp, CommonCtrl);
    this.register(EmWindow.ImprovePowerWnd, CommonCtrl);
    this.register(EmWindow.FightingDescribleWnd, CommonCtrl);
    this.register(EmWindow.FightingPetWnd, CommonCtrl);
    this.register(EmWindow.OuterCityShopWnd, OuterCityCtrl);
    this.register(EmWindow.BuyFrame2, CommonCtrl);
    this.register(EmWindow.ConsortiaSplitWnd, CommonCtrl);
    this.register(EmWindow.MountRefiningWnd, CommonCtrl);
    this.register(EmWindow.MiniGameWnd, CommonCtrl);
    this.register(EmWindow.GemMazeWnd, CommonCtrl);
    this.register(EmWindow.GemMazeRankWnd, CommonCtrl);
    this.register(EmWindow.CorssPvPCenterShowWnd, CommonCtrl);
    this.register(EmWindow.CrossPvPSuccessWnd, CommonCtrl);
    this.register(EmWindow.CrossPvPVoteWnd, CommonCtrl);
    this.register(EmWindow.ConsortiaBossWnd, ConsortiaControler);
    this.register(EmWindow.ConsortiaBossRewardWnd, ConsortiaControler);
    this.register(EmWindow.ConsortiaBossSceneWnd, ConsortiaControler);
    this.register(EmWindow.ConsortiaBossTaskView, ConsortiaControler);
    this.register(EmWindow.ConsortiaBossDialogWnd, ConsortiaControler);
    this.register(EmWindow.ChatAirBubbleWnd, CommonCtrl);
    this.register(EmWindow.LogWnd, CommonCtrl);
    this.register(EmWindow.StarSellSelectWnd, CommonCtrl);
    this.register(EmWindow.ShopCommWnd, CommonCtrl);
    this.register(EmWindow.SkillEditWnd, FightEditCtrl, SkillEditModel);
    this.register(EmWindow.SkillEditSelectWnd, FightEditCtrl, SkillEditModel);
    this.register(EmWindow.SkillEditPetWnd, FightEditCtrl, SkillEditModel);
    this.register(EmWindow.ConsortiaTreasureWnd, ConsortiaControler);
    this.register(EmWindow.OuterCityTreasureCDAlertWnd, CommonCtrl);
    this.register(EmWindow.OuterCityTreasureCDWnd, CommonCtrl);
    this.register(EmWindow.OuterCityTreasureWnd, CommonCtrl);
    this.register(EmWindow.RuneCarveWnd, SkillWndCtrl);
    this.register(EmWindow.RuneGemWnd, SkillWndCtrl);
    this.register(EmWindow.RuneHoldEquipWnd, SkillWndCtrl);
    this.register(EmWindow.StarSellSelectWnd, CommonCtrl);
    this.register(EmWindow.PetCampaignWnd, CommonCtrl);
    this.register(EmWindow.PetGetRewardWnd, CommonCtrl);
    this.register(EmWindow.PetCampaignResultWnd, CommonCtrl);
    this.register(EmWindow.PawnLevelUp, CommonCtrl);
    this.register(EmWindow.CasernRecruitWnd, CommonCtrl);
    this.register(EmWindow.LogWnd, CommonCtrl);
    this.register(EmWindow.ShopCommWnd, CommonCtrl);
    this.register(EmWindow.MountShareWnd, CommonCtrl);
    this.register(EmWindow.EvaluationWnd, CommonCtrl);
    this.register(EmWindow.MicroAppWnd, CommonCtrl);
    this.register(EmWindow.FaceSlappingWnd, CommonCtrl);
    this.register(EmWindow.DiscountWnd, CommonCtrl);
    this.register(EmWindow.GoldenSheepBoxWnd, CommonCtrl);
    this.register(EmWindow.GoldenSheepWnd, CommonCtrl);
    this.register(EmWindow.TurntableWnd, CommonCtrl);
    this.register(EmWindow.TurntableRewardRecord, CommonCtrl);
    this.register(EmWindow.ChooseDiceWnd, CommonCtrl);
    this.register(EmWindow.MonopolyResultWnd, CommonCtrl);
    this.register(EmWindow.MonopolyFinishWnd, CommonCtrl);
    this.register(EmWindow.WearySupplyWnd, CommonCtrl);

    this.register(EmWindow.RemotePetChallengeWnd, CommonCtrl);
    this.register(EmWindow.RemoteMopupWnd, CommonCtrl);
    this.register(EmWindow.RemotePetOrderWnd, CommonCtrl);
    this.register(EmWindow.RemotePetSkillLevelUp, CommonCtrl);
    this.register(EmWindow.RingTaskRewardWnd, CommonCtrl);
    this.register(EmWindow.AutoWalkWnd, CommonCtrl);
    this.register(EmWindow.PetFirstSelectWnd, CommonCtrl);

    this.register(EmWindow.QQDawankaWnd, CommonCtrl, QQDawankaModel); //QQ大厅大玩咖
    this.register(EmWindow.QQGiftWnd, CommonCtrl, QQGiftModel); //QQ大厅大玩咖

    this.register(EmWindow.OutyardBlessWnd, CommonCtrl, OutyardModel);
    this.register(EmWindow.OutyardChangeWnd, CommonCtrl, OutyardModel);
    this.register(EmWindow.OutyardFigureWnd, CommonCtrl, OutyardModel);
    this.register(EmWindow.OutyardMemberWnd, CommonCtrl, OutyardModel);
    this.register(EmWindow.OutyardNoticeWnd, CommonCtrl, OutyardModel);
    this.register(EmWindow.OutyardOpenWnd, CommonCtrl, OutyardModel);
    this.register(EmWindow.OutyardRewardWnd, CommonCtrl, OutyardModel);
    this.register(EmWindow.OutyardRewardAlertWnd, CommonCtrl, OutyardModel);

    this.register(EmWindow.PvpRewardsWnd, CommonCtrl);
    this.register(EmWindow.PvpPreviewWnd, CommonCtrl);
    this.register(EmWindow.PvpRoomResultWnd, CommonCtrl);

    this.register(EmWindow.BattleSettingWnd, CommonCtrl);

    this.register(EmWindow.ColosseumRewardsWnd, CommonCtrl);
    this.register(EmWindow.OutyardBuyEnergyWnd, CommonCtrl);

    this.register(EmWindow.Carnival, CarnivalCtrl); //嘉年华
    this.register(EmWindow.AirGardenGameSuDuWnd, CarnivalCtrl); //数独
    this.register(EmWindow.AirGardenGameLLK, CarnivalCtrl); //连连看
    this.register(EmWindow.AirGardenGameMemoryCard, CarnivalCtrl); //记忆翻牌
    this.register(EmWindow.BindVertifyWnd, CommonCtrl);
    this.register(EmWindow.OutyardBattleRecordWnd, CommonCtrl);
    this.register(EmWindow.PreviewGoodsWnd, CommonCtrl);
    this.register(EmWindow.PreviewBoxWnd, CommonCtrl);
    this.register(EmWindow.WishPoolResultWnd, CommonCtrl);
    this.register(EmWindow.RemotePetWnd, CommonCtrl);
    this.register(EmWindow.OuterCityMapWnd, WorldMapCtrl); //世界地图
    this.register(EmWindow.FunOpenWnd, CommonCtrl);
    this.register(EmWindow.OuterCityMapTreasureTips, CommonCtrl);
    this.register(EmWindow.OuterCityMapMineTips, CommonCtrl);
    this.register(EmWindow.OuterCityMapCastleTips, CommonCtrl);
    this.register(EmWindow.OutercityGoldMineWnd, CommonCtrl);
    this.register(EmWindow.OuterCityMapBossTips, CommonCtrl);
    this.register(EmWindow.ExpBackWnd, ExpBackCtr, ExpBackModel);
    this.register(EmWindow.OuterCityBossInfoWnd, CommonCtrl);
    this.register(EmWindow.CasernWnd, AllocateCtrl, ArmyModel);
    //市场
    this.register(EmWindow.MarketWnd, MarketCtrl);
    this.register(EmWindow.MarketBuyWnd, CommonCtrl);
    this.register(EmWindow.MarketSellWnd, CommonCtrl);
    this.register(EmWindow.OuterCityWarWnd, OuterCityWarCtrl);
    this.register(EmWindow.OuterCityWarDefencerBuildWnd, CommonCtrl);
    this.register(EmWindow.OuterCityWarAttackerBuildWnd, CommonCtrl);
    this.register(EmWindow.OuterCityWarDefenceSettingWnd, CommonCtrl);
    this.register(EmWindow.OuterCityWarEnterWarSettingWnd, CommonCtrl);
    this.register(EmWindow.OuterCityWarNoticeWnd, CommonCtrl);
    this.register(EmWindow.ArtifactResetWnd, PetCtrl);
    this.register(EmWindow.HeadIconModifyWnd, HeadIconCtr, HeadIconModel);
    this.register(EmWindow.QuickOpenFrameWnd, CommonCtrl);
    this.register(EmWindow.DebugHelpWnd, CommonCtrl);
    this.register(EmWindow.OuterCityVehicleTips, CommonCtrl);
    this.register(EmWindow.OuterCityVehicleInfoWnd, CommonCtrl);
    this.register(EmWindow.ConsortiaInfoChange, ConsortiaControler);
    this.register(EmWindow.PveSecretWnd, PveSecretCtrl, PveSecretData);
    this.register(
      EmWindow.PveSecretSceneWnd,
      PveSecretSceneCtrl,
      PveSecretSceneData
    );
    this.register(EmWindow.ConsortiaTaskWnd, CommonCtrl);

    this.register(EmWindow.UpgradeAccountWnd, CommonCtrl); //升级账号
    this.register(EmWindow.ActivityTimeWnd, CommonCtrl); //活动日程
    this.register(EmWindow.ConsortiaPrayWnd, ConsortiaControler);
    this.register(EmWindow.CastleBuildInfoWnd, CommonCtrl);
    this.register(EmWindow.SevenGoalsWnd, CommonCtrl); //七日目标
  }

  /**
   * @param moduleName 模块名称
   * @param framData   传入界面的额外数据
   * @param isSwitch  开关切换
   */
  public open(
    moduleName: EmWindow,
    framData: any = null,
    isSwitch: boolean = false,
    exitModuleName: EmWindow = null
  ) {
    if (
      moduleName == EmWindow.Pet ||
      moduleName == EmWindow.RemotePetWnd ||
      moduleName == EmWindow.PetChallenge
    ) {
      if (PetModel.checkSamePetType()) {
        return;
      }
    }
    moduleName = SiteZoneUICtrl.Instance.getDifferEmWindow(
      moduleName
    ) as EmWindow;

    let frameInfo: FrameCtrlInfo = this._frameInfoDic.get(moduleName);
    if (!frameInfo) {
      Logger.warn("[FrameCtrlManager]open  can't find moduleInfo", moduleName);
      return;
    }

    this.curOpeningModuleMap.set(moduleName, true);
    frameInfo.moduleName = moduleName;
    frameInfo.frameData = framData;
    let controller: FrameCtrlBase = this.getCtrl(moduleName);
    if (!controller) {
      Logger.warn("[FrameCtrlManager]open  can't find controller:", moduleName);
    }

    let exitController: FrameCtrlBase = this.getCtrl(exitModuleName);
    if (exitController) {
      exitController.exit();
    }

    if (this.isOpen(moduleName)) {
      if (isSwitch) {
        controller.exit();
      }
    } else {
      controller.open(frameInfo);
    }
  }

  /**
   *
   * @param moduleName 模块名称
   * @param nextModule 关闭自身 打开的另外一个界面名称
   * @param nextInfo
   */
  public exit(
    moduleName: EmWindow,
    nextModule?: EmWindow,
    nextInfo?: FrameCtrlInfo
  ) {
    moduleName = SiteZoneUICtrl.Instance.getDifferEmWindow(
      moduleName
    ) as EmWindow;

    let controller: FrameCtrlBase = this.getCtrl(moduleName);
    if (!controller) {
      Logger.warn("[FrameCtrlManager]exit  can't find controller:", moduleName);
    }
    if (this.isOpen(moduleName)) {
      controller.exit(nextModule, nextInfo);
    }
  }

  /**关闭所有模块 */
  public exitAll() {
    for (let key in this._frameControllerDic) {
      if (Object.prototype.hasOwnProperty.call(this._frameControllerDic, key)) {
        let frameCtrl = this._frameControllerDic.get(key);
        if (this.isOpen(frameCtrl.moduleName)) {
          frameCtrl.exit();
        }
      }
    }
  }

  /**
   *
   * @param moduleName
   * @param ctrlCls
   * @param dataCls
   * @param resList 额外的资源
   * @param frameData
   */
  public register(
    moduleName: EmWindow,
    ctrlCls: { new (): FrameCtrlBase },
    dataCls?: { new (): FrameDataBase },
    resList?: any[],
    frameData?: Record<string, any>
  ) {
    let ctrl = this.getCtrl(moduleName);
    if (!ctrl) {
      ctrl = new ctrlCls();
      if (dataCls) {
        ctrl.data = new dataCls();
      }
      this._frameControllerDic.set(moduleName, ctrl);
      this.registerFrameInfo(moduleName, resList, frameData);
    }
  }

  private registerFrameInfo(
    moduleName: EmWindow,
    resList: any[],
    frameData?: Record<string, any>
  ) {
    let info: FrameCtrlInfo = this._frameInfoDic.get(
      moduleName
    ) as FrameCtrlInfo;
    if (!info) {
      info = new FrameCtrlInfo();
      info.resList = resList;
      info.moduleName = moduleName;
      info.frameData = frameData;
      this._frameInfoDic.set(moduleName, info);
    }
  }

  public setNextFrame(
    moduleName: EmWindow,
    nextModuleName: EmWindow,
    nextInfo?: any
  ) {
    let ctrl = this.getCtrl(moduleName);
    if (ctrl) {
      ctrl.setNextFrame(nextModuleName, nextInfo);
    }
  }

  private __returnToWin(
    typeWin: EmWindow,
    returnToWin: EmWindow,
    returnToWinFrameData: any
  ) {
    if (!typeWin) {
      Logger.warn("[FrameCtrlManager]typeWin=null");
      return;
    }
    this.exit(typeWin, returnToWin, returnToWinFrameData);
  }

  /**
   * 检查窗口是否打开
   */
  public isOpen(moduleName: EmWindow): boolean {
    if (!moduleName) return false;

    let ctrl = this.getCtrl(moduleName);
    let frame;
    if (ctrl) {
      frame = this.getCtrl(moduleName).view;
    }
    return frame && frame.stage && frame.visible && frame.parent;
  }

  public getCtrl(moduleName: EmWindow): FrameCtrlBase {
    return this._frameControllerDic.get(moduleName);
  }

  public getFrameInfo(moduleName: EmWindow): FrameCtrlInfo {
    return this._frameInfoDic.get(moduleName);
  }
}
