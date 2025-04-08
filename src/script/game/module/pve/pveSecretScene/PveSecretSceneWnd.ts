// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 11:49:11
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-02 18:39:17
 * @DemandLink:【新PVE机制——秘境】https://www.tapd.cn/36229514/prong/stories/view/1136229514001048028
 * @Description: 秘境场景UI界面  所有不同类型的秘境共用
 * 不同类型的秘境目前只有失败界面可能会不太一样
 */


import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { SecretEvent } from "../../../constant/event/NotificationEvent";
import { SecretInfo } from "../../../datas/secret/SecretInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import FUIHelper from "../../../utils/FUIHelper";
import { SecretEventCom } from "./com/SecretEventCom";
import { SecretFailedMultiCom } from "./com/fail/SecretFailedMultiCom";
import { SecretFailedSingleCom } from "./com/fail/SecretFailedSingleCom";
import { SecretGainTipCom } from "./com/tip/SecretGainTipCom";
import { SecretLoseTipCom } from "./com/tip/SecretLoseTipCom";
import { SecretSceneState } from "./model/SecretSceneState";
import { SecretPassTipCom } from "./com/tip/SecretPassTipCom";
import { SecretTipData } from "./model/SecretTipData";
import SecretModel from "../../../datas/secret/SecretModel";
import LangManager from "../../../../core/lang/LangManager";
import { SecretItemInfo } from "../../../datas/secret/SecretItemInfo";
import SecretTresureItem from "../../../component/item/SecretTresureItem";
import { EmLayer } from "../../../../core/ui/ViewInterface";
import LayerMgr from "../../../../core/layer/LayerMgr";
import { SecretManager } from "../../../manager/SecretManager";
import { SecretDropType, SecretType } from "../../../datas/secret/SecretConst";
import { TransSceneEffectContext } from "../../../battle/effect/TransSceneEffectContext";
import UIManager from "../../../../core/ui/UIManager";

export default class PveSecretSceneWnd extends BaseWindow {
    private tresureList: fgui.GList;
    private gTresure: fgui.GGroup;
    private cState: fgui.Controller;
    private cShowTip: fgui.Controller;
    private rTxtLevel: fgui.GRichTextField;
    private txtTresureDesc: fgui.GTextField;
    private eventCom: SecretEventCom;
    private failComCon: fgui.GComponent;
    private failCom: SecretFailedSingleCom | SecretFailedMultiCom;
    private sucessCom: SecretGainTipCom;
    private sucessPassCom: SecretPassTipCom;

    private tipGainCom: SecretGainTipCom;
    private tipLoseCom: SecretLoseTipCom;

    private effect: TransSceneEffectContext
    private curLayer: number = 0;
    private death: Boolean = false;

    OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initView();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.updateView();
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    private initView() {
        this.txtTresureDesc.text = LangManager.Instance.GetTranslation("Pve.secretScene.ownTresure")
        this.cState = this.getController("cState")
        this.cShowTip = this.getController("cShowTip")
        this.tresureList.itemRenderer = Laya.Handler.create(this, this.onRenderTresureItem, null, false)

        let scereType = SecretModel.getScereType(this.secretId)
        switch (scereType) {
            case SecretType.Single:
                this.failCom = FUIHelper.createFUIInstance(EmPackName.PveSecretScene, "SecretFailedSingleCom")
                break;
            case SecretType.Multi:
                this.failCom = FUIHelper.createFUIInstance(EmPackName.PveSecretScene, "SecretFailedMultiCom")
                break;
            case SecretType.PetSingle:
                this.failCom = FUIHelper.createFUIInstance(EmPackName.PveSecretScene, "")
                break;
        }
        this.failCom && this.failComCon.addChild(this.failCom)
        LayerMgr.Instance.addToLayer(this.sucessPassCom.displayObject, EmLayer.GAME_UI_LAYER);

        let container = <Laya.Sprite><any>LayerMgr.Instance.getLayerByType(EmLayer.GAME_TOP_LAYER);
        this.effect = new TransSceneEffectContext(container);
        this.effect.effectType = 3;

        UIManager.Instance.ShowWind(EmWindow.MapNameMovie, { mapId: this.secretId, mapName: this.model.cfg.TemplateNameLang });
    }

