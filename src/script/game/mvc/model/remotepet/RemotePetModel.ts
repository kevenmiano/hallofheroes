import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../FrameCtrlManager";
import { RemotePetFriendInfo } from "./RemotePetFriendInfo";
import { RemotePetListInfo } from "./RemotePetListInfo";
import { RemotePetOrderInfo } from "./RemotePetOrderInfo";
import { RemotePetTurnInfo } from "./RemotePetTurnInfo";
import { RemotePetTurnTemplateInfo } from "./RemotePetTurnTemplateInfo";


export class RemotePetModel extends GameEventDispatcher {

	public isGet: boolean;
	public fristRst: boolean = true;
	public orderTime: Date;
	private enterArr = [1, 2, 3];
	public mopupList: { count: number, items: string }[] = [];

	public lastOrder: number;
	private _mopupCount: number;
	/**
	 *排行榜的数据 
	 */
	public orderList: RemotePetOrderInfo[];

	public isFrist: boolean = false;

	public selectItem: RemotePetFriendInfo;

	public friendList: Array<RemotePetFriendInfo>;

	private _turnInfo: RemotePetTurnInfo;

	private _petListInfo: RemotePetListInfo;

	public skillString: string;

	private _rank: number;

	public skillStatus: string;

	public constructor() {
		super();
		this._turnInfo = new RemotePetTurnInfo();
		this._petListInfo = new RemotePetListInfo();
		// this.selectItem = new RemotePetFriendInfo();
		// this.selectItem = null;
		this.orderList = [];
	}

	public get remotePetSkillStatus() {
		let remotePetSkillArr: { [key: string]: number } = {};
		if (this.skillStatus) {
			let skills = this.skillStatus.split("|");
			for (let skill of skills) {
				let skillData = skill.split(",")
				remotePetSkillArr[skillData[0]] = +skillData[1];
			}
		}	
		return remotePetSkillArr;
	}

	public get remotePetSkill() {
		let remotePetSkillArr: string[] = [];
		if (this.skillString) {
			let skills = this.skillString.split("|");
			for (let skill of skills) {
				if (skill) {
					let arr = skill.split(",");
					remotePetSkillArr.push(arr[0]);
				}
			}
		}
		remotePetSkillArr.sort((a, b) => { return +a - +b });
		return remotePetSkillArr;
	}

	public get petListInfo(): RemotePetListInfo {
		return this._petListInfo;
	}
	public get turnInfo(): RemotePetTurnInfo {
		return this._turnInfo;
	}
	public petChange(value: Object = null) {
		this.dispatchEvent(RemotePetEvent.PET_CHANGE, value);
	}
	public commitTurnList() {
		this.dispatchEvent(RemotePetEvent.Turn_LIST);
	}
	public commitFriend() {
		this.dispatchEvent(RemotePetEvent.FRIEND_LIST);
	}
	public commit() {
		this.dispatchEvent(RemotePetEvent.COMMIT);
	}
	public updateOrderList() {
		this.dispatchEvent(RemotePetEvent.ORDERDATA_LOAD_COMPLETE);
	}
	public updateSkillLevelUp() {
		this.dispatchEvent(RemotePetEvent.SKILLEVELUP);
	}
	public updateMopup(value: Object = null) {
		this.dispatchEvent(RemotePetEvent.UPDATEMOPUP, value);
	}
	public get maxMopupTurn(): number {
		if (this._turnInfo.maxTurn > 0) {
			let temp: RemotePetTurnTemplateInfo = TempleteManager.Instance.getRemotePetTemplateById(this._turnInfo.maxTurn, 1);
			return temp.SweepIndex;
		}
		return 0;
	}
	public updatePage() {
		this.dispatchEvent(RemotePetEvent.PAGE_UPDATE);
	}

	public get mopupCount(): number {
		return this._mopupCount;
	}

	public set mopupCount(value: number) {
		if (this._mopupCount == value) return;
		this._mopupCount = value;
		// if (this._mopupCount > 0) {
		// 	setTimeout(this.enterSpaceShow.bind(this), 1000);
		// }
	}
	public enterSpaceShow() {
		// FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.MOPUP, 6);
		FrameCtrlManager.Instance.open(EmWindow.RemoteMopupWnd);
	}
	public get enterWarNum(): number {
		let result: number = 0;
		for (let i = 0; i < this.enterArr.length; i++) {
			if (this._petListInfo.petList[this.enterArr[i]]) {
				result++;
			}
		}
		return result;
	}

	public get rank(): number {
		return this._rank;
	}

	public set rank(value: number) {
		if (this._rank == value) return;
		this._rank = value;
		this.dispatchEvent(RemotePetEvent.PAGE_UPDATE);
	}

}
