import LangManager from '../lang/LangManager';
/**
 * 我们目前所用的K、M、G、T等都是英文表示方法, 分别是Kilo（103）、Mega（106）、Giga（109）、Tera（1012）的简写, 
 * 更大的还有Peta（1015）、Exa（1018）、Bronto（1021）等。
 */
let moneyNum: number[] = [1000000000000000000000, 1000000000000000000, 1000000000000000, 1000000000000, 1000000000, 1000000, 1000, 1];
let moneyText: string[] = ['b', 'e', 'p', 't', 'g', 'm', 'k', ''];
export default class StringHelper {

    static replaceOpt(str: string, opt?) {
        if (str) {
            if (str.indexOf('\\') >= 0) {
                str = str.replace(/\\n/g, '\n');
            }
            if (opt) {
                for (let key in opt) {
                    // let option:LangOption = opt[key];
                    let value = opt[key];
                    // if(option.getType() == LangOptionType.LANG_ID){
                    //     value = this.data.getValue(value);
                    // }
                    // Logger.log(' key ',key,' value ',value)
                    str = str.replace("%{" + key + "}", value);
                    // Logger.log(' str ',str)
                }
            }
        }
        return str;
    }

    public static _leftReg: RegExp = /</g;
    public static _rightReg: RegExp = />/g;
    public static rePlaceHtmlTextField(s: string): string {
        s = s.replace(StringHelper._leftReg, "&lt;");
        s = s.replace(StringHelper._rightReg, "&gt;");
        return s;
    }


    private static htmlTags: Array<string> = [
        "size", "color", "b", "font", "i", "a"
    ]

    private static removeByValue(arr, val) {
        while (arr.indexOf(val) != -1) {
            let index = arr.indexOf(val);
            arr.splice(index, 1);
        }
    }

    /**将HTML文本替换成Fgui富文本内容,需先设置FGUI富文本UBB语法支持 */
    public static removeHtmlTag(s: string): string {
        let matchTags = s.match(this.matchHTMLReg);
        if (!matchTags)
            return s;
        //去除不用替换标签  noReplaceTag
        let noReplaceTag = ["<br>"];
        for (const key in noReplaceTag) {
            if (Object.prototype.hasOwnProperty.call(noReplaceTag, key)) {
                let tag = noReplaceTag[key];
                this.removeByValue(matchTags, tag);
            }
        }

        let tagElement = "";
        for (let index = 0; index < matchTags.length; index++) {
            tagElement = matchTags[index];
            s = s.replace(tagElement, "");
        }
        return s;
    }

