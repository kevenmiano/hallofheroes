// @ts-nocheck
import Logger from "../../../core/logger/Logger";
import ResMgr from "../../../core/res/ResMgr";
import { Sequence } from "../../../core/task/Sequence";
import { EmPackName } from "../../constant/UIDefine";
import { BattleEvent } from "../../constant/event/NotificationEvent";
import { BattleResPreloadManager } from "../../manager/BattleResPreloadManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { BattleModel } from "../BattleModel";
import { RoleUnit } from "../view/RoleUnit";

/*
 * @Author: jeremy.xu
 * @Date: 2024-04-30 14:53:14
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-30 14:53:54
 * @DemandLink: 
 * @Description: 
 */

// 加载FUI
export class BattleLoadFUITask extends Sequence {
    private emPack: EmPackName;
    constructor(emPack: EmPackName) {
        super();
        this.emPack = emPack;
    }

    protected onExecute() {
        super.onExecute();
        ResMgr.Instance.loadFairyGui(this.emPack, () => {
            if (this.emPack == EmPackName.BattleDynamic) {
                BattleModel.battleDynamicLoaded = true;
                NotificationManager.Instance.dispatchEvent(BattleEvent.BATTLE_DYNAMIC_UI_LOADED);
            } else if (this.emPack == EmPackName.BattleBgAni) {
                BattleModel.battleBgAniLoaded = true;
                NotificationManager.Instance.dispatchEvent(BattleEvent.BATTLE_BGANI_LOADED);
            }
            Logger.battle("加载战斗动态FUI资源完成", this.emPack);
            this.endAction(true);
        });
    }
}

// 加载loadItem
export class BattleLoadItemTask extends Sequence {
    private item: Laya.loadItem;
    constructor(item) {
        super();
        this.item = item;
    }

    protected onExecute() {
        super.onExecute();
        let asset = ResMgr.Instance.getRes(this.item.url)
        if (asset && asset.meta && asset.meta.prefix) {
            BattleResPreloadManager.cachePublicSkillAni((asset.meta.prefix).toLocaleLowerCase())
            BattleResPreloadManager.cacheResistSheldAni((asset.meta.prefix).toLocaleLowerCase())
        }
        this.endAction(true);
    }
}

// 加载形象
export class BattleLoadFigureTask extends Sequence {
    private item: Laya.loadItem;
    constructor(item) {
        super();
        this.item = item;
    }

    protected onExecute() {
        super.onExecute();
        ResMgr.Instance.loadResItem(this.item, (res) => {
            NotificationManager.Instance.dispatchEvent(RoleUnit.LOAD_BATTLERES_COMPLETE, { url: this.item.url, res: res });
            this.endAction(true);
        });
    }
}