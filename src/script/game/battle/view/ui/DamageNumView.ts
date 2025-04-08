import LangManager from "../../../../core/lang/LangManager";
import { BloodType } from "../../../constant/BattleDefine";
import { BattleManager } from "../../BattleManager";

export class DamageNumView extends Laya.Sprite {

    private _n: number;    //伤害
    private _type: number;// 伤害类型   1 普通伤害  2 暴击伤害
    private _isAdd: boolean;//回复血量
    private add: boolean = true;
    private tmp: number = 0;
    private _selfCause: boolean;//是否自己造成的伤害
    private _isParry: boolean;//格挡
    private _isCitical: boolean = false;//暴击
    private _isFire: boolean;//火种

    private destinationX = 0;
    private destinationY = 0;

    private brightness = 0;
    /**大数 缩减**/
    private bigNumber = 100000;

    constructor(n: number, type: number = 1, crit = false, isadd: boolean = false, selfCause: boolean = false, parry: boolean = false, fire: boolean = false) {
        super();
        this._n = n;
        this._type = type;
        this._isAdd = isadd;
        this._selfCause = selfCause;
        this._isParry = parry;
        this._isFire = fire;
        this._isCitical = crit;
        this.autoSize = true;
        if (this._isCitical) BattleManager.criticalNum++;
        this.initView();
        this.pivotX = this.width >> 1;
        this.pivotY = this.height >> 1;
        // this.on(Laya.Event.ADDED, this, this.addToStage);        
    }

    private initView() {
        let textList = this.createTextView();
        let labX = 0;

        for (let lab of textList) {
            lab.x = labX;
            //加宽4像素,避免斜体重叠
            labX += lab.width + 4;
            this.addChild(lab);
        }
        //居中
        let cy = this.height >> 1;
        for (let lab of textList) {
            lab.y = cy - lab.height >> 1;
        }
    }

    public addToStage() {
        // this.off(Laya.Event.ADDED, this, this.addToStage);
        this.destinationX = this.x;
        this.destinationY = this.y;

        if (this._isCitical) {
            this.scaleX = 1.8;
            this.scaleY = 1.8;
            this.alpha = 0.8;

            //scale
            // let scaleTimeline = new TimelineMax();
            // scaleTimeline.to(this, 0.167, { scaleX: 0.9, scaleY: 0.9, ease: Quad.easeIn })
            //     .to(this, 0.333 - 0.167, { scaleX: 1, scaleY: 1, ease: Quad.easeOut });

            Laya.Tween.to(this, { scaleX: 0.9, scaleY: 0.9 }, 167, Laya.Ease.quadIn)
                .to(this, { scaleX: 1, scaleY: 1 }, 333 - 167, Laya.Ease.quadOut)
            //透明度
            // let alphaTimeline = new TimelineMax();
            // alphaTimeline.to(this, 0.167, { alpha: 1, ease: Quad.easeOut })
            //     .to(this, 1 - 0.167, { alpha: 0.4, ease: Linear.easeNone });

            Laya.Tween.to(this, { alpha: 1 }, 167, Laya.Ease.quadOut)
                .to(this, { alpha: 0.4, ease: Linear.easeNone }, 1000 - 167, Laya.Ease.linearNone)

            //ColorFilter
            this.brightness = 0.37
            let layaColor = new Laya.ColorFilter();
            layaColor.adjustBrightness(this.brightness);
            this.filters = [layaColor];
            // TweenMax.to(this, 0.167, {
            //     ease: Quad.easeOut,
            //     brightness: 0, onUpdate: () => {
            //         layaColor.adjustBrightness(this.brightness)
            //         this.filters = [layaColor];
            //     }
            // });

            // TweenMax.to(this, 1 - 0.167, { y: this.y - 120, ease: Linear.easeNone, onComplete: this.playEnd.bind(this), delay: 0.167 });
            Laya.Tween.to(this, { y: this.y - 180 }, 1000, Laya.Ease.linearNone, Laya.Handler.create(this, this.playEnd), 360);

            //震动
            Laya.timer.frameLoop(1, this, this.tickShake);
            //震动停止 0.3 持续时间
            // TweenMax.delayedCall(0.35, this.stopShake.bind(this));
            Laya.timer.once(350, this, this.stopShake);

        } else {
            Laya.Tween.to(this, { y: this.y - 180 }, 1200, Laya.Ease.linearNone, Laya.Handler.create(this, this.playEnd));
            // TweenMax.to(this, 1.2, { y: this.y - 180, ease: Linear.easeNone, onComplete: this.playEnd.bind(this) });
            // TweenMax.to(this, 1, { alpha: 0.4, ease: Linear.easeNone, delay: 0.2 });
            Laya.Tween.to(this, { alpha: 0.4 }, 1000, Laya.Ease.linearNone, null, 200);
        }
    }

