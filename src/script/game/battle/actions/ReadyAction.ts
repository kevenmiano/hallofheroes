// @ts-nocheck
import { ActionLabesType } from '../../constant/BattleDefine';
import { GameBaseAction } from './GameBaseAction';

/**
 * description : 准备动作.
 * 当使用技能时,英雄先作准备动作,直到开始施放技能.
 **/
export class ReadyAction extends GameBaseAction {
    public static READY: string = "Ready";

    private _roleInfo: any;
	/**
	*role BaseRoleInfo
	**/
    public constructor(roleInfo) {
        super(false);
        this.type = ReadyAction.READY;
        this._roleInfo = roleInfo;
        this._roleInfo.addAction(this);
    }

    public prepare() {
        this._roleInfo.action(ActionLabesType.READY);
    }

}