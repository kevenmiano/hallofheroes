import TipsItem from "../../core/ui/Base/Tips";
import { EmLayer } from "../../core/ui/ViewInterface";
import MessageLabel from "../component/MessageLabel";
import { SimpleAlertWnd } from "../component/SimpleAlertHelper";
import BattleFallGoodsWnd from "../map/campaign/view/fall/BattleFallGoodsWnd";
import MineralDialogWnd from "../map/campaign/view/frame/MineralDialogWnd";
import PetLandDialogWnd from "../map/campaign/view/frame/PetLandDialogWnd";
import AllocateWnd from "../module/allocate/AllocateWnd";
import CasernRecruitWnd from "../module/allocate/CasernRecruitWnd";
import CasernWnd from "../module/allocate/CasernWnd";
import ConfigSoliderWnd from "../module/allocate/ConfigSoliderWnd";
import { PawnLevelUpWnd } from "../module/allocate/PawnLevelUpWnd";
import PawnSpecialAbilityWnd from "../module/allocate/PawnSpecialAbilityWnd";
import SeveranceSoliderWnd from "../module/allocate/SeveranceSoliderWnd";
import SoliderInfoTipWnd from "../module/allocate/SoliderInfoTipWnd";
import SoliderSkillTipWnd from "../module/allocate/SoliderSkillTipWnd";
import SpecialSelecteWnd from "../module/allocate/SpecialSelecteWnd";
import SpecialSwitchWnd from "../module/allocate/SpecialSwitchWnd";
import AnnounceWnd from "../module/announce/AnnounceWnd";
import AppellGetTips from "../module/appell/AppellGetTips";
import AppellWnd from "../module/appell/AppellWnd";
import TeamFormationWnd from "../module/army/teamFormation/TeamFormationWnd";
import { BagWnd } from "../module/bag/view/BagWnd";
import { BatchUseConfirmWnd } from "../module/bag/view/BatchUseConfirmWnd";
import { HeadIconModifyWnd } from "../module/bag/view/HeadIconModifyWnd";
import { RenameWnd } from "../module/bag/view/RenameWnd";
import { SaleConfirmWnd } from "../module/bag/view/SaleConfirmWnd";
import { SplitConfirmWnd } from "../module/bag/view/SplitConfirmWnd";
import BattleFailedSimpleWnd from "../module/battle/BattleFailedSimpleWnd";
import BattleFailedWnd from "../module/battle/BattleFailedWnd";
import BattleVictorySimpleWnd from "../module/battle/BattleVictorySimpleWnd";
import BattleVictoryWnd from "../module/battle/BattleVictoryWnd";
import BattleWnd from "../module/battle/BattleWnd";
import CampaignResultWnd from "../module/campaignResult/CampaignResultWnd";
import CrystalWnd from "../module/castle/CrystalWnd";
import DepotWnd from "../module/castle/DepotWnd";
import PoliticsFrameWnd from "../module/castle/PoliticsFrameWnd";
import ResidenceFrameWnd from "../module/castle/ResidenceFrameWnd";
import SeminaryUpWnd from "../module/castle/SeminaryUpWnd";
import SeminaryWnd from "../module/castle/SeminaryWnd";
import ChatBugleWnd from "../module/chat/ChatBugleWnd";
import ChatFaceWnd from "../module/chat/ChatFaceWnd";
import ChatItemMenu from "../module/chat/ChatItemMenu";
import ChatWnd from "../module/chat/ChatWnd";
import ChestFrameWnd from "../module/chestFrame/ChestFrameWnd";
import FightingUpdateWnd from "../module/common/FightingUpdateWnd";
import HelpWnd from "../module/common/HelpWnd";
import ShopCommWnd from "../module/common/ShopCommWnd";
import { ConsortiaStorageWnd } from "../module/consortia/view/building/ConsortiaStorageWnd";
import { ConsortiaDevilWnd } from "../module/consortia/view/chairman/ConsortiaDevilWnd";
import { ConsortiaPermissionWnd } from "../module/consortia/view/chairman/ConsortiaPermissionWnd";
import { ConsortiaRecruitMemberWnd } from "../module/consortia/view/chairman/ConsortiaRecruitMemberWnd";
import { ConsortiaRenameWnd } from "../module/consortia/view/chairman/ConsortiaRenameWnd";
import { ConsortiaTransferWnd } from "../module/consortia/view/chairman/ConsortiaTransferWnd";
import { ConsortiaUpgradeWnd } from "../module/consortia/view/chairman/ConsortiaUpgradeWnd";
import { ConsortiaEmailMemberWnd } from "../module/consortia/view/chairman/email/ConsortiaEmailMemberWnd";
import { ConsortiaEmailWnd } from "../module/consortia/view/chairman/email/ConsortiaEmailWnd";
import ConsortiaPlayerMenu from "../module/consortia/view/component/ConsortiaPlayerMenu";
import ConsortiaAltarWnd from "../module/consortia/view/ConsortiaAltarWnd";
import { ConsortiaApplyWnd } from "../module/consortia/view/ConsortiaApplyWnd";
import { ConsortiaAuditingWnd } from "../module/consortia/view/ConsortiaAuditingWnd";
import { ConsortiaContributeWnd } from "../module/consortia/view/ConsortiaContributeWnd";
import { ConsortiaCreateWnd } from "../module/consortia/view/ConsortiaCreateWnd";
import { ConsortiaEventWnd } from "../module/consortia/view/ConsortiaEventWnd";
import { ConsortiaInfoWnd } from "../module/consortia/view/ConsortiaInfoWnd";
import ConsortiaPrizeAllotWnd from "../module/consortia/view/ConsortiaPrizeAllotWnd";
import { ConsortiaRankWnd } from "../module/consortia/view/ConsortiaRankWnd";
import ConsortiaSecretInfoWnd from "../module/consortia/view/ConsortiaSecretInfoWnd";
import { ConsortiaSkillTowerWnd } from "../module/consortia/view/ConsortiaSkillTowerWnd";
import { ConsortiaTreasureBoxWnd } from "../module/consortia/view/ConsortiaTreasureBoxWnd";
import { ConsortiaWnd } from "../module/consortia/view/ConsortiaWnd";
import { GvgAddMembersWnd } from "../module/consortia/view/GvgAddMembersWnd";
import { GvgBattleWnd } from "../module/consortia/view/GvgBattleWnd";
import { GvgEnterWarWnd } from "../module/consortia/view/GvgEnterWarWnd";
import { GvgRankListWnd } from "../module/consortia/view/GvgRankListWnd";
import { GvgRiverWnd } from "../module/consortia/view/GvgRiverWnd";
import VipCoolDownFrameWnd from "../module/cooldowm/VipCoolDownFrameWnd";
import DialogWnd from "../module/dialog/DialogWnd";
import { SpaceDialogWnd } from "../module/dialog/SpaceDialogWnd";
import DisplayItemsWnd from "../module/displayItems/DisplayItemsWnd";
import FarmBagTipWnd from "../module/farm/view/FarmBagTipWnd";
import FarmEventWnd from "../module/farm/view/FarmEventWnd";
import { FarmLandMenuWnd } from "../module/farm/view/FarmLandMenuWnd";
import FarmLandUpWnd from "../module/farm/view/FarmLandUpWnd";
import { FarmPetSelectWnd } from "../module/farm/view/FarmPetSelectWnd";
import FarmShopWnd from "../module/farm/view/FarmShopWnd";
import FarmWnd from "../module/farm/view/FarmWnd";
import FirstPayWnd from "../module/firstpay/FirstPayWnd";
import ForgeWnd from "../module/forge/ForgeWnd";
import { AddFriendsWnd } from "../module/friend/view/AddFriendsWnd";
import { FriendInviteWnd } from "../module/friend/view/FriendInviteWnd";
import { FriendWnd } from "../module/friend/view/FriendWnd";
import FunnyWnd from "../module/funny/view/FunnyWnd";
import BuyHpWnd from "../module/home/BuyHpWnd";
import CampaignMapWnd from "../module/home/CampaignMapWnd";
import HomeWnd from "../module/home/HomeWnd";
import SmallMapWnd from "../module/home/SmallMapWnd";
import SpaceTaskInfoWnd from "../module/home/SpaceTaskInfoWnd";
import JoyStickWnd from "../module/joystick/JoyStickWnd";
import LevelUpWnd from "../module/levelup/LevelUpWnd";
import { LoadingWnd } from "../module/loading/LoadingWnd";
import DebugLoginWnd from "../module/login/view/DebugLoginWnd";
import LoginWnd from "../module/login/view/LoginWnd";
import ServerlistWnd from "../module/login/view/ServerlistWnd";
import AddFriendWnd from "../module/mail/AddFriendWnd";
import MailWnd from "../module/mail/MailWnd";
import WriteMailWnd from "../module/mail/WriteMailWnd";
import MazeFrameWnd from "../module/maze/MazeFrameWnd";
import MazeRankWnd from "../module/maze/MazeRankWnd";
import MazeRiverWnd from "../module/maze/MazeRiverWnd";
import MazeShopWnd from "../module/maze/MazeShopWnd";
import MazeViewWnd from "../module/maze/MazeViewWnd";
import MineralShopWnd from "../module/mineral/MineralShopWnd";
import MopupWnd from "../module/mopup/MopupWnd";
import MountsWnd from "../module/mount/MountsWnd";
import TodayNotAlertWnd from "../module/mount/TodayNotAlertWnd";
import WildSoulWnd from "../module/mount/WildSoulWnd";
import OfferRewardWnd from "../module/offerReward/OfferRewardWnd";
import PetPotencyWnd from "../module/pet/view/PetPotencyWnd";
import { PetRenameWnd } from "../module/pet/view/PetRenameWnd";
import { PetSelectWnd } from "../module/pet/view/PetSelectWnd";
import PetWnd from "../module/pet/view/PetWnd";
import QuestionNaireWnd from "../module/questionnaire/QuestionNaireWnd";
import QuestionWnd from "../module/questionnaire/QuestionWnd";
import RankWnd from "../module/rank/RankWnd";
import RvrBattleGetResourceWnd from "../module/rvrBattle/RvrBattleGetResourceWnd";
import RvrBattleMapRightWnd from "../module/rvrBattle/RvrBattleMapRightWnd";
import RvrBattleMapTopCenterWnd from "../module/rvrBattle/RvrBattleMapTopCenterWnd";
import RvrBattlePlayerRiverWnd from "../module/rvrBattle/RvrBattlePlayerRiverWnd";
import RvrBattleResultWnd from "../module/rvrBattle/RvrBattleResultWnd";
import RvrBattleWnd from "../module/rvrBattle/RvrBattleWnd";
import SettingWnd from "../module/setting/SettingWnd";
import { BuyFrameI } from "../module/shop/view/BuyFrameI";
import { ShopWnd } from "../module/shop/view/ShopWnd";
import RunesUpgradeWnd from "../module/skill/RunesUpgradeWnd";
import SkillWnd from "../module/skill/SkillWnd";
import SortWnd from "../module/sort/SortWnd";
import WarlordsWnd from "../module/sort/WarlordsWnd";
import StarBagWnd from "../module/star/StarBagWnd";
import StarOperateWnd from "../module/star/StarOperateWnd";
import StarWnd from "../module/star/StarWnd";
import TaskWnd from "../module/task/TaskWnd";
import TestFigureWnd from "../module/test/TestFigureWnd";
import TrailDialogWnd from "../module/trailMap/TrailDialogWnd";
import TrialMapShopWnd from "../module/trailMap/TrailMapShopWnd";
import TrailMapWnd from "../module/trailMap/TrailMapWnd";
import VipPrivilegeWnd from "../module/vip/VipPrivilegeWnd";
import WarlordRoomWnd from "../module/warlords/view/WarlordRoomWnd";
import WarlordsBetSelectWnd from "../module/warlords/view/WarlordsBetSelectWnd";
import WarlordsBetWnd from "../module/warlords/view/WarlordsBetWnd";
import WarlordsCheckRewardWnd from "../module/warlords/view/WarlordsCheckRewardWnd";
import WarlordsFinalReportWnd from "../module/warlords/view/WarlordsFinalReportWnd";
import WarlordsMainWnd from "../module/warlords/view/WarlordsMainWnd";
import WarlordsPrelimReportWnd from "../module/warlords/view/WarlordsPrelimReportWnd";
import WarlordsWinPrizesWnd from "../module/warlords/view/WarlordsWinPrizesWnd";
import WelfareWnd from "../module/welfare/WelfareWnd";
import WorldBossSceneWnd from "../module/worldboss/view/WorldBossSceneWnd";
import WorldBossRiverWnd from "../module/worldboss/view/WorldBossRiverWnd";
import BeingInviteWnd from "../room/room/invite/BeingInviteWnd";
import InviteWnd from "../room/room/invite/InviteWnd";
import QuickInviteWnd from "../room/room/invite/QuickInviteWnd";
import RoomHallWnd from "../room/room/roomHall/RoomHallWnd";
import RoomListWnd from "../room/room/roomList/RoomListWnd";
import RoomPwdWnd from "../room/room/roomList/RoomPwdWnd";
import Appelltips from "../tips/Appelltips";
import { BattleGuardItemTips } from "../tips/BattleGuardItemTips";
import { CommonTips } from "../tips/CommonTips";
import { ComposeTip } from "../tips/ComposeTip";
import { EquipContrastTips } from "../tips/EquipContrastTips";
import { EquipTip } from "../tips/EquipTip";
import { GvgBufferTips } from "../tips/GvgBufferTips";
import { MountCardTip } from "../tips/MountCardTip";
import { MountTips } from "../tips/MountTips";
import { PropTips } from "../tips/PropTips";
import { RuneTip } from "../tips/RuneTip";
import SkillTips from "../tips/SkillTips";
import { StarPowerTip } from "../tips/StarPowerTip";
import { StarTips } from "../tips/StarTips";
import IconAlertHelperWnd from "../utils/IconAlertHelperWnd";
import PersonalCenterWnd from "../module/personalCenter/PersonalCenterWnd";
import PetChallengeConfirmWnd from "../module/petChallenge/PetChallengeConfirmWnd";
import PetChallengeEventWnd from "../module/petChallenge/PetChallengeEventWnd";
import PetChallengeRankWnd from "../module/petChallenge/PetChallengeRankWnd";
import PetChallengeRewardWnd from "../module/petChallenge/PetChallengeRewardWnd";
import PetChallengeWnd from "../module/petChallenge/PetChallengeWnd";
import { PetTip } from "../tips/PetTip";
import { PetExchangeShopWnd } from "../module/shop/view/PetExchangeShopWnd";
import { TransferBuildWnd } from "../module/castle/TransferBuildWnd";
import { WorldMapWnd } from "../module/outercity/view/WorldMapWnd";
import TreasureMapWnd from "../module/treasuremap/view/TreasureMapWnd";
import TreasureClaimMapWnd from "../module/treasuremap/view/TreasureClaimMapWnd";
import BufferTips from "../tips/BufferTips";
import ConsortiaElectionWnd from "../module/consortia/view/ConsortiaElectionWnd";
import { SinglePassWnd } from "../module/singlepass/SinglePassWnd";
import { PlayerInfoWnd } from "../module/playerinfo/PlayerInfoWnd";
import { PlayerProfileWnd } from "../module/playerinfo/PlayerProfileWnd";
import { MyMountWnd } from "../module/playerinfo/MyMountWnd";
import { PlayerMountWnd } from "../module/playerinfo/PlayerMountWnd";
import { MyPetWnd } from "../module/playerinfo/MyPetWnd";
import { PlayerPetWnd } from "../module/playerinfo/PlayerPetWnd";
import LookPlayerList from "../module/playerinfo/LookPlayerList";
import { OuterCityOperateMenu } from "../module/outercity/view/OuterCityOperateMenu";
import HookWnd from "../module/hook/HookWnd";
import SinglePassRankWnd from "../module/singlepass/SinglePassRankWnd";
import { ForgeEquipTip } from "../tips/ForgeEquipTip";
import { ForgePropTip } from "../tips/ForgePropTip";
import { QuantitySelector } from "../module/common/QuantitySelector";
import { OuterCityTransmitWnd } from "../module/outercity/view/OuterCityTransmitWnd";
import { OuterCityFieldInfoWnd } from "../module/outercity/view/OuterCityFieldInfoWnd";
import { OuterCityCastleTips } from "../module/outercity/view/OuterCityCastleTips";
import { OuterCityCastleInfoWnd } from "../module/outercity/view/OuterCityCastleInfoWnd";
import SinglePassBugleWnd from "../module/singlepass/SinglePassBugleWnd";
import SinglepassResultWnd from "../module/singlepass/SinglepassResultWnd";
import { OuterCityFieldTips } from "../module/outercity/view/OuterCityFieldTips";
import { OuterCityArmyTips } from "../module/outercity/view/OuterCityArmyTips";
import ExchangeWnd from "../module/funny/view/ExchangeWnd";
import MountInfoWnd from "../module/mount/MountInfoWnd";
import CheckMailWnd from "../module/personalCenter/mailcheck/CheckMailWnd";
import ChangePasswordWnd from "../module/personalCenter/password/ChangePasswordWnd";
import SetPasswordWnd from "../module/personalCenter/password/SetPasswordWnd";
import InputPasswordWnd from "../module/personalCenter/password/InputPasswordWnd";
import SuggestWnd from "../module/personalCenter/mailcheck/SuggestWnd";
import SendFlowerWnd from "../module/chat/SendFlowerWnd";
import ReceiveFlowerWnd from "../module/chat/ReceiveFlowerWnd";
import OuterCityResourceInfoWnd from "../module/castle/OuterCityResourceInfoWnd";
import PotionBufferTips from "../tips/PotionBufferTips";
import { CrystalTips } from "../tips/CrystalTips";
import UseGoodsAlert from "../utils/UseGoodsAlert";
import MapNameMovieWnd from "../module/mapNameMovie/MapNameMovieWnd";
import { HintWnd } from "../module/common/HintWnd";
import CustomerServiceWnd from "../module/personalCenter/mailcheck/CustomerServiceWnd";
import PveRoomListWnd from "../room/room/roomList/pve/PveRoomListWnd";
import FindRoomWnd from "../room/room/roomList/FindRoomWnd";
import CumulativeRechargeItemInfoWnd from "../module/funny/view/CumulativeRechargeItemInfoWnd";
import FightingDescribleWnd from "../module/home/TaskTraceTip/FightingDescribleWnd";
import FightingPetWnd from "../module/home/TaskTraceTip/FightingPetWnd";
import BuyGoodsAlert from "../utils/BuyGoodsAlert";
import AllocateFormationWnd from "../module/allocate/AllocateFormationWnd";
import BattleBuffDetailInfoWnd from "../module/battle/BattleBuffDetailInfoWnd";
import ServiceReplyWnd from "../module/personalCenter/customer/ServiceReplyWnd";
import ExpBackShowTipsWnd from "../module/welfare/view/component/ExpBackShowTipsWnd";
import OuterCityShopWnd from "../module/outercityshop/OuterCityShopWnd";
import { BuyFrame2 } from "../module/outercityshop/view/BuyFrame2";
import ConsortiaSplitWnd from "../module/consortia/view/building/ConsortiaSplitWnd";
import MountRefiningWnd from "../module/mount/MountRefiningWnd";
import PlayerDescribeWnd from "../module/home/PlayerDescribeWnd";
import SpacePKAlert from "../map/space/view/SpacePKAlert";
import CrossPvPSuccessWnd from "../module/crosspvp/CrossPvPSuccessWnd";
import CorssPvPCenterShowWnd from "../module/crosspvp/CorssPvPCenterShowWnd";
import CrossPvPVoteWnd from "../module/crosspvp/CrossPvPVoteWnd";
import RvrBattleMapCombatWnd from "../module/rvrBattle/RvrBattleMapCombatWnd";
import MiniGameWnd from "../module/gemMaze/view/MiniGameWnd";
import GemMazeWnd from "../module/gemMaze/view/GemMazeWnd";
import GemMazeRankWnd from "../module/gemMaze/view/GemMazeRankWnd";
import { AppellPowerTip } from "../tips/AppellPowerTip";
import ShortCutSetWnd from "../module/personalCenter/shortCut/ShortCutSetWnd";
import PassAdvanceWnd from "../module/welfare/view/pass/PassAdvanceWnd";
import PassBuyWnd from "../module/welfare/view/pass/PassBuyWnd";
import PassRewardWnd from "../module/welfare/view/pass/PassRewardWnd";
import GemMazeBagWnd from "../module/gemMaze/view/GemMazeBagWnd";
import ConsortiaBossWnd from "../module/consortia/view/ConsortiaBossWnd";
import ConsortiaBossRewardWnd from "../module/consortia/view/ConsortiaBossRewardWnd";
import ConsortiaBossTaskView from "../module/consortia/view/ConsortiaBossTaskView";
import ConsortiaBossSceneWnd from "../module/consortia/view/ConsortiaBossSceneWnd";
import ConsortiaBossDialogWnd from "../map/campaign/view/frame/ConsortiaBossDialogWnd";
import MemToolWnd from "../module/memTool/MemToolWnd";
import ChatAirBubbleWnd from "../module/chatairbubble/ChatAirBubbleWnd";
import PetGuardWnd from "../module/petguard/PetGuardWnd";
import PetGuardTipWnd from "../module/petguard/PetGuardTipWnd";
import LogWnd from "../module/log/LogWnd";
import OfficialAccountWnd from "../module/personalCenter/OfficialAccountWnd";
import RegisterSWnd from "../module/login/view/RegisterSWnd";
import SkillEditWnd from "../module/fightEdit/view/SkillEditWnd";
import SkillEditSelectWnd from "../module/fightEdit/view/SkillEditSelectWnd";
import SkillEditPetWnd from "../module/fightEdit/view/SkillEditPetWnd";
import ConsortiaTreasureWnd from "../module/consortia/view/ConsortiaTreasureWnd";
import OuterCityTreasureCDAlertWnd from "../map/outercity/OuterCityTreasureCDAlertWnd";
import OuterCityTreasureCDWnd from "../map/outercity/OuterCityTreasureCDWnd";
import OuterCityTreasureWnd from "../module/outercity/view/OuterCityTreasureWnd";
import MultiBoxSelectWnd from "../module/bag/view/MultiBoxSelectWnd";
import RuneCarveWnd from "../module/skill/runeGem/RuneCarveWnd";
import RuneGemUpgradeWnd from "../module/skill/runeGem/RuneGemUpgradeWnd";
import StarSellSelectWnd from "../module/star/StarSellSelectWnd";
import WaitingWnd from "../module/common/WaitingWnd";
import StatutoryAgeWnd from "../module/announce/StatutoryAgeWnd";
import PetCampaignWnd from "../module/petCampaign/PetCampaignWnd";
import PetGetRewardWnd from "../module/petCampaign/PetGetRewardWnd";
import ScreenWnd from "../module/pet/view/peteuip/ScreenWnd";
import RuneHoleHelpWnd from "../module/skill/runeGem/RuneHoleHelpWnd";
import PetCampaignResultWnd from "../module/petCampaign/PetCampaignResultWnd";
import ChatTranslateSetWnd from "../module/chat/ChatTranslateSetWnd";
import PetEuipTrainWnd from "../module/pet/view/peteuip/PetEuipTrainWnd";
import PetEquipStrenOkWnd from "../module/pet/view/peteuip/PetEquipStrenOkWnd";
import { PetEquipTip } from "../tips/PetEquipTip";
import GetGoodsAlert from "../utils/GetGoodsAlert";
import { PetEquipContrastTips } from "../tips/PetEquipContrastTips";
import MountShareWnd from "../module/mount/MountShareWnd";
import { EvaluationWnd } from "../module/evaluation/EvaluationWnd";
import MicroAppWnd from "../module/microapp/MicroAppWnd";
import FaceSlappingWnd from "../module/faceSlapping/FaceSlappingWnd";
import DiscountWnd from "../module/shop/view/DiscountWnd";
import { WeakNetWnd } from "../module/common/WeakNetWnd";
import GoldenSheepBoxWnd from "../module/goldensheep/GoldenSheepBoxWnd";
import GoldenSheepWnd from "../module/goldensheep/GoldenSheepWnd";
import HTMLWnd from "../module/login/view/HTMLWnd";
import MonopolyFinishWnd from "../module/monopoly/view/MonopolyFinishWnd";
import MonopolyResultWnd from "../module/monopoly/view/MonopolyResultWnd";
import { RemotePetReadyWnd } from "../module/remotepet/RemotePetReadyWnd";
import { RemotePetTurnWnd } from "../module/remotepet/RemotePetTurnWnd";
import ChooseDiceWnd from "../module/monopoly/view/ChooseDiceWnd";
import MonopolyDiceWnd from "../module/monopoly/view/MonopolyDiceWnd";
import WearySupplyWnd from "../module/wearySupply/WearySupplyWnd";
import { RemotePetChallengeWnd } from "../module/remotepet/RemotePetChallengeWnd";
import { RemoteMopupWnd } from "../module/remotepet/RemoteMopupWnd";
import { RemotePetOrderWnd } from "../module/remotepet/RemotePetOrderWnd";
import { RemotePetSkillLevelUp } from "../module/remotepet/view/RemotePetSkillLevelUp";
import { SRoleWnd } from "../module/sbag/SRoleWnd";
import { TattooBaptizeWnd } from "../module/sbag/tattoo/TattooBaptizeWnd";
import RingTaskRewardWnd from "../module/dialog/RingTaskRewardWnd";
import { FashionBonusWnd } from "../module/sbag/fashion/FashionBonusWnd";
import AutoWalkWnd from "../module/home/AutoWalkWnd";
import StarAutoSettingWnd from "../module/star/StarAutoSettingWnd";
import PetFirstSelectWnd from "../module/common/PetFirstSelectWnd";
import QQDawankaWnd from "../module/qqDawanka/QQDawankaWnd";
import ItemTips from "../tips/ItemTips";
import AvatarTips from "../tips/AvatarTips";
import QQGiftWnd from "../module/qqGift/QQGiftWnd";
import OutyardChangeWnd from "../module/outyard/OutyardChangeWnd";
import OutyardBlessWnd from "../module/outyard/OutyardBlessWnd";
import OutyardFigureWnd from "../module/outyard/OutyardFigureWnd";
import OutyardMemberWnd from "../module/outyard/OutyardMemberWnd";
import OutyardNoticeWnd from "../module/outyard/OutyardNoticeWnd";
import OutyardOpenWnd from "../module/outyard/OutyardOpenWnd";
import OutyardRewardWnd from "../module/outyard/OutyardRewardWnd";
import { SkillItemTips } from "../tips/SkillItemTips";
import { RuneItemTips } from "../tips/RuneItemTips";
import OutyardRewardAlertWnd from "../module/outyard/OutyardRewardAlertWnd";
import { GoldenTreePreviewWnd } from "../module/funny/view/GoldenTreePreviewWnd";
import { GoldenTreeRecordWnd } from "../module/funny/view/GoldenTreeRecordWnd";
import { BottleIntergalBoxTips } from "../module/funny/view/BottleIntergalBoxTips";
import { BottleBottomIntergalBoxTips } from "../module/funny/view/BottleBottomIntergalBoxTips";
import PvpRewardsWnd from "../room/room/roomList/PvpRewardsWnd";
import PvpPreviewWnd from "../room/room/roomList/PvpPreviewWnd";
import PvpRoomResultWnd from "../room/room/roomList/PvpRoomResultWnd";
import BattleSettingWnd from "../module/personalCenter/BattleSettingWnd";
import WorldBossWnd from "../module/worldboss/view/WorldBossWnd";
import { TalentItemTips } from "../tips/TalentItemTips";
import RuneHoldEquipWnd from "../module/skill/runeHold/RuneHoldEquipWnd";
import { FilterRuneWnd } from "../module/skill/runeHold/FilterRuneWnd";
import OutyardBuyEnergyWnd from "../module/outyard/OutyardBuyEnergyWnd";
import CarnivalWnd from "../module/carnival/CarnivalWnd";
import RuneGemWnd from "../module/skill/content/RuneGemWnd";
import AirGardenGameMemoryCardWnd from "../module/carnival/games/AirGardenGameMemoryCardWnd";
import AirGardenGameLLKWnd from "../module/carnival/games/AirGardenGameLlkWnd";
import BindVertifyWnd from "../module/welfare/BindVertifyWnd";
import { NewPropTips } from "../tips/NewPropTips";
import SiteZoneWnd from "../module/login/view/SiteZoneWnd";
import { RemotePetWnd } from "../module/remotepet/RemotePetWnd";
import { RemotePetAdjustWnd } from "../module/remotepet/RemotePetAdjustWnd";
import OutyardBattleRecordWnd from "../module/outyard/OutyardBattleRecordWnd";
import PreviewGoodsWnd from "../tips/PreviewGoodsWnd";
import PreviewBoxWnd from "../tips/PreviewBoxWnd";
import { PetChallengeAdjustWnd } from "../module/petChallenge/PetChallengeAdjustWnd";
import WishPoolResultWnd from "../module/shop/view/WishPoolResultWnd";
import ImprovePowerWnd from "../module/home/TaskTraceTip/ImprovePowerWnd";
import OuterCityMapWnd from "../module/outercity/view/OuterCityMapWnd";
import PetEquipSuccinctWnd from "../module/pet/view/peteuip/PetEquipSuccinctWnd";
import FunOpenWnd from "../module/funpreview/FunOpenWnd";
import OuterCityMapCastleTips from "../module/outercity/view/OuterCityMapCastleTips";
import OuterCityMapTreasureTips from "../module/outercity/view/OuterCityMapTreasureTips";
import OuterCityMapBossTips from "../module/outercity/view/OuterCityMapBossTips";
import OuterCityMapMineTips from "../module/outercity/view/OuterCityMapMineTips";
import OutercityGoldMineWnd from "../module/outercity/view/OutercityGoldMineWnd";
import { PropertyCompareTips } from "../tips/PropertyCompareTips";
import ExpBackWnd from "../module/expback/ExpBackWnd";
import { PetAttrTip } from "../module/pet/view/PetAttrTip";
import OuterCityBossInfoWnd from "../module/outercity/view/OuterCityBossInfoWnd";
import PetSkillTips from "../tips/PetSkillTips";
import LoginSettingWnd from "../module/login/view/LoginSettingWnd";
import { RecommendFriendWnd } from "../module/friend/view/RecommendFriendWnd";
import AirGardenGameSuDuWnd from "../module/carnival/games/AirGardenGameSuDuWnd";
import { PetSaveSureWnd } from "../module/pet/view/PetSaveSureWnd";
import { PetSaveWnd } from "../module/pet/view/PetSaveWnd";
import MarketBuyWnd from "../module/market/MarketBuyWnd";
import MarketSellWnd from "../module/market/MarketSellWnd";
import MarketWnd from "../module/market/MarketWnd";
import { TattooReinforceWnd } from "../module/sbag/tattoo/TattooReinforceWnd";
import OuterCityMapPlayerTips from "../module/outercity/view/OuterCityMapPlayerTips";
import OuterCityWarWnd from "../module/outercityWar/OuterCityWarWnd";
import OuterCityWarAttackerBuildWnd from "../module/outercityWar/OuterCityWarAttackerBuildWnd";
import OuterCityWarDefenceSettingWnd from "../module/outercityWar/OuterCityWarDefenceSettingWnd";
import OuterCityWarDefencerBuildWnd from "../module/outercityWar/OuterCityWarDefencerBuildWnd";
import OuterCityWarEnterWarSettingWnd from "../module/outercityWar/OuterCityWarEnterWarSettingWnd";
import OuterCityWarNoticeWnd from "../module/outercityWar/OuterCityWarNoticeWnd";
import ArtifactTips from "../tips/ArtifactTips";
import ArtifactResetWnd from "../module/pet/view/ArtifactResetWnd";
import { CommonTips2 } from "../tips/CommonTips2";
import BattleShortCutWnd from "../module/battle/BattleShortCutWnd";
import { QuickOpenFrameWnd } from "../module/debug/quickOpenFrame/QuickOpenFrameWnd";
import { DebugHelpWnd } from "../module/debug/help/DebugHelpWnd";
import OuterCityVehicleInfoWnd from "../module/outercity/view/OuterCityVehicleInfoWnd";
import OuterCityVehicleTips from "../module/outercity/view/OuterCityVehicleTips";
import PveCampaignWnd from "../module/pve/pveCampaign/PveCampaignWnd";
import PveMultiCampaignWnd from "../module/pve/pveMultiCampaign/PveMultiCampaignWnd";
import ColosseumEventWnd from "../module/pvp/colosseum/ColosseumEventWnd";
import MasterySoulWnd from "../module/sbag/mastery/MasterySoulWnd";
import { SecretBookTips } from "../tips/SecretBookTips";
import { SoulEquipTip } from "../tips/SoulEquipTip";
import ColosseumRankRewardWnd from "../module/pvp/colosseum/ColosseumRankRewardWnd";
import ColosseumRewardsWnd from "../module/pvp/colosseum/ColosseumRerewardsWnd";
import ColosseumWnd from "../module/pvp/colosseum/ColosseumWnd";
import PvpShopWnd from "../module/pvp/pvp/PvpShopWnd";
import PvpGateWnd from "../module/pvp/gate/PvpGateWnd";
import PveGateWnd from "../module/pve/gate/PveGateWnd";
import { MyMasteryWnd } from "../module/playerinfo/MyMasteryWnd";
import { PlayerMasteryWnd } from "../module/playerinfo/PlayerMasteryWnd";
import ConsortiaNewWnd from "../module/consortia/view/ConsortiaNewWnd";
import ConsortiaInfoChangeWnd from "../module/consortia/view/chairman/ConsortiaInfoChangeWnd";
import PveSecretWnd from "../module/pve/pveSecret/PveSecretWnd";
import PveSecretSceneWnd from "../module/pve/pveSecretScene/PveSecretSceneWnd";
import LoginWndOS from "../module/login/view/LoginWndOS";
import UpgradeAccountWnd from "../module/home/UpgradeAccountWnd";
import ActivityTimeWnd from "../module/activityTime/ActivityTimeWnd";
import LoginSettingWndOS from "../module/login/view/LoginSettingWndOS";
import { SecretTresureTip } from "../tips/SecretTresureTip";
import ConsortiaPrayWnd from "../module/consortia/view/ConsortiaPrayWnd";
import ConsortiaTaskWnd from "../module/consortia/view/task/ConsortiaTaskWnd";
import WearyTips from "../tips/WearyTips";
import CastleBuildInfoWnd from "../module/castle/CastleBuildInfoWnd";
import SevenGoalsWnd from "../module/sevengoals/SevenGoalsWnd";

