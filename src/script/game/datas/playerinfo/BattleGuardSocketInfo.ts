import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { ConfigType } from "../../constant/ConfigDefine";
import ConfigMgr from "../../../core/config/ConfigMgr";
import GoodsSonType from "../../constant/GoodsSonType";

/**
 * 战斗守护插槽
 */
export class BattleGuardSocketInfo extends GameEventDispatcher {
    public static CLOSE: number = 0;
    public static OPEN: number = 1;

    private _itemList: number[];
    private _state: number = 0;

    private _pos: number = 0;
    public length: number = 0;
    public type: number = 1;

    /**
     *
     * @param pos 位置
     * @param length 插槽的数量
     *
     */
    constructor(pos: number, length: number = 3) {
        super();

        this._pos = pos;
        this.length = length;
        this._itemList = [];
        for (let i: number = 0; i < length; i++) {
            this._itemList[i] = null;
        }
    }

    /**
     *
     * @param tempId 物品模板id
     * @param pos 从0开始
     *
     */
    public addItem(temp: number, pos: number) {
        this._itemList[pos] = temp;
    }

    public getTempByPos(pos: number): t_s_itemtemplateData {
        let tid: number = this._itemList[pos];
        if (tid > 0) {
            return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tid);
        }
        return null;
    }

    public removeItem(temp: number) {
        let index: number = this._itemList.indexOf(temp);
        if (index >= 0) {
            this._itemList[index] = null;
        }
    }

    /**
     * 插槽的状态 : 0 关闭,  1 可以开启未开启,  2 已开启
     */
    public get state(): number {
        return this._state;
    }

    /**
     * @private
     */
    public set state(value: number) {
        this._state = value;
    }

    public get pos(): number {
        return this._pos;
    }

    public commit() {
        this.dispatchEvent(Laya.Event.CHANGE, this);
    }

    public get itemList(): number[] {
        return this._itemList;
    }

    public existSameGoods(tempId: number, pos: number): boolean {
        let t: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tempId.toString());

        for (let i: number = 0; i < this._itemList.length; i++) {
            let tid: number = this._itemList[i];
            if (tid <= 0) {
                continue;
            }
            let info: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tid.toString());
            if (info && t && info.Property1 == t.Property1 && pos != i) {
                return true;
            }
        }
        return false;
    }

    public existGoods(tempId: number): boolean {
        let result = false;
        let t: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tempId.toString());
        if (this.type == 1 && t.SonType == GoodsSonType.RESIST_GEM) {//允许镶嵌相同意志水晶
            result = false;
            return result;
        } else {
            for (let i: number = 0; i < this._itemList.length; i++) {
                let tid: number = this._itemList[i];
                if (tid <= 0) {
                    continue;
                }
                let info: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tid.toString());
                if (info && t && info.Property1 == t.Property1) {
                    result = true;
                }
            }
        }
        return result;
    }

}