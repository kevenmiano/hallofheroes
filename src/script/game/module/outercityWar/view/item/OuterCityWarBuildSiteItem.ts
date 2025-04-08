/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 16:07:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-19 16:01:40
 * @Description: 建筑界面驻防点Item
 */

import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { EmOuterCityWarBuildSiteOptType, EmOuterCityWarBuildSortType, EmOuterCityWarHeroType } from "../../../../constant/OuterCityWarDefine";
import { JobType } from "../../../../constant/JobType";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { PetItem } from "../../../pet/view/item/PetItem";
import { OuterCityWarManager } from "../../control/OuterCityWarManager";
import { OuterCityWarBuildSiteInfo } from "../../model/OuterCityWarBuildSiteInfo";
import FUI_OuterCityWarBuildSiteItem from "../../../../../../fui/OuterCityWar/FUI_OuterCityWarBuildSiteItem";
import { CampType } from "../../../../constant/Const";
import { OuterCityWarModel } from "../../model/OuterCityWarModel";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { OuterCityWarPlayerInfo } from "../../model/OuterCityWarPlayerInfo";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";

export default class OuterCityWarBuildSiteItem extends FUI_OuterCityWarBuildSiteItem {
    public buidType: EmOuterCityWarBuildSortType.Hero;
    private _info: OuterCityWarBuildSiteInfo;

    public set info(value: OuterCityWarBuildSiteInfo) {
        this._info = value;
    }

    public get info(): OuterCityWarBuildSiteInfo {
        return this._info
    }

    public onConstruct(): void {
        super.onConstruct()
        this.btnAttack.onClick(this, this.btnAttackClick)
        this.btnOccupy.onClick(this, this.btnOccupyClick)
        this.btnGiveUp.onClick(this, this.btnGiveUpClick)
        this.btnSettingDefance.onClick(this, this.btnSettingDefanceClick)
        this.btnAttack.text = LangManager.Instance.GetTranslation("public.attack")
        this.btnOccupy.text = LangManager.Instance.GetTranslation("public.occupy")
        this.btnGiveUp.text = LangManager.Instance.GetTranslation("public.giveup")
        this.btnSettingDefance.text = LangManager.Instance.GetTranslation("outerCityWar.defenceSetting")
    }

    public refreshView() {
        let isPetStyle = Number(this.buidType) == EmOuterCityWarBuildSortType.Pet
        this.cIsPet.setSelectedIndex(isPetStyle ? 1 : 0)
        /** 名字与积分必定存在 */
        this.imgScore.visible = true;
        this.txtOccupyScore.text = LangManager.Instance.GetTranslation("public.addMark", this._info.occupyScore);
        this.txtOptState0.text = LangManager.Instance.GetTranslation("outerCityWar.cannotJoinFight");
        this.txtOptState3.text = LangManager.Instance.GetTranslation("outerCityWar.cannotAttackSameGuild");
        this.txtOptState6.text = LangManager.Instance.GetTranslation("public.battle.battling");
        
        let playerInfo = this.info.playerInfo;
        if (!playerInfo) {
            this.resetInfo();
            this.txtNickName.text = LangManager.Instance.GetTranslation("public.defaultnumber2");
        } else {
            this.txtNickName.text = playerInfo.userName;

            if (playerInfo.heroType == EmOuterCityWarHeroType.Npc) {
                this.resetInfo()
            } else {
                this.txtGuild.text = playerInfo.guildName;

                if (isPetStyle) {
                    this.txtDefenceForce.text = playerInfo.defenseForcePet.toString();
                    this.txtPetTotalCapaity.text = playerInfo.getTotalPetCapaity().toString();
                    for (let index = 1; index <= OuterCityWarModel.MaxEnterWarPetCnt; index++) {
                        const item = this["petItem" + index] as PetItem;
                        let info = playerInfo.petList[index - 1]
                        item.visible = Boolean(info)
                        item.info = info
                    }
                } else {
                    this.txtDefenceForce.text = playerInfo.defenseForce.toString();
                    this.imgJob.icon = JobType.getJobIcon(playerInfo.job);
                    this.txtPawn.text = playerInfo.getPawnName();
                    this.txtCapaity.text = playerInfo.heroCapaity.toString();
                }
            }
        }

        let optType = Number(this._info.getOptType(this.fightModel.playerInfo.userId))
        let idx = 0
        switch (optType) {
            case EmOuterCityWarBuildSiteOptType.CANNOT_OPT:
                idx = 0
                break;
            case EmOuterCityWarBuildSiteOptType.CAN_SETTING_DEFENCE:
                idx = 1
                break;
            case EmOuterCityWarBuildSiteOptType.CAN_ATTACK:
                idx = 2
                break;
            case EmOuterCityWarBuildSiteOptType.CANNOT_ATTACK_SAME_GUILD:
                idx = 3
                break;
            case EmOuterCityWarBuildSiteOptType.CAN_GIVEUP:
                idx = 4
                break;
            case EmOuterCityWarBuildSiteOptType.CAN_OCCUPY:
                idx = 5
                break;
            case EmOuterCityWarBuildSiteOptType.FIGHTING:
                idx = 6
                break;
            default:
                break;
        }

        this.cOptState.setSelectedIndex(idx)
    }

