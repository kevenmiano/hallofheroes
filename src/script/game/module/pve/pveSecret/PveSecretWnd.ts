/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2024-04-26 15:01:13
 * @LastEditors: jeremy.xu
 * @DemandLink:【新PVE机制——秘境】https://www.tapd.cn/36229514/prong/stories/view/1136229514001048028
 * @Description: 单人秘境 选择副本界面
 * 
 */

import ConfigMgr from "../../../../core/config/ConfigMgr"
import LangManager from "../../../../core/lang/LangManager"
import Logger from "../../../../core/logger/Logger"
import BaseWindow from "../../../../core/ui/Base/BaseWindow"
import UIButton from "../../../../core/ui/UIButton"
import UIManager from "../../../../core/ui/UIManager"
import SimpleAlertHelper from "../../../component/SimpleAlertHelper"
import { BaseItem } from "../../../component/item/BaseItem"
import SecretTresureItem from "../../../component/item/SecretTresureItem"
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate"
import { t_s_secretData } from "../../../config/t_s_secret"
import ColorConstant from "../../../constant/ColorConstant"
import { ConfigType } from "../../../constant/ConfigDefine"
import ItemID from "../../../constant/ItemID"
import { EmWindow } from "../../../constant/UIDefine"
import { SecretEvent } from "../../../constant/event/NotificationEvent"
import { GoodsInfo } from "../../../datas/goods/GoodsInfo"
import { SecretEnterType, SecretStartType, SecretType } from "../../../datas/secret/SecretConst"
import SecretModel from "../../../datas/secret/SecretModel"
import { SecretTresureInfo } from "../../../datas/secret/SecretTresureInfo"
import { ArmyManager } from "../../../manager/ArmyManager"
import { GoodsManager } from "../../../manager/GoodsManager"
import { MessageTipManager } from "../../../manager/MessageTipManager"
import { NotificationManager } from "../../../manager/NotificationManager"
import { SecretManager } from "../../../manager/SecretManager"
import { PveSecretFBItem } from "./com/PveSecretFBItem"


export default class PveSecretWnd extends BaseWindow {
    private campaignList: fgui.GList
    private tresureList: fgui.GList
    private dropList: fgui.GList
    private txtEnterTip: fgui.GLabel
    private txtDropTip: fgui.GLabel
    private txtTresure: fgui.GLabel
    private txtTresureDesc: fgui.GLabel
    private btnStart: UIButton
    private gStartTip: fgui.GGroup

    private tresureIdList = [];
    private dropIdList = [];

    OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initView();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.addEvent();
        this.updateView();
        SecretManager.Instance.sendSecretRecordLayer();
    }

    /**关闭界面 */
    OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    private addEvent() {
        NotificationManager.Instance.on(SecretEvent.SECRET_RECORD_INFO, this.refreshSecretRecord, this)
    }

    private removeEvent() {
        NotificationManager.Instance.off(SecretEvent.SECRET_RECORD_INFO, this.refreshSecretRecord, this)
    }

    private initView() {
        this.campaignList.on(fgui.Events.CLICK_ITEM, this, this.onCampaignClickItem);
        this.campaignList.itemRenderer = Laya.Handler.create(this, this.onCampaignRenderItem, null, false);
        this.tresureList.itemRenderer = Laya.Handler.create(this, this.onTresureListRenderItem, null, false);
        this.dropList.itemRenderer = Laya.Handler.create(this, this.onDropRenderItem, null, false);

        this.txtFrameTitle.text = LangManager.Instance.GetTranslation("Pve.secretTitle")
        this.txtTresure.text = LangManager.Instance.GetTranslation("Pve.secret.tresure")
        this.txtTresureDesc.text = LangManager.Instance.GetTranslation("Pve.secret.tresureDesc")
        this.txtDropTip.text = LangManager.Instance.GetTranslation("selectcampaign.view.mayFall")
    }

    private updateView() {
        this.campaignList.numItems = this.model.secretCfgList.length
        this.defaultView()
        this.onSecretInfo();
    }

    public defaultView() {
        let idx = 0
        let len = this.campaignList.numChildren
        for (let index = 0; index < len; index++) {
            const item = this.campaignList.getChildAt(index) as PveSecretFBItem;
            if (item && item.info) {
                if (this.secretInfo.checkOpen(item.info.PreSecret)) {
                    idx = index
                }
            }
        }

        this.onCampaignClickItem(this.campaignList.getChildAt(idx) as PveSecretFBItem)
        this.campaignList.selectedIndex = idx
        this.campaignList.scrollToView(idx)
    }

    private onCampaignClickItem(item: PveSecretFBItem) {
        this.model.secretCfg = item.info;
        this.refreshRight();
    }

    private refreshRight() {
        this.tresureIdList = this.model.secretCfg.Treasure.split(",");
        this.dropIdList = this.model.secretCfg.Item.split(",");
        this.tresureList.numItems = this.tresureIdList.length;
        this.dropList.numItems = this.dropIdList.length;
        this.refreshEnterTip();
    }

    private onCampaignRenderItem(index: number, item: PveSecretFBItem) {
        let data = this.model.secretCfgList[index];
        if (!data) return;
        item.info = data;
    }

    private onTresureListRenderItem(index: number, item: SecretTresureItem) {
        let tempId = Number(this.tresureIdList[index]);
        let gInfo = new SecretTresureInfo(tempId);
        item.showName = false;
        item.info = gInfo;
    }

    private onDropRenderItem(index: number, item: BaseItem) {
        let tempId = Number(this.dropIdList[index]);
        let gInfo = new GoodsInfo();
        gInfo.templateId = tempId;
        item.info = gInfo;
    }

    onSecretInfo() {
        this.refreshSecretOpen()
        this.refreshSecretPass()
        this.refreshEnterTip()
    }

    private refreshSecretOpen() {
        let userLevel = ArmyManager.Instance.thane.grades;
        for (let index = 0; index < this.campaignList.numChildren; index++) {
            const item = this.campaignList.getChildAt(index) as PveSecretFBItem;
            if (item && item.info) {
                let checkGrade = userLevel >= item.info.NeedGrade
                if (checkGrade && this.secretInfo.checkOpen(item.info.PreSecret)) {
                    item.setOpen(true)
                } else {
                    item.setOpen(false)
                }
            }
        }
    }

    private refreshSecretPass() {
        for (let index = 0; index < this.campaignList.numChildren; index++) {
            const item = this.campaignList.getChildAt(index) as PveSecretFBItem;
            if (item && item.info) {
                if (this.secretInfo.checkOpen(item.info.SecretId)) {
                    item.setPass(true)
                } else {
                    item.setPass(false)
                }
            }
        }
    }

    /** 刷新秘境层数记录 */
    private refreshSecretRecord() {
        let maxRecordInfo = this.maxSecretRecordInfo
        let maxSecretId = maxRecordInfo.secretId

        let curRecordInfo = this.secretInfo
        let curSecretId = curRecordInfo.secretId
        for (let index = 0; index < this.campaignList.numChildren; index++) {
            const item = this.campaignList.getChildAt(index) as PveSecretFBItem;
            if (item.info) {
                let itemSecretId = item.info.SecretId

                item.setRecord(0)
                if (maxSecretId && itemSecretId == maxSecretId) {
                    Logger.info("[PveSecretWnd]最大秘境记录：", maxSecretId, maxRecordInfo.maxLayer)
                    item.setRecord(maxRecordInfo.maxLayer, false)
                    if (this.secretInfo.checkOpen(item.info.SecretId)) {
                        Logger.info("[PveSecretWnd]通关了 设置显示通关")
                        item.setPass(true)
                        item.gRecord.visible = false
                    }
                }
                if (curSecretId && itemSecretId == curSecretId) { 
                    Logger.info("[PveSecretWnd]当前进行秘境进度：", curSecretId, curRecordInfo.curLayer)
                    item.setRecord(curRecordInfo.curLayer, true)
                }

            }
        }
    }

    private refreshEnterTip() {
        this.btnStart.enabled = true
        if (this.secretInfo.secretId == this.model.secretCfg.SecretId) {
            this.gStartTip.visible = false
            this.btnStart.title = LangManager.Instance.GetTranslation("public.continue")

        } else {
            this.gStartTip.visible = true
            this.btnStart.title = LangManager.Instance.GetTranslation("public.start")

            this.txtEnterTip.color = ColorConstant.DEEP_TEXT_COLOR
            let userLevel = ArmyManager.Instance.thane.grades;
            let checkGrade = userLevel >= this.model.secretCfg.NeedGrade;
            if (checkGrade) {
                let preSecret = this.model.secretCfg.PreSecret
                let open = this.secretInfo.checkOpen(preSecret)
                if (open) {
                    this.txtEnterTip.text = LangManager.Instance.GetTranslation("Pve.secret.enterCount", this.secretInfo.leftCount)
                } else {
                    let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secret, preSecret) as t_s_secretData
                    this.txtEnterTip.text = LangManager.Instance.GetTranslation("Pve.secret.enterPreTip", temp && temp.TemplateNameLang)
                    this.btnStart.enabled = false
                    this.txtEnterTip.color = ColorConstant.RED2_COLOR
                }
            } else {
                this.txtEnterTip.text = LangManager.Instance.GetTranslation("public.undergrade")
                this.btnStart.enabled = false
                this.txtEnterTip.color = ColorConstant.RED2_COLOR
            }
        }
    }

    private btnStartClick() {
        // 检测继续 不消耗次数
        if (this.checkContinue()) {
            return
        }

        // 次数提示
        if (this.alertCount()) {
            return
        }

        // 进度提示
        if (this.alertChange(SecretEnterType.Free)) {
            return
        }

        this.sendStartSecret(SecretEnterType.Free)
    }

    private checkContinue() {
        if (this.secretInfo.secretId == this.model.secretCfg.SecretId) {
            this.sendContinueSecret()
            return true
        } else {
            return false
        }
    }

    private alertCount() {
        let lackEnetrCnt = this.secretInfo.leftCount <= 0
        if (lackEnetrCnt) {
            let itemCnt = GoodsManager.Instance.getGoodsNumByTempId(ItemID.SECRET_PROP);
            if (itemCnt > 0) {
                let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, ItemID.SECRET_PROP) as t_s_itemtemplateData
                let content = LangManager.Instance.GetTranslation("Pve.secret.enterCntNotEnoughTip2", temp.TemplateNameLang, temp.profileColor)
                let goodsCount: string = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + itemCnt;
                UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
                    content: content, goodsId: ItemID.SECRET_PROP, goodsCount: goodsCount, hidecheck1: true, callback: (b: boolean) => {
                        if (b) {
                            // 进度提示
                            if (this.alertChange(SecretEnterType.UseProp)) {
                                return
                            }

                            this.sendStartSecret(SecretEnterType.UseProp)
                        }
                    }
                });
            } else {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Pve.secret.enterCntNotEnoughTip"))
            }
            return true
        } else {
            return false
        }
    }

    private alertChange(enterType: SecretEnterType) {
        if (this.secretInfo.secretId && this.secretInfo.secretId != this.model.secretCfg.SecretId) {
            let str = LangManager.Instance.GetTranslation("Pve.secret.changeSceretTip")
            SimpleAlertHelper.Instance.ShowSimple(null, null, str, (b: boolean) => {
                if (b) {
                    str = LangManager.Instance.GetTranslation("Pve.secret.changeSceretTip2")
                    SimpleAlertHelper.Instance.ShowSimple(null, null, str, (b: boolean) => {
                        if (b) {
                            this.sendStartSecret(enterType)
                        }
                    })
                }
            })
            return true
        } else {
            return false
        }
    }

    private sendStartSecret(enterType: SecretEnterType) {
        SecretManager.Instance.sendCreateRoom(1, this.model.secretCfg.SecretId, enterType, SecretStartType.Start);
    }

    private sendContinueSecret() {
        SecretManager.Instance.sendCreateRoom(1, this.model.secretCfg.SecretId, null, SecretStartType.Continue);
    }

    private get secretModel() {
        return SecretManager.Instance.model as SecretModel
    }

    private get secretInfo() {
        return this.secretModel.getSecretInfo(SecretType.Single)
    }

    private get maxSecretRecordInfo() {
        return this.secretModel.getMaxSecretRecordInfo(SecretType.Single)
    }

    dispose() {
        super.dispose();
    }
}