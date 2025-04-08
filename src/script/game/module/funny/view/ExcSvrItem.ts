import FUI_ExcSvrItem from "../../../../../fui/Funny/FUI_ExcSvrItem";
import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import AllManExchangeManager from "../../../manager/AllManExchangeManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay } from "../../../tips/ITipedDisplay";
import AllManExchangeModel from "../model/AllManExchangeModel";

/**
 * 全民兑换小宝箱
 */
export default class ExcSvrItem extends FUI_ExcSvrItem implements ITipedDisplay {
    public static DEFAULT: number = 1;//还未到条件领取
    public static OPEN: number = 2;//可领取
    public static CLOSE: number = 3;//已领取

    tipType: EmWindow = EmWindow.CommonTips;
    tipData: any = null;
    startPoint: Laya.Point = new Laya.Point(-60, 0);

    private index: number = 0;
    private _state: number = 1;
    private get model(): AllManExchangeModel {
        return AllManExchangeManager.Instance.model;
    }

    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
        // this.txt1.text = LangManager.Instance.GetTranslation("allmainexchange.str5");
        this.txt_score.text = "1000";
    }

    public update(index): void {
        this.index = index;
        if (!Number(this.model.allPointAward[index])) {
            return;
        }
        this.txt_score.text = this.model.allPointAward[index];
        if (this.model.allPoint >= Number(this.model.allPointAward[index])) {
            if (Number(this.model.serverAwardState[index]) == 1) {
                //领取了
                this.c1.selectedIndex = 1;
                this.eff.visible = false;
                this._state = ExcSvrItem.CLOSE;
            } else {
                this.c1.selectedIndex = 0;
                this.eff.visible = true;
                this._state = ExcSvrItem.OPEN;
            }
        } else {
            this.c1.selectedIndex = 0;
            this._state = ExcSvrItem.DEFAULT;
        }
        this.tipData = this.model.getSmallBoxTip(index + 1);
        this.startPoint.x = index == 4 ? 150 : -60;
        ToolTipsManager.Instance.register(this);
    }

    private initEvent() {
        this.on(Laya.Event.CLICK, this, this.onClickGet);
    }

    private removeEvent() {
        this.off(Laya.Event.CLICK, this, this.onClickGet);
    }

    private onClickGet(): void {
        if (this._state == ExcSvrItem.DEFAULT) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str10"));
            return;
        }
        if (this._state == ExcSvrItem.CLOSE) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str8"));
            return;
        }
        AllManExchangeManager.Instance.sendGetAward(2, this.index);
    }

    // public set state(value: number) {
    //     this._state = value;
    //     switch (value) {
    //         case ExcSvrItem.DEFAULT:
    //             this.c1.selectedIndex = 0;
    //             this.eff.visible = false;
    //             ToolTipsManager.Instance.register(this);
    //             break;
    //         case ExcSvrItem.OPEN:
    //             this.c1.selectedIndex = 0;
    //             this.eff.visible = true;
    //             break;
    //         case ExcSvrItem.CLOSE:
    //             this.c1.selectedIndex = 1;
    //             this.eff.visible = false;
    //             ToolTipsManager.Instance.register(this);
    //             break;
    //     }
    // }

    dispose() {
        ToolTipsManager.Instance.unRegister(this);
        this.removeEvent();
        super.dispose();
    }
}