import Logger from "../../core/logger/Logger";
import ByteArray from "../../core/net/ByteArray";

/**
 * @author:pzlricky
 * @data: 2020-11-26 10:26
 * @description ***
 */
export default class StringUtils {
  public static BASE64: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  /**
   *       Returns everything after the first occurrence of the provided character in the string.
   *
   *       @param p_string The string.
   *
   *       @param p_begin The character or sub-string.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static afterFirst(p_string: string, p_char: string): string {
    if (p_string == null) {
      return "";
    }
    let idx: number = p_string.indexOf(p_char);
    if (idx == -1) {
      return "";
    }
    idx += p_char.length;
    return p_string.substr(idx);
  }

  /**
   *       Returns everything after the last occurence of the provided character in p_string.
   *
   *       @param p_string The string.
   *
   *       @param p_char The character or sub-string.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static afterLast(p_string: string, p_char: string): string {
    if (p_string == null) {
      return "";
    }
    let idx: number = p_string.lastIndexOf(p_char);
    if (idx == -1) {
      return "";
    }
    idx += p_char.length;
    return p_string.substr(idx);
  }

  /**
   *       Determines whether the specified string begins with the specified prefix.
   *
   *       @param p_string The string that the prefix will be checked against.
   *
   *       @param p_begin The prefix that will be tested against the string.
   *
   *       @returns boolean
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static beginsWith(p_string: string, p_begin: string): boolean {
    if (p_string == null) {
      return false;
    }
    return p_string.indexOf(p_begin) == 0;
    //return new RegExp("^"+p_begin).test(p_string);
  }

  /**
   *       Returns everything before the first occurrence of the provided character in the string.
   *
   *       @param p_string The string.
   *
   *       @param p_begin The character or sub-string.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static beforeFirst(p_string: string, p_char: string): string {
    if (p_string == null) {
      return "";
    }
    let idx: number = p_string.indexOf(p_char);
    if (idx == -1) {
      return "";
    }
    return p_string.substr(0, idx);
  }

  /**
   *       Returns everything before the last occurrence of the provided character in the string.
   *
   *       @param p_string The string.
   *
   *       @param p_begin The character or sub-string.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static beforeLast(p_string: string, p_char: string): string {
    if (p_string == null) {
      return "";
    }
    let idx: number = p_string.lastIndexOf(p_char);
    if (idx == -1) {
      return "";
    }
    return p_string.substr(0, idx);
  }

  /**
   *       Returns everything after the first occurance of p_start and before
   *       the first occurrence of p_end in p_string.
   *
   *       @param p_string The string.
   *
   *       @param p_start The character or sub-string to use as the start index.
   *
   *       @param p_end The character or sub-string to use as the end index.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static between(
    p_string: string,
    p_start: string,
    p_end: string
  ): string {
    let str: string = "";
    if (p_string == null) {
      return str;
    }
    let startIdx: number = p_string.indexOf(p_start);
    if (startIdx != -1) {
      startIdx += p_start.length; // RM: should we support multiple chars? (or ++startIdx);
      let endIdx: number = p_string.indexOf(p_end, startIdx);
      if (endIdx != -1) {
        str = p_string.substr(startIdx, endIdx - startIdx);
      }
    }
    return str;
  }

  /**
   *       Description, Utility method that intelligently breaks up your string,
   *       allowing you to create blocks of readable text.
   *       This method returns you the closest possible match to the p_delim paramater,
   *       while keeping the text length within the p_len paramter.
   *       If a match can't be found in your specified length an  '...' is added to that block,
   *       and the blocking continues untill all the text is broken apart.
   *
   *       @param p_string The string to break up.
   *
   *       @param p_len Maximum length of each block of text.
   *
   *       @param p_delim delimter to end text blocks on, default = '.'
   *
   *       @returns Array
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static block(
    p_string: string,
    p_len: number,
    p_delim: string = "."
  ): Array<string> {
    let arr: Array<string> = [];
    if (p_string == null || !StringUtils.contains(p_string, p_delim)) {
      return arr;
    }
    let chrIndex: number = 0;
    let strLen: number = p_string.length;
    while (chrIndex < strLen) {
      let subString: string = p_string.substr(chrIndex, p_len);
      if (!StringUtils.contains(subString, p_delim)) {
        arr.push(StringUtils.truncate(subString, subString.length));
        chrIndex += subString.length;
      }
      subString = subString.replace(new RegExp("[^" + p_delim + "]+$"), "");
      arr.push(subString);
      chrIndex += subString.length;
    }
    return arr;
  }

  /**
   *       Capitallizes the first word in a string or all words..
   *
   *       @param p_string The string.
   *
   *       @param p_all (optional) boolean value indicating if we should
   *       capitalize all words or only the first.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static capitalize(p_string: string, ...args): string {
    let str: string = StringUtils.trimLeft(p_string);
    if (args[0] === true) {
      return str.replace(/^.|\s+(.)/, StringUtils._upperCase);
    } else {
      return str.replace(/(^\w)/, StringUtils._upperCase);
    }
  }

  public static ljust(
    p_string: string,
    p_width: number,
    p_pad: string = " "
  ): string {
    let pad: string = p_pad.substr(0, 1);
    if (p_string.length < p_width) {
      return p_string + StringUtils.repeat(pad, p_width - p_string.length);
    } else {
      return p_string;
    }
  }

  public static rjust(
    p_string: string,
    p_width: number,
    p_pad: string = " "
  ): string {
    let pad: string = p_pad.substr(0, 1);
    if (p_string.length < p_width) {
      return StringUtils.repeat(pad, p_width - p_string.length) + p_string;
    } else {
      return p_string;
    }
  }

  public static center(
    p_string: string,
    p_width: number,
    p_pad: string = " "
  ): string {
    let pad: string = p_pad.substr(0, 1);

    if (p_string.length < p_width) {
      let len: number = p_width - p_string.length;
      let rem: string = len % 2 == 0 ? "" : pad;
      let pads: string = StringUtils.repeat(pad, Math.round(len / 2));
      return pads + p_string + pads + rem;
    } else {
      return p_string;
    }
  }

  public static repeat(p_string: string, p_count: number = 1): string {
    let s: string = "";
    while (p_count--) {
      s += p_string;
    }
    return s;
  }

  public static base64Encode(p_string: string): string {
    let out: string = "";
    let i: number = 0;
    let len: number = p_string.length;

    while (i < len) {
      let c1: number = p_string.charCodeAt(i++) & 0xff;
      if (i == len) {
        out +=
          StringUtils.BASE64.charAt(c1 >> 2) +
          StringUtils.BASE64.charAt((c1 & 0x3) << 4) +
          "==";
        break;
      }
      let c2: number = p_string.charCodeAt(i++);
      if (i == len) {
        out +=
          StringUtils.BASE64.charAt(c1 >> 2) +
          StringUtils.BASE64.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)) +
          "=";
        break;
      }
      let c3: number = p_string.charCodeAt(i++);
      out +=
        StringUtils.BASE64.charAt(c1 >> 2) +
        StringUtils.BASE64.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)) +
        StringUtils.BASE64.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6)) +
        StringUtils.BASE64.charAt(c3 & 0x3f);
    }

    return out;
  }

  /**
   *       Determines whether the specified string contains any instances of p_char.
   *
   *       @param p_string The string.
   *
   *       @param p_char The character or sub-string we are looking for.
   *
   *       @returns boolean
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static contains(p_string: string, p_char: string): boolean {
    if (p_string == null) {
      return false;
    }
    return p_string.indexOf(p_char) != -1;
  }

  /**
   *       Determines the number of times a charactor or sub-string appears within the string.
   *
   *       @param p_string The string.
   *
   *       @param p_char The character or sub-string to count.
   *
   *       @param p_caseSensitive (optional, default is true) A boolean flag to indicate if the
   *       search is case sensitive.
   *
   *       @returns number
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static countOf(
    p_string: string,
    p_char: string,
    p_caseSensitive: boolean = true
  ): number {
    if (p_string == null) {
      return 0;
    }
    let char: string = StringUtils.escapePattern(p_char);
    let flags: string = !p_caseSensitive ? "ig" : "g";
    return p_string.match(new RegExp(char, flags)).length;
  }

  /**
   *       Levenshtein distance (editDistance) is a measure of the similarity between two strings,
   *       The distance is the number of deletions, insertions, or substitutions required to
   *       transform p_source into p_target.
   *
   *       @param p_source The source string.
   *
   *       @param p_target The target string.
   *
   *       @returns number
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static editDistance(p_source: string, p_target: string): number {
    if (p_source == null) {
      p_source = "";
    }
    if (p_target == null) {
      p_target = "";
    }

    if (p_source == p_target) {
      return 0;
    }

    let d: Array<any> = [];
    let cost: number = 0;
    let n: number = p_source.length;
    let m: number = p_target.length;

    if (n == 0) {
      return m;
    }
    if (m == 0) {
      return n;
    }

    for (let a: number = 0; a <= n; a++) {
      d[a] = [];
    }
    for (let b: number = 0; b <= n; b++) {
      d[b][0] = b;
    }
    for (let c: number = 0; c <= m; c++) {
      d[0][c] = c;
    }

    for (let i: number = 1; i <= n; i++) {
      let s_i: string = p_source.charAt(i - 1);
      for (let j: number = 1; j <= m; j++) {
        let t_j: string = p_target.charAt(j - 1);

        if (s_i == t_j) {
          cost = 0;
        } else {
          cost = 1;
        }

        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + cost
        );
      }
    }
    return d[n][m];
  }

  /**
   *       Determines whether the specified string ends with the specified suffix.
   *
   *       @param p_string The string that the suffic will be checked against.
   *
   *       @param p_end The suffix that will be tested against the string.
   *
   *       @returns boolean
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static endsWith(p_string: string, p_end: string): boolean {
    return new RegExp(p_end + "$").test(p_string);
  }

  /**
   *       Determines whether the specified string contains text.
   *
   *       @param p_string The string to check.
   *
   *       @returns boolean
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static hasText(p_string: string): boolean {
    let str: string = StringUtils.removeExtraWhitespace(p_string);
    return !!str.length;
  }

  /**检查特殊字符 */
  public static checkEspicalWorld(str: string): boolean {
    let pattern =
      /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥¥%……&*（）——\-+={}|《》？: “”【】、；‘', 。、]/;
    let result = pattern.test(str);
    return result;
  }

