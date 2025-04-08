import FUI_PetInfoView from "../../../../../fui/Battle/FUI_PetInfoView";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { BaseRoleInfo } from "../../../battle/data/objects/BaseRoleInfo";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PetData } from "../../pet/data/PetData";
import PetInfoItem from "./PetInfoItem";

export default class PetInfoView extends FUI_PetInfoView {

    private hasFirstPetData: boolean = false;
    private _selectedPetData: PetData;
    private _petViews: Array<PetInfoItem>;
    private _intervalTime: number = 0;
    private _keyCode: number = 0;
    private _hero: HeroRoleInfo;
    protected onConstruct() {
        super.onConstruct();
        this.initView();
        this.addEvent();
    }

    private initView() {
        let indexArr: Array<any> = this.playerInfo.petChallengeIndexFormation.split(",");
        this._petViews = [];
        if (indexArr) {
            let len: number = indexArr.length;
            let petInfoItem: PetInfoItem;
            this.currentPetIcon.icon = "";
            for (let i: number = 0; i < len; i++) {
                petInfoItem = this["p" + (i + 1)] as PetInfoItem
                petInfoItem.index = i;
                this._petViews.push(petInfoItem);
                if (indexArr[i] > 0) {//有英灵
                    petInfoItem.petData = this.playerInfo.getPet(indexArr[i]);
                    if (!this.hasFirstPetData) {//第一个英灵位置默认为选中状态
                        this.hasFirstPetData = true;
                        this._selectedPetData = this.playerInfo.getPet(indexArr[i]);
                        this.battleModel.currentSelectedPet = this._selectedPetData;
                        this._hero = this.battleModel.getBaseRoleInfoByPetTemplateId(this._selectedPetData.templateId);
                        this.battleModel.currentHero = this._hero;
                        this.setCurrentItemInfo();//设置当前选中的信息
                        petInfoItem.status = 1;
                    } else {
                        petInfoItem.status = 0;
                    }
                } else {
                    petInfoItem.petData = null;
                }
            }
        }
    }

