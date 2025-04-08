/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:38:41
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-08-12 17:40:40
 * @Description: 
 */

import FrameCtrlBase from "../../../mvc/FrameCtrlBase"
import { FarmManager } from '../../../manager/FarmManager';


export default class FarmCtrl extends FrameCtrlBase {
    show() {
        super.show()
    }

    hide() {
        super.hide()
    }

    public get model(){
        return FarmManager.Instance.model
    }
}