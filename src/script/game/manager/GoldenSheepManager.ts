import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import CCCActiveType from "../constant/CCCActiveType";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { EmWindow } from "../constant/UIDefine";
import GoldenSheepModel from "../module/goldensheep/GoldenSheepModel";
import GoldenSheepRecordInfo from "../module/goldensheep/GoldenSheepRecordInfo";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import GoldenSheepMsg = com.road.yishi.proto.cccactive.GoldenSheepMsg;
import GoldenSheepPlayerMsg = com.road.yishi.proto.cccactive.GoldenSheepPlayerMsg;
export default class GoldenSheepManager {

    private _model: GoldenSheepModel;
    private static _Instance: GoldenSheepManager;
    public static OP_CHECK: number = 1;
    public static OP_OPEN: number = 2;
    public static OP_CLOSE: number = 3;
    public static get Instance(): GoldenSheepManager {
        if (!GoldenSheepManager._Instance) {
            GoldenSheepManager._Instance = new GoldenSheepManager();
        }
        return GoldenSheepManager._Instance;
    }

    public setup() {
        this.initEvent();
        this._model = new GoldenSheepModel();
    }

    public get model(): GoldenSheepModel {
        return this._model;
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_GOLDEN_SHEEP, this, this.__goldenSheepHandler);
    }

    private __goldenSheepHandler(pkg: PackageIn) {
        var msg: GoldenSheepMsg = pkg.readBody(GoldenSheepMsg) as GoldenSheepMsg;
        if (msg.op == GoldenSheepManager.OP_CLOSE) {
            if(FrameCtrlManager.Instance.isOpen(EmWindow.GoldenSheepBoxWnd)){
                FrameCtrlManager.Instance.exit(EmWindow.GoldenSheepBoxWnd)
            }
            return;
        }
        this.model.myCount = msg.myCount;
        this.model.isReward = msg.isReward;
        this.model.rewardId = msg.rewardId;
        this.model.totalCount = msg.totalCount;
        this.model.curCount = msg.curCount;
        this.model.isOpen = msg.isOpen;
        this.model.state = msg.state;
        this.model.openTime = DateFormatter.parse(msg.openTime, "YYYY-MM-DD hh:mm:ss");
        this.model.endTime = DateFormatter.parse(msg.stopTime, "YYYY-MM-DD hh:mm:ss");
        let recordList: Array<GoldenSheepRecordInfo> = [];
        if (msg.sheepData && msg.sheepData.length > 0) {
            let len = msg.sheepData.length;
            for (let i: number = 0; i < len; i++) {
                let recordMsg: GoldenSheepPlayerMsg = msg.sheepData[i] as GoldenSheepPlayerMsg;
                let recordInfo: GoldenSheepRecordInfo = new GoldenSheepRecordInfo();
                if (recordMsg) {
                    recordInfo.nickName = recordMsg.nickName;
                    recordInfo.money = recordMsg.money;
                    recordInfo.isBest = recordMsg.isBest;
                    recordInfo.userId = recordMsg.userid;
                    recordList.push(recordInfo);
                }
            }
        }
        this.model.recordList = recordList;
        switch (msg.op) {
            case GoldenSheepManager.OP_CHECK:
                if (this.model.hasGotReward) {
                    FrameCtrlManager.Instance.open(EmWindow.GoldenSheepWnd);
                }
                else {
                    FrameCtrlManager.Instance.open(EmWindow.GoldenSheepBoxWnd);
                }
                break;
            case GoldenSheepManager.OP_OPEN:
                FrameCtrlManager.Instance.open(EmWindow.GoldenSheepWnd);
                break;
            default:
                this.model.index = msg.index;
                this.model.count = msg.count;
                this.model.nextTime = msg.nextTime;
                this.model.isOver = msg.isover;
                this.model.updateState();
                break;
        }
        this.model.commit();
    }

    public checkState() {
        let extendsId: number = CCCActiveType.GOLDEN_SHEEP;
        var msg: GoldenSheepMsg = new GoldenSheepMsg();
        msg.op = GoldenSheepManager.OP_CHECK;
        SocketManager.Instance.send(C2SProtocol.C_CCCACTIVE_CLIENTOP, msg, extendsId);

    }

    public openBox() {
        let extendsId: number = CCCActiveType.GOLDEN_SHEEP;
        var msg: GoldenSheepMsg = new GoldenSheepMsg();
        msg.op = GoldenSheepManager.OP_OPEN;
        SocketManager.Instance.send(C2SProtocol.C_CCCACTIVE_CLIENTOP, msg, extendsId);
    }

}