    private static replaceTag = /[a-zA-Z]+=?('|")?#?[a-zA-Z0-9]+("|')?/gi;
    private static matchHTMLReg = /\<.+?\/?>|\[.+?\/?]/gi;//匹配所有HTML格式内容
    private static matchHTMLSingleReg = /[a-zA-Z0-9]+/gi;//结束标签/
    public static _dotReg: RegExp = /'/g;
    private static noReplaceTag: string[] = ["<br>"];
    /**将HTML文本替换成Fgui富文本内容,需先设置FGUI富文本UBB语法支持 */
    public static repHtmlTextToFguiText(s: string): string {
        let matchTags = s.match(this.matchHTMLReg);
        if (!matchTags)
            return s;
        //去除不用替换标签  noReplaceTag
        for (const key in this.noReplaceTag) {
            if (Object.prototype.hasOwnProperty.call(this.noReplaceTag, key)) {
                let tag = this.noReplaceTag[key];
                this.removeByValue(matchTags, tag);
            }
        }

        for (let index = 0; index < matchTags.length; index++) {
            let beginElement = matchTags[index];//当前第一个
            let lastElement = null;
            if (beginElement.indexOf('textformat') != -1 || beginElement.indexOf('font') != -1) {
                lastElement = matchTags[matchTags.length - index - 1];//最后一个对应匹配
            } else {
                lastElement = matchTags[index + 1];//当前下一个对应匹配
                index += 1;
            }
            let matchTagsReplace = beginElement.match(this.replaceTag);
            let matchSingleTagsReplace = beginElement.match(this.matchHTMLSingleReg);
            let replaceBeginText = "";
            let replaceLastText = "";
            let replaceTags = [];
            if (matchTagsReplace) {
                for (const matchkey in matchTagsReplace) {
                    if (Object.prototype.hasOwnProperty.call(matchTagsReplace, matchkey)) {
                        let matchkeyElement = matchTagsReplace[matchkey];
                        let matchkeyTag = matchkeyElement.split('=')[0];
                        let matchKeyValue = matchkeyElement.split('=')[1];
                        if (this.htmlTags.indexOf(matchkeyTag) != -1) {
                            if (matchKeyValue)
                                matchKeyValue = matchKeyValue.replace(StringHelper._dotReg, "");
                            replaceTags[matchkeyTag] = matchKeyValue;
                        }
                    }
                }
            } else if (matchSingleTagsReplace) {
                for (const matchSinglekey in matchSingleTagsReplace) {
                    if (Object.prototype.hasOwnProperty.call(matchSingleTagsReplace, matchSinglekey)) {//单一标签
                        let matchSingleElement = matchSingleTagsReplace[matchSinglekey];
                        if (this.htmlTags.indexOf(matchSingleElement) != -1) {
                            replaceTags[matchSingleElement] = null;
                        }
                    }
                }
            }

            for (const key in replaceTags) {
                if (Object.prototype.hasOwnProperty.call(replaceTags, key)) {
                    let value = replaceTags[key];
                    if (this.htmlTags.indexOf(key) < 0) continue;
                    if (value) {
                        replaceBeginText += '[' + key + '=' + value + "]";
                    } else {
                        replaceBeginText += '[' + key + "]";
                    }
                    replaceLastText += '[/' + key + "]";
                }
            }
            if (this.noReplaceTag.indexOf(beginElement) == -1) {
                s = s.replace(beginElement, replaceBeginText);
            }
            if (this.noReplaceTag.indexOf(lastElement) == -1) {
                s = s.replace(lastElement, replaceLastText);
            }

        }
        return s;
    }

