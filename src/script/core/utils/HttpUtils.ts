// @ts-nocheck
import { NotificationEvent } from "../../game/constant/event/NotificationEvent";
import { NotificationManager } from "../../game/manager/NotificationManager";
import { PathManager } from "../../game/manager/PathManager";
import { HttpFetch, HttpRequest } from "../http/BaseHttp";

/**
* @author:pzlricky
* @data: 2021-04-13 17:46
* @description *** 
*/
export default class HttpUtils {

    public static httpRequest(url: string, uri: string, params: any = null, method: string = 'POST', responseType: string = "text", errorFunc: Function = null, headers?: any[]): Promise<any> {
        return HttpRequest(url, uri, params, method, responseType, errorFunc,headers);
    }

    public static httpFetch(url: string, uri: string, params: any = null, method: string = 'GET', responseType: string = "text", errorFunc: Function = null): Promise<any> {
        return HttpFetch(url, uri, params, method, responseType, errorFunc);
    }


    public static CheckNetSpeedFileSize = 17119;
    public static checkNetSpeed(fn) {
        let startTime, endTime, fileSize;
        let xhr = new XMLHttpRequest();
        xhr.timeout = 10000;
        startTime = Date.now();
        xhr.onreadystatechange = function () {
            // if (xhr.readyState === 2) {
            //     startTime = Date.now();
            // }
            if (xhr.readyState === 4) {
                endTime = Date.now();
                // fileSize = xhr.responseText.length; //app端读取长度有问题
                fileSize = HttpUtils.CheckNetSpeedFileSize
                let speed = fileSize / ((endTime - startTime) / 1000) / 1024;
                fn && fn(Math.floor(speed) || 0)
            }
        }
        xhr.open("GET", PathManager.getNetSpeedTestPath() + "?rnd=" + Math.random(), true);
        xhr.send();
    }

    public static startCheckNetSpeed() {
        HttpUtils.checkNetSpeed((speed: number) => {
            if (speed == 0 || speed.toString() == "Infinity") {
                return
            }
            NotificationManager.Instance.dispatchEvent(NotificationEvent.CHECK_NETSPEED, speed)
        })
        Laya.timer.loop(1000, this, () => {
            HttpUtils.checkNetSpeed((speed: number) => {
                if (speed == 0 || speed.toString() == "Infinity") {
                    return
                }
                // Logger.info("checkNetSpeed", speed)
                NotificationManager.Instance.dispatchEvent(NotificationEvent.CHECK_NETSPEED, speed)
            })
        })
    }

    public static cancelCheckNetSpeed() {
        Laya.timer.clearAll(this)
    }
}