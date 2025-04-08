import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import { getdefaultLangageCfg } from "../../../core/lang/LanguageDefine";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Utils from "../../../core/utils/Utils";
import { t_s_campaignData } from "../../config/t_s_campaign";
import OpenGrades from "../../constant/OpenGrades";
import { CampaignManager } from "../../manager/CampaignManager";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import ActivityTimeItem from "./ActivityTimeItem";

export default class ActivityTimeWnd extends BaseWindow {

    public backDialog: fgui.GLabel;
    public topBg: fgui.GImage;
    public line0: fgui.GImage;
    public line1: fgui.GImage;
    public line2: fgui.GImage;
    public titleName: fgui.GTextField;
    public titleCondition: fgui.GTextField;
    public titleSTime: fgui.GTextField;
    public titleLTime: fgui.GTextField;
    public bottomBg: fgui.GImage;
    public sRestTimeDesc: fgui.GTextField;
    public sResetTime: fgui.GTextField;
    public lResetTimeDesc: fgui.GTextField;
    public lResetTime: fgui.GTextField;
    public ayList: fgui.GList;
    //重置时间
    private resetTime = "05:00";

    private listData: ActivityTimeData[];

    public OnInitWind() {
        this.setCenter();
        this.addListenerEvent();
        this.initData();
    }

    private addListenerEvent() {
        this.ayList.itemRenderer = Laya.Handler.create(this, this.onItemRender, null, false);
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }


    private initData() {

        this.listData = [
            // 世界boss（开启），默认下一场，可展开     
            { title: LangManager.Instance.GetTranslation("funpreview.WorldBoss"), openCondition: "", openServerTimes: "", openLocalTimes: "", curServerTime: "", curLocalTime: "", grade: OpenGrades.WORLD_BOSS },

            // 多人竞技（开启 / 结束），默认下一场，可展开 
            { grade: OpenGrades.CHALLENGE, title: LangManager.Instance.GetTranslation("funpreview.PvpBattle"), openCondition: "", openServerTimes: "", openLocalTimes: "", curServerTime: "", curLocalTime: "" },

            // 战场（开启 / 结束），默认下一场，可展开 
            { grade: OpenGrades.RVR, title: LangManager.Instance.GetTranslation("funpreview.RvrBattle"), openCondition: "", openServerTimes: "", openLocalTimes: "", curServerTime: "", curLocalTime: "" },

            // 公会战（开启 / 结束、周X），默认下一场，可展开 

            { title: LangManager.Instance.GetTranslation("funpreview.ConsortiaBattle"), grade: OpenGrades.CONSORTIA, openCondition: "", openServerTimes: "", openLocalTimes: "", curServerTime: "", curLocalTime: "" },

            // 保卫英灵岛（开启 / 结束），默认下一场，可展开
            { grade: OpenGrades.PET, title: LangManager.Instance.GetTranslation("funpreview.PetBoss"), openCondition: "", openServerTimes: "", openLocalTimes: "", curServerTime: "", curLocalTime: "" },

            // 紫晶矿场（开启 / 结束）
            { grade: OpenGrades.STAR, title: LangManager.Instance.GetTranslation("funpreview.Mine"), openCondition: "", openServerTimes: "", openLocalTimes: "", curServerTime: "", curLocalTime: "" }

        ]

        this.sResetTime.text = this.resetTime;

        this.lResetTime.text = this.formatLocalTime(this.resetTime);

        this.setWorldBossState(this.listData[0]);
        this.setPvpBattle(this.listData[1]);
        this.setRvrBattle(this.listData[2]);
        this.setGuildWarState(this.listData[3]);
        this.setPetBossState(this.listData[4]);
        this.setMineState(this.listData[5])
        this.ayList.numItems = this.listData.length;
    }


    private onItemRender(index: number, item: ActivityTimeItem) {
        item.info = this.listData[index];
    }

    //世界Boss
    private setWorldBossState(data: ActivityTimeData) {
        var worldBossDic = ConfigMgr.Instance.worldBossDic;
        let openTimes: string[] = [];
        let openTimes2: string[] = [];

        let curTime: string = ""

        let sysTime = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        let currentMinutes = sysTime.getHours() * 60 + sysTime.getMinutes();

        for (const key in worldBossDic) {
            if (Object.prototype.hasOwnProperty.call(worldBossDic, key)) {
                const temp = worldBossDic[key] as t_s_campaignData;
                if (temp.Types != 1) continue;
                openTimes.push(temp.OpenTime);
                openTimes2.push(this.formatLocalTime(temp.OpenTime));
                let tt = temp.OpenTime.split(":");
                let tminu = +tt[0] * 60 + +tt[1];

                if (currentMinutes < tminu && !curTime) {
                    curTime = temp.OpenTime;
                }

            }
        }
        if (!curTime) {
            curTime = openTimes[0];
        }

        data.openServerTimes = openTimes.join("\n");
        data.openLocalTimes = openTimes2.join("\n")
        data.curServerTime = curTime;
        data.curLocalTime = this.formatLocalTime(curTime);
        data.openCondition = LangManager.Instance.GetTranslation("public.level3", data.grade);
    }


