// @ts-nocheck
import FUI_BloodsViews from "../../../../../fui/Battle/FUI_BloodsViews";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { BaseRoleInfo } from "../../../battle/data/objects/BaseRoleInfo";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { PawnRoleInfo } from "../../../battle/data/objects/PawnRoleInfo";
import { PetRoleInfo } from "../../../battle/data/objects/PetRoleInfo";
import { BattleType } from "../../../constant/BattleDefine";
import { BattleEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import BloodSingle from "./BloodSingle";


export default class BloodsViews extends FUI_BloodsViews {

    private bloodSingle: BloodSingle[][];

    private posIndex = [2, 5, 8, 3, 6, 9];

    private isShow = false;

    private isOneSide = false;



    protected onConstruct(): void {
        super.onConstruct();
        this.bloodSingle = [
            [
                this.bv3 as BloodSingle,
                this.bv4 as BloodSingle,
                this.bv5 as BloodSingle,
                this.bv0 as BloodSingle,
                this.bv1 as BloodSingle,
                this.bv2 as BloodSingle
            ]
            ,
            [
                this.bv6 as BloodSingle,
                this.bv7 as BloodSingle,
                this.bv8 as BloodSingle,
                this.bv9 as BloodSingle,
                this.bv10 as BloodSingle,
                this.bv11 as BloodSingle,
            ]
        ]

    }

    public init() {

        this.visible = false;
        this.isOneSide = this.oneSideShow();
        this.isShow = this.isOneSide || this.allSideShow();
        if (!this.isShow) return;
        // console.log("BloodsViews init ", this.battleModel.battleCapity, " : ", this.battleModel.battleType)


        // if (!this.isShow()) {
        //     return;
        // }

        NotificationManager.Instance.on(BattleEvent.REINFORCE, this.addReinforce, this);
        this.visible = true;
        let roles = this.battleModel.roleList;
        // let isOneSide = (this.isMulPve() && !this.isMulPvp());

        this.showOneSide.selectedIndex = this.isOneSide ? 0 : 1;

        let herosRole: BaseRoleInfo[] = []
        for (let role of roles) {

            let roleInfo = role[1] as HeroRoleInfo | PawnRoleInfo;

            if (roleInfo instanceof PetRoleInfo) continue;

            herosRole.push(roleInfo);
        }

        this.updateView(herosRole);

    }

    public get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }


    // private isShow() {
    //     return this.isMulPet() || this.isMulPvp() || this.isMulPve();
    // }

    // // 多人PVP
    // private isMulPvp() {
    //     // 组队打外城怪 battleType == BattleType.OUT_CITY_PK
    //     let battleType = this.battleModel.battleType;
    //     let isPvp = this.battleModel.isPvP() || battleType == BattleType.OUT_CITY_PK;
    //     return isPvp && battleType != BattleType.OUT_CITY_WAR_PK;
    // }

    // // 多人PVE 单边显示 0x131 英灵岛Boss,WORLD_MAP_NPC 打野
    // private isMulPve() {
    //     let battleType = this.battleModel.battleType;
    //     return battleType == BattleType.OUT_CITY_WAR_PET_MONSTER_PK || battleType == BattleType.WORLD_MAP_NPC || battleType == 0x131 || battleType == BattleType.REMOTE_PET_BATLE || this.battleModel.isMulPve;
    // }

    // private isMulPet() {
    //     let battleType = this.battleModel.battleType;
    //     return battleType == BattleType.PET_PK
    // }

    //增援
    private addReinforce(herosReinforce: HeroRoleInfo[]) {
        if (!this.isShow) {
            return;
        }

        this.updateView(herosReinforce);
    }

    private updateView(herosRole: BaseRoleInfo[]) {

        let isOneSide = this.isOneSide;
        for (let role of herosRole) {

            let roleInfo = role as HeroRoleInfo | PawnRoleInfo;

            if (roleInfo instanceof PetRoleInfo) continue;



            let side = role.side == BattleManager.Instance.battleModel.selfSide ? 0 : 1

            if (side == 1 && isOneSide) {
                continue;
            }

            let idx = this.posIndex.indexOf(roleInfo.pos);

            console.log("BloodsViews side:", roleInfo.side, " pos:", roleInfo.pos, " idx: ", idx);

            let bloodSingle = this.bloodSingle[side][idx];
            // if (!bloodSingle) {
            //     debugger;
            // }

            bloodSingle && bloodSingle.setRole(roleInfo);
        }

    }


    private oneSideShow() {
        let battleType = this.battleModel.battleType;
        //外城野怪
        return battleType == BattleType.WORLD_MAP_NPC ||
            //城战多英灵 npc 
            battleType == BattleType.OUT_CITY_WAR_PET_MONSTER_PK ||
            //英灵岛 活动  Boss
            battleType == 0x131 ||
            //英灵远征
            battleType == BattleType.REMOTE_PET_BATLE ||
            //多人副本
            this.battleModel.isMulPve
    }

    private allSideShow() {

        let battleType = this.battleModel.battleType;
        //外城pk
        return battleType == BattleType.OUT_CITY_PK ||
            //城战多英灵
            battleType == BattleType.OUT_CITY_WAR_PET_PK ||
            //英灵竞技
            battleType == BattleType.PET_PK ||
            //多人竞技
            battleType == BattleType.BATTLE_MATCHING ||
            // 天空之城英灵PK
            battleType == BattleType.SPACEMAP_PET_PK

    }


    public clear() {
        NotificationManager.Instance.off(BattleEvent.REINFORCE, this.addReinforce, this);
    }

}