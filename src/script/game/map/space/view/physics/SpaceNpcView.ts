// @ts-nocheck
import Logger from "../../../../../core/logger/Logger";
import { AvatarPosition } from "../../../../avatar/data/AvatarPosition";
import { AvatarStaticData } from "../../../../avatar/data/AvatarStaticData";
import { AvatarResourceType } from "../../../../constant/AvatarDefine";
import LoaderPriority from "../../../../constant/LoaderPriority";
import MediatorMananger from "../../../../manager/MediatorMananger";
import { PathManager } from "../../../../manager/PathManager";
import { NPCPatrolMediator } from "../../../../mvc/mediator/NPCPatrolMediator";
import AIBaseInfo from "../../../ai/AIBaseInfo";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { HeroAvatarView } from "../../../view/hero/HeroAvatarView";
import SpaceNodeType from "../../constant/SpaceNodeType";
import { MapPhysics } from "../../data/MapPhysics";
import { SpaceNode } from "../../data/SpaceNode";
import IBaseMouseEvent from "../../interfaces/IBaseMouseEvent";
import SpaceManager from "../../SpaceManager";
import { ResRefCountManager } from "../../../../managerRes/ResRefCountManager";
import { eAvatarBaseViewType } from "../../../view/hero/AvatarBaseView";
import Utils from "../../../../../core/utils/Utils";
import { AvatarInfoUILayerHandler } from "../../../view/layer/AvatarInfoUILayer";
import { AvatarInfoTag } from "../../../../constant/Const";
import { AiStateType } from "../../constant/AiStateType";

/**
 * 天空之城NPC显示对象
 *
 */
export class SpaceNpcView extends HeroAvatarView implements IBaseMouseEvent {
    public static NAME: string = "map.space.view.physics.SpaceNpcView";
    private _mediatorKey: string;
    private _nodeInfo: MapPhysics;
    public avatarBaseViewType: eAvatarBaseViewType = eAvatarBaseViewType.SpaceNpc;
    // private _chatPopView:ChatPopView;
    private _pathCache: any[];
    discriminator: string = "I-AM-A";
    IBaseMouseEvent: string = "IBaseMouseEvent";

    constructor($body: string, $weapons: string, $sex: number, $job: number) {
        super();

        this.autoSize = true;
        this.mouseEnabled = true;
        this.hitTestPrior = true;
        // // 测试
        // let img: Laya.Sprite = new Laya.Sprite();
        // img.loadImage("res/game/common/blank.png");
        // img.pos(0, 0)
        // this.addChild(img)
    }

    protected setName(name: string = "", nameColor: number, grade?: number) {
        super.setName(name, nameColor, grade);
        this.layoutTxtViewWithNamePosY();
    }

    protected createNickName() {
        AvatarInfoUILayerHandler.handle_CON_CREATE(this._uuid, AvatarInfoTag.NickName, { fontSize: 18, strokeWidth: 2, strokeColorIdx: 1, shadow: false })
    }

    protected layoutTxtViewWithNamePosY() {
        this._showNamePosY = this.getPosYById(this.nodeInfo.info.id);
        AvatarInfoUILayerHandler.handle_CON_POSY(this._uuid, this.y + this._showNamePosY)
    }

    public getPosYById(nodeId: number): number {
        let posY: number = -130;
        switch (nodeId) {
            case 3:
                posY = -190;
                break;
            default:
                posY = -130;
                break;
        }
        return posY;
    }

    public set info($baseInfo: AIBaseInfo) {
        super.info = $baseInfo;
    }

    public get info(): AIBaseInfo {
        return super.info;
    }

    public get aiInfo(): AIBaseInfo {
        return this._info;
    }

    public set pathCache(value: any[]) {
        this._pathCache = value;
    }

    public get pathCache(): any[] {
        return this._pathCache;
    }

    public set nodeInfo(value: MapPhysics) {
        this._nodeInfo = value;
        this.refreshAvatarView();
        this.initDataImp();
    }

    public get nodeInfo(): MapPhysics {
        return this._nodeInfo
    }

