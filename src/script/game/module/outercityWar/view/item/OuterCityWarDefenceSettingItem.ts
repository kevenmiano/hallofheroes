/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 16:07:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-04 09:39:04
 * @Description: 会长、副会长防守设置界面Item
 */

import { EmOuterCityWarPlayerState } from "../../../../constant/OuterCityWarDefine";
import { JobType } from "../../../../constant/JobType";
import { OuterCityWarManager } from "../../control/OuterCityWarManager";
import { OuterCityWarBuildInfo } from "../../model/OuterCityWarBuildInfo";
import { OuterCityWarModel } from "../../model/OuterCityWarModel";
import { OuterCityWarPlayerInfo } from "../../model/OuterCityWarPlayerInfo";
import FUI_OuterCityWarDefenceSettingItem from "../../../../../../fui/OuterCityWar/FUI_OuterCityWarDefenceSettingItem";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";

export default class OuterCityWarDefenceSettingItem extends FUI_OuterCityWarDefenceSettingItem {
    public buildInfo: OuterCityWarBuildInfo;
    public orderId: number = 0;

    public onConstruct() {
        super.onConstruct()
        this.btnConfirm.onClick(this, this.btnConfirmClick)
        this.btnConfirm.text = LangManager.Instance.GetTranslation("public.confirm")
        this.txtDefenceState.text = LangManager.Instance.GetTranslation("outerCityWar.defancing")
    }

    private _info: OuterCityWarPlayerInfo;
    public set info(value: OuterCityWarPlayerInfo) {
        this._info = value;
        this.refreshView();
    }

    public get info(): OuterCityWarPlayerInfo {
        return this._info
    }

    public refreshView() {
        if (this._info) {
            this.imgJob.icon = JobType.getJobIcon(this._info.job)
            this.txtNickName.text = this._info.userName
            this.txtPawn.text = this._info.getPawnName()
            this.txtCapaity.text = this._info.heroCapaity.toString()
            this.txtDefenceBuild.text = this.buildInfo.isPetBuild ? this._info.defenseSitePetName : this._info.defenseSiteName;

            this.txtPetCapaity.text = this._info.getPetCapaityByType(this.buildInfo.petType).toString()
            this.txtPetTotalCapaity.text = this._info.getTotalPetCapaity().toString()

            let state = this.buildInfo.isPetBuild ? this._info.statePet : this._info.state;
            switch (state) {
                case EmOuterCityWarPlayerState.FREE:
                    this.cIsDefence.setSelectedIndex(0)
                    break;
                case EmOuterCityWarPlayerState.DEFANCE:
                    /** 相同建筑不可更换，不同建筑可更换驻防点 */
                    let defenceSite = this.buildInfo.isPetBuild ? this._info.defenseSitePet : this._info.defenseSite;
                    if (defenceSite == this.buildInfo.sonType) {
                        this.cIsDefence.setSelectedIndex(1)
                    } else {
                        this.cIsDefence.setSelectedIndex(0)
                    }
                    break;
                case EmOuterCityWarPlayerState.REPULSED:
                    break;
            }
        } else {

        }
    }

    private btnConfirmClick() {
        // 测试
        if (this.fightModel.isCastleFighting) {
            Logger.outcityWar("争夺状态不可操作设置出战")
            return
        }
        if (this.info && this.buildInfo) {
            OuterCityWarManager.Instance.sendDefenceBuild(this.info.userId, this.buildInfo.sonType, this.orderId)
        }
    }

    private get fightModel(): OuterCityWarModel {
        return OuterCityWarManager.Instance.model;
    }
}