    private addEvent() {
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDownHandler);
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_SELECTED_PET_STATUS, this.updateStatus, this);
        Laya.timer.loop(1000 / EnterFrameManager.FPS, this, this.__enterFrame);
        let petInfoItem: PetInfoItem;
        for (let i: number = 0; i < 3; i++) {
            petInfoItem = this["p" + (i + 1)] as PetInfoItem;
            if (petInfoItem.petData) {
                petInfoItem.onClick(this, this.__iconClick);
            }
        }
    }

    private removeEvent() {
        Laya.stage.off(Laya.Event.KEY_DOWN, this, this.onKeyDownHandler);
        Laya.timer.clearAll(this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_SELECTED_PET_STATUS, this.updateStatus, this);
        let petInfoItem: PetInfoItem;
        for (let i: number = 0; i < 3; i++) {
            petInfoItem = this["p" + (i + 1)] as PetInfoItem;
            if (petInfoItem.petData) {
                petInfoItem.offClick(this, this.__iconClick);
            }
        }
    }

    private __enterFrame() {
        if (this._hero) {
            this.txtHp.text = this._hero.bloodA + "/" + this._hero.totalBloodA;
            this.imgHp.fillAmount = this._hero.bloodA / this._hero.totalBloodA;
        }
    }

    private updateStatus() {
        this._selectedPetData = this.getNewSelectedPetData();
        if (!this._selectedPetData) {
            UIFilter.gray(this.currentPetIcon);
            return;
        }
        this.battleModel.currentSelectedPet = this._selectedPetData;
        this._hero = this.battleModel.getBaseRoleInfoByPetTemplateId(this._selectedPetData.templateId);
        this.battleModel.currentHero = this._hero;
        this._updateView();
        NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_SELECTED_PET, this._selectedPetData);
    }

    private onKeyDownHandler(event: Laya.Event) {
        if (Laya.Browser.now() - this._intervalTime < 100) {//切换操作会有0.1~0.2秒左右的隐藏CD（不能无限点击，防止控制标识乱飘）
            return;
        }
        this._intervalTime = Laya.Browser.now();
        this._keyCode = event.keyCode;
        this._selectedPetData = this.setSelectPetData(this._keyCode);
        if (!this._selectedPetData) return;
        this._hero = this.battleModel.getBaseRoleInfoByPetTemplateId(this._selectedPetData.templateId);
        this.battleModel.currentSelectedPet = this._selectedPetData;
        this.battleModel.currentHero = this._hero;
        if (this.isValidKey(event.keyCode)) {
            this._updateView();
            NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_SELECTED_PET, this._selectedPetData);
        }
    }

    private __iconClick(event: Laya.Event) {
        if (Laya.Browser.now() - this._intervalTime < 100) {//切换操作会有0.1~0.2秒左右的隐藏CD（不能无限点击，防止控制标识乱飘）
            return;
        }
        this._intervalTime = Laya.Browser.now();
        let petInfoItem: PetInfoItem = event.currentTarget["$owner"];
        this._selectedPetData = petInfoItem && petInfoItem.petData;
        if (!this._selectedPetData) return;
        this._hero = this.battleModel.getBaseRoleInfoByPetTemplateId(this._selectedPetData.templateId);
        this.battleModel.currentSelectedPet = this._selectedPetData;
        this.battleModel.currentHero = this._hero;
        this._updateView();
        NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_SELECTED_PET, this._selectedPetData);
    }

    private setSelectPetData(keyCode: number): PetData {
        let petData: PetData;
        let petInfoItem1: PetInfoItem = this.p1 as PetInfoItem;
        let petInfoItem2: PetInfoItem = this.p2 as PetInfoItem;
        let petInfoItem3: PetInfoItem = this.p3 as PetInfoItem;
        let shortcutCharUpper1: string = petInfoItem1.shortcutChar.toUpperCase();
        let shortcutCharUpper2: string = petInfoItem2.shortcutChar.toUpperCase();
        let shortcutCharUpper3: string = petInfoItem3.shortcutChar.toUpperCase();
        if (shortcutCharUpper1 && keyCode == shortcutCharUpper1.charCodeAt(0)) {//按下"A"
            petData = (this.p1 as PetInfoItem).petData;
        } else if (shortcutCharUpper2 && keyCode == shortcutCharUpper2.charCodeAt(0)) {
            petData = (this.p2 as PetInfoItem).petData;
        } else if (shortcutCharUpper3 && keyCode == shortcutCharUpper3.charCodeAt(0)) {
            petData = (this.p3 as PetInfoItem).petData;
        }
        return petData;
    }

    /**
     * 当控制的英灵死亡后，再选择一个默认控制的英灵
     * 从三个位置依次找，找到第一个英灵且英灵没有死亡的
     */
    private getNewSelectedPetData() {
        let petData: PetData;
        let petInfoItem: PetInfoItem;
        let hero: BaseRoleInfo;
        for (let i: number = 0; i < 3; i++) {
            petInfoItem = this["p" + (i + 1)] as PetInfoItem;
            if (petInfoItem && petInfoItem.petData) {
                hero = this.battleModel.getBaseRoleInfoByPetTemplateId(petInfoItem.petData.templateId);
                if (hero && hero.isLiving) {
                    petData = petInfoItem.petData;
                    break;
                }
            }
        }
        return petData;
    }

    private isValidKey(keyCode: number): boolean {
        if (keyCode == 65 || keyCode == 68 || keyCode == 83) {
            return true;
        }
        return false;
    }

    private _updateView() {
        let len: number = this._petViews.length;
        let item: PetInfoItem;
        for (let i: number = 0; i < len; i++) {
            item = this._petViews[i];
            if (item.petData && item.petData.templateId == this._selectedPetData.templateId) {
                item.selectCtr.selectedIndex = 1;
            } else {
                item.selectCtr.selectedIndex = 0;
            }
        }
        this.setCurrentItemInfo();
    }

    setCurrentItemInfo() {
        this.currentPetIcon.icon = IconFactory.getPetHeadSmallIcon(this._selectedPetData.templateId);
        if (this._hero) {
            this.txtHp.text = this._hero.bloodA + "/" + this._hero.totalBloodA;
            this.imgHp.fillAmount = this._hero.bloodA / this._hero.totalBloodA;
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
    }
}