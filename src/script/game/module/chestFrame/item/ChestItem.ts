/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-18 10:08:32
 * @LastEditTime: 2023-05-15 14:46:49
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FUI_ChestItem from "../../../../../fui/ChestFrame/FUI_ChestItem";
import { eFilterFrameText, FilterFrameText } from "../../../component/FilterFrameText";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { BaseItem } from "../../../component/item/BaseItem";


export default class ChestItem extends FUI_ChestItem {
    public index: number = -1;
    public isPay: boolean = false;
    public opened: boolean = false;
    public timeout: boolean = false;
    public colors = FilterFrameText.Colors[eFilterFrameText.ItemQuality]

    private item: BaseItem
    private txtItemName: fgui.GLabel
    private txtPlayerName: fgui.GLabel
    protected onConstruct() {
        super.onConstruct()

        this.item = this.comUnFolder.getChild("item") as BaseItem
        this.txtItemName = this.comUnFolder.getChild("txtItemName") as fgui.GLabel
        this.txtPlayerName = this.comUnFolder.getChild("txtPlayerName") as fgui.GLabel
    }

    public turnBack() {
        this.opened = false;
        this.comUnFolder.scaleX = 1
        Laya.Tween.to(this.comUnFolder, { scaleX: 0 }, 200, null, Laya.Handler.create(null, () => {
            this.comUnFolder.scaleX = 1
        }))

        Laya.timer.once(200, this, () => {
            this.show(true)
            this.imgFolderBg.scaleX = -0.01
            Laya.Tween.to(this.imgFolderBg, { scaleX: 1 }, 200, null, Laya.Handler.create(null, () => { }))
        })
    }

    public turnOver() {
        this.opened = true;
        this.imgFolderBg.scaleX = 1
        Laya.Tween.to(this.imgFolderBg, { scaleX: 0 }, 200, null, Laya.Handler.create(null, () => {
            this.imgFolderBg.scaleX = 1
        }))

        Laya.timer.once(200, this, () => {
            this.show(false)
            this.comUnFolder.scaleX = -0.01
            Laya.Tween.to(this.comUnFolder, { scaleX: 1 }, 200, null, Laya.Handler.create(null, () => { }))
        })
    }

    public show(back: boolean = true) {
        this.comUnFolder.visible = !back
        this.imgFolderBg.visible = back
    }

    public set info(info: GoodsInfo) {
        if (info) {
            this.baseItem.info = info;
            if (info.templateId == -100 || info.templateId == -200 || info.templateId == -300) {
                // ShowTipManager.Instance.removeTip(_goods);
            }
            let temp: t_s_itemtemplateData = info.templateInfo;
            if (temp) {
                this.txtItemName.text = temp.TemplateNameLang;
                this.txtItemName.color = this.colors[temp.Profile - 1];
            }
        }
    }
    public get info(): GoodsInfo {
        return this.baseItem.info
    }

    public updateData(userId: number, nickName: string, info: GoodsInfo) {
        if (this.isDisposed) return;
        this.baseItem.info = info;
        if (info.templateId == -100 || info.templateId == -200 || info.templateId == -300) {
            // ShowTipManager.Instance.removeTip(this.item);
        }
        let temp: t_s_itemtemplateData = info.templateInfo;
        this.txtItemName.text = temp.TemplateNameLang;
        this.txtItemName.color = this.colors[temp.Profile - 1]
        this.txtPlayerName.text = nickName;
        if (nickName == PlayerManager.Instance.currentPlayerModel.playerInfo.nickName) {
            this.txtPlayerName.color = FilterFrameText.Colors[eFilterFrameText.AvatarName][3 - 1]
        } else {
            this.txtPlayerName.color = FilterFrameText.Colors[eFilterFrameText.AvatarName][1 - 1]
        }

        this.turnOver();
    }

    public get baseItem(): BaseItem {
        return this.item as BaseItem
    }
}