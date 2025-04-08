// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerManager } from "../../../manager/PlayerManager";
import FUIHelper from "../../../utils/FUIHelper";
import PetCtrl from "../control/PetCtrl";
import { PetData } from "../data/PetData";
import { PetSaveItem } from "./item/PetSaveItem";

/**
 * 英灵分解提示
 * @author zhihua.zhou
 */
export class PetSaveSureWnd extends BaseWindow {
	public txt_soulStone: fgui.GTextField;
	public txt_cornea: fgui.GTextField;
	private txt_tip1:fairygui.GTextField;
	private txt_tip2:fairygui.GTextField;
	public petList: fgui.GList;
	private _petListData: PetData[] = [];
	private _resoveData: number[] = [];


	/**初始化界面 */
	public OnInitWind(): void {
		super.OnInitWind();
		this._petListData = this.params;
		this.txt_tip1.text = LangManager.Instance.GetTranslation("PetSave.txt3");
		this.txt_tip2.text = LangManager.Instance.GetTranslation("PetSave.txt4");
		this.setCenter();
		this.initEvent();

		let cornea:number = 0;
		let soulStone:number = 0;
		let playInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
		for (let i = 0; i < playInfo.petList.length; i++) {
			const petdata:PetData = playInfo.petList[i];
			if(!petdata.isSave){
				//被分解英灵会根据培养数值返回对应数量的凝神珠（培养总值）和圣魂石（总经验值/12），加上英灵本身献祭所得的凝神珠
				this._resoveData.push(petdata.petId);
				cornea += petdata.calcResolveCornea();
				soulStone += petdata.calcResolveSoulStone();
			}
		}
		this.txt_cornea.text = cornea.toString();
		this.txt_soulStone.text = soulStone.toString();
	}

	/**显示界面 */
	public OnShowWind() {
		super.OnShowWind();
		this.petList.numItems = this._petListData.length;
	}

	/**释放界面 */
	dispose(dispose?: boolean) {
		super.dispose(dispose);
	}

	sureBtnClick(){
		let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("PetSave.txt7");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, (b:boolean)=>{
            if(b){
                this.onSure();
            }
        });
	}

	private onSure(){
		UIManager.Instance.HideWind(EmWindow.PetSaveWnd);
		PetCtrl.resolvePet(this._resoveData);
		this.hide();
	}

	cancelBtnClick(){
		this.hide();
	}


	/**初始化事件 */
	private initEvent() {
		this.petList.itemRenderer = Laya.Handler.create(this, this.onRenderPetItem, null, false);
	}
	
	/**渲染列表资源项 */
	private onRenderPetItem(index: number,item:PetSaveItem) {
		let petData = this._petListData[index];
		if(petData){
			item.info = petData;
		}
	}
}
