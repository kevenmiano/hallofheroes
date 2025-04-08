import LangManager from '../../core/lang/LangManager';
import { PackageIn } from "../../core/net/PackageIn";
import { CampaignResultTransaction } from "../battle/transaction/CampaignResultTransaction";
import { DialogTransation } from "../battle/transaction/DialogTransation";
import { MoveCampaignSceneTransaction } from "../battle/transaction/MoveCampaignSceneTransaction";
import { OpenChestTransaction } from "../battle/transaction/OpenChestTransaction";
import { PlayerMovieClipTransaction } from "../battle/transaction/PlayerMovieClipTransaction";
import { SessionTransaction } from "../battle/transaction/SessionTransaction";
import { IEnterFrame } from "../interfaces/IEnterFrame";
import { ISocketTransaction } from "../interfaces/ISocketTransaction";
import { EnterFrameManager } from "./EnterFrameManager";
import PlayerMovieMsg = com.road.yishi.proto.player.PlayerMovieMsg;

/**
 * @author yuanzhan.yu
 */
export class CoreTransactionManager implements IEnterFrame {
    private _liftTime: number = 0;
    private _executable: any[];
    private _waitlist: any[];
    private _handlerList: Map<number, ISocketTransaction>;
    private _vUnregisterProtocol: string = "";

    constructor() {
        this._waitlist = [];
        this._executable = [];
        this._handlerList = new Map();
        this._vUnregisterProtocol = LangManager.Instance.GetTranslation("yishi.manager.CoreTransactionManager.vUnregisterProtocol");
    }

    public setup() {
        this.registerAllHandler();
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    private addHandler($handler: ISocketTransaction) {
        if (!this._handlerList[$handler.getCode()]) {
            this._handlerList[$handler.getCode()] = $handler;
        }
    }

    public getMessage(): string {
        return "CoreTransactionManager : " + this._waitlist.length;
    }

    public enterFrame() {
        this._liftTime++;
        let pkg: PackageIn;
        if (this._waitlist.length > 0) {
            for (let i: number = (this._waitlist.length - 1); i >= 0; i--) {
                pkg = this._waitlist[i] as PackageIn;
                if (pkg.extend2 <= this._liftTime) {
                    this._executable.push(pkg);
                    this._waitlist.splice(i, 1);
                }
            }
        }

        let handler: ISocketTransaction;
        for (let j: number = 0; j < this._executable.length; j++) {
            pkg = this._executable[j];
            handler = this._handlerList[pkg.code] as ISocketTransaction;
            if (handler) {
                handler.configure(pkg);
                handler.handlePackage();
            }
            else {
                throw new Error("QueueManager" + this._vUnregisterProtocol + ": " + pkg.code);
            }
        }
        this._executable.splice(0, this._executable.length);
    }

    public addQueue(pkg: PackageIn) {
        this._waitlist.push(pkg);
    }

    /**
     * 相对当前时间, 调整delay值, 并加入到队列
     * @param pkg
     *
     */
    public currentTimeAddQueue(pkg: PackageIn) {
        pkg.updateLeftTime = pkg.extend2 + this.liftTime;
        pkg.position = PackageIn.HEADER_SIZE;
        this.addQueue(pkg);
    }

    public handlerPackage(pkg: PackageIn) {
        let handler: ISocketTransaction = this._handlerList[pkg.code] as ISocketTransaction;
        if (handler) {
            handler.configure(pkg);
            handler.handlePackage();
        }
    }

    public get liftTime(): number {
        return this._liftTime;
    }

    private static _instance: CoreTransactionManager

    public static getInstance(): CoreTransactionManager {
        if (!CoreTransactionManager._instance) {
            CoreTransactionManager._instance = new CoreTransactionManager();
        }
        return CoreTransactionManager._instance;
    }

    private registerAllHandler() {
        //每次进出战斗都会重新实例化以下对象
        let createGameTransaction = Laya.ClassUtils.getClass('CreateGameTransaction');
        let campaignOverTransaction = Laya.ClassUtils.getClass('CampaignOverTransaction');
        this.addHandler(new createGameTransaction());
        this.addHandler(new MoveCampaignSceneTransaction());
        this.addHandler(new PlayerMovieClipTransaction());
        this.addHandler(new SessionTransaction());
        this.addHandler(new DialogTransation());
        this.addHandler(new OpenChestTransaction());
        this.addHandler(new CampaignResultTransaction());
        this.addHandler(new campaignOverTransaction());
    }
}