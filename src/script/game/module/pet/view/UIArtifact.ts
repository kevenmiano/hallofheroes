// @ts-nocheck
import FUI_PetArtifactItem from "../../../../../fui/Pet/FUI_PetArtifactItem";
import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import Utils from "../../../../core/utils/Utils";
import { BagType } from "../../../constant/BagDefine";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsType } from "../../../constant/GoodsType";
import { BagEvent, PetEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import { PetData } from "../data/PetData";
import ArtifactCell from "./item/ArtifactCell";
/**
 * 神器
 */
export default class UIArtifact extends BaseFguiCom {
	private _petData: PetData;
	public itemQualification1: FUI_PetArtifactItem;
	public itemQualification2: FUI_PetArtifactItem;
	public itemQualification3: FUI_PetArtifactItem;
	public itemQualification4: FUI_PetArtifactItem;
	public itemQualification5: FUI_PetArtifactItem;
	public goodsList: fgui.GList;
	private _goodsArr: Array<GoodsInfo> = [];
	private equipArr: GoodsInfo[] = [];
	public static MAX_VALUE:number = 1000
	public static MAX_WIDTH:number = 400;
	constructor(comp: fgui.GComponent) {
		super(comp);
		this.addEvent();
		this.initView();
	}

	private initView() {
		for (let j: number = 1; j <= 5; j++) {
			this["itemQualification" + j].titleTxt.text = LangManager.Instance.GetTranslation("petWnd.UIArtifact.itemTitle" + j);
		}
		this.updateListData();
		this.initPetValue();
	}

	private initPetValue(){
		for (let j: number = 1; j <= 5; j++) {
			this["itemQualification" + j].progressGroup.visible = false;
		}
	}

	private addEvent() {
		this.goodsList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
		GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
	}

	private removeEvent() {
		Utils.clearGListHandle(this.goodsList);
		GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
	}

	private __bagItemUpdate() {
		if (this._petData) {
			this.updateListData();
			this.updatePetValue();
		}
	}

	private updateListData() {
		this._goodsArr = [];
		let arr = GoodsManager.Instance.getGoodsByBagType(BagType.Player);
		for (let i = 0; i < arr.length; i++) {
			let goodsInfo: GoodsInfo = arr[i];
			if (goodsInfo && goodsInfo.templateInfo
				&& goodsInfo.templateInfo.MasterType == GoodsType.EQUIP
				&& goodsInfo.templateInfo.SonType == GoodsSonType.ARTIFACT && goodsInfo.objectId == 0
			) {
				this._goodsArr.push(goodsInfo);
			}
		}
		this._goodsArr.sort(this.byOrder);
		this.goodsList.numItems = 30;
	}

	renderListItem(index: number, item: ArtifactCell) {
		if (index > this._goodsArr.length) {
			item.info = null;
		} else {
			item.type = this.getType(this._goodsArr[index]);
			item.info = this._goodsArr[index];
		}
	}

	public get petData(): PetData {
		return this._petData;
	}

	public set data(value: PetData) {
		this._petData = value;
		if (this._petData) {
			this._petData.addEventListener(PetEvent.PETINFO_CHANGE, this.updatePetValue, this);
			this.updatePetValue();
			this.updateListData();
		}
	}

	private updatePetValue() {
		for (let j: number = 1; j <= 5; j++) {
			let maxWidth = this.getMaxValue(j) * UIArtifact.MAX_WIDTH / UIArtifact.MAX_VALUE;//算出来进度条的最大宽度;
			if(this.getMaxValue(j) > UIArtifact.MAX_VALUE){
				this["itemQualification" + j].progressGroup.visible = true;
				this["itemQualification" + j].commGroup.visible = false;
				this["itemQualification" + j].hpGroup.visible = true;
				(this["itemQualification" + j].prog2 as fgui.GProgressBar).width = UIArtifact.MAX_WIDTH;
				(this["itemQualification" + j].prog3 as fgui.GProgressBar).width = maxWidth - UIArtifact.MAX_WIDTH;
				if(this.getCurrentValue(j) > this.getMaxValue(j)){
					this["itemQualification" + j].txtValue.text = LangManager.Instance.GetTranslation("UIArtifact.txtValue.text",this.getCurrentValue(j),this.getMaxValue(j))
				}
				else{
					this["itemQualification" + j].txtValue.text = this.getCurrentValue(j) + "/" + this.getMaxValue(j);
				}
				(this["itemQualification" + j].prog2 as fgui.GProgressBar).max = UIArtifact.MAX_VALUE;
				(this["itemQualification" + j].prog3 as fgui.GProgressBar).max = this.getMaxValue(j) - UIArtifact.MAX_VALUE;
				if(this.getCurrentValue(j) > UIArtifact.MAX_VALUE){
					(this["itemQualification" + j].prog2 as fgui.GProgressBar).value = UIArtifact.MAX_VALUE;
					(this["itemQualification" + j].prog3 as fgui.GProgressBar).value = this.getCurrentValue(j) - UIArtifact.MAX_VALUE;
				}else{
					(this["itemQualification" + j].prog2 as fgui.GProgressBar).value = this.getCurrentValue(j);
					(this["itemQualification" + j].prog3 as fgui.GProgressBar).value = 0;
				}
			}
			else{
				this["itemQualification" + j].progressGroup.visible = true;
				this["itemQualification" + j].commGroup.visible = true;
				this["itemQualification" + j].hpGroup.visible = false;
				(this["itemQualification" + j].prog1 as fgui.GProgressBar).width = maxWidth;
				if(this.getCurrentValue(j) > this.getMaxValue(j)){
					this["itemQualification" + j].txtValue.text = LangManager.Instance.GetTranslation("UIArtifact.txtValue.text",this.getCurrentValue(j),this.getMaxValue(j))
				}
				else{
					this["itemQualification" + j].txtValue.text = this.getCurrentValue(j) + "/" + this.getMaxValue(j);
				}
				(this["itemQualification" + j].prog1 as fgui.GProgressBar).max = this.getMaxValue(j);
				(this["itemQualification" + j].prog1 as fgui.GProgressBar).value = this.getCurrentValue(j);
			}
		}

	}

	private getCurrentValue(index: number): number {
		let value: number = 0;
		this.equipArr = GoodsManager.Instance.getGoodsByBagType(BagType.PET_EQUIP_BAG);
		for (let i = 0; i < this.equipArr.length; i++) {
			const goodsInfo = this.equipArr[i];
			//判断英灵是否有穿戴装备
			if (goodsInfo.objectId == this._petData.petId
				&& (goodsInfo.pos == 6 || goodsInfo.pos == 7)) {
				if (index == 1) {
					value += goodsInfo.randomSkill1;
				} else if (index == 2) {
					value += goodsInfo.randomSkill2;
				} else if (index == 3) {
					value += goodsInfo.randomSkill3;
				} else if (index == 4) {
					value += goodsInfo.randomSkill4;
				} else if (index == 5) {
					value += goodsInfo.randomSkill5;
				}
			}
		}
		return value;
	}
	/**
	 *  得到各个属性的潜能最大值
	 * @param type 1,2,3,4,5分别为物攻、魔攻、物防、魔防、生命
	 * @returns 
	 */
	private getMaxValue(type: number): number {
		let value = 0;
		switch (type) {
			case 1:
				value = this._petData.atkpotential;
				break;
			case 2:
				value = this._petData.matpotential;
				break;
			case 3:
				value = this._petData.defpotential;
				break;
			case 4:
				value = this._petData.mdfpotential;
				break;
			case 5:
				value = this._petData.hppotential;
				break;
			default:
				break;
		}
		return value;
	}


	private getType(goodsInfo: GoodsInfo): number {
		let type: number = 0;
		if (GoodsCheck.hasIdentify(goodsInfo)) {//已经鉴定过
			type = 5;
		} else {//未鉴定
			type = 4;
		}
		return type;
	}

	public resetView() {

	}

	private byOrder(a: GoodsInfo, b: GoodsInfo): number {
		if (a.templateId > b.templateId) {
			return -1;
		} else if (a.templateId < b.templateId) {
			return 1;
		} else {
			return 0;
		}
	}

	public dispose(destred?: boolean) {
		this.removeEvent();
		super.dispose();
	}

}