    /**
     * 解析公告内容
     * @param str 公告内容
     * @returns 
     */
    public static parseAncText(s: string): string {
        let matchTags = s.match(this.matchHTMLReg);
        if (!matchTags)
            return s;
        //去除不用替换标签  noReplaceTag
        for (const key in this.noReplaceTag) {
            if (Object.prototype.hasOwnProperty.call(this.noReplaceTag, key)) {
                let tag = this.noReplaceTag[key];
                this.removeByValue(matchTags, tag);
            }
        }

        for (let index = 0; index < matchTags.length; index++) {
            let beginElement = matchTags[index];//当前第一个
            let lastElement = null;
            let matchTagsReplace = beginElement.match(this.replaceTag);
            let matchSingleTagsReplace = beginElement.match(this.matchHTMLSingleReg);
            let replaceBeginText = "";
            let replaceLastText = "";
            let replaceTags = [];
            if (matchTagsReplace) {
                for (const matchkey in matchTagsReplace) {
                    if (Object.prototype.hasOwnProperty.call(matchTagsReplace, matchkey)) {
                        let matchkeyElement = matchTagsReplace[matchkey];
                        let matchkeyTag = matchkeyElement.split('=')[0];
                        let matchKeyValue = matchkeyElement.split('=')[1];
                        if (this.htmlTags.indexOf(matchkeyTag.toLowerCase()) != -1) {
                            if (matchKeyValue) {
                                matchKeyValue = matchKeyValue.replace(/"/g, "");
                                matchKeyValue = matchKeyValue.replace(StringHelper._dotReg, "");
                            }
                            if (matchkeyTag != "FONT")
                                replaceTags[matchkeyTag] = matchKeyValue;
                            if (Number(matchkey) == 0) {
                                //起始符号
                                lastElement = '</' + matchkeyElement + '>';
                                if (matchkeyTag == "FONT") {
                                    replaceLastText += "[/COLOR][/SIZE]";
                                } else {
                                    replaceLastText += '[/' + matchkeyTag + "]";
                                }
                            }
                        }
                    }
                }
            } else if (matchSingleTagsReplace) {
                for (const matchSinglekey in matchSingleTagsReplace) {
                    if (Object.prototype.hasOwnProperty.call(matchSingleTagsReplace, matchSinglekey)) {//单一标签
                        let matchSingleElement = matchSingleTagsReplace[matchSinglekey];
                        if (this.htmlTags.indexOf(matchSingleElement.toLowerCase()) != -1) {
                            replaceTags[matchSingleElement] = null;
                            if (Number(matchSinglekey) == 0) {
                                //起始符号
                                lastElement = '</' + matchSingleElement + '>';
                                if (matchSinglekey == "FONT") {
                                    replaceLastText += "[/COLOR][/SIZE]";
                                } else {
                                    replaceLastText += '[/' + matchSingleElement + "]";
                                }
                            }
                        }
                    }
                }
            }

            for (const key in replaceTags) {
                if (Object.prototype.hasOwnProperty.call(replaceTags, key)) {
                    let value = replaceTags[key];
                    if (this.htmlTags.indexOf(key.toLowerCase()) < 0) continue;
                    if (value) {
                        replaceBeginText += '[' + key + '=' + value + "]";
                    } else {
                        replaceBeginText += '[' + key + "]";
                    }
                }
            }
            if (beginElement && beginElement.indexOf('<A HREF=') != -1) {
                let temp = beginElement;
                beginElement = beginElement.replace(/"/g, "");
                s = s.replace(temp, beginElement);
                s = s.replace('<A HREF', "[URL");
                s = s.replace('>', "]");
                s = s.replace('TARGET=_blank', "");
            }
            if (this.noReplaceTag.indexOf(beginElement) == -1) {
                s = s.replace(beginElement, replaceBeginText);
            }

            if (s && s.indexOf('</A>') != -1) {
                s = s.replace('</A>', "[/URL]");
            }
            if (this.noReplaceTag.indexOf(lastElement) == -1) {
                s = s.replace(lastElement, replaceLastText);
            }
            if (s && s.indexOf('<ITALIC>') != -1) {
                s = s.replace('<ITALIC>', '[I]');
            }
            if (s && s.indexOf('</ITALIC>') != -1) {
                s = s.replace('</ITALIC>', '[/I]');
            }
        }
        return s;
    }

    /**
     * 移除掉简单HTML标签 (利用TextField)
     * @param str HTML字符串
     * @return 
     * 移除HTML标签后的字符串
     */
    public static removeHtmlTagByTextField(str: string): string {
        if (StringHelper.isNullOrEmpty(str))
            return "";
        var txt: Laya.Text = new Laya.Text();
        txt.text = str;

        return txt.text;
    }

    /**
     * 获取最后一个字符串
     * @param str
     * @param tag
     */
    static laststring(str: string, tag: string) {
        let index: number = str.indexOf(tag);
        if (index >= 0) {
            let list = str.split(tag);
            return list[list.length - 1]
        }
        return str;
    }

    /**
     *
     * @param num
     */
    static getShortStr(num: number, len: number = 100): string {
        let i = moneyNum.length - 1;
        let money = 0;
        for (let index = 0; index < moneyNum.length; index++) {
            let element = moneyNum[index];
            if (num >= element) {
                i = index;
                money = Math.floor(num * len / element);
                break;
            }

        }
        let tail = moneyText[i];
        return (money / len) + tail;
    }

    private static blankSpaceType: Array<number> = [9, 32, 61656, 59349, 59350, 59351, 59352, 59353, 59354, 59355, 59355, 59356, 59357, 59358, 59359, 59360, 59361, 59362, 59363, 59364, 59365];
    public static trimAll(str: string): string {
        var s: string = StringHelper.trim(str);

        var newStr: string = "";
        for (var i: number = 0; i < s.length; i++) {
            if (StringHelper.blankSpaceType.indexOf(s.charCodeAt(i)) <= -1) {
                newStr += s.charAt(i);
            }
        }
        return newStr;
    }


    public static urlencodeGB2312(str: string): string {
        var result: string = "";
        //TODO  需要倒入ByteArray
        // var byte: ByteArray = new ByteArray();
        // byte.writeMultiByte(str, "gb2312");
        // for (var i: number; i < byte.length; i++) {
        //     result += escape(String.fromCharCode(byte[i]));
        // }
        return result;
    }

    //忽略大小字母比较字符是否相等;
    public static equalsIgnoreCase(char1: string, char2: string): boolean {
        return char1.toLowerCase() == char2.toLowerCase();
    }

    //比较字符是否相等;
    public static equals(char1: string, char2: string): boolean {
        return char1 == char2;
    }

    //是否为Email地址;
    public static isEmail(char: string): boolean {
        if (char == null) {
            return false;
        }
        char = StringHelper.trim(char);
        var pattern: RegExp = /(\w|[_.\-])+@((\w|-)+\.)+\w{2,4}/;
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    //是否是数值字符串;
    public static isNumber(char: string): boolean {
        if (char == null) {
            return false;
        }
        return !isNaN(Number(char));
    }

    //是否为Double型数据;
    public static isDouble(char: string): boolean {
        char = StringHelper.trim(char);
        var pattern: RegExp = /^[-\+]?\d+(\.\d+)?$/;
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    //Integer;
    public static isInteger(char: string): boolean {
        if (char == null) {
            return false;
        }
        char = StringHelper.trim(char);
        var pattern: RegExp = /^[-\+]?\d+$/;
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    //English;
    public static isEnglish(char: string): boolean {
        if (char == null) {
            return false;
        }
        char = StringHelper.trim(char);
        var pattern: RegExp = /^[A-Za-z]+$/;
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    //中文;
    public static isChinese(char: string): boolean {
        if (char == null) {
            return false;
        }
        char = StringHelper.trim(char);
        var pattern: RegExp = /^[\u0391-\uFFE5]+$/;
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    //双字节
    public static isDoubleChar(char: string): boolean {
        if (char == null) {
            return false;
        }
        char = StringHelper.trim(char);
        var pattern: RegExp = /^[^\x00-\xff]+$/;
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    //含有中文字符
    public static hasChineseChar(char: string): boolean {
        if (char == null) {
            return false;
        }
        char = StringHelper.trim(char);
        var pattern: RegExp = /[^\x00-\xff]/;
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    //注册字符;
    public static hasAccountChar(char: string, len: number = 15): boolean {
        if (char == null) {
            return false;
        }
        if (len < 10) {
            len = 15;
        }
        char = StringHelper.trim(char);
        var pattern: RegExp = new RegExp("^[a-zA-Z0-9][a-zA-Z0-9_-]{0," + len + "}$", "");
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    //URL地址;
    public static isURL(char: string): boolean {
        if (char == null) {
            return false;
        }
        char = StringHelper.trim(char).toLowerCase();
        var pattern: RegExp = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
        var result: Object = pattern.exec(char);
        if (result == null) {
            return false;
        }
        return true;
    }

    // 是否为空白;		
    public static isWhitespace(char: string): boolean {
        switch (char) {
            case " ":
            case "\t":
            case "\r":
            case "\n":
            case "\f":
                return true;
            default:
                return false;
        }
    }

    //去左右空格;
    public static trim(char: string): string {
        if (char == null) {
            return null;
        }
        return StringHelper.rtrim(StringHelper.ltrim(char));
    }

    public static swords:string = "~!@#$%^&*()<>'_+-={}[]:|;'\?,./~！@#￥%……&*（）:“|《》？{}——+-=·【】；‘、。、,"
    public static trimWords(char: string = ""): string {
        if (char == null) {
            return null;
        }
        let count = char.length;
        let sStr = char;
        for (let index = 0; index < count; index++) {
            const element = char.charAt(index);
            if (StringHelper.swords.indexOf(element) > -1) { //含有标点符号 返回
                sStr = sStr.replace(element, "");
            } 
        }
        // var pattern: RegExp = /\s|&*/g;
        return sStr;
    }

    //去左空格; 
    public static ltrim(char: string): string {
        if (char == null) {
            return null;
        }
        var pattern: RegExp = /^\s*/;
        return char.replace(pattern, "");
    }

    //去右空格;
    public static rtrim(char: string): string {
        if (char == null) {
            return null;
        }
        var pattern: RegExp = /\s*$/;
        return char.replace(pattern, "");
    }

    //是否为前缀字符串;
    public static beginsWith(char: string, prefix: string): boolean {
        return (prefix == char.substring(0, prefix.length));
    }

    //是否为后缀字符串;
    public static endsWith(char: string, suffix: string): boolean {
        return (suffix == char.substring(char.length - suffix.length));
    }

    //去除指定字符串;
    public static remove(char: string, remove: string): string {
        return StringHelper.replace(char, remove, "");
    }

    //字符串替换;
    public static replace(char: string, replace: string, replaceWith: string): string {
        return char.split(replace).join(replaceWith);
    }

    //utf16转utf8编码;
    public static utf16to8(char: string): string {
        var out: Array<string> = [];
        var len: number = char.length;
        for (var i: number = 0; i < len; i++) {
            var c: number = char.charCodeAt(i);
            if (c >= 0x0001 && c <= 0x007F) {
                out[i] = char.charAt(i);
            }
            else if (c > 0x07FF) {
                out[i] = String.fromCharCode(0xE0 | ((c >> 12) & 0x0F),
                    0x80 | ((c >> 6) & 0x3F),
                    0x80 | ((c >> 0) & 0x3F));
            }
            else {
                out[i] = String.fromCharCode(0xC0 | ((c >> 6) & 0x1F),
                    0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out.join('');
    }

    //utf8转utf16编码;
    public static utf8to16(char: string): string {
        var out: Array<string> = [];
        var len: number = char.length;
        var i: number = 0;
        var char2: number, char3: number;
        while (i < len) {
            var c: number = char.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out[out.length] = char.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = char.charCodeAt(i++);
                    out[out.length] = String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = char.charCodeAt(i++);
                    char3 = char.charCodeAt(i++);
                    out[out.length] = String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out.join('');
    }

    public static isNullOrEmpty(str: string): boolean {
        return str == null || str == "" || str + "" == "undefined";
    }

    /**
     * 数字字符串补0
     * @param num
     * @param n
     */
    public static pad(num: string, n: number) {
        let len = num.length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;

        // return Array(n>num?(n-(''+num).length+1):0).join("0")+num;
    }

    /**
     * replace sourceWords to targetWords
     * @param str
     * @param sourceWord
     * @param targetWord
     * @return
     *
     */
    public static replaceStr(str: string, sourceWord: string, targetWord: string): string {
        if (!str) {
            return "";
        }
        return str.split(sourceWord).join(targetWord);
    }

    /**
     * 确定两个指定点之间的点。
     * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。参数 f 的值越接近 1.0, 则内插点就越接近第一个点（参数 pt1）。
     * 参数 f 的值越接近 0, 则内插点就越接近第二个点（参数 pt2）。
     * @param pt1 第一个点。
     * @param pt2 第二个点。
     * @param f 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1, 则返回 pt1；如果 f=0, 则返回 pt2。
     */
    public static interpolate(pt1: Laya.Point, pt2: Laya.Point, f: number): Laya.Point {
        var f1: number = 1 - f;
        return new Laya.Point(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
    }

    /**
     * 获取字符串中两个符号之间的子字符串
     * @param char1  符号1
     * @param char2  符号2
     * @param str  目标字符串
     * @return
     */
    public static getSubStrBetweenTwoChar(char1: string, char2: string, str: string): string {
        if (str == null || str == "") {
            return "";
        }
        var startPos: number = str.indexOf(char1);
        var endPos: number = str.indexOf(char2);
        if (startPos == -1 || endPos == -1) {
            return "";
        }
        return str.substring(startPos + char1.length, endPos);
    }

    /**
     * 获取文本长度的内容
     * @param text 文本
     * @param count 文本长度
     */
    public static getStringCountValue(text: string, count: number): string {
        if (!text) return "";
        let textlength = this.getStringLength(text);
        if (textlength < count) return text;
        let len: number = 0;
        let retTxt = "";
        for (let i: number = 0; i < text.length; i++) {
            let a: string = text.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
            if (len >= count) {
                break;
            }
            retTxt += a;
        }
        return retTxt;
    }

    /**
     * @param str
     * @param args
     * @return
     * 返回格式化后的字符串
     */
    public static format(str: string, ...args): string {
        if (args == null || args.length <= 0) {
            return str;
        }

        for (let i: number = 0; i < args.length; i++) {
            str = this.replaceStr(str, "{" + i.toString() + "}", args[i]);
        }

        return str;
    }

    public static newFormat(str: string, number1:number,number2:number): string {
        str = this.replaceStr(str, "{" + 0 + "}", number1.toString());
        str = this.replaceStr(str, "{" + 1 + "}", number2.toString());
        return str;
    }

    public static IsNullOrEmpty(str: any): boolean {
        // if (typeof(str) != "string") {
        //     return false
        // }
        return str == null || str == ""
    }

    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    public static trimSpace(str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    };
    /**
     * 获取字符串长度, 中文为2
     * @param str
     */
    public static getStringLength(str) {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            } else {
                length += 1;
            }
        }
        return length;
    };

    /**
     * 获取字符串的字节长度
     * 一个中文算2两个字节
     */
    public static strByteLen(str) {
        // var byteLen = 0;
        // var strLen = str.length;
        // for (var i = 0; i < strLen; i++) {
        //     byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
        // }
        // return byteLen;

        var ch//, st, re = []; 
        let len = 0
        for (var i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);  // get char  
            do {
                ++len
                ch = ch >> 8;          // shift value down by 1 byte  
            }
            while (ch);
        }
        return len;
    }

    /**
     * 补齐字符串
     * @param 源字符串
     * @param 指定的字节长度
     * @param 填补的字符
     * @param 是否忽略HTML代码
     * @return
     *
     */
    public static complementByChar(str, length, char: string = " ", ignoreHtml: boolean = true) {
        str = str + ""
        var byteLen = this.strByteLen(ignoreHtml ? str.replace(StringHelper.HTML, "") : str);
        return str + this.repeatStr(char, length - byteLen);
    }

    /**
     * 重复指定字符串count次
     */
    public static repeatStr(str, count) {
        var s = "";
        for (var i = 0; i < count; i++) {
            s += str;
        }
        return s;
    };

    /**
     * 为文字添加颜色
     * */
    public static addColor(content: string, color: number) {
        color = color || 0
        content = content == null ? "" : content
        var colorStr;
        if (typeof (color) == "string")
            colorStr = String(color);
        else if (typeof (color) == "number")
            colorStr = "0x" + Number(color).toString(16);
        return "|C:" + colorStr + "&T:" + content + "|";
    };
    public static HTML = /<[^>]+>/g;

    public static Format(str: string, ...args: any[]): string {
        let result = str
        if (args.length > 0) {
            if (args.length == 1 && typeof (args[0]) == "object") {
                let objStr = args[0]
                for (let key in objStr) {
                    if (objStr[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, objStr[key]);
                    }
                }
            } else {
                for (let i = 0; i < args.length; ++i) {
                    if (args[i] != undefined) {
                        var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, args[i]);
                    }
                }
            }
        }
        return result
    }

    public static FormatS(result: string, ...args: any[]) {
        if (!result) {
            return ""
        }
        if (!args || !args.length) {
            return result
        }
        var newStr = "";
        var index = 0;
        for (var value of result.split(/(%d|%s)/g)) {
            if (!/(%d|%s)/g.test(value)) {
                newStr = newStr + value;
            } else {
                newStr = newStr + (args[index++] || "");
            }
        }
        return newStr;
    }


    public static ToSingleHex(value: number): string {
        let str = value.toString(16)
        if (str.length == 1) {
            return "0" + str
        }
        return str
    }

    public static numTenToChinese(number): string {
        return LangManager.Instance.GetTranslation("public.number.num" + number);
    }


    public static numberToChinese(num: number): string {
        let chinese: string
        if (num <= 10) {
            chinese = StringHelper.numTenToChinese(num)
        } else if (num < 100) {
            let gw = num % 10
            let sw = num / 10
            if (gw == 0) {
                chinese = StringHelper.numTenToChinese(Math.floor(sw)) + LangManager.Instance.GetTranslation("public.number.num10")
            } else {
                if (sw < 2) {
                    chinese = LangManager.Instance.GetTranslation("public.number.num10") + StringHelper.numTenToChinese(gw)
                } else {
                    chinese = StringHelper.numTenToChinese(Math.floor(sw)) + LangManager.Instance.GetTranslation("public.number.num10") + StringHelper.numTenToChinese(gw)
                }
            }
        }
        return chinese
    }
}