    private refreshAvatarView() {
        let cInfo: SpaceNode = (<SpaceNode>this._nodeInfo);
        if (!cInfo) {
            return;
        }
        this.avatarView = new HeroAvatar(cInfo.sonType.toString(), AvatarResourceType.NPC, 0, true);
        this.objName = cInfo.info.names;
        this.uuid = cInfo.nodeId.toString();
        Logger.xjy("[SpaceNpcView]refreshAvatarView", cInfo.info.names, cInfo.nodeId)
        cInfo.toward = (cInfo.sizeType == 10 ? 0 : cInfo.toward);
        this.updateDirection(cInfo.toward);
        this.setName(cInfo.info.names, 4, cInfo.info.grade);
        if (cInfo.info.types != SpaceNodeType.MOVEMENT) {
            this.avatarView.angle = 90;
        }
        (<HeroAvatar>this.avatarView).stepFrame = 4;

        let url = PathManager.getAvatarResourcePath(cInfo.sonType.toString(), -1, 1, AvatarPosition.BODY, -1, AvatarResourceType.NPC);
        let args = this.createResourceLoadInfo(url, AvatarStaticData.BASE_NPC_STAND, AvatarStaticData.BASE_NPC_WALK, AvatarPosition.BODY);
        this.addRes2UnloadMap(args);
        ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, LoaderPriority.Priority_7, null, null, null, null, args);
    }

    public execute() {
        if (this._info.isLiving) {
            super.execute();
            if (this.nodeInfo.info.types == SpaceNodeType.MOVEMENT) {
                this.nodeInfo.move(~~(this.x / 20), ~~(this.y / 20));
            }
        }
    }

    protected nextWalk(point: Laya.Point) {
        super.nextWalk(point);
    }

    protected walkOver() {
        super.walkOver();
        this.standImp();
        if (this.nodeInfo.info.types == SpaceNodeType.MOVEMENT) {
            this._info.walkIndex = 0;
        }
    }

    private initDataImp() {
        if (this._nodeInfo && this._info) {
            this.addEvent();
            this.initMediator();
        }
    }

    private initMediator() {
        let arr: any[] = [
            NPCPatrolMediator
        ];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, SpaceNpcView.NAME);
    }

    public set visible(value: boolean) {
        if (this.visible != value) {
            super.visible = value;
            this.displayVisible = value;
            this.active = value;
        }
    }

    public get visible(): boolean {
        return super.visible
    }

    private set displayVisible(value: boolean) {
        AvatarInfoUILayerHandler.handle_CON_VISIBLE(this._uuid, AvatarInfoTag.Info, value)
        // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_VISIBLE, AvatarInfoTag.Info, this._uuid, value)
        if (value) {
            if (this._avatar) {
                this.addChild(this._avatar);
            }
        }
        else {
            if (this._avatar) {
                this._avatar.removeSelf();
            }
        }
    }

    public setBeingVisit(b: boolean) {
        if (b) {
            this.aiInfo.moveState = AiStateType.NPC_BEING_VISIT;
        } else {
            this.aiInfo.moveState = AiStateType.NPC_RANDOM_MOVE_STATE;
        }
    }

    public mouseClickHandler(evt: Laya.Event): boolean {
        if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() > 0) {
            return this.attackFun();
        }
        return false;
    }

    public attackFun(): boolean {
        Logger.xjy("[SpaceNpcView] attackFun")
        if (!SpaceManager.Instance.model.mapTielsData) {
            return false;
        }
        SpaceManager.Instance.visitSpaceNPC((<SpaceNode>this.nodeInfo).nodeId, true);
        return true;
    }

    public mouseOverHandler(evt: Laya.Event): boolean {
        return false;
    }

    public mouseOutHandler(evt: Laya.Event): boolean {
        return false;
    }

    public mouseMoveHandler(evt: Laya.Event): boolean {
        if (Utils.isApp()) {
            return;
        }

        if (!evt) {
            SpaceManager.Instance.model.glowTarget = this;
        }
        else if ((<HeroAvatar>this._avatar).getCurrentPixels() > 50) {
            SpaceManager.Instance.model.glowTarget = this;
            return true;
        }
        return false;
    }

    public setGlowFilter() {
        if (this._avatar) {
            this._filter.setGlowFilter(this._avatar.contentBitmap);
        }
    }

    public setNormalFilter() {
        if (this._avatar) {
            this._filter.setNormalFilter(this._avatar.contentBitmap);
        }
    }

    public dispose() {
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        this.removeEvent();
        // ObjectUtils.disposeObject(this._chatPopView);
        // this._chatPopView = null;
        this._nodeInfo = null;
        this._pathCache = null;
        super.dispose();
    }

}