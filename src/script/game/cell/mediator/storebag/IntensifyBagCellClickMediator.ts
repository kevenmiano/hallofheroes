// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-22 14:38:29
 * @LastEditTime: 2021-03-22 21:32:25
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import AudioManager from "../../../../core/audio/AudioManager";
import Logger from "../../../../core/logger/Logger";
import { BagNotic, BagType } from "../../../constant/BagDefine";
import { SoundIds } from "../../../constant/SoundIds";
import IMediator from "../../../interfaces/IMediator";
import { DoubleClickManager } from "../../../manager/DoubleClickManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import {StoreIntensifyCell} from "../../../component/item/StoreIntensifyCell";
import {InteractiveEvent} from "../../../constant/event/NotificationEvent";

export class IntensifyBagCellClickMediator implements IMediator {
    private _cell: StoreIntensifyCell;
    
    public register(target: Object) {
        this._cell = <StoreIntensifyCell>target;
        if (this._cell && this._cell) {
            let gComp = this._cell
            DoubleClickManager.Instance.enableDoubleClick(gComp.displayObject);
            gComp.displayObject.on(InteractiveEvent.DOUBLE_CLICK, this, this.__mouseDoubleClick);
            // gComp.displayObject.on(InteractiveEvent.CLICK, this, this.__mouseClickByClicker);
        }
    }

    public unregister(target: Object) {
        if (this._cell && this._cell) {
            let gComp = this._cell
            DoubleClickManager.Instance.disableDoubleClick(gComp.displayObject);
            gComp.displayObject.off(InteractiveEvent.DOUBLE_CLICK, this, this.__mouseDoubleClick);
            // gComp.displayObject.off(InteractiveEvent.CLICK, this, this.__mouseClickByClicker);
            this._cell = null;
        }
    }

    protected __mouseClickByClicker(c: Event) {
        if (!this._cell || !this._cell.info) return;
        NotificationManager.Instance.sendNotification(BagNotic.DRAG_ITEM, [this._cell, this._cell.info.count]);
    }

    protected __mouseDoubleClick(c: Event) {
        Logger.xjy("[IntensifyBagCellClickMediator]__mouseDoubleClick")
        AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
        PlayerManager.Instance.moveBagToBag(this._cell.item.bagType, this._cell.item.objectId, this._cell.item.pos, BagType.Player, 0, 0, 1);
    }
}