export enum ResType {
  ZIP = "ZIP",
  ZIP_CONFIG = "ZIP_CONFIG" /*** ZIP_CONFIG 类型压缩包,加载完成后返回ZIP */,
  TEXT = "TEXT" /*** 文本类型,加载完成后返回文本。*/,
  JSON = "JSON" /*** JSON 类型,加载完成后返回json数据。 */,
  PREFAB = "PREFAB" /*** prefab 类型,加载完成后返回Prefab实例。*/,
  XML = "XML" /*** XML 类型,加载完成后返回domXML。*/,
  BUFFER = "BUFFER" /*** 二进制类型,加载完成后返回arraybuffer二进制数据。*/,
  IMAGE = "IMAGE" /*** 纹理类型,加载完成后返回Texture。*/,
  SOUND = "SOUND" /*** 声音类型,加载完成后返回sound。*/,
  ATLAS = "ATLAS" /*** 图集类型,加载完成后返回图集json信息(并创建图集内小图Texture)。*/,
  FONT = "FONT" /*** 位图字体类型,加载完成后返回BitmapFont,加载后,会根据文件名自动注册为位图字体。*/,
  TTF = "TTF" /*** TTF字体类型,加载完成后返回null。 */,
  PLF = "PLF" /*** 预加载文件类型,加载完成后自动解析到preLoadedMap。*/,
  PLFB = "PLFB" /*** 二进制预加载文件类型,加载完成后自动解析到preLoadedMap。*/,
  HIERARCHY = "HIERARCHY" /** * Hierarchy资源。*/,
  MESH = "MESH" /*** Mesh资源。*/,
  MATERIAL = "MATERIAL" /** * Material资源。*/,
  TEXTURE2D = "TEXTURE2D" /*** Texture2D资源。*/,
  TEXTURECUBE = "TEXTURECUBE" /*** TextureCube资源。*/,
  ANIMATIONCLIP = "ANIMATIONCLIP" /*** AnimationClip资源。*/,
  AVATAR = "AVATAR" /*** Avatar资源。*/,
  TERRAINHEIGHTDATA = "TERRAINHEIGHTDATA" /*** Terrain资源。*/,
  TERRAINRES = "TERRAINRES" /*** Terrain资源。*/,
  FGUI = "FGUI",
}

export class UIZOrder {
  static CommBottom = 10;
  static CommCenter = 15;
  static CommTop = 20;
  static Artifact = 10;
  static ArtifactTips = 11;
  static Shop = 900;

  static Room = -1000;
  static HomeWnd_Below = -910;
  static HomeWnd = -900;
  static SpaceTaskInfoWnd = -890;
  static TrailMapWnd = -10;
  static TopTIP = 900;
  static Top = 999;
  static SceneMaskWnd = 1000;
  static LevelUpWnd = 100;
  static FightingUpdateWnd = 110;
}

/**
 * UI结构信息
 */
export interface UICFG {
  Type: EmWindow;
  packName: EmPackName; //FGUI中对应的包名,必需
  wndName?: string; //FGUI中对应的组件名,必需
  Class: any; //界面节点名称并且为绑定脚本名称
  Layer?: EmLayer; //界面所在层级
  ZIndex?: number; //索引
  Model?: boolean; //是否蒙版遮罩(默认为True)
  mouseThrough?: boolean; //鼠标穿透(默认False)
  EffectShow?: EnUIShowType; //打开效果
  EffectHide?: EnUIHideType; //关闭效果
  ShowLoading?: boolean; //是否展示加载提示
  Single?: boolean; //界面是否允许重复创建
  HideBgBlur?: boolean; //是否背景模糊
}

/**
 *UI打开特效
 */
export enum EnUIShowType {
  NONE, //无
  POPUP, //弹出
  FROM_TOP, //顶部弹出
  FADEIN, //
}

/**
 * UI关闭特效
 */
export enum EnUIHideType {
  NONE,
  POP, //关闭
  TO_TOP, //回收至顶部
  FADEOUT,
}

export enum EmPackName {
  Font = "Font",
  Base = "Base",
  //登陆前就使用到的
  BaseInit = "BaseInit",
  //没有图片资源的模块
  BaseCommon = "BaseCommon",
  Newbie = "Newbie",
  Space = "Space",
  Dialog = "Dialog",
  Home = "Home",
  Battle = "Battle",
  OuterCity = "OuterCity",
  OuterCityWar = "OuterCityWar",
  WorldMap = "WorldMap",
  BattleDynamic = "BattleDynamic",
  //副本公共模块
  CampaignCommon = "CampaignCommon",
  Waiting = "Waiting",
  LoadingScene = "LoadingScene",
  //房间公共资源模块
  BaseRoom = "BaseRoom",
  Login = "Login",
  Loading = "Loading",
  Announce = "Announce",
  RegisterS = "RegisterS",
  BattleResult = "BattleResult",
  JoyStick = "JoyStick",
  TrailMap = "TrailMap",
  Allocate = "Allocate",
  Forge = "Forge",
  Skill = "Skill",
  PveCampaign = "PveCampaign",
  PveSecret = "PveSecret",
  PveSecretScene = "PveSecretScene",
  Pvp = "Pvp",
  PveGate = "PveGate",
  RoomHall = "RoomHall",
  RoomList = "RoomList",
  Maze = "Maze",
  Castle = "Castle",
  LevelUp = "LevelUp",
  ChestFrame = "ChestFrame",
  CampaignResult = "CampaignResult",
  Task = "Task",
  Mail = "Mail",
  Shop = "Shop",
  OutCityShop = "OutCityShop",
  Friend = "Friend",
  Chat = "Chat",
  Star = "Star",
  Mount = "Mount",
  Welfare = "Welfare",
  Funny = "Funny",
  FirstPay = "FirstPay",
  Mineral = "Mineral",
  WorldBoss = "WorldBoss",
  Setting = "Setting",
  Consortia = "Consortia",
  RvRBattle = "RvRBattle",
  Sort = "Sort",
  Farm = "Farm",
  QuestionNaire = "QuestionNaire",
  Appell = "Appell",
  Pet = "Pet",
  PetChallenge = "PetChallenge",
  Warlords = "Warlords",
  PersonalCenter = "PersonalCenter",
  TreasureMap = "TreasureMap",
  PlayerInfo = "PlayerInfo",
  Hook = "Hook",
  SinglePass = "SinglePass",
  OutYard = "OutYard",
  Monopoly = "Monopoly",
  GemMaze = "GemMaze",
  CrossPvP = "CrossPvP",
  FunPreview = "FunPreview",
  MemTool = "MemTool",
  ChatAirBubble = "ChatAirBubble",
  PetGuard = "PetGuard",
  SkillEdit = "SkillEdit",
  PetCampaign = "PetCampaign",
  Evaluation = "Evaluation",
  MicroApp = "MicroApp",
  FaceSlapping = "FaceSlapping",
  GoldenSheep = "GoldenSheep",
  RemotePet = "RemotePet",
  Multilords = "Multilords",
  SBag = "SBag",
  QQDawanka = "QQDawanka",
  QQGift = "QQGift",
  Carnival = "Carnival",
  Test = "Test",
  BattleBgAni = "BattleBgAni",
  Alert = "Alert",
  ExpBack = "ExpBack",
  Market = "Market",
  Debug = "Debug",
  ActivityTime = "ActivityTime",
  SevenTarget = "SevenTarget",
}

/**
 *游戏UI
 */

export enum EmWindow {
  //公用弹窗类(单例类)
  Alert = "Alert",
  CommonTips = "CommonTips",
  CommonTips2 = "CommonTips2",
  CryStalTips = "CryStalTips",
  //初始加载界面
  Loading = "Loading",
  //登录大区
  SiteZone = "SiteZone",
  //登录
  Login = "Login",
  //登陆OS
  LoginOS = "LoginOS",
  //Debug登录
  DebugLogin = "DebugLogin",
  //选服
  ServerlistWnd = "ServerlistWnd",
  //创角
  Register = "Register",
  //创角
  RegisterS = "RegisterS",
  //主场景
  Home = "Home",
  //战斗
  Battle = "Battle",
  BattleBuffDetailInfo = "BattleBuffDetailInfo",
  BattleShortCutWnd = "BattleShortCutWnd",
  BattleDynamic = "BattleDynamic",
  BattleResult = "BattleResult",
  //战斗技能提示
  SkillTip = "SkillTip",
  /**
   * 游戏公告
   */
  Announce = "Announce",
  /**
   * 适龄提示
   */
  StatutoryAge = "StatutoryAge",
  /**
   * HTML
   */
  HTMLWnd = "HTMLWnd",
  /**
   * MaxLoading加载
   */
  MaxLoading = "MaxLoading",
  /**
   *提示
   */
  Tips = "Tips",

