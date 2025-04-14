import LangManager from "../../core/lang/LangManager";
import { FilterWordAnalyzer } from "../datas/loader/FilterWordAnalyzer";
import StringUtils from "../utils/StringUtils";
import { AgentFilterManager } from "./AgentFilterManager";
import Logger from "../../core/logger/Logger";
import ThirdDirtyAnalyzer from "../datas/loader/ThirdDirtyAnalyzer";
import ComponentSetting from "../utils/ComponentSetting";
import { NamesLibManager } from "./NamesLibManager";

export class FilterWordManager {
  /**
   * 过滤开关
   * 开启:
   * 	英 雄	中间空格会被忽略, 需要过滤
   * 关闭
   *  fu ck	中间空格不会被忽略, 不需要过滤
   */
  public static filterTrim: boolean = false;
  //标点符号
  private static unableChar: string = "";

  private static vCurrent: string = LangManager.Instance.GetTranslation(
    "yishi.manager.this.Current",
  );
  private static vConsortiaChannel: string =
    LangManager.Instance.GetTranslation(
      "chatII.datas.getChatChannelName.consortiaChannel",
    );
  private static vTeamChannel: string = LangManager.Instance.GetTranslation(
    "chat.datas.getChatChannelName.TEAM",
  );
  private static vPrivateChat: string = LangManager.Instance.GetTranslation(
    "chat.view.PrivateChatFrame.title",
  );
  private static vWorldChannel: string = LangManager.Instance.GetTranslation(
    "chat.datas.getChatChannelName.SMALLBUGLE",
  );
  private static vBIGBUGLE: string = LangManager.Instance.GetTranslation(
    "chat.datas.getChatChannelName.BIGBUGLE",
  );
  private static vOutAreaBigBugle: string = LangManager.Instance.GetTranslation(
    "yishi.manager.this.OutAreaBigBugle",
  );
  private static CHANNEL_WORDS: string[] = [
    FilterWordManager.vCurrent,
    FilterWordManager.vConsortiaChannel,
    FilterWordManager.vTeamChannel,
    FilterWordManager.vPrivateChat,
    FilterWordManager.vWorldChannel,
    FilterWordManager.vBIGBUGLE,
    FilterWordManager.vOutAreaBigBugle,
  ];
  //政治、官方禁用的词汇
  private static NICKADDWORDS: string[] = [];
  //骂人的词汇
  private static WORDS: string[] = [];
  //用于替换骂人词汇的符号
  private static REPLACEWORD: string =
    "~!@#$@#$%~!@#$@#%^&@~!@#$@##$%*~!@#$$@#%^&@~!@#$@#@#";

  private static THIRD_WORDS: string[][] = []; //第三方屏蔽字库

  private static _hasSetup: boolean = false;
  public static get hasSetup(): boolean {
    return this._hasSetup;
  }

  public static setup(analyzer: FilterWordAnalyzer) {
    FilterWordManager.NICKADDWORDS = analyzer.nickNames
      ? analyzer.nickNames
      : [];
    FilterWordManager.WORDS = analyzer.words ? analyzer.words : [];
    FilterWordManager.unableChar = analyzer.unableChar
      ? analyzer.unableChar
      : "";
    FilterWordManager.clearnUpNaN_Char(FilterWordManager.WORDS);
    FilterWordManager.clearnUpNaN_Char(FilterWordManager.NICKADDWORDS);
    this._hasSetup = true;
  }

  /**
   * 加载脏字库
   */
  public static startup(): Promise<void> {
    return new Promise((resolve) => {
      var analyzer;
      var thirdAnalyzer;
      let callBack = () => {
        if (!FilterWordManager.hasSetup) FilterWordManager.setup(analyzer);
        if (thirdAnalyzer) FilterWordManager.contact(thirdAnalyzer);
      };
      if (!FilterWordManager.hasSetup) {
        analyzer = new FilterWordAnalyzer(callBack);
        analyzer.analyze(ComponentSetting.ZhanPath);
        thirdAnalyzer = new ThirdDirtyAnalyzer(callBack);
        thirdAnalyzer.analyze();
      }
      if (!AgentFilterManager.hasSetup) {
        AgentFilterManager.Instance.setup(ComponentSetting.AgentZhanPath);
      }
      if (!NamesLibManager.hasSetup) {
        NamesLibManager.Instance.setup(ComponentSetting.NamesLibPath);
      }
    });
  }

  /**
   * 第三方屏蔽字库
   */
  public static contact(analyzer: ThirdDirtyAnalyzer) {
    if (analyzer.words) {
      FilterWordManager.THIRD_WORDS = analyzer.words;
    }
  }