    private playEnd() {
        if (this._isCitical) {
            BattleManager.criticalNum--;
            this._isCitical = false;
        }
        this.removeSelf();
        this.dispose();
    }

    //震动 
    private tickShake() {
        //震动幅度
        let dis = 0;//5  取消暴击抖动
        this.x = this.destinationX + (-dis + Math.random() * dis * 2);
        this.y = this.destinationY + (-dis + Math.random() * dis * 2);
    }

    private stopShake() {
        Laya.timer.clear(this, this.tickShake);
    }

    private createTextView() {
        let textList: Laya.Label[] = [];
        let tempStyle: { size: number, color: string, bold: boolean, italic: boolean, stroke: number, strokeColor: string };

        let showTxt = this._n + "";

        if (this._n >= this.bigNumber) {
            showTxt = ~~(this._n / 1000) + "K";
        }

        let cirtStyle = DamageNumView.BattleNumberStyle.Critical;
        let parryStyle = DamageNumView.BattleNumberStyle.Parry;
        //回血治疗
        if (this._isAdd) {
            tempStyle = DamageNumView.BattleNumberStyle.Green;
            textList.push(DamageNumView.createText(showTxt, tempStyle.size, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor));
            return textList;
        }

        //护盾
        if (this._type == BloodType.BLOOD_TYPE_ARMY) {
            tempStyle = this._n > 0 ? DamageNumView.BattleNumberStyle.ShieldAdd : DamageNumView.BattleNumberStyle.ShieldSub;
            showTxt = Math.abs(this._n) + "";
            if (Math.abs(this._n) >= this.bigNumber) {
                showTxt = ~~(Math.abs(this._n) / 1000) + "K";
            }
            textList.push(DamageNumView.createText(showTxt, tempStyle.size, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor));
            textList.push(DamageNumView.createText(LangManager.Instance.GetTranslation(this._n > 0 ? "DamageNum.ShieldAdd" : "DamageNum.ShieldSub"), this._n > 0 ? 36 : 30, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor));

            if (this._n > 0) return textList;
            //护盾吸收 格挡
            if (this._isParry)
                textList.push(DamageNumView.createText(LangManager.Instance.GetTranslation("DamageNum.Parry"), 30, parryStyle.color, tempStyle.bold, tempStyle.italic, parryStyle.stroke, parryStyle.strokeColor));

            //护盾吸收 暴击,护盾+格挡+暴击 的时候不需要暴击。
            if (this._isCitical && !this._isParry)
                textList.push(DamageNumView.createText(LangManager.Instance.GetTranslation("DamageNum.Crit"), 30, cirtStyle.color, tempStyle.bold, tempStyle.italic, cirtStyle.stroke, cirtStyle.strokeColor));
            return textList;
        }

        //暴击伤害
        if (this._isCitical) {
            //格挡+暴击 显示格挡后的 伤害数值+“格挡”（蓝色）+“暴击”（红色）
            if (this._isParry) {
                tempStyle = DamageNumView.BattleNumberStyle.Parry;
                textList.push(DamageNumView.createText(showTxt, tempStyle.size, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor));
                textList.push(DamageNumView.createText(LangManager.Instance.GetTranslation("DamageNum.Parry"), 36, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor));
                textList.push(DamageNumView.createText(LangManager.Instance.GetTranslation("DamageNum.Crit"), 36, cirtStyle.color, tempStyle.bold, tempStyle.italic, cirtStyle.stroke, cirtStyle.strokeColor));
            } else {
                tempStyle = cirtStyle;
                let dlb = DamageNumView.createText(showTxt, tempStyle.size, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor)
                //暴击数字 和 暴击 大小不一, 造成重叠, 加宽一点
                // dlb.width += 4;
                textList.push(dlb);
                let bjb = DamageNumView.createText(LangManager.Instance.GetTranslation("DamageNum.Crit"), 76, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor);
                //居中
                // bjb.y = (dlb.height - bjb.height) >> 1;
                textList.push(bjb);
            }

            return textList;
        }

        //普通伤害
        if (!this._isCitical) {
            if (this._selfCause) {
                if (this._isParry) {
                    tempStyle = DamageNumView.BattleNumberStyle.Parry;
                    textList.push(DamageNumView.createText(LangManager.Instance.GetTranslation("DamageNum.Parry"), 36, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor));
                } else {
                    tempStyle = DamageNumView.BattleNumberStyle.SelfCause;
                }

            } else {
                if (this._isParry) {
                    tempStyle = DamageNumView.BattleNumberStyle.Parry;
                    textList.push(DamageNumView.createText(LangManager.Instance.GetTranslation("DamageNum.Parry"), 36, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor));
                } else {
                    tempStyle = DamageNumView.BattleNumberStyle.Damage;
                }
            }

            textList.unshift(DamageNumView.createText(showTxt, tempStyle.size, tempStyle.color, tempStyle.bold, tempStyle.italic, tempStyle.stroke, tempStyle.strokeColor));
            return textList;
        }
    }

