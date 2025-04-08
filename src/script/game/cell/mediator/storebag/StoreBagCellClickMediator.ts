// @ts-nocheck
import AudioManager from "../../../../core/audio/AudioManager";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { BagType } from "../../../constant/BagDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import {InteractiveEvent, NotificationEvent} from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsType } from "../../../constant/GoodsType";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import IMediator from "../../../interfaces/IMediator";
import { DoubleClickManager } from "../../../manager/DoubleClickManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import ForgeCtrl from "../../../module/forge/ForgeCtrl";
import ForgeData from "../../../module/forge/ForgeData";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import {StoreBagCell} from "../../../component/item/StoreBagCell";


export class StoreBagCellClickMediator implements IMediator {
    private _cell: StoreBagCell;

    private get model(): ForgeData {
        return this.storeControler.data;
    }

    private get storeControler(): ForgeCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl;
    }

    public register(target: Object) {
        this._cell = <StoreBagCell>target;
        if (this._cell && this._cell) {
            let gComp = this._cell
            DoubleClickManager.Instance.enableDoubleClick(gComp.displayObject);
            // gComp.displayObject.on(InteractiveEvent.CLICK, this, this.__mouseClickByClicker);
            // gComp.displayObject.on(InteractiveEvent.DOUBLE_CLICK, this, this.__mouseDoubleClick);
            gComp.displayObject.on(Laya.Event.DOUBLE_CLICK, this, this.__mouseDoubleClick);
        }
    }

    public unregister(target: Object) {
        if (this._cell && this._cell) {
            let gComp = this._cell
            DoubleClickManager.Instance.disableDoubleClick(gComp.displayObject);
            // gComp.displayObject.off(InteractiveEvent.CLICK, this, this.__mouseClickByClicker);
            // gComp.displayObject.off(InteractiveEvent.DOUBLE_CLICK, this, this.__mouseDoubleClick);
            gComp.displayObject.off(Laya.Event.DOUBLE_CLICK, this, this.__mouseDoubleClick);
            this._cell = null;
        }
    }

    // protected __mouseClickByClicker(c: Event) {
    //     if (!this._cell || !this._cell.info) return;

    //     if (this.model && this.model.curTabIndex == ForgeData.TabIndex.QH && this.model.isIntensifing) return;
    //     NotificationManager.Instance.sendNotification(BagNotic.DRAG_ITEM, [this._cell, this._cell.info.count]);
    // }

    private __mouseDoubleClick(c: Event) {
        Logger.log("[StoreBagCellClickMediator]__mouseDoubleClick")
        if (!this.model) {
            NotificationManager.Instance.sendNotification(NotificationEvent.DOUBLE_CLICK, this._cell.info);
            return;
        }
        if (!this.canDoubleClick) return;
        if (this.isMountJewel) return;
        AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
        let to_pos = (this._cell.info.templateInfo.SonType == GoodsSonType.SONTYPE_INTENSIFY) ? 1 : 0
        if (this.model.curTabIndex == ForgeData.TabIndex.XL && this._cell.info.templateInfo.MasterType != GoodsType.EQUIP) {
            let str: string = LangManager.Instance.GetTranslation("cell.mediator.storebag.IntensifyBagCellDropMediator.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (this.model.curTabIndex == ForgeData.TabIndex.ZH) {
            if (this._cell.info.isLock) {
                let str = LangManager.Instance.GetTranslation("store.view.compose.ComposeMatetialView.sendComposeTip05");
                MessageTipManager.Instance.show(str);
                return
            }
        }
        let point: number = this.isResolePoint;
        if (point == -1 || point == -2) {
            Logger.xjy("位置已满 -- 装备类型不符 -- 装备已镶嵌宝石, 需拆除后才能分解")
            return;
        } else if (this.model.curTabIndex == ForgeData.TabIndex.QH) {
            PlayerManager.Instance.moveBagToBag(this._cell.info.bagType, this._cell.info.objectId, this._cell.info.pos, BagType.Hide, 0, to_pos, 1);
        } else {
            // if (this.model.curTabIndex == ForgeData.TabIndex.FJ && this._cell.info.strengthenGrade > 0 && this.showResolveAlert()) return;
            PlayerManager.Instance.moveBagToBag(this._cell.info.bagType, this._cell.info.objectId, this._cell.info.pos, BagType.Hide, 0, point, 1);
        }
    }

    private showResolveAlert(): boolean {
        let preDate: Date = new Date(SharedManager.Instance.resolveStrengthenCheckDate);
        let now: Date = new Date();
        let outdate: boolean = false;
        let check: boolean = SharedManager.Instance.resolveStrengthen;
        if (!check || (preDate.getMonth() <= now.getMonth() && preDate.getDate() < now.getDate()))
            outdate = true;
        if (outdate) {
            let content: string = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.resolveStrengthenAlert");
            let checkTxt: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, this.startResolveAlertBack.bind(this));
        }
        return outdate;
    }

    private startResolveAlertBack(b:boolean, check: boolean) {
        if (!this._cell || !this._cell.info ||!b) return;
        SharedManager.Instance.resolveStrengthen = check;
        SharedManager.Instance.resolveStrengthenCheckDate = new Date();
        SharedManager.Instance.saveResolveStrengthenTipCheck();
        PlayerManager.Instance.moveBagToBag(this._cell.info.bagType, this._cell.info.objectId, this._cell.info.pos, BagType.Hide, 0, this.isResolePoint, 1);
    }

    private get isResolePoint(): number {
        let str:string
        // if (this.model.curTabIndex == ForgeData.TabIndex.FJ && this._cell.info.templateInfo.MasterType == GoodsType.EQUIP) {
        //     if (this._cell.info.existJewel()) {
        //         str = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command01");
        //         MessageTipManager.Instance.show(str);
        //         return -1;
        //     }
        //     for (let i: number = 0; i < ForgeData.FJEquipNum; i++) {
        //         let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(i);
        //         if (info == null) {
        //             return i;
        //         }
        //     }
        //     str = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command02");
        //     MessageTipManager.Instance.show(str);
        //     return -1;

        // }
        // else if (this.model.curTabIndex == ForgeData.TabIndex.FJ && this._cell.info.templateInfo.MasterType != GoodsType.EQUIP) {
        //     str = LangManager.Instance.GetTranslation("cell.mediator.storebag.IntensifyBagCellDropMediator.command01");
        //     MessageTipManager.Instance.show(str);
        //     return -2;
        // }
        return 0;
    }
    private get canDoubleClick(): boolean {
        if (!this._cell.info) return false;
        if (this.model.curTabIndex == ForgeData.TabIndex.HC) return false;
        if (this.model.curTabIndex == ForgeData.TabIndex.XQ) {
            if (this._cell.info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_PORP) return false;
        }
        if (this.model.curTabIndex == ForgeData.TabIndex.QH && this.model.isIntensifing) return false;
        return true;
    }

    private get isMountJewel(): boolean {
        if (this.model.curTabIndex == ForgeData.TabIndex.XQ && this._cell.info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT) {
            let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(0);
            if (info) {
                let emptyPos: number[] = [];
                for (let i: number = 1; i <= ForgeData.XQJewelNum; i++) {
                    if (info["join" + i] > 0) {
                        let temp:t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, Number(info["join" + i]))
                        if (temp.Property1 == this._cell.info.templateInfo.Property1) {
                            let str: string = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command03");
                            MessageTipManager.Instance.show(str);
                            emptyPos = null;
                            return true;
                        }
                    }
                    else if (info["join" + i] == 0) {
                        emptyPos.push(i);
                    }
                }
                if (emptyPos.length <= 0) {
                    let str = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command04")
                    MessageTipManager.Instance.show(str);
                    emptyPos = null;
                    return true;
                }
                else {
                    this.storeControler.sendItemMount(emptyPos[0], this._cell.info.pos, this._cell.info.bagType);
                }
                emptyPos = null;
            }
            return true;
        }
        return false;
    }
}