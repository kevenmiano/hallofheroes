import { NotificationEvent, RoomEvent } from "../../../constant/event/NotificationEvent";
import GameEventDispatcher from '../../../../core/event/GameEventDispatcher';
import { NotificationManager } from "../../../manager/NotificationManager";

export class SimpleRoomInfo extends GameEventDispatcher {
    public id: number = 0;
    public mapName: string;
    public roomDifficulty: number = 0;//难度
    public capacity: number = 0;//最大人数
    public roomType: number = 0;
    public isLock: boolean;//房间是否有密码
    public curCount: number = 0;//当前人数
    public password: string;

    private _placesState: any[];//每个位置的状态, 下标代表位置, 值代表状态,-1是关闭, 0是打开, 其它是玩完
    private _roomState: number = 0;
    public serverName: string = "";
    constructor() {
        super()
        this.placesState = [0, 0, 0, 0];
    }

    public get placesState(): any[] {
        return this._placesState;
    }

    public set placesState(value: any[]) {
        this._placesState = value;
        var count: number = 0;
        if (value) {
            for (var i: number = 0; i < value.length; i++) {
                if (value[i] >= 0) count++;
            }
        }
        this.dispatchEvent(RoomEvent.ROOM_PLACE_STATE_CHANGE, value);
    }

    public existEmptyPos(): boolean {
        if (this.capacity <= 1) return false;
        for (var i: number = 0; i < this.placesState.length; i++) {
            if (this.placesState[i] == 0) return true;
        }
        return false;
    }
    public get roomState(): number {
        return this._roomState;
    }

    public set roomState(value: number) {
        this._roomState = value;
    }

    public commit() {
        this.dispatchEvent(RoomEvent.UPDATE_ROOM_BASE_DATA, this);
        NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_ROOM_BASE_DATA);
    }

    public clear() {
        
    }
}