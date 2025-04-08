// @ts-nocheck
import { AvatarActionType } from "../../../avatar/data/AvatarActionType";
import { AvatarPosition } from "../../../avatar/data/AvatarPosition";
import { AvatarStaticData } from "../../../avatar/data/AvatarStaticData";
import { Avatar } from "../../../avatar/view/Avatar";
import { eFilterFrameText } from "../../../component/FilterFrameText";
import { AvatarResourceType } from "../../../constant/AvatarDefine";
import { OuterCityEvent, PhysicsEvent } from "../../../constant/event/NotificationEvent";
import LoaderPriority from "../../../constant/LoaderPriority";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PathManager } from "../../../manager/PathManager";
import { MultipleDictionaryInfo } from "../../../utils/MultipleDictionaryInfo";
import { HeroAvatar } from "../../avatar/view/HeroAvatar";
import { WildLand } from "../../data/WildLand";
import { NodeState } from "../../space/constant/NodeState";
import { MapPhysics } from "../../space/data/MapPhysics";
import IBaseMouseEvent from "../../space/interfaces/IBaseMouseEvent";
import IManualTipTargetSize from "../../space/interfaces/IManualTipTargetSize";
import { HeroAvatarView } from "../../view/hero/HeroAvatarView";
import LangManager from "../../../../core/lang/LangManager";
import { ResRefCountManager } from "../../../managerRes/ResRefCountManager";
import { EmWindow } from "../../../constant/UIDefine";
import { eAvatarBaseViewType } from "../../view/hero/AvatarBaseView";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import Logger from "../../../../core/logger/Logger";
import { FilterFrameShadowText } from "../../../component/FilterFrameShadowText";
import { PosType } from "../../space/constant/PosType";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { CursorManagerII } from "../../../manager/CursorManagerII";
import { PlayerManager } from "../../../manager/PlayerManager";
import { WorldWalkLayer } from "../WorldWalkLayer";
import { OuterCityNpcLayer } from "../OuterCityNpcLayer";

/**
 * @description    外城npc 外城野怪
 * @author yuanzhan.yu
 * @date 2021/11/17 17:15
 * @ver 1.0
 */
export class OuterCityNpcView extends HeroAvatarView implements IBaseMouseEvent, IManualTipTargetSize {
    private _nodeInfo: MapPhysics;
    public static toAttackBtnName = "toAttackBtn";
    protected _attacking: fgui.GMovieClip;
    /**
     *攻击图标: 野外要增援战, 点击怪物攻击。因第一个打怪的玩家会遮住怪, 所以在怪物脚下放个攻击图标
     *改成直接弹出选择目标的弹窗
     */
    // protected _toAttackBtn: fgui.GButton;
    private _nameText: FilterFrameShadowText;
    /**
     *BOSS特殊光环
     */
    private light: fgui.GMovieClip;
    public avatarBaseViewType: eAvatarBaseViewType = eAvatarBaseViewType.OuterCityNpc;

    constructor() {
        super();

        this.autoSize = true;
        this.mouseEnabled = true;
        this.hitTestPrior = true;
        // tipStyle = "tips.MapPhysicsTip";
        // tipDirctions = "4,6,5,7";
        // isFollowMouse = false;
        // startPoint = new Point(-30,-40);
    }

    public set avatarView(value: Avatar) {
        super.avatarView = value;
        // super.avatarView.scaleX = this._nodeInfo.info.size / 10;
        // super.avatarView.scaleY = this._nodeInfo.info.size / 10;
    }

    public get avatarView(): Avatar {
        return super.avatarView
    }

