import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import Logger from "../../core/logger/Logger";
import { BattleEvent } from "../constant/event/NotificationEvent";
import { NotificationManager } from "../manager/NotificationManager";
import BattleWnd from "../module/battle/BattleWnd";
import BattleScene from "../scene/BattleScene";
import { BattleModel } from "./BattleModel";
import { BattleView } from "./BattleView";
import { BatterModel } from "./data/BatterModel";
import { ResistModel } from "./data/ResistModel";
import { ResourceModel } from "./data/ResourceModel";
import { SkillSystem } from "./skillsys/SkillSystem";
import { BattleUtils } from "./utils/BattleUtils";
import { BattleMapSoundControl } from "./control/BattleMapSoundControl";
import { BattlePlotHandler } from "./handler/BattlePlotHandler";
import { BattleResultHandler } from "./handler/BattleResultHandler";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
import BattleQuickenControl from "./quicken/BattleQuickenControl";
import BattleQuickenModel from "./quicken/BattleQuickenModel";
import { ArmyManager } from "../manager/ArmyManager";
import SceneType from "../map/scene/SceneType";
import { BattleType } from "../constant/BattleDefine";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import { BattleRecordReader } from "./record/BattleRecordReader";

/**
 * @author yuanzhan.yu
 */
export class BattleManager extends GameEventDispatcher {
    protected static claName: string = 'BattleManager';
    private static ins: BattleManager;

    static get Instance(): BattleManager {
        if (!this.ins) {
            this.ins = new BattleManager();
        }
        return this.ins;
    }

    private _battleModel: BattleModel;
    public get battleModel(): BattleModel {
        return this._battleModel;
    }

    public set model($info: BattleModel) {
        this._battleModel = $info;
    }

    public get model(): BattleModel {
        return this._battleModel;
    }

    /**
     * 从战斗开始到现在所跑的的帧数
     */
    private _liftTime: number = 0;

    public get BattleFrameCount(): number {
        return this._liftTime;
    }

    public started: boolean = false;
    /**
     *是否是战斗状态
     */
    public static begingBattle: boolean = false;
    public static localDubeg: boolean = false;
    private static _standardFrame: number = 25;
    /**
     * 战斗加速的帧数
     */
    private _addFrame: number = 1;

    /**
     * 界面
     */
    private _battleMap: any//BattleMapView;
    public get battleMap(): any {
        return this._battleMap;
    }

    public set battleMap(value: any) {
        this._battleMap = value;
    }
    /**
     * 战斗弹窗
     */
    public battleUIView: BattleWnd;
    /**
     * 战斗场景  改成battleScene
     */
    public mainViewContainer: BattleScene;
    /**
     * 战斗UI  改成battleView
     */
    public battleScene: BattleView;

    /**
     * 记录加载资源
     */
    public resourceModel: ResourceModel;
    /**
     * 记录连击;
     */
    public batterModel: BatterModel;
    /**
     * 记录抗性
     */
    public resistModel: ResistModel;

    private _diaplayMode: string = "normal";
    private _skillSystem: SkillSystem;
    /**
     * 用户登陆时, 是否直接进入战斗标志。
     */
    public static loginToBattleFlag: boolean;
    /**
     * 记录当前战斗画面的暴击动画数
     */
    public static criticalNum: number = 0;
    /**
     * 战斗加速模型 
     */
    public quickenModel: BattleQuickenModel;
    /**
     * 战斗加速控制器 
     */
    public quickenControl: BattleQuickenControl;
    /**
     * 战斗剧情控制器
     */
    public plotHandler: BattlePlotHandler
    /**
     * 战斗背景音乐控制器
     */
    public muiscControl: BattleMapSoundControl;

    /**
     * 该场战斗是否存在的标志
     */
    public static exitFlag: boolean;

    constructor() {
        super()

        this.plotHandler = new BattlePlotHandler();
    }

    /**
     * 同步战斗时间帧
     * @param value
     *
     */
    public set synchronization(value: number) {
        this._liftTime = value;
        this.dispatchEvent(BattleEvent.SYNCHRONIZATION, value);
    }

    public enterGame() {
    }

    public startGame() {
    }


    public setup() {
        this.batterModel = new BatterModel();
        this.resistModel = new ResistModel();

        this.quickenModel = new BattleQuickenModel();
        this.quickenControl = new BattleQuickenControl(this.quickenModel);
        this.muiscControl = new BattleMapSoundControl();

        BattleModel.gradeBeforeBattle = ArmyManager.Instance.thane.grades;
    }

    public setBattleFrameRate($frame: number) {
        this._addFrame = Math.round(BattleManager._standardFrame / $frame);
    }

