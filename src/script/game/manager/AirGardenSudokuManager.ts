// @ts-nocheck

import { PackageIn } from "../../core/net/PackageIn";
import { SocketManager } from "../../core/net/SocketManager";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import SudokuModel from "../module/carnival/model/sudoku/SudokuModel";
import SudokuGameReqMsg = com.road.yishi.pb.minigame.SudokuGameReqMsg;
import SudokuGameMsg = com.road.yishi.pb.minigame.SudokuGameMsg;
import Cell = com.road.yishi.pb.minigame.Cell;
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { ServerDataManager } from "../../core/net/ServerDataManager";
export class AirGardenSudokuManager extends GameEventDispatcher {


    private static _instance: AirGardenSudokuManager;

    public static RECEIVE_MESSAGE="RECEIVE_MESSAGE";

    public static get Instance(): AirGardenSudokuManager {
        if (!this._instance) this._instance = new AirGardenSudokuManager();
        return this._instance;
    }

    private msg: SudokuGameMsg;

    private constructor() {
        super();
    }

    private _model: SudokuModel;
    public get model(): SudokuModel {
        return this._model;
    }

    public setup() {
        this._model = new SudokuModel();
        ServerDataManager.listen(S2CProtocol.U_C_SUDOKU_GAME_INFO, this, this.handleMsg);
    }

    private handleMsg(pkg: PackageIn) {
        let info = pkg.readBody(SudokuGameMsg) as SudokuGameMsg;
        this.msg = info;
        this.dispatchEvent(AirGardenSudokuManager.RECEIVE_MESSAGE,info);
    }

    //操作类型 1:开始游戏 2:填入数字 3：使用时间道具 4:撤销 5:删除 6:关闭
    public sendGameOption(opType: number, col = 0, row = 0, v = 0) {
        let msg: SudokuGameReqMsg = new SudokuGameReqMsg();
        msg.opType = opType;
        if (opType == 2) {
            let cell = new Cell();
            cell.col = col;
            cell.row = row;
            cell.value = v;
            msg.cell = cell;
        }
        this.sendProtobuffer(C2SProtocol.C_SUDOKU_OP, msg);
    }

    public sendProtobuffer(code: number, message) {
        SocketManager.Instance.send(code, message);
    }


}