// @ts-nocheck
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import ResMgr from "../../../../../core/res/ResMgr";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import StringHelper from "../../../../../core/utils/StringHelper";
import { AvatarActionType } from "../../../../avatar/data/AvatarActionType";
import { AvatarPosition } from "../../../../avatar/data/AvatarPosition";
import { AvatarStaticData } from "../../../../avatar/data/AvatarStaticData";
import { Avatar } from "../../../../avatar/view/Avatar";
import { SimpleAvatarView } from "../../../../avatar/view/SimpleAvatarView";
import { eFilterFrameText, FilterFrameText } from "../../../../component/FilterFrameText";
import { MovieClip } from "../../../../component/MovieClip";
import { t_s_mounttemplateData } from '../../../../config/t_s_mounttemplate';
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import { ArmyState } from "../../../../constant/ArmyState";
import { AvatarResourceType } from "../../../../constant/AvatarDefine";
import { AvatarInfoTag } from "../../../../constant/Const";
import { ArmyEvent, ObjectsEvent, PetEvent, PhysicsEvent } from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { JobType } from "../../../../constant/JobType";
import LoaderPriority from "../../../../constant/LoaderPriority";
import { UpgradeType } from "../../../../constant/UpgradeType";
import { ArmyPetInfo } from "../../../../datas/ArmyPetInfo";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { AnimationManager } from "../../../../manager/AnimationManager";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { ChatManager } from "../../../../manager/ChatManager";
import FreedomTeamManager from "../../../../manager/FreedomTeamManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import { PathManager } from "../../../../manager/PathManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { SharedManager } from "../../../../manager/SharedManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { ResRefCountManager } from "../../../../managerRes/ResRefCountManager";
import ChatData from "../../../../module/chat/data/ChatData";
import { SpacePlayerWalkMediator } from "../../../../mvc/mediator/SpacePlayerWalkMediator";
import { StageReferance } from "../../../../roadComponent/pickgliss/toplevel/StageReferance";
import SpaceScene from "../../../../scene/SpaceScene";
import { ArmySpeedUtils } from "../../../../utils/ArmySpeedUtils";
import { BaseArmyAiInfo } from "../../../ai/BaseArmyAiInfo";
import { ResourceLoaderInfo } from "../../../avatar/data/ResourceLoaderInfo";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { PetAvatarView } from "../../../avatar/view/PetAvatarView";
import { eAvatarBaseViewType } from "../../../view/hero/AvatarBaseView";
import { HeroAvatarView } from "../../../view/hero/HeroAvatarView";
import { AvatarInfoUILayerHandler } from "../../../view/layer/AvatarInfoUILayer";
import Tiles from "../../constant/Tiles";
import { BaseArmy } from "../../data/BaseArmy";
import SpaceArmy from "../../data/SpaceArmy";
import SpaceManager from "../../SpaceManager";
import { SpaceWalkLayer } from "../layer/SpaceWalkLayer";


/**
 * 天空之城人物显示对象
 *
 */
export class SpaceArmyView extends HeroAvatarView {
    public avatarBaseViewType: eAvatarBaseViewType = eAvatarBaseViewType.SpaceArmy;
    public static DEFAULT_SPEED: number = 7;
    public static HALF_SPEED: number = 4;

    public static NAME: string = "map.space.view.physics.SpaceArmyView";
    private _mediatorKey: string;
    private _data: SpaceArmy;
    private _consortiaTxt: FilterFrameText;
    private _honerView: SimpleAvatarView;
    private _vipIcon: fgui.GImage;
    private _attackView: SimpleAvatarView;
    private _isFlying: boolean = false;
    private _appellId: number = 0;
    private _controller: SpaceScene;
    private _currentPos: Laya.Point;
    /**
     * 主角与其他玩家距离权重
     */
    public distanceWeight: number = 0;


    constructor() {
        super()

        this.autoSize = true;
        this.mouseEnabled = true;
        this.hitTestPrior = true;
        this._controller = <SpaceScene>SpaceManager.Instance.controller;
    }

