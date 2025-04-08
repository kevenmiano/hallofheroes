/*
 * @Author: jeremy.xu
 * @Date: 2022-03-28 18:12:40
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-11-03 14:47:51
 * @Description: 
 */
import FUI_BattleBufRoleItem from '../../../../../../fui/Battle/FUI_BattleBufRoleItem';
import { BufferDamageData } from '../../../../battle/data/BufferDamageData';
import { BaseRoleInfo } from '../../../../battle/data/objects/BaseRoleInfo';
import { BattleEvent, RoleEvent } from '../../../../constant/event/NotificationEvent';
import { UIFilter } from '../../../../../core/ui/UIFilter';
import { NotificationManager } from '../../../../manager/NotificationManager';
import LangManager from '../../../../../core/lang/LangManager';

export class BattleBufRoleItem extends FUI_BattleBufRoleItem {
    private _info: BaseRoleInfo;

    get info(): BaseRoleInfo {
        return this._info;
    }

    set info(value: BaseRoleInfo) {
        this.delEvent();
        this._info = value;
        if (value) {
            this.addEvent();
            let level = LangManager.Instance.GetTranslation("public.level2", value.level);
            this.txtNameR.text = value.roleName;
            this.txtNameL.text = value.roleName;
            this.txtLevelR.text = level;
            this.txtLevelL.text = level;
            this.icon = value.icon;
            this.filters = [];
            this.__hpChange(value.bloodA, value.totalBloodA);
        }
    }

    private addEvent() {
        this._info.on(RoleEvent.IS_LIVING, this.__living, this);
        this._info.on(RoleEvent.HP, this.__hpChange, this);
        this._info.on(RoleEvent.REFRESH_BUFFER, this.__refreshBuff, this);
    }

    private delEvent() {
        if (this._info) {
            this._info.off(RoleEvent.IS_LIVING, this.__living, this);
            this._info.off(RoleEvent.HP, this.__hpChange, this);
            this._info.off(RoleEvent.REFRESH_BUFFER, this.__refreshBuff, this);
        }
    }

    private __living(value: boolean) {
        this.filters = value ? [] : [UIFilter.grayFilter];
    }

    private __hpChange(blood: number, totalBlood: number) {
        this.imgProgL.fillAmount = blood / totalBlood
        this.imgProgR.fillAmount = blood / totalBlood
    }

    private __refreshBuff(buffers: BufferDamageData[]) {
        NotificationManager.Instance.dispatchEvent(BattleEvent.ROLE_BUFF_CHANGE, this._info.livingId);
    }

    dispose() {
        this.delEvent();
        super.dispose();
    }
}