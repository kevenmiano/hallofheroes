import { UIFilter } from "../ui/UIFilter";
import LangManager from "../lang/LangManager";
import CryptoUtils from "../../game/utils/CryptoUtils";
import ModelMgr from "../../game/manager/ModelMgr";
import { EmModel } from "../../game/constant/model/modelDefine";
import { UserModelAttribute } from "../../game/constant/model/UserModelParams";
import { ChannelSTR, H5SDK_CHANNEL_ID } from "../sdk/SDKConfig";

export default class Utils {
  public static NUM_CN: Array<object> = [
    { en: "Zero", zhcn: "零", es: "Cero", pt: "Zero", tr: "Sıfır", de: "Null" },
    { en: "One", zhcn: "一", es: "Uno", pt: "Um", tr: "Bir", de: "Eins" },
    { en: "Two", zhcn: "二", es: "Dos", pt: "Dois", tr: "İki", de: "Zwei" },
    { en: "Three", zhcn: "三", es: "Tres", pt: "Três", tr: "Üç", de: "Drei" },
    {
      en: "Four",
      zhcn: "四",
      es: "Cuatro",
      pt: "Quatro",
      tr: "Dört",
      de: "Vier",
    },
    { en: "Five", zhcn: "五", es: "Cinco", pt: "Cinco", tr: "Beş", de: "Fünf" },
    { en: "Six", zhcn: "六", es: "Seis", pt: "Seis", tr: "Altı", de: "Sechs" },
    {
      en: "Seven",
      zhcn: "七",
      es: "Siete",
      pt: "Sete",
      tr: "Yedi",
      de: "Sieben",
    },
    {
      en: "Eight",
      zhcn: "八",
      es: "Ocho",
      pt: "Oito",
      tr: "Sekiz",
      de: "Acht",
    },
    {
      en: "Nine",
      zhcn: "九",
      es: "Nueve",
      pt: "Nove",
      tr: "Dokuz",
      de: "Neun",
    },
  ];

  public static MONTHS: Array<object> = [
    {
      en: "January",
      zhcn: "1月",
      es: "Enero",
      pt: "Janeiro",
      tr: "Ocak",
      de: "Januar",
    },
    {
      en: "February",
      zhcn: "2月",
      es: "Febrero",
      pt: "Fevereiro",
      tr: "Şubat",
      de: "Februar",
    },
    {
      en: "March",
      zhcn: "3月",
      es: "Marzo",
      pt: "Março",
      tr: "Mart",
      de: "März",
    },
    {
      en: "April",
      zhcn: "4月",
      es: "Abril",
      pt: "Abril",
      tr: "Nisan",
      de: "April",
    },
    { en: "May", zhcn: "5月", es: "Mayo", pt: "Maio", tr: "Mayıs", de: "Mai" },
    {
      en: "June",
      zhcn: "6月",
      es: "Junio",
      pt: "Junho",
      tr: "Haziran",
      de: "Juni",
    },
    {
      en: "July",
      zhcn: "7月",
      es: "Julio",
      pt: "Julho",
      tr: "Temmuz",
      de: "Juli",
    },
    {
      en: "August",
      zhcn: "8月",
      es: "Agosto",
      pt: "Agosto",
      tr: "Ağustos",
      de: "August",
    },
    {
      en: "September",
      zhcn: "9月",
      es: "Septiembre",
      pt: "Setembro",
      tr: "Eylül",
      de: "September",
    },
    {
      en: "October",
      zhcn: "10月",
      es: "Octubre",
      pt: "Outubro",
      tr: "Ekim",
      de: "Oktober",
    },
    {
      en: "November",
      zhcn: "11月",
      es: "Noviembre",
      pt: "Novembro",
      tr: "Kasım",
      de: "November",
    },
    {
      en: "December",
      zhcn: "12月",
      es: "Diciembre",
      pt: "Dezembro",
      tr: "Aralık",
      de: "Dezember",
    },
  ];

  public static WEEKS: Array<object> = [
    { en: "Mon.", zhcn: "一", es: "Lun.", pt: "Seg.", tr: "Pzt", de: "Mo." },
    { en: "Tues.", zhcn: "二", es: "Mar.", pt: "Ter.", tr: "Sal", de: "Di." },
    { en: "Wed.", zhcn: "三", es: "Mié.", pt: "Qua.", tr: "Çar", de: "Mi." },
    { en: "Thur.", zhcn: "四", es: "Jue.", pt: "Qui.", tr: "Per", de: "Do." },
    { en: "Fri.", zhcn: "五", es: "Vie.", pt: "Sex.", tr: "Cum", de: "Fr." },
    { en: "Sat.", zhcn: "六", es: "Sáb.", pt: "Sáb.", tr: "Cmt", de: "Sa." },
    { en: "Sun.", zhcn: "日", es: "Dom.", pt: "Dom.", tr: "Paz", de: "So." },
  ];

  public static DECIMAL_UNITS: Array<string> = ["", ""];
  public static LEVELS: Array<string> = ["", "", "", ""];
  public static UNITS: Array<object> = [
    {
      en: "Thousand",
      zhcn: "千",
      es: "Mil",
      pt: "Mil",
      tr: "Bin",
      de: "Eintausend",
    },
    {
      en: "Hundred",
      zhcn: "百",
      es: "Cien",
      pt: "Cem",
      tr: "Yüz",
      de: "Einhundert",
    },
    { en: "Ten", zhcn: "十", es: "Diez", pt: "Dez", tr: "On", de: "Zehn" },
  ];
  private static NUM_ARR: Array<object>;
  private static UNITS_ARR: Array<object>;

