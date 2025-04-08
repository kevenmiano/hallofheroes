// @ts-nocheck
import StringHelper from "../../../../../core/utils/StringHelper";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import MineralModel from "../../../../mvc/model/MineralModel";
import { NpcAvatarView } from "./NpcAvatarView";
import LangManager from '../../../../../core/lang/LangManager';
import { CampaignNode } from "../../../space/data/CampaignNode";
import { MineralCarInfo } from "../../data/MineralCarInfo";
import { AvatarInfoUIEvent, CampaignEvent, NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { CampaignArmyState } from "../../data/CampaignArmyState";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { NpcAttackHelper } from "../../../../utils/NpcAttackHelper";
import { CampaignArmy } from "../../data/CampaignArmy";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { eFilterFrameText, FilterFrameText } from "../../../../component/FilterFrameText";
import { ArmyState } from "../../../../constant/ArmyState";
import { AvatarResourceType } from "../../../../constant/AvatarDefine";
import { AvatarActionType } from "../../../../avatar/data/AvatarActionType";
import { AvatarPosition } from "../../../../avatar/data/AvatarPosition";
import { AvatarStaticData } from "../../../../avatar/data/AvatarStaticData";
import { PathManager } from "../../../../manager/PathManager";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { ResRefCountManager } from "../../../../managerRes/ResRefCountManager";
import LoaderPriority from "../../../../constant/LoaderPriority";
import { eAvatarBaseViewType } from "../../../view/hero/AvatarBaseView";
import { AvatarInfoUILayerHandler } from "../../../view/layer/AvatarInfoUILayer";



/**
 * 紫晶矿车
 * 1.bswf,  2.bswf,   1.bswf,  2.bswf
 * 低级矿车、高级矿车、未满矿、     已满矿 
 */
export default class MineralCarView extends NpcAvatarView {
    /**
     * 所有者Id 
     */
    private _owerId: number;
    /**
     * 矿车信息 
     */
    private _carInfo: MineralCarInfo;
    /**
     * 矿石数量 
     */
    private _mineralTxt: FilterFrameText;
    /**
     * 目标部队信息 
     */
    private _army: CampaignArmy;
    public avatarBaseViewType: eAvatarBaseViewType = eAvatarBaseViewType.MineralCar;

    constructor($body: string, $weapons: string, $sex: number, $job: number, $car: CampaignNode = null) {
        super($body, $weapons, $sex, $job);
        if ($car != null) {
            this._owerId = $car.info.occupyPlayerId;
            this._carInfo = this.mineralModel.carInfos[this._owerId];
            this._army = CampaignManager.Instance.mapModel.getUserArmyByUserId($car.info.occupyPlayerId);
        }
        this.mouseEnabled = !this.isSelf && !this.isSelfConsortia;
    }

    public get cadInfo(): MineralCarInfo {
        return this._carInfo;
    }

    public get armyInfo(): CampaignArmy {
        return this._army;
    }

    addEvent() {
        super.addEvent();
        this.mineralModel.addEventListener(CampaignEvent.UPDATE_MINERAL_INFO, this.__updateCarInfo, this);
    }

    removeEvent() {
        super.removeEvent();
        this.mineralModel.removeEventListener(CampaignEvent.UPDATE_MINERAL_INFO, this.__updateCarInfo, this);
    }

    attackFun(): boolean {
        if (!this.mapModel.mapTielsData || !this._army) return false;
        if (this.inMineralMapAndNotInFight) {
            NotificationManager.Instance.dispatchEvent(NotificationEvent.LOCK_PVP_WARFIGHT, this._army);
            return false;
        } else {
            var army: CampaignArmy = this.mapModel.selfMemberData;
            if (!army) return false;
            var armyView = CampaignManager.Instance.controller.getArmyView(army);
            var mapId: number = this.mapModel.mapId;
            var attackPoint: Laya.Point = NpcAttackHelper.getAttackPoint(this.nodeInfo as CampaignNode, new Laya.Point(armyView.x, armyView.y), new Laya.Point(this.x, this.y));
            CampaignManager.Instance.controller.moveArmyByPos(attackPoint.x, attackPoint.y, false, true);
        }
        return true;
    }

    private get inMineralMapAndNotInFight(): boolean {
        return (WorldBossHelper.checkMineral(this.mapModel.mapId) && ArmyState.checkCampaignAttack(this._army.state));
    }

    protected __isDieHandler(evt) {
        if (!this._army) return;
        if (CampaignArmyState.checkDied(this._army.isDie) || !ArmyState.checkCampaignAttack(this._army.state)) {
            UIFilter.gray(this._avatar);
            this.mouseEnabled = false;
        } else {
            UIFilter.normal(this._avatar);
            this.mouseEnabled = !this.isSelf && !this.isSelfConsortia;
        }
    }

    private __updateCarInfo(event: CampaignEvent) {
        this._carInfo = this.mineralModel.carInfos[this._owerId] as MineralCarInfo;
        if (this._carInfo) {
            if (!this._mineralTxt) {
                this._mineralTxt = new FilterFrameText(240, 20, undefined, 16);
                this._mineralTxt.y = this.showNamePosY - 20;
                this.addChild(this._mineralTxt);
            }
            this._mineralTxt.text = LangManager.Instance.GetTranslation("map.campaign.view.physics.MineralCarView.minerals", this._carInfo.minerals);
            this.__isDieHandler(null);
        } else {
            this.dispose();
        }
    }
    /**
     * 是否需要更新矿车视图 
     * @return 
     */
    private get needUpdate(): boolean {
        var newInfo: MineralCarInfo = this.mineralModel.carInfos[this._owerId] as MineralCarInfo;
        if (!this._carInfo || !newInfo) {
            return false;
        }
        if ((this._carInfo.minerals == 0 && newInfo.minerals > 0) ||         //无矿--> 有矿
            (this._carInfo.minerals < 200 && newInfo.minerals >= 200))     //未满--> 满矿
        {
            this._carInfo = newInfo;
            return true;
        }
        this._carInfo = newInfo;
        return false;
    }

    refreshAvatarView() {
        var cInfo: CampaignNode = (this._nodeInfo as CampaignNode);
        if (!cInfo) return;
        this.avatarView = new HeroAvatar(cInfo.sonType.toString(), AvatarResourceType.NPC, 0, true);
        this.objName = cInfo.info.names;
        this.uuid = (cInfo.nodeId + cInfo.followTarget).toString();

        cInfo.toward = (cInfo.sizeType == 10 ? 0 : cInfo.toward);
        this.updateDirection(cInfo.toward);
        this.setName(cInfo.info.names, cInfo.nameColor, cInfo.info.grade);

        var args;
        var url: string;
        if (this._carInfo) {
            let priority: number = this.isSelf ? LoaderPriority.Priority_10 : LoaderPriority.Priority_4;
            url = PathManager.getAvatarResourcePath(String(this._carInfo.quality + 1), -1, 1, AvatarPosition.BODY, -1, AvatarResourceType.MINERAL_CAR);
            args = this.createResourceLoadInfo(url,
                AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.BODY),
                AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.BODY),
                AvatarPosition.BODY);
            this.addRes2UnloadMap(args)
            ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);
        }
        this.avatarView.setShadowScaleXY(1.5, 1.5)
        this.avatarView.moveShadow(-68, -42);
        this.__isDieHandler(null);
    }

    protected setName(name: string = "", nameColor: number, grade?: number) {
        super.setName(name, nameColor, grade);

        // 这个未分层处理
        if (!this._mineralTxt) {
            this._mineralTxt = new FilterFrameText(240, 20, undefined, 16);
            this._mineralTxt.setStroke(0, 1);
            this._mineralTxt.y = this.showNamePosY - 20;
            this.addChild(this._mineralTxt);
        }
        if (this._carInfo) {
            this._mineralTxt.text = LangManager.Instance.GetTranslation("map.campaign.view.physics.MineralCarView.minerals", this._carInfo.minerals);
        }

        if (this.isSelf) {
            nameColor = 3
        } else if (this.isSelfConsortia) {
            nameColor = 2
        } else {
            nameColor = 5
        }
        AvatarInfoUILayerHandler.handle_NAME_FRAME(this._uuid, nameColor, eFilterFrameText.AvatarName)
    }

    public get isSelf(): boolean {
        if (!this._carInfo) return false;
        return this._carInfo.ownerId == this.playerInfo.userId;
    }

    private get isSelfConsortia(): boolean {
        if (this._army && this._army.baseHero) {
            if (StringHelper.isNullOrEmpty(this._army.baseHero.consortiaName)) return false;
            if (StringHelper.isNullOrEmpty(this.playerInfo.consortiaName)) return false;
            if (this.mapModel.isCross) {
                var consortiaID: number = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
                return this._army.baseHero.consortiaName == this.playerInfo.consortiaName && this._army.baseHero.consortiaID == consortiaID;
            } else {
                return this._army.baseHero.consortiaName == this.playerInfo.consortiaName;
            }
        }
        return false;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get mineralModel(): MineralModel {
        return CampaignManager.Instance.mineralModel;
    }

    dispose() {
        if (this._mineralTxt) this._mineralTxt.dispose();
        this._mineralTxt = null;
        this._carInfo = null;
        this._army = null;
        super.dispose();
    }

}