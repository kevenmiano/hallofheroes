// @ts-nocheck
import LangManager from '../../core/lang/LangManager';
import Logger from "../../core/logger/Logger";
import { PackageIn } from '../../core/net/PackageIn';
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import ActiveInfo from "../module/activity/ActiveInfo";
import FunnyManager from "./FunnyManager";
import { MessageTipManager } from "./MessageTipManager";
import { PathManager } from "./PathManager";
import { PlayerManager } from "./PlayerManager";
import { ArrayConstant, ArrayUtils } from '../../core/utils/ArrayUtils';

import ActiveRspMsg = com.road.yishi.proto.active.ActiveRspMsg;
import HttpUtils from '../../core/utils/HttpUtils';
import ByteArray from '../../core/net/ByteArray';


export default class ActivityManager {
    private static _instance: ActivityManager;
    private _activityList: Array<ActiveInfo> = [];

    public static get Instance(): ActivityManager {
        if (!ActivityManager._instance) ActivityManager._instance = new ActivityManager();
        return ActivityManager._instance;
    }

    public setup() {
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_ACTIVE, this, this.__activityHandler);
    }

    private __activityHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ActiveRspMsg) as ActiveRspMsg;

        var arr: Array<any> = msg.activeRspInfo;
        var len: number = arr.length;
        this._activityList = [];
        for (var i: number = 0; i < len; i++) {
            var info: ActiveInfo = new ActiveInfo();
            info.endDate = DateFormatter.parse(arr[i].endDate, "YYYY-MM-DD hh:mm:ss").getTime() / 1000;
            info.startDate = DateFormatter.parse(arr[i].startDate, "YYYY-MM-DD hh:mm:ss").getTime() / 1000;
            info.sort = arr[i].sort;
            info.multiLangTitle = arr[i].title;
            info.grades = arr[i].grades;
            info.activeId = arr[i].activeId;
            info.multiLangContents = arr[i].contents;
            info.consortia = arr[i].consortia;
            info.multiLangDescription = arr[i].description;
            info.awardContent = arr[i].awardContent;
            info.actionTimeContent = arr[i].actionTimeContent;
            if (arr[i].title.indexOf("兑换") >= 0) {
                Logger.log("进来了");
            }
            this._activityList.push(info);
        }
        this._activityList = ArrayUtils.sortOn(this._activityList, "sort", ArrayConstant.NUMERIC);
        FunnyManager.Instance.setActivityBtnState();
    }

    private __onLoadError(info, content) {
        throw new ErrorEvent(LangManager.Instance.GetTranslation("loader.LoadError.Actionmsg"));
    }

    private __onEventComplete(content: string) {
        this.returnResult(String(content).split("|"));
    }

    private returnResult(arr: Array<string>) {
        var str: string = "";
        if (arr[0] == "-1") {
            switch (arr[arr.length - 1]) {
                case "0":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command01");
                    break;
                case "1":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command02");
                    break;
                case "5":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command03");
                    break;
                case "6":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command04");
                    break;
                case "7":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command05");
                    break;
                case "8":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command06");
                    break;
                case "10":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command07");
                    break;
                case "11":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command08");
                    break;
            }
        } else {
            switch (arr[arr.length - 1]) {
                case "0":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command01");
                    break;
                case "2":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command10");
                    break;
                case "1":
                case "3":
                case "4":
                case "5":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command09");
                    break;
                case "6":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command04");
                    break;
                case "7":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command05");
                    break;
                case "8":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command06");
                    break;
                case "10":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command07");
                    break;
                case "11":
                case "12":
                    str = LangManager.Instance.GetTranslation("activity.ActivityManager.command08");
                    break;
            }
        }
        MessageTipManager.Instance.show(str);
    }

    public get activityList(): Array<ActiveInfo> {
        var list: Array<ActiveInfo> = this._activityList;
        var count: number = 0;
        var aryList: Array<ActiveInfo> = [];
        while (count < list.length) {
            if (list[count].endDate <= this.playerModel.sysCurTimeBySecond) {
                list.splice(count, 1);
            }
            else if (list[count].startDate > this.playerModel.sysCurTimeBySecond) {
                count++;
            }
            else {
                aryList.push(list[count]);
                count++;
            }
        }
        return aryList;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    public senActivityCode(code: String, activeId: String) {
        var args = new Object();
        args["userId"] = PlayerManager.Instance.currentPlayerModel.userInfo.userId;
        args["key"] = PlayerManager.Instance.currentPlayerModel.userInfo.key;
        args["activeId"] = activeId;
        args["number"] = code;
        args["rnd"] = Math.random();
        // var path: String = PathManager.info.REQUEST_PATH + "activecheck";

        let params:string = `userId=${args["userId"]}&key=${args["key"]}&activeId=${args["activeId"]}&number=${args["number"]}&rnd=${args["rnd"]}`;
        return HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "activecheck", params, 'POST', "arraybuffer").then((data) => {
            let contentStr = "";
            let content: ByteArray = new ByteArray();
            content.writeArrayBuffer(data);
            if (content && content.length) {
                content.position = 0;
                contentStr = content.readUTFBytes(content.bytesAvailable);
                content.clear();
            }
            this.__onEventComplete(contentStr);
        })
    }
}