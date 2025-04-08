// @ts-nocheck
import BaseChannel from "../base/BaseChannel";
import { ChannelID, ChannelSTR } from "../SDKConfig";
import WXBannerAd from "./WXBannerAd";
import WXRewardedVideoAd from "./WXRewardedVideoAd";
import WXShare from "./WXShare";
import WXLogin from "./WXlogin";
import WXScreenshot from "./WXScreenshot";
import { UserInfo } from "../../../game/datas/userinfo/UserInfo";
import { ArmyManager } from "../../../game/manager/ArmyManager";
import { PlayerManager } from "../../../game/manager/PlayerManager";
import { t_s_rechargeData } from "../../../game/config/t_s_recharge";
import { TempleteManager } from "../../../game/manager/TempleteManager";
import { VIPManager } from "../../../game/manager/VIPManager";
import Logger from "../../logger/Logger";
import { LoginManager } from "../../../game/module/login/LoginManager";
import DisplayLoader from "../../../game/utils/DisplayLoader";

//@ts-ignore
const Road_7 = window.Road_7;

export default class WXChannel extends BaseChannel {
    /**token具有时效性 */
    private token: string;
    /**用户唯一标识 */
    private userId: string;
    /**扩展字段 */
    private exInfo: string;
    private channelId: number; // 渠道id
    private channelName: string; // 渠道名称
    private type: string; // 账号类型
    private appId: number;
    private packageId: number;


    constructor(id: ChannelID) {
        super(id) 
        // this.init();
        //@ts-ignore
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
    }

    initRoad_7() {
        return new Promise<number>((resolve, reject) => {
            Road_7.init().then((res) => {
                // 初始化成功回调
                Logger.log('ROAD7',res);
                setTimeout(() => {
                    Road_7.login().then(async (res) => {
                        // 登录成功回调
                        Logger.log('ROAD7Login',res);
                        this.appId = await this.getConfigItem("appId");
                        this.packageId = await this.getConfigItem("packageId");
                        if (res && res.data) {
                            let data = res.data;
                            this.exInfo = data.exInfo;
                            this.token = data.token;
                            this.userId = data.userId;
                            this.channelId = data.channelId;
                            this.channelName = data.channelName;
                            this.type = data.type;
                            data.appId = this.appId;
                            data.packageId = this.packageId;
                            data.channelId = data.channelId + '';
                        }
                        resolve(res.data);
                    }).catch((err) => {
                        // 登录失败回调
                        Logger.log('ROAD7Loginerr',err);
                        reject(err);
                    })
                }, 500);

                
            }).catch((err) => {
                // 初始化失败回调
                Logger.log('ROAD7err',err);
                reject(err);
            }); 
        })
        
    }

    getUserId() {
        return this.userId;
    }

    getToken() {
        return this.token;
    }

    getExInfo() {
        return this.exInfo;
    }

    getChannelId() {
        return this.channelId;
    }

    /**
     * 支付
     * @param data 数据
     */
    pay(type: number, orderId: string, productId: string, channelProductId: string, productName: string, productDesc: string, money: string, showCoin: number, gameExInfo: string, count: number, coinType: string, virtualCoinType: string, oExInfo?: string): void {
        // let rechargeData: t_s_rechargeData = TempleteManager.Instance.getRechargeTempleteByProductID('sqh5.gem.pay6');
        let rechargeData: t_s_rechargeData = TempleteManager.Instance.getRechargeTempleteByProductID(productId);
        
        let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let data = {
            //充值表数据
            gameOrderId: orderId,
            productId: rechargeData.ProductId,
            productName: rechargeData.ProductName,
            productDesc: rechargeData.ProductDesc,
            currency: rechargeData.MoneyType,
            gameCoin: parseInt(rechargeData.Para2),
            showCoin: parseInt(rechargeData.Para3),
            amount: rechargeData.MoneyNum,
            gameCoinCurrency: "钻石",

            gameZoneId: userInfo.siteId.toString(),
            roleId: userInfo.userId.toString(),
            roleName: playerInfo.nickName,
            roleLevel: ArmyManager.Instance.thane.grades,
            vipLevel: playerInfo.vipGrade,
            gameExInfo: this.exInfo,
            exInfo: '',
        };

        Logger.log('testRecharge', rechargeData, data);
        Road_7.order(data).then((res) => {
            // 支付成功回调
            Logger.log('ROAD7Order',res);
        }).catch((err) => {
            // 支付失败回调
            Logger.log('ROAD7err',err);
        })
    }