  /**
   *提示
   */
  MessageLabel = "MessageLabel",
  /**
   *测试 动画形象
   */
  TestFigure = "TestFigure",

  //战斗胜利详情
  BattleVictory = "BattleVictory",
  //战斗胜利
  BattleVictorySimple = "BattleVictorySimple",
  //战斗失败详情
  BattleFailed = "BattleFailed",
  //战斗失败
  BattleFailedSimple = "BattleFailedSimple",
  //遥杆
  JoyStick = "JoyStick",
  //试炼之塔
  TrailMap = "TrailMap",
  //试炼之塔商店
  TrailMapShop = "TrailShop",
  //兵种升级
  PawnLevelUp = "PawnLevelUp",
  //铁匠铺
  Forge = "Forge",
  //兵营
  CasernWnd = "CasernWnd",
  RoleWnd = "RoleWnd",
  BagWnd = "BagWnd",
  // RolePropertyWnd = 'RolePropertyWnd',
  SaleConfirmWnd = "SaleConfirmWnd",
  SplitConfirmWnd = "SplitConfirmWnd",
  BatchUseConfirmWnd = "BatchUseConfirmWnd",
  RoleDetailsWnd = "RoleDetailsWnd",
  RenameWnd = "RenameWnd",
  HeadIconModifyWnd = "HeadIconModifyWnd",
  BattleGuardItemTips = "BattleGuardItemTips",
  FashionWnd = "FashionWnd",
  // JewelWnd = 'JewelWnd',
  // DragonSoulWnd = 'DragonSoulWnd',
  FortuneGuardWnd = "FortuneGuardWnd",

  //重命名
  RENAME = "RENAME",
  //设置
  Setting = "Setting",
  //技能
  Skill = "Skill",
  //符文升级
  RunesUpgrade = "RunesUpgrade",
  RuneGemUpgradeWnd = "RuneGemUpgradeWnd",
  RuneGemWnd = "RuneGemWnd",
  //符文雕刻
  RuneCarveWnd = "RuneCarveWnd",
  //升级
  LevelUp = "LevelUp",
  //地图名称动画
  MapNameMovie = "MapNameMovie",
  //帮助说明
  Help = "Help",

  //PVE单人战役入口: 单人战役-迷宫-秘境
  PveGate = "PveGate",
  //单人战役
  PveCampaignWnd = "PveCampaignWnd",
  //多人战役-英雄之门
  PveMultiCampaignWnd = "PveMultiCampaignWnd",
  //单人秘境 选择界面
  PveSecretWnd = "PveSecretWnd",
  //单人秘境 副本中界面
  PveSecretSceneWnd = "PveSecretSceneWnd",
  //多人秘境 选择界面
  PveMultiSecretWnd = "PveMultiSecretWnd",
  //单人秘境 副本中界面
  PveMultiSecretSceneWnd = "PveMultiSecretSceneWnd",
  //秘宝提示
  SecretTresureTip = "SecretTresureTip",

  //PVP入口
  PvpGate = "PvpGate",
  //PVP单人竞技场
  Colosseum = "Colosseum",
  //PVP单人竞技场 历史记录
  ColosseumEvent = "ColosseumEvent",
  //PVP单人竞技场 领取奖励
  ColosseumRankReward = "ColosseumRankReward",
  //PVP商店
  PvpShop = "PvpShop",
  //房间大厅PVE PVP
  RoomHall = "RoomHall",
  //房间选择PVE PVP
  RoomList = "RoomList",
  PveRoomList = "PveRoomList",
  //房间密码设置与输 PVE PVP
  RoomPwd = "RoomPwd",
  //查找房间
  FindRoom = "FindRoom",
  //修行神殿
  Hook = "Hook",
  //邀请界面
  Invite = "Invite",
  //快速邀请界面
  QuickInvite = "QuickInvite",
  //被邀请界面
  BeingInvite = "BeingInvite",
  //队形调整
  TeamFormation = "TeamFormation",
  //兵种招募
  CasernRecruitWnd = "CasernRecruitWnd",
  //兵种特性领悟
  PawnSpecialAbilityWnd = "PawnSpecialAbilityWnd",
  //地下迷宫信息
  MazeViewWnd = "MazeViewWnd",
  //展示物品界面
  DisplayItems = "DisplayItems",
  //地下迷宫
  MazeFrameWnd = "MazeFrameWnd",
  //地下迷宫商店
  MazeShopWnd = "MazeShopWnd",
  //民居
  ResidenceFrameWnd = "ResidenceFrameWnd",
  //内政厅
  PoliticsFrameWnd = "PoliticsFrameWnd",
  //VIP冷却
  VipCoolDownFrameWnd = "VipCoolDownFrameWnd",
  //VIP特权
  VipPrivilege = "VipPrivilege",
  //部队
  AllocateWnd = "AllocateWnd",
  //兵营阵型调整
  AllocateFormationWnd = "AllocateFormationWnd",
  //战役通关结算
  CampaignResult = "CampaignResult",
  //战役通关翻牌
  ChestFrame = "ChestFrame",
  //配兵
  ConfigSoliderWnd = "ConfigSoliderWnd",
  //购买血包
  BuyHpWnd = "BuyHpWnd",
  //士兵Tips
  SoliderInfoTipWnd = "SoliderInfoTipWnd",
  //士兵技能Tips
  SoliderSkillTipWnd = "SoliderSkillTipWnd",
  //遣散士兵
  SeveranceSoliderWnd = "SeveranceSoliderWnd",
  //特性转换
  SpecialSwitchWnd = "SpecialSwitchWnd",
  //特性列表
  SpecialSelecteWnd = "SpecialSelecteWnd",
  //宝箱掉落
  BattleFallGoodsWnd = "BattleFallGoodsWnd",
  //类型1节点触发
  IconAlertHelperWnd = "IconAlertHelperWnd",
  //使用道具确认框
  UseGoodsAlert = "UseGoodsAlert",
  //购买物品确认框
  BuyGoodsAlert = "BuyGoodsAlert",
  //仓库
  DepotWnd = "DepotWnd",
  //精炼炉
  CrystalWnd = "CrystalWnd",
  //任务
  TaskWnd = "Task",
  //邮件
  MailWnd = "MailWnd",
  //邮件
  WriteMailWnd = "WriteMailWnd",
  //添加好友
  AddFriendWnd = "AddFriendWnd",
  //扫荡
  Mopup = "Mopup",
  //试炼之塔 王者之塔 战前对话框
  TrailDialog = "TrailDialog",
  //悬赏
  OfferRewardWnd = "OfferRewardWnd",
  //神学院
  SeminaryWnd = "SeminaryWnd",
  TransferBuildWnd = "TransferBuildWnd",
  WorldMapWnd = "WorldMapWnd",
  //神学院科技升级
  SeminaryUpWnd = "SeminaryUpWnd",
  //地下迷宫排行榜
  MazeRankWnd = "MazeRankWnd",
  //主界面左侧详情
  SpaceTaskInfoWnd = "SpaceTaskInfoWnd",
  //天空之城小地图
  SmallMapWnd = "SmallMapWnd",
  //副本小地图
  CampaignMapWnd = "CampaignMapWnd",
  //WelfareWnd 福利任务
  Welfare = "Welfare",
  //Funny  精彩活动
  Funny = "Funny",
  Exchange = "Exchange",

  //首充送豪礼
  FirstPayWnd = "FirstPayWnd",
  SpaceDialogWnd = "SpaceDialogWnd",

  CASTLEMAP2 = "CASTLEMAP2",
  CASTLEMAP1 = "CASTLEMAP1",
  CORE = "CORE",
  CASTLE = "CASTLE",
  QUEUE_BAR = "QUEUE_BAR",
  MAP = "MAP",
  GVG = "GVG",
  CAMPAIGN = "CAMPAIGN",
  MAZE = "MAZE",
  QTE = "QTE",
  NOVICE = "NOVICE",
  BASE_ROOM = "BASE_ROOM",
  PVE_ROON_SCENE = "PVE_ROON_SCENE",
  PVP_ROOMLIST = "PVP_ROOMLIST",
  PVP_ROOM_SCENE = "PVP_ROOM_SCENE",
  FARMMAP = "FARMMAP",
  FARM = "FARM",
  WATER = "WATER",
  VEHICLE = "VEHICLE",
  VEHICLE_DAIMON_TRAIL = "VEHICLE_DAIMON_TRAIL",
  WARLORDS_ROOM = "WARLORDS_ROOM",
  OuterCity = "OuterCity",
  MAP_HORSE = "MAP_HORSE",
  TIPS = "TIPS",
  BuyFrameI = "BuyFrameI",
  BuyFrame2 = "BuyFrame2",
  ShopWnd = "ShopWnd",
  FriendWnd = "FriendWnd",
  SendFlowersWnd = "SendFlowersWnd",
  AddFriendsWnd = "AddFriendsWnd",
  RecommendFriendWnd = "RecommendFriendWnd",

  ChatWnd = "ChatWnd",
  ChatFaceWnd = "ChatFaceWnd",
  ChatItemMenu = "ChatItemMenu",
  ChatBugleWnd = "ChatBugleWnd",
  SendFlowerWnd = "SendFlowerWnd",
  ReceiveFlowerWnd = "ReceiveFlowerWnd",

  PropTips = "PropTips",
  NewPropTips = "NewPropTips",
  MountCardTip = "MountCardTip",
  RuneTip = "RuneTip",
  ComposeTip = "ComposeTip",
  EquipTip = "EquipTip",
  EquipContrastTips = "EquipContrastTips",
  ForgeEquipTip = "ForgeEquipTip",
  PetEquipTip = "PetEquipTip",
  PetEquipContrastTips = "PetEquipContrastTips",
  ForgePropTip = "ForgePropTip",
  StarTip = "StarTip",
  StarPowerTip = "StarPowerTip",
  AppellPowerTip = "AppellPowerTip",
  PetTip = "PetTip",
  PetSkillTips = "PetSkillTips",
  SkillItemTips = "SkillItemTips",
  RuneItemTips = "RuneItemTips",
  TalentItemTips = "TalentItemTips",
  PropertyCompareTips = "PropertyCompareTips",
  WearyTips = "WearyTips", //体力
  Rank = "Rank",
  SceneMask = "SceneMask",
  // 占星
  Star = "Star",
  // 占星背包
  StarBag = "StarBag",
  // 占星操作
  StarOperate = "StarOperate",
  // 自动占星设置
  StarAutoSetting = "StarAutoSetting",
  //商店
  ShopCommWnd = "ShopCommWnd",
  //坐骑
  MountsWnd = "MountsWnd",
  //剧情对话
  Dialog = "Dialog",
  //战力提升
  FightingUpdateWnd = "FightingUpdateWnd",
  //兽魂
  WildSoulWnd = "WildSoulWnd",
  //今日不再提示
  TodayNotAlert = "TodayNotAlert",
  //坐骑Tips
  MountTips = "MountTips",
  //超级市场
  Supermarket = "Supermarket",
  //魔卡
  MagicCard = "MagicCard",
  //公会主界面
  Consortia = "Consortia",
  //公会升级
  ConsortiaUpgrade = "ConsortiaUpgrade",
  //公会宝箱分配
  ConsortiaTreasureBox = "ConsortiaTreasureBox",
  //公会会长转让
  ConsortiaTransfer = "ConsortiaTransfer",
  //公会技能塔
  ConsortiaSkillTower = "ConsortiaSkillTower",
  //公会重新命名
  ConsortiaRename = "ConsortiaRename",
  //公会权限一览
  ConsortiaPermission = "ConsortiaPermission",
  //公会邮件
  ConsortiaEmail = "ConsortiaEmail",
  //公会邮件成员
  ConsortiaEmailMember = "ConsortiaEmailMember",
  //公会创建
  ConsortiaCreate = "ConsortiaCreate",
  //公会事件
  ConsortiaEvent = "ConsortiaEvent",
  //公会仓库
  ConsortiaStorageWnd = "ConsortiaStorageWnd",
  //公会贡献
  ConsortiaContribute = "ConsortiaContribute",
  //公会成员入会审核
  ConsortiaAuditing = "ConsortiaAuditing",
  //公会申请
  ConsortiaApply = "ConsortiaApply",
  //公会招收链接
  ConsortiaRecruitMember = "ConsortiaRecruitMember",
  //公会公告修改
  ConsortiaInfoChange = "ConsortiaInfoChange",
  //公会开启祭坛
  ConsortiaDevil = "ConsortiaDevil",
  //公会招收详细界面
  ConsortiaInfoWnd = "ConsortiaInfoWnd",
  //公会成员操作按钮界面
  ConsortiaPlayerMenu = "ConsortiaPlayerMenu",
  //英灵
  Pet = "Pet",
  PetAttrTip = "PetAttrTip",
  PetDynamic = "PetDynamic",
  //英灵潜能
  PetPotency = "PetPotency",
  //
  PetRename = "PetRename",
  //英灵选择
  PetSelect = "PetSelect",
  //英灵保留
  PetSaveWnd = "PetSaveWnd",
  PetSaveSureWnd = "PetSaveSureWnd",
  //英灵竞技
  PetChallenge = "PetChallenge",
  //英灵竞技队形调整
  PetChallengeAdjust = "PetChallengeAdjust",
  //英灵竞技奖励
  PetChallengeReward = "PetChallengeReward",
  //英灵竞技战报
  PetChallengeEvent = "PetChallengeEvent",
  //英灵竞技确认挑战
  PetChallengeConfirm = "PetChallengeConfirm",
  //英灵挑战排行榜
  PetChallengeRank = "PetChallengeRank",
  //地下迷宫玩家复活
  MazeRiverWnd = "MazeRiverWnd",
  FriendInviteWnd = "FriendInviteWnd",
  WorldBossWnd = "WorldBossWnd",
  WorldBossSceneWnd = "WorldBossSceneWnd",
  WorldBossRiverWnd = "WorldBossRiverWnd",
  //战场入口
  RvrBattleWnd = "RvrBattleWnd",
  //战场右侧信息显示
  RvrBattleMapRightWnd = "RvrBattleMapRightWnd",
  //战场顶部中间阵营信息显示
  RvrBattleMapTopCenterWnd = "RvrBattleMapTopCenterWnd",
  //战场顶部中间阵营信息显示
  RvrBattleMapCombatWnd = "RvrBattleMapCombatWnd",
  //战场结果
  RvrBattleResultWnd = "RvrBattleResultWnd",
  //战场复活等待
  RvrBattlePlayerRiverWnd = "RvrBattlePlayerRiverWnd",
  //战场提交资源
  RvrBattleGetResourceWnd = "RvrBattleGetResourceWnd",
  //农场
  Farm = "Farm",
  //农场土地操作
  FarmLandMenu = "FarmLandMenu",
  //农场商城
  FarmShopWnd = "FarmShopWnd",
  //农场日志
  FarmEventWnd = "FarmEventWnd",
  //土地升级
  FarmLandUpWnd = "FarmLandUpWnd",
  //种子tips
  FarmBagTipWnd = "FarmBagTipWnd",
  //选择英灵
  FarmPetSelect = "FarmPetSelect",
  //所有排行榜
  Sort = "Sort",
  //众神榜
  WarlordsRank = "WarlordsRank",
  //公会宝箱分配
  ConsortiaPrizeAllotWnd = "ConsortiaPrizeAllotWnd",
  //有奖问答
  QuestionNaireWnd = "QuestionNaireWnd",
  //问卷调查
  QuestionWnd = "QuestionWnd",
  ConsortiaRankWnd = "ConsortiaRankWnd",
  GvgRankListWnd = "GvgRankListWnd",
  GvgEnterWarWnd = "GvgEnterWarWnd",
  GvgAddMembersWnd = "GvgAddMembersWnd",
  GvgBattleWnd = "GvgBattleWnd",
  //公会祭坛
  ConsortiaAltarWnd = "ConsortiaAltarWnd",
  //称号
  Appell = "Appell",
  //公会秘境右侧UI
  ConsortiaSecretInfoWnd = "ConsortiaSecretInfoWnd",
  AppellGetTips = "AppellGetTips",
  Appelltips = "Appelltips",
  GvgRiverWnd = "GvgRiverWnd",
  //众神之战战报
  WarlordsFinalReportWnd = "WarlordsFinalReportWnd",
  //众神之战房间
  WarlordRoomWnd = "WarlordRoomWnd",
  //众神之战欢乐竞猜人员选择界面
  WarlordsBetSelectWnd = "WarlordsBetSelectWnd",
  //众神之战欢乐竞猜界面
  WarlordsBetWnd = "WarlordsBetWnd",
  //众神之战奖励列表
  WarlordsCheckRewardWnd = "WarlordsCheckRewardWnd",
  //众神之战主界面入口
  WarlordsMainWnd = "WarlordsMainWnd",
  //众神之战预赛结果
  WarlordsPrelimReportWnd = "WarlordsPrelimReportWnd",
  //众神之战获奖名单
  WarlordsWinPrizesWnd = "WarlordsWinPrizesWnd",
  GvgBufferTips = "GvgBufferTips",

  PersonalCenter = "PersonalCenter",
  BattleSettingWnd = "BattleSettingWnd",
  PetExchangeShopWnd = "PetExchangeShopWnd",
  TreasureMapWnd = "TreasureMapWnd",
  TreasureClaimMapWnd = "TreasureClaimMapWnd",
  PetLandDialogWnd = "PetLandDialogWnd",
  MineralDialogWnd = "MineralDialogWnd",
  //紫晶商店
  MineralShopWnd = "MineralShopWnd",
  //众神祝福bufferTips
  BufferTips = "BufferTips",
  //公会选举
  ConsortiaElectionWnd = "ConsortiaElectionWnd",
  PlayerInfoWnd = "PlayerInfoWnd",
  PlayerProfileWnd = "PlayerProfileWnd",
  MyMountWnd = "MyMountWnd",
  PlayerMountWnd = "PlayerMountWnd",
  PlayerPetWnd = "PlayerPetWnd",
  MyPetWnd = "MyPetWnd",
  LookPlayerList = "LookPlayerList",
  //公共选择数量界面
  QuantitySelector = "QuantitySelector",
  OuterCityOperateMenu = "OuterCityOperateMenu",
  OuterCityTransmitWnd = "OuterCityTransmitWnd",
  OuterCityFieldInfoWnd = "OuterCityFieldInfoWnd",
  OuterCityCastleTips = "OuterCityCastleTips",
  OuterCityArmyTips = "OuterCityArmyTips",
  OuterCityFieldTips = "OuterCityFieldTips",
  OuterCityMonsterTips = "OuterCityMonsterTips",
  OuterCityAttackAlertWnd = "OuterCityAttackAlertWnd",
  OuterCityCastleInfoWnd = "OuterCityCastleInfoWnd",
  //天穹之径许愿墙
  SinglePassBugleWnd = "SinglePassBugleWnd",
  //天穹之径通关结算
  SinglepassResultWnd = "SinglepassResultWnd",
  //天穹之径主界面
  SinglePassWnd = "SinglePassWnd",
  //天穹之径排行榜
  SinglePassRankWnd = "SinglePassRankWnd",
  //查看坐骑
  MountInfoWnd = "MountInfoWnd",
  //邮箱验证
  CheckMailWnd = "CheckMailWnd",
  SuggestWnd = "SuggestWnd",
  CustomerServiceWnd = "CustomerServiceWnd",
  ServiceReplyWnd = "ServiceReplyWnd",
  //修改密码
  ChangePasswordWnd = "ChangePasswordWnd",
  SetPasswordWnd = "SetPasswordWnd",
  InputPasswordWnd = "InputPasswordWnd",
  ShortCutSetWnd = "ShortCutSetWnd",
  OfficialAccountWnd = "OfficialAccountWnd",
  //内政厅外城资源展示
  OuterCityResourceInfoWnd = "OuterCityResourceInfoWnd",
  //药水效果tips展示
  PotionBufferTips = "PotionBufferTips",
  WeakNetWnd = "WeakNetWnd",
  HintWnd = "HintWnd",
  Waiting = "Waiting",
  LoginSetting = "LoginSetting",
  LoginSettingOS = "LoginSettingOS",
  CumulativeRechargeItemInfoWnd = "CumulativeRechargeItemInfoWnd",
  //实力提升
  // FightingWnd = "FightingWnd",
  ImprovePowerWnd = "ImprovePowerWnd",
  //实力提升宝石和装备详情
  FightingDescribleWnd = "FightingDescribleWnd",
  //实力提升英灵详情
  FightingPetWnd = "FightingPetWnd",
  //经验找回提示框
  ExpBackShowTipsWnd = "ExpBackShowTipsWnd",
  //时装鉴定弹窗
  FashionSwitchTipsWnd = "FashionSwitchTipsWnd",
  //神秘商店
  OuterCityShopWnd = "OuterCityShopWnd",
  //公会仓库拆分
  ConsortiaSplitWnd = "ConsortiaSplitWnd",
  //坐骑炼化
  MountRefiningWnd = "MountRefiningWnd",
  //个人信息详细说明
  PlayerDescribeWnd = "PlayerDescribeWnd",
  //
  PKAlert = "PKAlert",
  //游戏盒子
  MiniGameWnd = "MiniGameWnd",
  //云端历险闯关成功老虎机界面
  MonopolyFinishWnd = "MonopolyFinishWnd",
  MonopolyResultWnd = "MonopolyResultWnd",
  ChooseDiceWnd = "ChooseDiceWnd",
  MonopolyDiceWnd = "MonopolyDiceWnd",
  //夺宝奇兵
  GemMazeWnd = "GemMazeWnd",
  //夺宝奇兵排行榜
  GemMazeRankWnd = "GemMazeRankWnd",
  //夺宝奖励宝库
  GemMazeBagWnd = "GemMazeBagWnd",
  //跨服多人本同意或者拒绝撮合
  CrossPvPSuccessWnd = "CrossPvPSuccessWnd",
  //跨服多人本匹配信息详情
  CorssPvPCenterShowWnd = "CorssPvPCenterShowWnd",
  //跨服多人本踢人表决
  CrossPvPVoteWnd = "CrossPvPVoteWnd",
  //功能预告
  FunOpenWnd = "FunOpenWnd",
  PassAdvanceWnd = "PassAdvanceWnd",
  PassBuyWnd = "PassBuyWnd",
  PassRewardWnd = "PassRewardWnd",
  ConsortiaBossWnd = "ConsortiaBossWnd",
  ConsortiaBossRewardWnd = "ConsortiaBossRewardWnd",
  ConsortiaBossTaskView = "ConsortiaBossTaskView",
  ConsortiaBossSceneWnd = "ConsortiaBossSceneWnd",
  ConsortiaBossDialogWnd = "ConsortiaBossDialogWnd",

