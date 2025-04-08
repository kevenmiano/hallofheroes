// @ts-nocheck
import { BufferDamageData } from "../../game/battle/data/BufferDamageData";
import Utils from "../utils/Utils";

const enum LOG_LEVEL_TYPES {
    DEBUG,
    SOCKET,
    LOG,
    BASE,
    INFO,
    WARN,
    ERROR,
    yyz,
    xjy,
    ricky,
    osj,
    zzh,
    outcityWar,
    battle,
}

const Log_Level_Names: Array<string> =
    [
        "debug",
        "socket",
        "log",
        "base",
        "info",
        "warn",
        "error",
        "yyz",
        "xjy",
        "ricky",
        "osj",
        "zzh",
        "城战",
        "战斗"
    ];

export default class Logger {
    public static tag: string = "";//"[WartuneLog]"; //可以设置当前游戏的前缀

    /**
     * 当前Logger过滤器, 在列表里的才显示日志
     * log先不要用了
    */
    public static logFilters: number[] = [
        LOG_LEVEL_TYPES.DEBUG,   // 调试模块公用
        LOG_LEVEL_TYPES.SOCKET, // 协议
        // LOG_LEVEL_TYPES.LOG,
        LOG_LEVEL_TYPES.BASE,  // 通用基本信息
        LOG_LEVEL_TYPES.INFO,  // 模块信息
        LOG_LEVEL_TYPES.WARN,  // 警告
        LOG_LEVEL_TYPES.ERROR, // 错误信息
        LOG_LEVEL_TYPES.yyz,
        LOG_LEVEL_TYPES.xjy,
        // LOG_LEVEL_TYPES.osj,
        // LOG_LEVEL_TYPES.ricky,
        LOG_LEVEL_TYPES.outcityWar,
        LOG_LEVEL_TYPES.battle,
    ];


    private static consoleObject: Object;


    // public static Log_Color_Config: Array<string> = [
    //     "background: #ffffff;padding: 1px;border-radius: 2px 0 0 2px;color:#890;font-size:10px;",
    //     "background: #ffffff;padding: 1px;border-radius: 2px 0 0 2px;color:#890;font-size:10px;",
    //     "background: #ffffff;padding: 1px;border-radius: 2px 0 0 2px;color:#890;font-size:10px;",
    //     "background: #ffffff;padding: 1px;border-radius: 2px 0 0 2px;color:#000;font-size:11px;",
    //     "background: #ffffff;padding: 1px;border-radius: 2px 0 0 2px;color:#f90;font-size:12px;",
    //     "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color:#09f;font-size:13px;",
    //     "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color:#f90;font-size:13px;",
    //     "background: #00ff00;padding: 1px;border-radius: 2px 0 0 2px;color:#f00;font-size:15px;",
    //     "background: #00ff00;padding: 1px;border-radius: 2px 0 0 2px;color:#f00;font-size:15px;",
    // ];
    public static Log_Color_Config: Array<string> = [
        "color:#890;font-size:10px;",
        "color:#890;font-size:10px;",
        "color:#890;font-size:10px;",
        "color:#000;font-size:11px;",
        "color:#f90;font-size:12px;",
        "color:#09f;font-size:13px;",
        "color:#f90;font-size:13px;",
        "color:#f00;font-size:14px;",
        "color:#f00;font-size:14px;",
    ];

    public static LogWndStr: Array<string> = []
    public static addLogWndStr(str: string) {
        this.LogWndStr.push("[" + Logger.formatNow2() + "]" + str)
    }

    private static Terminal_Log: boolean = false;

    // 日志总开关
    private static _open: boolean = true;

    public static set open(b: boolean) {
        if (!this.consoleObject) {
            this.consoleObject = {
                "error": console.error,
                "debug": console.debug,
                "warn": console.warn,
                "info": console.info,
                "log": console.log
            };
        }

        if (b) {
            console.debug = this.consoleObject["debug"];
            console.log = this.consoleObject["log"];
            console.info = this.consoleObject["info"];
            console.warn = this.consoleObject["warn"];
            console.error = this.consoleObject["error"];

        } else {
            console.error = function () {
            };

            console.warn = function () {
            };

            console.info = function () {
            };
            console.log = function () {
            };

            console.debug = function () {
            };


        }

        this._open = b;
    }

