/*
 * @Author: jeremy.xu
 * @Date: 2024-02-23 15:59:41
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-06 18:50:24
 * @Description: 
 */
import { PackageIn } from "../../../../core/net/PackageIn";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";

export default class PveSecretCtrl extends FrameCtrlBase {
    show() {
        super.show();
    }

    hide() {
        super.hide();
        
    }

    protected addEventListener() {
        super.addEventListener();
        // ServerDataManager.listen(S2CProtocol.XXX, this, this.__onXXX)
        
    }

    protected delEventListener() {
        super.delEventListener();
        // ServerDataManager.cancel(S2CProtocol.XXX, this, this.__onXXX)
        
    }

    private __onXXX(pkg: PackageIn) {
        // let msg = pkg.readBody(StoreRspMsg) as StoreRspMsg;

    }

    dispose() {
        super.dispose();
    }
}