    //多人竞技
    private setPvpBattle(data: ActivityTimeData) {
        let str = TempleteManager.Instance.getConfigInfoByConfigName("MatchTime").ConfigValue;
        let sysTime = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        let currentMinutes = sysTime.getHours() * 60 + sysTime.getMinutes();
        let timeList = str.split("|");
        let openTimes: string[] = [];
        let openTimes2: string[] = [];
        let curOpenTime = "";
        let curOpenTime2 = "";

        let startTime = "";
        let stopTime = "";
        // let openTime = "";
        // let state: FunTypeState = FunTypeState.End;
        for (let timess of timeList) {
            let ss = timess.split(",");
            startTime = ss[0];
            stopTime = ss[1];
            let sh = +startTime.split(":")[0] * 60 + +startTime.split(":")[1];
            let eh = +stopTime.split(":")[0] * 60 + +stopTime.split(":")[1];

            openTimes.push(startTime + "-" + stopTime);
            openTimes2.push(this.formatLocalTime(startTime) + "-" + this.formatLocalTime(stopTime));

            //正在进行
            if (sh <= currentMinutes && eh >= currentMinutes) {
                // state = FunTypeState.Doing;
                continue
            }

            //未开始
            if (sh > currentMinutes && !curOpenTime) {
                curOpenTime = startTime + "-" + stopTime;
                curOpenTime2 = this.formatLocalTime(startTime) + "-" + this.formatLocalTime(stopTime);
                continue;
            }
            //已结束
            if (currentMinutes >= eh) {
                // state = FunTypeState.End;
                // openTime = "";
            }
        }

        if (!curOpenTime) {
            curOpenTime = openTimes[0];
            let sp = curOpenTime.split("-");
            curOpenTime2 = this.formatLocalTime(sp[0]) + "-" + this.formatLocalTime(sp[1]);
        }
        data.openServerTimes = openTimes.join("\n");
        data.curServerTime = curOpenTime;
        data.openLocalTimes = openTimes2.join("\n")
        data.curLocalTime = curOpenTime2;

        data.openCondition = LangManager.Instance.GetTranslation("public.level3", data.grade);
    }


    //战场状态
    private setRvrBattle(data: ActivityTimeData) {
        let pvpWarFightDic = ConfigMgr.Instance.pvpWarFightDic;

        let sysTime = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        let currentMinutes = sysTime.getHours() * 60 + sysTime.getMinutes();

        let openTime = "";
        let openTimes: string[] = [];
        let openTimes2: string[] = [];
        for (const key in pvpWarFightDic) {
            if (Object.prototype.hasOwnProperty.call(pvpWarFightDic, key)) {
                let temp: t_s_campaignData = pvpWarFightDic[key] as t_s_campaignData;
                if (temp.Types != 5) continue;
                openTimes.push(temp.OpenTime);
                openTimes2.push(this.formatLocalTime(temp.OpenTime));
                let ttt = temp.OpenTime.split(":");
                let sminutes = +ttt[0] * 60 + +ttt[1];
                if (!openTime && currentMinutes < sminutes) {
                    openTime = temp.OpenTime
                }
            }
        }
        if (!openTime) {
            openTime = openTimes[0];
        }
        data.openServerTimes = openTimes.join("\n");
        data.curServerTime = openTime;
        data.openLocalTimes = openTimes2.join("\n")
        data.curLocalTime = this.formatLocalTime(openTime);
        data.openCondition = LangManager.Instance.GetTranslation("public.level3", data.grade);

    }


