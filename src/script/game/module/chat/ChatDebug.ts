// @ts-nocheck
/*
* @Author: jeremy.xu
* @Date: 2021-08-03 19:31:42
* @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-25 17:28:03
* @Description: 通过聊天开启的一些测试功能开关
*/

import GameConfig from '../../../../GameConfig';
import Logger from '../../../core/logger/Logger';
import { ChatDebugEvent } from '../../constant/event/NotificationEvent';
import { NotificationManager } from '../../manager/NotificationManager';
import { PlayerManager } from '../../manager/PlayerManager';


/** 聊天框输入
 * 7road_debug: 快捷入口
 * 7road_openlog: 日志开关
 */

export default class ChatDebug {
    public static filter(chatStr: string) {
        let isWhiteUser = PlayerManager.Instance.currentPlayerModel.userInfo.isWhiteUser;
        if (!isWhiteUser && !GameConfig.stat) return false;
        if (chatStr.indexOf("7road_debug") != -1) {
            NotificationManager.Instance.dispatchEvent(ChatDebugEvent.Debug);
            return true;
        }
        if (chatStr.indexOf("7road_openlog") != -1) {
            Logger.open = !Logger.open;
            Logger.warn((Logger.open ? "开启" : "关闭") + "日志");
            return true;
        }
        return false;
    }

}