  /**检查字符长度是否超出 */
  public static checkWordLen(str: string, count: number = 1): boolean {
    var pattern = /[\u4e00-\u9fa5]$/; //中文汉字为4个字符
    let strTemp = str.split("");
    let strLen = strTemp.length;
    let charCount = 0;
    for (let index = 0; index < strLen; index++) {
      let elementStr = strTemp[index];
      let result = pattern.test(elementStr);
      if (result) {
        charCount += 4;
      } else {
        charCount += 1;
      }
    }

    return charCount > count;
  }

  /**
   *       Determines whether the specified string contains any characters.
   *
   *       @param p_string The string to check
   *
   *       @returns boolean
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static isEmpty(p_string: string): boolean {
    if (p_string == null) {
      return true;
    }
    return !p_string.length;
  }

  public static isNullOrEmpty(str: string): boolean {
    return str == null || str == "";
  }

  /**
   *       Determines whether the specified string is numeric.
   *
   *       @param p_string The string.
   *
   *       @returns boolean
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static isNumeric(p_string: string): boolean {
    if (p_string == null) {
      return false;
    }
    let regx: RegExp = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
    return regx.test(p_string);
  }

  /**
   * Pads p_string with specified character to a specified length from the left.
   *
   *       @param p_string string to pad
   *
   *       @param p_padChar Character for pad.
   *
   *       @param p_length Length to pad to.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static padLeft(
    p_string: string,
    p_padChar: string,
    p_length: number
  ): string {
    let s: string = p_string;
    while (s.length < p_length) {
      s = p_padChar + s;
    }
    return s;
  }

  /**
   * Pads p_string with specified character to a specified length from the right.
   *
   *       @param p_string string to pad
   *
   *       @param p_padChar Character for pad.
   *
   *       @param p_length Length to pad to.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static padRight(
    p_string: string,
    p_padChar: string,
    p_length: number
  ): string {
    let s: string = p_string;
    while (s.length < p_length) {
      s += p_padChar;
    }
    return s;
  }

  /**
   *       Properly cases' the string in "sentence format".
   *
   *       @param p_string The string to check
   *
   *       @returns string.
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static properCase(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    let str: string = p_string
      .toLowerCase()
      .replace(/\b([^.?;!]+)/, StringUtils.capitalize);
    return str.replace(/\b[i]\b/, "I");
  }

  public static quote(p_string: string): string {
    let regx: RegExp = /[\\"\r\\n]/g;
    return '"' + p_string.replace(regx, StringUtils._quote) + '"';
  }

  public static relativePath(
    p_base: string,
    p_path: string,
    p_delim: string = "/"
  ): string {
    let baseUri: string = p_base;
    if (StringUtils.endsWith(p_base, "/")) {
      baseUri = StringUtils.beforeLast(p_base, "/");
    }

    let pathUri: string = p_path;
    if (StringUtils.endsWith(p_path, "/")) {
      pathUri = StringUtils.beforeLast(p_path, "/");
    }

    let baseParts: Array<string> = baseUri.split(p_delim);
    let pathParts: Array<string> = pathUri.split(p_delim);

    // Get the number of parts that are the same
    let l: number = Math.min(baseParts.length, pathParts.length);
    let sameCounter: number = 0;
    for (let i: number = 0; i < l; i++) {
      if (baseParts[i].toLowerCase() !== pathParts[i].toLowerCase()) {
        break;
      }
      sameCounter++;
    }

    // If they do not share any common directories/roots, just return 2nd path
    if (sameCounter == 0) {
      return p_path;
    }

    let newPath: string = "";

    // Go up the directory structure the number of non-matching parts in the first path
    l = baseParts.length;
    for (let i: number = sameCounter; i < l; i++) {
      if (i > sameCounter) {
        newPath += p_delim;
      }
      newPath += "..";
    }

    // if we did not have to go up at all, we're still in p_base
    if (newPath.length == 0) {
      newPath = ".";
    }

    // now we go down as much as needed to get to p_path
    l = pathParts.length;
    for (let i: number = sameCounter; i < l; i++) {
      newPath += p_delim;
      newPath += pathParts[i];
    }
    //
    return newPath;
  }

  /**
   *       Removes all instances of the remove string in the input string.
   *
   *       @param p_string The string that will be checked for instances of remove
   *       string
   *
   *       @param p_remove The string that will be removed from the input string.
   *
   *       @param p_caseSensitive An optional boolean indicating if the replace is case sensitive. Default is true.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static remove(
    p_string: string,
    p_remove: string,
    p_caseSensitive: boolean = true
  ): string {
    if (p_string == null) {
      return "";
    }
    let rem: string = StringUtils.escapePattern(p_remove);
    let flags: string = !p_caseSensitive ? "ig" : "g";
    return p_string.replace(new RegExp(rem, flags), "");
  }

  /**
   *       Removes extraneous whitespace (extra spaces, tabs, line breaks, etc) from the
   *       specified string.
   *
   *       @param p_string The string whose extraneous whitespace will be removed.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static removeExtraWhitespace(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    let str: string = StringUtils.trim(p_string);
    return str.replace(/\s+/g, " ");
  }

  /**
   *       Returns the specified string in reverse character order.
   *
   *       @param p_string The string that will be reversed.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static reverse(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    return p_string.split("").reverse().join("");
  }

  /**
   *       Returns the specified string in reverse word order.
   *
   *       @param p_string The string that will be reversed.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static reverseWords(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    return p_string.split(/\s+/).reverse().join("");
  }

  /**
   *       Determines the percentage of similiarity, based on editDistance
   *
   *       @param p_source The source string.
   *
   *       @param p_target The target string.
   *
   *       @returns number
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static similarity(p_source: string, p_target: string): number {
    let ed: number = StringUtils.editDistance(p_source, p_target);
    let maxLen: number = Math.max(p_source.length, p_target.length);
    if (maxLen == 0) {
      return 1;
    } else {
      return 1 - ed / maxLen;
    }
  }

  /**
   *       Remove's all < and > based tags from a string
   *
   *       @param p_string The source string.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static stripTags(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    return p_string.replace(/<\/?[^>]+>/gim, "");
  }

  /**
   *      Replaces instances of the form {digit} or {name} in string with corresponding arguments or values.
   *
   * @param string0..stringN     Strings or
   * @param object               Object
   * @return string
   */
  public static supplant(p_string: string, ...args): string {
    let str: string = p_string;
    if (args[0] instanceof Object) {
      for (let n in args[0]) {
        str = str.replace(new RegExp("\\{" + n + "\\}", "g"), args[0][n]);
      }
    } else {
      let l: number = args.length;
      for (let i: number = 0; i < l; i++) {
        str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
      }
    }
    return str;
  }

