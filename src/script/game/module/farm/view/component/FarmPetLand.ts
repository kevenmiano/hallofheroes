// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-13 17:44:19
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-27 18:24:33
 * @Description: 农场的宠物修行组件
 */

import FUI_FarmPetLand from "../../../../../../fui/Farm/FUI_FarmPetLand";
import { FarmManager } from "../../../../manager/FarmManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import PetLandInfo from "../../data/PetLandInfo";
import LangManager from '../../../../../core/lang/LangManager';
import { FarmOperateType } from "../../../../constant/FarmOperateType";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { EmWindow } from "../../../../constant/UIDefine";
import FUIHelper from "../../../../utils/FUIHelper";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { PetData } from "../../../pet/data/PetData";
import { PetMovieClip } from "../../../../map/avatar/view/PetMovieClip";
import { FarmModel } from "../../data/FarmModel";
import { MessageTipManager } from "../../../../manager/MessageTipManager";

export class FarmPetLand extends FUI_FarmPetLand {
	public buttonMode: boolean = false;
	public pos: number;
	private _info: PetLandInfo;
	private petAvater: PetMovieClip;

	onConstruct() {
		super.onConstruct();
		this.initView();
		this.addEvent();
	}

	private initView() {
		this.cState.selectedIndex = 0;
		this.petAvater = new PetMovieClip();
		this.petCon.displayObject.addChild(this.petAvater)
	}

	private addEvent() {
		this.onClick(this, this.__onItemClick)
		this.btnCancel.onClick(this, this.__onCancelClick);
	}

	private delEvent() {
		this.offClick(this, this.__onItemClick)
		this.btnCancel.offClick(this, this.__onCancelClick);
	}

	public checkFeedPet():boolean{
		if(this._info){
			return this._info.canGains() || this._info.canFeed();
		}
		return false;
	}

	public doOneKey(){
		if (this.isSelfFarm()) {
			if(this._info){
				if (this._info.canGains()) {
					this.gainsPet();
				} else if (this._info.canFeed()) {
					this.feedPet();
				}
			}
		}
		else {
			if (this._info && this._info.canFeed()) {
				this.feedPet();
			}
		}
	}

	private __onItemClick(target: any, evt: any) {
		if (!this.buttonMode) return;

		if (this.isSelfFarm()) {
			if (!this._info) {
				if(FarmModel.getPetData().length>0){
					FrameCtrlManager.Instance.open(EmWindow.FarmPetSelect, { pos: this.pos })
				}else{
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("FarmPetSelectMeun.noPet01"));
				}
			} else if (this._info.canGains()) {
				this.gainsPet();
			} else if (this._info.canFeed()) {
				this.feedPet();
			}
		}
		else {
			if (this._info && this._info.canFeed()) {
				this.feedPet();
			}
		}
	}

	private __onCancelClick(evt: Laya.Event) {
		if (!this._info) return;
		if (this.isSelfFarm() && this._info.canGains()) {
			return
		}

		let content: string = LangManager.Instance.GetTranslation("FarmPetLandView.cancelPet");
		SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (result: boolean, flag: boolean) => {
			if (!this._info) return;
			if (!result) return;

			FarmManager.Instance.sendFarmOper(this._info.userId, FarmOperateType.PET_PRACTICE_CANCEL, this.pos, this._info.petId, 0);
		});
	}

	public set info(value: PetLandInfo) {
		this._info = value;
		if (value && value.petId <= 0) {
			this._info = null;
		}
		this.petAvater.visible = Boolean(this._info)

		this.changeState();
		this.changeButtonMode();
		if (this._info) {
			this.update();
			this.txtPetName.text = this._info.petTemplate.TemplateNameLang;
			this.txtPetName.color = PetData.getQualityColor(this._info.quality - 1);
			this.petAvater.urlKey = this._info.petTemplate.PetAvatar;
			this.petAvater.play();
			let templateId = this._info.petTemplate.TemplateId
			if (this._info.petTemplate.PetAvatar == "/pet_cerberus") {
				this.petAvater.x = -15;
			} else {
				this.petAvater.x = 0;
			}
		} else {
			this.petAvater.stop();
			this.petAvater.urlKey = null;
			this.txtCownDown.text = "";
			this.txtPetName.text = "";
			this.showBtnOptEffect(false);
		}
	}

	public get info(): PetLandInfo {
		return this._info;
	}

	public update() {
		if (!this._info) return;

		let sec = this._info.remainMatureTime > 43200 ? 43200 : this._info.remainMatureTime;
		this.txtCownDown.text = DateFormatter.getStopDateString(sec);
		if (this._info.canGains() && this.isSelfFarm()) {
			this.showGainsMovie();
			this.changeState();
			this.changeButtonMode();
		} else if (this._info.canFeed()) {
			this.showFeedMovie();
		} else {
			this.showBtnOptEffect(false);
		}
	}

	private showGainsMovie() {
		this.showBtnOptEffect(true);
		this.btnOpt.icon = FUIHelper.getItemURL(EmWindow.Farm, "Icon_Farm_Collect")
	}

	private showFeedMovie() {
		this.showBtnOptEffect(true);
		this.btnOpt.icon = FUIHelper.getItemURL(EmWindow.Farm, "Icon_Farm_Sylph")
	}

	private showBtnOptEffect(show: boolean = true) {
		if (show) {
			let ani = this.btnOpt.getTransition("t0") as fgui.Transition
			if (!ani.playing) {
				ani.play(null, -1)
			}
			this.btnOpt.visible = true;
		} else {
			this.btnOpt.visible = false;
		}
	}

	private changeButtonMode() {
		let selfFarm: boolean = this.isSelfFarm();
		let isOpen: boolean = PlayerManager.Instance.currentPlayerModel.petSystemIsOpened;
		this.buttonMode = false;
		if (selfFarm) {
			if (this._info) {
				this.buttonMode = true;
			} else if (isOpen) {
				this.buttonMode = true;
			} else {
				this.buttonMode = false;
			}
		} else {
			if (this._info && this._info.canFeed()) {
				this.buttonMode = true;
			} else {
				this.buttonMode = false;
			}
		}
	}

	private changeState() {
		if (this._info) {
			if (this.isSelfFarm()) {
				this.cState.selectedIndex = this._info.canGains() ? 3 : 2;
			} else {
				this.cState.selectedIndex = 3;
			}
		} else {
			if (this.isSelfFarm()) {
				this.cState.selectedIndex = PlayerManager.Instance.currentPlayerModel.petSystemIsOpened ? 1 : 0;
			} else {
				this.cState.selectedIndex = 0;
			}
		}
	}

	private gainsPet() {
		let userId: number = this._info.userId;
		let op: number = FarmOperateType.PET_PRACTICE_COMPLETE;
		let pos: number = this.pos;
		let petid: number = this._info.petId;
		FarmManager.Instance.sendFarmOper(userId, op, pos, petid, 0);
	}

	private feedPet() {
		let userId: number = this._info.userId;
		let op: number = FarmOperateType.PET_FEED;
		let pos: number = this.pos;
		let petid: number = this._info.petId;
		let time: number = 10;
		FarmManager.Instance.sendFarmOper(userId, op, pos, petid, time);
	}

	private isSelfFarm(): boolean {
		return FarmManager.Instance.model.curSelectedFarmInfo == FarmManager.Instance.model.myFarm;
	}

	private resetView() {
	}

	public dispose() {
		this.delEvent();
		this.petAvater.dispose();
		super.dispose();
	}
}