    private showFateSkillEffect() {
        if (this._fateSkillEffect)
            this._fateSkillEffect.destroy();
        this._fateSkillEffect = null;
        if (!this._data.baseHero.fateSkill) {
            return;
        }
        let args: any[] = this._data.baseHero.fateSkill.split(",");
        let maxId: number = 0;
        let maxGrade: number = 0;
        args.forEach(element => {
            let grade: number = parseInt(element.substr(element.length - 2, 2).toString());
            if (grade > maxGrade) {
                maxGrade = grade;
                maxId = parseInt(element.toString());
            }
        })
        let skillTemp: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(maxId);
        if (!skillTemp || skillTemp.Grades == 0) return;
        let upgradeTemp: t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevel(skillTemp.Grades, UpgradeType.UPGRADE_TYPE_FATE_GUARD);
        if (StringHelper.isNullOrEmpty(upgradeTemp.TemplateNameLang)) return;
        if (!upgradeTemp.ActiveObject) { return };
        let url: string = PathManager.getFateWalkPath(upgradeTemp.ActiveObject, ".json");
        ResMgr.Instance.loadRes(url, (res) => {
            if (!res || !res.meta) return;
            let _preUrl = res.meta.prefix;
            let offset = res.offset;
            if (!offset) {
                offset = { x: 0, y: 0 };
            }
            let _cacheName = _preUrl;
            let aniName = "";
            AnimationManager.Instance.createAnimation(_preUrl, aniName, undefined, "", AnimationManager.MapPhysicsFormatLen);
            this._fateSkillEffect = new MovieClip(_cacheName);
            this._fateSkillEffect.gotoAndPlay(0, true, _cacheName)
            this.addChildAt(this._fateSkillEffect, 0);
            this._fateSkillEffect.visible = !SharedManager.Instance.hideOtherPlayer;
            this._fateSkillEffect.pos(-parseInt(offset.x), -parseInt(offset.y));
        }, null, Laya.Loader.ATLAS);
    }

    public lockTargetAndHideFate() {
        if (this._fateSkillEffect && this._fateSkillEffect.parent) {
            this._fateSkillEffect.parent.removeChild(this._fateSkillEffect);
        }
    }

    public unlockTargetAndShowFate() {
        if (this._fateSkillEffect) {
            this.addChildAt(this._fateSkillEffect, 0);
        }
    }