    //公会战状态
    private setGuildWarState(data: ActivityTimeData) {
        let sysTime = PlayerManager.Instance.currentPlayerModel.sysCurtime;

        let currentMinutes = sysTime.getHours() * 60 + sysTime.getMinutes();

        let times = ConfigInfoManager.Instance.getGuildWarTime().split("|");

        let openTimes: string[] = [];
        let openTimes2: string[] = [];

        let curServerTime = "";
        for (let t of times) {
            openTimes.push(t.replace(",", "-"));
            let tt = t.split(",")
            openTimes2.push(this.formatLocalTime(tt[0]) + "-" + this.formatLocalTime(tt[1]));
            let ttt = tt[0].split(":");
            let ttt2 = tt[1].split(":")
            let sminutes = +ttt[0] * 60 + +ttt[1];
            let eminutes = +ttt2[0] * 60 + +ttt2[1];

            if (currentMinutes < sminutes && !curServerTime) {
                curServerTime = t.replace(",", "-");
            }

            if (currentMinutes > eminutes && !curServerTime) {
                curServerTime = t.replace(",", "-");
            }
        }

        if (!curServerTime) {
            curServerTime = openTimes[0]
        }

        data.openServerTimes = openTimes.join("\n");

        data.openLocalTimes = openTimes2.join("\n")

        data.curServerTime = curServerTime;

        let cur = curServerTime.split("-");

        data.curLocalTime = this.formatLocalTime(cur[0]) + "-" + this.formatLocalTime(cur[1]);

        let days = ConfigInfoManager.Instance.getGuildWarDay().split(",");

        let langCfg = getdefaultLangageCfg();
        let weeks = ""
        for (let d of days) {
            weeks += Utils.getWeekStr(+d, langCfg.key) + " "
        }

        data.openCondition = LangManager.Instance.GetTranslation("consortBoss.openTxt", weeks);

    }

    //设置英灵Boss状态
    private setPetBossState(data: ActivityTimeData) {
        let petBossModel = CampaignManager.Instance.petBossModel;

        let currentHour: number = petBossModel.playerModel.sysCurtime.getHours();

        let openTimeArr = petBossModel.openTimeArr;
        let openTimes: string[] = [];
        let openTimes2: string[] = [];
        let nextOpenTime = "";
        for (let t of openTimeArr) {

            if (currentHour < +t && !nextOpenTime) {
                nextOpenTime = t;
            }

            if (+t < 10) {
                t = "0" + t
            }
            openTimes.push(t + ":00");
            openTimes2.push(this.formatLocalTime(t + ":00"));
        }

        if (!nextOpenTime) {
            nextOpenTime = openTimeArr[0];
        }

        if (+nextOpenTime < 10) {
            nextOpenTime = "0" + nextOpenTime
        }
        nextOpenTime = nextOpenTime + ":00";
        data.openServerTimes = openTimes.join("\n");
        data.curServerTime = nextOpenTime;

        data.openLocalTimes = openTimes2.join("\n")
        data.curLocalTime = this.formatLocalTime(nextOpenTime);

        data.openCondition = LangManager.Instance.GetTranslation("public.level3", data.grade);
    }

    //紫晶矿场状态
    private setMineState(data: ActivityTimeData) {
        let sysTime = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        let currentMinutes = sysTime.getHours() * 60 + sysTime.getMinutes();
        // let state: FunTypeState = FunTypeState.End;
        // let openTime = "";
        let times = ConfigInfoManager.Instance.getMineOfActiveTime();

        let tl = times.split(",");

        let st = tl[0];
        let et = tl[1];

        let ttt = st + "-" + et;

        let ttt2 = this.formatLocalTime(st) + "-" + this.formatLocalTime(et);

        data.openServerTimes = ttt;
        data.curServerTime = ttt;

        data.openLocalTimes = ttt2
        data.curLocalTime = ttt2;

        data.openCondition = LangManager.Instance.GetTranslation("public.level3", data.grade);

    }

    //格式化
    private formatLocalTime(t: string) {
        if (!t) return "";
        let tt = t.split(":");
        let hour = +tt[0];
        let minutes = +tt[1];
        let ctime = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        ctime.setHours(hour);
        ctime.setMinutes(minutes);
        //本地时区 与UTC0的时间差值
        let curOffsetZone = 0 - new Date().getTimezoneOffset() * 60 * 1000;
        //服务器时区 与UTC0的差值
        let serverZoneOffset = PlayerManager.Instance.currentPlayerModel.zoneOffset;

        //服务器和本地时间的相对差值
        let offSetZon = curOffsetZone - serverZoneOffset;

        ctime.setTime(ctime.getTime() + offSetZon);

        hour = ctime.getHours();
        minutes = ctime.getMinutes();

        let hh = hour + "";
        let mm = minutes + "";
        if (hour < 10) {
            hh = "0" + hour;
        }

        if (minutes < 10) {
            mm = "0" + minutes;
        }

        return hh + ":" + mm;
    }

    private removeEvent() {

    }
}

export type ActivityTimeData = {
    grade: number,
    title: string,
    openCondition: string,
    openServerTimes: string,
    openLocalTimes: string,
    curServerTime: string,
    curLocalTime: string
}