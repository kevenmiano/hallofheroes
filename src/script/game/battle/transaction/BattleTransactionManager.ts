// @ts-nocheck
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import { Disposeable } from "../../component/DisplayObject";
import Dictionary from "../../../core/utils/Dictionary";
import { ISocketTransaction } from "../../interfaces/ISocketTransaction";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { SLGSocketEvent } from "../../constant/event/NotificationEvent";
import { MapSocketInnerManager } from "../../manager/MapSocketInnerManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { BattleManager } from "../BattleManager";
import LangManager from "../../../core/lang/LangManager";
import { BattleAttackTransaction } from "./BattleAttackTransaction";
import { BattleAwakenTransaction } from "./BattleAwakenTransaction";
import { BattleStartTransaction } from "./BattleStartTransaction";
import { ReinfoTransaction } from "./ReinfoTransaction";
import { ReinfoResTransaction } from "./ReinfoResTransaction";
import { BattleStopTransaction } from "./BattleStopTransaction";
import { AttackModeTransaction } from "./AttackModeTransaction";
import { BattleNoticeTransaction } from "./BattleNoticeTransaction";
import Logger from "../../../core/logger/Logger";
import {ServerDataManager} from "../../../core/net/ServerDataManager";

/**
 * @author yuanzhan.yu
 */
export class BattleTransactionManager implements IEnterFrame, Disposeable {
    private _executable: any[];

    private _waitlist: any[];

    private _handlerList: Dictionary;
    private static maxWaitTime: number = 125;
    private _lastHandle: ISocketTransaction;

    constructor() {

    }

    public setup() {
        this._waitlist = [];
        this._executable = [];
        this._handlerList = new Dictionary();
        this.registerAllHandler();
        EnterFrameManager.Instance.registeEnterFrame(this);
        ServerDataManager.Instance.addEventListener(SLGSocketEvent.GAME_CMD, this.__gameCmdHandler, this);
    }

    public uninstall() {
        this._waitlist = null;
        this._executable = null;
        this._handlerList = null;
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        ServerDataManager.Instance.removeEventListener(SLGSocketEvent.GAME_CMD, this.__gameCmdHandler, this);
    }

    private __gameCmdHandler(pkg: PackageIn) {
        this.addQueue(pkg);
    }

    public addHandler($handler: ISocketTransaction) {
        if (!this._handlerList[$handler.getCode()]) {
            this._handlerList[$handler.getCode()] = $handler;
        }
    }

    public enterFrame() {
        BattleManager.Instance.battleNextFrame();
        let pkg: PackageIn;

        for (let i: number = 0; i < this._waitlist.length; i++) {
            pkg = this._waitlist[i] as PackageIn;
            if (pkg.extend2 > 0 && pkg.code == 5) {
                Logger.error(LangManager.Instance.GetTranslation("battle.transaction.BattleTransactionManager.Error"));
            }
            if (pkg.extend2 <= BattleManager.Instance.BattleFrameCount) {
                this._executable.push(pkg);
                this._waitlist.splice(i, 1);
                break;
            }

        }

        let handler: ISocketTransaction;
        for (let j: number = 0; j < this._executable.length; j++) {
            pkg = this._executable[j] as PackageIn;
            handler = this._handlerList[pkg.code] as ISocketTransaction;
            if (handler) {
                handler.configure(pkg);
                handler.handlePackage();
                break;
            }
        }
        this._lastHandle = handler;
        this._executable = [];
    }

    public addQueue(pkg: PackageIn) {
        this._waitlist.push(pkg);
    }

    public dispose() {
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        ServerDataManager.Instance.removeEventListener(SLGSocketEvent.GAME_CMD, this.__gameCmdHandler, this);
        this._executable = null;
        this._waitlist = null;
    }

    private static _instance: BattleTransactionManager

    public static getInstance(): BattleTransactionManager {
        if (!BattleTransactionManager._instance) {
            BattleTransactionManager._instance = new BattleTransactionManager();
        }
        return BattleTransactionManager._instance;
    }

    private registerAllHandler() {
        this.addHandler(new BattleAttackTransaction());
        this.addHandler(new BattleAwakenTransaction());
        this.addHandler(new BattleStartTransaction());
        this.addHandler(new ReinfoTransaction());
        this.addHandler(new ReinfoResTransaction());
        this.addHandler(new BattleStopTransaction());
        this.addHandler(new AttackModeTransaction());
        this.addHandler(new BattleNoticeTransaction());
    }
}