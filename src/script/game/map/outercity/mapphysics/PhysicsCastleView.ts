// @ts-nocheck
import { BaseCastle } from "../../../datas/template/BaseCastle";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PathManager } from "../../../manager/PathManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { MapPhysics } from "../../space/data/MapPhysics";
import { MapPhysicsAttackingBase } from "../../space/view/physics/MapPhysicsAttackingBase";
import { CastleDefenceView } from "./CastleDefenceView";
import { EmWindow } from "../../../constant/UIDefine";
import { OuterCityModel } from "../OuterCityModel";
import { FilterFrameText } from "../../../component/FilterFrameText";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";

/**
 * @description    外城城堡
 * @author yuanzhan.yu
 * @date 2021/11/17 16:05
 * @ver 1.0
 */
export class PhysicsCastleView extends MapPhysicsAttackingBase {
    private _defenceView: CastleDefenceView;
    //【外城】中型矿脉的标记位置点击没有提示按钮, 新手城堡点击也无按钮提示】https://www.tapd.cn/36229514/bugtrace/bugs/view?bug_id=1136229514001046037
    private _desctxt:FilterFrameText;
    constructor() {
        super();
        if (!this._desctxt) {
            this._desctxt = new FilterFrameText(10, 20, undefined, 18, "#ffffff", "center", "middle", 0);
        }
        this.addChild(this._desctxt);
        this.addEvent();
        this._defenceView = fgui.UIPackage.createObject(EmWindow.OuterCity, "CastleDefenceView", CastleDefenceView) as CastleDefenceView;
        this._defenceView.touchable = false;
    }

    protected initView(): void {
        this._defenceView.info = this.castleInfo;
        this.layouCallBack();
    }

    protected layouCallBack(): void {
        if (this.isRemoveStage) {
            return;
        }
        let width = this.sizeInfo["width"];
        if (width > 0) {
            this._defenceView.x = this.moviePos.x - 10;
            this._defenceView.y = this.moviePos.y;
        }
        if (this._isPlaying) {
            this.addChild(this._defenceView.displayObject);
        }
    }

    protected setFireView(): void {
        super.setFireView();
    }

    protected setNomalView(): void {
        super.setNomalView();
    }

    protected addEvent(): void {
        NotificationManager.Instance.addEventListener(OuterCityEvent.CASTLE_INFO, this.__castleInfo, this)
    }

    protected removeEvent(): void {
        NotificationManager.Instance.removeEventListener(OuterCityEvent.CASTLE_INFO, this.__castleInfo, this)
    }

    private __castleInfo() {
        this.initView();
    }

    public dispose(): void {
        this.removeEvent();
        if (this.castleInfo) {
            this.castleInfo.nodeView = null;
        }
        OuterCityManager.Instance.model.addCasetInfoToPool(this.castleInfo);
        if (this._defenceView) {
            this._defenceView.dispose();
        }
        this._defenceView = null;
        super.dispose();
    }

    protected get castleInfo(): BaseCastle {
        return <BaseCastle>this.info;
    }

    public get nodeInfo(): MapPhysics {
        return this.info;
    }

    public get nameDefence(): CastleDefenceView {
        return this._defenceView;
    }

    public get resourcesPath(): string {
        return PathManager.solveMapPhysicsBySonType(this.castleInfo.tempInfo.SonType);
    }

    public get isSelfCastle(): boolean {
        if (this.castleInfo) {
            return (this.castleInfo.templateId == OuterCityModel.SELT_CALSTE_TEMPLATEID);
        }
        return false;
    }

    public set isPlaying(value: boolean) {
        super.isPlaying = value;
        if (value) {
            if (this._defenceView) {
                this.addChild(this._defenceView.displayObject);
                let width = this.sizeInfo["width"];
                if (width > 0) {
                    this._defenceView.x = this.moviePos.x - 10;
                    this._defenceView.y = this.moviePos.y;
                }
            }
        }
        else {
            this._defenceView.displayObject.removeSelf();
        }
    }
}