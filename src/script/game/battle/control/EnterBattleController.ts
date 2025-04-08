// @ts-nocheck
import { Func } from "../../../core/comps/Func";
import LayerMgr from "../../../core/layer/LayerMgr";
import Logger from "../../../core/logger/Logger";
import { EmLayer } from "../../../core/ui/ViewInterface";
import Utils from "../../../core/utils/Utils";
import { MovieClip } from "../../component/MovieClip";
import { BattleEvent, BattleNotic, LoadingSceneEvent, NotificationEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import LoadingSceneWnd from "../../module/loading/LoadingSceneWnd";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { TransSceneEffectContext } from "../effect/TransSceneEffectContext";
import { RipplePreCreater } from "../skillsys/ripple/RipplePreCreater";
import { BattleLoadingView } from "../view/ui/BattleLoadingView";

/**
 * 进入战斗的唯一入口
 * @author yuanzhan.yu
 */
export class EnterBattleController {
    private static instance: EnterBattleController

    constructor() {
    }

    public static getInstance(): EnterBattleController {
        if (EnterBattleController.instance == null) {
            EnterBattleController.instance = new EnterBattleController();
        }
        return EnterBattleController.instance;
    }

    private _battleLoadingView: BattleLoadingView;
    private _canceled: boolean;
    private switchSceneFlag: boolean

    /**
     *进入战斗
     */
    public handler() {
        this._canceled = false;
        NotificationManager.Instance.addEventListener(BattleEvent.BATTLE_CANCEL, this.onBattleCancel, this);
        if (LoadingSceneWnd.Instance.isShowing) {
            this.switchSceneFlag = LoadingSceneWnd.Instance.switchSceneFlag
            LoadingSceneWnd.Instance.on(LoadingSceneEvent.CLOSE, this, this.onLoadingClose);
        }
        else {
            this.startHandler();
        }

    }

    private onLoadingClose(event: Event) {
        LoadingSceneWnd.Instance.off(LoadingSceneEvent.CLOSE, this, this.onLoadingClose);
        if (this._canceled) {
            Logger.warn("[EnterBattleController]onLoadingClose 战斗被取消")
            return;
        }
        if (this.switchSceneFlag) {
            NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.switchSceneHandler, this);
        }
        else {
            this.startHandler();
        }
    }

    private switchSceneHandler(evt: NotificationEvent) {
        NotificationManager.Instance.removeEventListener(NotificationEvent.SWITCH_SCENE, this.switchSceneHandler, this);
        this.startHandler();
    }

    private startHandler() {
        if (this._canceled) {
            Logger.warn("[EnterBattleController]startHandler 战斗被取消")
            return;
        }

        Logger.warn("------------显示战斗加载条------------")

        this.addLoadingBlock();
        this.showLoadingView();
    }

    private onBattleCancel(event: BattleEvent) {
        BattleManager.Instance.started = false;
        this._canceled = true;
        if (this._enterBattleEffect) {
            this._enterBattleEffect.stop();
            this._enterBattleEffect.addFrameScript(7, null);
            if (this._enterBattleEffect.parent) {
                this._enterBattleEffect.parent.removeChild(this._enterBattleEffect);
                this._enterBattleEffect = null;
            }
        }
        this.removeBlock();
        this.removeLoadingView();
        NotificationManager.Instance.removeEventListener(BattleEvent.BATTLE_CANCEL, this.onBattleCancel, this);
    }


    private _battleLoadingBlock: Laya.Sprite

    /**
     * 添加战斗loadingc蒙板
     *
     */
    private addLoadingBlock() {
        if (this._battleLoadingBlock) {
            return;
        }
        //			_battleLoadingBlock = new Sprite();
        //			_battleLoadingBlock.graphics.beginFill(0x0,0);
        //			_battleLoadingBlock.graphics.drawRect(0,0,1440,900);
        //			_battleLoadingBlock.graphics.endFill();
        //			
        //			LayerManager.Instance.getLayerByType(LayerManager.GAME_TOP_LAYER).addChild(_battleLoadingBlock);
    }

    /**
     * 进入战斗的切换特效 todo
     */
    private _enterBattleEffect: MovieClip;

    private showSwitchEffect(middleFun: Function) {
        //一个迷雾笼罩的效果
        // if(this._enterBattleEffect)
        // {
        // 	this._enterBattleEffect.addFrameScript(7, null);
        // 	ObjectUtils.disposeObject(this._enterBattleEffect);
        // }
        // this._enterBattleEffect = ComponentFactory.Instance.creat("asset.core.EnterBattleSwitchMC");
        // LayerManager.Instance.addToLayer(this._enterBattleEffect,LayerManager.GAME_TOP_LAYER,false,false,LayerManager.ALPHA_BLOCKGOUND);
        // this._enterBattleEffect.x = StageReferance.stage.stageWidth*0.5;
        // this._enterBattleEffect.y = StageReferance.stage.stageHeight*0.5;
        // this._enterBattleEffect.addFrameScript(7, middleFun);
        // this._enterBattleEffect.gotoAndPlay(1);

        middleFun();
    }

    /**
     * 显示战斗加载loading
     *
     */
    private async showLoadingView() {
        this._battleLoadingView = new BattleLoadingView();
        this._battleLoadingView.startShowLoad(this.preCreateRipple.bind(this));
        this._battleLoadingView.show();
    }

    /**
     *  射箭的涟漪效果
     *
     */
    private preCreateRipple() {
        if (this._canceled) {
            Logger.warn("[EnterBattleController]preCreateRipple 战斗被取消")
            return;
        }
        let skillIds: any[] = BattleManager.Instance.battleModel.skillIds;
        let ripples: any[] = RipplePreCreater.create(skillIds, null);
        if (ripples.length > 0) {
            Logger.warn("------------战斗资源加载完成 加载涟漪效果------------")
            Laya.timer.once(ripples.length * 100, this, this.loadingCallback)
        }
        else {
            Logger.warn("------------战斗资源加载完成------------")
            this.loadingCallback();
        }
        BattleManager.Instance.battleModel.skillIds = null;
    }

    private loadingCallback() {
        if (this._canceled) {
            Logger.warn("[EnterBattleController]loadingCallback 战斗被取消")
            return;
        }
        if (this._battleLoadingView) {
            this.showSwitchEffect(this.switchToBattle.bind(this));
        } else {
            this.switchToBattle();
        }
        this.removeLoadingView();
    }

    private removeLoadingView() {
        if (this._battleLoadingView) {
            this._battleLoadingView.hide();
            this._battleLoadingView.dispose();
        }
    }

    private removeBlock() {
        if (this._battleLoadingBlock) {
            if (this._battleLoadingBlock.parent) {
                this._battleLoadingBlock.parent.removeChild(this._battleLoadingBlock);
            }
            this._battleLoadingBlock = null;
        }

    }

    /**
     * 切换到战斗场景
     *
     */
    private switchToBattle() {
        NotificationManager.Instance.removeEventListener(BattleEvent.BATTLE_CANCEL, this.onBattleCancel, this);
        // QteSkillGuide.cleanAlert();
        this.removeBlock();
        if (BattleManager.Instance.started) {
            Logger.warn("------------开始切换至战斗场景 exitFlag=" + Boolean(BattleManager.exitFlag) + ", loginToBattleFlag=" + Boolean(BattleManager.loginToBattleFlag))

            if (!BattleManager.exitFlag || !BattleManager.loginToBattleFlag) {
                let changeSceneObj: any = {};
                changeSceneObj.isShowLoading = false;
                NotificationManager.Instance.addEventListener(BattleEvent.ENTER_BATTLE_SCENE, this.onBattleUILoaded, this);
                SceneManager.Instance.setScene(SceneType.BATTLE_SCENE, changeSceneObj);
                BattleManager.exitFlag = false;

                if (this._enterBattleEffect) {
                    this._enterBattleEffect.gotoAndStop(9)
                }
            }
            else {
                BattleManager.loginToBattleFlag = false;
            }
        } else {
            Logger.warn("[EnterBattleController]switchToBattle started==false ");
        }
    }

    /**
     * 战斗UI加载完成以后显示切换动画
     * @param event
     *
     */
    private onBattleUILoaded() {
        NotificationManager.Instance.removeEventListener(BattleEvent.ENTER_BATTLE_SCENE, this.onBattleUILoaded, this)
        BattleModel.battleUILoaded = true;

        //【进入战斗的过场动画取消】 https://www.tapd.cn/36229514/prong/stories/view/1136229514001050270
        // let container: Laya.Sprite = <Laya.Sprite><any>LayerMgr.Instance.getLayerByType(EmLayer.GAME_TOP_LAYER);
        // let effect: TransSceneEffectContext = new TransSceneEffectContext(container);
        // effect.start();

        Utils.delay(20).then(() => {
            this.delayShowEffect();
        })
    }

    /**
     * 显示切换动画, 并且告诉服务器战斗Ui加载完成, 可以进行战斗技能计算了
     *
     */
    private delayShowEffect() {
        let model: BattleModel = BattleManager.Instance.battleModel;
        if (this._enterBattleEffect) {
            this._enterBattleEffect.stop();
            this._enterBattleEffect.addFrameScript(7, null);
            if (this._enterBattleEffect.parent) {
                this._enterBattleEffect.parent.removeChild(this._enterBattleEffect);
                this._enterBattleEffect = null;
            }
        }
        if (this._canceled) {
            Logger.warn("[EnterBattleController]delayShowEffect 战斗被取消")
            return;
        }
        if (!model) {
            Logger.warn("[EnterBattleController]delayShowEffect !battleModel")
            return;
        }

        this.effectComplete()
        BattleManager.Instance.muiscControl.start();
    }

    private effectComplete() {
        let model: BattleModel = BattleManager.Instance.battleModel;
        if (!model) {
            Logger.warn("[EnterBattleController]effectComplete !battleModel")
            return;
        }
        // if(!StageFocusManager.getInstance().isActivate)
        // {
        //     StageReferance.stage.event(Event.DEACTIVATE);
        // }

        Logger.base("🔥通知服务器可以进行战斗技能计算")

        BattleManager.Instance.plotHandler.activate();
        if (model.useWay == 0) {
            SocketSendManager.Instance.sendLoadOver(model.battleId, PlayerManager.Instance.currentPlayerModel.playerInfo.userId);
        }
        else {//增援战斗
            SocketSendManager.Instance.sendReinfoLoadOver(model.battleId, PlayerManager.Instance.currentPlayerModel.playerInfo.userId);
        }
        NotificationManager.Instance.sendNotification(BattleNotic.SKILL_ENABLE, true);
    }
}