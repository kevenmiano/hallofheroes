// @ts-nocheck
import Logger from "../logger/Logger";

const CHAR_A = 'A'.charCodeAt(0);
const CHAR_Z = 'Z'.charCodeAt(0);
const CHAR_e = 'e'.charCodeAt(0);
const CHAR_E = 'E'.charCodeAt(0);
// const CHAR_DOT = '.'.charCodeAt(0);

/**
 * 大数字类, i前缀的方法是会改变自身, 返回自身, 不带i前缀的方法不改变自身, 将返回传入的Num对象或一个新的Num对象
 */
export default class Num {
    public static clsName = 'Num';

    static transfer: { [e: number]: string } = {};
    value: number = 0;
    magnitude: number = 0;

    public getValue(): number {
        return this.value;
    }

    public getMagnitude(): number {
        return this.magnitude;
    }

    constructor(value?: number, magnitude: number = 0) {
        if (value != undefined)
            this.init(value, magnitude);
    }

    private trim() {
        if (this.value >= 10) {
            do {
                this.value *= 0.1;
                this.magnitude++;
            } while (this.value >= 10);
        } else if (this.value > 0 && this.value < 1) {
            do {
                this.value *= 10;
                this.magnitude--;
            } while (this.value < 1);
        } else if (this.value === 0) {
            this.magnitude = 0;
        } else if (this.value < 0 && this.value > -1) {
            do {
                this.value *= 10;
                this.magnitude--;
            } while (this.value > -1);
        } else if (this.value <= -10) {
            do {
                this.value *= 0.1;
                this.magnitude++;
            } while (this.value <= -10);
        }
    }

    init(value: number, magnitude: number = 0) {
        this.value = value;
        this.magnitude = magnitude;
        this.trim();
    }

    setSmall(num: number): Num {
        let str = num.toExponential();
        for (let i = str.length - 1; i >= 0; i--) {
            if (str.charCodeAt(i) === CHAR_e) {
                this.value = parseFloat(str.substring(0, i));
                this.magnitude = parseInt(str.substring(i + 1));
                break;
            }
        }
        return this;
    }

    setBig(num: Num): Num {
        this.value = num.value;
        this.magnitude = num.magnitude;
        return this;
    }

    setNum(num: Num | number): Num {
        if (typeof num === 'number')
            return this.setSmall(num);
        return this.setBig(num);
    }

    //取反
    neg(ret?: Num): Num {
        ret = ret || new Num();
        ret.value = -this.value;
        ret.magnitude = this.magnitude;
        return ret;
    }

    ineg(): Num {
        this.value = -this.value;
        return this;
    }

    //加
    add(num: Num | number, ret?: Num): Num {
        let n: Num;
        if (typeof num === 'number')
            n = tmp.setSmall(num);
        else
            n = num;
        ret = ret || new Num(0);
        let diff = this.magnitude - n.magnitude;
        if (diff > 0) {
            if (diff < 10)
                ret.init(this.value + n.value / (10 ** diff), this.magnitude);
            else
                ret.setBig(this);
        } else {
            if (diff > -10)
                ret.init(n.value + this.value / (10 ** -diff), n.magnitude);
            else
                ret.setBig(n);
        }
        return ret;
    }

    iadd(num: Num | number): Num {
        return this.add(num, this);
    }

    //减
    sub(num: Num | number, ret?: Num): Num {
        let n: Num;
        if (typeof num === 'number')
            n = tmp.setSmall(num);
        else
            n = num;
        ret = ret || new Num(0);
        let diff = this.magnitude - n.magnitude;
        if (diff > 0) {
            if (diff < 10)
                ret.init(this.value - n.value / (10 ** diff), this.magnitude);
            else
                ret.setBig(this);
        } else {
            if (diff > -10)
                ret.init(this.value / (10 ** -diff) - n.value, n.magnitude);
            else
                ret.setBig(n).ineg();
        }
        return ret;
    }

    isub(num: Num | number): Num {
        return this.sub(num, this);
    }

    //乘
    mul(num: Num | number, ret?: Num): Num {
        ret = ret || new Num();
        if (typeof num === 'number')
            ret.init(this.value * num, this.magnitude);
        else
            ret.init(this.value * num.value, this.magnitude + num.magnitude);
        return ret;
    }

