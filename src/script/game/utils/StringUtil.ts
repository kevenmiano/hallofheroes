import ByteArray from "../../core/net/ByteArray";

export class StringUtil {
  public static urlencodeGB2312(str: string): string {
    var result: string = "";
    var byte: ByteArray = new ByteArray();
    byte.writeMultiByte(str, "gb2312");
    for (var i: number; i < byte.length; i++) {
      result += escape(String.fromCharCode(byte[i]));
    }
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
  // public static isEmail(char:string):boolean{
  // 	if(char == null){
  // 		return false;
  // 	}
  // 	char = trim(char);
  // 	var pattern:RegExp = /(\w|[_.\-])+@((\w|-)+\.)+\w{2,4}+/;
  // 	var result:Object = pattern.exec(char);
  //     if(result == null) {
  //         return false;
  //     }
  //     return true;
  // }

  /**
   * 替换文本
   * @param text 原始文本
   * @param rep 替换内容
   * @returns
   */
  public static replaceWord(
    text: string,
    rep: string = "7road",
    to: string = "S",
  ): string {
    if (text.indexOf(rep) != -1) {
      return text.replace(rep, to);
    }
    return "";
  }

  //是否是数值字符串;
  public static isNumber(char: string): boolean {
    if (char == null) {
      return false;
    }
    return !isNaN(parseInt(char));
  }

  //是否为Double型数据;
  public static isDouble(char: string): boolean {
    char = StringUtil.trim(char);
    var pattern: RegExp = /^[-\+]?\d+(\.\d+)?$/;
    var result: object = pattern.exec(char);
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
    char = StringUtil.trim(char);
    var pattern: RegExp = /^[-\+]?\d+$/;
    var result: object = pattern.exec(char);
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
    char = StringUtil.trim(char);
    var pattern: RegExp = /^[A-Za-z]+$/;
    var result: object = pattern.exec(char);
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
    char = StringUtil.trim(char);
    var pattern: RegExp = /^[\u0391-\uFFE5]+$/;
    var result: object = pattern.exec(char);
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
    char = StringUtil.trim(char);
    var pattern: RegExp = /^[^\x00-\xff]+$/;
    var result: object = pattern.exec(char);
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
    char = StringUtil.trim(char);
    var pattern: RegExp = /[^\x00-\xff]/;
    var result: object = pattern.exec(char);
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
    char = StringUtil.trim(char);
    var pattern: RegExp = new RegExp(
      "^[a-zA-Z0-9][a-zA-Z0-9_-]{0," + len + "}$",
      "",
    );
    var result: object = pattern.exec(char);
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
    char = StringUtil.trim(char).toLowerCase();
    var pattern: RegExp =
      /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    var result: object = pattern.exec(char);
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

  /**去除所有空格 */
  public static trim(str: string): string {
    var result = "";
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    result = result.replace(/\s/g, "");
    return result;
  }

  /**去除左右空格 */
  public static trimlr(str: string): string {
    let result = "";
    result = str.replace(/(^\s*)|(\s*$)/g, "");
    return result;
  }

  /**替换特殊字符 */
  public static replaceSpicalWord(str: string, rep: string = ""): string {
    let pattern =
      /[↵`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥¥%……&*（）——\-+={}|《》？:“”【】、；‘',。、]/;
    str = str.replace(new RegExp(pattern, "g"), rep);
    return str;
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
    return prefix == char.substring(0, prefix.length);
  }

  //是否为后缀字符串;
  public static endsWith(char: string, suffix: string): boolean {
    return suffix == char.substring(char.length - suffix.length);
  }

  //去除指定字符串;
  public static remove(char: string, remove: string): string {
    return StringUtil.replace(char, remove, "");
  }

  //字符串替换;
  public static replace(
    char: string,
    replace: string,
    replaceWith: string,
  ): string {
    return char.split(replace).join(replaceWith);
  }

  //utf16转utf8编码;
  public static utf16to8(char: string): string {
    var out: any[] = [];
    var len: number = char.length;
    for (var i: number = 0; i < len; i++) {
      var c: number = char.charCodeAt(i);
      if (c >= 0x0001 && c <= 0x007f) {
        out[i] = char.charAt(i);
      } else if (c > 0x07ff) {
        out[i] = String.fromCharCode(
          0xe0 | ((c >> 12) & 0x0f),
          0x80 | ((c >> 6) & 0x3f),
          0x80 | ((c >> 0) & 0x3f),
        );
      } else {
        out[i] = String.fromCharCode(
          0xc0 | ((c >> 6) & 0x1f),
          0x80 | ((c >> 0) & 0x3f),
        );
      }
    }
    return out.join("");
  }

  //utf8转utf16编码;
  public static utf8to16(char: string): string {
    var out: any[] = [];
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
          out[out.length] = String.fromCharCode(
            ((c & 0x1f) << 6) | (char2 & 0x3f),
          );
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = char.charCodeAt(i++);
          char3 = char.charCodeAt(i++);
          out[out.length] = String.fromCharCode(
            ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0),
          );
          break;
      }
    }
    return out.join("");
  }

  /**
   * 计算字符的字节长度
   * @param str
   * @returns
   */
  public static getbyteLength(str: string): number {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        count += 2;
      } else {
        count++;
      }
    }
    return count;
  }
}
