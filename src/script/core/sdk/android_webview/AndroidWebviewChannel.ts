import BaseChannel from "../base/BaseChannel";
import { UserInfo } from "../../../game/datas/userinfo/UserInfo";
import { PlayerManager } from "../../../game/manager/PlayerManager";
import { ArmyManager } from "../../../game/manager/ArmyManager";
import { VIPManager } from "../../../game/manager/VIPManager";
import SimpleAlertHelper from "../../../game/component/SimpleAlertHelper";
import { NotificationManager } from "../../../game/manager/NotificationManager";
import { WebViewEvent } from "../../../game/constant/event/NotificationEvent";
import SDKManager from "../SDKManager";
import { ThaneInfo } from "../../../game/datas/playerinfo/ThaneInfo";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/8/5 10:53
 * @ver 1.0
 */
export class AndroidWebviewChannel extends BaseChannel {
    private _webViewInfo: object;
    get webViewInfo(): object {
        return this._webViewInfo;
    }

    constructor(id: number) {
        super(id);
        NotificationManager.Instance.addEventListener(WebViewEvent.RECEIVE_WEBVIEW_INFO, this.receiveWebViewData, this);
    }

    /**
     * 游戏事件
     * @param code  GameEventCode
     * @param exInfo    额外字段, 可根据情况自定义字段名称以json 串的形式传入（需提前沟通key值）。
     */
    public postGameEvent(code: number, exInfo: string = null) {
        let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let roleInfo: object = {
            "serverId": userInfo.site,
            "serverName": playerInfo.serviceName,
            "roleId": userInfo.userId,
            "roleName": userInfo.user,
            "roleLevel": ArmyManager.Instance.thane.grades,
            "vipLevel": VIPManager.Instance.model.vipInfo.VipGrade
        };
        // @ts-ignore
        webViewMethod.gameEvent(code, JSON.stringify(roleInfo), exInfo);
    }

    /**
     * 渠道账户个人中心
     * @param json JSON字符串, 根据渠道特殊需要进行传, 默认传空字符串
     */
    public openPersonalCenter(json: string = "") {
        // @ts-ignore
        webViewMethod.openPersonalCenter(json);
    }

    logout(b: boolean = false) {
        SDKManager.Instance.getChannel().reload();
        if (b) {
            //@ts-ignore
            webViewMethod.logout();
        }
    }

    openURL(url: string) {
        super.openURL(url);
        //@ts-ignore
        webViewMethod.openURL(url);
    }

    /**
     * 检测是否有某个权限
     * @param type  权限类型
     * @param request   没有权限的话是否获取
     * @return
     */
    checkPermission(type: string, request: boolean = false): number {
        //@ts-ignore
        return Number(webViewMethod.checkPermission(type, request));
    }

    /**
     * 打开客服系统
     */
    openCustomerService() {
        let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
        let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let param: object = {
            "type": 1,
            "publishId": 1,
            "trackedChargedDiamonds": 1,
            "serverId": userInfo.site,
            "serverName": playerInfo.serviceName,
            "roleId": userInfo.userId,
            "roleName": userInfo.user,
            "roleLevel": thaneInfo.grades,
            "userId": thaneInfo.userId
            // "vipLevel":VIPManager.Instance.model.vipInfo.VipGrade,
        };
        //@ts-ignore
        webViewMethod.openCustomerService(JSON.stringify(param));
    }

    /**
     * 打开社会化分享
     */
    socialPlugin(code:number, title:string, desc:string, photoPath:string, url:string, exInfo:string) {
        //@ts-ignore
        // webViewMethod.socialPlugin(title);
    }

    /**
     * 注册推送
     */
    registerPush(openId: string) {
        //@ts-ignore
        webViewMethod.registerPush(openId);
    }

    /**
     * 实名认证
     */
    openVerify() {
        //@ts-ignore
        webViewMethod.openVerify();
    }

