/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 10:31:36
 * @LastEditTime: 2024-02-20 10:43:55
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import Logger from "../../../../core/logger/Logger";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { RoomSceneType, RoomType } from "../../../constant/RoomDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { RoomListSocketOutManager } from "../../../manager/RoomListSocketOutManager";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";


export default class PveGateCtrl extends FrameCtrlBase {

    show() {
        super.show()
        
    }

    hide() {
        super.hide()

    }
    
    protected addEventListener() {
        super.addEventListener()
    }

    protected delEventListener() {
        super.delEventListener()
    }
}
