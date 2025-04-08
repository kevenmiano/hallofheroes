// @ts-nocheck
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import LangManager from "../../../core/lang/LangManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { SocketManager } from "../../../core/net/SocketManager";
import UIManager from "../../../core/ui/UIManager";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import { ConsortiaEvent, EmailEvent, PassCheckEvent } from "../../constant/event/NotificationEvent";
import GTabIndex from "../../constant/GTabIndex";
import OpenGrades from "../../constant/OpenGrades";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import DayGuideManager from "../../manager/DayGuideManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import BuildingManager from "../../map/castle/BuildingManager";
import BuildingType from "../../map/castle/consant/BuildingType";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import SpaceNodeType from "../../map/space/constant/SpaceNodeType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import PetBossModel from "../petguard/PetBossModel";
import DayGuideCatecory from "./data/DayGuideCatecory";
import LevelGiftItemInfo from "./data/LevelGiftItemInfo";
import PassTaskItemData from "./data/PassTaskItemData";
import WelfareCtrl from "./WelfareCtrl";
import WelfareData from "./WelfareData";
import GradePacketRsp = com.road.yishi.proto.active.GradePacketRsp;
import GradePacketMsg = com.road.yishi.proto.active.GradePacketMsg;
import OnlinerewardReq = com.road.yishi.proto.active.OnlinerewardReq;
import PassInfoReqMsg = com.road.yishi.proto.active.PassInfoReqMsg;
import PassInfoResMsg = com.road.yishi.proto.active.PassInfoResMsg;
import PassBuyReqMsg = com.road.yishi.proto.active.PassBuyReqMsg;
import PassTaskReceiveReq = com.road.yishi.proto.active.PassTaskReceiveReq;
import PassTaskInfoRsp = com.road.yishi.proto.active.PassTaskInfoRsp;
import PassTaskAllInfoMsg = com.road.yishi.proto.active.PassTaskAllInfoMsg;
import MailCheckMsg = com.road.yishi.proto.player.MailCheckMsg;
import VertifyReqMsg = com.road.yishi.proto.player.VertifyReqMsg;
import IPassTaskMsg = com.road.yishi.proto.active.IPassTaskMsg
import { TempleteManager } from "../../manager/TempleteManager";
import Logger from "../../../core/logger/Logger";
import { ConfigManager } from "../../manager/ConfigManager";
import { GameBaseQueueManager } from "../../manager/GameBaseQueueManager";
import { BindPhoneAlertAction } from "../../action/map/BindPhoneAlertAction";
import { PlayerManager } from "../../manager/PlayerManager";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import SpaceManager from "../../map/space/SpaceManager";
import { ConsortiaManager } from "../../manager/ConsortiaManager";
// import { t_s_passindexData } from "../../config/t_s_passIndex";
/**
 * 福利管理器
 */
export class WelfareManager extends GameEventDispatcher {
	//1:未验证  2:已验证完毕 3:已领取 4:额外奖励已领取
	public bindPhoneState: number = 0;
	public bindMailState: number = 0;
	// 绑定邮箱是否选择额外奖励
	public bindMailSelectPrivacy: boolean = false;
	//服务器记录: 是否第一次点击绑定手机、邮箱Tab；默认已点击
	public bindPhoneTabFirstOpen: boolean = true;
	public bindMailTabFirstOpen: boolean = true;

	private static _instance: WelfareManager;
	public static get Instance(): WelfareManager {
		if (!WelfareManager._instance) WelfareManager._instance = new WelfareManager();
		return WelfareManager._instance;
	}

	public setup() {
		this.initEvent();
	}

