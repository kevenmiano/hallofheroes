/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-18 10:08:32
 * @LastEditTime: 2023-05-26 14:30:26
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FUI_MemoryCardItem from "../../../../../fui/BaseCommon/FUI_MemoryCardItem";
import LangManager from '../../../../core/lang/LangManager';
import { eFilterFrameText, FilterFrameText } from "../../../component/FilterFrameText";
import { BaseItem } from "../../../component/item/BaseItem";
import SimpleAlertHelper, { AlertBtnType } from "../../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { MemoryCardManager } from "../control/MemoryCardManager";
import { MemoryCardData } from "../model/MemoryCardData";


export default class MemoryCardItem extends FUI_MemoryCardItem {
    public static TURN_HALF_TIME: number = 250;
    public static FADE_OUT_TIME: number = 200;
    public index: number = -1;
    public isPay: boolean = false;
    public opened: boolean = false;
    public timeout: boolean = false;
    public colors = FilterFrameText.Colors[eFilterFrameText.ItemQuality]

    protected item: BaseItem
    protected imgIcon:fgui.GLoader
    protected txtItemName: fgui.GLabel
    protected onConstruct() {
        super.onConstruct()

        this.item = this.comFront.getChild("item") as BaseItem
        this.imgIcon = this.comFront.getChild("imgIcon") as fgui.GLoader
        this.txtItemName = this.comFront.getChild("txtItemName") as fgui.GLabel
    }

    public turnBack() {
        this.opened = false;
        this.comFront.scaleX = 1
        Laya.Tween.to(this.comFront, { scaleX: 0 }, MemoryCardItem.TURN_HALF_TIME, null, Laya.Handler.create(null, () => {

        }))

        Laya.timer.once(MemoryCardItem.TURN_HALF_TIME, this, () => {
            this.showBack(true)
            this.comBack.scaleX = -0.01
            this.comFront.scaleX = 1
            Laya.Tween.to(this.comBack, { scaleX: 1 }, MemoryCardItem.TURN_HALF_TIME, null, Laya.Handler.create(null, () => { }))
        })
    }

    public turnOver() {
        this.opened = true;
        this.comBack.scaleX = 1
        Laya.Tween.to(this.comBack, { scaleX: 0 }, MemoryCardItem.TURN_HALF_TIME, null, Laya.Handler.create(null, () => {

        }))

        Laya.timer.once(MemoryCardItem.TURN_HALF_TIME, this, () => {
            this.showBack(false)
            this.comFront.scaleX = -0.01
            this.comBack.scaleX = 1
            Laya.Tween.to(this.comFront, { scaleX: 1 }, MemoryCardItem.TURN_HALF_TIME, null, Laya.Handler.create(null, () => {
                let arr: string[] = this.model.specialInfo.split(",");
                if (this.info.templateId == Number(arr[0]) && this.info.count == Number(arr[1])) {
                    this.playEffect();
                }
                else {
                    this.clearEffect();
                }
            }))
        })
    }

    public showBack(back: boolean = true) {
        this.comFront.visible = !back
        this.comBack.visible = back
    }

    public playAni() {
        this.touchable = false;
        let resultArr: string[] = this.model.result.split("|");
        for (let index = 0; index < resultArr.length; index++) {
            const str = resultArr[index];
            let arr: string[] = str.split(",");
            if (this.index == Number(arr[0])) {
                if (!this.info) {
                    let info = new GoodsInfo();
                    info.templateId = Number(arr[1]);
                    info.count = Number(arr[2]);
                    this.info = info;
                }
                this.turnOver();
                break;
            }
        }

        this.imgSelect.visible = false;
        Laya.timer.once(1400, this, this.completeCalback)
        Laya.timer.once(1400 + MemoryCardItem.FADE_OUT_TIME, this, this.stopAni)
    }

    public stopAni() {
        this.touchable = true;
        this.model.clickIndexArr = [];
        this.model.lock = false;
    }

    public playEffect() {
        this.comFront.getChild("mc").visible = true;
    }

    public clearEffect() {
        this.comFront.getChild("mc").visible = false;
    }

    public resetItem() {
        this.info = null
        this.showBack(true)
        this.stopAni()
        this.clearEffect()
        this.imgSelect.visible = false;
        this.usable = true;
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.comBack);
        Laya.Tween.clearAll(this.comFront);
    }

    public get notUsable() {
        let b: boolean = false;
        if (this.model.posInfo != "") {
            let posArr: string[] = this.model.posInfo.split(",");
            for (let i: number = 0; i < posArr.length; i++) {
                if (Number(posArr[i]) == this.index) {
                    b = true;
                    break;
                }
            }
        }
        // Logger.xjy("[MemoryCardItem]notUsable", this.index, b)
        return b
    }

    private _usable: boolean = true;
    public set usable(val: boolean) {
        this._usable = val
        this.alpha = val ? 1 : 0
        this.touchable = val
    }
    public get usable(): boolean {
        return this._usable
    }

    private completeCalback() {
        if (this.notUsable) {
            this.alpha = 1;
            Laya.Tween.to(this, { alpha: 0 }, MemoryCardItem.FADE_OUT_TIME, null, Laya.Handler.create(null, () => {
                this.usable = false;
            }))
        } else {
            this.turnBack()
        }
        let posArr: string[] = this.model.posInfo.split(",");
        if (posArr.length >= MemoryCardData.CARD_NUM) {
            if (Number(posArr[MemoryCardData.CARD_NUM - 1]) == this.index) {
                // if(this.index ==1){
                let content: string = LangManager.Instance.GetTranslation("NewMemoryCardItem.content.txt");
                SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b) => {
                    if (b) {
                        MemoryCardManager.Instance.memoryCardSendOp(MemoryCardData.OP_REFRESH);
                    }
                }, AlertBtnType.O, true, true);
            }
        }
    }

    public set info(info: GoodsInfo) {
        if (info) {
            this.baseItem.info = info;
            this.baseItem.countText = info.count.toString();
            let temp: t_s_itemtemplateData = info.templateInfo;
            if (temp) {
                this.txtItemName.text = temp.TemplateNameLang;
                this.txtItemName.color = this.colors[temp.Profile];
            }
        }else{
            this.baseItem.info = null;
        }
    }
    public get info(): GoodsInfo {
        return this.baseItem.info
    }

    public get model(): MemoryCardData {
        return MemoryCardManager.Instance.memoryCardData;
    }

    public get baseItem(): BaseItem {
        return this.item as BaseItem
    }

    public dispose(): void {
        this.stopAni();
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.comBack);
        Laya.Tween.clearAll(this.comFront);
        super.dispose()
    }
}