  private static clearnUpNaN_Char(source: any[]) {
    var i: number = 0;
    while (i < source.length) {
      if (source[i].length == 0) source.splice(i, 1);
      else i++;
    }
  }

  /**
   * 检测是否含有标点符号 bret 09.5.15
   * @param s
   * @return
   */
  public static containUnableChar(s: string): boolean {
    var len: number = s.length;
    for (var i: number = 0; i < len; i++) {
      if (FilterWordManager.unableChar.indexOf(s.charAt(i)) > -1) return true; //含有标点符号 返回true
    }
    return false;
  }

  /**
   *检测是否包含指定的字符
   * @param checkStr  需要检测的字符串
   * @param specificStr 指定字符串, 如要检测是否包含<>, 指定字符串为"<>"
   * @return
   */
  public static containSpecificChar(
    checkStr: string,
    specificStr: string,
  ): boolean {
    var len: number = checkStr.length;
    for (var i: number = 0; i < len; i++) {
      if (specificStr.indexOf(checkStr.charAt(i)) > -1) return true;
    }
    return false;
  }

  /**
   *判断字符串是否包含有非法字符
   * @param str
   * @return
   *
   */
  public static isGotForbiddenWords(
    str: string,
    level: string = "chat",
  ): boolean {
    var temS: string = this.checkFilterTrim(str.toLocaleLowerCase());
    var count: number = FilterWordManager.WORDS.length;
    if (level == "chat") {
      for (var i: number = 0; i < count; i++) {
        if (FilterWordManager.WORDS[i] == "") continue;
        if (temS.indexOf(FilterWordManager.WORDS[i]) > -1) {
          return true;
        }
      }
      count = AgentFilterManager.Instance.agentFilter.length;
      for (i = 0; i < count; i++) {
        if (AgentFilterManager.Instance.agentFilter[i] == "") continue;
        if (temS.indexOf(AgentFilterManager.Instance.agentFilter[i]) > -1) {
          return true;
        }
      }
      //第三方屏蔽字库
      return this.checkThirdWords(str, level);
    } else if (level == "name") {
      count = FilterWordManager.NICKADDWORDS.length;
      for (i = 0; i < count; i++) {
        if (temS.indexOf(FilterWordManager.NICKADDWORDS[i]) > -1) {
          return true;
        }
      }
    }
    return false;
  }

  private static checkThirdWords(str: string, level: string = "chat"): boolean {
    var temS: string = this.checkFilterTrim(str.toLocaleLowerCase());
    if (level == "chat") {
      //第三方屏蔽字库
      let count = FilterWordManager.THIRD_WORDS.length;
      for (var i: number = 0; i < count; i++) {
        if (FilterWordManager.THIRD_WORDS[i].length == 0) continue;
        let thridWords = FilterWordManager.THIRD_WORDS[i];
        let wordsCount = thridWords.length;
        let ret = true;
        for (let index = 0; index < wordsCount; index++) {
          let innerWords = wordsCount[index];
          if (temS.indexOf(innerWords) < 0) {
            return false;
          }
        }
      }
    }
    return false;
  }

  /**
   * 格式化第三方字库
   * @param str
   * @returns
   */
  private static formatThridForbiddenWords(str: string): string {
    var temS: string = str;
    var count: number = FilterWordManager.THIRD_WORDS.length;
    if (count == 0) return str;
    for (let i in FilterWordManager.THIRD_WORDS) {
      if (
        Object.prototype.hasOwnProperty.call(FilterWordManager.THIRD_WORDS, i)
      ) {
        let thridWords = FilterWordManager.THIRD_WORDS[i];
        if (!thridWords || thridWords.length == 0) continue;
        let wordsCount = thridWords.length;
        for (let index = 0; index < wordsCount; index++) {
          let innerWords = thridWords[index];
          let matchCount = 0;
          for (let j = 0; j < innerWords.length; j++) {
            let element = innerWords[j];
            if (temS.indexOf(element) >= 0) {
              matchCount += 1;
            }
          }
          if (matchCount >= innerWords.length) {
            for (let j = 0; j < innerWords.length; j++) {
              let element = innerWords[j];
              var obj: object = new Object();
              obj["word"] = element;
              obj["idx"] = temS.indexOf(element);
              obj["length"] = obj["word"].length;
              temS = this.replaceUpperOrLowerCase(temS, obj);
            }
          }
        }
      }
    }
    return temS;
  }

