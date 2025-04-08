// @ts-nocheck

import OppoNativeAdItemModel from "../oppo/OppoNativeAdItemModel";
import BaseAd from "../base/BaseAd";
import { SDKState, NativeAdCallback } from "../SDKConfig";
import BaseNativeAdItemModel from "../base/BaseNativeAdItemModel";
import Logger from "../../logger/Logger";

/**
 * https://minigame.vivo.com.cn/documents/#/api/da/native-ad
 */
export default class VivoNativeAd extends BaseAd {
    protected adItems: BaseNativeAdItemModel[] = []
    open(adUnitID: string, callback: NativeAdCallback) {
        // if (this.state == AdState.loading) {
        //     return;
        // }
        this.state = SDKState.loading;
        this.callback = callback;
        this.create(adUnitID);
        this.load()
    }

    create(adUnitID) {
        this.adUnitID = adUnitID
        this.destroy()
        // if (!this.instanceMap.has(adUnitID)) {
        Logger.log('VivoNativeAd create adUnitID ', adUnitID)
        this.Instance = qg.createNativeAd({
            posId: adUnitID,
        });
        Logger.log(' VivoNativeAd  this.Instance  ', this.Instance)
        if (this.Instance) {
            this.Instance.onLoad(this.onLoad.bind(this))
        }

    }
    close(){
        this.callback = null;
    }
    onLoad(res) {

        // Logger.log('onLoad ', res.adList)
        this.adItems.length = 0;
        if (res && res.adList) {
            this.setState(SDKState.loadSucess)
            for (let index = 0; index < res.adList.length; index++) {
                const element = res.adList[index];
                let adItem = new OppoNativeAdItemModel()
                adItem.initWithOppo(element)
                this.reportAdShow(adItem.getID())
                this.adItems.push(adItem)
            }
            if (this.callback) {
                this.callback(this.adItems)
            }
        } else {
            this.onError(null)
        }
    }

    onError(err) {
        this.setState(SDKState.loadFail)
        Logger.log(' BaseNativeAd onError err ', err)
        if (this.callback) {
            this.callback([])
        }
    }

    load() {
        if (this.Instance)
            this.Instance.load();
    }



    reportAdClick(adId) {
        if (!this.Instance) {
            return
        }
        Logger.log('reportAdClick ', adId)
        this.Instance.reportAdClick({
            adId: adId
        })
    }

    reportAdShow(adId) {
        if (!this.Instance) {
            return
        }
        Logger.log('reportAdShow ', adId)
        this.Instance.reportAdShow({
            adId: adId
        })
    }

    destroy() {
        if (this.Instance) {
            if (this.Instance.offLoad) {
                this.Instance.offLoad(this.onLoad.bind(this));
            }
            if (this.Instance.offError) {
                this.Instance.offError(this.onError.bind(this));
            }
            if (this.Instance.destroy) {
                this.Instance.destroy();
            }

            this.Instance = null;
        }

    }
}