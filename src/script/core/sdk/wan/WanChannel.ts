// @ts-nocheck
import { EmWindow } from '../../../game/constant/UIDefine';
import { NativeEvent, WanViewEvent } from '../../../game/constant/event/NotificationEvent';
import { UserInfo } from '../../../game/datas/userinfo/UserInfo';
import { MessageTipManager } from '../../../game/manager/MessageTipManager';
import { NotificationManager } from '../../../game/manager/NotificationManager';
import { PathManager } from '../../../game/manager/PathManager';
import { PlayerManager } from '../../../game/manager/PlayerManager';
import YMWebManager from '../../../game/manager/YMWebManager';
import { LoginManager } from '../../../game/module/login/LoginManager';
import { isOversea } from '../../../game/module/login/manager/SiteZoneCtrl';
import { FrameCtrlManager } from '../../../game/mvc/FrameCtrlManager';
import DisplayLoader from '../../../game/utils/DisplayLoader';
import LangManager from '../../lang/LangManager';
import Logger from '../../logger/Logger';
import AdjustMgr from "../../thirdlib/AdjustMgr";
import FBPixelMgr from '../../thirdlib/FBPixelMgr';
import GTagMgr from '../../thirdlib/GTagMgr';
import Base64 from "../../utils/Base64";
import HttpUtils from '../../utils/HttpUtils';
import Utils from "../../utils/Utils";
import { ChannelSTR } from "../SDKConfig";
import SDKManager from "../SDKManager";
import BaseChannel from "../base/BaseChannel";


export default class WanChannel extends BaseChannel {

    private order_id: string = "";

    constructor(id: number) {
        super(id);
        this.initEvent();
    }

    private initEvent() {
        NotificationManager.Instance.addEventListener(WanViewEvent.RECEIVE_DATA, this.receiveWanInfoData, this);
    }

    /**
     * 语音登录
     * 在游戏中需要使用语音功能的地方调用voiceLogin(string userId, string password, string token)方法进行登录, 
     * userId、token字段可由游戏自行定义, password 可传空
     */
    voiceLogin(userId: string, password: string, token: string) {
        YMWebManager.Instance.voiceLogin(userId, password, token);
    }


    joinConsortiaRoom(roomid: string) {
        if (Utils.isWxMiniGame()) {
            return;
        }
        YMWebManager.Instance.joinConsortiaRoom(roomid)
    }

    exitConsortiaRoom(roomid: string) {
        YMWebManager.Instance.exitConsortiaRoom(roomid)
    }

    joinTeamRoom(roomid: string, isteam: boolean = false) {
        if (Utils.isWxMiniGame()) {
            return;
        }
        YMWebManager.Instance.joinTeamRoom(roomid, isteam)
    }

    exitTeamRoom(roomid: string, isteam: boolean = false) {
        YMWebManager.Instance.exitTeamRoom(roomid, isteam)
    }

    /**
    * 开始录音
    * chatRoomId 传游戏自定义的id,type =1表示私聊 type =2表示群聊
    * */
    startRecord(chatRoomId: string, type: number, extraText: string, cb: Function) {
        YMWebManager.Instance.startRecord(chatRoomId, type, extraText, cb);
    }

    /**
     * 停止录音并发送
     * 可在onSendAudioMessageCallBack中收到发送成功的回调
     * */
    stopAndSendAudio(receiverId: string) {
        YMWebManager.Instance.stopAndSendAudio(receiverId);
    }

    /**
     * 播放语音
     * audioPath为语音文件的路径
     * */
    startPlayAudio(serverId: any) {
        YMWebManager.Instance.startPlayAudio(serverId);
    }

    /**
     * 停止播放语音
     * */
    stopPlayAudio() {
        YMWebManager.Instance.stopPlayAudio();
    }

    /**
     * 取消发送语音
     * */
    cancelRecordAudio() {
        YMWebManager.Instance.cancelRecordAudio();
    }

    logout(b: boolean = false) {
        YMWebManager.Instance.logout();
        //玩平台回退
        if (DisplayLoader.isDebug) {
            SDKManager.Instance.getChannel().reload();
        } else {
            let calltype = isOversea() ? "&type=2" : "";
            var str = "is_reload=" + 1 + calltype;
            var paramString = Base64.encode(str);
            window["callPay"]({ "param": paramString });
        }
    }

    /**
    * 支付
    * @param type  支付类型（默认0时可不传）
    * @param orderId   游戏订单id
    * @param productId 游戏商品id
    * @param channelProductId  渠道商品id
    * @param productName   商品名
    * @param productDesc   商品描述
    * @param money 金额
    * @param showCoin  显示钻石数
    * @param gameExInfo    游戏透传字段
    * @param count 购买数量
    * @param coinType  币种
    * @param virtualCoinType   虚拟币币种
    * @param oExInfo   订单额外信息
    */
    pay(type: number, orderId: string, productId: string, channelProductId: string, productName: string, productDesc: string, money: string,
        showCoin: number, gameExInfo: string, count: number, coinType: string, virtualCoinType: string, oExInfo: string = "") {
        this.order_id = orderId
        let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
        let serverId: number = userInfo.siteId;
        let roleId: string = userInfo.userId.toString();
        let roleName: string = userInfo.user;
        var user = roleName
        var order_id = orderId;
        var server_id = serverId
        var product_id = productId;
        var product_name = productName;
        var pay_amount = money;
        var role_id = roleId;
        let area = isOversea() ? "&area=" + userInfo.area : "";
        let calltype = isOversea() ? "&type=1" : "";
        var str = "user=" + user + "&order_id=" + order_id + "&server_id=" + server_id + "&product_id=" + product_id + "&product_name=" + product_name + "&pay_amount=" + pay_amount.toString() + "&role_id=" + role_id + area + calltype;;
        var paramString = Base64.encode(str);
        //paramString = "dWlkPTE4Jm9yZGVyX2lkPWFiY2RlZmcmc2VydmVyX2lkPTEmcHJvZHVjdF9pZD1zcWg1LmdlbS5wYXk2JnByb2R1Y3RfbmFtZT025YWD6ZK755+zJnBheV9hbW91bnQ9MSZyb2xlX2lkPTE="
        //@ts-ignore  非跨域
        // window.parent.wanPayDialog({"param":paramString})
        //@ts-ignore  跨域
        window["callPay"]({ "param": paramString });
        this.startCheck();
    }