    imul(num: Num | number): Num {
        return this.mul(num, this);
    }

    //除
    div(num: Num | number, ret?: Num): Num {
        ret = ret || new Num();
        if (typeof num === 'number')
            ret.init(this.value / num, this.magnitude);
        else
            ret.init(this.value / num.value, this.magnitude - num.magnitude);
        return ret;
    }

    idiv(num: Num | number): Num {
        return this.div(num, this);
    }

    //比较, 结果是一个number, 如结果<0, 则表示<参数, 如结果===0, 则表示===参数, 如结果>0,则表示>参数
    compare(num: Num | number): number {
        let n: Num;
        if (typeof num === 'number')
            n = tmp.setSmall(num);
        else
            n = num;
        if (this.value > 0) {
            if (n.value > 0) {
                let diff = this.magnitude - n.magnitude;
                if (diff === 0)
                    return this.value - n.value;
                return diff;
            }
            return 1;
        } else if (this.value < 0) {
            if (n.value < 0) {
                let diff = n.magnitude - this.magnitude;
                if (diff === 0)
                    return n.value - this.value;
                return diff;
            }
            return -1;
        } else {
            if (n.value > 0)
                return -1;
            if (n.value < 0)
                return 1;
            return 0;
        }
    }

    toString(): string {
        if (this.magnitude < 3) {
            return Math.round(this.value * (10 ** this.magnitude)).toString();
        } else {
            let e = this.magnitude - (this.magnitude % 3);
            let unit: string = Num.transfer[e];
            let value = (this.value * (10 ** (this.magnitude - e))).toString();
            value = value.substr(0, this.magnitude - e === 2 ? 3 : 4);
            return value + unit;
        }
    }

    valueOf(): string {
        return this.value + 'e' + this.magnitude;
    }

    toJSON(): string {
        return '~' + this.valueOf();
    }

    toNumber(): number {
        return Math.round(this.value * (10 ** this.magnitude));
    }

    toNumberPrecise(): number {
        return this.value * (10 ** this.magnitude);
    }

    toFixedNum() {
        let fixValue = Number(this.value.toFixed(2));
        return Math.round(fixValue * (10 ** this.magnitude));
    }

    round(ret?: Num): Num {
        ret = ret || new Num();
        if (this.magnitude < 0) {
            ret.value = Math.round(this.toNumber());
            ret.magnitude = 0;
        } else {
            ret.value = parseFloat(this.value.toFixed(Math.min(10, this.magnitude)));
            ret.magnitude = this.magnitude;
        }
        return ret;
    }

    iround(): Num {
        return this.round(this);
    }

    //由单位制转化, 如12.3, 55.0KK
    static fromString(text: string): Num {
        if (text) {
            let len = text.length;
            let offset = len;
            for (let i = 0; i < len; i++) {
                let char = text.charCodeAt(i);
                if (char >= CHAR_A && char <= CHAR_Z) {
                    offset = i;
                    break;
                }
            }
            if (offset === 0) {
                Logger.error('没有字面值');
                return null;
            } else if (offset === len)
                return new Num(parseInt(text));
            else {
                let value = text.substring(0, offset);
                let unit = text.substring(offset);
                let datas = Num.transfer;
                for (const key in datas) {
                    if (datas[key] === unit) {
                        return new Num(parseInt(value), parseInt(key));
                    }
                }
                Logger.error('找不到单位: ' + unit);
                return null;
            }
        }
        Logger.error('空字符串');
        return null;
    }

    //由科学计数法转化, 如85.2, 12.3e25, 56E-42
    static fromExponent(text: string): Num {
        let ret: Num = new Num();
        for (let i = text.length - 1; i >= 0; i--) {
            let code = text.charCodeAt(i);
            if (code === CHAR_e || code === CHAR_E) {
                ret.value = parseFloat(text.substring(0, i));
                ret.magnitude = parseInt(text.substring(i + 1));
                return ret;
            }
        }
        ret.init(parseFloat(text));
        return ret;
    }

    static readonly ZERO: Num = new Num(0);
}

let tmp: Num = new Num();