  /**
   *       Swaps the casing of a string.
   *
   *       @param p_string The source string.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static swapCase(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    return p_string.replace(/(\w)/, StringUtils._swapCase);
  }

  /**
   *       Removes whitespace from the front and the end of the specified
   *       string.
   *
   *       @param p_string The string whose beginning and ending whitespace will
   *       will be removed.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static trim(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    return p_string.replace(/^\s+|\s+$/g, "");
  }

  /**
   *       Removes whitespace from the front (left-side) of the specified string.
   *
   *       @param p_string The string whose beginning whitespace will be removed.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static trimLeft(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    return p_string.replace(/^\s+/, "");
  }

  /**
   *       Removes whitespace from the end (right-side) of the specified string.
   *
   *       @param p_string The string whose ending whitespace will be removed.
   *
   *       @returns string .
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static trimRight(p_string: string): string {
    if (p_string == null) {
      return "";
    }
    return p_string.replace(/\s+$/, "");
  }

  private static blankSpaceType: Array<number> = [
    9, 32, 61656, 59349, 59350, 59351, 59352, 59353, 59354, 59355, 59355, 59356,
    59357, 59358, 59359, 59360, 59361, 59362, 59363, 59364, 59365,
  ];

  public static trimAll(str: string): string {
    let s: string = StringUtils.trim(str);

    let newStr: string = "";
    for (let i: number = 0; i < s.length; i++) {
      if (StringUtils.blankSpaceType.indexOf(s.charCodeAt(i)) <= -1) {
        newStr += s.charAt(i);
      }
    }
    return newStr;
  }

  /**
   *       Returns a string truncated to a specified length with optional suffix
   *
   *       @param p_string The string.
   *
   *       @param p_len The length the string should be shortend to
   *
   *       @param p_suffix (optional, default=...) The string to append to the end of the truncated string.
   *
   *       @returns string
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static truncate(
    p_string: string,
    p_len: number,
    p_suffix: string = "..."
  ): string {
    if (p_string == null) {
      return "";
    }
    if (p_len == 0) {
      p_len = p_string.length;
    }
    p_len -= p_suffix.length;
    let trunc: string = p_string;
    if (trunc.length > p_len) {
      trunc = trunc.substr(0, p_len);
      if (/[^\s]/.test(p_string.charAt(p_len))) {
        trunc = StringUtils.trimRight(trunc.replace(/\w+$|\s+$/, ""));
      }
      trunc += p_suffix;
    }

    return trunc;
  }

  /**
   *       Determins the number of words in a string.
   *
   *       @param p_string The string.
   *
   *       @returns number
   *
   *       @langversion ActionScript 3.0
   *       @playerversion Flash 8.5
   *       @tiptext
   */
  public static wordCount(p_string: string): number {
    if (p_string == null) {
      return 0;
    }
    return p_string.match(/\b\w+\b/g).length;
  }

