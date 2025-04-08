// @ts-nocheck
import FUI_AirGardenGameFivecardItem from "../../../../../fui/Carnival/FUI_AirGardenGameFivecardItem";
import FUIHelper from "../../../utils/FUIHelper";
import { FivecardData } from "./FivecardData";


export class AirGardenGameFivecardItem extends FUI_AirGardenGameFivecardItem {


    /**是否保留*/
    public isHold = false;

    /**位序*/
    public index = 0;

    private isLocked = false;

    private t = 0.2;

    private _info: FivecardData;

    public showData: FivecardData;

    private pokerValueConver = ["J", "Q", "K", "A"]

    public isFlipCard:boolean = false;
    
    onConstruct() {
        super.onConstruct();
        this.onClick(this, this.onItemClick);
    }



    public set info(v: FivecardData) {
        this._info = v;
        this.index = v.index;
        this.pokerColor.icon = FUIHelper.getItemURL("Carnival", `Icon_Poker_${v.color}`);
        let pokerValue = v.number > 10 ? this.pokerValueConver[v.number - 11] : v.number == 1 ? this.pokerValueConver[3] : v.number + "";
        this.pokerValueNum.text = pokerValue;
        this.pokerValueColor.selectedIndex = v.color % 2 ? 0 : 1;
    }

    public lock(v: boolean) {
        this.isLocked = v;
        this.isHold = v;
        if (v) {
            this.holdTxt.visible = !v;
            this.pokerSel.visible = !v;
        }
    }


    private onItemClick() {
        if (this.isLocked) return;
        this.isHold = !this.isHold;
        this.holdTxt.visible = this.isHold;
        this.pokerSel.visible = this.isHold;
    }

    public flip(needGap = false) {
        this.pokerBack.visible = true;
        this.pokerFront.visible = false;
        if (needGap) {
            Laya.Tween.to(this, { scaleX: 0 }, this.t * 1000, null, Laya.Handler.create(this, this.onBack), this.index * 0.2 * 1000);
        } else {
            Laya.Tween.to(this, { scaleX: 0 }, this.t * 1000, null, Laya.Handler.create(this, this.onBack));
        }
    }

    private onBack() {
        this.pokerBack.visible = false;
        this.pokerFront.visible = true;
        if (this.showData) {
            this.info = this.showData;
            this.showData = null;
        } else {
            this.info = this._info;
        }
        Laya.Tween.to(this, { scaleX: 1 }, this.t * 1000);
    }

} 