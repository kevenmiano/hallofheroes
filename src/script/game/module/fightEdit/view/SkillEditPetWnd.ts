import FUI_CommonFrame3 from "../../../../../fui/Base/FUI_CommonFrame3";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { PetEvent } from "../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { EditPetItem } from "./item/EditPetItem";

/**
* @author:zhihua.zhou
* @data: 2022-07-6 18:40
* @description 选择英灵
*/
export default class PetChooseWnd extends BaseWindow {

    private itemList: fgui.GList;
    private curSelIndex: number = -1;
    private frame:FUI_CommonFrame3;
    private btn_sure:fairygui.GButton;
    private btn_cancel:fairygui.GButton;

    /**初始化 */
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();

        this.itemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.itemList.itemRenderer = Laya.Handler.create(this, this.onRenderListItem, null, false);
        this.itemList.numItems = this.petInfoList.length;
        this.addEvent();
        this.initLanguage();
       
    }

    initLanguage(){
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('FightSkillEdit.txt7');
        this.btn_sure.title = LangManager.Instance.GetTranslation('public.confirm');
        this.btn_cancel.title = LangManager.Instance.GetTranslation('public.cancel');
    }

    private addEvent(){
        this.btn_sure.onClick(this,this.onSure);
        this.btn_cancel.onClick(this,this.onCancel);
    }

    private removeEvent():void{
        this.btn_sure.offClick(this,this.onSure);
        this.btn_cancel.offClick(this,this.onCancel);
    }

    private onClickItem(item: EditPetItem) {
        this.setItemSelect(item);
        this.curSelIndex = this.itemList.getChildIndex(item);
    }

    private onRenderListItem(index: number, item: EditPetItem) {
        let tmpDataList = this.petInfoList

        if (!tmpDataList) return
        let itemData = tmpDataList[index]
        if (!itemData) {
            item.info = null
            return
        }
        item.state = EditPetItem.ItemUsing
        item.type = EditPetItem.PetSelList
        item.info = itemData
        item.enabled = true
        if (this.frameData) {
            let idx = this.frameData.indexOf(item.info.petId)
            if (idx > -1) {
                item.enabled = false
                // item.filters = [UIFilter.grayFilter]
            }
        }
    }

    public setItemSelect(item: EditPetItem) {
        this.setItemSelectNone();

        item.cSelected.selectedIndex = 1;
    }

    public setItemSelectNone() {
        for (let index = 0; index < this.itemList.numChildren; index++) {
            const element = this.itemList.getChildAt(index) as EditPetItem;
            element.cSelected.selectedIndex = 0;
        }
    }

    onCancel(){
        this.hide();
    }

    onSure(){
        if (this.curSelIndex < 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("pet.PetFrame.noSecondPet"));
            return;
        }

        let item = this.itemList.getChildAt(this.curSelIndex) as EditPetItem;
        let msg: string;
        // if (item.info.isEnterWar) {
        //     msg = LangManager.Instance.GetTranslation("FightSkillEdit.isEnterWar2");
        // }
        // else 
        if (item.info.isPractice) {
            msg = LangManager.Instance.GetTranslation("FightSkillEdit.isPractice2");
        }
        // else if (PlayerManager.Instance.currentPlayerModel.playerInfo.petChallengeFormationOfArray.indexOf(item.info.petId + "") >= 0) {
        //     msg = LangManager.Instance.GetTranslation("FightSkillEdit.inPetChanglle2");
        // }

        if (msg) {
            MessageTipManager.Instance.show(msg);
            return;
        }

        NotificationManager.Instance.dispatchEvent(PetEvent.PET_SELECT_CHANGE, item.info);
        this.hide()
    }

    private get petInfoList(): any[] {
        let tmp = []
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let petList = playerInfo.petList
        // for (let index = 0; index < petList.length; index++) {
        //     const info = petList[index] as PetData;
        //     // if(info.isEnterWar || info.isPractice || info.isDefenser || (playerInfo.petChallengeFormationOfArray.indexOf(info.petId + "") >= 0)){
        //     // 排除两个 主英灵 与副英灵
        //     if(false){

        //     }else{
        //         tmp.push(info)
        //     }
        // }
        return petList;
    }




    /**关闭 */
    OnHideWind() {

        this.removeEvent();
        super.OnHideWind();
    }
}