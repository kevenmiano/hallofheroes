// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-23 20:00
 * @description   战斗action基类
 **/

import { InheritIActionType } from "../../constant/BattleDefine";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { BaseAction } from "./common/BaseAction";

export class GameBaseAction extends BaseAction {
    public inheritType: InheritIActionType = InheritIActionType.GameBaseAction

    protected _liftTime: number = 0;
    //施法者
    protected _currentRole: any;
    protected _moveScene: boolean = false;

    public constructor($moveScene: boolean = false) {
        super()
        this._moveScene = false;
    }

    public addAct() {
        if (this._currentRole) {
            this._currentRole.addAction(this);
        }
    }

    // override
    public ready($liftTime: number = 0): boolean {
        return (this._liftTime > $liftTime ? false : true);
    }

    /**
     * 执行结束
     *
     */
    protected actionOver() {

    }

    protected get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public get liftTime(): number {
        return this._liftTime;
    }

    public set liftTime(value: number) {
        this._liftTime = value;
    }
}