    /**
     * 记录开始计时
     * @param describe  标题描述
     */
    static start(describe: string = "Time"): void {
        console.time(describe);
    }

    /**
     * 打印范围内时间消耗
     * @param describe  标题描述
     */
    static end(describe: string = "Time"): void {
        console.timeEnd(describe);
    }

    public static get open() {
        return this._open;
    }

    // 战斗buff开关
    public static openBattleBuff: boolean = false;
    public static buffIds = [
        30311, 30321, 30331, 30341, 30351,//法师-诅咒
        31311, 31321, 31331, 31341, 31351,//法师-晓之光
        31211, 31221, 31231, 31241, 31251,//法师-恢复
        30911, 30921, 30931, 30941, 30951,//法师-鸣雷
        10611, 10621, 10631, 10641, 10651,//战士-反伤 -- 回合&&次数
        10311, 10321, 10331, 10341, 10351,//战士-截取 -- 回合
        9801, 9802,//流血符文
        9201, 9210,//狂暴符文

    ]
    public static openBattleBuffCon(buffer: BufferDamageData) {
        // if (Logger.buffIds.indexOf(buffer.templateId) != -1) {
        //     return true
        // }
        return false
    };
    // 日志显示类名字开关
    public static openClassName: boolean = false;

    public static formatNow() {
        let date: Date = new Date(); //后端返回的时间戳是秒
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
    }

    public static formatNow2() {
        let date: Date = new Date(); //后端返回的时间戳是秒
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
    }

    private static getLogPreKey(nowLevel: number): string {
        let str: string = "[" + Logger.formatNow() + "]" + Logger.tag + "["
            + Log_Level_Names[nowLevel] + "]";
        return str;
    }

