// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:53:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-04-17 20:14:17
 * @Description: 选择修炼的宠物 
 */

import BaseWindow from '../../../../core/ui/Base/BaseWindow';
import { FarmOperateType } from '../../../constant/FarmOperateType';
import { FarmManager } from '../../../manager/FarmManager';
import { MessageTipManager } from '../../../manager/MessageTipManager';
import { PlayerManager } from '../../../manager/PlayerManager';
import { PetData } from '../../pet/data/PetData';
import FarmInfo from '../data/FarmInfo';
import LangManager from '../../../../core/lang/LangManager';
import { FarmPetListItem } from './item/FarmPetListItem';
import { FarmModel } from '../data/FarmModel';


export class FarmPetSelectWnd extends BaseWindow {
    private _currentPetId: number = 0;
    private _currentPos: number = 0;
    private _type: number = 1;
    private itemList: fgui.GList;
    private selectedPetItem: FarmPetListItem;

    /**
     * @param $curPet 当前位置的英灵
     * @param $pos 当前位置 0,1
     * @param $type 1: 选择修炼英灵 2: 选择守护英灵
     */
    OnShowWind() {
        super.OnShowWind();
        this.setCenter();

        this.initView();
    }

    private initView() {
        if (this.frameData) {
            if(this.frameData.curPetId){
                this._currentPetId = this.frameData.curPetId;
            }
            if(this.frameData.pos){
                this._currentPos = this.frameData.pos;
            }
            // this._type = this.frameData.type;
        }

        this.itemList.on(fgui.Events.CLICK_ITEM, this, this.__clickItem);
        this.itemList.itemRenderer = Laya.Handler.create(this, this.__renderListItem, null, false);
        this.itemList.numItems = this.petDatas.length
    }

    /** 选择修炼英灵 */
    private __renderListItem(index: number, item: FarmPetListItem) {
        let data = this.petDatas[index];
        if (!data) return;
        item.info = data
    }

    private get petDatas(): PetData[] {
        return FarmModel.getPetData(this._currentPetId)
    }

    /** 选择守护英灵 */
    private initGuardView() {
        // var petList: any[] = PlayerManager.Instance.currentPlayerModel.playerInfo.petList;
        // for each(var pet: PetData in petList) {
        //     if (pet.petId == this._currentPetId) continue;
        //     var item: FarmPetListItemView = new FarmPetListItemView();
        //     item.data = pet;
        // }
        // if (this._list.length == 0) {
        //     var str: string = LangManager.Instance.GetTranslation("FarmPetSelectMeun.noPet02");
        //     MessageTipManager.Instance().show(str);
        //     this.hide();
        //     return;
        // }
        // this.titleText = LangManager.Instance.GetTranslation("FarmSelectPetMeun.title2");
    }

    private __clickItem(item: FarmPetListItem) {
        this.selectedPetItem = item
    }

    private btnConfirmClick() {
        if(!this.selectedPetItem || !this.selectedPetItem.info){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("FarmPetSelectMeun.selectNone"));
            return;
        }

        var farmInfo: FarmInfo = FarmManager.Instance.model.myFarm;
        var userId: number = farmInfo.userId;
        var op: number = 0;
        var time: number = 12;
        var msg: string;
        if (this._type == 1) {
            op = FarmOperateType.PET_PRACTICE_START;
            if (this._currentPetId > 0) {
                msg = LangManager.Instance.GetTranslation("FarmPetSelectMeun.hasPet");
            }
            else if (this.selectedPetItem.info.isEnterWar) {
                msg = LangManager.Instance.GetTranslation("FarmPetSelectMeun.inWar");
            }
        } else {
            op = FarmOperateType.PET_DEFENSE;
        }
        if (msg) {
            MessageTipManager.Instance.show(msg);
            this.hide()
            return;
        }
        var petid: number = this.selectedPetItem.info.petId;
        FarmManager.Instance.sendFarmOper(userId, op, this._currentPos, petid, time);
        this.hide()
    }

    private btnCancelClick() { 
        this.hide()
    }
}