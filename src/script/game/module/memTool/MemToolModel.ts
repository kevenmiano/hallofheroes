import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import MemToolItemInfo from "./MemToolItemInfo";


export default class MemToolModel extends GameEventDispatcher{
	private static _instance: MemToolModel;
    private _memList: Array<MemToolItemInfo>;
    texMemCount: number;
    texMemNum: number;

     public get memList(): Array<MemToolItemInfo> {
        //@ts-ignore
        this._memList = this.transMap(Laya.Resource._idResourcesMap);
        return this._memList;
     }

	public static get instance(): MemToolModel {
		if (!MemToolModel._instance) MemToolModel._instance = new MemToolModel();
		return MemToolModel._instance;
	}

	constructor() {
        super();
		// this.initData();
	}

	private initData() {
        //@ts-ignore
		this._memList = this.transMap(Laya.Resource._idResourcesMap);
	}

    getTips() {
        let gpu = (Laya.Resource.gpuMemory / 1024 / 1024).toFixed(2) + 'm';
        let tex = (this.texMemCount / 1024 / 1024).toFixed(2) + 'm';
        return `GPUMemory:${gpu}  Texture2D:${tex}(${this.texMemNum})`;
    }

    transMap(map: any) {
        let arrs = [];
        this.texMemCount = 0;
        this.texMemNum = 0;
        for (const i in map) {
            if (Object.prototype.hasOwnProperty.call(map, i)) {
                const element = map[i];
                // if (element.referenceCount > 0)
                arrs.push(element);

                if (element.constructor.name == 'Texture2D') {
                    this.texMemCount += element.gpuMemory;
                    this.texMemNum ++;
                }
            }
        }
        arrs = arrs.sort((a: MemToolItemInfo, b: MemToolItemInfo) => {
            return b.gpuMemory - a.gpuMemory;
        })
        return arrs;
    }

}