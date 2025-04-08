import {PackageIn} from "../../core/net/PackageIn";
import {NotificationEvent} from "../constant/event/NotificationEvent";
import {PkgBuffer} from "../datas/buffer/PkgBuffer";
import {IEnterFrame} from "../interfaces/IEnterFrame";
import {SceneManager} from "../map/scene/SceneManager";
import {EnterFrameManager} from "./EnterFrameManager";
import {NotificationManager} from "./NotificationManager";

/**
 * socket针对场景的缓冲
 * @author yuanzhan.yu
 *
 */
export class SocketSceneBufferManager implements IEnterFrame
{
    private _pkgBuffer:Map<string, any>;
    private _isSetup:boolean;

    constructor()
    {

    }

    public setup()
    {
        this._isSetup = true;
        this._pkgBuffer = new Map();
        EnterFrameManager.Instance.registeEnterFrame(this);
        NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.__switchSceneHandler, this);
    }

    private __switchSceneHandler(evt:NotificationEvent)
    {
        if(SceneManager.Instance.lock)
        {
            return;
        }
        let scene:string = SceneManager.Instance.currentType;
        let arr:any[] = this._pkgBuffer[scene] as any[];
        if(arr)
        {
            while(arr.length > 0)
            {
                let info:PkgBuffer = arr.pop();
                this.executePkg(info);

            }
        }
        this._pkgBuffer[scene] = null;
        delete this._pkgBuffer[scene];
    }

    public enterFrame()
    {
        let time:number = new Date().getTime();
        for(const key in this._pkgBuffer)
        {
            let arr:any[] = this._pkgBuffer[key];
            for(let i:number = arr.length - 1; i >= 0; i--)
            {
                let info:PkgBuffer = arr[i];
                if((time - info.time) > info.leftTime)
                {
                    arr.splice(i, 1);
                    this.executePkg(info);
                }
            }
        }
    }

    public getMessage():string
    {
        let mssage:string = "";
        let count:number;
        for(let key in this._pkgBuffer)
        {
            if(Object.prototype.hasOwnProperty.call(this._pkgBuffer, key))
            {
                let arr = this._pkgBuffer[key];
                for(let i:number = arr.length - 1; i >= 0; i--)
                {
                    count++;
                    mssage += (count + " : " + (arr[i]) + "\n");
                }
            }
        }

        return mssage;
    }

    /**
     *
     * @param pkg 数据包
     * @param scene 执行的场景
     * @param callBack回调
     * @param leftTime最大延迟时间
     */
    public addPkgToBuffer(pkg:PackageIn, scene:string, callBack:Function, leftTime:number = 90000)
    {
        if(!this._isSetup)
        {
            return;
        }
        pkg.position = PackageIn.HEADER_SIZE;
        let info:PkgBuffer = new PkgBuffer(pkg, new Date().getTime(), callBack, leftTime);
        if(!this._pkgBuffer[scene])
        {
            this._pkgBuffer[scene] = [];
        }
        this._pkgBuffer[scene].push(info);
        this.__switchSceneHandler(null);
    }

    private executePkg(info:PkgBuffer)
    {
        info.callBack(info.pkg);
        info = null;
    }

    private static _instance:SocketSceneBufferManager

    public static get Instance():SocketSceneBufferManager
    {
        if(!SocketSceneBufferManager._instance)
        {
            SocketSceneBufferManager._instance = new SocketSceneBufferManager();
        }
        return SocketSceneBufferManager._instance;
    }
}