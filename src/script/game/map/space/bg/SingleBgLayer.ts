/*
 * @Author: jeremy.xu
 * @Date: 2024-02-27 10:48:11
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-08 16:07:27
 * @Description: 副本地图：单张背景地图
 * 
 */
import { Disposeable } from "../../../component/DisplayObject";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import { SecretEvent } from "../../../constant/event/NotificationEvent";
import { PathManager } from "../../../manager/PathManager";
import ResMgr from "../../../../core/res/ResMgr";
import Resolution from "../../../../core/comps/Resolution";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SecretManager } from "../../../manager/SecretManager";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_secreteventData } from "../../../config/t_s_secretevent";
import { ConfigType } from "../../../constant/ConfigDefine";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import SecretModel from "../../../datas/secret/SecretModel";
import { UIFilter } from "../../../../core/ui/UIFilter";

export class SingleBgLayer extends Laya.Sprite implements Disposeable {
    private _currentParent: Laya.Sprite;
    private _mapBg = new Laya.Sprite();;
    private _mapId: number;
    private _mapPath: string;

    constructor(parent: Laya.Sprite, mapId: number) {
        super();
        this._currentParent = parent;
        this._currentParent.addChild(this);
        this._mapId = mapId;

        this.init();
    }

    protected init() {
        this.addEvent();
        this.initView();
    }

    protected addEvent() {
        StageReferance.stage.on(Laya.Event.RESIZE, this, this.resize);
        NotificationManager.Instance.on(SecretEvent.SECRET_INFO, this.__secretInfo, this)
        NotificationManager.Instance.on(SecretEvent.FAILED, this.__secretFailed, this)
        NotificationManager.Instance.on(SecretEvent.REVIVE, this.__secretRevive, this)
    }

    protected removeEvent() {
        StageReferance.stage.off(Laya.Event.RESIZE, this, this.resize);
        NotificationManager.Instance.off(SecretEvent.SECRET_INFO, this.__secretInfo, this)
        NotificationManager.Instance.off(SecretEvent.FAILED, this.__secretFailed, this)
        NotificationManager.Instance.off(SecretEvent.REVIVE, this.__secretRevive, this)
    }

    private __secretInfo() {
        this.refresh()
    }

    private __secretFailed() {
        this.grayMap(true)
    }

    private __secretRevive() {
        this.grayMap(false)
    }

    protected initView() {
        this._mapBg.autoSize = true;
        this.addChild(this._mapBg);
        this.refresh();
    }

    public refresh() {
        this._mapPath = this.mapPath;
        if (this._mapPath) {
            ResMgr.Instance.loadRes(this._mapPath, (res) => {
                this._mapBg.texture = res;
                this.resize();
            })
        }
    }

    private resize() {
        this._mapBg.pivot(this._mapBg.width / 2, this._mapBg.height / 2)
        let widthRatio: number = Resolution.gameWidth / this._mapBg.width;
        let heightratio: number = Resolution.gameHeight / this._mapBg.height;
        let scaleV = Math.max(heightratio, widthRatio);
        this._mapBg.scaleX = this._mapBg.scaleY = scaleV;
        this._mapBg.x = Resolution.gameWidth / 2;
        this._mapBg.y = Resolution.gameHeight / 2;
    }

    private grayMap(b: boolean) {
        this._mapBg.filters = b ? [UIFilter.grayFilter] : []
    }

    private get mapPath() {
        let path = ""

        // 使用战斗里面的背景
        let sceneId = this.sceneId
        if (this.sceneId) {
            path = PathManager.getSingleBgMapPath(sceneId);
        };

        // 不使用战斗里面的背景  策划暂时不考虑设计

        return path
    }

    private get sceneId() {
        let sceneId
        /** 秘境副本 */
        if (WorldBossHelper.checkSecretFb(this._mapId)) {
            let scereType = SecretModel.getScereType(this._mapId)
            let secretInfo = SecretManager.Instance.model.getSecretInfo(scereType)
            // 每个事件有对应的地图
            let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secretevent, secretInfo.eventId) as t_s_secreteventData
            sceneId = temp && temp.SceneId;
        }

        return sceneId
    }


    public dispose() {
        this.removeEvent();
        ResMgr.Instance.cancelLoadByUrl(this._mapPath);
    }
}