    // report
    reportData(param:Object) {
        if(isOversea() ) {
            var str = Utils.stringify(param);
            let calltype = "&type=3";
            var str = str + calltype;
            var paramString = Base64.encode(str);
            window["callPay"]({ "param": paramString });
        }
    }

    // 轮询查看支付结果
    private startCheck() {
        Laya.timer.loop(3000, this, this.checkResult);
    }

    //停止检测
    private stopCheck() {
        Laya.timer.clear(this, this.checkResult);
    }

    private checkResult() {
        if (this.order_id == "") return;
        if (window["getOrderStatus"]) {
            window["getOrderStatus"]({ "order_id": this.order_id });
        } else {
            this.stopCheck();
        }
    }

    /**
     * 打开登录窗口重新登录
     */
    showLogin(type: number = 0) {
        this.reload();
    }

    /**
     * 自动登录sdk
     */
    autoLogin() {
        this.reload();
    }

    copyStr(str: string) {
        let input: any = document.createElement('input');
        input.value = str;
        document.body.appendChild(input);
        input.select();
        let success: boolean = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {

        }
        document.body.removeChild(input);
        return success;
    }

    /**监听wan平台传输过来数据 */
    receiveWanInfoData(event) {
        Logger.log("wan:", event);
    }

    /**
     * 打开链接
     * @param url
     */
    openURL(url: string) {
        Laya.Browser.window.open(url);
    }

    /**
     * 打开QQ客服
     * @param url
     * @param qq
     */
    openQQService(url: string, qq: string) {
        Laya.Browser.window.open(url);
    }

    openWXOfficial(textUrl: string, s: string): void {
        Laya.Browser.window.open(textUrl);
    }

    createLoginReq(userName: string, pass: string, site: string, siteId: number, appData: any = null) {
        this.platId = 5;
        LoginManager.Instance.c2s_createLoginReq(userName, pass, site, siteId, ChannelSTR.WEB_WAN, this.platId, appData);//请求玩家列表
    }

    adjustEvent(eventType: string, value?: any) {
        if (isOversea()) {
            AdjustMgr.Instance.trackEvent(eventType, value);
            FBPixelMgr.Instance.trackEvent(eventType, value);
            GTagMgr.Instance.trackEvent(eventType, value);
        }
    }

    /**刷新页面 */
    reload(): void {
        let calltype = isOversea() ? "&type=2" : "";
        var str = "is_reload=" + 1 + calltype;
        var paramString = Base64.encode(str);
        window["callPay"]({ "param": paramString });
    }

    saveScreenshot(sp: Laya.Sprite, isShare: number = 1, code: number = 0, title: string = "title", desc: string = "desc") {
        if (code != 6) {
            return;
        }
        Utils.delay(3000).then(()=>{
            NotificationManager.Instance.sendNotification(NativeEvent.MOUNT_SHARE_RESULT, 1);
        })
        FrameCtrlManager.Instance.open(EmWindow.Waiting);
        Utils.delay(5000).then(() => {
            FrameCtrlManager.Instance.exit(EmWindow.Waiting);
        })
        //600x600 或者  600x314
        let htmlCanvas1: Laya.HTMLCanvas = sp.drawToCanvas(sp.width * sp.scaleX, sp.height * sp.scaleY, 0, 0);//把精灵绘制到canvas上面
        let base64Str1: string = htmlCanvas1.toBase64("image/png", 0.8);
        let fileStream = Utils.dataURLtoFile(base64Str1);
        let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
        let userId = userInfo.userId;
        let key = userInfo.key;
        let appurl = "https://wartunelite.wan.com/";
        let param: string = `uid=${userId}&key=${key}&title=${title}&desc=${desc}&appid=${445717077248729}&appurl=${appurl}`;
        HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "fbshareservlet?" + param, fileStream, 'POST', 'text', null, ["Content-Type", "text/plain"]).then((data) => {
            let retData = JSON.parse(data);
            Logger.log("FB分享返回: ", retData);
            FrameCtrlManager.Instance.exit(EmWindow.Waiting);
            switch (retData.code) {
                case 200:
                    let shareurl = retData.data;
                    let shareUrl = `https://www.facebook.com/dialog/share?app_id=445717077248729&display=popup&href=${encodeURIComponent(shareurl)}&redirect_uri=${encodeURIComponent("https://wartunelite.wan.com/")}`;
                    SDKManager.Instance.getChannel().openURL(shareUrl);
                    break;
                default:
                    let codeStr = "mountShareWnd.FB.share_" + retData.code;
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation(codeStr));
                    break;
            }
        });
    }

}

window['receiveWanInfo'] = function (info: string) {
    NotificationManager.Instance.sendNotification(WanViewEvent.RECEIVE_DATA, info);
}