    public dispose() {
        TweenMax.killTweensOf(this);
        this.stopShake();
    }

    public static createText(txt: string, size: number, color: string, bold = false, italic = false, stroke = 0, strokeColor = "", newLab?: Laya.Label) {
        let text: Laya.Label;
        newLab ? text = newLab : text = new Laya.Label();
        text.text = txt;
        text.fontSize = size;
        text.color = color;
        text.bold = bold
        text.italic = italic
        text.stroke = stroke;
        text.strokeColor = strokeColor;
        text.autoSize = true;
        return text;
    }

    //减抗加成  抗性减伤 文字 25%/50% 分三档
    public static resetResistDamages(damage: number, lab?: Laya.Label) {
        let styleS = damage > 0 ? "ResistAdd" : "ResistSub";
        let level = 2;
        //减伤的时候为负数
        if (Math.abs(damage) <= 25) {
            level = 1;
        }
        if (Math.abs(damage) >= 50) {
            level = 3;
        }
        let style = DamageNumView.BattleNumberStyle[styleS + level];
        //负数自带-号, 不需要加-号。
        let dlb = DamageNumView.createText((damage > 0 ? "+" : "") + damage + "%", style.size, style.color, style.bold, style.italic, style.stroke, style.strokeColor, lab);
        return dlb;
    }


    //战斗字体样式
    public static BattleNumberStyle = {
        Critical: {
            size: 110,
            color: "#FF4646",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#550000"
        },
        Damage: {
            size: 56,
            color: "#E3E513",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#7D5F05"
        },
        Green: {
            size: 56,
            color: "#52ED3D",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#016A00"
        },
        Parry: {
            size: 56,
            color: "#00E4FF",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#004055"
        },
        Resist: {
            size: 38,
            color: "#FFECC6",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#5E3C00"
        },
        ResistAdd1: {
            size: 38,
            color: "#47FF90",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#009900"
        },
        ResistAdd2: {
            size: 38,
            color: "#09FF50",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#009900"
        },
        ResistAdd3: {
            size: 38,
            color: "#00DB00",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#004500"
        },
        ResistSub1: {
            size: 38,
            color: "#FF7462",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#C51613"
        },
        ResistSub2: {
            size: 38,
            color: "#FF473E",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#940B09"
        },
        ResistSub3: {
            size: 38,
            color: "#FF1818",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#630000"
        },
        SelfCause: {
            size: 56,
            color: "#E78F39",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#7C3108"
        },
        ShieldAdd: {
            size: 56,
            color: "#FFFFFF",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#5E3C00"
        },
        ShieldSub: {
            size: 46,
            color: "#FFFFFF",
            bold: true,
            italic: true,
            stroke: 8,
            strokeColor: "#5E3C00"
        }

    }

}