    public battleNextFrame() {
        this._liftTime += this._addFrame;
    }


    public static preScene: string = "";

    /**
     * 获取战斗中自己的角色显示对象实例
     * @return
     *
     */
    public getSelfRoleView(): any {
        return this._battleMap.rolesDict[this._battleModel.selfHero.livingId];
    }

     /**
     * 获取战斗中当前控制的英灵角色显示对象实例
     * @return
     *
     */
     public getCurrentRoleView(): any {
        return this._battleMap.rolesDict[this._battleModel.currentHero.livingId];
    }

    /**
     * 执行初始化战斗相关的操作.
     * @param battleController
     *
     */
    public initBattle(battleController: BattleScene) {
        this.mainViewContainer = battleController;
    }

    /**
     *  当战斗被取消时调用
     *
     */
    public static onFightCanceled() {
        let logStr: string;
        if (BattleManager.Instance.battleModel) {
            logStr = "战斗被取消了,battleId=" + BattleManager.Instance.battleModel.battleId;
            Logger.battle(logStr,'BattleManager.Instance.battleModel.mapId',BattleManager.Instance.battleModel.mapId)
        } else {
            logStr = "战斗被取消了,但找不到战斗数据"
            Logger.battle(logStr);
        }
        //在战场中时间到了取消战斗时直接退出到天空之城
        if(BattleManager.Instance.battleModel && WorldBossHelper.checkPvp(BattleManager.Instance.battleModel.mapId)){
            Logger.battle('-----onFightCanceled 在战场中时间到了取消战斗时直接退出到天空之城:',logStr);
            BattleResultHandler.exitBattle(SceneType.SPACE_SCENE);
        }else
        {
            BattleResultHandler.exitBattle();
        }
        NotificationManager.Instance.dispatchEvent(BattleEvent.BATTLE_CANCEL, null);
        NotificationManager.Instance.dispatchEvent(BattleEvent.BATTLE_COMPLETE, null);
    }

    /**
     * 初始化技能系统
     *
     */
    public initSkillSystem() {
        this._skillSystem = new SkillSystem();
    }

    /**
     * 当战斗结束时,执行销毁该场战斗相关的操作.
     *
     */
    public disposeBattle(returnToCampaign: boolean = true) {
        BattleModel.gradeBeforeBattle = 0;
        BattleModel.battleDynamicLoaded = false;
        BattleModel.battleBgAniLoaded = false;
        BattleModel.battleUILoaded = false;
        BattleModel.battleAwakenUIInit = false;
        BattleRecordReader.inRecordMode = false;

        FrameCtrlManager.Instance.exit(EmWindow.Battle)
        Logger.battle("disposeBattle");
        
        this.battleUIView = null;

        // if(this.quickenControl){
        //     this.quickenControl.dispose();
        //     this.quickenControl = null;
        // }
        if (this.muiscControl) {
            this.muiscControl.dispose();
            this.muiscControl = null;
        }

        if (this.resourceModel) {
            this.resourceModel.dispose(returnToCampaign);
        }
        this.resourceModel = null;

        if (this._skillSystem) {
            this._skillSystem.dispose();
        }
        this._skillSystem = null;

        if (this.battleMap) {
            this.battleMap.dispose();
        }
        this.battleMap = null;

        if (this.battleScene) {
            this.battleScene.dispose();
        }
        this.battleScene = null;

        this.mainViewContainer = null;


        if (this._battleModel) {
            this._battleModel.dispose();
        }
        this._battleModel = null;

        this.batterModel = null;
        this.resistModel = null;

    }

    /**
     * 获得技能系统实例.
     * @return
     *
     */
    public getSkillSystem(): SkillSystem {
        return this._skillSystem;
    }

    public get skillSystem(): SkillSystem {
        return this._skillSystem;
    }

    /**
     * 是否所有的动作都已经执行, 技能系统队列和角色身上不存在未执行的动作
     * @return
     *
     */
    public isAllSkillExecuted(): boolean {
        if (this._skillSystem && this._skillSystem.getSkillQueue().getActions().length > 0) {
            // Logger.battle("技能系统中还有动作未执行:" + this._skillSystem.getSkillQueue().getActions().length);
            return false;
        }
        if (this._battleModel && !this._battleModel.isAllSkillExecuted()) {
            return false;
        }
        return true;
    }

    /**
     * 返回技能队列和角色身上等待的动作
     * @return
     *
     */
    public getWaitSkillList(): any[] {
        let arr: any[] = this._skillSystem.getSkillQueue().getActions();
        arr = this._battleModel.getWaitSkillList().concat(arr);
        return arr;
    }
}