    private resetInfo() {
        this.txtGuild.text = "";
        this.txtPawn.text = "";
        this.txtCapaity.text = "";
        this.txtDefenceForce.text = "";
        this.txtPetTotalCapaity.text = "";
        this.txtPetTotalCapaity.text = "";
        this.imgJob.icon = ""
        for (let index = 1; index <= OuterCityWarModel.MaxEnterWarPetCnt; index++) {
            const item = this["petItem" + index] as PetItem;
            item.info = null;
            item.visible = false;
        }
    }

    btnSettingDefanceClick() {
        FrameCtrlManager.Instance.open(EmWindow.OuterCityWarDefenceSettingWnd, { buildInfo: this._info.buildInfo, orderId: this._info.orderId })
    }

    btnGiveUpClick() {
        let content: string = LangManager.Instance.GetTranslation("outerCityWar.giveupSiteTip");
        SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b) => {
            if (b) {
                OuterCityWarManager.Instance.sendGiveUpBuildSite(this._info.buildInfo.sonType, this._info.orderId)
            }
        });
    }

    btnAttackClick() {
        if (!this.checkCond()) {
            return
        }

        let pInfo = this.fightModel.selfPlayInfo
        if (this.fightModel.selfPlayInfo) {
            let b = false;
            if (this._info.buildInfo.isPetBuild) {
                b = pInfo.defenseSitePet > 0
            } else if (this._info.buildInfo.isHeroBuild) {
                b = pInfo.defenseSite > 0
            }

            if (b) {
                Logger.outcityWar("玩家攻击前有对应类型的驻防点", pInfo.defenseSite, pInfo.orderId, pInfo.defenseSitePet, pInfo.orderIdPet)
                this.fightModel.attackSonType = this._info.buildInfo.sonType
                this.fightModel.attackOrderId = this._info.orderId
            }
        }
        OuterCityWarManager.Instance.sendAttackDefencerBuildSite(this._info.buildInfo.sonType, this._info.orderId)
    }

    btnOccupyClick() {
        if (!this.checkCond()) {
            return
        }
        OuterCityWarManager.Instance.sendOccupyBuildSite(this._info.buildInfo.sonType, this._info.orderId)
    }

    public checkCond() {
        if (!this.info) {
            return false;
        }
        let guildInfo = this.fightModel.getGuildInfo(this.fightModel.selfGuildId)
        if (!guildInfo) {
            Logger.outcityWar("自己没公会或公会未参战", this._info)
            return false;
        }

        if (guildInfo.camp == CampType.Attack && !this.info.buildInfo.preOneCompleteOccupyByAttacker) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outerCityWar.attackPreBuild"))
            return false;
        }

        if (guildInfo.camp == CampType.Defence && !this.info.buildInfo.preOneCompleteOccupyByDefencer) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outerCityWar.attackPreBuild"))
            return false;
        }

        return true
    }

    private get fightModel(): OuterCityWarModel {
        return OuterCityWarManager.Instance.model;
    }

    dispose() {

    }
}