  //内存查看 非正式功能模块
  MemToolWnd = "MemToolWnd",
  ChatAirBubbleWnd = "ChatAirBubbleWnd",
  PetGuardWnd = "PetGuardWnd",
  PetGuardTipWnd = "PetGuardTipWnd",
  LogWnd = "LogWnd",
  SkillEditWnd = "SkillEditWnd",
  SkillEditSelectWnd = "SkillEditSelectWnd",
  SkillEditPetWnd = "SkillEditPetWnd",
  ConsortiaTreasureWnd = "ConsortiaTreasureWnd",
  OuterCityTreasureCDAlertWnd = "OuterCityTreasureCDAlertWnd",
  OuterCityTreasureCDWnd = "OuterCityTreasureCDWnd",
  OuterCityTreasureWnd = "OuterCityTreasureWnd",
  MultiBoxSelectWnd = "MultiBoxSelectWnd",
  StarSellSelectWnd = "StarSellSelectWnd",

  //英灵战役
  PetCampaignWnd = "PetCampaignWnd",
  PetGetRewardWnd = "PetGetRewardWnd",
  ScreenWnd = "ScreenWnd",
  GetGoodsAlert = "GetGoodsAlert",
  PetEuipTrainWnd = "PetEuipTrainWnd",
  PetEquipSuccinctWnd = "PetEquipSuccinctWnd",
  PetEquipStrenOkWnd = "PetEquipStrenOkWnd",
  RuneHoleHelpWnd = "RuneHoleHelpWnd",
  PetCampaignResultWnd = "PetCampaignResultWnd",
  //聊天翻译目标语言
  ChatTranslateSetWnd = "ChatTranslateSetWnd",
  //坐骑分享
  MountShareWnd = "MountShareWnd",
  EvaluationWnd = "EvaluationWnd",
  //微端
  MicroAppWnd = "MicroAppWnd",
  //打脸图
  FaceSlappingWnd = "FaceSlappingWnd",
  //折扣卷
  DiscountWnd = "DiscountWnd",
  //好运红包打开界面
  GoldenSheepBoxWnd = "GoldenSheepBoxWnd",
  //好运红包获得奖励界面
  GoldenSheepWnd = "GoldenSheepWnd",
  // 转盘活动界面
  TurntableWnd = "TurntableWnd",
  TurntableRewardRecord = "TurntableRewardRecord",
  // 体力补充界面
  WearySupplyWnd = "WearySupplyWnd",
  MultilordsMainWnd = "MultilordsMainWnd",

  // 泰坦之战
  MultilordsRank = "MultilordsRank",
  MultilordsBetWnd = "MultilordsBetWnd",
  MultilordsBetSelectWnd = "MultilordsBetSelectWnd",
  MultilordsWinPrizesWnd = "MultilordsWinPrizesWnd",
  MultilordsCheckRewardWnd = "MultilordsCheckRewardWnd",
  MultilordsRoomWnd = "MultilordsRoomWnd",
  MultilordsFinalReportWnd = "MultilordsFinalReportWnd",
  MultilordsPrelimReportWnd = "MultilordsPrelimReportWnd",

  //英灵远征 准备
  RemotePetReadyWnd = "RemotePetReadyWnd",
  RemotePetTurnWnd = "RemotePetTurnWnd",
  RemotePetChallengeWnd = "RemotePetChallengeWnd",
  RemoteMopupWnd = "RemoteMopupWnd",
  RemotePetOrderWnd = "RemotePetOrderWnd",
  RemotePetSkillLevelUp = "RemotePetSkillLevelUp",
  RemotePetWnd = "RemotePetWnd",
  SRoleWnd = "SRoleWnd",
  TattooBaptizeWnd = "TattooBaptizeWnd",
  TattooReinforceWnd = "TattooReinforceWnd",
  RingTaskRewardWnd = "RingTaskRewardWnd",
  //时装吞噬属性加成
  FashionBonusWnd = "FashionBonusWnd",
  //自动寻路
  AutoWalkWnd = "AutoWalkWnd",
  //921任务选择英灵
  PetFirstSelectWnd = "PetFirstSelectWnd",
  SBag = "SBag",

  //QQ大厅大玩咖
  QQDawankaWnd = "QQDawankaWnd",
  ItemTips = "ItemTips",
  AvatarTips = "AvatarTips",
  QQGiftWnd = "QQGiftWnd",
  OutyardChangeWnd = "OutyardChangeWnd",
  OutyardBlessWnd = "OutyardBlessWnd",
  OutyardFigureWnd = "OutyardFigureWnd",
  OutyardMemberWnd = "OutyardMemberWnd",
  OutyardNoticeWnd = "OutyardNoticeWnd",
  OutyardOpenWnd = "OutyardOpenWnd",
  OutyardRewardWnd = "OutyardRewardWnd",
  OutyardRewardAlertWnd = "OutyardRewardAlertWnd",
  OutyardShowWnd = "OutyardShowWnd",
  GoldenTreePreviewWnd = "GoldenTreePreviewWnd",
  GoldenTreeRecordWnd = "GoldenTreeRecordWnd",
  BottleIntergalBoxTips = "BottleIntergalBoxTips",
  BottleBottomIntergalBoxTips = "BottleBottomIntergalBoxTips",
  PvpRewardsWnd = "PvpRewardsWnd",
  PvpPreviewWnd = "PvpPreviewWnd",
  PvpRoomResultWnd = "PvpRoomResultWnd",

  ColosseumRewardsWnd = "ColosseumRewardsWnd",

  RuneHoldEquipWnd = "RuneHoldEquipWnd",
  FilterRuneWnd = "FilterRuneWnd",
  OutyardBuyEnergyWnd = "OutyardBuyEnergyWnd",

  //嘉年华
  Carnival = "Carnival",
  //梭哈扑克
  // AirGardenGameFivecardWnd = "AirGardenGameFivecardWnd",
  AirGardenGameLLK = "AirGardenGameLLK",
  AirGardenGameMemoryCard = "AirGardenGameMemoryCard",
  AirGardenGameSuDuWnd = "AirGardenGameSuDuWnd",
  //绑定手机、邮箱认证界面
  BindVertifyWnd = "BindVertifyWnd",

  RemotePetAdjustWnd = "RemotePetAdjustWnd",
  OutyardBattleRecordWnd = "OutyardBattleRecordWnd",
  //珍品预览
  PreviewGoodsWnd = "PreviewGoodsWnd",
  WishPoolResultWnd = "WishPoolResultWnd",
  BattleBgAni = "BattleBgAni",
  PreviewBoxWnd = "PreviewBoxWnd",
  OuterCityMapWnd = "OuterCityMapWnd",
  OuterCityMapCastleTips = "OuterCityMapCastleTips",
  OuterCityMapTreasureTips = "OuterCityMapTreasureTips",
  OuterCityMapBossTips = "OuterCityMapBossTips",
  OuterCityMapMineTips = "OuterCityMapMineTips",
  OutercityGoldMineWnd = "OutercityGoldMineWnd",
  ExpBackWnd = "ExpBackWnd",
  OuterCityBossInfoWnd = "OuterCityBossInfoWnd",
  //市场
  MarketWnd = "MarketWnd",
  MarketBuyWnd = "MarketBuyWnd",
  MarketSellWnd = "MarketSellWnd",
  OuterCityMapPlayerTips = "OuterCityMapPlayerTips",
  //城战
  OuterCityWarWnd = "OuterCityWarWnd",
  OuterCityWarDefencerBuildWnd = "OuterCityWarDefencerBuildWnd",
  OuterCityWarAttackerBuildWnd = "OuterCityWarAttackerBuildWnd",
  OuterCityWarDefenceSettingWnd = "OuterCityWarDefenceSettingWnd",
  OuterCityWarEnterWarSettingWnd = "OuterCityWarEnterWarSettingWnd",
  OuterCityWarNoticeWnd = "OuterCityWarNoticeWnd",
  ArtifactTips = "ArtifactTips",
  ArtifactResetWnd = "ArtifactResetWnd",
  MasterySoulWnd = "MasterySoulWnd",
  SecretBookTips = "SecretBookTips",
  SoulEquipTip = "SoulEquipTip",
  PlayerMasteryWnd = "PlayerMasteryWnd",
  MyMasteryWnd = "MyMasteryWnd",
  QuickOpenFrameWnd = "QuickOpenFrameWnd",
  DebugHelpWnd = "DebugHelpWnd",
  OuterCityVehicleTips = "OuterCityVehicleTips",
  OuterCityVehicleInfoWnd = "OuterCityVehicleInfoWnd",
  ConsortiaNewWnd = "ConsortiaNewWnd",
  ConsortiaTaskWnd = "ConsortiaTaskWnd",

  //升级账号
  UpgradeAccountWnd = "UpgradeAccountWnd",

  ActivityTimeWnd = "ActivityTimeWnd",
  ConsortiaPrayWnd = "ConsortiaPrayWnd",
  CastleBuildInfoWnd = "CastleBuildInfoWnd",
  SevenGoalsWnd = "SevenGoalsWnd",
}

/**
 * 游戏UIPackage
 * key为每个目录名称
 * 每个模块会有多个UI界面, 场景UI用GameUI层    弹窗窗口用Popup层
 */
