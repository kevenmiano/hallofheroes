// @ts-nocheck
import NodeMapPhysics from "./NodeMapPhysics";
import {PhysicsEvent} from "../../../constant/event/NotificationEvent";
/**
 *  副本节点
 *  副本中的NPC 箱子都是一个节点
 */
export class CampaignNode extends NodeMapPhysics {
	private _sonType: number = 0;
	public preNodeIds: string;
	public nextNodeIds: string;
	public nodeId: number = 0;
	public styleType: number = 0;
	public tempData: any;//临时数据
	private _followTarget: number = 0;
	public curPosX: number = 0;
	public curPosY: number = 0;
	public attackTypes: number = 0;//1, 追击0,不追击
	public nameColor: number = 0;
	public toward: number = 0;//默认角度
	public resource: number = 0;
	public fightUserId: number = 0;//攻打的userId
	public resetPosX: number = 0;
	public resetPosY: number = 0;
	public fixX: number = 0;//地编中精确到象素值
	public fixY: number = 0;//地编中精确到象素值
	public heroTemplateId: number = 0;
	private _visitUserIds: number[] = [];//踩过的用户
	private _visitServerNames: string[] = [];//踩过的用户的区服
	private _curHp: number = 0;//当前血量
	public totalHp: number = 0;//总血量
	public sizeType: number = 0;//小, 1 大, 2 巨大, 10   
	public handlerRange: number = 0;//事件攻击范围
	public fightCapaity: number = 0;//战斗力
	private _param1: number = 0;//PVP中为teamid;
	public param2: number = 0;
	public param3: string; //魔神祭坛中为怪重置点X
	public param4: string; //魔神祭坛中为怪重置点Y
	public param5: string = ""; //NPC的功能名
	public uid: string;  //唯一标识符
	public createTime: number = 0;  //怪物出生时间
	public layer: number = 0;//0:底层, 2顶层
	public preParent: Laya.Sprite;


	constructor() {
		super();
	}

	public get param1(): number {
		return this._param1;
	}

	public set param1(value: number) {
		if (this._param1 != value) {
			this._param1 = value;
			this.dispatchEvent(PhysicsEvent.PARA_1, value);
		}
	}

	public get curHp(): number {
		return this._curHp;
	}

	public set curHp(value: number) {
		this._curHp = value;
		this.dispatchEvent(PhysicsEvent.UPDATE_CUR_HP, value);
	}

	public get visitUserIds(): number[] {
		return this._visitUserIds;
	}

	public set visitUserIds(value: number[]) {
		this._visitUserIds = value;
		this.dispatchEvent(PhysicsEvent.VISIT_USER_ID, value);
	}

	public get visitServerNames(): string[] {
		return this._visitServerNames;
	}

	public set visitServerNames(value: string[]) {
		this._visitServerNames = value;
	}

	public get followTarget(): number {
		return this._followTarget;
	}

	public set followTarget(value: number) {
		this._followTarget = value;
		this.dispatchEvent(PhysicsEvent.FOLLOW_TARGET, value);
	}

	public followTargetServiceName: string = "";

	public get sonType(): number {
		return this._sonType;
	}

	public set sonType(value: number) {
		if (this._sonType == value) return;
		this._sonType = value;
		this.dispatchEvent(PhysicsEvent.UP_SONTYPE);
	}

}