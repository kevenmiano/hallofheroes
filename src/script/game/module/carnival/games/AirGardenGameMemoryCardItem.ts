import FUI_AirGardenGameMemoryCardItem from "../../../../../fui/Carnival/FUI_AirGardenGameMemoryCardItem";
import AirGardenMemoryCardManager from "../../../manager/AirGardenMemoryCardManager";
import MemoryCardData from "../model/memorycard/MemoryCardData";
import MemoryCardModel from "../model/memorycard/MemoryCardModel";


export default class AirGardenGameMemoryCardItem extends FUI_AirGardenGameMemoryCardItem {
    public static TURN_HALF_TIME: number = 250;
    public index: number = -1;

    // private _usable: boolean = true;
    // public set usable(val: boolean) {
    //     this._usable = val
    //     // this.alpha = val ? 1 : 0
    //     // this.touchable = val
    // }
    // public get usable(): boolean {
    //     return this._usable
    // }

    private imgIcon: fgui.GLoader

    /**是否鼠标点击翻开的*/
    public isClickFlip: boolean = false;

    /**是否服务端通知正确开启了*/
    private _isResultOpen: boolean = false;

    /**只是展示 展示完盖回去*/
    public showAndBack: boolean = false;

    /**是否服务端通知正确开启了*/
    public get isResultOpen(): boolean {
        return this._isResultOpen;
    }

    public set isResultOpen(value: boolean) {
        this._isResultOpen = value;
        if (this._isResultOpen) {
            // this.usable = false;
        }
    }

    protected onConstruct() {
        super.onConstruct()
        this.imgIcon = this.comFront.getChild("imgIcon") as fgui.GLoader
    }

    private _info: MemoryCardData
    public set info(mdata: MemoryCardData) {
        let url = AirGardenMemoryCardManager.Instance.model.getCardIcon(mdata.type);
        this.imgIcon.icon = url;
        // this.txtTestType.text = mdata.type + "";
    }

    public get info(): MemoryCardData {
        return this._info
    }

    public turnBack(completeFunc?: Function) {
        this.comFront.scaleX = 1
        Laya.Tween.to(this.comFront, { scaleX: 0 }, AirGardenGameMemoryCardItem.TURN_HALF_TIME, null, Laya.Handler.create(null, () => {

        }))

        Laya.timer.once(AirGardenGameMemoryCardItem.TURN_HALF_TIME, this, () => {
            this.showBack(true)
            this.comBack.scaleX = -0.01
            this.comFront.scaleX = 1
            Laya.Tween.to(this.comBack, { scaleX: 1 }, AirGardenGameMemoryCardItem.TURN_HALF_TIME, null, Laya.Handler.create(null, () => {
                completeFunc && completeFunc()
            }))
        })
    }

    public turnFront(completeFunc?: Function, auto: boolean = false) {
        this.comBack.scaleX = 1
        Laya.Tween.to(this.comBack, { scaleX: 0 }, AirGardenGameMemoryCardItem.TURN_HALF_TIME, null, Laya.Handler.create(null, () => {

        }))

        Laya.timer.once(AirGardenGameMemoryCardItem.TURN_HALF_TIME, this, () => {
            this.showBack(false)
            this.comFront.scaleX = -0.01
            this.comBack.scaleX = 1
            Laya.Tween.to(this.comFront, { scaleX: 1 }, AirGardenGameMemoryCardItem.TURN_HALF_TIME, null, Laya.Handler.create(null, () => {
                if (auto || this.showAndBack) {

                } else {
                    this.imgSelect.visible = true;
                }
                if (this.showAndBack) {
                    this.showAndBack = false;
                    Laya.timer.once(2000, this, () => {
                        this.turnBack(completeFunc);
                    })
                } else {
                    completeFunc && completeFunc();
                }
            }))
        })
    }

    public showBack(back: boolean = true) {
        this.comFront.visible = !back
        this.comBack.visible = back
    }

    public playEffect() {
        // this.comFront.getChild("mc").visible = true;
    }

    public clearEffect() {
        // this.comFront.getChild("mc").visible = false;
    }

    public get model(): MemoryCardModel {
        return AirGardenMemoryCardManager.Instance.model;
    }

    public dispose(): void {
        Laya.Tween.clearAll(this);
        Laya.timer.clearAll(this);
        super.dispose()
    }
}