export const UI_PACKAGE: { [key: string]: UICFG } = {
  //普通tips,只有一句话的那种,支持ubb语法
  [EmWindow.CommonTips]: {
    Type: EmWindow.CommonTips,
    packName: EmPackName.Base,
    wndName: "CommonTips",
    Class: CommonTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },
  //普通tips,标题+content+content2,支持ubb语法
  [EmWindow.CommonTips2]: {
    Type: EmWindow.CommonTips2,
    packName: EmPackName.Base,
    wndName: "CommonTips2",
    Class: CommonTips2,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },
  //公用弹窗类
  [EmWindow.Alert]: {
    Type: EmWindow.Alert,
    packName: EmPackName.BaseInit,
    wndName: "AlertFrame",
    Class: SimpleAlertWnd,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
    Single: false,
  },
  //公用弹窗类
  [EmWindow.PKAlert]: {
    Type: EmWindow.PKAlert,
    packName: EmPackName.BaseInit,
    wndName: "AlertFrame",
    Class: SpacePKAlert,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
    Single: true,
  },
  //公用文字提示
  [EmWindow.MessageLabel]: {
    Type: EmWindow.MessageLabel,
    packName: EmPackName.Font,
    wndName: "MessageLabel",
    Class: MessageLabel,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: false,
    mouseThrough: true,
    ShowLoading: false,
    Single: false,
  },
  //加载
  [EmWindow.Loading]: {
    Type: EmWindow.Loading,
    packName: EmPackName.Loading,
    wndName: "LoadingWnd",
    Class: LoadingWnd,
    Layer: EmLayer.STAGE_TOP_LAYER,
    EffectShow: EnUIShowType.FADEIN,
    Model: false,
  },
  //公告
  [EmWindow.Announce]: {
    Type: EmWindow.Announce,
    packName: EmPackName.Announce,
    wndName: "AnnounceWnd",
    Class: AnnounceWnd,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
    EffectShow: EnUIShowType.POPUP,
    EffectHide: EnUIHideType.POP,
  },
  //适龄提示
  [EmWindow.StatutoryAge]: {
    Type: EmWindow.StatutoryAge,
    packName: EmPackName.Announce,
    wndName: "StatutoryAgeWnd",
    Class: StatutoryAgeWnd,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
    EffectShow: EnUIShowType.POPUP,
    EffectHide: EnUIHideType.POP,
  },
  //适龄提示
  [EmWindow.HTMLWnd]: {
    Type: EmWindow.HTMLWnd,
    packName: EmPackName.Announce,
    wndName: "HTMLWnd",
    Class: HTMLWnd,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
    EffectShow: EnUIShowType.POPUP,
    EffectHide: EnUIHideType.POP,
  },
  //登录
  [EmWindow.SiteZone]: {
    Type: EmWindow.SiteZone,
    packName: EmPackName.Login,
    wndName: "SiteZoneWnd",
    Class: SiteZoneWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ShowLoading: false,
  },
  //登录
  [EmWindow.LoginSetting]: {
    Type: EmWindow.LoginSetting,
    packName: EmPackName.Login,
    wndName: "LoginSettingWnd",
    Class: LoginSettingWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ShowLoading: false,
  },
  //登录
  [EmWindow.LoginSettingOS]: {
    Type: EmWindow.LoginSettingOS,
    packName: EmPackName.Login,
    wndName: "LoginSettingWndOS",
    Class: LoginSettingWndOS,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ShowLoading: false,
  },
  //登录
  [EmWindow.Login]: {
    Type: EmWindow.Login,
    packName: EmPackName.Login,
    wndName: "LoginWnd",
    Class: LoginWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ShowLoading: false,
  },
  //登录OS
  [EmWindow.LoginOS]: {
    Type: EmWindow.LoginOS,
    packName: EmPackName.Login,
    wndName: "LoginWndOS",
    Class: LoginWndOS,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ShowLoading: false,
  },
  //登录
  [EmWindow.DebugLogin]: {
    Type: EmWindow.DebugLogin,
    packName: EmPackName.Login,
    wndName: "DebugLoginWnd",
    Class: DebugLoginWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ShowLoading: false,
  },
  //选服务器
  [EmWindow.ServerlistWnd]: {
    Type: EmWindow.ServerlistWnd,
    packName: EmPackName.Login,
    wndName: "ServerlistWnd",
    Class: ServerlistWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  [EmWindow.Tips]: {
    Type: EmWindow.Tips,
    packName: EmPackName.Base,
    wndName: "TipsItem",
    Class: TipsItem,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: false,
    ShowLoading: false,
    Single: false,
  },
  //主场景
  [EmWindow.Home]: {
    Type: EmWindow.Home,
    packName: EmPackName.Home,
    wndName: "HomeWnd",
    Class: HomeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
    ZIndex: UIZOrder.HomeWnd,
  },
  //战斗场景主界面
  [EmWindow.Battle]: {
    Type: EmWindow.Battle,
    packName: EmPackName.Battle,
    wndName: "BattleWnd",
    Class: BattleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.BattleBuffDetailInfo]: {
    Type: EmWindow.BattleBuffDetailInfo,
    packName: EmPackName.Battle,
    wndName: "BattleBuffDetailInfoWnd",
    Class: BattleBuffDetailInfoWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.BattleShortCutWnd]: {
    Type: EmWindow.BattleShortCutWnd,
    packName: EmPackName.Battle,
    wndName: "BattleShortCutWnd",
    Class: BattleShortCutWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: true,
  },
  //战斗技能提示
  [EmWindow.SkillTip]: {
    Type: EmWindow.SkillTip,
    packName: EmPackName.Base,
    wndName: "SkillTips",
    Class: SkillTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //创建角色
  [EmWindow.RegisterS]: {
    Type: EmWindow.RegisterS,
    packName: EmPackName.RegisterS,
    wndName: "RegisterSWnd",
    Class: RegisterSWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //
  [EmWindow.TestFigure]: {
    Type: EmWindow.TestFigure,
    packName: EmPackName.Test,
    wndName: "TestFigureWnd",
    Class: TestFigureWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //战斗胜利详情
  [EmWindow.BattleVictory]: {
    Type: EmWindow.BattleVictory,
    packName: EmPackName.BattleResult,
    wndName: "BattleVictoryWnd",
    Class: BattleVictoryWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    EffectShow: EnUIShowType.POPUP,
    Model: true,
  },
  //战斗胜利
  [EmWindow.BattleVictorySimple]: {
    Type: EmWindow.BattleVictorySimple,
    packName: EmPackName.BattleResult,
    wndName: "BattleVictorySimpleWnd",
    Class: BattleVictorySimpleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    EffectShow: EnUIShowType.POPUP,
    Model: true,
  },
  //战斗失败
  [EmWindow.BattleFailedSimple]: {
    Type: EmWindow.BattleFailedSimple,
    packName: EmPackName.BattleResult,
    wndName: "BattleFailedSimpleWnd",
    Class: BattleFailedSimpleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    EffectShow: EnUIShowType.POPUP,
    Model: true,
  },
  //战斗失败详情
  [EmWindow.BattleFailed]: {
    Type: EmWindow.BattleFailed,
    packName: EmPackName.BattleResult,
    wndName: "BattleFailedWnd",
    Class: BattleFailedWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    EffectShow: EnUIShowType.POPUP,
    Model: true,
  },
  //遥杆
  [EmWindow.JoyStick]: {
    Type: EmWindow.JoyStick,
    packName: EmPackName.JoyStick,
    wndName: "JoyStickWnd",
    Class: JoyStickWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
    ShowLoading: false,
  },
  //试炼之塔
  [EmWindow.TrailMap]: {
    Type: EmWindow.TrailMap,
    packName: EmPackName.TrailMap,
    wndName: "TrailMapWnd",
    Class: TrailMapWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    mouseThrough: true,
    ZIndex: UIZOrder.TrailMapWnd,
  },
  //试炼之塔商店
  [EmWindow.TrailMapShop]: {
    Type: EmWindow.TrailMapShop,
    packName: EmPackName.TrailMap,
    wndName: "TrialMapShopWnd",
    Class: TrialMapShopWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //试炼之塔、王者之塔 战前对话框
  [EmWindow.TrailDialog]: {
    Type: EmWindow.TrailDialog,
    packName: EmPackName.TrailMap,
    wndName: "TrailDialogWnd",
    Class: TrailDialogWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    HideBgBlur: true,
  },
  //兵种升级
  [EmWindow.PawnLevelUp]: {
    Type: EmWindow.PawnLevelUp,
    packName: EmPackName.Allocate,
    wndName: "PawnLevelUpWnd",
    Class: PawnLevelUpWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //铁匠铺
  [EmWindow.Forge]: {
    Type: EmWindow.Forge,
    packName: EmPackName.Forge,
    wndName: "ForgeWnd",
    Class: ForgeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //兵营
  [EmWindow.CasernWnd]: {
    Type: EmWindow.CasernWnd,
    packName: EmPackName.Allocate,
    wndName: "CasernWnd",
    Class: CasernWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //角色
  // [EmWindow.RoleWnd]: { Type: EmWindow.RoleWnd, packName: EmPackName.Bag, wndName: 'RoleWnd', Class: RoleWnd, Layer: EmLayer.GAME_UI_LAYER, Model: false, mouseThrough: true },
  //背包
  [EmWindow.BagWnd]: {
    Type: EmWindow.BagWnd,
    packName: EmPackName.Consortia,
    wndName: "BagWnd",
    Class: BagWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //属性
  // [EmWindow.RolePropertyWnd]: { Type: EmWindow.RolePropertyWnd, packName: EmPackName.Bag, wndName: 'RolePropertyWnd', Class: RolePropertyWnd, Layer: EmLayer.GAME_DYNAMIC_LAYER, Model: false, mouseThrough: true },
  //背包出售确认
  [EmWindow.SaleConfirmWnd]: {
    Type: EmWindow.SaleConfirmWnd,
    packName: EmPackName.Base,
    wndName: "SaleConfirmWnd",
    Class: SaleConfirmWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //拆分物品
  [EmWindow.SplitConfirmWnd]: {
    Type: EmWindow.SplitConfirmWnd,
    packName: EmPackName.Base,
    wndName: "SplitConfirmWnd",
    Class: SplitConfirmWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //批量使用物品
  [EmWindow.BatchUseConfirmWnd]: {
    Type: EmWindow.BatchUseConfirmWnd,
    packName: EmPackName.Base,
    wndName: "BatchUseConfirmWnd",
    Class: BatchUseConfirmWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //角色详细资料
  // [EmWindow.RoleDetailsWnd]: { Type: EmWindow.RoleDetailsWnd, packName: EmPackName.Bag, wndName: 'RoleDetailsWnd', Class: RoleDetailsWnd, Layer: EmLayer.GAME_UI_LAYER, Model: false, mouseThrough: true },
  //角色详细资料
  [EmWindow.RenameWnd]: {
    Type: EmWindow.RenameWnd,
    packName: EmPackName.BaseCommon,
    wndName: "RenameWnd",
    Class: RenameWnd,
    Layer: EmLayer.STAGE_TIP_DYANMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //头像修改
  [EmWindow.HeadIconModifyWnd]: {
    Type: EmWindow.HeadIconModifyWnd,
    packName: EmPackName.Base,
    wndName: "HeadIconModifyWnd",
    Class: HeadIconModifyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  //战斗守护itemTips
  [EmWindow.BattleGuardItemTips]: {
    Type: EmWindow.BattleGuardItemTips,
    packName: EmPackName.Base,
    wndName: "BattleGuardItemTips",
    Class: BattleGuardItemTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //灵魂刻印
  // [EmWindow.JewelWnd]: { Type: EmWindow.JewelWnd, packName: EmPackName.Bag, wndName: 'JewelWnd', Class: JewelWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },
  //龙魂
  // [EmWindow.DragonSoulWnd]: { Type: EmWindow.DragonSoulWnd, packName: EmPackName.Bag, wndName: 'DragonSoulWnd', Class: DragonSoulWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },
  //命运守护
  // [EmWindow.FortuneGuardWnd]: { Type: EmWindow.FortuneGuardWnd, packName: EmPackName.Bag, wndName: 'FortuneGuardWnd', Class: FateRotaryWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },
  //时装
  // [EmWindow.FashionWnd]: { Type: EmWindow.FashionWnd, packName: EmPackName.Bag, wndName: 'FashionWnd', Class: FashionWnd, Layer: EmLayer.GAME_UI_LAYER, Model: false, mouseThrough: true },
  //技能
  [EmWindow.Skill]: {
    Type: EmWindow.Skill,
    packName: EmPackName.Skill,
    wndName: "SkillWnd",
    Class: SkillWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //技能
  [EmWindow.RunesUpgrade]: {
    Type: EmWindow.RunesUpgrade,
    packName: EmPackName.Skill,
    wndName: "RunesUpgradeWnd",
    Class: RunesUpgradeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //符文石升级
  [EmWindow.RuneGemUpgradeWnd]: {
    Type: EmWindow.RuneGemUpgradeWnd,
    packName: EmPackName.Skill,
    wndName: "RuneGemUpgradeWnd",
    Class: RuneGemUpgradeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //符文石
  [EmWindow.RuneGemWnd]: {
    Type: EmWindow.RuneGemWnd,
    packName: EmPackName.Skill,
    wndName: "RuneGemWnd",
    Class: RuneGemWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //符文雕刻
  [EmWindow.RuneCarveWnd]: {
    Type: EmWindow.RuneCarveWnd,
    packName: EmPackName.Skill,
    wndName: "RuneCarveWnd",
    Class: RuneCarveWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //兵种招募
  [EmWindow.CasernRecruitWnd]: {
    Type: EmWindow.CasernRecruitWnd,
    packName: EmPackName.Allocate,
    wndName: "CasernRecruitWnd",
    Class: CasernRecruitWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //兵种特性领悟
  [EmWindow.PawnSpecialAbilityWnd]: {
    Type: EmWindow.PawnSpecialAbilityWnd,
    packName: EmPackName.Allocate,
    wndName: "PawnSpecialAbilityWnd",
    Class: PawnSpecialAbilityWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  //PVE入口
  [EmWindow.PveGate]: {
    Type: EmWindow.PveGate,
    packName: EmPackName.PveGate,
    wndName: "PveGateWnd",
    Class: PveGateWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PveCampaignWnd]: {
    Type: EmWindow.PveCampaignWnd,
    packName: EmPackName.PveCampaign,
    wndName: "PveCampaignWnd",
    Class: PveCampaignWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PveMultiCampaignWnd]: {
    Type: EmWindow.PveMultiCampaignWnd,
    packName: EmPackName.PveCampaign,
    wndName: "PveMultiCampaignWnd",
    Class: PveMultiCampaignWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PveSecretWnd]: {
    Type: EmWindow.PveSecretWnd,
    packName: EmPackName.PveSecret,
    wndName: "PveSecretWnd",
    Class: PveSecretWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PveSecretSceneWnd]: {
    Type: EmWindow.PveSecretSceneWnd,
    packName: EmPackName.PveSecretScene,
    wndName: "PveSecretSceneWnd",
    Class: PveSecretSceneWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
    ZIndex: UIZOrder.HomeWnd_Below,
  },
  [EmWindow.SecretTresureTip]: {
    Type: EmWindow.SecretTresureTip,
    packName: EmPackName.Base,
    wndName: "SecretTresureTip",
    Class: SecretTresureTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  // [EmWindow.PveMultiSecretWnd]: { Type: EmWindow.PveMultiSecretWnd, packName: EmPackName.PveSecret, wndName: 'PveMultiSecretWnd', Class: PveMultiSecretWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },
  // [EmWindow.PveMultiSecretSceneWnd]: { Type: EmWindow.PveMultiSecretSceneWnd, packName: EmPackName.PveSecretScene, wndName: 'PveMultiSecretSceneWnd', Class: PveMultiSecretSceneWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },

  //PVP入口
  [EmWindow.PvpGate]: {
    Type: EmWindow.PvpGate,
    packName: EmPackName.Pvp,
    wndName: "PvpGateWnd",
    Class: PvpGateWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //PVP单人竞技场
  [EmWindow.Colosseum]: {
    Type: EmWindow.Colosseum,
    packName: EmPackName.Pvp,
    wndName: "ColosseumWnd",
    Class: ColosseumWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //PVP单人竞技场 历史记录
  [EmWindow.ColosseumEvent]: {
    Type: EmWindow.ColosseumEvent,
    packName: EmPackName.Pvp,
    wndName: "ColosseumEventWnd",
    Class: ColosseumEventWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //PVP单人竞技场 领取奖励
  [EmWindow.ColosseumRankReward]: {
    Type: EmWindow.ColosseumRankReward,
    packName: EmPackName.Pvp,
    wndName: "ColosseumRankRewardWnd",
    Class: ColosseumRankRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //PVP商店
  [EmWindow.PvpShop]: {
    Type: EmWindow.PvpShop,
    packName: EmPackName.Pvp,
    wndName: "PvpShopWnd",
    Class: PvpShopWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //房间大厅PVE PVP
  [EmWindow.RoomHall]: {
    Type: EmWindow.RoomHall,
    packName: EmPackName.RoomHall,
    wndName: "RoomHallWnd",
    Class: RoomHallWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ZIndex: UIZOrder.Room,
  },
  //房间选择PVP
  [EmWindow.RoomList]: {
    Type: EmWindow.RoomList,
    packName: EmPackName.RoomList,
    wndName: "RoomListWnd",
    Class: RoomListWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  //房间选择PVE
  [EmWindow.PveRoomList]: {
    Type: EmWindow.PveRoomList,
    packName: EmPackName.RoomList,
    wndName: "PveRoomListWnd",
    Class: PveRoomListWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  //房间密码设置与输入PVE PVP
  [EmWindow.RoomPwd]: {
    Type: EmWindow.RoomPwd,
    packName: EmPackName.RoomList,
    wndName: "RoomPwdWnd",
    Class: RoomPwdWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },
  [EmWindow.FindRoom]: {
    Type: EmWindow.FindRoom,
    packName: EmPackName.RoomList,
    wndName: "FindRoomWnd",
    Class: FindRoomWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },
  //邀请界面
  [EmWindow.Invite]: {
    Type: EmWindow.Invite,
    packName: EmPackName.BaseCommon,
    wndName: "InviteWnd",
    Class: InviteWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //快速邀请界面
  [EmWindow.QuickInvite]: {
    Type: EmWindow.QuickInvite,
    packName: EmPackName.BaseCommon,
    wndName: "QuickInviteWnd",
    Class: QuickInviteWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //被邀请界面
  [EmWindow.BeingInvite]: {
    Type: EmWindow.BeingInvite,
    packName: EmPackName.BaseCommon,
    wndName: "BeingInviteWnd",
    Class: BeingInviteWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.TopTIP,
  },
  //队形调整
  [EmWindow.TeamFormation]: {
    Type: EmWindow.TeamFormation,
    packName: EmPackName.BaseCommon,
    wndName: "TeamFormationWnd",
    Class: TeamFormationWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //地下迷宫副本界面
  [EmWindow.MazeViewWnd]: {
    Type: EmWindow.MazeViewWnd,
    packName: EmPackName.Maze,
    wndName: "MazeViewWnd",
    Class: MazeViewWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //升级
  [EmWindow.LevelUp]: {
    Type: EmWindow.LevelUp,
    packName: EmPackName.LevelUp,
    wndName: "LevelUpWnd",
    Class: LevelUpWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.LevelUpWnd,
  },
  //
  [EmWindow.MapNameMovie]: {
    Type: EmWindow.MapNameMovie,
    packName: EmPackName.CampaignCommon,
    wndName: "MapNameMovieWnd",
    Class: MapNameMovieWnd,
    Layer: EmLayer.GAME_TOP_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //展示物品界面
  [EmWindow.DisplayItems]: {
    Type: EmWindow.DisplayItems,
    packName: EmPackName.BaseCommon,
    wndName: "DisplayItemsWnd",
    Class: DisplayItemsWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    ShowLoading: false,
  },
  //帮助界面
  [EmWindow.Help]: {
    Type: EmWindow.Help,
    packName: EmPackName.Base,
    wndName: "HelpWnd",
    Class: HelpWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: true,
    HideBgBlur: true,
  },
  //地下迷宫
  [EmWindow.MazeFrameWnd]: {
    Type: EmWindow.MazeFrameWnd,
    packName: EmPackName.Maze,
    wndName: "MazeFrameWnd",
    Class: MazeFrameWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //地下迷宫商店
  [EmWindow.MazeShopWnd]: {
    Type: EmWindow.MazeShopWnd,
    packName: EmPackName.Maze,
    wndName: "MazeShopWnd",
    Class: MazeShopWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    mouseThrough: false,
  },
  //民居
  [EmWindow.ResidenceFrameWnd]: {
    Type: EmWindow.ResidenceFrameWnd,
    packName: EmPackName.Castle,
    wndName: "ResidenceFrameWnd",
    Class: ResidenceFrameWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //内政厅
  [EmWindow.PoliticsFrameWnd]: {
    Type: EmWindow.PoliticsFrameWnd,
    packName: EmPackName.Castle,
    wndName: "PoliticsFrameWnd",
    Class: PoliticsFrameWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //冷却
  [EmWindow.VipCoolDownFrameWnd]: {
    Type: EmWindow.VipCoolDownFrameWnd,
    packName: EmPackName.BaseCommon,
    wndName: "VipCoolDownFrameWnd",
    Class: VipCoolDownFrameWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    mouseThrough: false,
    Model: true,
    ZIndex: UIZOrder.CommTop,
  },
  //部队
  [EmWindow.AllocateWnd]: {
    Type: EmWindow.AllocateWnd,
    packName: EmPackName.Allocate,
    wndName: "AllocateWnd",
    Class: AllocateWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.AllocateFormationWnd]: {
    Type: EmWindow.AllocateFormationWnd,
    packName: EmPackName.Allocate,
    wndName: "AllocateFormationWnd",
    Class: AllocateFormationWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //战役通关结算
  [EmWindow.CampaignResult]: {
    Type: EmWindow.CampaignResult,
    packName: EmPackName.CampaignResult,
    wndName: "CampaignResultWnd",
    Class: CampaignResultWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    mouseThrough: false,
  },
  //战役通关翻牌
  [EmWindow.ChestFrame]: {
    Type: EmWindow.ChestFrame,
    packName: EmPackName.ChestFrame,
    wndName: "ChestFrameWnd",
    Class: ChestFrameWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Top,
  },
  //部队
  [EmWindow.ConfigSoliderWnd]: {
    Type: EmWindow.ConfigSoliderWnd,
    packName: EmPackName.Allocate,
    wndName: "ConfigSoliderWnd",
    Class: ConfigSoliderWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //购买血包
  [EmWindow.BuyHpWnd]: {
    Type: EmWindow.BuyHpWnd,
    packName: EmPackName.Home,
    wndName: "BuyHpWnd",
    Class: BuyHpWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },
  //士兵tips
  [EmWindow.SoliderInfoTipWnd]: {
    Type: EmWindow.SoliderInfoTipWnd,
    packName: EmPackName.Allocate,
    wndName: "SoliderInfoTipWnd",
    Class: SoliderInfoTipWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: true,
    ShowLoading: false,
  },
  //士兵技能tips
  [EmWindow.SoliderSkillTipWnd]: {
    Type: EmWindow.SoliderSkillTipWnd,
    packName: EmPackName.Allocate,
    wndName: "SoliderSkillTipWnd",
    Class: SoliderSkillTipWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
    ShowLoading: false,
  },
  //遣散士兵
  [EmWindow.SeveranceSoliderWnd]: {
    Type: EmWindow.SeveranceSoliderWnd,
    packName: EmPackName.Allocate,
    wndName: "SeveranceSoliderWnd",
    Class: SeveranceSoliderWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //兵种特性转换
  [EmWindow.SpecialSwitchWnd]: {
    Type: EmWindow.SpecialSwitchWnd,
    packName: EmPackName.Allocate,
    wndName: "SpecialSwitchWnd",
    Class: SpecialSwitchWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //特性列表
  [EmWindow.SpecialSelecteWnd]: {
    Type: EmWindow.SpecialSelecteWnd,
    packName: EmPackName.Allocate,
    wndName: "SpecialSelecteWnd",
    Class: SpecialSelecteWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //宝箱掉落
  [EmWindow.BattleFallGoodsWnd]: {
    Type: EmWindow.BattleFallGoodsWnd,
    packName: EmPackName.Battle,
    wndName: "BattleFallGoodsWnd",
    Class: BattleFallGoodsWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ShowLoading: false,
  },
  //类型1节点触发
  [EmWindow.IconAlertHelperWnd]: {
    Type: EmWindow.IconAlertHelperWnd,
    packName: EmPackName.Base,
    wndName: "IconAlertHelperWnd",
    Class: IconAlertHelperWnd,
    Layer: EmLayer.GAME_TOP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //仓库
  [EmWindow.DepotWnd]: {
    Type: EmWindow.DepotWnd,
    packName: EmPackName.Castle,
    wndName: "DepotWnd",
    Class: DepotWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //精炼炉
  [EmWindow.CrystalWnd]: {
    Type: EmWindow.CrystalWnd,
    packName: EmPackName.Castle,
    wndName: "CrystalWnd",
    Class: CrystalWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //任务
  [EmWindow.TaskWnd]: {
    Type: EmWindow.TaskWnd,
    packName: EmPackName.Task,
    wndName: "TaskWnd",
    Class: TaskWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    mouseThrough: false,
  },
  //邮件
  [EmWindow.MailWnd]: {
    Type: EmWindow.MailWnd,
    packName: EmPackName.Mail,
    wndName: "MailWnd",
    Class: MailWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //写邮件
  [EmWindow.WriteMailWnd]: {
    Type: EmWindow.WriteMailWnd,
    packName: EmPackName.Mail,
    wndName: "WriteMailWnd",
    Class: WriteMailWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //添加好友
  [EmWindow.AddFriendWnd]: {
    Type: EmWindow.AddFriendWnd,
    packName: EmPackName.Mail,
    wndName: "AddFriendWnd",
    Class: AddFriendWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //扫荡
  [EmWindow.Mopup]: {
    Type: EmWindow.Mopup,
    packName: EmPackName.BaseCommon,
    wndName: "MopupWnd",
    Class: MopupWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //悬赏
  [EmWindow.OfferRewardWnd]: {
    Type: EmWindow.OfferRewardWnd,
    packName: EmPackName.Space,
    wndName: "OfferRewardWnd",
    Class: OfferRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //快捷购买
  [EmWindow.BuyFrameI]: {
    Type: EmWindow.BuyFrameI,
    packName: EmPackName.Shop,
    wndName: "BuyFrameI",
    Class: BuyFrameI,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Top,
  },
  //快捷购买
  [EmWindow.BuyFrame2]: {
    Type: EmWindow.BuyFrame2,
    packName: EmPackName.OutCityShop,
    wndName: "BuyFrame2",
    Class: BuyFrame2,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Top,
  },
  //商城
  [EmWindow.ShopWnd]: {
    Type: EmWindow.ShopWnd,
    packName: EmPackName.Shop,
    wndName: "ShopWnd",
    Class: ShopWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Shop,
  },
  //好友
  [EmWindow.FriendWnd]: {
    Type: EmWindow.FriendWnd,
    packName: EmPackName.Friend,
    wndName: "FriendWnd",
    Class: FriendWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: true,
  },
  //赠花
  // [EmWindow.SendFlowersWnd]: { Type: EmWindow.SendFlowersWnd, packName: EmPackName.Friend, wndName: 'SendFlowersWnd', Class: SendFlowersWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: true },
  //添加好友
  [EmWindow.AddFriendsWnd]: {
    Type: EmWindow.AddFriendsWnd,
    packName: EmPackName.Friend,
    wndName: "AddFriendsWnd",
    Class: AddFriendsWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: true,
  },
  [EmWindow.RecommendFriendWnd]: {
    Type: EmWindow.RecommendFriendWnd,
    packName: EmPackName.Friend,
    wndName: "RecommendFriendWnd",
    Class: RecommendFriendWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: true,
  },
  //神学院
  [EmWindow.SeminaryWnd]: {
    Type: EmWindow.SeminaryWnd,
    packName: EmPackName.Castle,
    wndName: "SeminaryWnd",
    Class: SeminaryWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //传送阵
  [EmWindow.TransferBuildWnd]: {
    Type: EmWindow.TransferBuildWnd,
    packName: EmPackName.Castle,
    wndName: "TransferBuildWnd",
    Class: TransferBuildWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //世界地图
  [EmWindow.WorldMapWnd]: {
    Type: EmWindow.WorldMapWnd,
    packName: EmPackName.WorldMap,
    wndName: "WorldMapWnd",
    Class: WorldMapWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //神学院科技升级
  [EmWindow.SeminaryUpWnd]: {
    Type: EmWindow.SeminaryUpWnd,
    packName: EmPackName.Castle,
    wndName: "SeminaryUpWnd",
    Class: SeminaryUpWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //地下迷宫排行榜
  [EmWindow.MazeRankWnd]: {
    Type: EmWindow.MazeRankWnd,
    packName: EmPackName.Maze,
    wndName: "MazeRankWnd",
    Class: MazeRankWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //主界面左侧详情
  [EmWindow.SpaceTaskInfoWnd]: {
    Type: EmWindow.SpaceTaskInfoWnd,
    packName: EmPackName.Home,
    wndName: "SpaceTaskInfoWnd",
    Class: SpaceTaskInfoWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
    ZIndex: UIZOrder.SpaceTaskInfoWnd,
  },
  //聊天窗
  [EmWindow.ChatWnd]: {
    Type: EmWindow.ChatWnd,
    packName: EmPackName.Chat,
    wndName: "ChatWnd",
    Class: ChatWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //聊天表情窗口
  [EmWindow.ChatFaceWnd]: {
    Type: EmWindow.ChatFaceWnd,
    packName: EmPackName.Chat,
    wndName: "ChatFaceWnd",
    Class: ChatFaceWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //聊天菜单
  [EmWindow.ChatItemMenu]: {
    Type: EmWindow.ChatItemMenu,
    packName: EmPackName.Chat,
    wndName: "ChatItemMenu",
    Class: ChatItemMenu,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
  },
  //聊天喇叭窗口
  [EmWindow.ChatBugleWnd]: {
    Type: EmWindow.ChatBugleWnd,
    packName: EmPackName.Chat,
    wndName: "ChatBugleWnd",
    Class: ChatBugleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //赠花
  [EmWindow.SendFlowerWnd]: {
    Type: EmWindow.SendFlowerWnd,
    packName: EmPackName.Chat,
    wndName: "SendFlowerWnd",
    Class: SendFlowerWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //收花
  [EmWindow.ReceiveFlowerWnd]: {
    Type: EmWindow.ReceiveFlowerWnd,
    packName: EmPackName.Chat,
    wndName: "ReceiveFlowerWnd",
    Class: ReceiveFlowerWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //道具tips
  [EmWindow.PropTips]: {
    Type: EmWindow.PropTips,
    packName: EmPackName.Base,
    wndName: "PropTips",
    Class: PropTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //道具tips
  [EmWindow.NewPropTips]: {
    Type: EmWindow.NewPropTips,
    packName: EmPackName.Base,
    wndName: "NewPropTips",
    Class: NewPropTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //道具tips
  [EmWindow.CryStalTips]: {
    Type: EmWindow.CryStalTips,
    packName: EmPackName.Base,
    wndName: "CrystalTips",
    Class: CrystalTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //用于激活特殊坐骑的物品tips
  [EmWindow.MountCardTip]: {
    Type: EmWindow.MountCardTip,
    packName: EmPackName.Base,
    wndName: "MountCardTip",
    Class: MountCardTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //符文石tips
  [EmWindow.RuneTip]: {
    Type: EmWindow.RuneTip,
    packName: EmPackName.Base,
    wndName: "RuneTip",
    Class: RuneTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //合成公式tips
  [EmWindow.ComposeTip]: {
    Type: EmWindow.ComposeTip,
    packName: EmPackName.Base,
    wndName: "ComposeTip",
    Class: ComposeTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //装备tips
  [EmWindow.EquipTip]: {
    Type: EmWindow.EquipTip,
    packName: EmPackName.Base,
    wndName: "EquipTip",
    Class: EquipTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //装备对比tips
  [EmWindow.EquipContrastTips]: {
    Type: EmWindow.EquipContrastTips,
    packName: EmPackName.Base,
    wndName: "EquipContrastTips",
    Class: EquipContrastTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetEquipContrastTips]: {
    Type: EmWindow.PetEquipContrastTips,
    packName: EmPackName.Base,
    wndName: "PetEquipContrastTips",
    Class: PetEquipContrastTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //铁匠铺装备tips
  [EmWindow.ForgeEquipTip]: {
    Type: EmWindow.ForgeEquipTip,
    packName: EmPackName.Base,
    wndName: "ForgeEquipTip",
    Class: ForgeEquipTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //铁匠铺道具tips
  [EmWindow.ForgePropTip]: {
    Type: EmWindow.ForgePropTip,
    packName: EmPackName.Base,
    wndName: "ForgePropTip",
    Class: ForgePropTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //占星tips
  [EmWindow.StarTip]: {
    Type: EmWindow.StarTip,
    packName: EmPackName.Base,
    wndName: "StarTips",
    Class: StarTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //星力tips
  [EmWindow.StarPowerTip]: {
    Type: EmWindow.StarPowerTip,
    packName: EmPackName.Base,
    wndName: "StarPowerTip",
    Class: StarPowerTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //称号tips
  [EmWindow.AppellPowerTip]: {
    Type: EmWindow.AppellPowerTip,
    packName: EmPackName.Base,
    wndName: "AppellPowerTip",
    Class: AppellPowerTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //宠物提示
  [EmWindow.PetTip]: {
    Type: EmWindow.PetTip,
    packName: EmPackName.Base,
    wndName: "PetTip",
    Class: PetTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetSkillTips]: {
    Type: EmWindow.PetSkillTips,
    packName: EmPackName.Base,
    wndName: "PetSkillTips",
    Class: PetSkillTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.Appelltips]: {
    Type: EmWindow.Appelltips,
    packName: EmPackName.Base,
    wndName: "AppellTips",
    Class: Appelltips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //体力tips
  [EmWindow.WearyTips]: {
    Type: EmWindow.WearyTips,
    packName: EmPackName.Base,
    wndName: "WearyTips",
    Class: WearyTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },

  //排行榜
  [EmWindow.Rank]: {
    Type: EmWindow.Rank,
    packName: EmPackName.Base,
    wndName: "RankWnd",
    Class: RankWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //天空之城小地图
  [EmWindow.SmallMapWnd]: {
    Type: EmWindow.SmallMapWnd,
    packName: EmPackName.Home,
    wndName: "SmallMapWnd",
    Class: SmallMapWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //副本小地图
  [EmWindow.CampaignMapWnd]: {
    Type: EmWindow.CampaignMapWnd,
    packName: EmPackName.Home,
    wndName: "SmallMapWnd",
    Class: CampaignMapWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //占星
  [EmWindow.Star]: {
    Type: EmWindow.Star,
    packName: EmPackName.Star,
    wndName: "StarWnd",
    Class: StarWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //占星背包
  [EmWindow.StarBag]: {
    Type: EmWindow.StarBag,
    packName: EmPackName.Star,
    wndName: "StarBagWnd",
    Class: StarBagWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //占星操作
  [EmWindow.StarOperate]: {
    Type: EmWindow.StarOperate,
    packName: EmPackName.Star,
    wndName: "StarOperateWnd",
    Class: StarOperateWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //占星操作
  [EmWindow.StarAutoSetting]: {
    Type: EmWindow.StarAutoSetting,
    packName: EmPackName.Star,
    wndName: "StarAutoSettingWnd",
    Class: StarAutoSettingWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //商店
  [EmWindow.ShopCommWnd]: {
    Type: EmWindow.ShopCommWnd,
    packName: EmPackName.Base,
    wndName: "ShopCommWnd",
    Class: ShopCommWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
  },
  //坐骑
  [EmWindow.MountsWnd]: {
    Type: EmWindow.MountsWnd,
    packName: EmPackName.Mount,
    wndName: "MountsWnd",
    Class: MountsWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //剧情对话
  [EmWindow.Dialog]: {
    Type: EmWindow.Dialog,
    packName: EmPackName.Dialog,
    wndName: "DialogWnd",
    Class: DialogWnd,
    Layer: EmLayer.NOVICE_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //战力提升
  [EmWindow.FightingUpdateWnd]: {
    Type: EmWindow.FightingUpdateWnd,
    packName: EmPackName.BaseCommon,
    wndName: "FightingUpdateWnd",
    Class: FightingUpdateWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: false,
    mouseThrough: true,
    ZIndex: UIZOrder.FightingUpdateWnd,
  },
  //兽魂
  [EmWindow.WildSoulWnd]: {
    Type: EmWindow.WildSoulWnd,
    packName: EmPackName.Mount,
    wndName: "WildSoulWnd",
    Class: WildSoulWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  //弹窗今日不再提示
  [EmWindow.TodayNotAlert]: {
    Type: EmWindow.TodayNotAlert,
    packName: EmPackName.Base,
    wndName: "TodayNotAlertWnd",
    Class: TodayNotAlertWnd,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
    Single: false,
  },
  [EmWindow.GetGoodsAlert]: {
    Type: EmWindow.GetGoodsAlert,
    packName: EmPackName.Base,
    wndName: "GetGoodsAlert",
    Class: GetGoodsAlert,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
    Single: false,
  },
  //坐骑tips
  [EmWindow.MountTips]: {
    Type: EmWindow.MountTips,
    packName: EmPackName.Base,
    wndName: "MountTips",
    Class: MountTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //地下迷宫玩家复活
  [EmWindow.MazeRiverWnd]: {
    Type: EmWindow.MazeRiverWnd,
    packName: EmPackName.Maze,
    wndName: "MazeRiverWnd",
    Class: MazeRiverWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.Welfare]: {
    Type: EmWindow.Welfare,
    packName: EmPackName.Welfare,
    wndName: "WelfareWnd",
    Class: WelfareWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.Funny]: {
    Type: EmWindow.Funny,
    packName: EmPackName.Funny,
    wndName: "FunnyWnd",
    Class: FunnyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.Exchange]: {
    Type: EmWindow.Exchange,
    packName: EmPackName.Funny,
    wndName: "ExchangeWnd",
    Class: ExchangeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //首充送豪礼
  [EmWindow.FirstPayWnd]: {
    Type: EmWindow.FirstPayWnd,
    packName: EmPackName.FirstPay,
    wndName: "FirstPayWnd",
    Class: FirstPayWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //NPC对话框
  [EmWindow.SpaceDialogWnd]: {
    Type: EmWindow.SpaceDialogWnd,
    packName: EmPackName.Dialog,
    wndName: "SpaceDialogWnd",
    Class: SpaceDialogWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.PetLandDialogWnd]: {
    Type: EmWindow.PetLandDialogWnd,
    packName: EmPackName.Dialog,
    wndName: "SpaceDialogWnd",
    Class: PetLandDialogWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.MineralDialogWnd]: {
    Type: EmWindow.MineralDialogWnd,
    packName: EmPackName.Dialog,
    wndName: "SpaceDialogWnd",
    Class: MineralDialogWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.MineralShopWnd]: {
    Type: EmWindow.MineralShopWnd,
    packName: EmPackName.Mineral,
    wndName: "MineralShopWnd",
    Class: MineralShopWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //NPC对话框
  [EmWindow.Setting]: {
    Type: EmWindow.Setting,
    packName: EmPackName.Setting,
    wndName: "SettingWnd",
    Class: SettingWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //好友申请界面
  [EmWindow.FriendInviteWnd]: {
    Type: EmWindow.FriendInviteWnd,
    packName: EmPackName.Friend,
    wndName: "FriendInviteWnd",
    Class: FriendInviteWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //世界BOSS
  [EmWindow.WorldBossWnd]: {
    Type: EmWindow.WorldBossWnd,
    packName: EmPackName.WorldBoss,
    wndName: "WorldBossWnd",
    Class: WorldBossWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //世界BOSS副本场景UI
  [EmWindow.WorldBossSceneWnd]: {
    Type: EmWindow.WorldBossSceneWnd,
    packName: EmPackName.WorldBoss,
    wndName: "WorldBossSceneWnd",
    Class: WorldBossSceneWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //公会
  // [EmWindow.Consortia]: { Type: EmWindow.Consortia, packName: EmPackName.Consortia, wndName: 'ConsortiaWnd', Class: ConsortiaWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },
  [EmWindow.ConsortiaUpgrade]: {
    Type: EmWindow.ConsortiaUpgrade,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaUpgradeWnd",
    Class: ConsortiaUpgradeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaTreasureBox]: {
    Type: EmWindow.ConsortiaTreasureBox,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaTreasureBoxWnd",
    Class: ConsortiaTreasureBoxWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaTransfer]: {
    Type: EmWindow.ConsortiaTransfer,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaTransferWnd",
    Class: ConsortiaTransferWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaSkillTower]: {
    Type: EmWindow.ConsortiaSkillTower,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaSkillTowerWnd",
    Class: ConsortiaSkillTowerWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaRename]: {
    Type: EmWindow.ConsortiaRename,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaRenameWnd",
    Class: ConsortiaRenameWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaPermission]: {
    Type: EmWindow.ConsortiaPermission,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaPermissionWnd",
    Class: ConsortiaPermissionWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaEmail]: {
    Type: EmWindow.ConsortiaEmail,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaEmailWnd",
    Class: ConsortiaEmailWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaEmailMember]: {
    Type: EmWindow.ConsortiaEmailMember,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaEmailMemberWnd",
    Class: ConsortiaEmailMemberWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaCreate]: {
    Type: EmWindow.ConsortiaCreate,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaCreateWnd",
    Class: ConsortiaCreateWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaContribute]: {
    Type: EmWindow.ConsortiaContribute,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaContributeWnd",
    Class: ConsortiaContributeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaAuditing]: {
    Type: EmWindow.ConsortiaAuditing,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaAuditingWnd",
    Class: ConsortiaAuditingWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaApply]: {
    Type: EmWindow.ConsortiaApply,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaApplyWnd",
    Class: ConsortiaApplyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaRecruitMember]: {
    Type: EmWindow.ConsortiaRecruitMember,
    packName: EmPackName.BaseCommon,
    wndName: "QuickInviteWnd",
    Class: ConsortiaRecruitMemberWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaInfoChange]: {
    Type: EmWindow.ConsortiaInfoChange,
    packName: EmPackName.BaseCommon,
    wndName: "QuickInviteWnd",
    Class: ConsortiaInfoChangeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaDevil]: {
    Type: EmWindow.ConsortiaDevil,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaDevilWnd",
    Class: ConsortiaDevilWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaEvent]: {
    Type: EmWindow.ConsortiaEvent,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaEventWnd",
    Class: ConsortiaEventWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaStorageWnd]: {
    Type: EmWindow.ConsortiaStorageWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaStorageWnd",
    Class: ConsortiaStorageWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaInfoWnd]: {
    Type: EmWindow.ConsortiaInfoWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaInfoWnd",
    Class: ConsortiaInfoWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaPlayerMenu]: {
    Type: EmWindow.ConsortiaPlayerMenu,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaPlayerMenu",
    Class: ConsortiaPlayerMenu,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //世界BOSS玩家复活
  [EmWindow.WorldBossRiverWnd]: {
    Type: EmWindow.WorldBossRiverWnd,
    packName: EmPackName.WorldBoss,
    wndName: "WorldBossRiverWnd",
    Class: WorldBossRiverWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //战场入口
  [EmWindow.RvrBattleWnd]: {
    Type: EmWindow.RvrBattleWnd,
    packName: EmPackName.RvRBattle,
    wndName: "RvrBattleWnd",
    Class: RvrBattleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //战场右侧信息显示
  [EmWindow.RvrBattleMapRightWnd]: {
    Type: EmWindow.RvrBattleMapRightWnd,
    packName: EmPackName.RvRBattle,
    wndName: "RvrBattleMapRightWnd",
    Class: RvrBattleMapRightWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //战场顶部中间阵营信息显示
  [EmWindow.RvrBattleMapTopCenterWnd]: {
    Type: EmWindow.RvrBattleMapTopCenterWnd,
    packName: EmPackName.RvRBattle,
    wndName: "RvrBattleMapTopCenterWnd",
    Class: RvrBattleMapTopCenterWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //战场顶部中间阵营信息显示
  [EmWindow.RvrBattleMapCombatWnd]: {
    Type: EmWindow.RvrBattleMapCombatWnd,
    packName: EmPackName.RvRBattle,
    wndName: "RvrBattleMapCombatWnd",
    Class: RvrBattleMapCombatWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //战场结算
  [EmWindow.RvrBattleResultWnd]: {
    Type: EmWindow.RvrBattleResultWnd,
    packName: EmPackName.RvRBattle,
    wndName: "RvrBattleResultWnd",
    Class: RvrBattleResultWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //战场复活等待
  [EmWindow.RvrBattlePlayerRiverWnd]: {
    Type: EmWindow.RvrBattlePlayerRiverWnd,
    packName: EmPackName.RvRBattle,
    wndName: "RvrBattlePlayerRiverWnd",
    Class: RvrBattlePlayerRiverWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //战场提交资源
  [EmWindow.RvrBattleGetResourceWnd]: {
    Type: EmWindow.RvrBattleGetResourceWnd,
    packName: EmPackName.RvRBattle,
    wndName: "RvrBattleGetResourceWnd",
    Class: RvrBattleGetResourceWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //全部排行榜
  [EmWindow.Sort]: {
    Type: EmWindow.Sort,
    packName: EmPackName.Sort,
    wndName: "SortWnd",
    Class: SortWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //农场
  [EmWindow.Farm]: {
    Type: EmWindow.Farm,
    packName: EmPackName.Farm,
    wndName: "FarmWnd",
    Class: FarmWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.FarmLandMenu]: {
    Type: EmWindow.FarmLandMenu,
    packName: EmPackName.Farm,
    wndName: "FarmLandMenuWnd",
    Class: FarmLandMenuWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.WarlordsRank]: {
    Type: EmWindow.WarlordsRank,
    packName: EmPackName.Sort,
    wndName: "WarlordsWnd",
    Class: WarlordsWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //农场商城
  [EmWindow.FarmShopWnd]: {
    Type: EmWindow.FarmShopWnd,
    packName: EmPackName.Farm,
    wndName: "FarmShopWnd",
    Class: FarmShopWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //农场日志
  [EmWindow.FarmEventWnd]: {
    Type: EmWindow.FarmEventWnd,
    packName: EmPackName.Farm,
    wndName: "FarmEventWnd",
    Class: FarmEventWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //农场土地升级
  [EmWindow.FarmLandUpWnd]: {
    Type: EmWindow.FarmLandUpWnd,
    packName: EmPackName.Farm,
    wndName: "FarmLandUpWnd",
    Class: FarmLandUpWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //种子tips
  [EmWindow.FarmBagTipWnd]: {
    Type: EmWindow.FarmBagTipWnd,
    packName: EmPackName.Farm,
    wndName: "FarmBagTipWnd",
    Class: FarmBagTipWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.FarmPetSelect]: {
    Type: EmWindow.FarmPetSelect,
    packName: EmPackName.Farm,
    wndName: "FarmPetSelectWnd",
    Class: FarmPetSelectWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //公会宝箱
  [EmWindow.ConsortiaPrizeAllotWnd]: {
    Type: EmWindow.ConsortiaPrizeAllotWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaPrizeAllotWnd",
    Class: ConsortiaPrizeAllotWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //有奖问答
  [EmWindow.QuestionNaireWnd]: {
    Type: EmWindow.QuestionNaireWnd,
    packName: EmPackName.QuestionNaire,
    wndName: "QuestionNaireWnd",
    Class: QuestionNaireWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //问卷调查
  [EmWindow.QuestionWnd]: {
    Type: EmWindow.QuestionWnd,
    packName: EmPackName.QuestionNaire,
    wndName: "QuestionWnd",
    Class: QuestionWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //公会排行榜
  [EmWindow.ConsortiaRankWnd]: {
    Type: EmWindow.ConsortiaRankWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaRankWnd",
    Class: ConsortiaRankWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //公会战赛程
  [EmWindow.GvgRankListWnd]: {
    Type: EmWindow.GvgRankListWnd,
    packName: EmPackName.Consortia,
    wndName: "GvgRankListWnd",
    Class: GvgRankListWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //参战成员列表
  [EmWindow.GvgEnterWarWnd]: {
    Type: EmWindow.GvgEnterWarWnd,
    packName: EmPackName.Consortia,
    wndName: "GvgEnterWarWnd",
    Class: GvgEnterWarWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //公会战添加成员
  [EmWindow.GvgAddMembersWnd]: {
    Type: EmWindow.GvgAddMembersWnd,
    packName: EmPackName.Consortia,
    wndName: "GvgAddMembersWnd",
    Class: GvgAddMembersWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //公会战
  [EmWindow.GvgBattleWnd]: {
    Type: EmWindow.GvgBattleWnd,
    packName: EmPackName.Consortia,
    wndName: "GvgBattleWnd",
    Class: GvgBattleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //公会战复活
  [EmWindow.GvgRiverWnd]: {
    Type: EmWindow.GvgRiverWnd,
    packName: EmPackName.Consortia,
    wndName: "GvgRiverWnd",
    Class: GvgRiverWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //公会战buff tips
  [EmWindow.GvgBufferTips]: {
    Type: EmWindow.GvgBufferTips,
    packName: EmPackName.Base,
    wndName: "GvgBufferTips",
    Class: GvgBufferTips,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //VIP特权
  [EmWindow.VipPrivilege]: {
    Type: EmWindow.VipPrivilege,
    packName: EmPackName.Shop,
    wndName: "VIPPrivilegeWnd",
    Class: VipPrivilegeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Shop,
  },
  //公会祭坛
  [EmWindow.ConsortiaPrayWnd]: {
    Type: EmWindow.ConsortiaPrayWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaPrayWnd",
    Class: ConsortiaPrayWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //称号
  [EmWindow.Appell]: {
    Type: EmWindow.Appell,
    packName: EmPackName.Appell,
    wndName: "AppellWnd",
    Class: AppellWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //公会秘境右侧UI
  [EmWindow.ConsortiaSecretInfoWnd]: {
    Type: EmWindow.ConsortiaSecretInfoWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaSecretInfoWnd",
    Class: ConsortiaSecretInfoWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.AppellGetTips]: {
    Type: EmWindow.AppellGetTips,
    packName: EmPackName.Appell,
    wndName: "AppellGetTips",
    Class: AppellGetTips,
    Layer: EmLayer.STAGE_TIP_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //英灵
  [EmWindow.Pet]: {
    Type: EmWindow.Pet,
    packName: EmPackName.Pet,
    wndName: "PetWnd",
    Class: PetWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetAttrTip]: {
    Type: EmWindow.PetAttrTip,
    packName: EmPackName.Pet,
    wndName: "PetAttrTip",
    Class: PetAttrTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetPotency]: {
    Type: EmWindow.PetPotency,
    packName: EmPackName.Pet,
    wndName: "PetPotencyWnd",
    Class: PetPotencyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetRename]: {
    Type: EmWindow.PetRename,
    packName: EmPackName.Pet,
    wndName: "PetRenameWnd",
    Class: PetRenameWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetSelect]: {
    Type: EmWindow.PetSelect,
    packName: EmPackName.Pet,
    wndName: "PetSelectIframe",
    Class: PetSelectWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetSaveSureWnd]: {
    Type: EmWindow.PetSaveSureWnd,
    packName: EmPackName.Pet,
    wndName: "PetSaveSureWnd",
    Class: PetSaveSureWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetSaveWnd]: {
    Type: EmWindow.PetSaveWnd,
    packName: EmPackName.Pet,
    wndName: "PetSaveWnd",
    Class: PetSaveWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  //英灵挑战
  [EmWindow.PetChallenge]: {
    Type: EmWindow.PetChallenge,
    packName: EmPackName.PetChallenge,
    wndName: "PetChallengeWnd",
    Class: PetChallengeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  [EmWindow.PetChallengeAdjust]: {
    Type: EmWindow.PetChallengeAdjust,
    packName: EmPackName.PetChallenge,
    wndName: "PetChallengeAdjustWnd",
    Class: PetChallengeAdjustWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  [EmWindow.PetChallengeReward]: {
    Type: EmWindow.PetChallengeReward,
    packName: EmPackName.PetChallenge,
    wndName: "PetChallengeRewardWnd",
    Class: PetChallengeRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  [EmWindow.PetChallengeEvent]: {
    Type: EmWindow.PetChallengeEvent,
    packName: EmPackName.PetChallenge,
    wndName: "PetChallengeEventWnd",
    Class: PetChallengeEventWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  [EmWindow.PetChallengeConfirm]: {
    Type: EmWindow.PetChallengeConfirm,
    packName: EmPackName.PetChallenge,
    wndName: "PetChallengeConfirmWnd",
    Class: PetChallengeConfirmWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  [EmWindow.PetChallengeRank]: {
    Type: EmWindow.PetChallengeRank,
    packName: EmPackName.PetChallenge,
    wndName: "PetChallengeRankWnd",
    Class: PetChallengeRankWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  //众神之战战报
  [EmWindow.WarlordsFinalReportWnd]: {
    Type: EmWindow.WarlordsFinalReportWnd,
    packName: EmPackName.Warlords,
    wndName: "WarlordsFinalReportWnd",
    Class: WarlordsFinalReportWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //众神之战房间
  [EmWindow.WarlordRoomWnd]: {
    Type: EmWindow.WarlordRoomWnd,
    packName: EmPackName.Warlords,
    wndName: "WarlordRoomWnd",
    Class: WarlordRoomWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Room,
  },
  //众神之战欢乐竞猜人员选择界面
  [EmWindow.WarlordsBetSelectWnd]: {
    Type: EmWindow.WarlordsBetSelectWnd,
    packName: EmPackName.Warlords,
    wndName: "WarlordsBetSelectWnd",
    Class: WarlordsBetSelectWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },
  //众神之战欢乐竞猜界面
  [EmWindow.WarlordsBetWnd]: {
    Type: EmWindow.WarlordsBetWnd,
    packName: EmPackName.Warlords,
    wndName: "WarlordsBetWnd",
    Class: WarlordsBetWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  //众神之战奖励列表
  [EmWindow.WarlordsCheckRewardWnd]: {
    Type: EmWindow.WarlordsCheckRewardWnd,
    packName: EmPackName.Warlords,
    wndName: "WarlordsCheckRewardWnd",
    Class: WarlordsCheckRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommCenter,
  },
  //众神之战主界面入口
  [EmWindow.WarlordsMainWnd]: {
    Type: EmWindow.WarlordsMainWnd,
    packName: EmPackName.Warlords,
    wndName: "WarlordsMainWnd",
    Class: WarlordsMainWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //众神之战预赛结果
  [EmWindow.WarlordsPrelimReportWnd]: {
    Type: EmWindow.WarlordsPrelimReportWnd,
    packName: EmPackName.Warlords,
    wndName: "WarlordsPrelimReportWnd",
    Class: WarlordsPrelimReportWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommBottom,
  },
  //众神之战获奖名单
  [EmWindow.WarlordsWinPrizesWnd]: {
    Type: EmWindow.WarlordsWinPrizesWnd,
    packName: EmPackName.Warlords,
    wndName: "WarlordsWinPrizesWnd",
    Class: WarlordsWinPrizesWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },

  //个人中心
  [EmWindow.PersonalCenter]: {
    Type: EmWindow.PersonalCenter,
    packName: EmPackName.PersonalCenter,
    wndName: "PersonalCenterWnd",
    Class: PersonalCenterWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.BattleSettingWnd]: {
    Type: EmWindow.BattleSettingWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "BattleSettingWnd",
    Class: BattleSettingWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.CheckMailWnd]: {
    Type: EmWindow.CheckMailWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "CheckMailWnd",
    Class: CheckMailWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SuggestWnd]: {
    Type: EmWindow.SuggestWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "SuggestWnd",
    Class: SuggestWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.CustomerServiceWnd]: {
    Type: EmWindow.CustomerServiceWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "CustomerServiceWnd",
    Class: CustomerServiceWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Top,
  },
  [EmWindow.ServiceReplyWnd]: {
    Type: EmWindow.ServiceReplyWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "ServiceReplyWnd",
    Class: ServiceReplyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ChangePasswordWnd]: {
    Type: EmWindow.ChangePasswordWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "ChangePasswordWnd",
    Class: ChangePasswordWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SetPasswordWnd]: {
    Type: EmWindow.SetPasswordWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "SetPasswordWnd",
    Class: SetPasswordWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.InputPasswordWnd]: {
    Type: EmWindow.InputPasswordWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "InputPasswordWnd",
    Class: InputPasswordWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ShortCutSetWnd]: {
    Type: EmWindow.ShortCutSetWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "ShortCutSetWnd",
    Class: ShortCutSetWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OfficialAccountWnd]: {
    Type: EmWindow.OfficialAccountWnd,
    packName: EmPackName.PersonalCenter,
    wndName: "OfficialAccountWnd",
    Class: OfficialAccountWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //英灵兑换
  [EmWindow.PetExchangeShopWnd]: {
    Type: EmWindow.PetExchangeShopWnd,
    packName: EmPackName.Space,
    wndName: "PetExchangeShopWnd",
    Class: PetExchangeShopWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.TreasureClaimMapWnd]: {
    Type: EmWindow.TreasureClaimMapWnd,
    packName: EmPackName.TreasureMap,
    wndName: "TreasureClaimMapWnd",
    Class: TreasureClaimMapWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.TreasureMapWnd]: {
    Type: EmWindow.TreasureMapWnd,
    packName: EmPackName.TreasureMap,
    wndName: "TreasureMapWnd",
    Class: TreasureMapWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.BufferTips]: {
    Type: EmWindow.BufferTips,
    packName: EmPackName.Base,
    wndName: "BufferTips",
    Class: BufferTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },
  [EmWindow.ConsortiaElectionWnd]: {
    Type: EmWindow.ConsortiaElectionWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaElectionWnd",
    Class: ConsortiaElectionWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //查看玩家信息
  [EmWindow.PlayerInfoWnd]: {
    Type: EmWindow.PlayerInfoWnd,
    packName: EmPackName.PlayerInfo,
    wndName: "PlayerInfoWnd",
    Class: PlayerInfoWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: true,
  },
  //玩家资料
  [EmWindow.PlayerProfileWnd]: {
    Type: EmWindow.PlayerProfileWnd,
    packName: EmPackName.PlayerInfo,
    wndName: "PlayerProfileWnd",
    Class: PlayerProfileWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: true,
  },
  [EmWindow.PlayerMountWnd]: {
    Type: EmWindow.PlayerMountWnd,
    packName: EmPackName.PlayerInfo,
    wndName: "PlayerMountWnd",
    Class: PlayerMountWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.MyMountWnd]: {
    Type: EmWindow.MyMountWnd,
    packName: EmPackName.PlayerInfo,
    wndName: "MyMountWnd",
    Class: MyMountWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.MyPetWnd]: {
    Type: EmWindow.MyPetWnd,
    packName: EmPackName.PlayerInfo,
    wndName: "MyPetWnd",
    Class: MyPetWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.PlayerPetWnd]: {
    Type: EmWindow.PlayerPetWnd,
    packName: EmPackName.PlayerInfo,
    wndName: "PlayerPetWnd",
    Class: PlayerPetWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.LookPlayerList]: {
    Type: EmWindow.LookPlayerList,
    packName: EmPackName.PlayerInfo,
    wndName: "LookPlayerList",
    Class: LookPlayerList,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
  },
  [EmWindow.OuterCityOperateMenu]: {
    Type: EmWindow.OuterCityOperateMenu,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityOperateMenu",
    Class: OuterCityOperateMenu,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityTransmitWnd]: {
    Type: EmWindow.OuterCityTransmitWnd,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityTransmitWnd",
    Class: OuterCityTransmitWnd,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityFieldInfoWnd]: {
    Type: EmWindow.OuterCityFieldInfoWnd,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityFieldInfoWnd",
    Class: OuterCityFieldInfoWnd,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityCastleTips]: {
    Type: EmWindow.OuterCityCastleTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityCastleTips",
    Class: OuterCityCastleTips,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityArmyTips]: {
    Type: EmWindow.OuterCityArmyTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityArmyTips",
    Class: OuterCityArmyTips,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityFieldTips]: {
    Type: EmWindow.OuterCityFieldTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityFieldTips",
    Class: OuterCityFieldTips,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityCastleInfoWnd]: {
    Type: EmWindow.OuterCityCastleInfoWnd,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityCastleInfoWnd",
    Class: OuterCityCastleInfoWnd,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.Hook]: {
    Type: EmWindow.Hook,
    packName: EmPackName.Hook,
    wndName: "HookWnd",
    Class: HookWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: true,
  },
  [EmWindow.QuantitySelector]: {
    Type: EmWindow.QuantitySelector,
    packName: EmPackName.BaseCommon,
    wndName: "QuantitySelector",
    Class: QuantitySelector,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SinglePassBugleWnd]: {
    Type: EmWindow.SinglePassBugleWnd,
    packName: EmPackName.SinglePass,
    wndName: "SinglePassBugleWnd",
    Class: SinglePassBugleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SinglepassResultWnd]: {
    Type: EmWindow.SinglepassResultWnd,
    packName: EmPackName.SinglePass,
    wndName: "SinglepassResultWnd",
    Class: SinglepassResultWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SinglePassWnd]: {
    Type: EmWindow.SinglePassWnd,
    packName: EmPackName.SinglePass,
    wndName: "SinglePassWnd",
    Class: SinglePassWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SinglePassRankWnd]: {
    Type: EmWindow.SinglePassRankWnd,
    packName: EmPackName.SinglePass,
    wndName: "SinglePassRankWnd",
    Class: SinglePassRankWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MountInfoWnd]: {
    Type: EmWindow.MountInfoWnd,
    packName: EmPackName.Mount,
    wndName: "MountInfoWnd",
    Class: MountInfoWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityResourceInfoWnd]: {
    Type: EmWindow.OuterCityResourceInfoWnd,
    packName: EmPackName.Castle,
    wndName: "OuterCityResourceInfoWnd",
    Class: OuterCityResourceInfoWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PotionBufferTips]: {
    Type: EmWindow.PotionBufferTips,
    packName: EmPackName.Base,
    wndName: "PotionBufferTips",
    Class: PotionBufferTips,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.UseGoodsAlert]: {
    Type: EmWindow.UseGoodsAlert,
    packName: EmPackName.Base,
    wndName: "UseGoodsAlert",
    Class: UseGoodsAlert,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.BuyGoodsAlert]: {
    Type: EmWindow.BuyGoodsAlert,
    packName: EmPackName.Base,
    wndName: "BuyGoodsAlert",
    Class: BuyGoodsAlert,
    Layer: EmLayer.GAME_TOP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.WeakNetWnd]: {
    Type: EmWindow.WeakNetWnd,
    packName: EmPackName.Base,
    wndName: "HintWnd",
    Class: WeakNetWnd,
    Layer: EmLayer.STAGE_TIP_LAYER,
    Model: false,
    mouseThrough: true,
    ShowLoading: false,
    Single: true,
  },
  [EmWindow.HintWnd]: {
    Type: EmWindow.HintWnd,
    packName: EmPackName.Base,
    wndName: "HintWnd",
    Class: HintWnd,
    Layer: EmLayer.STAGE_TIP_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
    Single: true,
    ZIndex: 9999,
  },
  [EmWindow.Waiting]: {
    Type: EmWindow.Waiting,
    packName: EmPackName.Waiting,
    wndName: "WaitingWnd",
    Class: WaitingWnd,
    Layer: EmLayer.STAGE_TIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.CumulativeRechargeItemInfoWnd]: {
    Type: EmWindow.CumulativeRechargeItemInfoWnd,
    packName: EmPackName.Funny,
    wndName: "CumulativeRechargeItemInfoWnd",
    Class: CumulativeRechargeItemInfoWnd,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  // [EmWindow.FightingWnd]: { Type: EmWindow.FightingWnd, packName: EmPackName.Home, wndName: 'FightingWnd', Class: FightingWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },
  [EmWindow.ImprovePowerWnd]: {
    Type: EmWindow.ImprovePowerWnd,
    packName: EmPackName.Home,
    wndName: "ImprovePowerWnd",
    Class: ImprovePowerWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.FightingDescribleWnd]: {
    Type: EmWindow.FightingDescribleWnd,
    packName: EmPackName.Home,
    wndName: "FightingDescribleWnd",
    Class: FightingDescribleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.FightingPetWnd]: {
    Type: EmWindow.FightingPetWnd,
    packName: EmPackName.Home,
    wndName: "FightingPetWnd",
    Class: FightingPetWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ExpBackShowTipsWnd]: {
    Type: EmWindow.ExpBackShowTipsWnd,
    packName: EmPackName.ExpBack,
    wndName: "ExpBackShowTipsWnd",
    Class: ExpBackShowTipsWnd,
    Layer: EmLayer.GAME_TOP_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
    Single: false,
    ZIndex: 9999,
  },
  // [EmWindow.FashionSwitchTipsWnd]: { Type: EmWindow.FashionSwitchTipsWnd, packName: EmPackName.Bag, wndName: 'FashionSwitchTipsWnd', Class: FashionSwitchTipsWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false, ShowLoading: false, Single: false },
  [EmWindow.OuterCityShopWnd]: {
    Type: EmWindow.OuterCityShopWnd,
    packName: EmPackName.OutCityShop,
    wndName: "OuterCityShopWnd",
    Class: OuterCityShopWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ShowLoading: false,
    Single: false,
  },
  [EmWindow.ConsortiaSplitWnd]: {
    Type: EmWindow.ConsortiaSplitWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaSplitWnd",
    Class: ConsortiaSplitWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.MountRefiningWnd]: {
    Type: EmWindow.MountRefiningWnd,
    packName: EmPackName.Mount,
    wndName: "MountRefiningWnd",
    Class: MountRefiningWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.PlayerDescribeWnd]: {
    Type: EmWindow.PlayerDescribeWnd,
    packName: EmPackName.Home,
    wndName: "PlayerDescribeWnd",
    Class: PlayerDescribeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MiniGameWnd]: {
    Type: EmWindow.MiniGameWnd,
    packName: EmPackName.GemMaze,
    wndName: "MiniGameWnd",
    Class: MiniGameWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.GemMazeWnd]: {
    Type: EmWindow.GemMazeWnd,
    packName: EmPackName.GemMaze,
    wndName: "GemMazeWnd",
    Class: GemMazeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.GemMazeRankWnd]: {
    Type: EmWindow.GemMazeRankWnd,
    packName: EmPackName.GemMaze,
    wndName: "GemMazeRankWnd",
    Class: GemMazeRankWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.GemMazeBagWnd]: {
    Type: EmWindow.GemMazeBagWnd,
    packName: EmPackName.GemMaze,
    wndName: "GemMazeBagWnd",
    Class: GemMazeBagWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MonopolyFinishWnd]: {
    Type: EmWindow.MonopolyFinishWnd,
    packName: EmPackName.Monopoly,
    wndName: "MonopolyFinishWnd",
    Class: MonopolyFinishWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MonopolyResultWnd]: {
    Type: EmWindow.MonopolyResultWnd,
    packName: EmPackName.Monopoly,
    wndName: "MonopolyResultWnd",
    Class: MonopolyResultWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ChooseDiceWnd]: {
    Type: EmWindow.ChooseDiceWnd,
    packName: EmPackName.Monopoly,
    wndName: "ChooseDiceWnd",
    Class: ChooseDiceWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MonopolyDiceWnd]: {
    Type: EmWindow.MonopolyDiceWnd,
    packName: EmPackName.Monopoly,
    wndName: "MonopolyDiceWnd",
    Class: MonopolyDiceWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.CrossPvPSuccessWnd]: {
    Type: EmWindow.CrossPvPSuccessWnd,
    packName: EmPackName.CrossPvP,
    wndName: "CrossPvPSuccessWnd",
    Class: CrossPvPSuccessWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.CorssPvPCenterShowWnd]: {
    Type: EmWindow.CorssPvPCenterShowWnd,
    packName: EmPackName.CrossPvP,
    wndName: "CorssPvPCenterShowWnd",
    Class: CorssPvPCenterShowWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.CrossPvPVoteWnd]: {
    Type: EmWindow.CrossPvPVoteWnd,
    packName: EmPackName.CrossPvP,
    wndName: "CrossPvPVoteWnd",
    Class: CrossPvPVoteWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  // [EmWindow.FunPreviewWnd]: { Type: EmWindow.FunPreviewWnd, packName: EmPackName.FunPreview, wndName: 'FunPreviewWnd', Class: FunPreviewWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },
  [EmWindow.FunOpenWnd]: {
    Type: EmWindow.FunOpenWnd,
    packName: EmPackName.FunPreview,
    wndName: "FunOpenWnd",
    Class: FunOpenWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //通行证
  [EmWindow.PassAdvanceWnd]: {
    Type: EmWindow.PassAdvanceWnd,
    packName: EmPackName.Welfare,
    wndName: "PassAdvanceWnd",
    Class: PassAdvanceWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PassBuyWnd]: {
    Type: EmWindow.PassBuyWnd,
    packName: EmPackName.Welfare,
    wndName: "PassBuyWnd",
    Class: PassBuyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PassRewardWnd]: {
    Type: EmWindow.PassRewardWnd,
    packName: EmPackName.Welfare,
    wndName: "PassRewardWnd",
    Class: PassRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaBossWnd]: {
    Type: EmWindow.ConsortiaBossWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaBossWnd",
    Class: ConsortiaBossWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaBossRewardWnd]: {
    Type: EmWindow.ConsortiaBossRewardWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaBossRewardWnd",
    Class: ConsortiaBossRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaBossTaskView]: {
    Type: EmWindow.ConsortiaBossTaskView,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaBossTaskView",
    Class: ConsortiaBossTaskView,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.ConsortiaBossSceneWnd]: {
    Type: EmWindow.ConsortiaBossSceneWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaBossSceneWnd",
    Class: ConsortiaBossSceneWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.ConsortiaBossDialogWnd]: {
    Type: EmWindow.ConsortiaBossDialogWnd,
    packName: EmPackName.Dialog,
    wndName: "SpaceDialogWnd",
    Class: ConsortiaBossDialogWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //内存查看
  [EmWindow.MemToolWnd]: {
    Type: EmWindow.MemToolWnd,
    packName: EmPackName.MemTool,
    wndName: "MemToolWnd",
    Class: MemToolWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ChatAirBubbleWnd]: {
    Type: EmWindow.ChatAirBubbleWnd,
    packName: EmPackName.ChatAirBubble,
    wndName: "ChatAirBubbleWnd",
    Class: ChatAirBubbleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //保卫英灵岛
  [EmWindow.PetGuardWnd]: {
    Type: EmWindow.PetGuardWnd,
    packName: EmPackName.PetGuard,
    wndName: "PetGuardWnd",
    Class: PetGuardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetGuardTipWnd]: {
    Type: EmWindow.PetGuardTipWnd,
    packName: EmPackName.PetGuard,
    wndName: "PetGuardTipWnd",
    Class: PetGuardTipWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.LogWnd]: {
    Type: EmWindow.LogWnd,
    packName: EmPackName.BaseCommon,
    wndName: "LogWnd",
    Class: LogWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.ConsortiaTreasureWnd]: {
    Type: EmWindow.ConsortiaTreasureWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaTreasureWnd",
    Class: ConsortiaTreasureWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  //挑战CD加速弹窗
  [EmWindow.OuterCityTreasureCDAlertWnd]: {
    Type: EmWindow.OuterCityTreasureCDAlertWnd,
    packName: EmPackName.Home,
    wndName: "OuterCityTreasureCDAlertWnd",
    Class: OuterCityTreasureCDAlertWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //挑战CD详情显示
  [EmWindow.OuterCityTreasureCDWnd]: {
    Type: EmWindow.OuterCityTreasureCDWnd,
    packName: EmPackName.Home,
    wndName: "OuterCityTreasureCDWnd",
    Class: OuterCityTreasureCDWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.OuterCityTreasureWnd]: {
    Type: EmWindow.OuterCityTreasureWnd,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityTreasureWnd",
    Class: OuterCityTreasureWnd,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //战斗编辑
  [EmWindow.SkillEditWnd]: {
    Type: EmWindow.SkillEditWnd,
    packName: EmPackName.SkillEdit,
    wndName: "SkillEditWnd",
    Class: SkillEditWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SkillEditSelectWnd]: {
    Type: EmWindow.SkillEditSelectWnd,
    packName: EmPackName.SkillEdit,
    wndName: "SkillEditSelectWnd",
    Class: SkillEditSelectWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SkillEditPetWnd]: {
    Type: EmWindow.SkillEditPetWnd,
    packName: EmPackName.SkillEdit,
    wndName: "SkillEditPetWnd",
    Class: SkillEditPetWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //多选宝箱
  [EmWindow.MultiBoxSelectWnd]: {
    Type: EmWindow.MultiBoxSelectWnd,
    packName: EmPackName.Base,
    wndName: "MultiBoxSelectWnd",
    Class: MultiBoxSelectWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.StarSellSelectWnd]: {
    Type: EmWindow.StarSellSelectWnd,
    packName: EmPackName.Star,
    wndName: "StarSellSelectWnd",
    Class: StarSellSelectWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //英灵战役
  [EmWindow.PetCampaignWnd]: {
    Type: EmWindow.PetCampaignWnd,
    packName: EmPackName.PetCampaign,
    wndName: "PetCampaignWnd",
    Class: PetCampaignWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetGetRewardWnd]: {
    Type: EmWindow.PetGetRewardWnd,
    packName: EmPackName.PetCampaign,
    wndName: "PetGetRewardWnd",
    Class: PetGetRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ScreenWnd]: {
    Type: EmWindow.ScreenWnd,
    packName: EmPackName.Pet,
    wndName: "ScreenWnd",
    Class: ScreenWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetEuipTrainWnd]: {
    Type: EmWindow.PetEuipTrainWnd,
    packName: EmPackName.Pet,
    wndName: "PetEuipTrainWnd",
    Class: PetEuipTrainWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetEquipSuccinctWnd]: {
    Type: EmWindow.PetEquipSuccinctWnd,
    packName: EmPackName.Pet,
    wndName: "PetEquipSuccinctWnd",
    Class: PetEquipSuccinctWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetEquipStrenOkWnd]: {
    Type: EmWindow.PetEquipStrenOkWnd,
    packName: EmPackName.Pet,
    wndName: "PetEquipStrenOkWnd",
    Class: PetEquipStrenOkWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.RuneHoleHelpWnd]: {
    Type: EmWindow.RuneHoleHelpWnd,
    packName: EmPackName.Skill,
    wndName: "RuneHoleHelpWnd",
    Class: RuneHoleHelpWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetCampaignResultWnd]: {
    Type: EmWindow.PetCampaignResultWnd,
    packName: EmPackName.PetCampaign,
    wndName: "PetCampaignResultWnd",
    Class: PetCampaignResultWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ChatTranslateSetWnd]: {
    Type: EmWindow.ChatTranslateSetWnd,
    packName: EmPackName.Chat,
    wndName: "ChatTranslateSetWnd",
    Class: ChatTranslateSetWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PetEquipTip]: {
    Type: EmWindow.PetEquipTip,
    packName: EmPackName.Base,
    wndName: "PetEquipTip",
    Class: PetEquipTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MountShareWnd]: {
    Type: EmWindow.MountShareWnd,
    packName: EmPackName.Mount,
    wndName: "MountShareWnd",
    Class: MountShareWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.EvaluationWnd]: {
    Type: EmWindow.EvaluationWnd,
    packName: EmPackName.Evaluation,
    wndName: "EvaluationWnd",
    Class: EvaluationWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MicroAppWnd]: {
    Type: EmWindow.MicroAppWnd,
    packName: EmPackName.MicroApp,
    wndName: "MicroAppWnd",
    Class: MicroAppWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //打脸图
  [EmWindow.FaceSlappingWnd]: {
    Type: EmWindow.FaceSlappingWnd,
    packName: EmPackName.FaceSlapping,
    wndName: "FaceSlappingWnd",
    Class: FaceSlappingWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //折扣卷
  [EmWindow.DiscountWnd]: {
    Type: EmWindow.DiscountWnd,
    packName: EmPackName.Shop,
    wndName: "DiscountWnd",
    Class: DiscountWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Shop,
  },
  [EmWindow.GoldenSheepBoxWnd]: {
    Type: EmWindow.GoldenSheepBoxWnd,
    packName: EmPackName.GoldenSheep,
    wndName: "GoldenSheepBoxWnd",
    Class: GoldenSheepBoxWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.GoldenSheepWnd]: {
    Type: EmWindow.GoldenSheepWnd,
    packName: EmPackName.GoldenSheep,
    wndName: "GoldenSheepWnd",
    Class: GoldenSheepWnd,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //英灵远征
  [EmWindow.RemotePetReadyWnd]: {
    Type: EmWindow.RemotePetReadyWnd,
    packName: EmPackName.RemotePet,
    wndName: "RemotePetReadyFrame",
    Class: RemotePetReadyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.RemotePetTurnWnd]: {
    Type: EmWindow.RemotePetTurnWnd,
    packName: EmPackName.RemotePet,
    wndName: "RemotePetTurnFrame",
    Class: RemotePetTurnWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.RemotePetChallengeWnd]: {
    Type: EmWindow.RemotePetChallengeWnd,
    packName: EmPackName.RemotePet,
    wndName: "RemotePetChallengeFrame",
    Class: RemotePetChallengeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },
  [EmWindow.RemoteMopupWnd]: {
    Type: EmWindow.RemoteMopupWnd,
    packName: EmPackName.BaseCommon,
    wndName: "RemoteMopupFrame",
    Class: RemoteMopupWnd,
    Layer: EmLayer.GAME_UI_LAYER,
  },
  [EmWindow.RemotePetOrderWnd]: {
    Type: EmWindow.RemotePetOrderWnd,
    packName: EmPackName.RemotePet,
    wndName: "RemotePetOrderFrame",
    Class: RemotePetOrderWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.RemotePetSkillLevelUp]: {
    Type: EmWindow.RemotePetSkillLevelUp,
    packName: EmPackName.RemotePet,
    wndName: "RemotePetSkillLevelUp",
    Class: RemotePetSkillLevelUp,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
  },
  [EmWindow.WearySupplyWnd]: {
    Type: EmWindow.WearySupplyWnd,
    packName: EmPackName.BaseCommon,
    wndName: "WearySupplyWnd",
    Class: WearySupplyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
  },
  [EmWindow.RemotePetWnd]: {
    Type: EmWindow.RemotePetWnd,
    packName: EmPackName.RemotePet,
    wndName: "RemotePetWnd",
    Class: RemotePetWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.RemotePetAdjustWnd]: {
    Type: EmWindow.RemotePetAdjustWnd,
    packName: EmPackName.RemotePet,
    wndName: "RemotePetAdjustWnd",
    Class: RemotePetAdjustWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  //新版角色
  [EmWindow.SRoleWnd]: {
    Type: EmWindow.SRoleWnd,
    packName: EmPackName.SBag,
    wndName: "SRoleWnd",
    Class: SRoleWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  //龙纹洗炼
  [EmWindow.TattooBaptizeWnd]: {
    Type: EmWindow.TattooBaptizeWnd,
    packName: EmPackName.SBag,
    wndName: "TattooBaptizeWnd",
    Class: TattooBaptizeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //龙纹强化
  [EmWindow.TattooReinforceWnd]: {
    Type: EmWindow.TattooReinforceWnd,
    packName: EmPackName.SBag,
    wndName: "TattooReinforceWnd",
    Class: TattooReinforceWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //环任务奖励展示
  [EmWindow.RingTaskRewardWnd]: {
    Type: EmWindow.RingTaskRewardWnd,
    packName: EmPackName.Dialog,
    wndName: "RingTaskRewardWnd",
    Class: RingTaskRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: true,
  },
  //时装吞噬属性加成
  [EmWindow.FashionBonusWnd]: {
    Type: EmWindow.FashionBonusWnd,
    packName: EmPackName.SBag,
    wndName: "FashionBonusWnd",
    Class: FashionBonusWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //副本自动战斗
  [EmWindow.AutoWalkWnd]: {
    Type: EmWindow.AutoWalkWnd,
    packName: EmPackName.Home,
    wndName: "AutoWalkWnd",
    Class: AutoWalkWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.PetFirstSelectWnd]: {
    Type: EmWindow.PetFirstSelectWnd,
    packName: EmPackName.BaseCommon,
    wndName: "PetFirstSelectWnd",
    Class: PetFirstSelectWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    mouseThrough: false,
    Model: true,
  },

  //QQ大玩咖
  [EmWindow.QQDawankaWnd]: {
    Type: EmWindow.QQDawankaWnd,
    packName: EmPackName.QQDawanka,
    wndName: "QQDawankaWnd",
    Class: QQDawankaWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.QQGiftWnd]: {
    Type: EmWindow.QQGiftWnd,
    packName: EmPackName.QQGift,
    wndName: "QQGiftWnd",
    Class: QQGiftWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  //物品预览
  [EmWindow.ItemTips]: {
    Type: EmWindow.ItemTips,
    packName: EmPackName.Base,
    wndName: "ItemTips",
    Class: ItemTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },
  //物品预览
  [EmWindow.AvatarTips]: {
    Type: EmWindow.AvatarTips,
    packName: EmPackName.Base,
    wndName: "AvatarTips",
    Class: AvatarTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },

  [EmWindow.OutyardChangeWnd]: {
    Type: EmWindow.OutyardChangeWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardChangeWnd",
    Class: OutyardChangeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutyardBlessWnd]: {
    Type: EmWindow.OutyardBlessWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardBlessWnd",
    Class: OutyardBlessWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutyardFigureWnd]: {
    Type: EmWindow.OutyardFigureWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardFigureWnd",
    Class: OutyardFigureWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
  },
  [EmWindow.OutyardMemberWnd]: {
    Type: EmWindow.OutyardMemberWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardMemberWnd",
    Class: OutyardMemberWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutyardNoticeWnd]: {
    Type: EmWindow.OutyardNoticeWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardNoticeWnd",
    Class: OutyardNoticeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutyardOpenWnd]: {
    Type: EmWindow.OutyardOpenWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardOpenWnd",
    Class: OutyardOpenWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutyardRewardWnd]: {
    Type: EmWindow.OutyardRewardWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardRewardWnd",
    Class: OutyardRewardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutyardRewardAlertWnd]: {
    Type: EmWindow.OutyardRewardAlertWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardRewardAlertWnd",
    Class: OutyardRewardAlertWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.SkillItemTips]: {
    Type: EmWindow.SkillItemTips,
    packName: EmPackName.Base,
    wndName: "SkillItemTips",
    Class: SkillItemTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.RuneItemTips]: {
    Type: EmWindow.RuneItemTips,
    packName: EmPackName.Base,
    wndName: "RuneItemTips",
    Class: RuneItemTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.TalentItemTips]: {
    Type: EmWindow.TalentItemTips,
    packName: EmPackName.Base,
    wndName: "TalentItemTips",
    Class: TalentItemTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PropertyCompareTips]: {
    Type: EmWindow.PropertyCompareTips,
    packName: EmPackName.Base,
    wndName: "PropertyCompareTips",
    Class: PropertyCompareTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.GoldenTreePreviewWnd]: {
    Type: EmWindow.GoldenTreePreviewWnd,
    packName: EmPackName.Funny,
    wndName: "GoldenTreePreviewWnd",
    Class: GoldenTreePreviewWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },
  [EmWindow.GoldenTreeRecordWnd]: {
    Type: EmWindow.GoldenTreeRecordWnd,
    packName: EmPackName.Funny,
    wndName: "GoldenTreeRecordWnd",
    Class: GoldenTreeRecordWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    HideBgBlur: true,
  },

  [EmWindow.BottleIntergalBoxTips]: {
    Type: EmWindow.BottleIntergalBoxTips,
    packName: EmPackName.Funny,
    wndName: "BottleIntergalBoxTips",
    Class: BottleIntergalBoxTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.BottleBottomIntergalBoxTips]: {
    Type: EmWindow.BottleBottomIntergalBoxTips,
    packName: EmPackName.Funny,
    wndName: "BottleBottomIntergalBoxTips",
    Class: BottleBottomIntergalBoxTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  //多人竞技场奖励预览
  [EmWindow.PvpRewardsWnd]: {
    Type: EmWindow.PvpRewardsWnd,
    packName: EmPackName.RoomList,
    wndName: "PvpRewardsWnd",
    Class: PvpRewardsWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },
  [EmWindow.PvpPreviewWnd]: {
    Type: EmWindow.PvpPreviewWnd,
    packName: EmPackName.RoomList,
    wndName: "PvpPreviewWnd",
    Class: PvpPreviewWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },
  [EmWindow.PvpRoomResultWnd]: {
    Type: EmWindow.PvpRoomResultWnd,
    packName: EmPackName.RoomList,
    wndName: "PvpRoomResultWnd",
    Class: PvpRoomResultWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },
  //单人竞技场奖励预览
  [EmWindow.ColosseumRewardsWnd]: {
    Type: EmWindow.ColosseumRewardsWnd,
    packName: EmPackName.Pvp,
    wndName: "ColosseumRewardsWnd",
    Class: ColosseumRewardsWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: false,
    ZIndex: UIZOrder.CommTop,
  },
  //符孔
  [EmWindow.RuneHoldEquipWnd]: {
    Type: EmWindow.RuneHoldEquipWnd,
    packName: EmPackName.Skill,
    wndName: "RuneHoldEquipWnd",
    Class: RuneHoldEquipWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
  },
  [EmWindow.FilterRuneWnd]: {
    Type: EmWindow.FilterRuneWnd,
    packName: EmPackName.Skill,
    wndName: "FilterRuneWnd",
    Class: FilterRuneWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutyardBuyEnergyWnd]: {
    Type: EmWindow.OutyardBuyEnergyWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardBuyEnergyWnd",
    Class: OutyardBuyEnergyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  //嘉年华
  [EmWindow.Carnival]: {
    Type: EmWindow.Carnival,
    packName: EmPackName.Carnival,
    wndName: "CarnivalWnd",
    Class: CarnivalWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  // [EmWindow.AirGardenGameFivecardWnd]: { Type: EmWindow.AirGardenGameFivecardWnd, packName: EmPackName.Carnival, wndName: 'AirGardenGameFivecardWnd', Class: AirGardenGameFivecardWnd, Layer: EmLayer.GAME_UI_LAYER, Model: true, mouseThrough: false },
  [EmWindow.AirGardenGameLLK]: {
    Type: EmWindow.AirGardenGameLLK,
    packName: EmPackName.Carnival,
    wndName: "AirGardenGameLLK",
    Class: AirGardenGameLLKWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.AirGardenGameMemoryCard]: {
    Type: EmWindow.AirGardenGameMemoryCard,
    packName: EmPackName.Carnival,
    wndName: "AirGardenGameMemoryCard",
    Class: AirGardenGameMemoryCardWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.AirGardenGameSuDuWnd]: {
    Type: EmWindow.AirGardenGameSuDuWnd,
    packName: EmPackName.Carnival,
    wndName: "AirGardenGameSuDuWnd",
    Class: AirGardenGameSuDuWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.BindVertifyWnd]: {
    Type: EmWindow.BindVertifyWnd,
    packName: EmPackName.Welfare,
    wndName: "BindVertifyWnd",
    Class: BindVertifyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutyardBattleRecordWnd]: {
    Type: EmWindow.OutyardBattleRecordWnd,
    packName: EmPackName.OutYard,
    wndName: "OutyardBattleRecordWnd",
    Class: OutyardBattleRecordWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.PreviewGoodsWnd]: {
    Type: EmWindow.PreviewGoodsWnd,
    packName: EmPackName.Base,
    wndName: "PreviewGoodsWnd",
    Class: PreviewGoodsWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.WishPoolResultWnd]: {
    Type: EmWindow.WishPoolResultWnd,
    packName: EmPackName.Shop,
    wndName: "WishPoolResultWnd",
    Class: WishPoolResultWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Shop,
  },
  [EmWindow.PreviewBoxWnd]: {
    Type: EmWindow.PreviewBoxWnd,
    packName: EmPackName.Base,
    wndName: "PreviewBoxWnd",
    Class: PreviewBoxWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Shop,
  },
  [EmWindow.OuterCityMapWnd]: {
    Type: EmWindow.OuterCityMapWnd,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityMapWnd",
    Class: OuterCityMapWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityMapCastleTips]: {
    Type: EmWindow.OuterCityMapCastleTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityMapCastleTips",
    Class: OuterCityMapCastleTips,
    Layer: EmLayer.STAGE_TOP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityMapTreasureTips]: {
    Type: EmWindow.OuterCityMapTreasureTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityMapTreasureTips",
    Class: OuterCityMapTreasureTips,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityMapBossTips]: {
    Type: EmWindow.OuterCityMapBossTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityMapBossTips",
    Class: OuterCityMapBossTips,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityMapMineTips]: {
    Type: EmWindow.OuterCityMapMineTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityMapMineTips",
    Class: OuterCityMapMineTips,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OutercityGoldMineWnd]: {
    Type: EmWindow.OutercityGoldMineWnd,
    packName: EmPackName.OuterCity,
    wndName: "OutercityGoldMineWnd",
    Class: OutercityGoldMineWnd,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ExpBackWnd]: {
    Type: EmWindow.ExpBackWnd,
    packName: EmPackName.ExpBack,
    wndName: "ExpBackWnd",
    Class: ExpBackWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityBossInfoWnd]: {
    Type: EmWindow.OuterCityBossInfoWnd,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityBossInfoWnd",
    Class: OuterCityBossInfoWnd,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityWarWnd]: {
    Type: EmWindow.OuterCityWarWnd,
    packName: EmPackName.OuterCityWar,
    wndName: "OuterCityWarWnd",
    Class: OuterCityWarWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.OuterCityWarDefencerBuildWnd]: {
    Type: EmWindow.OuterCityWarDefencerBuildWnd,
    packName: EmPackName.OuterCityWar,
    wndName: "OuterCityWarDefencerBuildWnd",
    Class: OuterCityWarDefencerBuildWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
  },
  [EmWindow.OuterCityWarAttackerBuildWnd]: {
    Type: EmWindow.OuterCityWarAttackerBuildWnd,
    packName: EmPackName.OuterCityWar,
    wndName: "OuterCityWarAttackerBuildWnd",
    Class: OuterCityWarAttackerBuildWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
  },
  [EmWindow.OuterCityWarDefenceSettingWnd]: {
    Type: EmWindow.OuterCityWarDefenceSettingWnd,
    packName: EmPackName.OuterCityWar,
    wndName: "OuterCityWarDefenceSettingWnd",
    Class: OuterCityWarDefenceSettingWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
  },
  [EmWindow.OuterCityWarEnterWarSettingWnd]: {
    Type: EmWindow.OuterCityWarEnterWarSettingWnd,
    packName: EmPackName.OuterCityWar,
    wndName: "OuterCityWarEnterWarSettingWnd",
    Class: OuterCityWarEnterWarSettingWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
  },
  [EmWindow.OuterCityWarNoticeWnd]: {
    Type: EmWindow.OuterCityWarNoticeWnd,
    packName: EmPackName.OuterCityWar,
    wndName: "OuterCityWarNoticeWnd",
    Class: OuterCityWarNoticeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  //市场
  [EmWindow.MarketWnd]: {
    Type: EmWindow.MarketWnd,
    packName: EmPackName.Market,
    wndName: "MarketWnd",
    Class: MarketWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.MarketBuyWnd]: {
    Type: EmWindow.MarketBuyWnd,
    packName: EmPackName.Market,
    wndName: "MarketBuyWnd",
    Class: MarketBuyWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MarketSellWnd]: {
    Type: EmWindow.MarketSellWnd,
    packName: EmPackName.Market,
    wndName: "MarketSellWnd",
    Class: MarketSellWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityMapPlayerTips]: {
    Type: EmWindow.OuterCityMapPlayerTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityMapPlayerTips",
    Class: OuterCityMapPlayerTips,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ArtifactTips]: {
    Type: EmWindow.ArtifactTips,
    packName: EmPackName.Base,
    wndName: "ArtifactTips",
    Class: ArtifactTips,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.SceneMaskWnd,
  },
  [EmWindow.ArtifactResetWnd]: {
    Type: EmWindow.ArtifactResetWnd,
    packName: EmPackName.Pet,
    wndName: "ArtifactResetWnd",
    Class: ArtifactResetWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Artifact,
  },

  [EmWindow.MasterySoulWnd]: {
    Type: EmWindow.MasterySoulWnd,
    packName: EmPackName.SBag,
    wndName: "MasterySoulWnd",
    Class: MasterySoulWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Artifact,
  },
  [EmWindow.SecretBookTips]: {
    Type: EmWindow.SecretBookTips,
    packName: EmPackName.Base,
    wndName: "SecretBookTips",
    Class: SecretBookTips,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SoulEquipTip]: {
    Type: EmWindow.SoulEquipTip,
    packName: EmPackName.Base,
    wndName: "SoulEquipTip",
    Class: SoulEquipTip,
    Layer: EmLayer.STAGE_TOOLTIP_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.MyMasteryWnd]: {
    Type: EmWindow.MyMasteryWnd,
    packName: EmPackName.PlayerInfo,
    wndName: "MyMasteryWnd",
    Class: MyMasteryWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },
  [EmWindow.PlayerMasteryWnd]: {
    Type: EmWindow.PlayerMasteryWnd,
    packName: EmPackName.PlayerInfo,
    wndName: "PlayerMasteryWnd",
    Class: PlayerMasteryWnd,
    Layer: EmLayer.GAME_DYNAMIC_LAYER,
    Model: false,
    mouseThrough: true,
  },

  // Debug
  [EmWindow.QuickOpenFrameWnd]: {
    Type: EmWindow.QuickOpenFrameWnd,
    packName: EmPackName.Debug,
    wndName: "QuickOpenFrameWnd",
    Class: QuickOpenFrameWnd,
    Layer: EmLayer.STAGE_TIP_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Top,
  },
  [EmWindow.DebugHelpWnd]: {
    Type: EmWindow.DebugHelpWnd,
    packName: EmPackName.Debug,
    wndName: "DebugHelpWnd",
    Class: DebugHelpWnd,
    Layer: EmLayer.STAGE_TIP_LAYER,
    Model: true,
    mouseThrough: false,
    ZIndex: UIZOrder.Top,
  },
  [EmWindow.OuterCityVehicleInfoWnd]: {
    Type: EmWindow.OuterCityVehicleInfoWnd,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityVehicleInfoWnd",
    Class: OuterCityVehicleInfoWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.OuterCityVehicleTips]: {
    Type: EmWindow.OuterCityVehicleTips,
    packName: EmPackName.OuterCity,
    wndName: "OuterCityVehicleTips",
    Class: OuterCityVehicleTips,
    Layer: EmLayer.GAME_MENU_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.Consortia]: {
    Type: EmWindow.Consortia,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaNewWnd",
    Class: ConsortiaNewWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ConsortiaTaskWnd]: {
    Type: EmWindow.ConsortiaTaskWnd,
    packName: EmPackName.Consortia,
    wndName: "ConsortiaTaskWnd",
    Class: ConsortiaTaskWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },

  [EmWindow.UpgradeAccountWnd]: {
    Type: EmWindow.UpgradeAccountWnd,
    packName: EmPackName.Home,
    wndName: "UpgradeAccountWnd",
    Class: UpgradeAccountWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.ActivityTimeWnd]: {
    Type: EmWindow.ActivityTimeWnd,
    packName: EmPackName.ActivityTime,
    wndName: "ActivityTimeWnd",
    Class: ActivityTimeWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.CastleBuildInfoWnd]: {
    Type: EmWindow.CastleBuildInfoWnd,
    packName: EmPackName.Castle,
    wndName: "CastleBuildInfoWnd",
    Class: CastleBuildInfoWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
  [EmWindow.SevenGoalsWnd]: {
    Type: EmWindow.SevenGoalsWnd,
    packName: EmPackName.SevenTarget,
    wndName: "SevenGoalsWnd",
    Class: SevenGoalsWnd,
    Layer: EmLayer.GAME_UI_LAYER,
    Model: true,
    mouseThrough: false,
  },
};