	private initEvent() {
		ServerDataManager.listen(S2CProtocol.U_C_GRADE_PACKET, this, this.levelGiftInfo);
		ServerDataManager.listen(S2CProtocol.U_C_PASS_REWARD_INFO, this, this.onRecvPassRewardInfo);
		ServerDataManager.listen(S2CProtocol.U_C_PASS_TASK_FRESH_INFO, this, this.onRecvPassTaskRefresh);
		ServerDataManager.listen(S2CProtocol.U_C_PASS_TASK_INFO, this, this.onRecvPassTaskInfo);
		// 请求 福利（绑定手机、邮箱状态）返回都是这个接口
		ServerDataManager.listen(S2CProtocol.U_C_MAIL_CHECK, this, this.onMailCheckInfoHandler);
		PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.IS_BIND_VERTIFY_PROMPTED, this.checkBindVertifyAlert, this);
	}

	private onMailCheckInfoHandler(pkg: PackageIn) {
		let msg = pkg.readBody(MailCheckMsg) as MailCheckMsg;
		if (msg.type == 1) {
			this.bindPhoneState = msg.state;
			this.bindPhoneTabFirstOpen = msg.isFirstOpen;
			this.checkBindVertifyAlert();
		} else if (msg.type == 2) {
			this.bindMailState = msg.state;
			this.bindMailTabFirstOpen = msg.isFirstOpen;
		}

		if (msg.agree) this.bindMailSelectPrivacy = msg.agree;

		NotificationManager.Instance.dispatchEvent(EmailEvent.WELFARE_BIND_STATE);
	}

	private isBindVertifyAlert: boolean = false;
	private checkBindVertifyAlert() {
		if (this.isReachOpenBindCon(1)) {
			let playInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
			if (playInfo && playInfo.isBindVertifyPrompted) {
				Logger.info("已提示过绑定手机");
			} else {
				if (this.bindPhoneState == 1) {
					if (!this.isBindVertifyAlert) {
						GameBaseQueueManager.Instance.addAction(new BindPhoneAlertAction(), true);
					}
					this.isBindVertifyAlert = true;
				} else {
					Logger.info("绑定手机状态不为1");
				}
			}
		} else {
			Logger.info("绑定手机开启条件未达到");
		}
	}

	/**
	 * /通行证任务页面信息返回
	 * @param pkg
	 */
	onRecvPassTaskInfo(pkg: PackageIn) {
		let msg: PassTaskAllInfoMsg = pkg.readBody(PassTaskAllInfoMsg) as PassTaskAllInfoMsg;
		if (!msg) return
		this.ctrlData.passTaskModel.dayFreshNum = msg.dayFreshNum;
		this.ctrlData.passTaskModel.weekFreshNum = msg.weekFreshNum;
		this.ctrlData.passTaskModel.opType = msg.opType;
		if (msg.exp) {
			this.ctrlData.passExp = msg.exp;
			this.ctrlData.passGrade = msg.grade;
		}

		//数据重置
		if (msg.opType == 1) {
			this.ctrlData.passTaskModel.taskListData.length = 0;
		}

		for (let i = 0; i < msg.passTask.length; i++) {
			const element = msg.passTask[i];
			let taskData = this.getTask(element.taskId);
			if (!taskData) {
				taskData = new PassTaskItemData();
				this.ctrlData.passTaskModel.taskListData.push(taskData);
			}
			taskData.finishNum = element.finishNum;
			taskData.status = element.status;
			taskData.taskId = element.taskId;
			taskData.taskType = element.taskType;
			taskData.id = element.id;
			taskData.area = element.area;
		}

		NotificationManager.Instance.dispatchEvent(PassCheckEvent.PASS_TASK_FRESH);

	}

	private getTask(id: number): PassTaskItemData {
		let array = this.ctrlData.passTaskModel.taskListData;
		let len = array.length;
		for (let j = 0; j < len; j++) {
			const element1 = array[j];
			if (element1.taskId == id) {
				return element1;
			}
		}
		return null;
	}

	/**
	 * //通行证任务领取或刷新返回
	 * 	int32 exp = 1;//总经验
	int32 grade = 2; //等级
	repeated PassTaskMsg status = 3;//任务状态更新
	int32 dayFreshNum = 4;//今日任务刷新次数
	int32 weekFreshNum = 5;//周任务刷新次数
	int32 originId = 6;//任务刷新前的任务唯一Id
	 * @param pkg
	 */
	onRecvPassTaskRefresh(pkg: PackageIn) {
		let msg: PassTaskInfoRsp = pkg.readBody(PassTaskInfoRsp) as PassTaskInfoRsp;
		if (!msg) return;
		this.ctrlData.passTaskModel.dayFreshNum = msg.dayFreshNum;
		this.ctrlData.passTaskModel.weekFreshNum = msg.weekFreshNum;
		if (msg.exp) {
			this.ctrlData.passExp = msg.exp;
			this.ctrlData.passGrade = msg.grade;
		}


		for (let i = 0; i < msg.status.length; i++) {
			const element = msg.status[i];
			let taskData = this.getTask(element.taskId);
			if (!taskData) {
				taskData = new PassTaskItemData();
				this.ctrlData.passTaskModel.taskListData.push(taskData);
			}
			taskData.finishNum = element.finishNum;
			taskData.status = element.status;
			taskData.taskId = element.taskId;
			taskData.taskType = element.taskType;
			taskData.id = element.id;
			taskData.area = element.area;
		}

		NotificationManager.Instance.dispatchEvent(PassCheckEvent.PASS_TASK_FRESH, true);

	}

	/**
	 * 通行证奖励页面返回
	 * @param pkg
	 */
	onRecvPassRewardInfo(pkg: PackageIn) {
		let msg: PassInfoResMsg = pkg.readBody(PassInfoResMsg) as PassInfoResMsg;
		if (msg) {
			if (msg.leftTime > 0) {
				this.ctrlData.passRewardInfo.leftTime = msg.leftTime;
			}
			if (msg.state > 0) {
				this.ctrlData.passRewardInfo.state = msg.state;
			}
			if (msg.passIndex > 0) {
				this.ctrlData.passRewardInfo.passIndex = msg.passIndex;
			}

			this.ctrlData.passRewardInfo.rewardGrade = msg.rewardGrade;
			this.ctrlData.passExp = msg.exp;
			this.ctrlData.passGrade = msg.grade;
			this.ctrlData.passRewardInfo.isPay = msg.isPay;
			this.ctrlData.passRewardInfo.setBaseReward(msg.baseReward);
			this.ctrlData.passRewardInfo.setAdvanceReward(msg.advancedReward);
			NotificationManager.Instance.dispatchEvent(PassCheckEvent.RECEIVE_PASS_REWARD);
		}
	}

	/**
	 * 等级礼包信息
	 * @param pkg
	 */
	private levelGiftInfo(pkg: PackageIn) {
		let msg: GradePacketRsp = pkg.readBody(GradePacketRsp) as GradePacketRsp;
		if (msg) {
			let item: GradePacketMsg;
			let arr: Array<LevelGiftItemInfo> = [];
			let levelArr: Array<number> = [];
			for (let i: number = 0; i < msg.allPacket.length; i++) {
				item = msg.allPacket[i] as GradePacketMsg;
				let levelGiftItemInfo: LevelGiftItemInfo = this.readLevelPacketData(item);
				levelGiftItemInfo.packageState1 = this.getState1(item, msg);
				levelGiftItemInfo.packageState2 = this.getState2(item, msg);
				levelArr.push(levelGiftItemInfo.grade);
				arr.push(levelGiftItemInfo);
			}
			arr = ArrayUtils.sortOn(arr, ["packageState1", "id"], [ArrayConstant.DESCENDING | ArrayConstant.CASEINSENSITIVE]);
			this.ctrlData.levelArr = levelArr;
			this.ctrlData.levelPackageArr = arr;
		}
	}

	private get ctrlData(): WelfareData {
		return this.control.data;
	}

	private get control(): WelfareCtrl {
		return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
	}
	private readLevelPacketData(item: GradePacketMsg): LevelGiftItemInfo {
		let levelGiftItemInfo: LevelGiftItemInfo = new LevelGiftItemInfo();
		if (item) {
			levelGiftItemInfo.grade = item.grade;
			levelGiftItemInfo.id = item.id;
			levelGiftItemInfo.freeStr = item.packet;
			levelGiftItemInfo.diamondStr = item.preferPacket;
			levelGiftItemInfo.price = item.price;
			levelGiftItemInfo.discount = item.discount;
		}
		return levelGiftItemInfo;
	}

	private getState1(item1: GradePacketMsg, item2: GradePacketRsp): number {
		let state: number = 0;
		if ((item2.receiveSite >> item1.id) & 0x01) {
			//已经领取
			state = WelfareData.HAS_GET;
			this.ctrlData.currentGetPackageId = this.ctrlData.currentGetPackageId > item1.id ? this.ctrlData.currentGetPackageId : item1.id;
		} else {
			if (ArmyManager.Instance.thane.grades >= item1.grade) {
				//玩家等级大于礼包要求的等级
				if (this.ctrlData.currentGetPackageId == item1.id - 1) {
					//可领取
					state = WelfareData.CAN_GET;
				} else {
					state = WelfareData.DISSATISIFY_CONDITION; //未满足条件, 请领取上一等级礼包
				}
			} else {
				state = WelfareData.ENABLE_GET; //不可领取
			}
		}
		return state;
	}

	private getState2(item1: GradePacketMsg, item2: GradePacketRsp): number {
		let state: number = 0;
		if ((item2.buySite >> item1.id) & 0x01) {
			//已经购买
			state = 2;
		} else {
			state = 1; //可购买
		}
		return state;
	}

	/**
	 *在线礼包
	 * @param op    操作类型  1打开活动界面 2抽奖
	 */
	public sendOnlineRewardReq(op: number) {
		let msg: OnlinerewardReq = new OnlinerewardReq();
		msg.op = op;
		SocketManager.Instance.send(C2SProtocol.C_ONLINE_REWARD, msg);
	}

	/**
	 *  获取通行证奖励页面信息
	 * @param op  //1 获取 通行证奖励页面信息 2 领取奖励 3 一键领取
	 * @param type 1 基础版 2 进阶版
	 * @param index 领取奖励位置信息(1,2,3...)
	 */
	public reqPassRewardInfo(op: number, type: number, index: number) {
		let msg: PassInfoReqMsg = new PassInfoReqMsg();
		msg.op = op;
		msg.type = type;
		msg.index = index;
		SocketManager.Instance.send(C2SProtocol.C_PASS_REWARD_INFO, msg);
	}

	/**
	 * 通行证相关购买
	 * @param op  1 进阶  2 购买等级
	 * @param grade 要购买的等级级数
	 */
	public reqPassBuy(op: number, grade: number) {
		let msg: PassBuyReqMsg = new PassBuyReqMsg();
		msg.op = op;
		msg.grade = grade;
		SocketManager.Instance.send(C2SProtocol.C_PASS_BUY, msg);
	}

	/**
	 * 通行证任务信息
	 * @param op
	 */
	public reqPassTaskInfo() {
		SocketManager.Instance.send(C2SProtocol.C_PASS_Task_INFO, null);
	}

	/**
	 * 通行证任务奖励领取或刷新
	 * @param op   1 任务奖励领取 2 刷新任务 3一键领取
	 * @param taskId 要购买的等级级数
	 * @param area  页签
	 * @param buyType  刷新任务付费方式 0 优先绑钻 1钻石
	 */
	public reqPassTask(op: number, taskId: number, area: number, id: number, buyType: number) {
		let msg: PassTaskReceiveReq = new PassTaskReceiveReq();
		msg.op = op;
		msg.taskId = taskId;
		msg.area = area;
		msg.id = id;
		msg.buyType = buyType;
		SocketManager.Instance.send(C2SProtocol.C_PASS_TASK_FRESH, msg);
	}

	/////////////////////////////// 绑定手机、邮箱 ////////////////////////////////////////////
	public reqBindState() {
		if (this.isReachOpenBindCon(1)) {
			this.reqBindPhoneState();
		}
		if (this.isReachOpenBindCon(2)) {
			this.reqBindMailState();
		}
	}
	// 是否开启 1手机 2邮箱
	public isOpenBind(type: number = 1) {
		if (type == 1 && !ConfigManager.info.BIND_PHONE) {
			return false;
		}
		if (type == 2 && !ConfigManager.info.BIND_MAIL) {
			return false;
		}

		let configTemp = TempleteManager.Instance.getConfigInfoByConfigName("bind_open_level");
		if (configTemp) {
			let countsValue: Array<string> = configTemp.ConfigValue.split(",");
			if (parseInt(countsValue[type - 1]) == 0) {
				return false;
			}
			return true;
		}
		return false;
	}
	// 是否达到开启条件
	public isReachOpenBindCon(type: number = 1) {
		if (!this.isOpenBind(type)) return false;

		let configTemp = TempleteManager.Instance.getConfigInfoByConfigName("bind_open_level");
		if (configTemp) {
			let countsValue: Array<string> = configTemp.ConfigValue.split(",");
			return ArmyManager.Instance.thane.grades >= parseInt(countsValue[type - 1]);
		}
		return false;
	}

	// 弹窗只显示一次 请求服务器记录playInfo.isOpenVertify=true  服务器不返回0x0151, 要不然一直弹窗
	public firstOpenBindPhoneAlert() {
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 1;
		msg.op = 4;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}

	// 绑定手机
	public reqBindPhoneState() {
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 1;
		msg.op = 1;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}
	public recvBindPhoneReward() {
		this.control.sendOnlineRewardReq(1);
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 1;
		msg.op = 2;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}
	public firstOpenBindPhoneTab() {
		this.control.sendOnlineRewardReq(1);
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 1;
		msg.op = 3;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}
	// 绑定邮箱
	public reqBindMailState() {
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 2;
		msg.op = 1;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}
	/**绑定邮箱领取基础奖励 */
	public recvBindMailReward(selectPrivacy: boolean) {
		this.control.sendOnlineRewardReq(1);
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 2;
		msg.op = selectPrivacy ? 5 : 2;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}
	/**绑定邮箱同意接收营销邮件 */
	public bindMailPrivacy() {
		this.control.sendOnlineRewardReq(1);
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 2;
		msg.op = 6;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}
	/**绑定邮箱领取额外奖励 */
	public recvBindMailPrivacyReward() {
		this.control.sendOnlineRewardReq(1);
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 2;
		msg.op = 7;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}
	public firstOpenBindMailTab() {
		this.control.sendOnlineRewardReq(1);
		let msg: VertifyReqMsg = new VertifyReqMsg();
		msg.type = 2;
		msg.op = 3;
		SocketManager.Instance.send(C2SProtocol.C_CHECK_PHONE_MAIN_INFO, msg);
	}

	public getBindPhoneRedFlag() {
		return !this.bindPhoneTabFirstOpen || WelfareManager.Instance.bindPhoneState == 2;
	}

	public getBindMailRedFlag() {
		return !this.bindMailTabFirstOpen || WelfareManager.Instance.bindMailState == 2;
	}
	//////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 点击每日引导中的任务触发切换场景
	 * */
	public switchScene(taskType: number) {
		let isopen: boolean = true;
		switch (taskType) {
			case 1:
				SwitchPageHelp.gotoShopFrame();
				break;
			case DayGuideCatecory.WATER_SELF_TREE:
			case DayGuideCatecory.WATER_FRIENDS_TREE:
				if (ArmyManager.Instance.thane.grades < OpenGrades.FARM) {
					isopen = false;
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", OpenGrades.FARM));
				} else {
					DayGuideManager.Instance.switchScene(taskType);
				}
				break;
			case 4:
			case 33:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.STAR);
				break;
			case 5:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.OFFERREWARD);
				break;
			case 6: //神秘商店刷新{TaskNum}次商品
			case 50: //神秘商店刷新{TaskNum}次商品
				if (ArmyManager.Instance.thane.grades < OpenGrades.MYSTERIOUS) {
					isopen = false;
					let str = LangManager.Instance.GetTranslation("pveroomlist.view.PVERoomItem.command01") + OpenGrades.MYSTERIOUS;
					MessageTipManager.Instance.show(str);
					return;
				} else {
					UIManager.Instance.ShowWind(EmWindow.OuterCityShopWnd);
				}
				break;
			case 7:
			case 35:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.CONTRIBUTE);
				break;
			case 8:
			case 22: //等级达到{TaskNum}级
			case 20: //消耗体力{TaskNum}点
				DayGuideManager.Instance.switchScene(DayGuideCatecory.PASS_SINGLE_CAMPAIGN);
				break;
			case 9:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.WAR_FIGHT);
				break;
			case 10:
			case 27:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.PVP);
				break;
			case 11: //完成{TaskNum}次地下迷宫探险
			case 34: //通过迷宫100层
				DayGuideManager.Instance.switchScene(DayGuideCatecory.MAZEROOM);
				break;
			case 12:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.CONSUME_SMALL_BUGLE);
				break;
			case 13:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.BLESS);
				break;
			case 14:
			case 15:
			case 29:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.OCCUPY_FAILED);
				break;
			case 16: //解锁{TaskNum}只新坐骑
				if (ArmyManager.Instance.thane.grades < OpenGrades.MOUNT) {
					isopen = false;
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", OpenGrades.MOUNT));
				} else {
					FrameCtrlManager.Instance.open(EmWindow.MountsWnd);
				}
				break;
			case 17: //解锁{TaskNum}只新时装
				FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, 1);
				break;
			case 18: //征收{TaskNum}次黄金
				let bInfo: BuildInfo;
				bInfo = BuildingManager.Instance.getBuildingInfoBySonType(BuildingType.OFFICEAFFAIRS);
				if (bInfo.property2 > bInfo.property1) {
					UIManager.Instance.ShowWind(EmWindow.PoliticsFrameWnd, bInfo);
				}
				break;
			case 19:
				DayGuideManager.Instance.switchScene(DayGuideCatecory.PASS_MUL_CAMPAIGN);
				break;

			case 21: //开启通行证后签到{TaskNum}次
				FrameCtrlManager.Instance.exit(EmWindow.Welfare); //跳转其他关闭福利界面
				FrameCtrlManager.Instance.open(EmWindow.Welfare);
				isopen = false;
				break;

			case 23: //VIP达到{TaskNum}级
				SwitchPageHelp.gotoShopFrame(2);
				break;
			case 24: //好友数达到{TaskNum}
			case 25: //与一名好友好感度达到{TaskNum}级"
				UIManager.Instance.ShowWind(EmWindow.FriendWnd);
				break;
			case 26: //战力达到{TaskNum}
				FrameCtrlManager.Instance.open(EmWindow.SRoleWnd);
				break;
			case 28: //世界BOSS
				SwitchPageHelp.gotoWorldBossFrame();
				break;
			case 30: //紫晶矿场
				if (!this.checkScene()) return;
				SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_AMETHYST_FIELD);
				break;
			case 31: //公会秘境
			case 36: //公会战
				SwitchPageHelp.gotoConsortiaFrame();
				break;
			case 32: //荣誉值达到2000
				FrameCtrlManager.Instance.open(EmWindow.PersonalCenter, { page: 0 });
				break;
			case 37: //在保卫英灵岛活动中击杀{TaskNum}个愤怒的中级英灵
				let petBossModel: PetBossModel = CampaignManager.Instance.petBossModel;
				if (petBossModel.isOpen) {
					if (ArmyManager.Instance.thane.grades < OpenGrades.PET) {
						let str =
							LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.command03") +
							LangManager.Instance.GetTranslation("public.level4_space2", OpenGrades.PET);
						MessageTipManager.Instance.show(str);
					} else {
						SwitchPageHelp.walkToCrossMapTarget(petBossModel.mapId + "," + petBossModel.nodeId);
					}
				} else {
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.view.DailyItem.PetBossUnOpen"));
				}
				break;
			case 38: //完成{TaskNum}次英灵进阶
				FrameCtrlManager.Instance.open(EmWindow.Pet, { tabIndex: GTabIndex.Pet_AttrAdvance });
				break;
			case 39: //完成{TaskNum}次英灵战役挑战
				if (CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId > 0) {//单人挑战功能在副本中无法点击跳转, 修改为跳转至单人挑战界面, 但无法选择角色攻击
					let str: string = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip06");
					MessageTipManager.Instance.show(str);
				} else {
					SpaceManager.Instance.visitSpaceNPC(70);
				}
				// FrameCtrlManager.Instance.open(EmWindow.PetCampaignWnd);
				break;
			case 40: //拥有{TaskNum}只蓝色资质的英灵
				FrameCtrlManager.Instance.open(EmWindow.Pet, { tabIndex: GTabIndex.Pet_AttrIntensify });
				break;
			case 41:
			case 42:
				FrameCtrlManager.Instance.open(EmWindow.SRoleWnd);
				break;
			case 44://击杀外城普通
			case 45://击杀外城精英
			case 46://击杀外城
				SwitchPageHelp.gotoOuterCity();
				break;
			case 47:
				SwitchPageHelp.gotoPvpFrame();
				break;
			case 48://王者之塔
			case 49://试炼之塔
				SwitchPageHelp.gotoHeroDoor();
				break;
			case 52://勇者之战
				SwitchPageHelp.gotoConsortiaFrame();
				break;
			case 53://英灵远征
				SpaceManager.Instance.visitSpaceNPC(31);
				break;
			case 54://保卫英灵岛
				if (ArmyManager.Instance.thane.grades >= OpenGrades.PET) {
					UIManager.Instance.ShowWind(EmWindow.PetGuardWnd);
				} else {
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", OpenGrades.PET));
				}
				break;
			case 51://战场获胜
			case 55://战场击杀
				SwitchPageHelp.gotoWorldFightFrame();
				break;
			case 56://英灵竞技获胜
				if (CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId > 0) {//单人挑战功能在副本中无法点击跳转, 修改为跳转至单人挑战界面, 但无法选择角色攻击
					let str: string = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip06");
					MessageTipManager.Instance.show(str);
				} else {
					SpaceManager.Instance.visitSpaceNPC(3);
				}
				break;
			case 57://农场偷取
				SwitchPageHelp.gotoFarmFrame();
				break;
			case 58://时装鉴定
				FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { tabIndex: 2 });
				break;
			case 59://坐骑炼化{TaskNum}次
				if (ArmyManager.Instance.thane.grades < OpenGrades.MOUNT) {
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", OpenGrades.MOUNT));
				} else {
					FrameCtrlManager.Instance.open(EmWindow.WildSoulWnd);
				}
				break;
			case 60://英灵装备洗炼{TaskNum}次
				FrameCtrlManager.Instance.open(EmWindow.Pet, { tabIndex: GTabIndex.Pet_Euip });
				break;
			case 61://符孔雕刻{TaskNum}次
				FrameCtrlManager.Instance.open(EmWindow.Skill, { tabIndex: GTabIndex.Skill_FK })
				break;
			case 62://许愿{TaskNum}次
				SwitchPageHelp.gotoShopFrame(4)
				break;
			case 63://公会商城购买{PassCount}次
				if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
					FrameCtrlManager.Instance.open(EmWindow.ConsortiaApply);
				} else {
					if (ConsortiaManager.Instance.model.consortiaInfo.shopLevel > 0) {
						SwitchPageHelp.gotoShopFrame(1)
					} else {
						MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.shop.unopen"));
						isopen = false;
					}
				}
				break;
			case 64://迷宫商城购买{PassCount}次
				SwitchPageHelp.gotoShopFrame(3)
				break;
			case 65://竞技商城购买{PassCount}次
				SwitchPageHelp.gotoShopFrame(2)
				break;
			case 43://公会战收集
				NotificationManager.Instance.dispatchEvent(ConsortiaEvent.GOTO_GUILD_FIGHT);
				break;
			default:
				break;
		}
		if (isopen) {
			FrameCtrlManager.Instance.exit(EmWindow.Welfare); //跳转其他关闭福利界面
		}
	}

	private checkScene(): boolean {
		var tip: string = WorldBossHelper.getCampaignTips();
		if (tip != "") {
			MessageTipManager.Instance.show(tip);
			return false;
		}
		if (
			SceneManager.Instance.currentType == SceneType.PVE_ROOM_SCENE ||
			SceneManager.Instance.currentType == SceneType.PVP_ROOM_SCENE ||
			SceneManager.Instance.currentType == SceneType.WARLORDS_ROOM
		) {
			var str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command03");
			MessageTipManager.Instance.show(str);
			return false;
		}
		return true;
	}

	// /**
	//  * 1)	在战令开启时, 福利页面内加入战令页签, 战令关闭时页签消失
	//  * @returns 
	//  */
	// public checkPassOpen():boolean{
	// 	let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_passindex);
	//     for (const dicKey in dic) {
	//         if (dic.hasOwnProperty(dicKey)) {
	//             let temp: t_s_passindexData = dic[dicKey];
	//             temp.OpenDate
	//         }
	//     }

	// 	return false;
	// }
}
