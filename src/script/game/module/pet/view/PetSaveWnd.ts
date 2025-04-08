import BaseWindow from "../../../../core/ui/Base/BaseWindow";

import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { PlayerManager } from "../../../manager/PlayerManager";

import { PetData } from "../data/PetData";
import LangManager from "../../../../core/lang/LangManager";
import FUI_TabButton3 from "../../../../../fui/Base/FUI_TabButton3";
import { PetSaveItem } from "./item/PetSaveItem";
import PetModel from "../data/PetModel";
import { ItemSelectState } from "../../../constant/Const";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { FlashButton } from "./item/FlashButton";

/**
 * 请选择所保留英灵
 * @author zhihua.zhou
 */
export class PetSaveWnd extends BaseWindow {

	private txt_tip1:fairygui.GTextField;
	private txt_tip2:fairygui.GTextField;
	public petList: fgui.GList;
	private _petListData: PetData[] = [];
	/** 要保留的英灵 */
	private _savedData: PetData[] = [];
	private _petArr1: PetData[] = [];
	private _petArr2: PetData[] = [];
	private _petArr3: PetData[] = [];
	private _petArr4: PetData[] = [];
	private _petArr5: PetData[] = [];
	private _petArr6: PetData[] = [];
	tab1:FlashButton;
	tab2:FlashButton;
	tab3:FlashButton;
	tab4:FlashButton;
	tab5:FlashButton;
	tab6:FlashButton;
	private curSelect:FlashButton;
	private isFlash:boolean=false;

	/**初始化界面 */
	public OnInitWind(): void {
		super.OnInitWind();
		this.setCenter();
		this.txtFrameTitle.text = LangManager.Instance.GetTranslation("PetSave.txt0");
		this.txt_tip1.text = LangManager.Instance.GetTranslation("PetSave.txt1");
		this.txt_tip2.text = LangManager.Instance.GetTranslation("PetSave.txt2");
		let playInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
		this._petListData = playInfo.petList;
		for (let i = 1; i < 7; i++) {
			let petArr = this['_petArr'+i] = PetModel.getSamePetType(i+100);
			//战力由高到低排序
			petArr = ArrayUtils.sortOn(petArr, ["fightPower"], ArrayConstant.NUMERIC | ArrayConstant.NUMERIC);
			if(petArr.length == 0){
				this['tab'+i].visible = false;
			}else{
				if(petArr.length == 1){
					petArr[0].isSave = true;
					this.addSavePet(petArr[0]);
				}
				if(!this.curSelect){
					this.curSelect = this['tab'+i];
				}
			}
		}
		this.initEvent();
	}

	/**显示界面 */
	public OnShowWind() {
		super.OnShowWind();
		if(this.curSelect){
			this.curSelect.selected = true;
			this.onTabClick(this.curSelect);
		}
	}

	
	/**渲染列表资源项 */
	private onRenderPetItem(index: number,item:PetSaveItem) {
		let petData = this._petListData[index];
		if(petData){
			item.info = petData;
			//若某系只有1个英灵，则默认强制选中，且无法修改
			if(this.petList.numItems == 1){
				// petData.isSave = true;
				// this.addSavePet(petData);
				item.selectState = ItemSelectState.Selected;
			}else{	
				item.selectState = petData.isSave ?  ItemSelectState.Selected:ItemSelectState.Selectable;
			}
		}
	}

	/**初始化事件 */
	private initEvent() {
		for (let i = 1; i < 7; i++) {
			const btn:FUI_TabButton3 = this['tab'+i];
			btn.onClick(this,this.onTabClick,[btn]);
		}
		this.petList.itemRenderer = Laya.Handler.create(this, this.onRenderPetItem, null, false);
		this.petList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
	}

	private onClickItem(item: PetSaveItem) {
		if (item.selectState == ItemSelectState.Selectable) {
			this.resetItemState();
			item.selectState = ItemSelectState.Selected;
			item.info.isSave = true;
			this.addSavePet(item.info);
			if(this.isFlash){
				this.curSelect.clearflashTarget();
				this.curSelect.filters = [];
			}
			//其他选中的要取消，只能选中一个
		} else if (item.selectState == ItemSelectState.Selected) {
			//若某系只有1个英灵，则默认强制选中，且无法修改
			if(this.petList.numItems == 1){
				
			}else{
				
			}	
		}
	}

	private addSavePet(petData:PetData){
		for (let i = 0; i < this._savedData.length; i++) {
			const element = this._savedData[i];
			if(element.template.PetType == petData.template.PetType){
				this._savedData.splice(i,1);
				this._savedData.push(petData);
				return;
			}
		}
		this._savedData.push(petData);
	}

	public onTabClick(target:FlashButton) 
    {
		if(target){
			this.curSelect = target;
			let str:string = target.name;
			let index = parseInt(str.charAt(3));
			for (let i = 1; i < 7; i++) {
				const btn:FUI_TabButton3 = this['tab'+i];
				if(index !== i){
					btn.selected = false;
				}
			}
			this._petListData = this['_petArr'+index]
			this.petList.numItems = this._petListData.length;
		}
	}

	okBtnClick(){
		//所有系的都选择完成之前，点击确定弹出提示“选择尚未完成”，同时左侧未完成选择的页签闪烁（可能有多个）
		let isAllSave = true;
		if(this._petArr1.length>1 && !this.isCompleteSave(this._petArr1)){
			this.tab1.flashTarget();
			isAllSave = false;
		}
		if(this._petArr2.length>1 && !this.isCompleteSave(this._petArr2)){
			this.tab2.flashTarget();
			isAllSave = false;
		}
		if(this._petArr3.length>1 && !this.isCompleteSave(this._petArr3)){
			this.tab3.flashTarget();
			isAllSave = false;
		}
		if(this._petArr4.length>1 && !this.isCompleteSave(this._petArr4)){
			this.tab4.flashTarget();
			isAllSave = false;
		}
		if(this._petArr5.length>1 && !this.isCompleteSave(this._petArr5)){
			this.tab5.flashTarget();
			isAllSave = false;
		}
		if(this._petArr6.length>1 && !this.isCompleteSave(this._petArr6)){
			this.tab6.flashTarget();
			isAllSave = false;
		}
		if(!isAllSave){
			this.isFlash = true;
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('PetSave.txt6'));
		}else{
			this.isFlash = false;
			UIManager.Instance.ShowWind(EmWindow.PetSaveSureWnd,this._savedData);
		}	 
	}

	private isCompleteSave(array):boolean{
		for (let index = 0; index < array.length; index++) {
			const element = array[index];
			if(element.isSave){
				return true;
			}
		}
		return false;
	}

	private resetItemState(){
		for (let i = 0; i < this.petList.numChildren; i++) {
			const item:PetSaveItem = this.petList.getChildAt(i) as PetSaveItem;
			if(item){
				item.info.isSave = false;
				item.selectState = ItemSelectState.Selectable;
			}
		}
	}


	/**移除事件 */
	private removeEvent() {
		for (let i = 1; i < 7; i++) {
			const btn:FUI_TabButton3 = this['tab'+i];
			btn.offClick(this,this.onTabClick);
		}
		this.petList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
	}

	public OnHideWind() {
		this.removeEvent();
		let playInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
		let array = playInfo.petList;
		for (let i = 0; i < array.length; i++) {
			array[i].isSave = false;
		}
		this._savedData = null;
		super.OnHideWind();
	}
	
	/**释放界面 */
	dispose(dispose?: boolean) {
		super.dispose(dispose);
	}

	
}
