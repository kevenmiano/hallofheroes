import Dictionary from "../../../../core/utils/Dictionary";

export class AvatarLayouData {
    private _data: Dictionary;
    private _embedData: string;
    public get embedData(): string{
        return this._embedData
    }

    constructor(embedData: string) {
        if (!embedData) {
            return;
        }
        this._embedData = embedData;
        this.setData(embedData);
    }

    public setData(embedData: string) {
        this._data = new Dictionary();
        let arr: any[] = embedData.split("|");
        arr.forEach(str => {
            let obj: any = this.solveItemData(str);
            this._data[obj.k] = obj;
        });
    }

    /**
     * 通过朝向类型校正坐标
     * @param frameY
     * @param offsetX
     * @param offsetY
     * @param multiplier
     */
    public setDataOffsetByFrameY(frameY: number, offsetX: number, offsetY: number, multiplier: number = 1) {
        for (let key in this._data) {
            if (key.indexOf("_" + frameY) >= 0) {
                this._data[key].x = Number(this._data[key].x) + offsetX * multiplier;
                this._data[key].y = Number(this._data[key].y) + offsetY * multiplier;
            }
        }
    }

    /**
     * 清除位置偏移量  
     */
    public clearOffset() {
        this.setData(this._embedData);
    }

    public getCellByKey(frameX: number, frameY: number): Object {
        return this._data && this._data[frameX + "_" + frameY];
    }

    /**
     * x:1210,y:1427,w:307,h:209,px:33,py:87,k:7_4
     */
    private solveItemData(value: string): Object {
        let temp: any[] = value.split(",");
        let obj: Object = {};
        temp.forEach(key => {
            let inx: number = key.indexOf(":");
            obj[key.substr(0, inx)] = key.substr(inx + 1);
        });
        return obj;
    }
}