    public static debug(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.DEBUG) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.DEBUG);
        if (this.Terminal_Log) {
            // console.debug("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.DEBUG], ...params)
            console.debug.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.DEBUG], this.stack(5), str, ...params);
        } else {
            if (Utils.isApp()) {
                console.debug(str + params)
            }
            else {
                // console.debug(str, ...params)
                console.debug.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.DEBUG], this.stack(5), str, ...params);
            }
        }
    }

    public static socket(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.SOCKET) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.SOCKET);
        if (this.Terminal_Log) {
            // console.log("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.SOCKET], ...params)
            console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.SOCKET], this.stack(5), str, ...params);
        } else {
            if (Utils.isApp()) {
                console.log(str + params)
            }
            else {
                // console.log(str, ...params)
                console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.SOCKET], this.stack(5), str, ...params);
            }
        }
    }

    public static log(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.LOG) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.LOG);
        if (this.Terminal_Log) {
            // console.log(`%c + ${str}`, this.Log_Color_Config[LOG_LEVEL_TYPES.LOG], ...params)
            console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.LOG], this.stack(5), str, ...params);
        } else {
            if (Utils.isApp()) {
                console.log(str + params)
            }
            else {
                // console.log(str, ...params)
                console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.LOG], this.stack(5), str, ...params);
            }
        }
    }

    public static info(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.INFO) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.INFO);
        if (this.Terminal_Log) {
            // console.info("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.INFO], ...params)
            console.info.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.INFO], this.stack(5), str, ...params);
        } else {
            if (Utils.isApp()) {
                console.info(str + params)
            }
            else {
                // console.info(str, ...params)
                console.info.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.INFO], this.stack(5), str, ...params);
            }
        }
    }

    public static warn(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.WARN) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.WARN);
        if (this.Terminal_Log) {
            // console.warn("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.WARN], ...params)
            console.warn.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.WARN], this.stack(5), str, ...params);
        } else {
            if (Utils.isApp()) {
                console.warn(str + params)
            }
            else {
                // console.warn(str, ...params)
                console.warn.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.WARN], this.stack(5), str, ...params);
            }
        }
    }

    public static error(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.ERROR) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.ERROR);
        if (this.Terminal_Log) {
            // console.error("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.ERROR], ...params)
            console.error.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.ERROR], this.stack(5), str, ...params);
        } else {
            if (Utils.isApp()) {
                console.error(str + params)
            }
            else {
                // console.error(str, ...params)
                console.error.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.ERROR], this.stack(5), str, ...params);
            }
        }
    }

    public static base(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.BASE) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.BASE);
        if (this.Terminal_Log) {
            // console.info("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.BASE], ...params)
            console.info.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.BASE], this.stack(5), str, ...params);
        } else {
            if (Utils.isApp()) {
                console.info(str + params)
            }
            else {
                // console.info(str, ...params)
                console.info.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.BASE], this.stack(5), str, ...params);
            }
        }
    }

    public static yyz(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.yyz) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.yyz);
        if (this.Terminal_Log) {
            console.warn.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.yyz], this.stack(5), str, ...params);
            // console.warn("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.yyz], ...params)
        } else {
            if (Utils.isApp()) {
                console.warn(str + params)
            } else {
                // console.warn(str, ...params)
                console.warn.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.yyz], this.stack(5), str, ...params);
            }
        }
    }
    public static xjy(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.xjy) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.xjy);
        if (this.Terminal_Log) {
            console.warn.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.xjy], this.stack(5), str, ...params);
        } else {
            if (Utils.isApp()) {
                console.warn(str + params)
                // 
            } else {
                // console.warn(str, ...params)
                console.warn.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.xjy], this.stack(5), str, ...params);
            }
        }
    }

    public static ricky(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.ricky) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.ricky);
        if (this.Terminal_Log) {
            console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.ricky], this.stack(5), str, ...params);
            // console.log("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.ricky], ...params)
        } else {
            // console.log(str, ...params)
            console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.ricky], this.stack(5), str, ...params);
        }
    }

    public static outcityWar(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.outcityWar) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.outcityWar);
        if (this.Terminal_Log) {
            console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.INFO], this.stack(5), str, ...params);
            // console.log("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.ricky], ...params)
        } else {
            // console.log(str, ...params)
            console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.INFO], this.stack(5), str, ...params);
        }
    }

    public static battle(...params: any[]) {
        if (!Logger._open || Logger.logFilters.indexOf(LOG_LEVEL_TYPES.battle) == -1) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.battle);
        if (this.Terminal_Log) {
            console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.INFO], this.stack(5), str, ...params);
            // console.log("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.ricky], ...params)
        } else {
            // console.log(str, ...params)
            console.log.call(null, "%c%s%s:%s", this.Log_Color_Config[LOG_LEVEL_TYPES.INFO], this.stack(5), str, ...params);
        }
    }

    private static stack(index: number = 5): string {
        if (!Logger.openClassName) return "";

        var e = new Error();
        var lines = e.stack!.split("\n");
        var result: Array<any> = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            }
            else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });

        var list: string[] = [];
        var splitList: Array<string> = [];
        if (index < result.length - 1) {
            var value: string;
            for (var a in result[index]) {
                var splitList = a.split(".");

                if (splitList.length == 2) {
                    list = splitList.concat();
                }
                else {
                    value = result[index][a];
                    var start = value!.lastIndexOf("/");
                    var end = value!.lastIndexOf(".");
                    if (start > -1 && end > -1) {
                        var r = value!.substring(start + 1, end);
                        list.push(r);
                    }
                    else {
                        list.push(value);
                    }
                }
            }
        }

        if (list.length == 1) {
            return "[" + list[0] + ".ts]";
        }
        else if (list.length == 2) {
            return "[" + list[0] + "." + list[1] + "]";
        }
        return "";
    }
}

//@ts-ignore
window.Logger = Logger;