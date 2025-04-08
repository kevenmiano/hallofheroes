import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";


/**
 * https://minigame.vivo.com.cn/documents/#/api/da/banner-da
 * banner广告实例不能复用, 每次需要重新加载时要重新create
1、如果先调用createBannerAd()后 不能立马调用hide()方法, 要等Ad创建成功后, 在某个需要的场景下调hide()

2、如果有场景需要再次展示广告, 如果广告被关闭了或者调了close(), 必须重新创建才能展示出来, 此时show()无效

3、广告调试时, 会有可能因为填充率不足而展示不出来, 具体请查看教程中的错误码信息

4、Banner广告创建间隔不得少于10s
 */
export default class VivoBannerAd extends BaseAd {

    onError(err) {
        Logger.log('banner onError', err)
        this.setState(SDKState.loadFail)
        // this.reLoad()
    }

    onLoad() {
        Logger.log('banner onLoad this.logicState ', this.logicState)
        this.setState(SDKState.loadSucess)
        if (this.logicState == SDKState.open) {
            // this.show()
        } else {
            this.hide()
        }
    }
    open(adID) {
        //逻辑要求开
        this.logicState = SDKState.open;

        //如果banner已经已经显示 则返回。
        if (this.state == SDKState.loading) {
            Logger.log('showBanner 正在加载中')
            return;
        }
        this.state = SDKState.loading;
        // if (this.adUnitID != adID) {
        this.destroy();
        this.create(adID)

    }

    close() {

        this.logicState = SDKState.close;

        if (this.state == SDKState.loading) {
            Logger.log('hideBanner 正在加载中')
            //如果先调用createBannerAd()后 不能立马调用hide()方法, 要等Ad创建成功后, 在某个需要的场景下调hide()
            return;
        }
        if (!this.Instance) {
            return
        }
        this.hide()
    }



    onResize(data) {
        Logger.log('banner onResize', data)
    }
    
    protected show() {
        this.state = SDKState.open
        if (this.Instance)
            this.Instance.show();
        Logger.log(' banner show ')
    }

    protected hide() {
        this.state = SDKState.close;
        if (this.Instance)
            this.Instance.hide();
    }

    protected destroy() {
        if (this.Instance) {
            this.Instance.offLoad(this.onLoad.bind(this))
            this.Instance.offError(this.onError.bind(this))
            this.Instance.offSize(this.onResize.bind(this))
            this.Instance.destroy()
            this.Instance = null;
        }
    }
    protected create(adID) {
        this.adUnitID = adID;
        let winSize = qg.getSystemInfoSync();
        this.Instance = qg.createBannerAd({
            posId: adID,
            style: {}
        })
        this.Instance.onLoad(this.onLoad.bind(this))
        this.Instance.onError(this.onError.bind(this))
        this.Instance.onSize(this.onResize.bind(this))
        this.Instance.show().then(() => {
            Logger.log('banner广告展示完成');
            this.setState(SDKState.open)
        }).catch((err) => {
            this.setState(SDKState.close)
            Logger.log('banner广告展示失败', JSON.stringify(err));
        })
    }
}