    updateView() {
        let secretInfo = this.model.secretInfo as SecretInfo
        let layer = secretInfo.curLayer
        // 播放切换场景动画  
        if (this.curLayer > 0 && layer > this.curLayer) {
            this.effect.start()
        }
        this.curLayer = layer
        this.gTresure.visible = secretInfo.treasure != ""
        this.rTxtLevel.text = LangManager.Instance.GetTranslation("Pve.secretScene.level", layer + "/" + this.model.cfg.MaxLayer)
        this.updateTresure()

        let pass = false
        this.cShowTip.setSelectedIndex(0)
        switch (secretInfo.curStatus) {
            case SecretSceneState.Default:
                if (secretInfo.eventId > 0) {
                    this.cState.setSelectedIndex(0)
                    this.eventCom.info = secretInfo.eventId

                    // 复活 变成默认状态
                    if (this.death) {
                        this.death = true
                        this.effect.start()
                        NotificationManager.Instance.dispatchEvent(SecretEvent.REVIVE)
                    }
                } else {
                    // 无事件的状态

                }
                break;
            case SecretSceneState.Fighting:
                this.cState.setSelectedIndex(1)
                break;
            case SecretSceneState.Failed:
                this.cState.setSelectedIndex(2)
                if (this.failCom) {
                    this.failCom.info = secretInfo
                }
                this.death = true
                // 失败 死亡置灰
                NotificationManager.Instance.dispatchEvent(SecretEvent.FAILED)
                break;
            case SecretSceneState.Sucess:
                this.cState.setSelectedIndex(3)

                if (SecretManager.Debug) {
                    let testId = [101, 201]
                    // let testId = [2050802, 1108242, 2129401]
                    let infoList = []
                    for (let index = 0; index < testId.length; index++) {
                        const id = testId[index];
                        let info = new SecretItemInfo(SecretDropType.Tresure)
                        info.parseTempId(id)
                        infoList.push(info)
                    }
                    this.showPass(true)
                    this.sucessPassCom.info = new SecretTipData(this.secretId, infoList)
                    return
                }

                let infoList = [];
                if (secretInfo.dropItem) {
                    let itemStrArr = secretInfo.dropItem.split(",")
                    for (let i: number = 0; i < itemStrArr.length; i++) {
                        let itemStr = itemStrArr[i];
                        let itemArr = itemStr.split(":")
                        let info = new SecretItemInfo(secretInfo.dropType)
                        info.parseTempId(Number(itemArr[0]))
                        info.count = Number(itemArr[1])
                        infoList.push(info)
                    }
                }

                // 判断 胜利/通关
                pass = secretInfo.curLayer >= this.model.cfg.MaxLayer
                if (pass) {
                    this.sucessCom.visible = false
                    this.sucessPassCom.info = new SecretTipData(this.secretId, infoList)
                } else {
                    this.sucessCom.info = new SecretTipData(this.secretId, infoList)
                }
                break;
        }
        this.showPass(pass)
    }

    updateTresure() {
        let secretInfo = this.model.secretInfo as SecretInfo
        this.tresureList.numItems = secretInfo.treasureInfoList.length
    }

    showPass(b: boolean) {
        this.sucessPassCom.visible = b;
        this.sucessPassCom.displayObject.visible = b;
    }

    showGainTresureTip() {
        let infoList = []
        let gainTreasureList = this.secretModel.gainTreasure.split(",")
        this.secretModel.gainTreasure = ""
        for (let index = 0; index < gainTreasureList.length; index++) {
            const tempId = Number(gainTreasureList[index]);
            if (tempId) {
                let info = new SecretItemInfo(SecretDropType.Tresure)
                info.parseTempId(tempId)
                infoList.push(info)
            }
        }
        this.tipGainCom.info = new SecretTipData(this.secretId, infoList)
        this.cShowTip.setSelectedIndex(2)
    }

    showLoseTresureTip() {
        let infoList = []
        let lostTreasureList = this.secretModel.lostTreasure.split(",")
        this.secretModel.lostTreasure = ""
        for (let index = 0; index < lostTreasureList.length; index++) {
            const tempId = Number(lostTreasureList[index]);
            if (tempId) {
                let info = new SecretItemInfo(SecretDropType.Tresure)
                info.parseTempId(tempId)
                infoList.push(info)
            }
        }
        this.tipLoseCom.info = new SecretTipData(this.secretId, infoList)
        this.cShowTip.setSelectedIndex(1)
    }

    private onRenderTresureItem(index: number, item: SecretTresureItem) {
        let secretInfo = this.model.secretInfo as SecretInfo
        item.showName = false
        item.info = secretInfo.treasureInfoList[index]
    }

    private get secretModel() {
        return SecretManager.Instance.model as SecretModel
    }

    private get secretId() {
        return this.model.secretInfo.secretId
    }

    dispose() {
        this.effect.clean();
        super.dispose();
    }
}