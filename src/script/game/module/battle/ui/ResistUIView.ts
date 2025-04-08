import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { DamageNumView } from "../../../battle/view/ui/DamageNumView";
import { BattleNotic } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";

export class ResistUIView extends Laya.Sprite {
    private _side: number;
    private _damageDestX = 0;
    private _damageNum: Laya.Label;
    private _staticText: Laya.Label;
    private _damgeSprite: Laya.Sprite;
    private _exiting = false;
    private _damage = 0;
    constructor(side: number) {
        super();
        this._side = side;
        this.initView();
        this.addEvent();
        side == 2 && (this.pivotX = this.width);
    }

    private initView() {
        this._damgeSprite = new Laya.Sprite();
        this._damgeSprite.autoSize = true;
        this.addChild(this._damgeSprite);
        this._damageNum = new Laya.Label();
        let sstyle = DamageNumView.BattleNumberStyle.Resist;
        this._staticText = DamageNumView.createText(LangManager.Instance.GetTranslation("DamageNum.Resist"), sstyle.size, sstyle.color, sstyle.bold, sstyle.italic, sstyle.stroke, sstyle.strokeColor);
        this._damgeSprite.addChild(this._staticText);
        this._damgeSprite.addChild(this._damageNum);
        this._damageNum.x = this._staticText.width + 4;
    }

    private setTotalDamage(damage: number, side: number) {
        if (this._side != side) return;
        Logger.log("Resist Damge", damage);
        this._damage = damage;
        if (Math.abs(this._damage) <= 10) { return; }
        DamageNumView.resetResistDamages(damage, this._damageNum);
        this._side == 2 && (this._damgeSprite.pivotX = this._damgeSprite.width);
    }


    public show(visible: boolean = true) {
        Logger.log("Resist show", this._damage);
        if (Math.abs(this._damage) <= 10) { return; }
        this.visible = visible;
        this.reset();

        Laya.Tween.from(this._damgeSprite, { alpha: 0, x: this._damageDestX - 100 * (this._side == 1 ? 1 : -1) }, 700, Laya.Ease.linearNone)

        Laya.timer.once(1200, this, this.hide)
    }

    public hide() {
        Laya.Tween.to(this._damgeSprite, { alpha: 0, x: this._damageDestX - 96 * (this._side == 1 ? 1 : -1) }, 400, Laya.Ease.linearNone, Laya.Handler.create(this, this.onExitComplete));
    }

    private onExitComplete() {
        this._exiting = true;

    }

    private reset() {
        // TweenLite.killTweensOf(this._damgeSprite);
        Laya.Tween.clearAll(this._damgeSprite);
        Laya.timer.clearAll(this._damgeSprite)
        this._damgeSprite.alpha = 1;
        this._damgeSprite.x = this._damageDestX;
        this._exiting = false;
    }


    private addEvent() {
        NotificationManager.Instance.addEventListener(BattleNotic.SET_RESIST_TOTAL_DAMAGE, this.setTotalDamage, this);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(BattleNotic.SET_RESIST_TOTAL_DAMAGE, this.setTotalDamage, this);
    }

    public destroy(destroyChild?: boolean): void {
        super.destroy(destroyChild)
        this.removeEvent();
    }
}