  /**
   *格式化非法字符
   * @param str
   * @param arr
   * @return
   */
  private static formatForbiddenWords(str: string, arr: string[]): string {
    var temS: string = this.checkFilterTrim(str.toLocaleLowerCase());
    var count: number = arr.length;
    var isGotForbiddenWord: boolean = false;

    for (var i: number = 0; i < count; i++) {
      if (arr[i] == "") continue;
      if (temS.indexOf(arr[i]) > -1) {
        isGotForbiddenWord = true;
        var obj: object = new Object();
        obj["word"] = arr[i];
        obj["idx"] = temS.indexOf(arr[i]);
        obj["length"] = obj["word"].length;
        temS = this.replaceUpperOrLowerCase(temS, obj);
        str = this.replaceUpperOrLowerCase(str, obj);
        i--;
      }
    }
    if (isGotForbiddenWord && str) return str;
    else return undefined;
  }

  /**
   *过滤可能引起会引起误会的频道用语
   * @param str
   * @return
   */
  private static formatChannelWords(str: string): string {
    if (!str) return undefined;
    var count: number = FilterWordManager.CHANNEL_WORDS.length;
    var isGotChannelWord: boolean = false;
    for (var i: number = 0; i < count; i++) {
      var idx: number = str.indexOf(FilterWordManager.CHANNEL_WORDS[i]);
      var idx1: number = idx - 1;
      var idx2: number = idx + FilterWordManager.CHANNEL_WORDS[i].length;
      if (idx > -1) {
        if (idx1 > -1 && idx2 <= str.length - 1) {
          if (
            str.slice(idx1, idx1 + 1) == "[" &&
            str.slice(idx2, idx2 + 1) == "]"
          ) {
            isGotChannelWord = true;
            str =
              str.slice(0, idx) +
              this.getXXX(FilterWordManager.CHANNEL_WORDS[i].length) +
              str.slice(idx2);
          }
        }
      }
    }

    if (isGotChannelWord && str) return str;
    else return undefined;
  }
  /**
   *替换脏字(包括全角和半角)
   * @param str
   * @param obj
   * @return
   */
  //包括半角和全角, 大写和小写的替换函数  add by Freeman
  private static replaceUpperOrLowerCase(str: string, obj: object): string {
    var startIdx: number = obj["idx"];
    var len: number = obj["length"];
    var s: string;
    if (startIdx + len >= str.length) {
      s = str.slice(startIdx);
    } else {
      s = str.slice(startIdx, startIdx + len);
    }
    var reg: RegExp = new RegExp(s);
    str = str.replace(reg, this.getXXX(len));
    return str;
  }
  //包括半角和全角, 大写和小写的替换函数  add by Freeman

  /**
   * 过滤骂人的词汇
   * @param s
   * @return
   */
  public static filterWrod(s: string): string {
    var currentTime: number = new Date().getTime();
    var lastTime: number = 0;
    var temS: string = this.checkFilterTrim(s);
    temS = this.formatThridForbiddenWords(temS);
    var re_str: string = this.formatChannelWords(temS);
    var re_str1: string = "";
    var re_str2: string = "";
    var ary: string[] = FilterWordManager.WORDS.concat(
      AgentFilterManager.Instance.agentFilter,
    );
    if (re_str) {
      re_str1 = this.formatForbiddenWords(re_str, ary);
    } else {
      re_str1 = this.formatForbiddenWords(temS, ary);
    }
    if (re_str1) {
      re_str2 = this.formatForbiddenWords(
        re_str1,
        FilterWordManager.NICKADDWORDS,
      );
    } else if (re_str) {
      re_str2 = this.formatForbiddenWords(
        re_str,
        FilterWordManager.NICKADDWORDS,
      );
    } else {
      re_str2 = this.formatForbiddenWords(temS, FilterWordManager.NICKADDWORDS);
    }

    lastTime = new Date().getTime();
    Logger.log("filterWrod cost time:" + (lastTime - currentTime));
    if (re_str2) return re_str2;
    if (re_str1) return re_str1;
    if (re_str) return re_str;
    return temS;
  }

  public static IsNullorEmpty(str: string): boolean {
    str = StringUtils.trim(str);
    return StringUtils.isNullOrEmpty(str);
  }

  private static checkFilterTrim(str: string): string {
    var temS: string;
    if (FilterWordManager.filterTrim) {
      temS = StringUtils.trimAll(str);
    } else {
      temS = StringUtils.trim(str);
    }
    return temS;
  }

  /**
   * 获取过滤字符
   * @param len
   * @return
   *
   */

  //modified by Freeman
  private static getXXX(len: number): string {
    var startIdx: number = Math.round(
      Math.random() * (FilterWordManager.REPLACEWORD.length / 4),
    );
    var str: string = FilterWordManager.REPLACEWORD.slice(
      startIdx,
      startIdx + len,
    );
    return str;
  }
  //modified by Freeman
}