    public set data(value: SpaceArmy) {
        if (this._data == value) {
            return;
        }
        Logger.xjy("[SpaceArmyView]data", value)
        this.removeEvent();
        this._data = value;
        let arr: any[] = [];
        if (this.isSelf) {
            arr.push(SpacePlayerWalkMediator);
        }
        this.addEvent();
        this.showFateSkillEffect();
        this.showAvatar(value);
        this.showPet(value.petInfo);
        // this.__updateInfoHandler(null);
        this.__updateSpaceArmyStateHandler(null);
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, SpaceArmyView.NAME);
    }

    protected addEvent() {
        super.addEvent();
        if (this._data) {
            this._data.addEventListener(PhysicsEvent.CHAT_DATA, this.__chatHandler, this);
            this._data.addEventListener(ArmyEvent.UPDATE_STATE, this.__updateSpaceArmyStateHandler, this);
            if (this.isSelf) {
                PlayerManager.Instance.addEventListener(PetEvent.PET_LEVEL_UP, this.__petLevelUpHandler, this);
                this.thane.addEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__heroPropertyHandler, this);
            }
            this._data.baseHero.addEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__avatarChangeHandler, this);
            this._data.baseHero.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__updateInfoHandler, this);
            this._data.baseHero.addEventListener(PlayerEvent.APPELL_CHANGE, this.__updateInfoHandler, this);
            this._data.petInfo.addEventListener(ArmyEvent.PETINFO_CHANGED, this.__updatePetAvatarHandler, this);
        }
    }

    protected removeEvent() {
        super.removeEvent();
        PlayerManager.Instance.removeEventListener(PetEvent.PET_LEVEL_UP, this.__petLevelUpHandler, this);
        if (this._data) {
            this._data.removeEventListener(PhysicsEvent.CHAT_DATA, this.__chatHandler, this);
            this._data.removeEventListener(ArmyEvent.UPDATE_STATE, this.__updateSpaceArmyStateHandler, this);
            if (this.isSelf) {
                this.thane.removeEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__heroPropertyHandler, this);
            }
            this._data.baseHero.removeEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__avatarChangeHandler, this);
            this._data.baseHero.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__updateInfoHandler, this);
            this._data.baseHero.removeEventListener(PlayerEvent.APPELL_CHANGE, this.__updateInfoHandler, this);
            this._data.petInfo.removeEventListener(ArmyEvent.PETINFO_CHANGED, this.__updatePetAvatarHandler, this);
        }
    }

    private __updatePetAvatarHandler(evt) {
        this.showPet(evt);
    }

    protected setName(name: string = "", nameColor?: number, grade?: number) {
        nameColor = this.getNameColor();
        name = this._data.baseHero.nickName;
        grade = this._data.baseHero.grades;

        super.setName(name, nameColor, grade);
        this.setConsortiaName(this.consortiaName, nameColor);
        this.setHonerName();
        this.showVipIcon(this.isVip);
        this.showQQDWKIcon(this.isDwk);
        this.layoutTxtViewWithNamePosY();
    }

    protected getNameColor(): number {
        let nameColor: number = 1;
        if (this.isSelf) {
            nameColor = 3;
        } else if (this.isSelfConsortia) {
            nameColor = 2;
        }
        return nameColor
    }

    protected createNickName() {
        AvatarInfoUILayerHandler.handle_CON_CREATE(this._uuid, AvatarInfoTag.NickName, { bold: this.isSelf })
    }

    public setConsortiaName(name: string, nameColor: number, noSymbol: boolean = false) {
        if (StringHelper.isNullOrEmpty(name)) {
            AvatarInfoUILayerHandler.handle_CON_VISIBLE(this._uuid, AvatarInfoTag.ConsortiaName, false)
            return;
        }
        AvatarInfoUILayerHandler.handle_CON_VISIBLE(this._uuid, AvatarInfoTag.ConsortiaName, this._isPlaying)
        AvatarInfoUILayerHandler.handle_CONSORTIA_TEXT(this._uuid, (noSymbol ? name : LangManager.Instance.GetTranslation("map.avatar.view.consortiaName", name)))
        AvatarInfoUILayerHandler.handle_CONSORTIA_FRAME(this._uuid, nameColor, eFilterFrameText.AvatarName)
    }

    protected setHonerName() {
        if (this._appellId == this.appellId) {
            return;
        }
        this._appellId = this.appellId;
        AvatarInfoUILayerHandler.handle_CON_DISPOSE(this._uuid, AvatarInfoTag.Appell)
        let appellInfo = this._data.baseHero.appellInfo
        if (this.isHoner && appellInfo && this._isPlaying) {
            let obj = {
                imgWidth: appellInfo.ImgWidth,
                imgHeight: appellInfo.ImgHeight,
                appellId: this.appellId,
                imgCount: appellInfo.ImgCount,
            }
            AvatarInfoUILayerHandler.handle_CON_CREATE(this._uuid, AvatarInfoTag.Appell, obj)
            this.showHoner();
            AvatarInfoUILayerHandler.handle_CON_POSX(this._uuid, this.x)
            AvatarInfoUILayerHandler.handle_CON_POSY(this._uuid, this.y + this._showNamePosY)
        }
    }

    protected layoutTxtViewWithNamePosY() {
        if (!this._data) return;
        super.layoutTxtViewWithNamePosY();

        if (this._attackView) {
            this._attackView.y = this._showNamePosY - 90;
        }
    }

    public showVipIcon(visible: boolean = true) {
        super.showVipIcon(visible)
        // this._data.baseHero.vipType == 1 ? this._vipIcon.setFrame(1) : this._vipIcon.setFrame(2);
    }

    public execute() {
        super.execute();
        if (this._avatar) {
            if (this._isStand) {
                (<HeroAvatar>this._avatar).stepFrame = 4;
            } else if (this._isMounting) {
                (<HeroAvatar>this._avatar).stepFrame = 1;
            } else {
                (<HeroAvatar>this._avatar).stepFrame = 2;
            }
        }


        if (this._petAvatarView) {
            this._petAvatarView.execute();
        }

        if (this.isPlaying) {
            if (this._attackView) this._attackView.draw();
            if (this._honerView) this._honerView.draw();
        }
    }

    private resetAlpha() {
        let b: boolean = false;
        if (SpaceManager.Instance.model) b = SpaceManager.Instance.model.walkableValueIsPara(4, this.x / Tiles.WIDTH, this.y / Tiles.HEIGHT);
        let al: number = 1;
        if (!this._isFlying) {
            al = (b ? .5 : 1);
        }
        if (this._avatar) {
            this._avatar.alpha = al;
            this.shadowAlpha = al;
            // this.infoAlpha = al;
        }
    }

    //特殊界面打开人物停止移动,参见goldRoadFrame.show()
    public stopWalkByOut() {
        this._info.pathInfo = [];
        this.nextWalk(new Laya.Point(this._data.curPosX + 5, this._data.curPosY + 5));
    }

    protected nextWalk(point: Laya.Point) {
        this._currentPos = this.getTilePos();
        this._data.curPosX = this._currentPos.x;
        this._data.curPosY = this._currentPos.y;

        super.nextWalk(point);
    }

    protected playMovie() {
        super.playMovie();

        let pos: Laya.Point = this.getTilePos();
        if (pos.x != this._currentPos.x || pos.y != this._currentPos.y) {
            this._info.dispatchEvent(ObjectsEvent.WALK_NEXT, { "point": pos });
            this._currentPos = pos;
            this.resetAlpha();
            this._data.curPosX = this._currentPos.x;
            this._data.curPosY = this._currentPos.y;
        }
        this.changeLandEffect();
    }

    public changeLandEffect() {
        if (SpaceManager.Instance.model.isOnObstacle) {
            if (this._fateSkillEffect && this._fateSkillEffect.visible) {
                this._fateSkillEffect.visible = false;
            }
            this.noShadow = true;
        } else {
            //隐藏其他人的时候, 不隐藏自己的守护光圈
            if ((!SharedManager.Instance.hideOtherPlayer || this.isSelf) && this._fateSkillEffect && !this._fateSkillEffect.visible) {
                this._fateSkillEffect.visible = true;
            }
            this.noShadow = false;
        }
    }

    protected newMove() {
        if (!this.isSelf) {
            SpaceManager.Instance.model.moveToVisible(this.data);
        }
    }

    protected walkOver() {
        super.walkOver();
        this.resetAlpha();
        this.changeLandEffect();
    }

    private __updateInfoHandler(data: any) {
        if (data) {
            let t: ThaneInfo = <ThaneInfo>data;
            this.data.petInfo.petTemplateId = t.petTemplateId;
            this.data.petInfo.petName = t.petName;
            this.data.petInfo.petQuaity = t.petQuaity;
            this.data.petInfo.petTemQuality = t.temQuality;
            let spaceArmy:SpaceArmy = SpaceManager.Instance.model.getBaseArmyByUserId(t.userId);
            if(spaceArmy){
                this.x = spaceArmy.curPosX * 20;
                this.y = spaceArmy.curPosY * 20;
            }
            this.data.petInfo.commit();
        }

        this.setName();
    }

    private showAvatar(value: SpaceArmy) {
        if (this._isFlying) {
            this.aiInfo.pathInfo = [];
        }
        this._isFlying = false;
        this.info.speed = ArmySpeedUtils.getMoveSpeed(value);
        let changeShapeId: number = 0;
        let mountTemplate: t_s_mounttemplateData;
        let showFashionAvatar: boolean = false;
        let thaneInfo: ThaneInfo;
        let army: BaseArmy;
        //由于玩家在进入房间场景时自己的天空之城数据不会更新, 这里坐骑和速度就会出现bug
        if (this.isSelf) {
            // Logger.xjy("[SpaceArmyView]添加自身 thaneInfo=", this.thane, ", SpaceArmy=", value)
            thaneInfo = this.thane;
            army = ArmyManager.Instance.army
        } else {
            // Logger.xjy("[SpaceArmyView]添加其他英雄 thaneInfo=", value.baseHero, ", SpaceArmy=", value)
            thaneInfo = value.baseHero;
            if (value.mountTemplate) {
                this.thane.avatarChange[AvatarPosition.MOUNT] = true;
            }
            army = value;
        }
        mountTemplate = army.mountTemplate;
        this.isMounting = Boolean(mountTemplate);
        if (this.info) this.info.speed = ArmySpeedUtils.getMoveSpeed(army);

        let bodyAvatar: string = thaneInfo.bodyEquipAvata;
        let armyAvatar: string = thaneInfo.armsEquipAvata;
        changeShapeId = thaneInfo.changeShapeId;
        showFashionAvatar = !thaneInfo.hideFashion;
        if (!thaneInfo.templateInfo) {
            return;
        }
        let sex: number = thaneInfo.templateInfo.Sexs;
        let job: number = thaneInfo.templateInfo.Job;
        if (bodyAvatar == "") {
            bodyAvatar = JobType.getDefaultBodyEquipNameByJob(job);
        }
        if (armyAvatar == "") {
            armyAvatar = JobType.getDefaultArmysEquipNameByJob(job);
        }
        let hairUpAvatar: string = JobType.getDefaultHairUpByJob(job);
        let hairDownAvatar: string = JobType.getDefaultHairDownByJob(job);
        let cloakAvatar: string = JobType.getCloakEquipNameByBodyEquip(bodyAvatar);
        let wingAvatar: string = thaneInfo.wingAvata;
        let mountAvatar: string = "";


        let args: ResourceLoaderInfo;
        let url: string;
        let priority: number = this.isSelf ? LoaderPriority.Priority_10 : LoaderPriority.Priority_4;

        if (changeShapeId > 0) {
            // Logger.xjy("[SpaceArmyView]changeShapeId", changeShapeId)
            bodyAvatar = changeShapeId + "";
            armyAvatar = "";
            if (!this.avatarView) {
                this.avatarView = new HeroAvatar(bodyAvatar, AvatarResourceType.NPC, sex, true, job);
            }
            this.avatarView.currentMountId = mountTemplate ? mountTemplate.TemplateId : -1;
            this.objName = value.baseHero.nickName;
            this.uuid = value.id.toString();
            this.avatarView.changeShapeId = changeShapeId;
            this.avatarView.type = AvatarResourceType.NPC;
            this.avatarView.showAllAvatar(false);

            url = PathManager.getAvatarResourcePath(bodyAvatar, sex, 1, AvatarPosition.BODY, job, AvatarResourceType.NPC);
            args = this.createResourceLoadInfo(url, [0, 0, 0, 0, 0], [0, 0, 0], AvatarPosition.BODY);
            this.addRes2UnloadMap(args)
            ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);
            return;
        } else {
            if (!this.avatarView) {
                this.avatarView = new HeroAvatar(bodyAvatar, AvatarResourceType.PLAYER_ARMY, sex, true, job);
            }
            this.avatarView.currentMountId = mountTemplate ? mountTemplate.TemplateId : -1;
            this.objName = value.baseHero.nickName;
            this.uuid = value.id.toString();
            // Logger.xjy("[SpaceArmyView]showAvatar", value.baseHero.nickName, value.id)
            this.avatarView.changeShapeId = 0;
            this.avatarView.type = AvatarResourceType.PLAYER_ARMY;

            let bodyType: number = 1;
            let armsType: number = 1;
            let hairType: number = 1;
            if (showFashionAvatar) {
                if (thaneInfo.bodyFashionAvata) {
                    bodyAvatar = thaneInfo.bodyFashionAvata;
                    cloakAvatar = "";
                    bodyType = 2
                }
                if (thaneInfo.armsFashionAvata) {
                    armyAvatar = thaneInfo.armsFashionAvata;
                    armsType = 2;
                }
                if (thaneInfo.hairFashionAvata) {
                    hairUpAvatar = thaneInfo.hairFashionAvata + "up";
                    hairDownAvatar = thaneInfo.hairFashionAvata + "down";
                    hairType = 2;
                }
            }
            if (mountTemplate) {
                (this.avatarView as HeroAvatar).isStandPosMount = mountTemplate.useStandPose;
                if (!mountTemplate.useStandPose) {
                    bodyAvatar = JobType.getMapMountEquipment(bodyAvatar);
                    armyAvatar = JobType.getMapMountEquipment(armyAvatar);
                    hairUpAvatar = JobType.getMapMountEquipment(hairUpAvatar);
                    hairDownAvatar = JobType.getMapMountEquipment(hairDownAvatar);
                    cloakAvatar = JobType.getMapMountEquipment(cloakAvatar);
                    wingAvatar = JobType.getMapMountEquipment(wingAvatar);
                }
                mountAvatar = mountTemplate.AvatarPath == "" ? JobType.getDefaultMount() : mountTemplate.AvatarPath;
                this._isFlying = SpaceManager.Instance.model.isFlying(this._data.mountTemplateId);
                // Logger.xjy("[SpaceArmyView]_isFlying ", this._isFlying, this._data.mountTemplateId)
            } else {
                (this.avatarView as HeroAvatar).isStandPosMount = false;
            }

            let isStandMount = this._isMounting && mountTemplate.useStandPose
            if (wingAvatar) {
                cloakAvatar = "";
                url = PathManager.getAvatarResourcePath(wingAvatar, sex, 1, AvatarPosition.WING, job, AvatarResourceType.PLAYER_ARMY);
                args = this.createResourceLoadInfo(url,
                    AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.WING, this._isMounting, isStandMount, job, sex),
                    AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.WING, this._isMounting, isStandMount, job, sex),
                    AvatarPosition.WING);
                this.addRes2UnloadMap(args)
                ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);
            } else if (cloakAvatar) {
                url = PathManager.getAvatarResourcePath(cloakAvatar, sex, 1, AvatarPosition.CLOAK, job, AvatarResourceType.PLAYER_ARMY);
                args = this.createResourceLoadInfo(url,
                    AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.CLOAK, this._isMounting, isStandMount, job, sex),
                    AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.CLOAK, this._isMounting, isStandMount, job, sex),
                    AvatarPosition.CLOAK);
                this.addRes2UnloadMap(args)
                ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);
            }
            if (hairDownAvatar) {
                url = PathManager.getAvatarResourcePath(hairDownAvatar, sex, hairType, AvatarPosition.HAIR_DOWN, job, AvatarResourceType.PLAYER_ARMY);
                args = this.createResourceLoadInfo(url,
                    AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.HAIR_DOWN, this._isMounting, isStandMount, job, sex),
                    AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.HAIR_DOWN, this._isMounting, isStandMount, job, sex),
                    AvatarPosition.HAIR_DOWN);
                this.addRes2UnloadMap(args)
                ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);

            }
            if (hairUpAvatar) {
                url = PathManager.getAvatarResourcePath(hairUpAvatar, sex, hairType, AvatarPosition.HAIR_UP, job, AvatarResourceType.PLAYER_ARMY);
                args = this.createResourceLoadInfo(url,
                    AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.HAIR_UP, this._isMounting, isStandMount, job, sex),
                    AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.HAIR_UP, this._isMounting, isStandMount, job, sex),
                    AvatarPosition.HAIR_UP);
                this.addRes2UnloadMap(args)
                ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);

            }
            if (armyAvatar) {
                url = PathManager.getAvatarResourcePath(armyAvatar, sex, armsType, AvatarPosition.ARMY, job, AvatarResourceType.PLAYER_ARMY);
                args = this.createResourceLoadInfo(url,
                    AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.ARMY, this._isMounting, isStandMount, job, sex),
                    AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.ARMY, this._isMounting, isStandMount, job, sex),
                    AvatarPosition.ARMY);
                this.addRes2UnloadMap(args)
                ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);

            }
            if (bodyAvatar) {
                url = PathManager.getAvatarResourcePath(bodyAvatar, sex, bodyType, AvatarPosition.BODY, job, AvatarResourceType.PLAYER_ARMY);
                args = this.createResourceLoadInfo(url,
                    AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.BODY, this._isMounting, isStandMount, job, sex),
                    AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.BODY, this._isMounting, isStandMount, job, sex),
                    AvatarPosition.BODY);

                this.addRes2UnloadMap(args)
                ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);

            }
            if (mountAvatar) {
                url = PathManager.getAvatarResourcePath(mountAvatar, sex, 1, AvatarPosition.MOUNT, job, AvatarResourceType.PLAYER_ARMY);
                args = this.createResourceLoadInfo(url,
                    AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.MOUNT, this._isMounting, isStandMount, job, sex),
                    AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.MOUNT, this._isMounting, isStandMount, job, sex),
                    AvatarPosition.MOUNT);
                this.addRes2UnloadMap(args)
                ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);
            }

            if (this._avatar) {
                //隐藏处理  身体武器总是会存在不做处理
                (<HeroAvatar>this._avatar).showAvatar(cloakAvatar ? true : false, AvatarPosition.CLOAK);
                (<HeroAvatar>this._avatar).showAvatar(hairDownAvatar ? true : false, AvatarPosition.HAIR_DOWN);
                (<HeroAvatar>this._avatar).showAvatar(hairUpAvatar ? true : false, AvatarPosition.HAIR_UP);
                (<HeroAvatar>this._avatar).showAvatar(mountAvatar ? true : false, AvatarPosition.MOUNT);
                (<HeroAvatar>this._avatar).showAvatar(wingAvatar ? true : false, AvatarPosition.WING);
            }
        }

        // Logger.xjy("[SpaceArmyView]changeShapeId=", changeShapeId, ", showFashionAvatar=", showFashionAvatar, ", mountTemplate=", mountTemplate)
        // Logger.xjy("[SpaceArmyView]showAvatar wingAvatar=" + wingAvatar + ", cloakAvatar=" + cloakAvatar + ", hairDownAvatar=" + hairDownAvatar + ", hairUpAvatar=" + hairUpAvatar + ", armyAvatar=" + armyAvatar + ", bodyAvatar=" + bodyAvatar + ", mountAvatar=" + mountAvatar)

        this.avatarView.mouseEnabled = false;
        this.avatarView.footPrintLayer = null;
        this.showMountShadow = this._isMounting;
        this.resetAlpha();
    }

    private showPet(petInfo: ArmyPetInfo) {
        let mapView = SpaceManager.Instance.mapView
        if (!mapView || !mapView.walkLayer) return

        if (this._petAvatarView) {
            this._petAvatarView.dispose();
            this._petAvatarView = null;
        }

        // 在房间场景操作宠物, 回到天空之城不会更新宠物信息（此时服务器不会重新推信息）
        let proxy: ArmyPetInfo | ThaneInfo = petInfo
        if (this.isSelf) {
            proxy = ArmyManager.Instance.thane
        }

        if (!proxy.petTemplate) {
            return
        }
        let petAvatar = proxy.petTemplate.PetAvatar;
        if (petAvatar) {
            if (!this._petAvatarView) {
                this._petAvatarView = new PetAvatarView();
            }
        } else {
            this._petAvatarView = null;
        }

        this._petAvatarView = new PetAvatarView();

        if (this._petAvatarView) {
            this._petAvatarView.followTarget = this;
            this._petAvatarView.isSelfPet = this.isSelf;
            this._petAvatarView.petTemplate = proxy.petTemplate;
            this._petAvatarView.changeFollowType(proxy.petTemplate);
            if (this._petAvatarView.followType == 1) {
                if (this._petAvatarView.parent != mapView.walkLayer) {
                    mapView.walkLayer.addChild(this._petAvatarView);
                    this.initPetPos();
                }
            }
            else {
                this.addChild(this._petAvatarView);
            }

            let petName: string;
            let petTemQuaity: number = 1;
            petName = proxy.petName ? proxy.petName : "";
            if (proxy.petQuaity > 0) {
                petTemQuaity = proxy.petTemQuality;
            }

            this._petAvatarView.showAvatar(petName, petTemQuaity, petAvatar, petInfo.petTemplateId, this.uuid);
        }
    }

    private initPetPos() {
        let s: number = -1;
        if (this.avatarView) {
            s = -(<HeroAvatar>this.avatarView).mirror;
        }
        this._petAvatarView.x = this.data.curPosX * Tiles.WIDTH + s * 100;
        this._petAvatarView.y = this.data.curPosY * Tiles.HEIGHT;
    }

    public set avatarView(value: Avatar) {
        // if (this._avatar) {
        //     NotificationManager.Instance.removeEventListener(HeroAvatar.SIZETYPE_CHANGE, this.__onSizeTypeChangeHandler, this);
        // }
        if (this._avatar) {
            ObjectUtils.disposeObject(this._avatar);
        }
        this._avatar = value;
        (<HeroAvatar>this._avatar).isShowWeapons = true;
        this._avatar.angle = 2;
        if (this.data.isRobot) {
            this._avatar.angle = Number(Math.random() * 360);
        }
        if (this._isPlaying) {
            this.addChild(this._avatar);
        }
        if (this._petAvatarView && this._petAvatarView.parent == this) {
            this.addChild(this._petAvatarView);
        }
    }

    private __onSizeTypeChangeHandler(e: Event) {
        this.layoutTxtViewWithNamePosY();
    }

    protected loaderCompleteHandler(res: any, info: ResourceLoaderInfo) {
        if (this.destroyed) return;
        super.loaderCompleteHandler(res, info);
    }

    protected __heroPropertyHandler(evt: PlayerEvent) {
        if (!this._data || !this._data.baseHero || !SpaceManager.Instance.model) {
            return;
        }
        let spacePlayer: SpaceArmy = SpaceManager.Instance.model.getBaseArmyByUserId(this._data.baseHero.userId);
        if (!spacePlayer) {
            return;
        }

        spacePlayer.baseHero.hideFashion = this.thane.hideFashion;
        spacePlayer.baseHero.changeShapeId = this.thane.changeShapeId;
        spacePlayer.baseHero.bodyEquipAvata = this.thane.bodyEquipAvata;
        spacePlayer.baseHero.armsEquipAvata = this.thane.armsEquipAvata;
        spacePlayer.baseHero.wingAvata = this.thane.wingAvata;
        spacePlayer.baseHero.bodyFashionAvata = this.thane.bodyFashionAvata;
        spacePlayer.baseHero.armsFashionAvata = this.thane.armsFashionAvata;
        spacePlayer.baseHero.hairFashionAvata = this.thane.hairFashionAvata;
        spacePlayer.mountTemplateId = ArmyManager.Instance.army.mountTemplateId;

        this.avatarView.angle += 1;
        this.showAvatar(this._data);
    }

    private __avatarChangeHandler(evt: PlayerEvent) {
        this.showAvatar(this._data);
    }

    public __updateSpaceArmyStateHandler(evt: ArmyEvent) {
        if (!ArmyState.checkCampaignAttack(this.state)) {
            this.info.pathInfo = [];
            this.setFireView();
            return;
        }
        this.clearFireView();
    }

    protected setFireView() {
        //只有队友才显示
        if (!FreedomTeamManager.Instance.inMyTeam(this._data.userId)) return;

        if (!this._attackView) this._attackView = new SimpleAvatarView(110, 110, PathManager.fightStatePath, 10);
        this._attackView.drawFrame = 2;
        this.addChild(this._attackView);
        this._attackView.x = - 55;
        this._attackView.y = this._showNamePosY - 90;
    }

    protected clearFireView() {
        if (this._attackView) {
            ObjectUtils.disposeObject(this._attackView); this._attackView = null;
        }
    }

    public mouseOverHandler(evt: Laya.Event): boolean {
        return false
    }

    public mouseOutHandler(evt: Laya.Event): boolean {
        return false
    }

    public mouseClickHandler(evt: Laya.Event): boolean {
        if (this._data.baseHero.userId == this.selfUserId) {
            return false;
        }
        if (this._avatar) {
            if ((<HeroAvatar>this._avatar).getCurrentPixels() > 0) {
                //判断是否玩家重叠
                (this.parent as SpaceWalkLayer).checkClickPlayerNum(evt.stageX, evt.stageY);
                return true;
            }
            else {
                //找下面一层;
                let arr: any[] = ObjectUtils.getObjectsUnderPoint(StageReferance.stage, StageReferance.stage.mouseX, StageReferance.stage.mouseY);
                //减两层 [object SpaceArmyView]>>
                //[object HeroAvatar]>>
                if (arr[0]) {
                    for (let i: number = arr.length - 2; i >= 0; i--) {
                        if (arr[i].parent instanceof HeroAvatar && arr[i].parent.parent instanceof SpaceArmyView) {
                            let armyView: SpaceArmyView = arr[i].parent.parent;
                            if (armyView.getCurrentPixels() > 50) {
                                if (armyView.data.baseHero.userId == this.selfUserId) {
                                    continue;
                                }
                                if (!armyView.mouseEnabled) {
                                    continue;
                                }
                                PlayerManager.Instance.currentPlayerModel.selectTarget = armyView.data;
                                PlayerManager.Instance.currentPlayerModel.reinforce = armyView.data;
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    public mouseMoveHandler(evt: Laya.Event): boolean {
        if (this._data.baseHero.userId == this.selfUserId) {
            // this.buttonMode = false;
            // this.mouseChildren = this.mouseEnabled = false;
            return false;
        }
        // if(_avatar)
        // {
        // 	if(!evt)
        // 	{
        // 		SpaceManager.Instance.model.glowTarget = this;
        // 		return true;
        // 	}
        // 	else if((<HeroAvatar> _avatar).getCurrentPixels() > 50)
        // 	{
        // 		SpaceManager.Instance.model.glowTarget = this;
        // 		return true;
        // 	}
        // 	else
        // 	{
        // 		//找下面一层;
        // 		let arr:any[] = StageReferance.stage.getObjectsUnderPoint(new Point(StageReferance.stage.mouseX,StageReferance.stage.mouseY));
        // 		//减两层 [object SpaceArmyView]>>
        // 		//[object HeroAvatar]>>
        // 		if(arr[0]){
        // 			for(let i:number=arr.length-2;i>=0;i--)
        // 			{
        // 				if(arr[i].parent is HeroAvatar && arr[i].parent.parent is SpaceArmyView)
        // 				{
        // 					let armyView:SpaceArmyView=arr[i].parent.parent;
        // 					if(armyView.getCurrentPixels()>50)
        // 					{
        // 						if(armyView.data.baseHero.userId == this.selfUserId)
        // 						{
        // 							continue;
        // 						}
        // 						if(!armyView.mouseEnabled)
        // 						{
        // 							continue;	
        // 						}
        // 						SpaceManager.Instance.model.glowTarget = armyView;
        // 						return true;
        // 					}
        // 				}
        // 			}
        // 		}
        // 	}
        // }
        return false;
    }

    public setGlowFilter() {
        if (this._avatar && this._filter) {
            this._filter.setGlowFilter(this._avatar.contentBitmap);
        }
    }

    public setNormalFilter() {
        if (this._avatar && this._filter) {
            this._filter.setNormalFilter(this._avatar.contentBitmap);
        }
    }

    private __chatHandler(chatData: ChatData) {
        let isOpen: boolean = ChatManager.Instance.getSwitchState(SpaceManager.Instance.model.mapTempInfo.MessageBoxType)
        if (!isOpen || chatData.uid == 0) {
            return;
        }
        if (chatData.htmlText.indexOf('<a') > -1 && chatData.htmlText.indexOf('/>') > -1) {
            return;
        }
        if (chatData.serverId) {
            return;
        }

        this.showChatPopView(chatData)
    }

    private __petLevelUpHandler(e: PetEvent) {
        if (this._petAvatarView) {
            this._petAvatarView.playPetLevelUpMovie();
        }
    }

    public get data(): SpaceArmy {
        return this._data;
    }

    public get aiInfo(): BaseArmyAiInfo {
        return <BaseArmyAiInfo>this._info;
    }

    public get isFlying(): boolean {
        return this._isFlying;
    }

    private get selfUserId(): number {
        return PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    }

    private get state(): number {
        if (this.isSelf) {
            return ArmyManager.Instance.army.state;
        }
        else {
            return this._data.state;
        }
    }

    public get isSelf(): boolean {
        if (this._data) {
            return this._data.userId == this.playerInfo.userId;
        }
        return false;
    }

    public get isSelfConsortia(): boolean {
        if (this._data && this._data.baseHero) {
            if (StringHelper.isNullOrEmpty(this._data.baseHero.consortiaName)) {
                return false;
            }
            if (StringHelper.isNullOrEmpty(this.playerInfo.consortiaName)) {
                return false;
            }
            return this._data.baseHero.consortiaName == this.playerInfo.consortiaName;
        }
        return false;
    }

    public get avatarView(): Avatar {
        return this._avatar;
    }

    public getCurrentPixels(): number {
        if (this._avatar) {
            return (<HeroAvatar>this._avatar).getCurrentPixels();
        }
        return 0;
    }

    private get appellId(): number {
        if (!this.isSelf && this._data) {
            return this._data.baseHero.appellId;
        }
        return this.thane.appellId;
    }

    private get honerName(): string {
        return this._data.baseHero.appellInfo && this._data.baseHero.appellInfo.TitleLang;
    }

    private get isHoner(): boolean {
        return this._data.baseHero.appellId != 0;
    }

    private get consortiaName(): string {
        let name = ""
        if (this.isSelf) {
            name = this.thane.consortiaName;
        }

        if (!name && this._data && this._data.baseHero) {
            name = this._data.baseHero.consortiaName;
        }
        return name;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    protected get isVip(): boolean {
        return this._data.baseHero.IsVipAndNoExpirt;
    }

    public dispose() {
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        // NotificationManager.Instance.removeEventListener(HeroAvatar.SIZETYPE_CHANGE, this.__onSizeTypeChangeHandler, this);
        this.removeEvent();
        if (this._controller) {
            this._controller.removeArmyView(this);
            this._controller = null;
        }
        if (this.isSelf) {
            this._data.curPosX = Math.ceil(this.x / Tiles.WIDTH);
            this._data.curPosY = Math.ceil(this.y / Tiles.HEIGHT);
        }
        // if (isDie) return;
        this._data = null;
        this.clearFireView();

        // if (this._hangupView) this._hangupView.dispose(); this._hangupView = null;
        // if (this._buffEffect) this._buffEffect.dispose(); this._buffEffect = null;
        if (this._attackView) this._attackView.dispose(); this._attackView = null;
        super.dispose();
    }
}