    /**
     * 游戏事件
     * @param code  GameEventCode
     * @param exInfo    额外字段, 可根据情况自定义字段名称以json 串的形式传入（需提前沟通key值）。
     */
     public postGameEvent(code: number, exInfo: string = "") {
        let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let vipGrade: number = 0;
        if (VIPManager.Instance.model && VIPManager.Instance.model.vipInfo) {
            vipGrade = VIPManager.Instance.model.vipInfo.VipGrade
        }
        let data = {
            gameZoneId: userInfo.siteId.toString(),
            roleId: userInfo.userId.toString(),
            roleName: playerInfo.nickName,
            level: ArmyManager.Instance.thane.grades,
            gameZoneName: playerInfo.serviceName,	//区服名称
            vipLevel: vipGrade		//vip等级
        };
        Logger.log('WXPost', code, data);
        //Road_7.reportLog(code, data);//@@@@??????
    }

    /**
     * 获取广告参数
     */
    public getAdparams() {
        Road_7.getAdparams().then((res) => {
            // res为上报tlog的广告参数
            // 返回数据格式为JSON对象
            // {
            //	 key: value
            // }
            Logger.log('WXAdparams', res);
        })
    }

    logout(b: boolean = false) {
        //@ts-ignore
        if (wx && wx.restartMiniProgram) {
            //@ts-ignore
            wx.restartMiniProgram();
        } 
    }

    /**
     * 获取项目配置
     * @param name 
     * @returns 
     */
    getConfigItem(name?: string) {
        return new Promise<any>((resolve, reject) => {
            //@ts-ignore
            window.Road_7.getConfigItem(name).then((res) => {
                // res为上报tlog的广告参数
                // 返回数据格式为JSON对象
                // {
                //	 key: value
                // }
                Logger.log('DY getConfigItem', res);
                resolve(res);
            })
        })
    }











    initAd() {
        if (wx.createBannerAd) {
            this.bannerAd = new WXBannerAd(this)
        }

        // if (wx.createInterstitialAd) {
        //     this.insertAd = new WXInterstitialAd(this)
        // }

        if (wx.createRewardedVideoAd) {
            this.rewardAd = new WXRewardedVideoAd(this)
        }

        if (wx.shareAppMessage) {
            this.share = new WXShare(this)
        }

        this.loginMgr = new WXLogin(this)

        this.screenshot = new WXScreenshot(this)
    }


    vibrateShort() {
        wx.vibrateShort();
    }

    //展示网络图片
    previewImage(imgUrl: string) {
        wx.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }

    //跳转能力
    navigateToMiniProgram(appID: string) {
        wx.navigateToMiniProgram({
            appId: appID,
            success: () => {

            }
        })
    }
    showToast(title:string){
        wx.showToast({title:title})
    }
    postMessage(msg: any) {
        let context = wx.getOpenDataContext()
        if (context) {
            msg.channelID = this._channelID;
            context.postMessage(msg)
        }
    }

    createLoginReq(userName: string, pass: string, site: string, siteId: number, appData: any = null) {
        this.platId = 5;
        if(DisplayLoader.isDebug){
            LoginManager.Instance.c2s_createLoginReq(userName, pass, site, siteId, ChannelSTR.DEV, this.platId, appData);//请求玩家列表
        }else{
            LoginManager.Instance.c2s_createLoginReq(userName, pass, site, siteId, ChannelSTR.APP, this.platId, appData);//请求玩家列表
        }

    }

    reload() {
        wx.restartMiniProgram({});
    }
}