  /**
   * 獲取月份
   * @param month 月
   * @returns
   */
  static getMonthStr(month: number, lang: string = "zhcn"): string {
    if (this.MONTHS) {
      return this.MONTHS[month - 1][lang];
    }
    return month.toString();
  }

  /**
   * 获取星期几
   * @param month 周几
   * @returns
   */
  static getWeekStr(week: number, lang: string = "zhcn"): string {
    if (this.WEEKS) {
      return this.WEEKS[week - 1][lang];
    }
    return week.toString();
  }

  /**
   * @deprecation 弃用 请使用SDKManager.Instance.getChannel().copyStr
   * @author
   * @param str 要复制的文本
   * @returns 是否复制成功
   */
  static copyStr(str: string): boolean {
    return true;
  }

  /**
   *  拷贝字符串到剪切板
   */
  static CopyToClipboard(val: string): boolean {
    if (!val) {
      return false;
    }
    let input = document.createElement("input");
    input.value = val;
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length);
    document.execCommand("Copy");
    document.body.removeChild(input);
    return true;
  }

  /**
   * 给字体添加描边
   */
  public static addLableStrokeColor(lable, color, width) {
    lable.strokeColor = color;
    lable.stroke = width;
  }
  /**
   * 获取一个对象的长度
   * @param list
   */
  public static getObjectLength(list) {
    var num = 0;
    for (var i in list) {
      num++;
    }
    return num;
  }
  /**
   * 深度复制
   * @param _data
   */
  public static copyDataHandler(obj) {
    var newObj;
    if (obj instanceof Array) {
      newObj = [];
    } else if (obj instanceof Object) {
      newObj = {};
    } else {
      return obj;
    }
    var keys = Object.keys(obj);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      newObj[key] = this.copyDataHandler(obj[key]);
    }
    return newObj;
  }

  public static CopyTo(src, des) {
    var keys = Object.keys(src);
    for (let key of keys) {
      des[key] = this.copyDataHandler(src[key]);
    }
  }

  public static labelIsOverLenght(label, num) {
    label.text = this.overLength(num);
  }

  public static overLength(num, isInt: boolean = false) {
    if (num == null) {
      return "";
    }
    var str = null;
    if (num < 100000) {
      str = num;
    } else if (num >= 100000000) {
      // num = (num / 100000000);
      // num = Math.floor(num * 10) / 10;
      // str = num + "亿";
      if (num >= 1000000000) {
        num = num / 100000000;
        num = Math.floor(num * 100) / 100;
        str = num + LangManager.Instance.GetTranslation("CommonUtils.text1");
      } else {
        str =
          Math.floor(num / 100000000) +
          LangManager.Instance.GetTranslation("CommonUtils.text1");
        num = num % 100000000;
        if (num > 10000) {
          str +=
            Math.floor(num / 10000) +
            LangManager.Instance.GetTranslation("CommonUtils.text2");
        }
      }
    } else {
      num = num / 10000;
      num = Math.floor(num * 10) / 10;
      if (isInt) num = Math.floor(num);
      str = num + LangManager.Instance.GetTranslation("CommonUtils.text2");
    }
    return str;
  }

  public static GetArray(
    dict: any,
    sortKey: string = null,
    ascendingOrder = true,
  ): any[] {
    if (dict == null) {
      return [];
    }
    let list = [];
    for (let key in dict) {
      let data = dict[key];
      list.push(data);
    }
    if (sortKey) {
      try {
        if (ascendingOrder) {
          list.sort(function (lhs, rhs) {
            return lhs[sortKey] - rhs[sortKey];
          });
        } else {
          list.sort(function (lhs, rhs) {
            return rhs[sortKey] - lhs[sortKey];
          });
        }
      } catch (e) {}
    }
    return list;
  }

  /** 最大位移长度 **/
  private static MAX_BIT_LEN: number = 32;
  /**
   * 将一个uint类型的整数转换为指定长度的Boolean元素数组
   * <li>外部要保存转换的值则必须传入result</li>
   * <li>如果没传入result, 则外部只引用, 不去增减</li>
   * @param value 需要转换的uint值
   * @param len 需要转换出来的数组的长度, 如果大于32, 则限制为32
   * @return 返回uint转换的boolean数组
   */
  public static uintToVecBool(value: number, len: number): boolean[] {
    if (len > Utils.MAX_BIT_LEN) len = Utils.MAX_BIT_LEN;
    let result = [];
    let i: number;
    for (i = 0; i < len; i++) result[i] = (value & (1 << i)) > 0;
    return result;
  }

  /**
   * 将一个 Vector.&lt;Boolean> 转换为一个32位整数
   * @param data 需要转换的原始数组。如果数组是以非数字为索引, 则直接返回0；如果元素是非Boolea类型的值, 则自动将元素int化后, 取其与0的比较值为Boolean
   * @return 返回boolean数组合成后的uint数值
   */
  public static vecBoolToUint(data: boolean[]): number {
    if (null == data) return 0;
    let len: number = data.length;
    if (0 == len) return 0;
    if (len > Utils.MAX_BIT_LEN) len = Utils.MAX_BIT_LEN;
    let i: number;
    let saveValue: number = 0;
    let value: number;
    for (i = 0; i < len; i++) {
      value = true == data[i] ? 1 : 0;
      saveValue = saveValue | (value << i);
    }
    data = null;
    return saveValue;
  }

  public static ArrayEqual(arr1: any[], arr2: any[]): boolean {
    if (!arr1 || !arr2) {
      return false;
    }
    if (arr1.length != arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * s = at*at/2
   * @param a
   * @param s
   */
  static getV(a: number, s: number): number {
    let h = 0;
    let v0 = 0;
    let t = 0;
    if (a > 0) {
      while (h < s) {
        v0 += a;
        h += v0;
        t++;
      }
    }
    return v0;
  }

  static getItemType(id: number) {
    return Math.floor(id / 1000);
  }

  /**
   * 获得帧数对应的时间
   * @param frameCount
   */
  // static getFrameTime(frameCount: number) {
  //     return frameCount * DeltaTime.getDeltaTime();
  // }

  static getDir(num: number) {
    if (num != 0) {
      return num / Math.abs(num);
    }
  }

  // 解密算法也可以公开
  static decrypt(cipherText, key) {
    return cipherText ^ key;
  }

  /**
   * 创建类
   * @param cls 脚本名称
   */
  static ObjectTO(cls: any): any {
    return new cls();
  }

  /**随机一个范围 min~max 的整数
   * @param min 范围的最小值, 或者一个2元素的数组
   * @param max 范围的最大值, 或者为空
   * @example
   * GNum.randomInt(1, 10);
   * GNum.randomInt([1, 10]);
   */
  static randomInt(min: number | number[], max?: number) {
    if (Array.isArray(min) && typeof max == "undefined") {
      max = min[1];
      min = min[0];
    }
    return Math.floor(Math.random() * (max - <number>min + 1)) + <number>min;
  }

  /**随机一个范围 min~max 的小数
   * @param min 范围的最小值, 或者一个2元素的数组
   * @param max 范围的最大值, 或者为空
   * @example
   * GNum.randomInt(1, 8);
   * GNum.randomInt([2.3, 12.3]);
   */
  static random(min: number | number[], max?: number) {
    if (Array.isArray(min) && typeof max == "undefined") {
      max = min[1];
      min = min[0];
    }
    let ratio = Math.random();
    return <number>min + (max - <number>min) * ratio;
  }

  /**随机一个 -1 ~ 1 的小数
   * @example
   * GNum.random_1To1();
   */
  random_1To1() {
    return Utils.random([-1, 1]);
  }

  /**将时间（单位: 秒）格式化成 min:sencond 的形式显示
   * @param time 时间的秒数
   * @example
   * GNum.timeFormatToMin(179); // "02:59"
   */
  timeFormatToMin(time: number) {
    //四舍五入取整
    time = Math.round(time);
    let min: number | string = Math.floor(time / 60);
    let sencond: number | string = time % 60;
    if (min < 10) {
      min = "0" + min;
    }
    if (sencond < 10) {
      sencond = "0" + sencond;
    }
    return min + ":" + sencond;
  }

  /**将时间（单位: 秒）格式化成 hour:min:sencond 的形式显示
   * @param time 时间的秒数
   * @example
   * GNum.timeFormatToMin(3601); // "01:00:01"
   */
  timeFormatToHour(time: number) {
    //四舍五入取整
    time = Math.round(time);
    let hour: number | string = Math.floor(time / 3600);
    if (hour < 10) {
      hour = "0" + hour;
    }
    let min = this.timeFormatToMin(time % 3600);
    return hour + ":" + min;
  }

  /**限制一个数的范围, 返回限制后的结果
   * @param num 要限制的数字
   * @param range 一个2个数字的数字, 表示数字限制的范围
   * @example
   * GNum.clamp(16, [20, 30]); // 20
   * GNum.clamp(16, [1, 10]); // 10
   * GNum.clamp(16, [20, Infinity]); // 20
   */
  clamp(num: number, range: number[]) {
    let [min, max] = range;
    num = num < min ? min : num;
    num = num > max ? max : num;
    return num;
  }

  /**
   * 数字左边补零成需要的位数,最多补6个0
   * @param num 需要处理数字
   * @param length 输出的字符串长度
   */
  public static prefixInteger(num: number, length: number) {
    return ("000000" + num).substring(-length);
  }
  /**
   * 延迟几帧调用
   * @param delay 延迟的帧数
   * @param caller
   */
  public static async frameOnceAsync(
    delay: number,
    caller: any,
  ): Promise<void> {
    return new Promise((resolve) => {
      Laya.timer.frameOnce(delay, caller, () => {
        resolve();
      });
    });
  }

  private static checkType(any) {
    return Object.prototype.toString.call(any).slice(8, -1);
  }

  /**
   * @method 深复制一个Object对象
   * @param source 需要深复制的对象
   * @return 返回一个新的Object对象
   */
  public static deepCopy(target) {
    if (Utils.checkType(target) === "Object") {
      // 拷贝对象
      let o = {};
      for (let key in target) {
        o[key] = Utils.deepCopy(target[key]);
      }
      return o;
    } else if (Utils.checkType(target) === "Array") {
      // 拷贝数组
      var arr = [];
      for (let i = 0, leng = target.length; i < leng; i++) {
        arr[i] = Utils.deepCopy(target[i]);
      }
      return arr;
    } else if (Utils.checkType(target) === "Function") {
      // 拷贝函数
      return new Function("return " + target.toString()).call(this);
    } else if (Utils.checkType(target) === "Date") {
      // 拷贝日期
      return new Date(target.valueOf());
    } else if (Utils.checkType(target) === "RegExp") {
      // 拷贝正则
      return new RegExp(target);
    } else if (Utils.checkType(target) === "Map") {
      // 拷贝Map 集合
      let m = new Map();
      target.forEach((v, k) => {
        m.set(k, Utils.deepCopy(v));
      });
      return m;
    } else if (Utils.checkType(target) === "Set") {
      // 拷贝Set 集合
      let s = new Set();
      for (let val of target.values()) {
        s.add(Utils.deepCopy(val));
      }
      return s;
    }
    return target;
  }

  //获取url里面的参数
  public static GetUrlQueryString(name): any {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let url = window.decodeURI(window.location.search);
    var r = url.substring(1).match(reg);
    if (r != null) return r[2]; //注意这里不能用js里面的unescape方法
    return null;
  }

  /**
   * 等待
   * @param time 时间（毫秒）
   */
  public static delay(time: number): Promise<any> {
    return new Promise((res) => setTimeout(res, time));
  }

  public static clearDelay(target) {}

  /**
   * 闪烁
   * @param target 闪烁目标对象
   * @param disTime 间隔时间
   */
  public static flashTarget(
    target: fgui.GComponent | Laya.Sprite,
    effect: Laya.Filter = UIFilter.redFilter,
    delay: number = 300,
  ) {
    if (target) {
      Laya.timer.loop(delay, this, this.callFalshTarget, [target, effect]);
    }
  }

  private static callFalshTarget(target, effect) {
    if (!target) return;

    if (target instanceof fgui.GComponent && target.isDisposed) {
      return;
    }
    if (target instanceof Laya.Sprite && target.destroyed) {
      return;
    }

    if (target.filters && target.filters.length) {
      target.filters = [];
    } else {
      target.filters = [effect];
    }
  }

  /**
   * 闪烁
   * @param target 闪烁目标对象
   * @param disTime 间隔时间
   */
  public static clearflashTarget(target: fgui.GComponent | Laya.Sprite) {
    if (!target) return;

    if (target instanceof fgui.GComponent && target.isDisposed) {
      return;
    }
    if (target instanceof Laya.Sprite && target.destroyed) {
      return;
    }

    Laya.timer.clear(this, this.callFalshTarget);
    target.filters = [];
  }

  /**
   * 整数格式化长度, 长度不够在前面添加'0'
   * @param value
   * @param formatLen
   * @returns
   */
  public static numFormat(value: number, formatLen: number) {
    if (formatLen <= 0) return value;

    let str = value.toString();
    let fixLen = formatLen - str.length;
    if (fixLen > 0) {
      let fixStr = "";
      for (let index = 0; index < fixLen; index++) {
        fixStr = "0" + fixStr;
      }
      str = fixStr + str;
    }
    return str;
  }

  /**
   * 检测对象为空
   * @param obj
   * @returns
   */
  public static isEmpty(obj) {
    // 检验 undefined 和 null
    if (!obj && obj !== 0 && obj !== "") {
      return true;
    }
    if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
      return true;
    }
    if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }

  /**
   * 生成范围随机数
   * @param Min
   * @param Max
   * @returns
   */
  public static getRandomNum(Min: number, Max: number): number {
    var Range = Max - Min;
    var Rand = Math.random();
    return Min + Math.round(Rand * Range);
  }

  /**
   * 是否为360
   * @returns boolean
   */
  public static isFrom360(): boolean {
    let urlChannelID = Utils.GetUrlQueryString("channelId");
    if (urlChannelID == H5SDK_CHANNEL_ID.C_360) {
      return true;
    }
    return false;
  }

  /**
   * 是否为HY
   * @returns boolean
   */
  public static isFromHY(): boolean {
    let urlChannelID = Utils.GetUrlQueryString("channelId");
    if (
      urlChannelID == H5SDK_CHANNEL_ID.HY ||
      urlChannelID == H5SDK_CHANNEL_ID.HY_S
    ) {
      return true;
    }
    return false;
  }

  public static isFixAuto(): boolean {
    return (
      Utils.isQQHall() ||
      Utils.isLABA() ||
      Utils.isQQZone() ||
      Utils.isQQMobile()
    );
  }

  /**
   * 是否为腊八
   * @returns boolean
   */
  public static isLABA(): boolean {
    let urlChannelID = Utils.GetUrlQueryString("channelId");
    if (urlChannelID == H5SDK_CHANNEL_ID.LABA) {
      return true;
    }
    return false;
  }

  /**
   * 是否为QQhALL
   * @returns boolean
   */
  public static isQQHall(): boolean {
    let urlChannelID = Utils.GetUrlQueryString("channelId");
    if (urlChannelID == H5SDK_CHANNEL_ID.QQHall) {
      return true;
    }
    return false;
  }

  /**
   * 是否为QQ空间
   * @returns
   */
  public static isQQZone(): boolean {
    let urlChannelID = Utils.GetUrlQueryString("channelId");
    if (urlChannelID == H5SDK_CHANNEL_ID.QQZone) {
      return true;
    }
    return false;
  }

  /**
   * 是否为QQ移动大厅
   * @returns
   */
  public static isQQMobile(): boolean {
    let urlChannelID = Utils.GetUrlQueryString("channelId");
    if (urlChannelID == H5SDK_CHANNEL_ID.QQMobile) {
      return true;
    }
    return false;
  }

  /**
   * 是否为华为荣耀
   * @returns
   */
  public static isHUAWEIRY(): boolean {
    let isApp = Utils.isAndroid() || Utils.isIOS();
    let channelId: number = Number(
      ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.channelId,
      ),
    );
    let webFrom = Utils.GetUrlQueryString("channelId");
    let ids = [70012];
    let isHWRY = false;
    let isWebHWRY = false;
    if (ids.indexOf(channelId) != -1) isHWRY = true;
    if (ids.indexOf(Number(webFrom)) != -1) {
      isWebHWRY = true;
    }
    return (isApp && isHWRY) || isWebHWRY;
  }

  /**
   * 是否为4399
   * @returns boolean
   */
  public static isFrom4399(): boolean {
    let urlChannelID = Utils.GetUrlQueryString("channelId");
    if (urlChannelID == H5SDK_CHANNEL_ID.C_4399) {
      return true;
    }
    return false;
  }

  /**
   * 是否来源微端App
   * @returns boolean
   */
  public static isFromMicroApp(): boolean {
    let client = Utils.GetUrlQueryString("client");
    let version = Utils.GetUrlQueryString("version");
    if (Utils.isFrom360() && String(client) == "pc" && version == 3) {
      return true;
    }
    return false;
  }

  /**
   * 获取网页参数
   * @returns Object
   */
  public static getUrlParams(): object {
    let value = {};
    let user = null;
    let webfrom = Utils.GetUrlQueryString("from");
    if (Utils.GetUrlQueryString("param") != null) {
      let param = Utils.GetUrlQueryString("param"); //Base64加密
      let gamevalue = window.DESKEY;
      let unCode = CryptoUtils.decryptByDES(param, gamevalue);
      let obj = {};
      let objData: string[] = unCode.split("&");
      let count = objData.length;
      for (let index = 0; index < count; index++) {
        let element = objData[index];
        let elementTemp = element.split("=");
        let key = elementTemp[0];
        let value = elementTemp[1];
        if (key) obj[key] = value;
      }
      user = obj["user"];
      let key = obj["key"];
      let site = obj["site"];
      let from = obj["from"];
      let token = obj["token"];
      let tamp = obj["tamp"];
      let channel = obj["reg_channel"];
      let c_medium = obj["c_medium"];
      let logTag = obj["logTag"];
      let deviceNo = "";
      let channelParam = "";
      if (webfrom == ChannelSTR.H5SDK) {
        deviceNo = obj["deviceNo"];
        channelParam = decodeURIComponent(obj["channelParam"]);
      }
      value = {
        user: user,
        key: key,
        site: site,
        from: from,
        token: token,
        tamp: tamp,
        channel: channel ? channel : "",
        medium: c_medium ? c_medium : "",
        deviceNo: deviceNo ? deviceNo : "",
        channelParam: channelParam ? channelParam : "",
        logTag: logTag ? logTag : "",
      };
    } else {
      user = Utils.GetUrlQueryString("user");
      let key = Utils.GetUrlQueryString("key");
      let site = Utils.GetUrlQueryString("site");
      let from = Utils.GetUrlQueryString("from");
      let token = Utils.GetUrlQueryString("token");
      let logTag = Utils.GetUrlQueryString("logTag");
      value = {
        user: user,
        key: key,
        site: site,
        from: from,
        token: token,
        logTag: logTag ? logTag : "",
      };
    }

    if (user) return value;
    else return null;
  }

  public static isPC(): boolean {
    return Laya.Browser.onPC;
  }

  public static isApp(): boolean {
    return Utils.isIOS() || Utils.isAndroid() || Utils.isWebView();
  }

  //是否使用astc格式文件
  public static get useAstc(): boolean {
    if (this.isWxMiniGame()) {
      return window.Wx7ktx;
    }

    return !this.isWxMiniGame() && this.isApp() && window.useAstc;
  }

  //返回true表示为pc端打开, 返回false表示为手机端打开
  public static get isPCBrowser() {
    var userAgentInfo = Laya.Browser.userAgent;
    var Agents = [
      "Android",
      "iPhone",
      "SymbianOS",
      "Windows Phone",
      "iPad",
      "iPod",
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  public static isIOS(): boolean {
    return (
      Laya.Browser.window.conchConfig &&
      Laya.Browser.window.conchConfig.getOS() == "Conch-ios"
    );
  }

  public static isAndroid(): boolean {
    return (
      Laya.Browser.window.conchConfig &&
      Laya.Browser.window.conchConfig.getOS() == "Conch-android"
    );
  }

  /**获取Android版本号 */
  public static get AndroidVersion(): string {
    let version: string = "";
    if (this.isAndroid()) {
      version = Laya.Browser.window.conchConfig.getAppVersion();
    }
    return version;
  }

  /**获取Android版本号 */
  public static get iOSVersioin(): string {
    let version: string = "";
    if (this.isIOS()) {
      version = Laya.Browser.window.conchConfig.getAppVersion();
    }
    return version;
  }

  /**
   * 根据versionName获取数字格式的版本号
   * @param versionName
   */
  public static getAppNumByName(versionName: string): number {
    let arr = versionName.split(".");
    return (
      parseInt(arr[0]) * 100000000 +
      parseInt(arr[1]) * 100000 +
      parseInt(arr[2]) * 100
    );
  }

  public static isWebWan(): boolean {
    let webFrom = Utils.GetUrlQueryString("from");
    if (webFrom) {
      return webFrom == ChannelSTR.WEB_WAN;
    }
    return false;
  }

  public static isH5SDK(): boolean {
    let webFrom = Utils.GetUrlQueryString("from");
    if (webFrom) {
      return webFrom == ChannelSTR.H5SDK;
    }
    return false;
  }

  /**是否为VIVO */
  public static isVivo(): boolean {
    let isApp = Utils.isAndroid() || Utils.isIOS();
    let channelId: number = Number(
      ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.channelId,
      ),
    );
    let webFrom = Utils.GetUrlQueryString("channelId");
    let ids = [10070];
    let isVivo = false;
    let isWebVivo = false;
    if (ids.indexOf(channelId) != -1) isVivo = true;
    if (ids.indexOf(Number(webFrom)) != -1) {
      isWebVivo = true;
    }
    return (isApp && isVivo) || isWebVivo;
  }

  /**是否为华为 */
  public static isHUAWEI(): boolean {
    let isApp = Utils.isAndroid() || Utils.isIOS();
    let channelId: number = Number(
      ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.channelId,
      ),
    );
    let webFrom = Utils.GetUrlQueryString("channelId");
    let ids = [10022];
    let isHW = false;
    let isWebHW = false;
    if (ids.indexOf(channelId) != -1) isHW = true;
    if (ids.indexOf(Number(webFrom)) != -1) {
      isWebHW = true;
    }
    return (isApp && isHW) || isWebHW;
  }

  /**是否为应用宝 */
  public static isYYBApp(): boolean {
    let isApp = Utils.isAndroid() || Utils.isIOS();
    let channelId: number = Number(
      ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.channelId,
      ),
    );
    let webFrom = Utils.GetUrlQueryString("channelId");
    let ids = [10150];
    let isYYB = false;
    let isWebYYB = false;
    if (ids.indexOf(channelId) != -1) isYYB = true;
    if (ids.indexOf(Number(webFrom)) != -1) {
      isWebYYB = true;
    }
    return (isApp && isYYB) || isWebYYB;
  }

  /**是否为OppoApp */
  public static isOppoApp(): boolean {
    let isApp = Utils.isAndroid() || Utils.isIOS();
    let channelId: number = Number(
      ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.channelId,
      ),
    );
    let ids = [10110];
    let isOppo = false;
    if (ids.indexOf(channelId) != -1) isOppo = true;
    return isApp && isOppo;
  }

  public static isWanApp(): boolean {
    let isApp = Utils.isAndroid() || Utils.isIOS();
    let channelId: number = Number(
      ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.channelId,
      ),
    );
    let ids = [10000, 19001, 20200, 60000];
    let isWan = false;
    if (ids.indexOf(channelId) != -1) isWan = true;
    return isApp && isWan;
  }

  public static isFCC(): boolean {
    let params: any = this.getUrlParams();
    if (params) {
      return params.from == ChannelSTR.FCC;
    }
    return false;
  }

  public static isWebView(): boolean {
    return Utils.GetUrlQueryString("webView") == "true";
  }

  /** 微信小游戏 */
  public static isWxMiniGame(): boolean {
    return Laya.Browser._isMiniGame;
  }

  /**是否为火狐浏览器 */
  public static isFirfox(): boolean {
    var str = "";
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      str = "Firefox";
    }
    return str == "Firefox";
  }

  public static isIE(): boolean {
    var str = "";
    if (navigator.userAgent.indexOf("MSIE") > 0) {
      str = "MSIE";
    }
    return str == "MSIE";
  }

  public static isSafari(): boolean {
    var str = "";
    if (navigator.userAgent.indexOf("Safari") > 0) {
      str = "Safari";
    }
    return str == "Safari";
  }

  public static isCamino(): boolean {
    var str = "";
    if (navigator.userAgent.indexOf("Camino") > 0) {
      str = "Camino";
    }
    return str == "Camino";
  }

  public static isGecko(): boolean {
    var str = "";
    if (navigator.userAgent.indexOf("Gecko/") > 0) {
      str = "Gecko";
    }
    return str == "Gecko";
  }

  /**
   * 把阿拉伯数字单位转换成中文大写
   * @param num 阿拉伯数字
   * @param simple 是否简体
   * @return 中文大写
   */
  public static toCNUpper(num: number, lang: string = "zhcn"): string {
    Utils.NUM_ARR = Utils.NUM_CN;
    Utils.UNITS_ARR = Utils.UNITS;
    if (num == 0) return Utils.NUM_ARR[0][lang];

    var numStr: string = num.toFixed(2);
    var pos: number = numStr.indexOf(".");
    var dotLeft: string = pos == -1 ? numStr : numStr.substring(0, pos);
    var dotRight: string =
      pos == -1 ? "" : numStr.substring(pos + 1, numStr.length);
    if (dotLeft.length > 16) throw new Error("数字太大, 无法处理！");

    var cnMoney: string =
      Utils.convertIntegerStr(dotLeft, lang) +
      Utils.convertDecimalStr(dotRight, lang);
    return cnMoney;
  }

  /**
   * 把数字中的小数部分进行转换
   * @param str
   * @return
   */
  private static convertDecimalStr(str: string, lang: string): string {
    var newStr: string = "";
    for (var i: number = 0; i < str.length; i++) {
      var n: number = parseInt(str.charAt(i).toString());
      if (n > 0)
        newStr += Utils.NUM_ARR[n][lang] + Utils.DECIMAL_UNITS[i][lang];
    }
    return newStr;
  }

  /**
   * 用数据方法得到数字整数部分长度
   * @param num
   * @return
   */
  public static getUnitCount(num: number): number {
    return Math.ceil(Math.log(num) / Math.LN10);
  }

  /**
   * 把数字中的整数部分进行转换
   * @param str
   * @return
   */
  private static convertIntegerStr(str: string, lang: string): string {
    var tCount: number = Math.floor(str.length / 4);
    var rCount: number = str.length % 4;
    var nodes: Array<any> = [];
    if (rCount > 0) {
      nodes.push(Utils.convertThousand(str.substring(0, rCount), tCount, lang));
    }
    for (var i: number = 0; i < tCount; i++) {
      var startIndex: number = rCount + i * 4;
      var num: string = str.substring(startIndex, startIndex + 4);
      nodes.push(Utils.convertThousand(num, tCount - i - 1, lang));
    }
    return Utils.convertNodes(nodes, lang);
  }

  private static convertNodes(nodes: Array<any>, lang: string): string {
    var str: string = "";
    var beforeZero: boolean;
    for (var i: number = 0; i < nodes.length; i++) {
      var node: ThousandNode = nodes[i] as ThousandNode;
      if (
        (beforeZero && node.desc.length > 0) ||
        (node.beforeZero && node.desc.length > 0 && str.length > 0)
      )
        str += Utils.NUM_ARR[0][lang];
      str += node.desc;
      if (node.afterZero && i < nodes.length - 1) beforeZero = true;
      else if (node.desc.length > 0) beforeZero = false;
    }
    return str;
  }

  /**
   * 对四位数进行处理, 不够自动补起
   * @param num
   * @param level
   * @return
   */
  private static convertThousand(
    num: string,
    level: number,
    lang: string = "zhcn",
  ): ThousandNode {
    var node: ThousandNode = new ThousandNode();
    var len: number = num.length;
    for (var i: number = 0; i < 4 - len; i++) num = "0" + num;
    var n1: number = parseInt(num.charAt(0).toString());
    var n2: number = parseInt(num.charAt(1).toString());
    var n3: number = parseInt(num.charAt(2).toString());
    var n4: number = parseInt(num.charAt(3).toString());

    if (n1 + n2 + n3 + n4 == 0) return node;

    if (n1 == 0) node.beforeZero = true;
    else node.desc += Utils.NUM_ARR[n1][lang] + Utils.UNITS_ARR[0][lang];

    if (n2 == 0 && node.desc != "" && n3 + n4 > 0)
      node.desc += Utils.NUM_ARR[0][lang];
    else if (n2 > 0)
      node.desc += Utils.NUM_ARR[n2][lang] + Utils.UNITS_ARR[1][lang];

    if (n3 == 0 && node.desc != "" && n4 > 0)
      node.desc += Utils.NUM_ARR[0][lang];
    else if (n3 > 0)
      node.desc += Utils.NUM_ARR[n3][lang] + Utils.UNITS_ARR[2][lang];

    if (n4 == 0) node.afterZero = true;
    else if (n4 > 0) node.desc += Utils.NUM_ARR[n4][lang];

    if (node.desc.length > 0) node.desc += Utils.LEVELS[level];
    return node;
  }

  public static isNumber(num) {
    num = Math.floor(num);
    var regPos = /^\d+$/; // 非负整数
    var regNeg = /^\-[1-9][0-9]*$/; // 负整数
    if (regPos.test(num) || regNeg.test(num)) {
      return true;
    } else {
      return false;
    }
  }
  //插值查找 数据必须是有序
  public static insertValueSearch<T>(
    arr: T[],
    left: number,
    right: number,
    findVal: number,
    property: string,
  ): number {
    // console.log("insertValueSearch 被调用次数");
    // 注意: findVal < arr[0] || findVal > arr[arr.length - 1] 必须需要, 否则得到的mid值可能越界
    if (
      left > right ||
      findVal < arr[0][property] ||
      findVal > arr[arr.length - 1][property]
    ) {
      return -1;
    }
    // 求出mid,因为是有序的, 可以预测值的方向和一个比例位置
    let mid =
      left +
      ((right - left) * (findVal - arr[left][property])) /
        (arr[right][property] - arr[left][property]);
    let midVal = arr[mid][property];
    if (findVal > midVal) {
      // 说明应该向右边递归
      return this.insertValueSearch(arr, mid + 1, right, findVal, property);
    } else if (findVal < midVal) {
      // 说明向左边递归
      return this.insertValueSearch(arr, left, mid - 1, findVal, property);
    } else {
      return mid;
    }
  }

  public static setDrawCallOptimize(target: fgui.GComponent | Laya.Sprite) {
    if (!target) return;
    if (target instanceof fgui.GComponent) {
      target.displayObject.drawCallOptimize = true;
    } else if (target instanceof Laya.Sprite) {
      target.drawCallOptimize = true;
    }
  }

  /**
   * 一定范围小尺寸图片，绘制在同一张自定义大图上，减少dc
   * @param target
   * @param target
   * @returns
   */
  public static setDrawCallDyna(target: Laya.Sprite, isB: boolean = false) {
    if (!target) return;
    if (isB) {
      target["dynaB"] = true;
    } else {
      target["dyna"] = true;
    }
  }

  /**
   * 是否为整数
   * @param value
   * @returns
   */
  public static isInteger(value: string): boolean {
    return parseInt(value) == parseFloat(value);
  }

  /**
   * 是否为小数
   * @param value
   * @returns
   */
  public static isFloat(value: string): boolean {
    return parseInt(value) < parseFloat(value);
  }

  public static colorRGB2Hex(color: Laya.Color): string {
    var strHex = "#";

    var strR = color.r.toString(16);
    strR = strR.length == 1 ? "0" + strR : strR;
    strHex += strR;

    var strG = color.g.toString(16);
    strG = strG.length == 1 ? "0" + strG : strG;
    strHex += strG;

    var strB = color.b.toString(16);
    strB = strB.length == 1 ? "0" + strB : strB;
    strHex += strB;

    var strA = color.a.toString(16);
    strA = strA.length == 1 ? "0" + strA : strA;
    strHex += strA;

    return strHex;
  }

  public static colorHex2RGB(strHex: string): Laya.Color {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = strHex.toLowerCase();
    if (reg.test(color)) {
      // 如果只有三位的值, 需变成六位, 如: #fff => #ffffff
      if (color.length === 4) {
        var colorNew = "#";
        for (var i = 1; i < 4; i += 1) {
          colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
        }
        color = colorNew;
      }
      // 处理六位的颜色值, 转为RGB
      var colorChange: number[] = [];
      for (var i = 1; i < 7; i += 2) {
        colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
      }
      return new Laya.Color(
        colorChange[0],
        colorChange[1],
        colorChange[2],
        255,
      );
    } else {
      return new Laya.Color();
    }
  }

  /**格式化时区 */
  public static formatTimeZone(i: number, zoneId: string): Date {
    if (typeof i !== "number") return;

    //本地时间与GMT时间的时间偏移差(注意: GMT这是UTC的民间名称。GMT=UTC）
    // var offset_GMT = new Date().getTimezoneOffset();//取出来为分钟
    //得到现在的格林尼治时间
    // var utcTime = new Date(i + offset_GMT * 60 * 1000 + offset);
    // return utcTime;

    var utcTime = new Date(
      new Date(i).toLocaleString("zh-CN", { timeZone: zoneId }),
    );
    return utcTime;
  }

  /**
   * 保留数据小数位(整数默认不保留小数, 小数值则传入保留对应传入小数位)
   * @param value 传入数值
   * @param fixedNumber 保留小数位
   * @returns number
   */
  public static toFixedNum(value: number, fixedNumber: number = 0): number {
    if (parseInt(String(value)) == parseFloat(String(value))) {
      return value;
    } else {
      let targetNumber = Math.pow(10, fixedNumber);
      let ret = Math.round(value * targetNumber) / targetNumber;
      return ret;
    }
  }

  /**
   * 按钮文字颜色
   * @param target 目标对象
   * @param enable enable
   */
  public static strokeColor(target: fgui.GButton, enable: boolean) {
    if (target instanceof fgui.GButton) {
      //@ts-expect-error: strokeColor is not a property of GButton
      target._titleObject.strokeColor = !enable ? "#666666" : "#7F2101";
    }
  }

  //清理GList Handle
  public static clearGListHandle(glist: fgui.GList) {
    if (!glist) return;
    if (glist.itemRenderer) {
      if (glist.itemRenderer instanceof Laya.Handler) {
        glist.itemRenderer.recover();
      }
      glist.itemRenderer = null;
    }

    if (glist.itemProvider) {
      if (glist.itemProvider instanceof Laya.Handler) {
        glist.itemProvider.recover();
      }
      glist.itemProvider = null;
    }
  }

  public static getObjectCount(object: object): number {
    let count = 0;
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        count++;
      }
    }
    return count;
  }

  /**
   * 将对象转换为字符串  用&符号拼接
   */
  public static stringify(param: object, skey: string = "&"): string {
    let ret = "";
    let count = this.getObjectCount(param);
    let index = 0;
    for (const key in param) {
      if (Object.prototype.hasOwnProperty.call(param, key)) {
        let item = param[key];
        let strValue = "";
        let str = "";
        if (item instanceof Object) {
          strValue = this.stringify(item);
          str = strValue;
        } else {
          strValue = item;
          str = key + "=" + strValue;
        }
        ret += str + (index < count - 1 ? skey : "");
        index++;
      }
    }
    return ret;
  }

  /**
   * 将base64字符串转换为二进制
   * @param dataurl
   * @param filename
   * @returns
   */
  static dataURLtoFile(dataurl: string): ArrayBuffer {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1]; //mime类型 image/png
    let bstr = atob(arr[1]); //base64 解码
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return u8arr.buffer;
  }

  /**设置对象的显示隐藏*/
  static setNodeVisible(node: Laya.Sprite | fgui.GComponent, active: boolean) {
    if (node instanceof fgui.GComponent) {
      node.visible = active;
      node.displayObject.active = active;
    } else {
      node.visible = active;
      node.active = active;
    }
  }
}

class ThousandNode {
  public beforeZero: boolean = false;
  public afterZero: boolean = false;
  public desc: string = "";
}
