// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { ArmyPawn } from "../../../datas/ArmyPawn";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ArmySocketOutManager } from "../../../manager/ArmySocketOutManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase"
import ArmyModel from "../model/ArmyModel";

export default class AllocateCtrl extends FrameCtrlBase {
	// private _model: ArmyModel;
	private _recruitPawn: ArmyPawn = null;
	private _staffingCount: number = 0;
	private _type: number = 0;
	private _dstId: number = 0;
	private _dstCount: number = 0;
	private _needAuto:boolean = false;
	protected initDataPreShow() {
		super.initDataPreShow();
		// this._model = this.data;
    }

	/**
		 * 发送配兵协议, 并记覆盖原来的当前状态
		 * 
		 */
	public sendMovePawnInfo() {
		if (!this.model) return;
		var pos1Pawn: ArmyPawn = this.model.uArmy.getPawnByIndex(0);
		var pos1Temp: number = pos1Pawn ? pos1Pawn.templateId : 0;
		var count1: number = pos1Pawn ? pos1Pawn.ownPawns : 0;
		// if (this.model.tempId1 != pos1Temp || this.model.count1 != count1) {
			this.sendEditArmyPawn(0, pos1Temp, count1);
			this.setOldData();
		// }
	}

	/**
	 * 士兵编制 
	 * @param pos1 士兵在部队里面的位置
	 * @param tempId1 士兵的模板id
	 * @param count1 编制数量
	 * 
	 */
	public sendEditArmyPawn(pos1: number, tempId1: number, count1: number) {
		ArmySocketOutManager.sendEditArmyPawn(pos1, tempId1, count1);
	}

	/**
	 * 记录装备和士兵的初值 
	 * 
	 */
	public setOldData() {
		if (!this.model) return;
		this.model.oldEquip = GoodsManager.Instance.getHeroEquipListById(this.model.uArmy.baseHero.id);
		var pos1Pawn: ArmyPawn = this.model.uArmy.getPawnByIndex(0);
		this.model.tempId1 = pos1Pawn ? pos1Pawn.templateId : 0;
		this.model.count1 = pos1Pawn ? pos1Pawn.ownPawns : 0;
	}


	/**
	 * 招募士兵
	 * @param recruitPawn 招募的士兵
	 * @param recruitNum 招募数量
	 * @param staffingCount 招募后需要编排的数量
	 * @param callFunc 招募士兵成功后的处理
	 */

	public sendRecruitPawn(type: number, recruitPawn: ArmyPawn, recruitNum: number, staffingCount: number, dstId?: number, dstCount?: number,needAuto?:boolean) {
		Logger.info("[AllocateCtrl]招募士兵", recruitPawn, recruitNum, staffingCount, dstId, dstCount)
		this._recruitPawn = recruitPawn;
		this._staffingCount = staffingCount;
		this._needAuto = needAuto;
		this._type = type;
		this._dstId = dstId;
		this._dstCount = dstCount;
		ServerDataManager.listen(S2CProtocol.U_C_ARMY_UPDATE_ARMYPAWN, this, this.__recievePawnListHandler);
		ArmySocketOutManager.sendRecruitPawn(recruitPawn.templateId, recruitNum);
	}

	private __recievePawnListHandler() {
		ServerDataManager.cancel(S2CProtocol.U_C_ARMY_UPDATE_ARMYPAWN, this, this.__recievePawnListHandler);
		if (this._recruitPawn) {
			Logger.info("[AllocateCtrl]招募后自动上阵", this._type, this._recruitPawn.templateInfo.PawnNameLang, this._staffingCount, this._dstId, this._dstCount);

			switch (this._type) {
				case 1:
					if(this._needAuto){
						this.staffingNewPawn(this._recruitPawn, this._staffingCount);
					}
					break;
				case 2:
					if(this._needAuto){
						this.staffingOldPawn(this._recruitPawn, this._staffingCount);
					}
					break;
				case 3:
					if(this._needAuto){
						this.staffingPawnForReplace(this._recruitPawn, this._staffingCount, this._dstId, this._dstCount);
					}
					break;
			}

			this._recruitPawn = null;
			this._staffingCount = 0;
			this._type = 0;
			this._dstId = 0;
			this._dstCount = 0;
		}
	}

	/**
	 * 上阵新士兵
	 * @param srcAp 
	 * @param srcCount 
	 */
	public staffingNewPawn(srcAp: ArmyPawn, srcCount: number) {
		Logger.info("[AllocateCtrl]上阵新士兵:", srcAp.templateInfo.PawnNameLang, srcAp.templateId, srcCount)
		ArmyManager.Instance.army.addNewPawnByIndex(0, srcAp, srcCount);
		ArmyManager.Instance.removePawnCountById(srcAp.templateId, srcCount);
		this.sendMovePawnInfo();
	}

	/**
	 * 增加已上阵士兵
	 * @param srcAp 
	 * @param srcCount 
	 */
	public staffingOldPawn(srcAp: ArmyPawn, srcCount: number) {
		Logger.info("[AllocateCtrl]增加已上阵士兵:", srcAp.templateInfo.PawnNameLang, srcAp.templateId)
		// ArmyManager.Instance.army.addArmyPawnCountByIndex(0, srcCount);
		ArmyManager.Instance.removePawnCountById(srcAp.templateId, srcCount);
		this.sendMovePawnInfo();
	}

	/**
	 * 上阵士兵并替换掉目前已上阵士兵
	 * @param srcAp 
	 * @param srcCount 
	 * @param dstId 
	 * @param dstCount 
	 */
	public staffingPawnForReplace(srcAp: ArmyPawn, srcCount: number, dstId: number, dstCount: number) {
		Logger.info("[AllocateCtrl]上阵士兵并替换掉目前已上阵士兵:", srcAp.templateInfo.PawnNameLang, srcAp.templateId, ", 旧的士兵:", dstId)
		ArmyManager.Instance.army.addNewPawnByIndex(0, srcAp, srcCount);
		ArmyManager.Instance.addPawnCountById(dstId, dstCount);
		this.sendMovePawnInfo();
	}

	public showStopRecruitTip(time: number = 1000) {
		Laya.timer.once(time, this, this.__showStopRecruitTip);
	}

	private __showStopRecruitTip() {
		MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Allocate.GoldNotEnough2"));
	}

	public showStopRecruitTip2(time:number = 1000){
		Laya.timer.once(time, this, this.__showStopRecruitTip2);
	}

	private __showStopRecruitTip2() {
		MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Allocate.PeopleNotEnough"));
	}

	private get model(): ArmyModel {
        return this.data;
    }
}