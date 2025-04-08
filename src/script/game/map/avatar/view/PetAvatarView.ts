// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-09-01 17:50:57
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-10-10 16:21:10
 * @Description: 天空之城 副本 宠物跟随形象
 */

import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { AvatarActionType } from "../../../avatar/data/AvatarActionType";
import { AvatarPosition } from "../../../avatar/data/AvatarPosition";
import { AvatarStaticData } from "../../../avatar/data/AvatarStaticData";
import { Avatar } from "../../../avatar/view/Avatar";
import { MovieClip } from "../../../component/MovieClip";
import { t_s_pettemplateData } from "../../../config/t_s_pettemplate";
import { AvatarResourceType } from "../../../constant/AvatarDefine";
import LoaderPriority from "../../../constant/LoaderPriority";
import { CampaignManager } from "../../../manager/CampaignManager";
import { PathManager } from "../../../manager/PathManager";
import AIBaseInfo from "../../ai/AIBaseInfo";
import { BaseArmyAiInfo } from "../../ai/BaseArmyAiInfo";
import { SceneManager } from "../../scene/SceneManager";
import SceneType from "../../scene/SceneType";
import Tiles from "../../space/constant/Tiles";
import SpaceManager from "../../space/SpaceManager";
import { SpaceArmyView } from "../../space/view/physics/SpaceArmyView";
import { HeroAvatarView } from "../../view/hero/HeroAvatarView";
import { PetPathdata } from "../data/PetPathdata";
import { HeroAvatar } from "./HeroAvatar";
import FUIHelper from '../../../utils/FUIHelper';
import { EmPackName, EmWindow } from '../../../constant/UIDefine';
import { ResRefCountManager } from "../../../managerRes/ResRefCountManager";
import { AvatarInfoTag } from "../../../constant/Const";
import { AvatarInfoUIEvent, ShadowUIEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { eFilterFrameText } from "../../../component/FilterFrameText";
import { eAvatarBaseViewType } from "../../view/hero/AvatarBaseView";
import { AvatarInfoUILayerHandler } from "../../view/layer/AvatarInfoUILayer";
import { ShadowUILayerHandler } from "../../view/layer/ShadowUILayer";
import { PetData } from "../../../module/pet/data/PetData";


export class PetAvatarView extends HeroAvatarView {
    public static TAIL_RES = "PetTail"
    public static QUALITY_RES = "PetQuaityAsset"
    public static STAR_QUALITY_RES = "PetStarQuality"
    public static PET_LEVELUP_RES = "PetLevelUpMc"
    public static FOLLOW_DISTANCE: number = 150;
    public static petNormalPos = new Laya.Point(-80, -65);
    public static petMountPos = new Laya.Point(-80, -80);
    private static _petPath: Laya.Point[] = [];

    private _lastFollowTime: number = 0;
    private _bodyUrl: string;
    private _petWalkIndex: number = 0;
    private _starCom: fgui.GComponent;
    private _tailMc: fgui.GMovieClip;
    private _petQuaityMc: fgui.GMovieClip;
    public avatarBaseViewType: eAvatarBaseViewType = eAvatarBaseViewType.PetAvatar;

    public isSelfPet: boolean;
    public followType: number = 0;
    public followTarget: HeroAvatarView;
    public petTemplate: t_s_pettemplateData;
    public temQuaity: number;

    constructor() {
        super();
        this.mouseEnabled = false;
        this.info = <AIBaseInfo>new BaseArmyAiInfo();
    }

    protected setName(name: string = "", nameColor?: number, grade?: number) {
        super.setName(name);
        let quality: number = Math.floor((this.temQuaity - 1) / 5 + 1);
        AvatarInfoUILayerHandler.handle_NAME_FRAME(this._uuid, quality, eFilterFrameText.PetQuality)
        this.showStar(this.temQuaity);

        // if (quality == 5) {
        //     if (!this._petQuaityMc) {
        //         this._petQuaityMc = FUIHelper.createFUIInstance(EmPackName.BaseCommon, PetAvatarView.QUALITY_RES) as fgui.GMovieClip;
        //         this.addChild(this._petQuaityMc.displayObject);
        //         this._petQuaityMc.x = -33;
        //         this._petQuaityMc.y = this._npcName.y;
        //     }
        //     this._petQuaityMc.playing = true;
        // }
        // else {
        //     ObjectUtils.disposeObject(this._petQuaityMc);
        //     this._petQuaityMc = null;
        // }
    }

    protected createNickName() {
        AvatarInfoUILayerHandler.handle_CON_CREATE(this._uuid, AvatarInfoTag.NickName, { fontSize: 16, shadow: true, strokeWidth: 0 })
    }

    public showAvatar(name: string, temQuaity: number, body: string, tempId: number, herouuid: string) {
        let priority: number = this.isSelf ? LoaderPriority.Priority_10 : LoaderPriority.Priority_4;

        let uuid = tempId + "_" + herouuid
        let bodyAvatar: string = PathManager.getAvatarResourcePath(body, 2, 1, AvatarPosition.PET, null, null)
        // Logger.xjy("[PetAvatarView]showAvatar bodyAvatar", bodyAvatar, uuid)

        this.temQuaity = temQuaity;

        if (!this._avatar) {
            this._avatar = new HeroAvatar(bodyAvatar, AvatarResourceType.NPC, 2, true);
            this._avatar.angle = 90;
            this.addChild(this._avatar);
        }

        // this.disposePetInfo();
        // this.disposeShadows();

        this.objName = name;
        this.uuid = uuid;

        this.setName(name);
        if (this._bodyUrl != bodyAvatar) {
            this._bodyUrl = bodyAvatar;
            this._avatar.body = bodyAvatar;
            (this._avatar as HeroAvatar).showAvatar(Boolean(bodyAvatar), AvatarPosition.PET);
            let args = this.createResourceLoadInfo(bodyAvatar,
                AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.PET),
                AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.PET),
                AvatarPosition.PET);
            this.addRes2UnloadMap(args)
            ResRefCountManager.loadRes(bodyAvatar, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);
        }
    }

    protected layoutTxtViewWithNamePosY() {
        if (this.destroyed) return;
        AvatarInfoUILayerHandler.handle_CON_POSX(this._uuid, this.nameX)
        AvatarInfoUILayerHandler.handle_CON_POSY(this._uuid, this.nameY)
        // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_POSX, this._uuid, this.nameX)
        // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_POSY, this._uuid, this.nameY)
    }

    private showStar(temQuality: number) {
        if (temQuality > 0) {
            let mod: number = 0;
            if (temQuality > (PetData.MAX_TEM_QUALITY-1)) {
                mod = 0;
            }
            else if (temQuality % 5 == 0) {
                mod = 5;
            }
            else {
                mod = temQuality % 5;
            }
            AvatarInfoUILayerHandler.handle_CON_CREATE(this._uuid, AvatarInfoTag.PetStar)
            AvatarInfoUILayerHandler.handle_PET_STAR_NUM(this._uuid, mod)
            // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_CREATE, this._uuid, AvatarInfoTag.PetStar)
            // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.PET_STAR_NUM, this._uuid, mod)
        }
    }

    public execute() {
        if (this.followType == 0) {
            this.petMove();
            if (this._avatar) {
                this.noShadow = true;
            }
        }
        else {
            let t: number = new Date().getTime();
            if (t - this._lastFollowTime >= 100) {
                this.doFollow();
                this._lastFollowTime = t;
            }
        }

        super.execute();

        if (this._avatar) {
            (<HeroAvatar>this._avatar).stepFrame = this.getStepFrame();
        }

    }

    private getStepFrame(): number {
        if (this._isStand) {
            return 4;
        }
        else {
            return 2;
        }
    }

    public playPetLevelUpMovie() {
        let mc = new MovieClip()
        mc.pos(-12, -45);
        this.addChild(mc);
        mc.gotoAndPlay(0, true, "asset.map.PetLevelUpMc")
    }

    public changeFollowType(temp: t_s_pettemplateData) {
        if (temp && temp.Property1 == 1) {
            if (this.followType == 1) {
                return;
            }
            this.followType = 1;
            if (this._avatar) {
                this.noShadow = false;
                this._avatar.state = Avatar.STAND;
                this._avatar.angle = 90;
            }
            this.removeTail();
        }
        else {
            if (this._avatar) {
                this.noShadow = true;
            }
            this.followType = 0;
        }
    }

    public addTail() {
        if (!this.followTarget) {
            return;
        }
        if (!this.followTarget.avatarView) {
            return;
        }

        if (!this._tailMc) {
            this._tailMc = FUIHelper.createFUIInstance(EmPackName.BaseCommon, PetAvatarView.TAIL_RES) as fgui.GMovieClip;
            this.addChild(this._tailMc.displayObject);
            this._tailMc.y = -78;
        }
        this._tailMc.playing = true

        this._tailMc.scaleX = -(this.followTarget.avatarView as HeroAvatar).mirror;
        // this._tailMc.scaleY = 1;
        // if (this._avatar.frameY > 2) {
        //     this._tailMc.scaleY = -1;
        // }

        if (this._tailMc.scaleX == -1) {
            this._tailMc.x = 16;
        }
        else {
            this._tailMc.x = -16;
        }
    }

    public removeTail() {
        if (this._tailMc) ObjectUtils.disposeObject(this._tailMc)
        this._tailMc = null
    }

    public get mirror(): number {
        if (this._avatar instanceof HeroAvatar) {
            return (<HeroAvatar>this._avatar).mirror
        }
        return 1;
    }

    public setAngle(a: number) {
        if (this._avatar) {
            this._avatar.angle = a;
        }
    }

    public get petPath(): Laya.Point[] {
        if (PetAvatarView._petPath.length > 0) {
            return PetAvatarView._petPath
        }

        for (let frame = 0; frame < PetPathdata.length; frame++) {
            let pos = new Laya.Point(PetPathdata[frame].x + 25, PetPathdata[frame].y);
            PetAvatarView._petPath.push(pos);
        }
        // Logger.xjy("[PetAvatarView]petPath", this.petPath)
        return PetAvatarView._petPath
    }

    private petMove() {
        if (!(this._avatar && this.isPlaying && this.followTarget && this.followTarget.avatarView)) {
            return;
        }

        let dir: number = (this.followTarget.avatarView as HeroAvatar).mirror;

        let tx: number = 0;
        let ty: number = 0;
        if (this.followTarget["isMounting"]) {
            tx = dir * PetAvatarView.petMountPos.x;
            ty = PetAvatarView.petMountPos.y + this.followTarget.avatarView.flight;
            // Logger.xjy("[PetAvatarView]petMove isMounting tx="+tx+", ty=", ty)
        }
        else {
            tx = dir * PetAvatarView.petNormalPos.x;
            ty = PetAvatarView.petNormalPos.y - this.avatarView.flight / 2;
            // Logger.xjy("[PetAvatarView]petMove  tx="+tx+", ty=", ty)
        }
        this._avatar.state = Avatar.WALK;
        if (this.followTarget.isStand) {
            //宠物站立动作
            if (this._petWalkIndex == this.petPath.length) {
                this._petWalkIndex = 0;
            }

            let pos = this.petPath[this._petWalkIndex];
            if (this._petWalkIndex >= 63) {
                this.setAngle(dir == 1 ? 180 : 0);
            }
            else {
                this.setAngle(dir == 1 ? 0 : 180);
            }
            tx += dir * pos.x;
            ty += pos.y;

            this._petWalkIndex++;
            this.removeTail();
        }
        else {
            //宠物跑动动作
            // Logger.xjy("[PetAvatarView]宠物跑动动作 angle=", this.followTarget.avatarView.angle)
            this.setAngle(this.followTarget.avatarView.angle);
            this._petWalkIndex = 0;
            this.addTail();
        }
        this.x = tx;
        this.y = ty;

        // if (this._npcName) {
        //     this._npcName.y = -80 + this.avatarView.flight / 2;
        //     this._starCom.y = this._npcName.y - 10;
        // }

        // 飞行宠物: 玩家位置 + 初始化位置  + 在容器内移动的位置
        this.avatarView.alpha = this.followTarget.avatarView.alpha;
    }

    private doFollow() {
        if (!this.followTarget) {
            return;
        }

        if (!this.stage) {
            this.x = this.followTarget.x;
            this.y = this.followTarget.y;
        }
        else if (this.distance(this, this.followTarget) > PetAvatarView.FOLLOW_DISTANCE) {
            let vec2d = new Laya.Point(this.followTarget.x - this.x, this.followTarget.y - this.y);
            vec2d.x = vec2d.x * 0.4;
            vec2d.y = vec2d.y * 0.4;
            let targetPos = new Laya.Point(this.x + vec2d.x, this.y + vec2d.y);
            targetPos.x = targetPos.x / Tiles.WIDTH;
            targetPos.y = targetPos.y / Tiles.HEIGHT;
            let path: any[] = [this.getTilePos(), targetPos];
            this.info.speed = this.followTarget.info.speed;
            this.info.pathInfo = path;
        }
    }

    private distance(obj1: Laya.Sprite, obj2: Laya.Sprite): number {
        let dx: number = obj2.x - obj1.x;
        let dy: number = obj2.y - obj1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    protected playMovie() {
        super.playMovie();

        if (!this._avatar) {
            return;
        }
        let b: boolean;
        let curPos = this.getTilePos();
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
            this.noShadow = false;
            if ((<SpaceArmyView>this.followTarget).isFlying && !SpaceManager.Instance.model.getWalkable(curPos.x, curPos.y)) {
                this.noShadow = true;
            }
            b = SpaceManager.Instance.model.walkableValueIsPara(4, curPos.x, curPos.y);
        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            b = CampaignManager.Instance.mapModel.walkableValueIsPara(4, curPos.x, curPos.y);
            this.noShadow = false;
        }

        this._avatar.alpha = b ? 0.5 : 1;
    }

    public get x(): number {
        return super.x;
    }

    public set x(value: number) {
        value = Math.round(value)
        if (value == super._px) return
        super.x = value;

        ShadowUILayerHandler.handle_POSX(this._uuid, value)
        // NotificationManager.Instance.dispatchEvent(ShadowUIEvent.SHADOW_POSX, this._uuid, value)
        AvatarInfoUILayerHandler.handle_CON_POSX(this._uuid, this.nameX)
        // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_POSX, this._uuid, this.nameX)
    }

    public get y(): number {
        return super.y;
    }

    public set y(value: number) {
        value = Math.round(value)
        if (value == super._py) return
        super.y = value;

        ShadowUILayerHandler.handle_POSY(this._uuid, value)
        // NotificationManager.Instance.dispatchEvent(ShadowUIEvent.SHADOW_POSY, this._uuid, value)
        AvatarInfoUILayerHandler.handle_CON_POSY(this._uuid, this.nameY)
        // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_POSY, this._uuid, this.nameY)
    }

    public get nameX() {
        let nameX = this.x;
        if (this.followType == 0) { // 飞行宠物
            nameX += this.followTarget.x;
        }
        return nameX
    }

    public get nameY() {
        let nameY = this.y - 80;
        if (this._avatar) {
            nameY += this._avatar.flight / 2;
        }
        if (this.followType == 0) { // 飞行宠物
            nameY += this.followTarget.y;
        }
        return nameY
    }

    public set visible(value: boolean) {
        super.visible = value;
        this.active = value;
        AvatarInfoUILayerHandler.handle_CON_VISIBLE(this._uuid, AvatarInfoTag.PetTailMC, value)
        AvatarInfoUILayerHandler.handle_CON_VISIBLE(this._uuid, AvatarInfoTag.PetStar, value)
    }

    public get visible(): boolean {
        return super.visible
    }

    public dispose() {
        this.disposePetInfo();
        super.dispose();
    }
}