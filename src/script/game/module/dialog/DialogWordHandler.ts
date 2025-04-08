import Logger from "../../../core/logger/Logger";
import GTabIndex from "../../constant/GTabIndex";

/**
* @author:pzlricky
* @data: 2021-06-01 11:24
* @description 人物对白的文字显示控制类。
*/
export default class DialogWordHandler {

    /**
     * 文字显示完成后的回调函数. 
     */
    private _speakEnd: Function;

    /**
     * 要控制的文本 
     */
    private _textfield: fgui.GRichTextField;
    private _completed: boolean = false;

    private _contentString: string = "";
    private _contents: Array<string> = [];
    private _userName: string = '';

    private _bbaa = "";
    private _charsInfo: Array<{ c: string, i: number }>;

    constructor(textfield: fgui.GRichTextField, userName: string, content: string = '', speakEnd: Function) {
        this._textfield = textfield;
        this._speakEnd = speakEnd;
        this._userName = userName;
        // content = "Elise returned to the Imperial Temple to tell them of Viscount Remus, but she has already sent a message back. Apparently a large rift, the [font]&nbsp;[color=#ef0101][b]Bretheran Abyss[/b][/font][/color]&nbsp;has opened not far from here."
        content = this.addColorSpace(content);
        this._contentString = content;
        //英文情况下,标签的字母, 和剧情文字
        // let charArr = content.replace(/\<.+?\/?>|\[.+?\/?]/gi, '').split('');
        // let tempStrArr = [content];
        // for (let i = charArr.length; i > 1; i--) {
        //     let curStr = tempStrArr[charArr.length - i];
        //     
        //     let lastIdx = curStr.lastIndexOf(charArr[i - 1]);
        //     let prevStr = curStr.slice(0, lastIdx);
        //     let nextStr = curStr.slice(lastIdx + 1, curStr.length);
        //     tempStrArr.push(prevStr + nextStr);
        // }

        this._textfield.text = this._userName;
        // Logger.log(tempStrArr)
        this._contents = this.parseDialogs(content);
    }


    /**
     * 开始显示文字。 
     */
    public start() {
        this._textfield.alpha = 0;
        Laya.Tween.to(this._textfield, { alpha: 1 }, 0.25, undefined, Laya.Handler.create(this, this.speakStart));
    }

    private speakStart() {
        Laya.timer.loop(50, this, this.onSpaceTyper);
    }

    private onSpaceTyper() {
        if (this._contents.length > 0) {
            this._textfield.text = this._userName + this._contents.pop();
        } else {
            Laya.timer.clear(this, this.onSpaceTyper);
            this.speakComplete();
        }
    }

    public canStop(): boolean {
        if (this._textfield && !this._completed) {
            Laya.Tween.clearAll(this._textfield)
            this.speakComplete();
            return true;
        } else {
            return false;
        }
    }

    /**
     * 说话完成的处理函数
     */
    private speakComplete() {
        if (!this._completed) {
            Laya.timer.clear(this, this.onSpaceTyper);
            this._textfield.text = this._userName + this._contentString;
            if (this._speakEnd != null)
                this._speakEnd();
            this._completed = true;
        }
    }

    /***********先把所有标签拼接起来, charInfo记录每个内容字符的原来位置, 再把字符插入进标签里*****************/
    private parseDialogs(str: string) {
        this._bbaa = ""
        this._charsInfo = [];
        let i = 0;
        let length = str.length;
        let ti = 0;
        while (i < length) {
            //标签外的内容
            while (str[i] != "[" && i < length) {
                ti = this.checkSpace(str, i)
                //有nbsp;空格
                if (ti != i) {
                    i = ti;
                    continue
                }

                this._charsInfo.push({ c: str[i], i: i })
                i++;
            }

            //标签
            i = this.parse(str, i);
        }

        let contents: string[] = [];
        let info: { c: string, i: number };
        while (info = this._charsInfo.shift()) {
            this._bbaa = this._bbaa.slice(0, info.i) + info.c + this._bbaa.slice(info.i)
            contents.unshift(this._bbaa);
        }
        return contents;
    }

    private parse(str: string, starIndex = 0) {
        let i = starIndex, length = str.length;
        if (str[i] != "[") return i;

        //标签头
        while (str[++i] != "]" && i < length) {
        }
        i++;
        let headStr = str.substring(starIndex, i);

        this._bbaa += headStr;


        //嵌套标签
        if (str[i] == "[") {
            i = this.parse(str, i);
        }


        //标签内容
        let temp = i;
        let ti = 0;
        while (str[i] != '[' && i < length) {
            ti = this.checkSpace(str, i)
            //有nbsp;空格
            if (ti != i) {
                i = ti;
                continue
            }
            this._charsInfo.push({ c: str[i], i: i })
            i++;
        }


        //标签尾
        temp = i;
        while (str[i++] != "]" && i < length) {
        }
        let endStr = str.substring(temp, i);
        this._bbaa += endStr;

        return i;
    }

    private checkSpace(str: string, startIndex: number) {
        let s = str.substring(startIndex, startIndex + 6)
        if (s == "&nbsp;") {
            startIndex += 6
            this._bbaa += s;
        }
        return startIndex;
    }


    private addColorSpace(str: string) {
        let findIndex = 0;
        while ((findIndex = str.indexOf("[color", findIndex)) >= 0) {
            str = this.insertStr(str, findIndex, "&nbsp;")
            findIndex += 6 + 6;
        }
        findIndex = 0;
        while ((findIndex = str.indexOf("[/color] ", findIndex)) >= 0) {
            str = this.insertStr(str, findIndex, "&nbsp;")
            findIndex += 9 + 6;
        }

        return str;
    }

    private insertStr(source: string, start: number, inser: string) {
        return source.slice(0, start) + inser + source.slice(start);
    }

    public dispose() {
        this._speakEnd = null;
        this._completed = true;
        this._contents = [];
        if (this._textfield)
            Laya.Tween.clearAll(this._textfield)
    }


}