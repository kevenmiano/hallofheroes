// @ts-nocheck
import { AvatarPosition } from "../../../avatar/data/AvatarPosition";
import { Disposeable } from "../../../component/DisplayObject";


export class ResourceLoaderInfo implements Disposeable {
    public loaderType: number = 0;
    public content: Object;
    public stand: any[];
    public walk: any[];
    private _position: string;
    public set position(v: string) {
        this._position = v
        this.isMountPart = this.position == AvatarPosition.MOUNT || this.position == AvatarPosition.MOUNT_WING
        this.isTranslucencePart = this.position == AvatarPosition.TRANSLUCENCE
    };
    public get position(): string {
        return this._position
    };
    public positionAddSign: string = ""; //附加标识 使相同类型的position存在

    public isMountPart: boolean = false;
    public isTranslucencePart: boolean = false;
    public packageName: string;
    public get isNpc(): boolean {
        return this._url.indexOf("npc") !== -1;
    }

    public _preUrl: string = "";
    public get preUrl(): string {
        return this._preUrl;
    }
    public set preUrl(value: string) {
        this._preUrl = value;
    }

    private _url: string;
    public get url(): string {
        return this._url.toLowerCase();
    }
    public set url(value: string) {
        this._url = value;
    }

    public call: Function;
    public resourceType: number = 0;//资源类型
    public queueLoader: boolean;//是否加入队列排队加载

    public dispose() {
        this.url = null;
        this.stand = null;
        this.walk = null;
        this.position = null;
        this.call = null;
    }
}