    public attackFun() {
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, this._nodeInfo);
    }

    public mouseClickHandler(evt: Laya.Event): boolean {
        if (!this._avatar) return false;
        if((this.parent as OuterCityNpcLayer).checkClickPlayerNum(evt.stageX, evt.stageY))return true;
        let i: number = this.getCurrentPixels();
        if (i < 50) {
            return false;
        }
        this.attackFun();

        return true;


        // let i: number = this.getCurrentPixels();
        // if (i < 50) {
        //     return false;
        // }
        // this.attackFun();
        // return true;
    }

    public mouseMoveHandler(evt: Laya.Event): boolean {
        let i: number = this.getCurrentPixels();
        if (i < 50) {
            this.mouseOutHandler(evt);
            return false;
        }
        else {
            return this.mouseOverHandler(evt);
        }
    }

    public mouseOverHandler(evt: Laya.Event): boolean {
        let i: number = this.getCurrentPixels();
        if (i < 50) {
            return false;
        }
        if (this._avatar) {
            this._filter.setGlowFilter(this._avatar.contentBitmap);
        }
        return true;
    }

    public mouseOutHandler(evt: Laya.Event): boolean {
        if (this._avatar) {
            this._filter.setNormalFilter(this._avatar.contentBitmap);
            return true;
        }
        return false;
    }

    public set nodeInfo(value: MapPhysics) {
        this._nodeInfo = value;
        let body: number = (<WildLand>this._nodeInfo).tempInfo.SonType;
        if (!this.avatarView) {
            this.avatarView = new HeroAvatar(body.toString(), AvatarResourceType.NPC, 0, false);
        }
        this.objName = value.info.names;
        this.uuid = value.info.id.toString();
        this.updateDirection(45);
        this.showNameText();

        this._avatar.state = Avatar.STAND;
        this._nodeInfo.info.addEventListener(PhysicsEvent.UP_STATE, this.__upStateHandler, this);
        this._nodeInfo.info.state = value.info.state;
        if(this._nodeInfo.info.types == PosType.OUTERCITY_BOSS_NPC){//BOSS
            this.light = fgui.UIPackage.createObject(EmWindow.OuterCity, `ComBossLightMc3`).asMovieClip;
            this.light.touchable = false;
            this.addChildAt(this.light.displayObject, 0);
        }
        else if (this._nodeInfo.info.types == PosType.OUTERCITY_COMMON_JINGYING) {
            this.light = fgui.UIPackage.createObject(EmWindow.OuterCity, `ComBossLightMc2`).asMovieClip;
            this.light.touchable = false;
            this.addChildAt(this.light.displayObject, 0);
        }

        let url = PathManager.getAvatarResourcePath(body.toString(), -1, 1, AvatarPosition.BODY, -1, AvatarResourceType.NPC);
        let args = this.createResourceLoadInfo(url,
            AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.BODY),
            AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.BODY),
            AvatarPosition.BODY);
        this.addRes2UnloadMap(args);
        ResRefCountManager.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, LoaderPriority.Priority_7, null, null, null, null, args);
    }

    public refresh() {
        this.__upStateHandler(null);
    }

    private removeNameTxt(): void {
        if (this._nameText) {
            this._nameText.removeSelf();
        }
        this._nameText = null;
    }

    private showNameText(): void {
        this._nameText = this._nameText ? this._nameText : new FilterFrameShadowText(140, 18, undefined, 16);
        this._nameText.text = LangManager.Instance.GetTranslation("public.level.name", this.wildLandInfo.tempInfo.NameLang, this.wildLandInfo.info.grade);
        this._nameText.setFrame(5, eFilterFrameText.AvatarName);
        this._nameText.height = this._nameText.textHeight + 20;
        if (this._isPlaying) {
            this.addChild(this._nameText);
        }
    }

    protected layoutTxtViewWithNamePosY() {
        super.layoutTxtViewWithNamePosY()
        if (this._nameText) {
            this._nameText.y = this._showNamePosY;
        }
        if (this._attacking) {
            this._attacking.y = this._showNamePosY - 30;
        }
 
        // 测试
        // this.setFireView()
    }

    private __upStateHandler(evt: PhysicsEvent): void {
        let state: number = this.wildLandInfo.info.state;
        Logger.xjy("[OuterCityNpcView]__upStateHandler", state, this.wildLandInfo.tempInfo.NameLang, this.wildLandInfo.x / 20, this.wildLandInfo.y / 20)

        if (state == NodeState.EXIST) {
            this.clearFireView();
        }
        else if (state == NodeState.FIGHTING) {
            this.setFireView();
        }
        else if (state == NodeState.NONE) {
            this.dispose();
        }
    }

    private setFireView(): void {
        if (!this._attacking) {
            this._attacking = fgui.UIPackage.createObject(EmWindow.OuterCity, "asset.outercity.AttackingAsset").asMovieClip;
            this._attacking.setPivot(0.5, 0.5, true);
            this._attacking.x = 0;
            this._attacking.y = this._showNamePosY - 30;
            // this._toAttackBtn = fgui.UIPackage.createObject(EmWindow.OuterCity, "AttackBtn").asButton;
            // this._toAttackBtn.x = this.x;
            // this._toAttackBtn.onClick(this, this.onAttackClick);
            // let rect = Avatar.sizeMax[this._avatar.sizeType];
            // if (rect) {
            //     this._toAttackBtn.width = rect.width;
            //     this._toAttackBtn.height = rect.height;
            //     this._toAttackBtn.y = this.y + rect.height - Math.abs(rect.y);
            // } else {
            //     this._toAttackBtn.y = this.y;
            // }
            // this._toAttackBtn.displayObject.name = OuterCityNpcView.toAttackBtnName
            // this._toAttackBtn.getChild("icon").displayObject.name = OuterCityNpcView.toAttackBtnName
        }
        if (this._isPlaying) {
            this.addChild(this._attacking.displayObject);
            this._attacking.playing = true;
            // if (this._toAttackBtn) {
            //     this.mapView.avatarInfoUILayer.addChild(this._toAttackBtn.displayObject);
            // }
        }
    }

    private clearFireView(): void {
        if (this._attacking) {
            this._attacking.playing = false;
            ObjectUtils.disposeObject(this._attacking)
            this._attacking = null;
        }
        // this._toAttackBtn && ObjectUtils.disposeObject(this._toAttackBtn), this._toAttackBtn = null;
    }

    public get wildLandInfo(): WildLand {
        return <WildLand>this._nodeInfo;
    }

    public get nodeInfo(): MapPhysics {
        return this._nodeInfo;
    }

    public get tipData(): Object {
        let info: MultipleDictionaryInfo = new MultipleDictionaryInfo();
        let apTip: string = LangManager.Instance.GetTranslation("public.playerInfo.ap");
        info.addItem((this.wildLandInfo.tempInfo.NameLang + LangManager.Instance.GetTranslation("public.level2", this.wildLandInfo.tempInfo.Grade)), null);
        // info.addItem(apTip, String(this.wildLandInfo.fightCapaity));
        return info;
    }

    public dispose(): void {
        if (this._nodeInfo) {
            this._nodeInfo.nodeView = null;
        }
        this.resetSelectMovie();
        this.clearFireView();
        this.removeNameTxt();
        this._nodeInfo.info.removeEventListener(PhysicsEvent.UP_STATE, this.__upStateHandler, this);
        if (this.light) {
            this.light.displayObject.removeSelf();
            this.light.playing = false;
        }
        this.light = null;
        super.dispose();
    }

    manualHeight(): number {
        return 90;
    }

    manualWidth(): number {
        return 60;
    }

    public set isPlaying(value: boolean) {
        super.isPlaying = value;
        if (!value) {
            if (this._attacking) {
                this._attacking.displayObject.removeSelf();
            }
            if (this._nameText && this._nameText.parent) {
                this._nameText.parent.removeChild(this._nameText);
            }
            // if (this._toAttackBtn) {
            //     this._toAttackBtn.displayObject.removeSelf()
            // }
        }
        else {
            if (this._attacking) {
                this.addChild(this._attacking.displayObject);
            }
            if (this._nameText) {
                this.addChild(this._nameText);
            }
            // if (this._toAttackBtn) {
            //     this.mapView.avatarInfoUILayer.addChild(this._toAttackBtn.displayObject);
            // }
        }
    }

    public get sizeInfo() {
        return this._avatar && this._avatar.sizeInfo
    }

    public get mapView() {
        return OuterCityManager.Instance.mapView
    }
}