    /**
     * 获取中间层关于当前渠道的配置信息
     */
    getConfigData(): string {
        //@ts-ignore
        return webViewMethod.getConfigData();
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
        let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
        let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let serverId: string = userInfo.site;
        let platformServerId: string = userInfo.site;
        let serverName: string = playerInfo.serviceName;
        let roleId: string = userInfo.userId.toString();
        let roleName: string = userInfo.user;
        let roleLevel: string = thaneInfo.grades.toString();
        let vipLevel: number = VIPManager.Instance.model.vipInfo.VipGrade;
        let rExInfo: string = "";
        //@ts-ignore
        webViewMethod.pay(type, orderId, productId, channelProductId, productName, productDesc, money,
            showCoin, gameExInfo, count, coinType, virtualCoinType, oExInfo,
            serverId, platformServerId, serverName, roleId, roleName, roleLevel, vipLevel, rExInfo);
    }

    /**
     * 语音登录
     * 在游戏中需要使用语音功能的地方调用voiceLogin(string userId, string password, string token)方法进行登录, 
     * userId、password、token字段可由游戏自行定义, token 可传空
     * */
    voiceLogin(userId: string, password: string, token: string) {
        //@ts-ignore
        webViewMethod.voiceLogin(userId, password, token);
    }

    /**
     * 语音登出
     * */
    voiceLogout() {
        //@ts-ignore
        webViewMethod.voiceLogout();
    }

    /**
     * 开始录音
     * chatRoomId 传游戏自定义的id,type =1表示私聊 type =2表示群聊
     * */
    startRecordAudio(chatRoomId: string, type: number) {
        //@ts-ignore
        webViewMethod.startRecordAudio(chatRoomId, type);
    }

    /**
     * 停止录音并发送
     * 可在onSendAudioMessageCallBack中收到发送成功的回调
     * extraText:频道
     * */
    stopAndSendAudio(extraText: string) {
        //@ts-ignore
        webViewMethod.stopAndSendAudio(extraText);
    }

    /**
     * 播放语音
     * audioPath为语音文件的路径
     * */
    startPlayAudio(audioPath: string) {
        //@ts-ignore
        webViewMethod.startPlayAudio(audioPath);
    }

    /**
     * 停止播放语音
     * */
    stopPlayAudio() {
        //@ts-ignore
        webViewMethod.stopPlayAudio();
    }

    /**
     * 取消发送语音
     * */
    cancelRecordAudio() {
        //@ts-ignore
        webViewMethod.cancelRecordAudio();
    }

    /**
     * 接收安卓端的弹窗命令
     * @param obj
     */
    showAlert(obj: any) {
        let code: number = ~~obj["code"];
        let msg: string = obj["msg"];
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, "提示", msg, "确定", "取消",
            (b: boolean, flag: boolean) => {
                if (b) {
                    switch (code) {
                        case -1:
                            //todo 退出游戏
                            //@ts-ignore
                            this.logout(true);
                            break;
                    }
                }
            });
    }

    /**
     * 接收安卓webview传过来的数据
     * @param info
     */
    receiveWebViewData(info: string) {
        Laya.Browser.window.alert("App登录回调数据11" + info);
        this._webViewInfo = JSON.parse(JSON.stringify(info));
        window["$webViewInfo"] = this._webViewInfo;
        NotificationManager.Instance.sendNotification(WebViewEvent.RECEIVE_DATA, this._webViewInfo);
    }

    /**
     * 手机震屏
     */
    shake() {
        //@ts-ignore
        // webViewMethod.shake();
    }
}

window['receiveWebViewInfo'] = function (info: string) {
    NotificationManager.Instance.sendNotification(WebViewEvent.RECEIVE_WEBVIEW_INFO, info);
}

//定义一个全局函数给安卓调用
window['showWebViewAlert'] = function (info) {
    let obj = JSON.parse(JSON.stringify(info));
    let channel: AndroidWebviewChannel = SDKManager.Instance.getChannel() as AndroidWebviewChannel;
    channel && channel.showAlert(obj);
}