  /* **************************************************************** */
  /*      These are helper methods used by some of the above methods.             */

  /* **************************************************************** */
  private static escapePattern(p_pattern: string): string {
    // RM: might expose this one, I've used it a few times already.
    return p_pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, "\\$1");
  }

  private static _quote(p_string: string, ...args): string {
    switch (p_string) {
      case "\\":
        return "\\\\";
      case "\r":
        return "\\r";
      case "\n":
        return "\\n";
      case '"':
        return '\\"';
    }
    return null;
  }

  private static _upperCase(p_char: string, ...args): string {
    return p_char.toUpperCase();
  }

  private static _swapCase(p_char: string, ...args): string {
    let lowChar: string = p_char.toLowerCase();
    let upChar: string = p_char.toUpperCase();
    switch (p_char) {
      case lowChar:
        return upChar;
      case upChar:
        return lowChar;
      default:
        return p_char;
    }
  }

  public static converboolean(value: string): boolean {
    if (value == "true") {
      return true;
    }
    return false;
  }

  public static substr(str: string, leng: number): string {
    let len: number = 0;
    len = 0;
    let index: number = 0;
    for (let i: number = 0; i < str.length; i++, index = i) {
      if (str.charCodeAt(i) >= 0x4e00 && str.charCodeAt(i) <= 0x9fa5) {
        len += 2;
      } else {
        len += 1;
      }
      if (len >= leng) {
        index = i + 1;
        break;
      }
    }
    return str.substr(0, index);
  }

  public static substrLastFolder(path: string): string {
    let index: number = path.lastIndexOf("/");
    let folder: string = path.substr(0, index);
    index = folder.lastIndexOf("/");
    folder = folder.substring(index + 1);
    return folder;
  }

  public static substrSwfName(path: string): string {
    let index: number = path.lastIndexOf(".swf");
    let fileName: string = path.substr(0, index);
    index = fileName.lastIndexOf("/");
    fileName = fileName.substring(index + 1);
    return fileName;
  }

  public static substrBswfName(path: string): string {
    let index: number = path.lastIndexOf(".bswf");
    let fileName: string = path.substr(0, index);
    index = fileName.lastIndexOf("/");
    fileName = fileName.substring(index + 1);
    return fileName;
  }

  /***
   * 格式化字符串输出
   * @param src
   */
  private static _reg = new RegExp("\\{[a-zA-Z0-9]+\\}");
  public static stringFormat(input: string, ...args): string {
    var obj: Object = this._reg.exec(input);
    let index = 0;
    while (obj && index < args.length) {
      input = input.replace(this._reg, args[index]);
      obj = this._reg.exec(input);
      index++;
    }
    return input;
    // return content.replace(StringUtils.matchStrPattern, (match: string, argIndex: number) => {
    //     Logger.log('content:',content,match)
    //     return args[argIndex] || match;
    // });
  }

  /**
   * 格式化字符串输出2
   * @param input
   * @param args {key:"Parameter1", value: 200}
   * @returns
   */
  public static stringFormat2(input: string, ...args): string {
    var obj: Object = this._reg.exec(input);
    let index = 0;
    while (obj && index < args.length) {
      let data = args[index];
      if (obj[0].indexOf(data["key"]) != -1) {
        input = input.replace(this._reg, data["value"]);
      }
      obj = this._reg.exec(input);
      index++;
    }
    return input;
  }

  /**
   * 格式转换 111111 -> 111,111
   * @param str
   * @returns
   */
  public static consortiaTxtStyle(str: string, symbol: string = ","): string {
    var myPattern: RegExp = /,/g;
    str = str.replace(myPattern, "");
    var len: number = str.length;
    var rls: string;
    if (str.length >= 16) {
      rls = str;
    } else if (str.length >= 10) {
      rls =
        str.substring(0, len - 9) +
        symbol +
        str.substring(len - 9, len - 6) +
        symbol +
        str.substring(len - 6, len - 3) +
        symbol +
        str.substring(len - 3, len);
    } else if (str.length >= 7) {
      rls =
        str.substring(0, len - 6) +
        symbol +
        str.substring(len - 6, len - 3) +
        symbol +
        str.substring(len - 3, len);
    } else if (str.length >= 4) {
      rls = str.substring(0, len - 3) + symbol + str.substring(len - 3, len);
    } else {
      rls = str;
    }
    return rls;
  }

  /**
   *获取大写罗马数字
   * @param num
   */
  public static getRomanNumber(num: number): string {
    let romanNum: string[] = [
      "",
      "Ⅰ",
      "Ⅱ",
      "Ⅲ",
      "Ⅳ",
      "Ⅴ",
      "Ⅵ",
      "Ⅶ",
      "Ⅷ",
      "Ⅸ",
      "Ⅹ",
    ];
    return romanNum[num];
  }
}
