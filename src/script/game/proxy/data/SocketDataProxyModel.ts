import { SocketDataProxyEventEvent } from "../../constant/event/NotificationEvent";
import { SocketDataProxyInfo } from "./SocketDataProxyInfo";
import GameEventDispatcher from '../../../core/event/GameEventDispatcher';

export class SocketDataProxyModel extends GameEventDispatcher {
    private _cacheData: Map<string, any>

    constructor() {
        super()
        this._cacheData = new Map();
    }

    public addSocketData(info: SocketDataProxyInfo, scene: string) {
        let list: Array<SocketDataProxyInfo> = this._cacheData[scene];
        if (!list) {
            list = [];
        }
        list.push(info);
        this._cacheData[scene] = list;
    }

    public getSceneSocketData(scene: string): SocketDataProxyInfo[] {
        return this._cacheData[scene] as Array<SocketDataProxyInfo>;
    }

    /**
     * 解析指定场景的数据
     * @param scene
     *
     */
    public readSceneSocketData(scene: string) {
        let list: SocketDataProxyInfo[] = this.getSceneSocketData(scene);
        if (list) {
            while (list.length > 0) {
                let info: SocketDataProxyInfo = list.shift();
                this.dispatchEvent(info.eventType, info.data);
            }
        }
        this.dispatchEvent(SocketDataProxyEventEvent.READ_SOCKET_DATA_OVEW, scene);
    }

    public clearSceneSocketData(scene: string) {
        let list: SocketDataProxyInfo[] = this.getSceneSocketData(scene);
        if (list) {
            list.length = 0;
        }
    }
}