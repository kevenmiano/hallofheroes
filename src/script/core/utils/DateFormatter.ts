/**
 * 日期工具类
 *
 */
import LangManager from "../lang/LangManager";

export class DateFormatter {
    /**
     * @param dateStr需要转化的目标时间字符串
     * @param formatStr目标时间字符串格式
     * @return 目标时间字符串的时间类型
     *
     */
    public static parse(dateStr: string, formatStr: string): Date {
        var date: Date;
        var str: any = dateStr;
        str = escape(str);
        formatStr = escape(formatStr);
        date = new Date(1296000000);  //默认值不要在28到1号之间, 不然跨时区时差转换后可能会出现对date.month赋值无效的情况, 比如更改日期是12月31号的月份为11是无效的, 11月没有31号
        formatStr.replace(/([YMDhms])\1*/g, function (param1: any, param2: any, param3: any, param4: any): string {
            var _loc_2: any = <string>param1;
            var _loc_3: any = param3;
            var _loc_4: any = parseInt(str.substr(_loc_3, _loc_2.length));
            switch (_loc_2.charAt()) {
                case "Y":
                    {
                        date.setFullYear(_loc_4);
                        break;
                    }
                case "M":
                    {
                        date.setMonth(_loc_4 - 1);
                        break;
                    }
                case "D":
                    {
                        date.setDate(_loc_4);
                        break;
                    }
                case "h":
                    {
                        date.setHours(_loc_4);
                        break;
                    }
                case "m":
                    {
                        date.setMinutes(_loc_4);
                        break;
                    }
                case "s":
                    {
                        date.setSeconds(_loc_4);
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
            return "";
        }// end function
        );
        return date;
    }

    /**
     *
     * @param date 需要转化的目标时间
     * @param formatStr 目标时间的时间格式
     * @return 目标时间的字符串格式
     */
    public static format(date: Date, formatStr: string): string {
        if (!date) {
            return "";
        }
        var str: string;
        str = formatStr.replace(/([YMDhms])\1*/g, function (param1: any, param2: any, param3: any, param4: any): string {
            var _loc_3: any;
            var _loc_2: any = <string>param1;
            switch (_loc_2.charAt()) {
                case "Y":
                    {
                        _loc_3 = DateFormatter.getIntStrAtLength(date.getFullYear(), _loc_2.length);
                        break;
                    }
                case "M":
                    {
                        _loc_3 = DateFormatter.getIntStrAtLength(date.getMonth() + 1, _loc_2.length);
                        break;
                    }
                case "D":
                    {
                        _loc_3 = DateFormatter.getIntStrAtLength(date.getDate(), _loc_2.length);
                        break;
                    }
                case "h":
                    {
                        _loc_3 = DateFormatter.getIntStrAtLength(date.getHours(), _loc_2.length);
                        break;
                    }
                case "m":
                    {
                        _loc_3 = DateFormatter.getIntStrAtLength(date.getMinutes(), _loc_2.length);
                        break;
                    }
                case "s":
                    {
                        _loc_3 = DateFormatter.getIntStrAtLength(date.getSeconds(), _loc_2.length);
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
            return _loc_3;
        }// end function
        );
        return str;
    }

    /**
     * 将给定的时间（秒）转化为从1970年1月1日午夜（通用时间）, 并返回星期值和日期值的字符串表示形式, 而不返回时间或时区。
     * @param para 时间, 单位（秒）
     * @return
     *
     */
    public static unix2ASDateString(para: number): string {
        var d: Date = new Date(para * 1000);
        return d.toDateString();
    }

    /**
     *  将给定的时间（秒）转化为从1970年1月1日午夜（通用时间）, 并按本地时间返回星期值、日期值以及时间的字符串表示形式
     * @param para 时间, 单位（秒）
     * @return
     *
     */
    public static unix2ASLocaleDateString(para: number): string {
        var d: Date = new Date(para * 1000);
        return d.toLocaleDateString();
    }

    /**
     *  将给定的时间（秒）转化为从1970年1月1日午夜（通用时间）, 并返回按照年月日时分秒显示的时间格式
     * @param para 时间, 单位（秒）
     * @return
     *
     */
    public static unix2ASString(para: number): string {
        var d: Date = new Date(para * 1000);
        return d.getFullYear() + "." + DateFormatter.getIntStrAtLength((d.getMonth() + 1), 2) + "." + DateFormatter.getIntStrAtLength(d.getDate(), 2) + "  " + DateFormatter.getIntStrAtLength(d.getHours(), 2) + ":" + DateFormatter.getIntStrAtLength(d.getMinutes(), 2) + ":" + DateFormatter.getIntStrAtLength(d.getSeconds(), 2);
    }

    /**
     *  返回给定时间格式化为 年-月-日  时:分的格式
     * @param $date
     * @return 2010-11-24 19:46
     *
     */
    public static timeFormat1($date: Date): string {
        var str: string = "";
        str += $date.getFullYear();
        str += "-" + ($date.getMonth() + 1);
        str += "-" + $date.getDate();
        str += "  " + DateFormatter.getIntStrAtLength($date.getHours(), 2);
        str += ":" + DateFormatter.getIntStrAtLength($date.getMinutes(), 2);
        return str;
    }

    /**
     *  返回给定时间格式化为 月-日  时:分的格式
     * @param $date
     * @return 12-20  13:15
     *
     */
    public static timeFormat2($date: Date): string {
        var str: string = "";
        str += ($date.getMonth() + 1);
        str += "-" + $date.getDate();
        str += "  " + DateFormatter.getIntStrAtLength($date.getHours(), 2);
        str += ":" + DateFormatter.getIntStrAtLength($date.getMinutes(), 2);
        return str;
    }

    /**
     *  返回给定时间格式化为 年-月-日 的格式
     * @param $date
     * @return 2012-12-15
     *
     */
    public static timeFormat3($date: Date, splitStr: string = "-"): string {
        var str: string = "";
        str += $date.getFullYear();
        str += splitStr + ($date.getMonth() + 1);
        str += splitStr + $date.getDate();
        return str;
    }

    /**
     * 返回指定数字中从第0位开始len长度的数字的字符串形式
     * 比如getIntStrAtLength(10221,3)返回102
     * @param figure
     * @param len
     */
    public static getIntStrAtLength(figure: number, len: number): string {
        var _loc_3: any = figure.toString();
        if (len > 1) {
            if (_loc_3.length > len) {
                _loc_3 = _loc_3.substr(-len);
            }
            else {
                while (_loc_3.length < len) {

                    _loc_3 = "0" + _loc_3;
                }
            }
        }
        return _loc_3;
    }

    /**
     * 将指定时间（秒）格式化为时分秒格式
     * @param secondCount 需要转化的时间
     * @param hourLen 显示的小时的位数
     * @param viewLen 按秒分时顺序显示的长度, 3显示时分秒, 2显示分秒
     * @return
     *
     */
    public static getCountDate(secondCount: number, hourLen: number = 2, viewLen: number = 3): string {
        var hour: number = Math.floor(secondCount / 3600);
        var minute: number = Math.floor((secondCount % 3600) / 60);
        var second: number = Math.floor(((secondCount % 3600) % 60));

        var rls: string;

        if (viewLen == 3) {
            rls = DateFormatter.getIntStrAtLength(hour, hourLen);
            rls += ":" + DateFormatter.getIntStrAtLength(minute, 2);
            rls += ":" + DateFormatter.getIntStrAtLength(second, 2);
        }
        else if (viewLen == 2) {
            rls = DateFormatter.getIntStrAtLength(minute, 2);
            rls += ":" + DateFormatter.getIntStrAtLength(second, 2);
        }
        return rls;
    }

    /**
     *  返回指定时间（秒）的时分秒格式, 每个单位显示为2位, 比如: 02:08:12
     * @param secondCount
     * @param needHour 是否需要显示小时 默认需要显示
     * @return
     *
     */
    public static getConsortiaCountDate(secondCount: number,needHour:boolean = true): string {
        var hour: number = Math.floor(secondCount / 3600);
        var minute: number = Math.floor((secondCount % 3600) / 60);
        var second: number = Math.floor(((secondCount % 3600) % 60));

        var rls: string = hour.toString();
        if(needHour){
            while (rls.length < 2) {
                rls = "0" + rls;
            }
            rls += ":" + DateFormatter.getIntStrAtLength(minute, 2);
            rls += ":" + DateFormatter.getIntStrAtLength(second, 2);
        }else{
            rls = DateFormatter.getIntStrAtLength(minute, 2);
            rls += ":" + DateFormatter.getIntStrAtLength(second, 2);
        }
        return rls;
    }

    /**
     * 通过总秒数获得分钟和秒数字符串
     * @param secondCount
     * @return
     *
     */
    public static getCountDateByMS(secondCount: number): string {
        var minute: number = Math.floor(secondCount / 60);
        var second: number = Math.floor(secondCount % 60);

        var rls: string = DateFormatter.getIntStrAtLength(minute, 2);
        rls += ":" + DateFormatter.getIntStrAtLength(second, 2);
        return rls;
    }

    /**
     * 通过分钟和秒数字符串获得总秒数
     * @param str
     * @return
     *
     */
    public static getSecondCountByMS(str: string): number {
        var array: any[] = str.split(":");
        var rls: number = Number(array[0]) * 60 + Number(array[1]);
        return rls;
    }

    /**
     * 返回天时分格式的时间字符串, 如: 2天6小时15分
     * @param sed
     * @return
     *
     */
    public static getStopDateString(sed: number, sig: boolean = true): string {
        var timeStr: string = "";
        var day: number = Math.floor(sed / (3600 * 24));
        var hour: number = Math.floor((sed - day * 24 * 3600) / 3600);
        var min: number = Math.ceil((sed - day * 24 * 3600 - hour * 3600) / 60);
        if (min == 60) {//避免出现11:60
            hour++;
        }
        if (day > 0) {
            timeStr += (day + LangManager.Instance.GetTranslation("public.day"));
        }
        if (hour > 0) {

            timeStr += (hour + LangManager.Instance.GetTranslation((sig ? "public.time.sigHour" : "public.time.hour")));
        }
        if (min > 0 && day <= 0) {
            if (min != 60) {
                timeStr += (min + LangManager.Instance.GetTranslation((sig ? "public.minute" : "yishi.utils.DateFormatter.timeStr.min")));
            }
        }
        return timeStr;
    }

    /**
     * 时间转换
     * @param ms 毫秒
     * @param middle 月天分隔符  例如    4.13 - 5.13
     * @param useCode 是否使用字符文字 .   4.  4月
     * @returns 
     */
    public static getMonthDayString(ms: number, middle: string = "", useCode: boolean = true): string {
        var timeStr: string = "";
        if (ms < 0) {
            return timeStr;
        }
        var date: Date = new Date();
        date.setTime(ms);
        let monthStr = (date.getMonth() + 1) + (useCode ? LangManager.Instance.GetTranslation("public.month") : "");
        let dayStr = date.getDate() + (useCode ? LangManager.Instance.GetTranslation("public.daily") : "");
        timeStr = monthStr + (middle ? middle : "") + dayStr;
        return timeStr;
    }

    /**
     * @param sed:秒
     * @param sig:简写
     * @return -天-小时-分
     */
    public static getFullTimeString(sed: number, sig: boolean = false, value: string = ""): string {
        var timeStr: string = "";
        if (sed < 0) {
            return timeStr;
        }
        var day: number = Math.floor(sed / (3600 * 24));
        var hour: number = Math.floor((sed - day * 24 * 3600) / 3600);
        var min: number = Math.floor((sed - day * 24 * 3600 - hour * 3600) / 60);
        var second: number = Number(sed - day * 24 * 3600 - hour * 3600 - min * 60);
        if (day > 0) {
            timeStr += (day + LangManager.Instance.GetTranslation("public.day"));
        }
        if (hour > 0) {
            timeStr += ((hour >= 10 ? "" : "0") + hour.toString() + LangManager.Instance.GetTranslation(value ? value : (sig ? "public.time.sigHour" : "public.time.hour")));
        }
        if (min > 0) {
            timeStr += ((min >= 10 ? "" : "0") + min.toString() + LangManager.Instance.GetTranslation(value ? value : (sig ? "public.minute" : "yishi.utils.DateFormatter.timeStr.min")));
        }
        if (second > 0)
            timeStr += second.toString() + LangManager.Instance.GetTranslation(value ? value : (sig ? "public.time.second" : "public.time.second"));
        return timeStr;
    }

    /**
     * @param sed:秒
     * @param sig:简写
     * @return -天-小时-分
     */
    public static getFormatTimeString(sed: number, split: string = ":"): string {
        var timeStr: string = "";
        if (sed < 0) {
            return timeStr;
        }
        var day: number = Math.floor(sed / (3600 * 24));
        var hour: number = Math.floor((sed - day * 24 * 3600) / 3600);
        var min: number = Math.floor((sed - day * 24 * 3600 - hour * 3600) / 60);
        var second: number = Number(sed - day * 24 * 3600 - hour * 3600 - min * 60);
        if (day > 0) {
            timeStr += (day + LangManager.Instance.GetTranslation("public.day"));
        }
        if (hour > 0) {
            timeStr += (day > 0 ? split : "") + ((hour > 10 ? "" : "0") + hour.toString());
        }
        if (min > 0) {
            timeStr += (hour > 0 ? split : "") + ((min > 10 ? "" : "0") + min.toString());
        }
        if (second > 0)
            timeStr += (min > 0 ? split : "") + ((second > 10 ? "" : "0") + second.toString());
        return timeStr;
    }

    /**
     * @param sed: 秒
     * @return -天/-小时/-分/-秒
     */
    public static getFullDateString(sed: number): string {
        var timeStr: string = "";
        if (sed < 0) {
            return timeStr;
        }
        var day: number = Math.floor(sed / (3600 * 24));
        var hour: number = Math.floor(((sed - day * 24 * 3600) / 3600));
        var min: number = Math.floor((sed - day * 24 * 3600 - hour * 3600) / 60);
        var second: number = Math.floor(sed - day * 24 * 3600 - hour * 3600 - min * 60);
        if (day > 0) {
            timeStr += (day + LangManager.Instance.GetTranslation("public.day"));
        }
        if (hour > 0) {
            timeStr += (hour + LangManager.Instance.GetTranslation("public.time.hour"));
        }
        if (min > 0) {
            timeStr += (min + LangManager.Instance.GetTranslation("yishi.utils.DateFormatter.timeStr.min"));
        }
        if (second > 0) {
            timeStr += (second + LangManager.Instance.GetTranslation("public.time.second"));
        }
        return timeStr;
    }

    /**
     * @param sed: 秒
     * @return -天/00:00:00
     */
    public static getSevenDateString(sed: number): string {
        var timeStr: string = "";
        if (sed < 0) {
            return timeStr;
        }
        var day: number = Math.floor(sed / (3600 * 24));
        var hour: number = Math.floor(((sed - day * 24 * 3600) / 3600));
        var min: number = Math.floor((sed - day * 24 * 3600 - hour * 3600) / 60);
        var second: number = Math.floor(sed - day * 24 * 3600 - hour * 3600 - min * 60);
        if (day > 0) {
            timeStr += (day + LangManager.Instance.GetTranslation("public.day"));
        }
        if (hour > 0) {
            timeStr += DateFormatter.getIntStrAtLength(hour, 2);
        } else {
            timeStr += "00";
        }
        if (min > 0) {
            timeStr += ":" + DateFormatter.getIntStrAtLength(min, 2);
        }
        else {
            timeStr += ":00";
        }
        if (second > 0) {
            timeStr += ":" + DateFormatter.getIntStrAtLength(second, 2);
        }
        else {
            timeStr += ":00";
        }
        return timeStr;
    }

    /**
     * @return 1970 年 1 月 1 日午夜（通用时间）与参数中指定的时间之间相差的毫秒数。
     * 例如DateFormatter.getUTCTimeStamp('2012-09-17 08:20:53',"YYYY-MM-DD hh:mm:ss");
     */
    public static getUTCTimeStamp(timeStr: string, formatStr: string): number {
        var year: number = 0;
        var month: number = 0;
        var date: number = 0;
        var hours: number = 0;
        var min: number = 0;
        var sed: number = 0;
        var str: any = timeStr;
        str = escape(str);
        formatStr = escape(formatStr);
        formatStr.replace(/([YMDhms])\1*/g, function (param1: any, param2: any, param3: any, param4: any): string {
            var _loc_2: any = <string>param1;
            var _loc_3: any = param3;
            var _loc_4: any = parseInt(str.substr(_loc_3, _loc_2.length));
            switch (_loc_2.charAt()) {
                case "Y":
                    {
                        year = _loc_4;
                        break;
                    }
                case "M":
                    {
                        month = _loc_4 - 1;
                        break;
                    }
                case "D":
                    {
                        date = _loc_4;
                        break;
                    }
                case "h":
                    {
                        hours = _loc_4;
                        break;
                    }
                case "m":
                    {
                        min = _loc_4;
                        break;
                    }
                case "s":
                    {
                        sed = _loc_4;
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
            return "";
        });
        return Date.UTC(year, month, date, hours, min, sed, 0);
    }

    /**
     *  获取某年某月的总天数
     * @param month: 月份
     * @param year: 年份
     * @return 总天数
     *
     */
    public static getMonthMaxDay(month: number, year: number): number {
        switch (month) {
            case 0:
                return 31;
            case 1:
                if (year % 4 == 0) {
                    return 29;
                }
                else {
                    return 28;
                }
            case 2:
                return 31;
            case 3:
                return 30;
            case 4:
                return 31;
            case 5:
                return 30;
            case 6:
                return 31;
            case 7:
                return 31;
            case 8:
                return 30;
            case 9:
                return 31;
            case 10:
                return 30;
            case 11:
                return 31;
            default:
                return 0;
        }
    }


    /** 将时间戳转换成年月日 */
    public static transDate(num: number): string {
        var date: Date = new Date(num * 1000);
        var m: string = date.getMinutes() + "";
        if (date.getMinutes() < 10) {
            m = "0" + m;
        }
        var d: string = date.getDate() + "";
        if (date.getDate() < 10) {
            d = "0" + d;
        }
        var h: string = date.getHours() + "";
        if (date.getHours() < 10) {
            h = "0" + h;
        }
        return LangManager.Instance.GetTranslation("public.dateType", date.getFullYear(), date.getMonth() + 1, d) + " " + h + ":" + m;
    }

    /** 将时间戳转换成年月日 只显示时分 */
    public static transDateToMin(num: number): string {
        var date: Date = new Date(num);
        var m: string = date.getMinutes() + "";
        if (date.getMinutes() < 10) {
            m = "0" + m;
        }
        var d: string = date.getDate() + "";
        if (date.getDate() < 10) {
            d = "0" + d;
        }
        var h: string = date.getHours() + "";
        if (date.getHours() < 10) {
            h = "0" + h;
        }
        return h + ":" + m;
    }

    /**
     *
     * 比较传入的时间还现在相距的天数
     *  */
    public static compareDay(date: Date): number {
        var date1: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
        var now: Date = new Date();
        var nowNum: number = now.getTime();
        var date2Num: number = date1.getTime();
        return Number((nowNum - date2Num) / 1000 / 60 / 60 / 24) + 1;
    }

    /**
     * 比较传入的时间还现在相距的天数
     * @param date 
     * @param svrdate 服务器当前时间
     * @returns 
     */
    public static compareDayIndex(date: Date, svrdate: Date): number {
        var date1: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0);
        var nowNum: number = svrdate.getTime();
        var date2Num: number = date1.getTime();
        return Number((nowNum - date2Num) / 1000 / 60 / 60 / 24) + 1;
    }

    /**
     * 比较传入的时间还现在相距的天数
     * @param sec 毫秒时间戳？
     * @param svrdate 服务器当前时间
     * @returns 
     */
    public static compareDayIndexBySec(sec: number, svrdate: Date): number {
        var nowNum: Date = new Date(svrdate.getTime());
        nowNum.setHours(0, 0, 0);//重置12点时间
        var date2Num: Date = new Date(sec);
        date2Num.setHours(0, 0, 0);//重置12点时间
        let differTime: number = nowNum.getTime() - date2Num.getTime();
        let differValue = Number(differTime / (1000 * 60 * 60 * 24));
        return differValue + 1;//
    }

    /**
         * 判断两个时间是否是同一天 
         * @param date01
         * @param date02
         * @return 
         * 
         */
    public static checkIsSameDay(date01: Date, date02: Date): boolean {
        if (date01.getFullYear() == date02.getFullYear() && date01.getMonth() == date02.getMonth() && date01.getDate() == date02.getDate()) {
            return true;
        }
        return false;
    }

    public static GetDay(date: Date): number {
        return date.getDay() == 0 ? 7 : date.getDay()
    }
}