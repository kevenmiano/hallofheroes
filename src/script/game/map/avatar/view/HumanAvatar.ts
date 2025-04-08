// @ts-nocheck
import { Avatar } from "../../../avatar/view/Avatar";
import { ResourceLoaderInfo } from "../data/ResourceLoaderInfo";

export class HumanAvatar extends Avatar {
    constructor($key: string, $isDefault: boolean, pixelSnapping: string = "auto", smoothing: boolean = true) {
        super($key, $isDefault, pixelSnapping, smoothing);
    }

    public set stepFrame(value: number) {
    }

    public set isShowWeapons(value: boolean) {

    }

    public getCurrentPixels(point?:Laya.Point): number {
        return 0;
    }

    public loaderCompleteHandler(res: any, tempData: ResourceLoaderInfo) {

    }

}