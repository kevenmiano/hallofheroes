/*
 * @Author: jeremy.xu
 * @Date: 2023-06-12 11:48:09
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-12 20:52:13
 * @Description: 阵型调整英灵列表item
 */
import FUI_PetChallengeAdjustPetItem from "../../../../../fui/PetChallenge/FUI_PetChallengeAdjustPetItem";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import FUIHelper from "../../../utils/FUIHelper";
import { PetData } from "../../pet/data/PetData";

export class PetChallengeAdjustPetItem extends FUI_PetChallengeAdjustPetItem {
    private _petData: PetData;
    private _corlorNum = 0;

    protected onConstruct(): void {
        super.onConstruct();
        this.addEvent();
    }
    
    private addEvent() {
        this.resetBtn.onClick(this, this.onResetBtn)
        this.fightBtn.onClick(this, this.onFightBtn);
    }

    private delEvent() {
    }

    public set info(v: PetData) {
        this._petData = v;
        this.updateView();
    }

    public get info() {
        return this._petData;
    }

    public updateView() {
        if (!this._petData) return;
        this._petIcon.url = IconFactory.getPetHeadSmallIcon(this._petData.templateId);;
        this.nameLab.text = this._petData.name;
        this.powerLab.setVar("pow", this._petData.fightPower + "").flushVars();
    }

    public updateInTeam(b:boolean) {
        this.resetBtn.visible = b;
        this.fightBtn.visible = !b;
    }

    public get corlorNum() {
        return this._corlorNum;
    }

    public set colorNum(v: number) {
        if (isNaN(v)) {
            v = 0;
        }
        this._corlorNum = v;
        this.colorFlag.visible = !!this._corlorNum;
        if (this.colorFlag.visible) {
            this.colorFlag.url = FUIHelper.getItemURL("Base", "Icon_Num" + this._corlorNum)
        }
    }

    private onResetBtn() {
        if (!this._petData) return
        NotificationManager.Instance.dispatchEvent(RemotePetEvent.PET_CHANGE, this._petData)
    }

    private onFightBtn() {
        if (!this._petData) return
        NotificationManager.Instance.dispatchEvent(RemotePetEvent.PET_CHANGE, this._petData)
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    dispose() {
        this.delEvent()
        super.dispose()
    }
}